import {
  formatCurrency,
  getProductDiscountPercent,
  getProductImage,
  getProductPrice,
  getProductRetailPrice,
  renderListWithTemplate,
} from "./utils.mjs";

function productCardTemplate(product) {
  const image = getProductImage(product);
  const price = getProductPrice(product);
  const retailPrice = getProductRetailPrice(product);
  const discountPercent = getProductDiscountPercent(product);
  const brand = product.Brand?.Name || "";

  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img
          src="${image}"
          alt="${product.Name}"
        />
        ${discountPercent
          ? `<p class="discount-badge">-${discountPercent}% OFF</p>`
          : ""}
        <h3>${brand}</h3>
        <h2>${product.NameWithoutBrand}</h2>
        <p class="product-card__price">
          ${formatCurrency(price)}
        </p>
        ${discountPercent
          ? `<p class="original-price">${formatCurrency(retailPrice)}</p>`
          : ""}
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
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderWithTemplate(productCardTemplate, this.listElement, list);

  }

}
    let list;

    try {
      if (this.category) {
        list = await this.dataSource.getData(
          this.category
        );
      } else {
        const search =
          new URLSearchParams(
            window.location.search
          ).get("search");

        list = search
          ? await this.dataSource.searchProducts(
              search
            )
          : [];
      }
    } catch (error) {
      this.renderError();
      return;
    }

    this.products = list;
    this.renderList(list);

    const title =
      document.querySelector(
        "#category-title"
      );

    if (title) {
      if (this.category) {
        title.textContent =
          `Top Products: ${this.category}`;
      } else {
        const search =
          new URLSearchParams(
            window.location.search
          ).get("search");

        title.textContent =
          `Search Results: ${search}`;
      }
    }

    const sortSelect =
      document.querySelector("#sortProducts");

      if (sortSelect) {
        sortSelect.addEventListener(
          "change",
          this.sortProducts.bind(this)
        );
      }
  }

  renderList(list) {
    if (!list?.length) {
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

  renderError() {
    if (!this.listElement) return;

    this.listElement.innerHTML =
      "<li class='product-list__empty'>Products could not be loaded. Please try again later.</li>";
  }

  sortProducts(event) {
    const sortBy = event.target.value;
    let sortedProducts = [...this.products];

    if (sortBy === "name") {
      sortedProducts.sort((a, b) =>
        (a.NameWithoutBrand || a.Name || "").localeCompare(
          b.NameWithoutBrand || b.Name || ""
        )
      );
    }

    if (sortBy === "price") {
      sortedProducts.sort(
        (a, b) =>
          getProductPrice(a) - getProductPrice(b)
      );
    }

    if (sortBy === "default") {
      sortedProducts = [...this.products];
    }

    this.renderList(sortedProducts);
  }
}
