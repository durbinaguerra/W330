// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("localstoragechange", {
        detail: { key },
      }),
    );
  }
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}
{
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map((item) => templateFn(item));
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getCartItemCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  return cartItems.length;
}

export function renderCartBadge() {
  const cartLink = qs(".cart a");

  if (!cartLink) return;

  const itemCount = getCartItemCount();
  let cartBadge = qs(".cart__count", cartLink);

  if (itemCount === 0) {
    cartBadge?.remove();
    cartLink.setAttribute("aria-label", "Shopping cart");
    return;
  }

  if (!cartBadge) {
    cartLink.insertAdjacentHTML(
      "beforeend",
      '<span class="cart__count" aria-hidden="true"></span>',
    );
    cartBadge = qs(".cart__count", cartLink);
  }

  cartBadge.textContent = itemCount;
  cartLink.setAttribute(
    "aria-label",
    `Shopping cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`,
  );
}

let cartBadgeInitialized = false;

export function initCartBadge() {
  renderCartBadge();

  if (cartBadgeInitialized || typeof window === "undefined") return;

  window.addEventListener("storage", (event) => {
    if (event.key === "so-cart") {
      renderCartBadge();
    }
  });

  window.addEventListener("localstoragechange", (event) => {
    if (event.detail?.key === "so-cart") {
      renderCartBadge();
    }
  });

  cartBadgeInitialized = true;
}
