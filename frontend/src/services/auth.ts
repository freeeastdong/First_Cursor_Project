import api from "./api";
import type { User } from "../types";

export async function login(username: string, password: string) {
  const { data } = await api.post<{ access_token: string }>("/auth/login", {
    username,
    password,
  });
  localStorage.setItem("token", data.access_token);
  return data;
}

export async function register(
  username: string,
  email: string,
  password: string
) {
  const { data } = await api.post<{ access_token: string }>("/auth/register", {
    username,
    email,
    password,
  });
  localStorage.setItem("token", data.access_token);
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}
