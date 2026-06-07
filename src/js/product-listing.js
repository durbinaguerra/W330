import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
<<<<<<< HEAD
<<<<<<< HEAD
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { initRegistrationPrompt } from "./RegistrationPrompt.js";

loadHeaderFooter();
initRegistrationPrompt();
=======
=======
>>>>>>> b8952f0aee4b4e6d33513ffde23a9adf32c868a1
import { getParam, loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();
<<<<<<< HEAD
>>>>>>> 0b7b95573d0faa73c51ce29f04d99aaeaaece891
=======
>>>>>>> b8952f0aee4b4e6d33513ffde23a9adf32c868a1

  const category = getParam("category");
  const dataSource = new ProductData();
  const listElement = document.querySelector(".product-list");
  const myList = new ProductList(category, dataSource, listElement);

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> b8952f0aee4b4e6d33513ffde23a9adf32c868a1
  myList.init();
}

init();
<<<<<<< HEAD
>>>>>>> 0b7b95573d0faa73c51ce29f04d99aaeaaece891
=======
>>>>>>> b8952f0aee4b4e6d33513ffde23a9adf32c868a1
