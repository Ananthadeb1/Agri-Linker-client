import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const RatingReview = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [orderedProducts, setOrderedProducts] = useState([]);
    const [ratings, setRatings] = useState({});
    const [reviews, setReviews] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (location.state?.orderedProducts) {
            setOrderedProducts(location.state.orderedProducts);
        } else {
            // If no products, redirect back
            navigate('/cart');
        }
    }, [location, navigate]);

    const handleRatingChange = (productId, rating) => {
        setRatings(prev => ({
            ...prev,
            [productId]: rating
        }));
    };

    const handleReviewChange = (productId, review) => {
        setReviews(prev => ({
            ...prev,
            [productId]: review
        }));
    };

    const handleSubmitReview = async (productId) => {
        if (!ratings[productId]) {
            alert('Please select a rating before submitting');
            return;
        }

        setSubmitting(true);
        try {
            const reviewData = {
                userId: user.email,
                productId: productId,
                rating: ratings[productId],
                review: reviews[productId] || ""
            };

            const response = await axiosSecure.post('/api/rating-review/submit', reviewData);
            
            if (response.data.success) {
                alert('Review submitted successfully!');
                // Remove the product from the list after successful submission
                setOrderedProducts(prev => prev.filter(product => product.productId !== productId));
            }
        } catch (error) {
            alert('Failed to submit review: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelReview = (productId) => {
        // Simply remove the product from the list
        setOrderedProducts(prev => prev.filter(product => product.productId !== productId));
    };

    const handleSkipAll = () => {
        navigate('/'); // Redirect to home or orders page
    };

    if (orderedProducts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h1>
                <p className="text-gray-600">You have completed all reviews.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Rate Your Products</h1>
            <p className="text-gray-600 mb-8">Share your experience with the products you ordered</p>

            <div className="space-y-6">
                {orderedProducts.map((product) => (
                    <div key={product.productId} className="bg-white rounded-lg shadow-md p-6 border">
                        <div className="flex items-start gap-4">
                            <img 
                                src={`http://localhost:5000${product.image}`} 
                                alt={product.productName}
                                className="w-20 h-20 object-cover rounded"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                }}
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800">{product.productName}</h3>
                                <p className="text-gray-600">Quantity: {product.orderedQuantity} {product.unit}</p>
                                
                                {/* Star Rating */}
                                <div className="my-4">
                                    <p className="text-gray-700 mb-2">How would you rate this product?</p>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleRatingChange(product.productId, star)}
                                                className={`text-2xl ${ratings[product.productId] >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Review Text */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Your Review (Optional)</label>
                                    <textarea
                                        value={reviews[product.productId] || ''}
                                        onChange={(e) => handleReviewChange(product.productId, e.target.value)}
                                        placeholder="Share your experience with this product..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows="3"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleSubmitReview(product.productId)}
                                        disabled={submitting || !ratings[product.productId]}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button
                                        onClick={() => handleCancelReview(product.productId)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Skip Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Skip All Button */}
            <div className="mt-8 text-center">
                <button
                    onClick={handleSkipAll}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                    Skip All Reviews
                </button>
            </div>
        </div>
    );
};

export default RatingReview;