import { getParam, loadHeaderFooter } from "./utils.mjs";
<<<<<<< HEAD
<<<<<<< HEAD
import { initRegistrationPrompt } from "./RegistrationPrompt.js";
=======
>>>>>>> 0b7b95573d0faa73c51ce29f04d99aaeaaece891
=======
import { initRegistrationPrompt } from "./RegistrationPrompt.js";
>>>>>>> b8952f0aee4b4e6d33513ffde23a9adf32c868a1

import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();
initRegistrationPrompt();

const productId = getParam("product");

const dataSource = new ProductData();

const product = new ProductDetails(productId, dataSource);

product.init();
