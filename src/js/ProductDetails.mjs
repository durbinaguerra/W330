import { getLocalStorage, initCartBadge, qs, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.productContainer = qs(".product-detail");
  }

  async init() {
    this.productId = this.productId || qs("#addToCart")?.dataset.id;

    if (!this.productId || !this.productContainer) return;

    // The product details are needed before the HTML can be rendered.
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      this.productContainer.innerHTML = "<p>Product not found.</p>";
      return;
    }

    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
    initCartBadge();
  }

  renderProductDetails() {
    const color = this.product.Colors[0]?.ColorName || "";
    const price = this.product.FinalPrice || this.product.ListPrice;
    const retailPrice = this.product.SuggestedRetailPrice;
    const isDiscounted = price < retailPrice;
    const discountPercent = Math.round(
      ((retailPrice - price) / retailPrice) * 100     
    );

    this.productContainer.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${this.product.Images.PrimaryLarge}"
        alt="${this.product.NameWithoutBrand}"
      />
      ${isDiscounted
        ? `<p class="discount-badge">-${discountPercent}% OFF</p>`
        : ""}

      <p class="product-card__price">$${price.toFixed(2)}</p>  
      ${isDiscounted 
        ? `<p class="original-price">$${retailPrice.toFixed(2)}</p>` 
        : ""}    
      <p class="product__color">${color}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;

    document.title = `Sleep Outside | ${this.product.Name}`;
  }
}
