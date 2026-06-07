import CheckoutProcess from "./CheckoutProcess.mjs";
import { initCartBadge, loadHeaderFooter } from "./utils.mjs";
import { initRegistrationPrompt } from "./RegistrationPrompt.js";

async function init() {
  await loadHeaderFooter();
  initRegistrationPrompt();
  initCartBadge();

  const checkoutProcess = new CheckoutProcess();
  checkoutProcess.init();
}

init();
