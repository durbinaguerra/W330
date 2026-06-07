import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { initRegistrationPrompt } from "./RegistrationPrompt.js";

loadHeaderFooter();
initRegistrationPrompt();

const category = getParam("category");

const search = getParam("search");
if (search) {
  document.querySelector("#category-title").textContent =
    `Search Results: ${search}`;
} else if (category) {
  document.querySelector("#category-title").textContent =
    `Top Products: ${category}`;
}

const dataSource = new ProductData();

const listElement = document.querySelector(".product-list");

const myList = new ProductList(category, dataSource, listElement);

myList.init();
