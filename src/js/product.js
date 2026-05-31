import { getParam, initCartBadge, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

async function init() {
  await loadHeaderFooter();

  const productId = getParam("product");
  const dataSource = new ExternalServices();
  const product = new ProductDetails(productId, dataSource);

  initCartBadge();
  product.init();
}

init();
