import ShoppingCart from "./ShoppingCart.mjs";
import { initCartBadge, loadHeaderFooter, qs } from "./utils.mjs";
import { initRegistrationPrompt } from "./RegistrationPrompt.js";

async function init() {
  await loadHeaderFooter();
  initRegistrationPrompt();

  const cartList = qs(".product-list");
  const shoppingCart = new ShoppingCart(cartList);

  initCartBadge();
  shoppingCart.init();
}

init();
