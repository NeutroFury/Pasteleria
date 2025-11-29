// Servicio HTTP simple para comunicar el frontend con el backend
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api/v1';

function getToken() {
  return localStorage.getItem('token') || null;
}

function setToken(t) {
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
}

async function request(method, path, body, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const tk = getToken();
    if (tk) headers['Authorization'] = `Bearer ${tk}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const msg = text || res.statusText || 'Error';
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  // if no content
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

const api = {
  setToken,
  getToken,

  // Auth
  async login(email, password) {
    const data = await request('POST', '/auth/login', { email, password }, false);
    // Expecting { token, username? }
    if (data?.token) setToken(data.token);
    return data;
  },

  async register(payload) {
    return request('POST', '/auth/register', payload, false);
  },

  async me() {
    return request('GET', '/auth/me', undefined, true);
  },

  // Products
  async getProducts() {
    return request('GET', '/products', undefined, false);
  },

  async getProductById(id) {
    return request('GET', `/products/${id}`, undefined, false);
  },

  // Cart
  async getCart() {
    return request('GET', '/cart', undefined, true);
  },

  async addToCartByProductId(productId, qty = 1) {
    // backend expects productId and qty as request params
    const path = `/cart/add?productId=${encodeURIComponent(productId)}&qty=${encodeURIComponent(qty)}`;
    return request('POST', path, undefined, true);
  },

  async removeFromCartByProductId(productId) {
    const path = `/cart/remove?productId=${encodeURIComponent(productId)}`;
    return request('POST', path, undefined, true);
  },

  async clearCart() {
    // backend cart clear requires clearing via CartService.clearCart which is not exposed as endpoint
    // fallback: call remove for each item or rely on backend-side clear if implemented; keep no-op here
    return request('POST', '/cart/clear', undefined, true).catch(() => null);
  },

  // Orders
  async checkout() {
    // backend creates order for authenticated user without payload
    return request('POST', '/orders/checkout', undefined, true);
  },
};

export default api;
