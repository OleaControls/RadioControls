// El token ya no se envía como header — la cookie httpOnly se adjunta automáticamente.
// El parámetro `token` se mantiene por compatibilidad pero ya no se usa.
export const apiFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include",
  });
};
