import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const id = product.Id;
  const name = product.NameWithoutBrand;
  const fullName = product.Name;
  const brand = product.Brand.Name;
  const image =
    product.Images?.PrimaryMedium ||
    product.Images?.PrimaryLarge ||
    product.Image;
  const category = product.category || "tents";

  const price = product.FinalPrice || product.ListPrice;
  const retailPrice = product.SuggestedRetailPrice;

  const isDiscounted = price < retailPrice;

  const discountPercent = Math.round(
    ((retailPrice - price) / retailPrice) * 100     
  );

  return `
    <li class="product-card">
      <a href="/product_pages/index.html?category=${category}&product=${id}">
        <img src="${image}" alt="${fullName}" />

        ${isDiscounted 
          ? `<p class="discount-badge">-${discountPercent}% OFF</p>` 
          : ""}

        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">$${price.toFixed(2)}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    if (!list.length) {
      this.listElement.innerHTML =
        "<li class='product-list__empty'>No products found.</li>";
      return;
    }

    const categorizedList = list.map((product) => ({
      ...product,
      category: this.category,
    }));

    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      categorizedList,
      "afterbegin",
      true
    );
  }
}
