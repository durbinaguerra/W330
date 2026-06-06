import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  addQuantityListeners();
  calculateCartTotal();
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>

<p class="cart-card__quantity">
  <button class="qty-btn" data-id="${item.Id}" data-change="-1">−</button>
  ${item.quantity || 1}
  <button class="qty-btn" data-id="${item.Id}" data-change="1">+</button>
</p>
    <p class="cart-card__price">
      $${(item.FinalPrice * quantity).toFixed(2)}
    </p>
  </li>`;
}

function updateQuantity(productId, change) {
  let cartItems = getLocalStorage("so-cart") || [];

  const item = cartItems.find((product) => product.Id === productId);

  if (!item) return;

  item.quantity = (item.quantity || 1) + change;

  if (item.quantity <= 0) {
    cartItems = cartItems.filter(
      (product) => product.Id !== productId
    );
  }

  localStorage.setItem("so-cart", JSON.stringify(cartItems));

  renderCartContents();
}

function addQuantityListeners() {
  const buttons = document.querySelectorAll(".qty-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      updateQuantity(
        button.dataset.id,
        Number(button.dataset.change)
      );
    });
  });
}

function calculateCartTotal() {
  const cartItems = getLocalStorage("so-cart") || [];

  const total = cartItems.reduce((sum, item) => {
    return sum + item.FinalPrice * (item.quantity || 1);
  }, 0);

  const totalElement = document.querySelector(".cart-total");
  const footerElement = document.querySelector(".cart-footer");

  if (cartItems.length > 0) {
    footerElement.classList.remove("hide");
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    footerElement.classList.add("hide");
  }
}


renderCartContents();