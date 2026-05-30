import { initCartBadge, loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();
}

init();
