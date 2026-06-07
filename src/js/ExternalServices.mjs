const baseURL =
  import.meta.env?.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

function getUrl(path) {
  return new URL(path, baseURL).toString();
}

async function convertToJson(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJsonResponse = contentType.includes("application/json");
  const payload = isJsonResponse ? await res.json() : await res.text();

  if (res.ok) {
<<<<<<< HEAD
    return payload;
=======
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status}`);
>>>>>>> 0b7b95573d0faa73c51ce29f04d99aaeaaece891
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
    const response = await fetch(
      getUrl(`products/search/${encodeURIComponent(category)}`)
    );
    const data = await convertToJson(response);
    return data.Result || [];
  }

  async findProductById(id) {
    const response = await fetch(getUrl(`product/${encodeURIComponent(id)}`));
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

    const response = await fetch(getUrl("checkout/"), options);
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
