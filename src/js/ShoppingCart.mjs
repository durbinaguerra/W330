import {
  getLocalStorage,
  initCartBadge,
  renderListWithTemplate,
  setLocalStorage,
} from "./utils.mjs";

function cartItemTemplate(item) {
  const color = item.Colors?.[0]?.ColorName || "N/A";
  const image =
    item.Images?.PrimarySmall ||
    item.Images?.PrimaryMedium ||
    item.Image;
  const price = item.FinalPrice || item.ListPrice || 0;

  return `<li class="cart-card divider">
  <button
    class="cart-card__remove"
    type="button"
    data-index="${item.index}"
    data-id="${item.Id}"
    aria-label="Remove ${item.Name} from cart"
  >
    &times;
  </button>
  <a href="#" class="cart-card__image">
    <img src="${image}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${color}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${price.toFixed(2)}</p>
</li>`;
}

function emptyCartTemplate() {
  return "<li class='cart-empty'>Your cart is empty.</li>";
}

export default class ShoppingCart {
  constructor(listElement, cartKey = "so-cart") {
    this.listElement = listElement;
    this.cartKey = cartKey;
  }

  init() {
    if (!this.listElement) return;

    this.listElement.addEventListener("click", this.handleRemoveFromCart.bind(this));
    this.renderCartContents();
  }

  getCartItems() {
    return getLocalStorage(this.cartKey) || [];
  }

  renderCartContents() {
    const cartItems = this.getCartItems();

    if (cartItems.length === 0) {
      this.listElement.innerHTML = emptyCartTemplate();
      return;
    }

    const itemsWithIndex = cartItems.map((item, index) => ({
      ...item,
      index,
    }));

    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      itemsWithIndex,
      "afterbegin",
      true,
    );
  }

  removeItem(index) {
    const cartItems = this.getCartItems();

    cartItems.splice(index, 1);
    setLocalStorage(this.cartKey, cartItems);
    this.renderCartContents();
    initCartBadge();
  }

  handleRemoveFromCart(event) {
    const removeButton = event.target.closest(".cart-card__remove");

    if (!removeButton) return;

    const itemIndex = Number(removeButton.dataset.index);

    if (Number.isNaN(itemIndex)) return;

    this.removeItem(itemIndex);
  }
}
