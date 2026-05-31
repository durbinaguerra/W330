import Alert from "./Alert.js";
import { renderProductListing } from "./product-listing.js";
import { initCartBadge, loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();
  await renderProductListing("tents");

  const alert = new Alert();
  await alert.init();
}

init();
