import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img
          src="${product.Images.PrimaryMedium}"
          alt="${product.Name}"
        />
        <h3>${product.Brand.Name}</h3>
        <h2>${product.NameWithoutBrand}</h2>
        <p class="product-card__price">
          $${product.FinalPrice}
        </p>
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

    if (this.category) {
      list = await this.dataSource.getData(
        this.category
      );
    } else {
      const search =
        new URLSearchParams(
          window.location.search
        ).get("search");

      list =
        await this.dataSource.searchProducts(
          search
        );
    }

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
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true
    );
  }
}
