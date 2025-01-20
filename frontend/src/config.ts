export const API_URL = import.meta.env.VITE_API_URL;

export const authUser = `auth/login`;
export const regUser = `auth/register`;
export const logout = `auth/logout`;
export const resresh = `auth/refresh`;
export const deletePost = (id: number) => `posts/${id}`;
export const addPost = "posts";
export const changePost = (id: number) => `posts/${id}`;
export const getPosts = "posts";