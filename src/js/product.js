import { getParam, initCartBadge, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

async function init() {
  await loadHeaderFooter();

  const productId = getParam("product");
  const dataSource = new ProductData();
  const product = new ProductDetails(productId, dataSource);

  initCartBadge();
  product.init();
}

init();
