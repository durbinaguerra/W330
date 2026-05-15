// ProductList.mjs
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img 
        src="${product.Image}" 
        alt="Image of ${product.Name}"
      >
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
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