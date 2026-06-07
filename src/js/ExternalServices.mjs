const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJsonResponse = contentType.includes("application/json");
  const payload = isJsonResponse ? await res.json() : await res.text();

  if (res.ok) {
    return payload;
  }

  const message =
    payload?.message ||
    payload?.error ||
    (typeof payload === "string" && payload) ||
    "Bad Response";

  throw new Error(message);
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${baseURL}checkout/`, options);
    return convertToJson(response);
  }

  async createUser(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${baseURL}users`, options);
    return convertToJson(response);
  }
}
