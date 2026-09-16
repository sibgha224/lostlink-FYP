const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export const API_ROOT = RAW_BASE;
export const API_BASE = `${RAW_BASE}/api`;
export const SOCKET_URL = RAW_BASE;
