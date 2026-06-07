import { getParam, loadHeaderFooter } from "./utils.mjs";
<<<<<<< HEAD
import { initRegistrationPrompt } from "./RegistrationPrompt.js";
=======
>>>>>>> 0b7b95573d0faa73c51ce29f04d99aaeaaece891

import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();
initRegistrationPrompt();

const productId = getParam("product");

const dataSource = new ProductData();

const product = new ProductDetails(productId, dataSource);

product.init();
