// All backend talking happens through this one file.
// If the backend address changes (e.g. after deploying to Render), change ONLY BASE_URL.
export const BASE_URL = "http://localhost:5000";

export const getToken = () => localStorage.getItem("token");

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

// Saves the token + role after login.
// The role is read from the login response; if it is not there,
// we read it from inside the JWT token itself (the token holds user id and role).
export function saveAuth(data) {
  const token = data.token;
  let role = (data.user && data.user.role) || data.role;
  let name = (data.user && data.user.name) || data.name;
  if (!role && token) {
    try {
      role = JSON.parse(atob(token.split(".")[1])).role;
    } catch (e) {}
  }
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify({ role, name }));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Use: api("/api/listings")                      -> public GET
//      api("/api/listings", {method:"POST", body:{...}, auth:true})  -> needs login
export async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = "Bearer " + getToken();

  let res;
  try {
    res = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Something went wrong");
  return data;
}

// Backend may return an array directly or { listings: [...] } - handle both.
export const asList = (data) =>
  Array.isArray(data) ? data : data.listings || data.contacts || data.data || [];
