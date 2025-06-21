"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function ReviewSection({
  productId,
  productName,
  productSlug,
  onReviewSubmitted,
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    avgRating: 0,
    reviewCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      // NOTE: This assumes an endpoint exists to fetch only review data for a product.
      // This is more efficient than re-fetching the entire product object.
      // If this endpoint doesn't exist, it would need to be created on the backend.
      const response = await fetchApi(`/public/reviews/product/${productId}`);
      setReviewsData({
        reviews: response.data.reviews || [],
        avgRating: response.data.avgRating || 0,
        reviewCount: response.data.reviewCount || 0,
      });
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("Could not load reviews at this time.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleRatingClick = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
    if (formErrors.rating) {
      setFormErrors((prev) => ({ ...prev, rating: null }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (reviewForm.rating === 0) errors.rating = "Please select a rating.";
    if (!reviewForm.comment.trim())
      errors.comment = "Please provide a review comment.";
    if (reviewForm.comment.trim().length < 10)
      errors.comment = "Comment must be at least 10 characters.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${productSlug}&review=true`);
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await fetchApi(`/users/reviews`, {
        method: "POST",
        body: JSON.stringify({
          productId: productId,
          rating: reviewForm.rating,
          title: reviewForm.title.trim(),
          comment: reviewForm.comment.trim(),
        }),
      });
      toast.success("Review submitted successfully!");
      setReviewForm({ rating: 0, title: "", comment: "" });
      setShowForm(false);
      // Re-fetch reviews and notify parent to update product data
      fetchReviews();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { reviews, avgRating, reviewCount } = reviewsData;

  if (loading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto" />
        <p className="mt-2 text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-50/50 rounded-lg">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <p className="mt-2 text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="md:sticky md:top-28">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Write a review for
          </h3>
          <p className="text-xl text-red-600 font-semibold mb-6">
            {productName}
          </p>

          {!showForm && (
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  router.push(
                    `/login?redirect=/products/${productSlug}?review=true`
                  );
                  return;
                }
                setShowForm(true);
              }}
              size="lg"
              className="w-full md:w-auto"
            >
              Write a Review
            </Button>
          )}

          {showForm && (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      type="button"
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                    >
                      <Star
                        className={`h-7 w-7 cursor-pointer transition-all duration-150 ${
                          reviewForm.rating >= rating
                            ? "text-red-400"
                            : "text-gray-300 hover:text-red-300"
                        }`}
                        fill={
                          reviewForm.rating >= rating ? "currentColor" : "none"
                        }
                      />
                    </button>
                  ))}
                </div>
                {formErrors.rating && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.rating}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-bold mb-2 text-gray-700"
                >
                  Review Title
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={reviewForm.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Best protein I've ever used!"
                />
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-bold mb-2 text-gray-700"
                >
                  Your Review <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="comment"
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleInputChange}
                  placeholder="Tell us what you liked or disliked..."
                  rows={5}
                />
                {formErrors.comment && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.comment}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Review
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h3>
            {reviewCount > 0 && (
              <span className="text-sm text-gray-600 font-medium">
                ({reviewCount} total)
              </span>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-4 -mr-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-xl border border-gray-200/80"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-800 text-base">
                        {review.user.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-red-400">
                      <span className="font-bold text-sm">
                        {review.rating.toFixed(1)}
                      </span>
                      <Star className="h-4 w-4" fill="currentColor" />
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="font-semibold text-gray-800 mt-3 text-base">
                      {review.title}
                    </h4>
                  )}

                  <p className="mt-2 text-gray-600 leading-relaxed text-sm">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-white rounded-xl border border-gray-200/80">
              <p className="font-semibold text-gray-800">No reviews yet.</p>
              <p className="text-sm text-gray-600 mt-1">
                Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
