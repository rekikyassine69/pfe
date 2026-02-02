const API_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:4000";

const TOKEN_KEY = "spc_token";
const ROLE_KEY = "spc_role";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRole = () => localStorage.getItem(ROLE_KEY);

export const setAuth = (token: string, role: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

const request = async (path: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  login: (email: string, password: string, userType?: "admin" | "client") =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, userType }),
    }),
  register: (nom: string, email: string, password: string) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ nom, email, password }),
    }),
  me: () => request("/api/auth/me"),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  fetchCollection: (collection: string, params?: Record<string, string | number>) => {
    const search = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          search.set(key, String(value));
        }
      });
    }
    const query = search.toString();
    return request(`/api/collections/${collection}${query ? `?${query}` : ""}`);
  },
};
