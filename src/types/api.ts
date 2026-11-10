export interface ApiResponse<T> {
  data: T;
}

export interface PagedResult<T> {
  items: T[];
}
