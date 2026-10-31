
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

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
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
}

async function adminRequest(
  endpoint: string,
  credentials: AdminCredentials
): Promise<unknown> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(credentials),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail ||
      result?.message ||
      result?.title ||
      "Something went wrong."
    );
  }

  return result;
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
  body?: unknown
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: getAdminHeaders(),
    ...(body !== undefined
      ? { body: JSON.stringify(body) }
      : {}),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail ||
      result?.message ||
      result?.title ||
      "Admin request failed."
    );
  }

  return result?.data ?? result;
}

// CATEGORIES

export async function createCategory(
  data: CategoryRequest
): Promise<Category> {
  return adminCrudRequest<Category>(
    "/categories",
    "POST",
    data
  );
}

export async function updateCategory(
  categoryId: number,
  data: CategoryRequest
): Promise<Category> {
  return adminCrudRequest<Category>(
    `/categories/${categoryId}`,
    "PUT",
    data
  );
}

export async function deleteCategory(
  categoryId: number
): Promise<void> {
  await adminCrudRequest(
    `/categories/${categoryId}`,
    "DELETE"
  );
}

// PRODUCTS

export async function createProduct(
  data: ProductRequest
): Promise<Product> {
  return adminCrudRequest<Product>(
    "/products",
    "POST",
    data
  );
}

export async function updateProduct(
  productId: number,
  data: ProductRequest
): Promise<Product> {
  return adminCrudRequest<Product>(
    `/products/${productId}`,
    "PUT",
    data
  );
}

export async function deleteProduct(
  productId: number
): Promise<void> {
  await adminCrudRequest(
    `/products/${productId}`,
    "DELETE"
  );
}
