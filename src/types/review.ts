export interface ReviewUser {
  id: number;
  email: string;
  role: string;
  lastName: string;
  firstName: string;
  details: {
    phoneNumber: string;
    address: string;
    dob: string;
    pictureUrl: string;
  };
}

export interface Review {
  id: number;
  rating: number;
  createdAt: string;
  user: ReviewUser;
}

export interface ReviewsResponse {
  items: Review[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CreateReviewRequest {
  productId: number;
  rate: number;
}

export interface UpdateReviewRequest {
  reviewId: number;
  rate: number;
}
