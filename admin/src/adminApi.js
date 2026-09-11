// Shared fetch helper for the admin panel — every admin page talks to the
// same backend the student app uses, authenticated as an admin-role user.

export const API_BASE = 'http://localhost:5000/api';

export const getAdminToken = () => localStorage.getItem('adminToken');
export const getAdminUser = () => {
  try { return JSON.parse(localStorage.getItem('adminUser') || 'null'); } catch { return null; }
};

export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/';
};

export const adminFetch = async (path, options = {}) => {
  const token = getAdminToken();
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` };
  if (!(options.body instanceof FormData) && options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
};
