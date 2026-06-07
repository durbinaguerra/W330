import { getParam, loadHeaderFooter } from "./utils.mjs";
import { initRegistrationPrompt } from "./RegistrationPrompt.js";

import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();
initRegistrationPrompt();

const productId = getParam("product");

const dataSource = new ProductData();

const product = new ProductDetails(productId, dataSource);

product.init();
