import Alert from "./Alert.js";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, initCartBadge, loadHeaderFooter } from "./utils.mjs";

const categoryLabels = {
  tents: "Tents",
  backpacks: "Backpacks",
  "sleeping-bags": "Sleeping Bags",
  hammocks: "Hammocks",
};

export async function renderProductListing(category = "tents") {
  const listElement = document.querySelector(".product-list");

  if (!listElement) return;

  const dataSource = new ExternalServices();
  const productList = new ProductList(category, dataSource, listElement);
  await productList.init();
}

function updateCategoryPageContent(category) {
  const label = categoryLabels[category] || "Products";
  const heading = document.querySelector(".products h2");
  const pageTitle = `Top Products: ${label}`;

  if (heading) {
    heading.textContent = pageTitle;
  }

  document.title = `Sleep Outside | ${pageTitle}`;
}

export async function initProductListingPage(defaultCategory = "tents") {
  const category = getParam("category") || defaultCategory;

  await loadHeaderFooter();
  initCartBadge();
  updateCategoryPageContent(category);
  await renderProductListing(category);

  const alert = new Alert();
  await alert.init();
}

const isDirectProductListingEntry = document.querySelector(
  "script[type='module'][src$='product-listing.js']"
);

if (isDirectProductListingEntry) {
  const category = getParam("category") || "tents";
  initProductListingPage(category);
}
