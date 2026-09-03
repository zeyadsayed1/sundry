"use client";

import { useState, useEffect } from "react";
import { FiStar, FiEdit2, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/app/lib/api";
import { getStoredToken, getStoredUser } from "@/app/lib/auth";
import { Review, type UserSession } from "@/app/lib/types";
import type { ProductReviewsProps } from "./ProductReviews.types";

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.reviews.productReviews(productId));
      const data = await res.json();
      if (res.ok) {
        setReviews(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    const restoreReviewer = async () => {
      setCurrentUser(getStoredUser());
      setToken(await getStoredToken());
    };

    void restoreReviewer();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please sign in to leave a review.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review.");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingReviewId 
        ? API_ENDPOINTS.reviews.byId(editingReviewId)
        : API_ENDPOINTS.reviews.productReviews(productId);
        
      const method = editingReviewId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          review: reviewText,
          rating,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingReviewId ? "Review updated!" : "Review submitted successfully!");
        setReviewText("");
        setRating(5);
        setEditingReviewId(null);
        fetchReviews(); // Refresh reviews
      } else {
        toast.error(data.message || "Failed to submit review.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      const res = await fetch(API_ENDPOINTS.reviews.byId(reviewId), {
        method: "DELETE",
        headers: { token },
      });

      if (res.ok) {
        toast.success("Review deleted.");
        fetchReviews();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete review.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setReviewText(review.review || review.title || "");
    
    // Scroll to form
    const formEl = document.getElementById("review-form");
    if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
  };

  const userHasReviewed = reviews.some(r => r.user?._id === currentUser?.id);
  const showForm = token && (!userHasReviewed || editingReviewId);

  return (
    <div className="mt-16 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#1E1C2B] text-white flex items-center justify-center shadow-sm">
          <FiMessageSquare size={18} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E1C2B] tracking-tight">Customer Reviews</h2>
          <p className="text-sm text-[#8B879A]">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</p>
        </div>
      </div>

      {/* ── Review Form ── */}
      {showForm && (
        <form id="review-form" onSubmit={handleSubmitReview} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDEBF1] shadow-sm mb-10">
          <h3 className="text-lg font-bold text-[#1E1C2B] mb-4">
            {editingReviewId ? "Edit Your Review" : "Write a Review"}
          </h3>
          
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#8B879A] uppercase tracking-wider mb-2">Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <FiStar
                    size={24}
                    className={`${star <= rating ? "fill-[#F0AA4C] text-[#F0AA4C]" : "text-[#D5D3DF]"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-[#8B879A] uppercase tracking-wider mb-2">Your Review</label>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us what you think about this product..."
              className="w-full rounded-2xl bg-[#F7F6F9] border border-[#EDEBF1] p-4 text-sm text-[#1E1C2B] outline-none focus:border-[#F0AA4C] focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-[#1E1C2B] text-white font-bold text-sm hover:bg-[#F0AA4C] hover:text-[#1E1C2B] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : editingReviewId ? "Update Review" : "Submit Review"}
            </button>
            {editingReviewId && (
              <button
                type="button"
                onClick={() => {
                  setEditingReviewId(null);
                  setReviewText("");
                  setRating(5);
                }}
                className="px-6 py-3 rounded-xl bg-[#F7F6F9] text-[#1E1C2B] font-bold text-sm hover:bg-[#EDEBF1] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* ── Reviews List ── */}
      {isLoading ? (
        <div className="py-10 text-center text-[#8B879A] text-sm font-medium">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-[#F7F6F9] rounded-3xl p-10 text-center border border-[#EDEBF1]">
          <FiStar size={32} className="text-[#D5D3DF] mx-auto mb-3" />
          <h3 className="text-[#1E1C2B] font-bold mb-1">No reviews yet</h3>
          <p className="text-[#8B879A] text-sm">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isMyReview = currentUser && review.user?._id === currentUser.id;
            
            return (
              <div key={review._id} className="bg-white p-6 rounded-2xl border border-[#EDEBF1] shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EAF2FA] text-[#2B6CB0] font-extrabold flex items-center justify-center uppercase shrink-0">
                      {review.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1E1C2B]">{review.user?.name || "User"}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            size={12}
                            className={star <= review.rating ? "fill-[#F0AA4C] text-[#F0AA4C]" : "text-[#EDEBF1]"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {isMyReview && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(review)}
                        className="p-1.5 text-[#8B879A] hover:text-[#2B6CB0] transition-colors"
                        title="Edit Review"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-1.5 text-[#8B879A] hover:text-[#E8593C] transition-colors"
                        title="Delete Review"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-[#524F63] leading-relaxed">
                  {review.review || review.title || review.text}
                </p>
                <span className="block mt-3 text-[11px] font-semibold text-[#8B879A]">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
