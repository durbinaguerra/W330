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
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.products = [];
  }

  async init() {
    this.products = await this.dataSource.getData();
    console.log(this.products); // check if data loaded
    this.render();
  }

  render() {
    console.log("Rendering products...");
    console.table(this.products);
  }
}