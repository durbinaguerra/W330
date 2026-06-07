import {
  getProductPrice,
  getLocalStorage,
  initCartBadge,
  normalizeCartItems,
  setLocalStorage,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const TAX_RATE = 0.06;
const FIRST_ITEM_SHIPPING = 10;
const ADDITIONAL_ITEM_SHIPPING = 2;

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatExpirationValue(value) {
  if (!value) return "";

  const [year, month] = value.split("-");

  if (!year || !month) return value;

  return `${Number(month)}/${year.slice(-2)}`;
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key = "so-cart", outputSelector = ".order-summary") {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemCount = 0;
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.form = document.querySelector("#checkout-form");
    this.zipInput = document.querySelector("#zip");
    this.feedbackElement = document.querySelector(".checkout-feedback");
    this.submitButton = document.querySelector(".checkout-submit");
    this.emptyMessageElement = document.querySelector(".order-summary__empty");
    this.externalServices = new ExternalServices();
  }

  init() {
    if (!this.form) return;

    this.list = normalizeCartItems(getLocalStorage(this.key) || []);
    setLocalStorage(this.key, this.list);
    this.calculateItemSubTotal();

    if (this.zipInput) {
      this.zipInput.addEventListener(
        "input",
        this.handleZipCodeChange.bind(this),
      );
    }

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.form.addEventListener("input", this.clearFeedback.bind(this));
  }

  getCartItems() {
    const cartItems = normalizeCartItems(getLocalStorage(this.key) || []);
    setLocalStorage(this.key, cartItems);
    return cartItems;
  }

  calculateItemSubTotal() {
    this.list = this.getCartItems();
    this.itemTotal = this.list.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 1;
      return sum + getProductPrice(item) * quantity;
    }, 0);
    this.itemCount = this.list.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0,
    );

    const subtotal = document.querySelector(
      `${this.outputSelector} #subtotal`,
    );
    const subtotalLabel = document.querySelector(
      `${this.outputSelector} #subtotalLabel`,
    );

    if (subtotal) {
      subtotal.innerText = formatCurrency(this.itemTotal);
    }

    if (subtotalLabel) {
      const itemLabel = this.itemCount === 1 ? "item" : "items";
      subtotalLabel.innerText = `Subtotal (${this.itemCount} ${itemLabel})`;
    }

    if (this.emptyMessageElement) {
      this.emptyMessageElement.hidden = this.itemCount > 0;
    }

    if (this.submitButton) {
      this.submitButton.disabled = this.itemCount === 0;
    }
  }

  calculateOrderTotal() {
    if (!this.itemCount) {
      this.tax = 0;
      this.shipping = 0;
      this.orderTotal = 0;
      this.displayOrderTotals();
      return;
    }

    this.tax = this.itemTotal * TAX_RATE;
    this.shipping =
      FIRST_ITEM_SHIPPING +
      Math.max(this.itemCount - 1, 0) * ADDITIONAL_ITEM_SHIPPING;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #orderTotal`,
    );

    if (tax) {
      tax.innerText = formatCurrency(this.tax);
    }

    if (shipping) {
      shipping.innerText = formatCurrency(this.shipping);
    }

    if (orderTotal) {
      orderTotal.innerText = formatCurrency(this.orderTotal);
    }
  }

  handleZipCodeChange() {
    if (!this.zipInput?.value.trim()) {
      this.tax = 0;
      this.shipping = 0;
      this.orderTotal = 0;
      this.displayOrderTotals();
      return;
    }

    this.calculateOrderTotal();
  }

  clearFeedback() {
    if (this.feedbackElement) {
      this.feedbackElement.textContent = "";
    }
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: getProductPrice(item),
      quantity: Number(item.quantity) || 1,
    }));
  }

  async checkout(form) {
    const order = formDataToJSON(form);

    order.orderDate = new Date().toISOString();
    order.expiration = formatExpirationValue(order.expiration?.trim() || "");
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);
    order.items = this.packageItems(this.list);

    return this.externalServices.checkout(order);
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.form.reportValidity()) {
      if (this.feedbackElement) {
        this.feedbackElement.textContent =
          "Please complete all required fields before checking out.";
      }
      return;
    }

    this.calculateItemSubTotal();
    this.handleZipCodeChange();

    if (this.itemCount === 0) {
      if (this.feedbackElement) {
        this.feedbackElement.textContent =
          "Your cart is empty. Add an item before checking out.";
      }
      return;
    }

    try {
      if (this.feedbackElement) {
        this.feedbackElement.textContent = "Submitting your order...";
      }

      const response = await this.checkout(this.form);
      setLocalStorage(this.key, []);
      this.list = [];
      this.calculateItemSubTotal();
      this.displayOrderTotals();
      initCartBadge();

      if (this.feedbackElement) {
        this.feedbackElement.textContent = `Order submitted successfully. Response: ${JSON.stringify(response)}`;
      }
    } catch (error) {
      if (this.feedbackElement) {
        this.feedbackElement.textContent =
          error instanceof Error
            ? `Checkout failed: ${error.message}`
            : "Checkout failed. Please try again.";
      }
    }
  }
}
