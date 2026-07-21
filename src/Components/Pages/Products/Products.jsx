import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Payment from "../Cart/Payment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Reusable unicode icons (kept as escape sequences so the file never breaks
// due to editor / OS encoding issues, which was the root cause of the
// "broken star" and "broken minus sign" bugs before this fix)
const ICON_STAR = '\u2605';   // ★
const ICON_MINUS = '\u2212';  // −
const ICON_CLOSE = '\u00D7';  // ×
const ICON_BULB = '\u{1F4A1}'; // 💡
const ICON_ERROR = '\u274C';  // ❌

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
    const [selectedBuyNowProduct, setSelectedBuyNowProduct] = useState(null);
    const [buyNowQuantity, setBuyNowQuantity] = useState(1);
    const [showBuyNowSummary, setShowBuyNowSummary] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [ setProcessingBuyNow] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [user, axiosSecure]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            if (user?.email) {
                const response = await axiosSecure.get(`/api/products/recommended/${user.email}`);
                const availableProducts = response.data.filter(product => product?.quantity?.value > 0 && product.status !== 'sold-out');
                setProducts(availableProducts);
                setAllProducts(availableProducts);
                fetchProductRatings(availableProducts);
            } else {
                const response = await axiosSecure.get('/api/products');
                const availableProducts = response.data.filter(product => product?.quantity?.value > 0 && product.status !== 'sold-out');
                setProducts(availableProducts);
                setAllProducts(availableProducts);
                fetchProductRatings(availableProducts);
            }
            setCurrentPage(1);
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
            Swal.fire({ icon: 'error', title: 'Reviews failed', text: 'Failed to load reviews.' });
        } finally {
            setLoadingReviews(false);
        }
    };

    // Close reviews popup
    const closeReviewsPopup = () => {
        setSelectedProductReviews(null);
    };

    // Calculate star display (fixed: was rendering broken/garbled characters
    // due to a bad-encoding literal; now uses a safe unicode escape constant)
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="text-yellow-400">{ICON_STAR}</span>);
        }

        if (hasHalfStar) {
            stars.push(<span key="half" className="text-yellow-400">{ICON_STAR}</span>);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="text-gray-300">{ICON_STAR}</span>);
        }

        return stars;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            Swal.fire({ icon: 'warning', title: 'Search Required', text: 'Please enter a search term.' });
            return;
        }
        if (!user?.email) {
            const filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (filtered.length > 0) {
                setProducts(filtered);
                setCurrentPage(1);
            } else {
                Swal.fire({ icon: 'info', title: 'No results', text: 'No products found with that name!' });
            }
            return;
        }
        try {
            setSearching(true);
            const response = await axiosSecure.post('/api/search-product', { searchTerm: searchTerm.trim() });
            if (response.data.products && response.data.products.length > 0) {
                const availableProducts = response.data.products.filter(product => product?.quantity?.value > 0 && product.status !== 'sold-out');
                setProducts(availableProducts);
                setCurrentPage(1);
                fetchProductRatings(availableProducts);
            } else {
                Swal.fire({ icon: 'info', title: 'No results', text: 'No products found with that name!' });
            }
        } catch (error) {
            if (error.response?.status === 404) {
                Swal.fire({ icon: 'info', title: 'No results', text: 'No products found with that name!' });
            } else {
                console.error("Search error:", error);
                Swal.fire({ icon: 'error', title: 'Search failed', text: 'An error occurred during search.' });
            }
        } finally {
            setSearching(false);
        }
    };

    const handleReset = () => {
        setSearchTerm("");
        setProducts(allProducts);
        setCurrentPage(1);
    };

    const handleRefresh = async () => {
        setSearchTerm("");
        await fetchProducts();
    };

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

        if (!quantity || quantity < 1) {
            Swal.fire({ icon: 'warning', title: 'Invalid quantity', text: 'Please enter a valid quantity.' });
            return;
        }

        if (!user) {
            Swal.fire({ icon: 'warning', title: 'Login required', text: 'Please login to add items to cart.' });
            return;
        }

        try {
            setAddingToCart(prev => ({ ...prev, [product._id]: true }));

            const cartData = {
                productName: product.name,
                category: product.category,
                orderedQuantity: Number(quantity),
                buyerId: user.email,
                productId: product._id.toString(),
                unit: product.quantity.unit,
                price: product.price,
                image: product.image
            };

            const response = await axiosSecure.post('/api/cart/add', cartData);

            if (response.data.success) {
                Swal.fire({ icon: 'success', title: 'Added to Cart', text: `Added ${quantity} ${product.quantity.unit} of ${product.name} to cart!` });
                setCartQuantities(prev => ({ ...prev, [product._id]: 0 }));
            } else {
                Swal.fire({ icon: 'error', title: 'Add failed', text: response.data.message || 'Failed to add item to cart.' });
            }
        } catch (error) {
            console.error(`${ICON_ERROR} Cart error:`, error);
            Swal.fire({ icon: 'error', title: 'Add failed', text: error.response?.data?.message || error.message || 'Unknown error adding item to cart.' });
        } finally {
            setAddingToCart(prev => ({ ...prev, [product._id]: false }));
        }
    };

    // Builds the order payload for a "Buy Now" purchase. Extracted into a
    // helper so it isn't duplicated between the Payment component props and
    // the order-creation call.
    const buildBuyNowOrderItem = (product, quantity) => ({
        productName: product.name,
        category: product.category,
        orderedQuantity: quantity,
        buyerId: user?.email,
        productId: product._id.toString(),
        unit: product.quantity.unit,
        price: product.price,
        image: product.image
    });

    // After a successful order, decrease the purchased quantity locally
    // (and drop the product from the list if it's now sold out) instead of
    // re-fetching or reloading the page. This keeps the UI in sync without
    // any navigation/reload.
    const updateProductQuantityAfterOrder = (productId, purchasedQty) => {
        const applyUpdate = (list) =>
            list
                .map((p) => {
                    if (p._id !== productId) return p;
                    const remaining = p.quantity.value - purchasedQty;
                    return {
                        ...p,
                        quantity: { ...p.quantity, value: remaining },
                        status: remaining <= 0 ? 'sold-out' : p.status
                    };
                })
                .filter((p) => p.quantity.value > 0 && p.status !== 'sold-out');

        setProducts((prev) => applyUpdate(prev));
        setAllProducts((prev) => applyUpdate(prev));
    };

    const filteredProducts = products;
    const productsPerPage = 8;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

    // Keep currentPage valid if the product list shrinks (e.g. after an
    // order removes a sold-out product) so we never render an empty page.
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    return (
        <div className="container mx-auto px-4 py-8">
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
                                    {ICON_CLOSE}
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

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Fresh Agricultural Products</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover the finest selection of farm-fresh vegetables, fruits, grains and more.
                    {user?.email && " Your personalized recommendations are waiting!"}
                </p>
            </div>

            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto flex-col sm:flex-row">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products (e.g., apple, potato, rice)..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-3 gap-2">
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
                    </div>
                </form>
                {user?.email && (
                    <p className="text-sm text-gray-500 mt-3 text-center">
                        {ICON_BULB} Search products to build your preferences. Products will be sorted based on your search history!
                    </p>
                )}
            </div>

            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {searchTerm ? 'Search Results' : user?.email ? 'Recommended For You' : 'All Available Products'}
                    </h2>
                    <p className="text-gray-600">
                        {products.length} product{products.length !== 1 ? 's' : ''} available now
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="text-xl text-gray-600 mt-4">Loading products...</p>
                </div>
            ) : currentProducts.length === 0 ? (
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
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentProducts.map((product) => {
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
                                    style={{ minHeight: "430px" }}
                                >
                                    <div className="h-48 bg-gray-100 relative">
                                        <img
                                            src={`${API_BASE_URL}${product.image ? product.image : '/img'}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                            }}
                                        />
                                        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${product.status === 'available' && product.quantity.value > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.status === 'available' && product.quantity.value > 0 ? 'available' : 'sold-out'}
                                        </span>

                                        <button
                                            onClick={() => fetchProductReviews(product._id)}
                                            className="absolute top-2 left-2 w-6 h-6 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-xs hover:bg-opacity-70 transition"
                                            title="View Reviews"
                                        >
                                            i
                                        </button>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded whitespace-nowrap ml-2">
                                                {product.category}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex">{renderStars(averageRating)}</div>
                                            <span className="text-sm text-gray-600">({reviewCount})</span>
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

                                    <div className="p-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(product._id, Math.max(1, Number(value || 0) - 1), maxAvailable)}
                                                className="w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition"
                                                disabled={value <= 1 || product.status !== 'available'}
                                            >
                                                {ICON_MINUS}
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={maxAvailable}
                                                value={value}
                                                onFocus={() => handleQuantityFocus(product._id)}
                                                onBlur={() => handleQuantityBlur(product._id)}
                                                onChange={e => handleQuantityChange(product._id, e.target.value, maxAvailable)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                                disabled={isAdding || product.status !== 'available'}
                                                placeholder="0"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(product._id, Math.min(maxAvailable, Number(value || 0) + 1), maxAvailable)}
                                                className="w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition"
                                                disabled={value >= maxAvailable || product.status !== 'available'}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={!validQuantity || product.status !== 'available' || isAdding}
                                                className={`px-4 py-2 rounded font-medium transition ${validQuantity && product.status === 'available' && !isAdding
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
                                            <button
                                                onClick={() => {
                                                    if (!validQuantity || product.status !== 'available') {
                                                        return;
                                                    }
                                                    setSelectedBuyNowProduct(product);
                                                    setBuyNowQuantity(value || 1);
                                                    setShowBuyNowSummary(true);
                                                }}
                                                disabled={!validQuantity || product.status !== 'available'}
                                                className={`px-4 py-2 rounded font-medium transition ${validQuantity && product.status === 'available'
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                Buy Now
                                            </button>
                                        </div>

                                        {!user && (
                                            <p className="text-xs text-red-500 text-center mt-2">
                                                Please login to order or add to cart
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-4 py-2 rounded-lg border ${currentPage === index + 1 ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {showBuyNowSummary && selectedBuyNowProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Confirm Purchase</h2>
                                <p className="text-sm text-gray-500">Review your order before continuing to payment.</p>
                            </div>
                            <button onClick={() => setShowBuyNowSummary(false)} className="text-gray-500 hover:text-gray-900 text-2xl">{ICON_CLOSE}</button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-lg overflow-hidden bg-gray-50">
                                    <img
                                        src={`${API_BASE_URL}${selectedBuyNowProduct.image}`}
                                        alt={selectedBuyNowProduct.name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{selectedBuyNowProduct.name}</h3>
                                    <p className="text-gray-600 mt-2">{selectedBuyNowProduct.category} &bull; Sold by {selectedBuyNowProduct.farmerEmail}</p>
                                    <p className="mt-4 text-gray-700">Unit price: <span className="font-semibold">{selectedBuyNowProduct.price} Taka</span></p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setBuyNowQuantity(prev => Math.max(1, prev - 1))}
                                            className="w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                        >
                                            {ICON_MINUS}
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={selectedBuyNowProduct.quantity.value}
                                            value={buyNowQuantity}
                                            onChange={(e) => {
                                                const nextValue = Number(e.target.value);
                                                if (!Number.isInteger(nextValue) || nextValue < 1) return;
                                                if (nextValue > selectedBuyNowProduct.quantity.value) return;
                                                setBuyNowQuantity(nextValue);
                                            }}
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setBuyNowQuantity(prev => Math.min(selectedBuyNowProduct.quantity.value, prev + 1))}
                                            className="w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <div className="flex justify-between text-gray-700 mb-2">
                                    <span>Quantity</span>
                                    <span>{buyNowQuantity} {selectedBuyNowProduct.quantity.unit}</span>
                                </div>
                                <div className="flex justify-between text-gray-700 mb-2">
                                    <span>Price per unit</span>
                                    <span>{selectedBuyNowProduct.price} Taka</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold text-gray-900">
                                    <span>Total</span>
                                    <span>{selectedBuyNowProduct.price * buyNowQuantity} Taka</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPaymentModal(true);
                                        setShowBuyNowSummary(false);
                                    }}
                                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                                >
                                    Place Order
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowBuyNowSummary(false)}
                                    className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPaymentModal && selectedBuyNowProduct && (
                <Payment
                    cartItems={[buildBuyNowOrderItem(selectedBuyNowProduct, buyNowQuantity)]}
                    totalAmount={selectedBuyNowProduct.price * buyNowQuantity}
                    userId={user?.email}
                    onPaymentSuccess={async (paymentData) => {
                        setShowPaymentModal(false);
                        if (!user?.email) {
                            Swal.fire({ icon: 'error', title: 'Login required', text: 'Please login to complete your purchase.' });
                            return;
                        }

                        // Capture the product id/qty before we clear the selection below
                        const orderedProductId = selectedBuyNowProduct._id;
                        const orderedQty = buyNowQuantity;
                        const orderItems = [buildBuyNowOrderItem(selectedBuyNowProduct, orderedQty)];

                        try {
                            setProcessingBuyNow(true);
                            const response = await axiosSecure.post('/api/OrderTrack/create', {
                                userId: user.email,
                                cartItems: orderItems,
                                paymentMethod: paymentData.paymentMethod,
                                paymentStatus: paymentData.paymentStatus,
                                totalAmount: selectedBuyNowProduct.price * orderedQty
                            });

                            if (response.data.success) {
                                const trackingNumber = response.data.trackingNumber;

                                // Update the product list in place (no page reload/navigation).
                                // The ordered product's quantity is reduced immediately, and it's
                                // removed from the list automatically if it becomes sold out.
                                updateProductQuantityAfterOrder(orderedProductId, orderedQty);

                                Swal.fire({
                                    icon: 'success',
                                    title: 'Order Confirmed',
                                    html: `Your order has been placed successfully.<br><strong>Tracking ID:</strong> ${trackingNumber}<br/><a href="/track-order" style="color:#16a34a;text-decoration:underline;">View Order Tracking</a>`,
                                    confirmButtonText: 'OK'
                                });

                                setSelectedBuyNowProduct(null);
                                setBuyNowQuantity(1);
                            } else {
                                Swal.fire({ icon: 'error', title: 'Order Failed', text: response.data.message || 'Could not place order.' });
                            }
                        } catch (error) {
                            console.error('Buy now order failed:', error);
                            Swal.fire({ icon: 'error', title: 'Order Failed', text: error.response?.data?.message || error.message || 'Could not place order.' });
                        } finally {
                            setProcessingBuyNow(false);
                        }
                    }}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}
        </div>
    );
};

export default Products;