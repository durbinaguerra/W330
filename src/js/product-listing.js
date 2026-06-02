import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const category = getParam("category");
  const dataSource = new ProductData();
  const listElement = document.querySelector(".product-list");
  const myList = new ProductList(category, dataSource, listElement);

  myList.init();
}

init();
