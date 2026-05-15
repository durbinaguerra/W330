// ProductList.mjs
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=">
      <img src="" alt="Image of ">
      <h2 class="card__brand"></h2>
      <h3 class="card__name"></h3>
      <p class="product-card__price">$</p>
    </a>
  </li>`
}


export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  renderList(products) {
    const htmlStrings = products.map(productCardTemplate);

    this.listElement.innerHTML = htmlStrings.join("");
  }
}