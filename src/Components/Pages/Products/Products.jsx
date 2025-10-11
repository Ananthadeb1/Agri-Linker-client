import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Products = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searching, setSearching] = useState(false);
    const [cartQuantities, setCartQuantities] = useState({});
    const [addingToCart, setAddingToCart] = useState({});
    const [productRatings, setProductRatings] = useState({}); // Store ratings for each product
    const [selectedProductReviews, setSelectedProductReviews] = useState(null); // For popup
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [user, axiosSecure]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            if (user?.email) {
                const response = await axiosSecure.get(`/api/products/recommended/${user.email}`);
                setProducts(response.data);
                setAllProducts(response.data);
                // Fetch ratings for all products
                fetchProductRatings(response.data);
            } else {
                const response = await axiosSecure.get('/api/products');
                setProducts(response.data);
                setAllProducts(response.data);
                // Fetch ratings for all products
                fetchProductRatings(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch average ratings for all products
    const fetchProductRatings = async (productsList) => {
        try {
            const ratingPromises = productsList.map(product => 
                axiosSecure.get(`/api/rating-review/product/${product._id}`)
            );
            
            const ratingsResponses = await Promise.all(ratingPromises);
            const ratingsMap = {};
            
            ratingsResponses.forEach((response, index) => {
                const productId = productsList[index]._id;
                ratingsMap[productId] = response.data;
            });
            
            setProductRatings(ratingsMap);
        } catch (error) {
            console.error("Error fetching product ratings:", error);
        }
    };

    // Fetch reviews for a specific product
    const fetchProductReviews = async (productId) => {
        try {
            setLoadingReviews(true);
            const response = await axiosSecure.get(`/api/rating-review/product/${productId}/reviews`);
            setSelectedProductReviews({
                productId,
                reviews: response.data.reviews,
                averageRating: response.data.averageRating
            });
        } catch (error) {
            console.error("Error fetching product reviews:", error);
            alert('Failed to load reviews');
        } finally {
            setLoadingReviews(false);
        }
    };

    // Close reviews popup
    const closeReviewsPopup = () => {
        setSelectedProductReviews(null);
    };

    // Calculate star display
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="text-yellow-400">★</span>);
        }
        
        if (hasHalfStar) {
            stars.push(<span key="half" className="text-yellow-400">★</span>);
        }
        
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
        }
        
        return stars;
    };

    // Your existing functions remain the same...
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            alert("Please enter a search term");
            return;
        }
        if (!user?.email) {
            const filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (filtered.length > 0) setProducts(filtered);
            else alert('No products found with that name!');
            return;
        }
        try {
            setSearching(true);
            const response = await axiosSecure.post('/api/search-product', { searchTerm: searchTerm.trim() });
            if (response.data.products && response.data.products.length > 0) {
                setProducts(response.data.products);
                fetchProductRatings(response.data.products);
                console.log(`Category "${response.data.trackedCategory}" count increased!`);
            } else {
                alert('No products found with that name!');
            }
        } catch (error) {
            if (error.response?.status === 404) alert('No products found with that name!');
            else {
                console.error("Search error:", error);
                alert('An error occurred during search');
            }
        } finally {
            setSearching(false);
        }
    };

    const handleReset = () => {
        setSearchTerm("");
        setProducts(allProducts);
    };

    const handleRefresh = async () => {
        setSearchTerm("");
        await fetchProducts();
    };

    // Input field logic for correct UX/validation
    const handleQuantityFocus = (productId) => {
        if (!cartQuantities[productId] || cartQuantities[productId] === 0) {
            setCartQuantities(prev => ({ ...prev, [productId]: "" }));
        }
    };

    const handleQuantityBlur = (productId) => {
        if (cartQuantities[productId] === "" || cartQuantities[productId] === undefined) {
            setCartQuantities(prev => ({ ...prev, [productId]: 0 }));
        }
    };

    const handleQuantityChange = (productId, value, maxValue) => {
        if (value === "") {
            setCartQuantities(prev => ({ ...prev, [productId]: "" }));
            return;
        }
        const v = Number(value);
        if (!Number.isInteger(v) || v < 0 || v > maxValue) return;
        setCartQuantities(prev => ({ ...prev, [productId]: v }));
    };

    const isValidQuantity = (value, maxValue) => {
        if (value === "" || value === undefined) return false;
        const v = Number(value);
        return Number.isInteger(v) && v > 0 && v <= maxValue;
    };

    const handleAddToCart = async (product) => {
        const quantity = cartQuantities[product._id];

        console.log("🛒 Starting Add to Cart:", {
            productId: product._id,
            quantity: quantity,
            user: user
        });

        if (!quantity || quantity < 1) {
            alert("Please enter a valid quantity");
            return;
        }

        if (!user) {
            alert("Please login to add items to cart");
            return;
        }

        try {
            setAddingToCart(prev => ({ ...prev, [product._id]: true }));

            const cartData = {
                productName: product.name,
                category: product.category,
                orderedQuantity: Number(quantity),
                buyerId: user.email, // Use email as buyerId
                productId: product._id.toString(), // Ensure it's a string
                unit: product.quantity.unit,
                price: product.price,
                image: product.image
            };

            console.log("📦 Sending cart data:", cartData);

            const response = await axiosSecure.post('/api/cart/add', cartData);

            console.log("✅ Backend response:", response.data);

            if (response.data.success) {
                alert(`Added ${quantity} ${product.quantity.unit} of ${product.name} to cart!`);
                setCartQuantities(prev => ({ ...prev, [product._id]: 0 }));
            } else {
                alert('Failed to add item to cart: ' + response.data.message);
            }
        } catch (error) {
            console.error("❌ Full error object:", error);
            console.error("❌ Error response:", error.response?.data);
            console.error("❌ Error status:", error.response?.status);

            if (error.response?.data?.message) {
                alert('Error: ' + error.response.data.message);
            } else if (error.message) {
                alert('Error: ' + error.message);
            } else {
                alert('Unknown error adding item to cart');
            }
        } finally {
            setAddingToCart(prev => ({ ...prev, [product._id]: false }));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Reviews Popup */}
            {selectedProductReviews && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Product Reviews</h3>
                                <button
                                    onClick={closeReviewsPopup}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            {loadingReviews ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    <p className="text-gray-600 mt-2">Loading reviews...</p>
                                </div>
                            ) : selectedProductReviews.reviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No reviews yet for this product.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            {renderStars(selectedProductReviews.averageRating)}
                                            <span className="text-lg font-semibold text-gray-800 ml-2">
                                                {selectedProductReviews.averageRating.toFixed(1)}
                                            </span>
                                            <span className="text-gray-600">
                                                ({selectedProductReviews.reviews.length} reviews)
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {selectedProductReviews.reviews.map((review, index) => (
                                            <div key={index} className="border-b border-gray-200 pb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {renderStars(review.rating)}
                                                    <span className="text-sm text-gray-600">
                                                        by {review.userId}
                                                    </span>
                                                </div>
                                                {review.review && (
                                                    <p className="text-gray-700">{review.review}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Fresh Agricultural Products
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover the finest selection of farm-fresh vegetables, fruits, grains and more.
                    {user?.email && " Your personalized recommendations are waiting!"}
                </p>
            </div>

            {/* Search Section */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products (e.g., apple, potato, rice)..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={searching}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 font-medium"
                    >
                        {searching ? 'Searching...' : 'Search'}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                        Reset
                    </button>
                    {user?.email && (
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                        >
                            Refresh
                        </button>
                    )}
                </form>
                {user?.email && (
                    <p className="text-sm text-gray-500 mt-3 text-center">
                        💡 Search products to build your preferences. Products will be sorted based on your search history!
                    </p>
                )}
            </div>

            {/* Products Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {searchTerm ? 'Search Results' : user?.email ? 'Recommended For You' : 'All Products'}
                    </h2>
                    <p className="text-gray-600">
                        {products.length} product{products.length !== 1 ? 's' : ''} found
                    </p>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="text-xl text-gray-600 mt-4">Loading products...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No products available</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Refresh Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const value = cartQuantities[product._id] !== undefined ? cartQuantities[product._id] : 0;
                        const maxAvailable = product.quantity.value;
                        const validQuantity = isValidQuantity(value, maxAvailable);
                        const isAdding = addingToCart[product._id];
                        const productRating = productRatings[product._id];
                        const averageRating = productRating?.averageRating || 0;
                        const reviewCount = productRating?.reviewCount || 0;

                        return (
                            <div
                                key={product._id}
                                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between bg-white"
                                style={{ minHeight: "410px" }}
                            >
                                {/* Product Image with Info Button */}
                                <div className="h-48 bg-gray-100 relative">
                                    <img
                                        src={`http://localhost:5000${product.image ? product.image : '/img'}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                        }}
                                    />
                                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${product.status === 'available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.status}
                                    </span>
                                    
                                    {/* Info Button */}
                                    <button
                                        onClick={() => fetchProductReviews(product._id)}
                                        className="absolute top-2 left-2 w-6 h-6 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-xs hover:bg-opacity-70 transition"
                                        title="View Reviews"
                                    >
                                        i
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4 flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded whitespace-nowrap ml-2">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Rating Display */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex">
                                            {renderStars(averageRating)}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            ({reviewCount})
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-2">
                                        Available: {product.quantity.value} {product.quantity.unit}
                                    </p>

                                    <div className="flex justify-between items-center mt-auto">
                                        <p className="text-xl font-bold text-green-600">
                                            {product.price} Taka per {product.quantity.unit}
                                        </p>
                                    </div>

                                    <p className="text-xs text-gray-500 mt-2">
                                        Sold by: {product.farmerEmail}
                                    </p>
                                </div>

                                {/* Add to Cart Section */}
                                <div className="p-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                            Quantity:
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={maxAvailable}
                                            value={value}
                                            onFocus={() => handleQuantityFocus(product._id)}
                                            onBlur={() => handleQuantityBlur(product._id)}
                                            onChange={e => handleQuantityChange(product._id, e.target.value, maxAvailable)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                            disabled={isAdding || product.status !== 'available'}
                                            placeholder="0"
                                        />
                                        <span className="text-sm text-gray-500 whitespace-nowrap">
                                            {product.quantity.unit}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={!validQuantity || product.status !== 'available' || isAdding}
                                        className={`w-full px-4 py-2 rounded font-medium transition ${validQuantity && product.status === 'available' && !isAdding
                                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {isAdding ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Adding...
                                            </span>
                                        ) : (
                                            'Add to Cart'
                                        )}
                                    </button>

                                    {!user && (
                                        <p className="text-xs text-red-500 text-center mt-2">
                                            Please login to add to cart
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Products;