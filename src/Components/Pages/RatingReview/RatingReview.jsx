import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';

const RatingReview = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    
    const [pendingReviews, setPendingReviews] = useState([]);
    const [ratings, setRatings] = useState({});
    const [reviews, setReviews] = useState({});
    const [submitting, setSubmitting] = useState({});
    const [loading, setLoading] = useState(true);

    // Load pending reviews from database
    useEffect(() => {
        const loadPendingReviews = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log("🔍 Loading pending reviews for user:", user.email);
                
                const response = await axiosSecure.get(`/api/rating-review/pending/${user.email}`);
                
                if (response.data.success) {
                    console.log("📦 Pending reviews loaded:", response.data.pendingReviews);
                    setPendingReviews(response.data.pendingReviews);
                } else {
                    console.error("❌ Failed to load pending reviews:", response.data.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message || 'Failed to load pending reviews'
                    });
                }
            } catch (error) {
                console.error("❌ Error loading pending reviews:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load pending reviews. Please try again.'
                });
            } finally {
                setLoading(false);
            }
        };

        loadPendingReviews();
    }, [user, axiosSecure]);

    const handleRatingChange = (reviewId, rating) => {
        setRatings(prev => ({
            ...prev,
            [reviewId]: rating
        }));
    };

    const handleReviewChange = (reviewId, review) => {
        setReviews(prev => ({
            ...prev,
            [reviewId]: review
        }));
    };

    const handleSubmitReview = async (reviewId) => {
        if (!ratings[reviewId]) {
            Swal.fire({
                icon: 'warning',
                title: 'Rating Required',
                text: 'Please select a star rating before submitting'
            });
            return;
        }

        setSubmitting(prev => ({ ...prev, [reviewId]: true }));

        try {
            console.log("⭐ Submitting review:", reviewId, "Rating:", ratings[reviewId]);
            
            const response = await axiosSecure.patch(`/api/rating-review/submit/${reviewId}`, {
                rating: ratings[reviewId],
                review: reviews[reviewId] || "",
                status: "complete"
            });
            
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Review Submitted!',
                    text: 'Thank you for your feedback!',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                // Remove from local state
                setPendingReviews(prev => prev.filter(review => review._id !== reviewId));
                
                // Clean up local state
                setRatings(prev => {
                    const newRatings = { ...prev };
                    delete newRatings[reviewId];
                    return newRatings;
                });
                setReviews(prev => {
                    const newReviews = { ...prev };
                    delete newReviews[reviewId];
                    return newReviews;
                });
            }
        } catch (error) {
            console.error("❌ Submit review error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response?.data?.message || 'Failed to submit review. Please try again.'
            });
        } finally {
            setSubmitting(prev => ({ ...prev, [reviewId]: false }));
        }
    };

    const handleSkipReview = async (reviewId) => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Skip Review?',
            text: 'Are you sure you want to skip reviewing this product?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Skip',
            cancelButtonText: 'Continue Review'
        });

        if (result.isConfirmed) {
            try {
                console.log("⏭️ Skipping review:", reviewId);
                
                const response = await axiosSecure.patch(`/api/rating-review/submit/${reviewId}`, {
                    rating: null,
                    review: "",
                    status: "skipped"
                });
                
                if (response.data.success) {
                    // Remove from local state
                    setPendingReviews(prev => prev.filter(review => review._id !== reviewId));
                    
                    Swal.fire({
                        icon: 'info',
                        title: 'Review Skipped',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                console.error("❌ Skip review error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to skip review'
                });
            }
        }
    };

    const handleSkipAll = async () => {
        if (pendingReviews.length === 0) return;

        const result = await Swal.fire({
            icon: 'question',
            title: 'Skip All Reviews?',
            text: `Skip all ${pendingReviews.length} pending reviews?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Skip All',
            cancelButtonText: 'Continue Reviewing'
        });

        if (result.isConfirmed) {
            try {
                // Skip all pending reviews
                const skipPromises = pendingReviews.map(review => 
                    axiosSecure.patch(`/api/rating-review/submit/${review._id}`, {
                        rating: null,
                        review: "",
                        status: "skipped"
                    })
                );
                
                await Promise.all(skipPromises);
                setPendingReviews([]);
                
                Swal.fire({
                    icon: 'info',
                    title: 'All Reviews Skipped',
                    text: `Skipped ${pendingReviews.length} reviews`,
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("❌ Skip all reviews error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to skip reviews'
                });
            }
        }
    };

    // Render star rating component
    const renderStarRating = (reviewId, currentRating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(reviewId, star)}
                        disabled={submitting[reviewId]}
                        className={`p-1 transition-all duration-200 transform hover:scale-110 ${
                            submitting[reviewId] ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                        }`}
                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    >
                        {currentRating >= star ? (
                            <StarIconSolid className="w-8 h-8 text-yellow-400" />
                        ) : (
                            <StarIcon className="w-8 h-8 text-gray-300 hover:text-yellow-300" />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    const getRemainingCount = () => {
        return pendingReviews.length;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading your pending reviews...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                <p className="text-gray-600 mb-6">You need to be logged in to view and submit reviews.</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (pendingReviews.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⭐</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">No Pending Reviews</h1>
                    <p className="text-gray-600 mb-6">You don't have any products waiting for your review.</p>
                    <div className="space-y-3">
                        <button 
                            onClick={() => navigate('/products')}
                            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                        >
                            Continue Shopping
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Rate Your Products</h1>
                <p className="text-gray-600 mb-4">Share your experience with products from your recent orders</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                    <p className="text-blue-800 font-medium">
                        {getRemainingCount()} product{getRemainingCount() !== 1 ? 's' : ''} waiting for your review
                    </p>
                </div>
            </div>

            {/* Products to Review */}
            <div className="space-y-6 max-w-4xl mx-auto">
                {pendingReviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="flex items-start gap-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                                {review.image ? (
                                    <img 
                                        src={`http://localhost:5000${review.image}`} 
                                        alt={review.productName}
                                        className="w-24 h-24 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-400 text-2xl">📦</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Product Details and Review Form */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{review.productName}</h3>
                                        <p className="text-gray-600">
                                            Order: <span className="font-mono text-sm">{review.orderId}</span>
                                        </p>
                                        {review.category && (
                                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded capitalize">
                                                {review.category}
                                            </span>
                                        )}
                                    </div>
                                    {submitting[review._id] && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                            <span className="text-sm">Submitting...</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Star Rating */}
                                <div className="mb-6">
                                    <p className="text-gray-700 font-medium mb-3">How would you rate this product?</p>
                                    {renderStarRating(review._id, ratings[review._id] || 0)}
                                    {ratings[review._id] && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            You rated: {ratings[review._id]} star{ratings[review._id] !== 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>

                                {/* Review Text */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Your Review <span className="text-gray-400">(Optional)</span>
                                    </label>
                                    <textarea
                                        value={reviews[review._id] || ''}
                                        onChange={(e) => handleReviewChange(review._id, e.target.value)}
                                        placeholder="Share your experience with this product. What did you like? Any suggestions?"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                        rows="3"
                                        disabled={submitting[review._id]}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {reviews[review._id]?.length || 0}/500 characters
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleSubmitReview(review._id)}
                                        disabled={submitting[review._id] || !ratings[review._id]}
                                        className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
                                    >
                                        {submitting[review._id] ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Review'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSkipReview(review._id)}
                                        disabled={submitting[review._id]}
                                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition-colors font-semibold flex items-center gap-2"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                        Skip
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Skip All Button */}
            {pendingReviews.length > 1 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleSkipAll}
                        className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                        Skip All Reviews ({getRemainingCount()})
                    </button>
                </div>
            )}

            {/* Footer Navigation */}
            <div className="mt-12 text-center">
                <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
                    <p className="text-gray-600 mb-4">Contact us if you have any issues with your reviews</p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => navigate('/products')}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingReview;