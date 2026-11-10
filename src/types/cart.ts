import type { Product } from "./product";

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  totalPrice: number;
  product: Product;
}

export interface CartResponse {
  data: {
    items: CartItem[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasMore: boolean;
  };
}
