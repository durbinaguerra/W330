export default class Alert {
  constructor() {
    this.path = "/json/alerts.json";
  }

  async getAlerts() {
    const response = await fetch(this.path);
    return await response.json();
  }

  async init() {
    const alerts = await this.getAlerts();

    if (!alerts.length) return;

    const alertSection = document.createElement("section");
    alertSection.classList.add("alert-list");

    alerts.forEach((alert) => {
      const p = document.createElement("p");

      p.textContent = alert.message;
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;

      alertSection.appendChild(p);
    });

    const main = document.querySelector("main");

    if (main) {
      main.prepend(alertSection);
    }
  }
}
