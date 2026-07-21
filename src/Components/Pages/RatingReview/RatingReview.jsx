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
    const [completedReviews, setCompletedReviews] = useState([]);
    const [ratings, setRatings] = useState({});
    const [reviews, setReviews] = useState({});
    const [submitting, setSubmitting] = useState({});
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, completed: 0, skipped: 0 });

    // Load the user's review history from the server
    useEffect(() => {
        const loadPendingReviews = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log("🔍 Loading review history for user:", user.email);
                
                const response = await axiosSecure.get(`/api/rating-review/user/${user.email}/history`);
                
                if (response.data.success) {
                    console.log("📦 Review history loaded:", response.data);
                    setPendingReviews(response.data.pendingReviews.filter(review => review.status === 'incomplete'));
                    setCompletedReviews(response.data.completedReviews || []);
                    setStats(response.data.stats || { pending: 0, completed: 0, skipped: 0 });
                } else {
                    console.error("❌ Failed to load review history:", response.data.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message || 'Failed to load review history'
                    });
                }
            } catch (error) {
                console.error("❌ Error loading review history:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load review history. Please try again.'
                });
            } finally {
                setLoading(false);
            }
        };

        loadPendingReviews();
    }, [user, axiosSecure]);

    const handleRatingChange = (reviewId, rating) => {
        const idKey = String(reviewId);
        setRatings(prev => ({
            ...prev,
            [idKey]: rating
        }));
    };

    const handleReviewChange = (reviewId, review) => {
        const idKey = String(reviewId);
        setReviews(prev => ({
            ...prev,
            [idKey]: review
        }));
    };

    const handleSubmitReview = async (reviewId) => {
        const idKey = String(reviewId);

        if (!ratings[idKey]) {
            Swal.fire({
                icon: 'warning',
                title: 'Rating Required',
                text: 'Please select a star rating before submitting'
            });
            return;
        }

        setSubmitting(prev => ({ ...prev, [idKey]: true }));

        try {
            console.log("⭐ Submitting review:", reviewId, "Rating:", ratings[idKey]);
            
            const response = await axiosSecure.patch(`/api/rating-review/submit/${reviewId}`, {
                rating: ratings[idKey],
                review: reviews[idKey] || "",
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
                
                const submittedReview = pendingReviews.find(review => String(review._id) === String(reviewId));

                // Move review from pending into completed reviews for immediate UI feedback
                if (submittedReview) {
                    setCompletedReviews(prev => [
                        ...prev,
                        {
                            ...submittedReview,
                            rating: ratings[idKey],
                            review: reviews[idKey] || "",
                            status: 'complete',
                            updatedAt: new Date().toISOString()
                        }
                    ]);
                }

                // Remove from pending state
                setPendingReviews(prev => prev.filter(review => String(review._id) !== String(reviewId)));

                // Update stats
                setStats(prev => ({
                    ...prev,
                    pending: Math.max(0, prev.pending - 1),
                    completed: prev.completed + 1
                }));

                // Clean up local state
                setRatings(prev => {
                    const newRatings = { ...prev };
                    delete newRatings[idKey];
                    return newRatings;
                });
                setReviews(prev => {
                    const newReviews = { ...prev };
                    delete newReviews[idKey];
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
            setSubmitting(prev => ({ ...prev, [idKey]: false }));
        }
    };

    const handleUpdateCompletedReview = async (reviewId) => {
        const idKey = String(reviewId);

        if (!ratings[idKey] && !reviews[idKey]) {
            Swal.fire({
                icon: 'warning',
                title: 'No Change Detected',
                text: 'Please update the rating or review before saving.'
            });
            return;
        }

        setSubmitting(prev => ({ ...prev, [idKey]: true }));

        try {
            console.log("🔄 Updating completed review:", reviewId, "Rating:", ratings[idKey]);

            const response = await axiosSecure.patch(`/api/rating-review/update/${reviewId}`, {
                rating: ratings[idKey],
                review: reviews[idKey]
            });

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Review Updated!',
                    text: 'Your rating has been updated successfully.',
                    timer: 1500,
                    showConfirmButton: false
                });

                setCompletedReviews(prev => prev.map(item =>
                    String(item._id) === String(reviewId)
                        ? { ...item, rating: ratings[idKey] ?? item.rating, review: reviews[idKey] ?? item.review, updatedAt: new Date().toISOString() }
                        : item
                ));
            }
        } catch (error) {
            console.error("❌ Update completed review error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Failed to update review. Please try again.'
            });
        } finally {
            setSubmitting(prev => ({ ...prev, [idKey]: false }));
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
                    setPendingReviews(prev => prev.filter(review => String(review._id) !== String(reviewId)));
                    setStats(prev => ({
                        ...prev,
                        pending: Math.max(0, prev.pending - 1),
                        skipped: prev.skipped + 1
                    }));
                        
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
        const activeRating = currentRating || 0;

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
                        {activeRating >= star ? (
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

    if (pendingReviews.length === 0 && completedReviews.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⭐</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">No Reviews Found</h1>
                    <p className="text-gray-600 mb-6">You don't have any products waiting for your review yet.</p>
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Product Reviews</h1>
                <p className="text-gray-600 mb-4">Review your recent purchases and update any ratings you've already submitted.</p>
                <div className="grid gap-3 md:grid-cols-3 max-w-4xl mx-auto">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                        <p className="text-sm text-slate-500">Pending Reviews</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <p className="text-sm text-slate-500">Submitted Reviews</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                        <p className="text-sm text-slate-500">Skipped Reviews</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.skipped}</p>
                    </div>
                </div>
            </div>

            {/* Pending Reviews Section */}
            {pendingReviews.length > 0 && (
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Products Waiting for Your Rating</h2>
                        <p className="text-gray-600">These items were delivered and are still waiting for your feedback.</p>
                    </div>

                    {pendingReviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                            <div className="flex flex-col lg:flex-row items-start gap-6">
                                <div className="flex-shrink-0">
                                    {review.image ? (
                                        <img 
                                            src={`http://localhost:5000${review.image}`} 
                                            alt={review.productName || 'Product image'}
                                            className="w-24 h-24 object-cover rounded-2xl"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
                                            <span className="text-gray-400 text-2xl">📦</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{review.productName || review.productId}</h3>
                                            <p className="text-gray-600 mt-1">Order: <span className="font-mono text-sm">{review.orderId || 'Unknown'}</span></p>
                                            {review.category && (
                                                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded capitalize">
                                                    {review.category}
                                                </span>
                                            )}
                                        </div>
                                        {submitting[review._id] && (
                                            <div className="flex items-center gap-2 text-emerald-600">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                                                <span className="text-sm">Submitting...</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-gray-700 font-medium mb-3">How would you rate this product?</p>
                                        {renderStarRating(review._id, ratings[review._id] || 0)}
                                        {ratings[review._id] && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                You rated: {ratings[review._id]} star{ratings[review._id] !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 font-medium mb-2">Your Review <span className="text-gray-400">(Optional)</span></label>
                                        <textarea
                                            value={reviews[review._id] || ''}
                                            onChange={(e) => handleReviewChange(review._id, e.target.value)}
                                            placeholder="Share your experience with this product. What did you like?"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                            rows="3"
                                            disabled={submitting[review._id]}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">{reviews[review._id]?.length || 0}/500 characters</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => handleSubmitReview(review._id)}
                                            disabled={submitting[review._id] || !ratings[review._id]}
                                            className="flex-1 bg-green-500 text-white py-3 rounded-2xl hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                                        >
                                            {submitting[review._id] ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                        <button
                                            onClick={() => handleSkipReview(review._id)}
                                            disabled={submitting[review._id]}
                                            className="flex-1 bg-gray-500 text-white py-3 rounded-2xl hover:bg-gray-600 disabled:bg-gray-400 transition-colors font-semibold"
                                        >
                                            Skip
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {pendingReviews.length > 1 && (
                        <div className="mt-4 text-right">
                            <button
                                onClick={handleSkipAll}
                                className="px-8 py-3 bg-gray-300 text-gray-700 rounded-2xl hover:bg-gray-400 transition-colors font-semibold"
                            >
                                Skip All Reviews ({getRemainingCount()})
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Completed Reviews Section */}
            {completedReviews.length > 0 && (
                <div className="space-y-6 max-w-4xl mx-auto mt-10">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Submitted Ratings</h2>
                        <p className="text-gray-600">Update a rating or review for any previously rated product.</p>
                    </div>

                    {completedReviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                            <div className="flex flex-col lg:flex-row items-start gap-6">
                                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                                    {review.image ? (
                                        <img
                                            src={`http://localhost:5000${review.image}`}
                                            alt={review.productName || 'Product image'}
                                            className="w-full h-full object-cover rounded-2xl"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <span className="text-2xl">📦</span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{review.productName || review.productId}</h3>
                                            <p className="text-gray-600 mt-1">Rated on {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {submitting[review._id] && (
                                            <div className="flex items-center gap-2 text-emerald-600">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                                                <span className="text-sm">Updating...</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-gray-700 font-medium mb-3">Current Rating</p>
                                        {renderStarRating(review._id, ratings[review._id] ?? review.rating ?? 0)}
                                        <p className="text-sm text-gray-500 mt-2">
                                            {ratings[review._id] ?? review.rating} star{(ratings[review._id] ?? review.rating) !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 font-medium mb-2">Your Review</label>
                                        <textarea
                                            value={reviews[review._id] ?? review.review ?? ''}
                                            onChange={(e) => handleReviewChange(review._id, e.target.value)}
                                            placeholder="Update your review for this product."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                            rows="3"
                                            disabled={submitting[review._id]}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">{(reviews[review._id] ?? review.review ?? '').length}/500 characters</p>
                                    </div>

                                    <div className="text-right">
                                        <button
                                            onClick={() => handleUpdateCompletedReview(review._id)}
                                            disabled={submitting[review._id]}
                                            className="inline-flex items-center justify-center px-8 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-colors font-semibold"
                                        >
                                            Update Rating
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Navigation */}
            <div className="mt-12 text-center">
                <div className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
                    <p className="text-gray-600 mb-4">Contact us if you have any issues with your reviews.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                            onClick={() => navigate('/products')}
                            className="px-4 py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors"
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