const baseURL =
  import.meta.env?.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

function getUrl(path) {
  return new URL(path, baseURL).toString();
}

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status}`);
  }
}

export default class ProductData {
  constructor() { }

  async getData(category) {
    const response = await fetch(
      getUrl(`products/search/${encodeURIComponent(category)}`)
    );
    const data = await convertToJson(response);
    return data.Result || [];
  }

  async findProductById(id) {
    const response = await fetch(
      getUrl(`product/${encodeURIComponent(id)}`)
    );
    const data = await convertToJson(response);
    return data.Result;
  }

  async searchProducts(query) {
    const response = await fetch(
      getUrl(`products/search/${encodeURIComponent(query)}`)
    );

    const data = await convertToJson(response);

    return data.Result || [];
  }
}
