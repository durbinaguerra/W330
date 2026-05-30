import ShoppingCart from "./ShoppingCart.mjs";
import { initCartBadge, loadHeaderFooter, qs } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const cartList = qs(".product-list");
  const shoppingCart = new ShoppingCart(cartList);

  initCartBadge();
  shoppingCart.init();
}

init();
