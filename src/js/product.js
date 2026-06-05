import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // get existing cart from local storage or initialize empty array
  let cart = JSON.parse(localStorage.getItem("so-cart")) || [];

<<<<<<< HEAD
  // add new product
  cart.push(product);
  
  // save updated cart
  localStorage.setItem("so-cart", JSON.stringify(cart));

=======
  // add new products to the cart for each time a user clicks the add to cart button.
  cart.push(product);

  // save updated cart
  setLocalStorage("so-cart", cart);
>>>>>>> 86ccaf86bd515eb3def91fcb65a539f3cbf41bdc
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
