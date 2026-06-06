import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.js";

loadHeaderFooter();

const alert = new Alert();
alert.init();

const form = document.querySelector("#newsletter-form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email =
      document.querySelector("#newsletter-email").value;

    localStorage.setItem(
      "newsletter-email",
      email
    );

    document.querySelector(
      "#newsletter-message"
    ).textContent =
      "Thank you for subscribing!";

    form.reset();
  });
}
