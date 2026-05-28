import {
  getLocalStorage,
  initCartBadge,
  qs,
  setLocalStorage,
} from "./utils.mjs";

const cartList = qs(".product-list");

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  if (!cartList) return;

  if (cartItems.length === 0) {
    cartList.innerHTML = "<li class='cart-empty'>Your cart is empty.</li>";
    return;
  }

  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index),
  );
  cartList.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item, index) {
  const newItem = `<li class="cart-card divider">
  <button
    class="cart-card__remove"
    type="button"
    data-index="${index}"
    data-id="${item.Id}"
    aria-label="Remove ${item.Name} from cart"
  >
    &times;
  </button>
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
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function removeItemFromCart(index) {
  const cartItems = getLocalStorage("so-cart") || [];

  cartItems.splice(index, 1);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  initCartBadge();
}

function handleRemoveFromCart(event) {
  const removeButton = event.target.closest(".cart-card__remove");

  if (!removeButton) return;

  const itemIndex = Number(removeButton.dataset.index);

  if (Number.isNaN(itemIndex)) return;

  removeItemFromCart(itemIndex);
}

initCartBadge();
cartList?.addEventListener("click", handleRemoveFromCart);
renderCartContents();
