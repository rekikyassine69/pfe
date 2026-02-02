const API = '/api';

export async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return res.json();
}

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Signup failed');
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${API}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function addUser(data: any) {
  const res = await fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add user');
  return res.json();
}

export async function updateUser(id: string, data: any) {
  const res = await fetch(`${API}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete user');
  return true;
}

export async function getPots(ownerId?: string) {
  const url = ownerId ? `${API}/pots?ownerId=${ownerId}` : `${API}/pots`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch pots');
  return res.json();
}

export async function addPot(data: any) {
  const res = await fetch(`${API}/pots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add pot');
  return res.json();
}

export async function updatePot(id: string, data: any) {
  const res = await fetch(`${API}/pots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update pot');
  return res.json();
}

export async function deletePot(id: string) {
  const res = await fetch(`${API}/pots/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete pot');
  return true;
}
