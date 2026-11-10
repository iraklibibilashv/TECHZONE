const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { handleApiError } from "../lib/apiError";
import { getAdminToken, isAdminAuthenticated, adminLogout } from "./adminAuth";

export type AdminCredentials = {
  login: string;
  password: string;
};

function getAdminHeaders(): HeadersInit {
  const token = localStorage.getItem("adminAccessToken");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-STEP-KEY": API_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function adminRequest(
  endpoint: string,
  credentials: AdminCredentials,
): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-STEP-KEY": API_KEY,
      },
      body: JSON.stringify(credentials),
    });
  } catch {
    throw new Error("Network error. Please check your internet connection.");
  }

  if (!response.ok) {
    await handleApiError(response, "Admin authentication failed.");
  }

  return response.json().catch(() => null);
}

export function adminLogin(credentials: AdminCredentials) {
  return adminRequest("/admin/login", credentials);
}

export function adminRegister(credentials: AdminCredentials) {
  return adminRequest("/admin/register", credentials);
}

import type { Product } from "../types/product";
import type { Category } from "../types/category";

// REQUEST TYPES

export type CategoryRequest = {
  name: string;
  description: string;
  imageUrl: string;
};

export type ProductRequest = {
  name: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl: string;
  imageUrls: string[];
  specifications: Record<string, string>;
};

// SHARED ADMIN REQUEST

async function adminCrudRequest<T>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  const token = getAdminToken();

  if (!token || !isAdminAuthenticated()) {
    adminLogout();
    throw new Error("Admin session expired. Please log in again.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: getAdminHeaders(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error("Network error. Please check your internet connection.");
  }

  if (response.status === 401) {
    adminLogout();
  }

  if (!response.ok) {
    await handleApiError(response, "Admin request failed.");
  }

  const result = await response.json().catch(() => null);

  return (result?.data ?? result) as T;
}

// CATEGORIES

export async function createCategory(data: CategoryRequest): Promise<Category> {
  return adminCrudRequest<Category>("/categories", "POST", data);
}

export async function updateCategory(
  categoryId: number,
  data: CategoryRequest,
): Promise<Category> {
  return adminCrudRequest<Category>(`/categories/${categoryId}`, "PUT", data);
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await adminCrudRequest(`/categories/${categoryId}`, "DELETE");
}

// PRODUCTS

export async function createProduct(data: ProductRequest): Promise<Product> {
  return adminCrudRequest<Product>("/products", "POST", data);
}

export async function updateProduct(
  productId: number,
  data: ProductRequest,
): Promise<Product> {
  return adminCrudRequest<Product>(`/products/${productId}`, "PUT", data);
}

export async function deleteProduct(productId: number): Promise<void> {
  await adminCrudRequest(`/products/${productId}`, "DELETE");
}
