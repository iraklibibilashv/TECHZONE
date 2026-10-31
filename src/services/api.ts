import type { Product } from "../types/product";
import type { Category } from "../types/category";
import type { CartResponse } from "../types/cart";
import { getAccessToken } from "./auth";
import type { User, UpdateUserData, ChangePasswordData } from "../types/user";

import type {
  ReviewsResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "../types/review";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-STEP-KEY": API_KEY,
};

type ProductsResponse = {
  data: {
    items: Product[];
  };
};

type CategoriesResponse = {
  data: Category[];
};

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

// PRODUCTS
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products?Take=50`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products.");
  }

  const result: ProductsResponse = await response.json();

  return result.data.items.map((product) => ({
    ...product,
    stock: Number(product.stock),
  }));
}

// CATEGORIES
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories.");
  }

  const result: CategoriesResponse = await response.json();

  return result.data;
}

// REGISTER
export async function registerUser(userData: RegisterData): Promise<unknown> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed. Please try again.");
  }

  return result;
}

// LOGIN
export async function loginUser(credentials: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Login failed. Please check your credentials.",
    );
  }

  return result as AuthResponse;
}

// VERIFY EMAIL
export async function verifyEmail(
  verificationData: VerifyEmailData,
): Promise<void> {
  const response = await fetch(`${API_URL}/auth/verify-email`, {
    method: "PUT",
    headers,
    body: JSON.stringify(verificationData),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message ||
        result?.errors?.[0]?.message ||
        "Email verification failed. Please try again.",
    );
  }
}

// RESEND VERIFICATION CODE
export async function resendVerificationCode(email: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/auth/resend-email-verification/${encodeURIComponent(email)}`,
    {
      method: "POST",
      headers,
    },
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message ||
        result?.errors?.[0]?.message ||
        "Failed to resend verification code.",
    );
  }
}

// CART AUTH HEADERS
function getCartHeaders() {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Please log in to access your cart.");
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}

// GET CART
export async function getCart(): Promise<CartResponse> {
  const response = await fetch(`${API_URL}/cart?Take=50`, {
    method: "GET",
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load cart.");
  }

  return (await response.json()) as CartResponse;
}

// ADD TO CART
export async function addProductToCart(
  productId: number,
  quantity: number = 1,
): Promise<void> {
  const response = await fetch(`${API_URL}/cart/add-to-cart`, {
    method: "POST",
    headers: getCartHeaders(),
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add product to cart.");
  }
}

// UPDATE CART QUANTITY
export async function updateCartQuantity(
  itemId: number,
  quantity: number,
): Promise<void> {
  const response = await fetch(`${API_URL}/cart/edit-quantity`, {
    method: "PUT",
    headers: getCartHeaders(),
    body: JSON.stringify({
      itemId,
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update quantity.");
  }
}

// REMOVE FROM CART
export async function removeProductFromCart(productId: number): Promise<void> {
  const response = await fetch(
    `${API_URL}/cart/remove-from-cart/${productId}`,
    {
      method: "DELETE",
      headers: getCartHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to remove product from cart.");
  }
}

type FavoritesResponse = {
  data: {
    items: Product[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasMore: boolean;
  };
};

// GET FAVORITES
export async function getFavorites(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/favorites?Take=50`, {
    method: "GET",
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load favorites.");
  }

  const result: FavoritesResponse = await response.json();

  return result.data.items;
}

// ADD TO FAVORITES
export async function addToFavorites(productId: number): Promise<void> {
  const response = await fetch(`${API_URL}/favorites/${productId}`, {
    method: "POST",
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to add product to favorites.");
  }
}

// REMOVE FROM FAVORITES
export async function removeFromFavorites(productId: number): Promise<void> {
  const response = await fetch(`${API_URL}/favorites/${productId}`, {
    method: "DELETE",
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to remove product from favorites.");
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load profile.");
  }

  const result: { data: User } = await response.json();

  return result.data;
}

export async function updateUserProfile(
  userData: UpdateUserData,
): Promise<void> {
  const response = await fetch(`${API_URL}/users`, {
    method: "PUT",
    headers: getCartHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile.");
  }
}

export async function deleteUserProfile(): Promise<void> {
  const response = await fetch(`${API_URL}/users/delete-profile`, {
    method: "DELETE",
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete profile.");
  }
}

export async function changePassword(
  passwordData: ChangePasswordData,
): Promise<void> {
  const response = await fetch(`${API_URL}/users/change-password`, {
    method: "PUT",
    headers: getCartHeaders(),
    body: JSON.stringify(passwordData),
  });

  if (!response.ok) {
    throw new Error("Failed to change password.");
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/auth/forget-password/${encodeURIComponent(email)}`,
    {
      method: "POST",
      headers,
    },
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message ||
        result?.errors?.[0]?.message ||
        "Failed to send password reset request.",
    );
  }
}
export interface ResetPasswordData {
  token: string;
  password: string;
}

export async function resetPassword(data: ResetPasswordData): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/reset-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-STEP-KEY": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.message || "Failed to reset password.");
  }
}

export interface CheckoutResponse {
  message: string;
  itemCount: number;
}

export async function checkout(): Promise<CheckoutResponse> {
  const response = await fetch(`${API_URL}/users/checkout`, {
    method: "POST",
    headers: getCartHeaders(),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Checkout failed. Please try again.");
  }

  return result as CheckoutResponse;
}

export async function getProductReviews(
  productId: number,
  take = 10,
  page = 1,
): Promise<ReviewsResponse> {
  const response = await fetch(
    `${API_URL}/reviews/${productId}?Take=${take}&Page=${page}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load reviews.");
  }

  const result = await response.json();

  return result.data;
}

export async function addReview(data: CreateReviewRequest): Promise<void> {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: getCartHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.message || "Failed to add review.");
  }
}

export async function updateReview(data: UpdateReviewRequest): Promise<void> {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "PUT",
    headers: getCartHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.message || "Failed to update review.");
  }
}

export async function deleteReview(reviewId: number): Promise<void> {
  const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.detail || result?.message || "Failed to delete review.",
    );
  }
}
