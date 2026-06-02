function getApiBase() {
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
  return apiUrl ? `${apiUrl}/api` : "/api";
}

async function request(path, options = {}) {
  const response = await fetch(`${getApiBase()}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

export function getCategories() {
  return request("/products/categories");
}

export function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/products${query ? `?${query}` : ""}`);
}

export function getProduct(id) {
  return request(`/products/${id}`);
}

export function createOrder(payload) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
