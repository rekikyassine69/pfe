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
    let message = await response.text();
    
    // Essayer de parser le JSON si possible
    try {
      const json = JSON.parse(message);
      message = json.message || json.error || message;
    } catch {
      // Si ce n'est pas du JSON, garder le texte brut
    }
    
    // Ajouter le statut HTTP pour les erreurs d'authentification
    if (response.status === 401) {
      throw new Error(`Authentification requise. Veuillez vous connecter.`);
    }
    
    throw new Error(message || `Erreur ${response.status}`);
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
  updateProfile: (data: {
    nom?: string;
    prenom?: string;
    telephone?: string;
    bio?: string;
    preferences?: Record<string, any>;
  }) =>
    request("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, newPassword: string) =>
    request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
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
  adminFetchCollection: (collection: string, params?: Record<string, string | number>) => {
    const search = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          search.set(key, String(value));
        }
      });
    }
    const query = search.toString();
    return request(`/api/admin/collections/${collection}${query ? `?${query}` : ""}`);
  },
  adminCreateCollectionItem: (collection: string, data: Record<string, unknown>) =>
    request(`/api/admin/collections/${collection}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  adminUpdateCollectionItem: (collection: string, id: string, data: Record<string, unknown>) =>
    request(`/api/admin/collections/${collection}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  adminDeleteCollectionItem: (collection: string, id: string) =>
    request(`/api/admin/collections/${collection}/${id}`, {
      method: 'DELETE',
    }),
  identifyPlant: (image: string, options?: Record<string, unknown>) =>
    request("/api/recognition/plant", {
      method: "POST",
      body: JSON.stringify({ image, ...(options || {}) }),
    }),
  fetchRecentRecognitions: (limit = 6) =>
    request(`/api/recognition/recent?limit=${limit}`),
  // AI Agent: Get plant care information by plant name
  getPlantInfo: (plantName: string) =>
    request(`/api/recognition/plant-info/${encodeURIComponent(plantName)}`),
  
  // Shop API
  getProducts: (params?: { categorie?: string; search?: string; sort?: string; order?: string }) =>
    request(`/api/shop/products${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`),
  getProduct: (id: string) =>
    request(`/api/shop/products/${id}`),
  getCart: () =>
    request('/api/shop/cart'),
  addToCart: (produitId: string, quantite: number = 1) =>
    request('/api/shop/cart/add', {
      method: 'POST',
      body: JSON.stringify({ produitId, quantite })
    }),
  updateCartItem: (itemId: string, quantite: number) =>
    request(`/api/shop/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantite })
    }),
  removeFromCart: (itemId: string) =>
    request(`/api/shop/cart/${itemId}`, {
      method: 'DELETE'
    }),
  clearCart: () =>
    request('/api/shop/cart', {
      method: 'DELETE'
    }),
  createOrder: (adresseLivraison: any, modePaiement?: string) =>
    request('/api/shop/orders', {
      method: 'POST',
      body: JSON.stringify({ adresseLivraison, modePaiement })
    }),
  getOrders: () =>
    request('/api/shop/orders'),
  getOrder: (id: string) =>
    request(`/api/shop/orders/${id}`),
  
  // Notifications API
  getNotifications: (params?: { estLue?: boolean; type?: string; limit?: number; skip?: number }) =>
    request(`/api/notifications${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`),
  getUnreadCount: () =>
    request('/api/notifications/unread-count'),
  markNotificationRead: (id: string) =>
    request(`/api/notifications/${id}/read`, {
      method: 'PATCH'
    }),
  markAllNotificationsRead: () =>
    request('/api/notifications/mark-all-read', {
      method: 'POST'
    }),
  deleteNotification: (id: string) =>
    request(`/api/notifications/${id}`, {
      method: 'DELETE'
    }),
  deleteReadNotifications: () =>
    request('/api/notifications/read/all', {
      method: 'DELETE'
    }),
  
  // Admin API - Users
  adminGetUsers: (params?: { search?: string; statut?: string; sort?: string; order?: string }) =>
    request(`/api/admin/users${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`),
  adminGetUser: (id: string) =>
    request(`/api/admin/users/${id}`),
  adminCreateUser: (data: { nom: string; prenom: string; email: string; motDePasse: string; telephone?: string; statut?: string }) =>
    request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminUpdateUser: (id: string, data: { statut?: string; telephone?: string; nom?: string; prenom?: string; email?: string }) =>
    request(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  adminChangeUserRole: (id: string, role: 'client' | 'admin') =>
    request(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    }),
  adminDeleteUser: (id: string) =>
    request(`/api/admin/users/${id}`, {
      method: 'DELETE'
    }),
  adminGetAdmins: () =>
    request('/api/admin/admins'),
  adminCreateAdmin: (data: { nom: string; prenom: string; email: string; motDePasse: string; telephone?: string; statut?: string }) =>
    request('/api/admin/admins', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminUpdateAdmin: (id: string, data: { statut?: string; telephone?: string; nom?: string; prenom?: string; email?: string }) =>
    request(`/api/admin/admins/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  adminDeleteAdmin: (id: string) =>
    request(`/api/admin/admins/${id}`, {
      method: 'DELETE'
    }),
  
  // Admin API - Orders
  adminGetOrders: (params?: { statut?: string; search?: string; sort?: string; order?: string }) =>
    request(`/api/admin/orders${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`),
  adminGetOrder: (id: string) =>
    request(`/api/admin/orders/${id}`),
  adminUpdateOrder: (id: string, data: { statut?: string; numeroSuivi?: string; dateLivraison?: string }) =>
    request(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  adminDeleteOrder: (id: string) =>
    request(`/api/admin/orders/${id}`, {
      method: 'DELETE'
    }),
  adminGetOrderStats: () =>
    request('/api/admin/stats/orders'),
  
  // Admin API - Pots
  adminGetPots: (params?: { statut?: string; search?: string; sort?: string; order?: string }) =>
    request(`/api/admin/pots${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`),
  adminGetPot: (id: string) =>
    request(`/api/admin/pots/${id}`),
  adminUpdatePot: (id: string, data: { statut?: string; etatArrosage?: string; seuilHumidite?: number; frequenceArrosage?: number }) =>
    request(`/api/admin/pots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  adminDeletePot: (id: string) =>
    request(`/api/admin/pots/${id}`, {
      method: 'DELETE'
    }),
  
  // Admin API - Courses
  adminGetCourses: (params?: { statut?: string; categorie?: string; search?: string; sort?: string; order?: string }) =>
    request(`/api/admin/courses${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`),
  adminGetCourse: (id: string) =>
    request(`/api/admin/courses/${id}`),
  adminCreateCourse: (data: any) =>
    request('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminUpdateCourse: (id: string, data: any) =>
    request(`/api/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  adminDeleteCourse: (id: string) =>
    request(`/api/admin/courses/${id}`, {
      method: 'DELETE'
    }),
  
  // Admin API - Games
  adminGetGames: (params?: { statut?: string; search?: string; sort?: string; order?: string }) =>
    request(`/api/admin/games${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`),
  adminGetGame: (id: string) =>
    request(`/api/admin/games/${id}`),
  adminCreateGame: (data: any) =>
    request('/api/admin/games', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminUpdateGame: (id: string, data: any) =>
    request(`/api/admin/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  adminDeleteGame: (id: string) =>
    request(`/api/admin/games/${id}`, {
      method: 'DELETE'
    }),
  
  // Admin API - Dashboard
  adminGetDashboardStats: () =>
    request('/api/admin/stats/dashboard')
};