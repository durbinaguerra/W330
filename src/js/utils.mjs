// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}


export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {

  if (clear) {
    parentElement.innerHTML = "";
  }

  
  const htmlStrings = list.map(templateFn);

  // Insert all HTML into the page
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(
  template,
  parentElement,
  data,
  callback
 
) { parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    const headerTemplate = await loadTemplate("/partials/header.html");
    renderWithTemplate(headerTemplate, headerElement);
  }

  if (footerElement) {
    const footerTemplate = await loadTemplate("/partials/footer.html");
    renderWithTemplate(footerTemplate, footerElement);
  }
}

// get a parameter from the URL
export function getParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

// update cart badge count
export function initCartBadge() {
  const cart = getLocalStorage("so-cart") || [];
  const cartLink = qs(".cart a");

  if (!cartLink) return;

  let badge = cartLink.querySelector(".cart-count, .cart__count");

  if (!badge) {
    badge = document.createElement("sup");
    badge.className = "cart-count";
    badge.setAttribute("aria-live", "polite");
    badge.setAttribute("aria-atomic", "true");
    cartLink.appendChild(badge);
  }

  badge.classList.add("cart-count");
  badge.textContent = cart.length;
  badge.hidden = cart.length === 0;
}
