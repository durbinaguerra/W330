import CheckoutProcess from "./CheckoutProcess.mjs";
import { initCartBadge, loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();

  const checkoutProcess = new CheckoutProcess();
  checkoutProcess.init();
}

init();
