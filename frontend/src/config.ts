export const API_PORT = import.meta.env.VITE_BACKEND_PORT;
export const API_HOST = import.meta.env.VITE_BACKEND_HOST;
export const API_URL = `http://localhost:3000/`;

export const authUser = API_URL + `auth/login`;
export const regUser = API_URL + `auth/register`;
export const logout = API_URL + `auth/logout`;
export const resresh = API_URL + `auth/user`;