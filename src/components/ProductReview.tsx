import { useEffect, useState } from "react";
import ReviewStars from "./ReviewStars";
import ConfirmModal from "./ConfirmModal";

import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  getCurrentUser,
} from "../services/api";

import { isAuthenticated } from "../services/auth";
import type { Review } from "../types/review";

type ProductReviewsProps = {
  productId: number;
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const loggedIn = isAuthenticated();

  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  // LOAD REVIEWS
  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        setLoading(true);
        setError("");

        const result = await getProductReviews(productId, 10, page);

        if (cancelled) return;

        setReviews(result.items ?? []);
        setTotalPages(result.totalPages ?? 1);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "Failed to load reviews.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [productId, page]);

  // LOAD CURRENT USER
  useEffect(() => {
    if (!loggedIn) {
      setUserId(null);
      return;
    }

    let cancelled = false;

    async function loadUser() {
      try {
        const user = await getCurrentUser();

        if (!cancelled) {
          setUserId(user.id);
        }
      } catch {
        if (!cancelled) {
          setUserId(null);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [loggedIn]);

  // REFRESH REVIEWS
  async function refreshReviews() {
    const result = await getProductReviews(productId, 10, page);

    setReviews(result.items ?? []);
    setTotalPages(result.totalPages ?? 1);
  }

  // ADD OR UPDATE REVIEW
  async function handleSubmit() {
    if (rating < 1 || rating > 5 || submitting) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (editingReviewId !== null) {
        await updateReview({
          reviewId: editingReviewId,
          rate: rating,
        });

        setSuccess("Review updated successfully!");
      } else {
        await addReview({
          productId,
          rate: rating,
        });

        setSuccess("Review added successfully!");
      }

      setRating(0);
      setEditingReviewId(null);

      await refreshReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save review.");
    } finally {
      setSubmitting(false);
    }
  }

  // EDIT REVIEW
  function handleEdit(review: Review) {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // OPEN DELETE MODAL
  function openDeleteModal(reviewId: number) {
    setDeletingReviewId(reviewId);
    setError("");
    setSuccess("");
    setDeleteModalOpen(true);
  }

  // CLOSE DELETE MODAL
  function closeDeleteModal() {
    if (submitting) return;
    setDeleteModalOpen(false);
  }

  // CONFIRM DELETE
  async function handleDelete() {
    if (submitting || deletingReviewId === null) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await deleteReview(deletingReviewId);

      setDeleteModalOpen(false);
      setDeletingReviewId(null);
      setEditingReviewId(null);
      setRating(0);

      setSuccess("Review deleted successfully!");

      await refreshReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review.");

      setDeleteModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  const currentUserReview = reviews.find(
    (review) => userId !== null && review.user?.id === userId,
  );

  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>

          <p className="mt-2 text-sm text-gray-400">
            See what customers think about this product.
          </p>
        </div>
      </div>

      {/* ADD OR EDIT REVIEW */}
      {loggedIn ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#101622] p-6">
          <h3 className="text-lg font-bold text-white">
            {editingReviewId !== null
              ? "Edit Your Review"
              : "Rate This Product"}
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            Select a rating from 1 to 5 stars.
          </p>

          <div className="mt-5">
            <ReviewStars rating={rating} onChange={setRating} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                submitting ||
                rating === 0 ||
                (currentUserReview !== undefined && editingReviewId === null)
              }
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : editingReviewId !== null
                  ? "Update Review"
                  : "Submit Review"}
            </button>

            {editingReviewId !== null && (
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setEditingReviewId(null);
                  setRating(0);
                }}
                className="rounded-xl border border-white/10 px-6 py-3 text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>

          {currentUserReview && editingReviewId === null && (
            <p className="mt-4 text-sm text-amber-400">
              You have already rated this product. You can edit your existing
              review below.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm text-gray-400">
          Please log in to rate this product.
        </p>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
        >
          {error}
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400"
        >
          {success}
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="mt-10 space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#101622] p-8 text-center text-gray-400">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#101622] p-8 text-center">
            <p className="text-gray-400">
              No reviews yet. Be the first to rate this product!
            </p>
          </div>
        ) : (
          reviews.map((review) => {
            const isOwner = userId !== null && review.user?.id === userId;

            return (
              <div
                key={review.id}
                className="rounded-2xl border border-white/10 bg-[#101622] p-6 transition hover:border-white/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">
                      {review.user?.firstName} {review.user?.lastName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US")}
                    </p>
                  </div>

                  <ReviewStars rating={review.rating} size="sm" />
                </div>

                {/* EDIT AND DELETE - OWNER ONLY */}
                {isOwner && (
                  <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleEdit(review)}
                      className="text-sm font-medium text-blue-400 transition hover:text-blue-300 disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => openDeleteModal(review.id)}
                      className="text-sm font-medium text-red-400 transition hover:text-red-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page === 1 || loading || submitting}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading || submitting}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        loading={submitting}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </section>
  );
}
