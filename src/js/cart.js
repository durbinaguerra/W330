import { getLocalStorage } from "./utils.mjs";
import { getLocalStorage } from "./utils.mjs";


function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
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

// added for Cart Total DU

const cartItems = getLocalStorage("so-cart") || [];

const cartFooter = document.querySelector(".cart-footer");
const cartTotalElement = document.querySelector(".cart-total");

function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item.FinalPrice;
  }, 0);
}

if (cartItems.length > 0) {
  const total = calculateTotal(cartItems);

  cartFooter.classList.remove("hide");

  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}


renderCartContents();

