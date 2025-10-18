import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Payment from "./Payment"; // Import the Payment component

const Cart = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false); // New state for payment modal

    useEffect(() => {
        if (user?.email) {
            fetchCartItems();
        }
    }, [user]);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axiosSecure.get(`/api/cart/user/${user.email}`);
            if (response.data.success) {
                setCartItems(response.data.items);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            const response = await axiosSecure.delete(`/api/cart/remove/${cartItemId}`);
            if (response.data.success) {
                alert("Item removed from cart!");
                fetchCartItems();
            }
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Failed to remove item from cart");
        }
    };

    // New function to handle payment success
    const handlePaymentSuccess = async (paymentData) => {
        try {
            console.log("🛒 Placing order via OrderTrack for user:", user.email);
            console.log("💰 Payment data:", paymentData);

            // Use OrderTrack instead of orders
            const response = await axiosSecure.post('/api/OrderTrack/create', {
                userId: user.email,
                paymentMethod: paymentData.paymentMethod,
                paymentStatus: 'completed',
                totalAmount: calculateTotal()
            });

            console.log("✅ OrderTrack response:", response.data);

            if (response.data.success) {
                setTrackingNumber(response.data.trackingNumber);
                setShowTrackingModal(true);
                setOrderPlaced(true);
                setCartItems([]);
                fetchCartItems();
            } else {
                alert('Order failed: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error("❌ Order error:", error);
            console.error("❌ Error response:", error.response?.data);

            if (error.response?.data?.message) {
                alert('Order failed: ' + error.response.data.message);
            } else {
                alert('Failed to place order. Please try again.');
            }
        }
    };

    // Modified handleOrderNow to show payment modal
    const handleOrderNow = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        setShowPaymentModal(true);
    };

    const handleTrackOrder = () => {
        if (trackingNumber) {
            setShowTrackingModal(false);
            navigate('/track-order', {
                state: { trackingNumber: trackingNumber }
            });
        } else {
            alert('Please wait while your order is being processed...');
        }
    };

    const handleRateProducts = () => {
        setShowTrackingModal(false);
        navigate('/rating-review', {
            state: {
                orderedProducts: cartItems,
                trackingNumber: trackingNumber
            }
        });
    };

    const copyToClipboard = () => {
        if (trackingNumber) {
            navigator.clipboard.writeText(trackingNumber)
                .then(() => {
                    alert('Order ID copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy to clipboard');
                });
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.orderedQuantity), 0);
    };

    const getTotalQuantity = () => {
        return cartItems.reduce((sum, item) => sum + item.orderedQuantity, 0);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-xl text-gray-600 mt-4">Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>

            {cartItems.length === 0 && !orderPlaced ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m5.5-5.5h5.5m-5.5 0V19a2 2 0 104 0v-1.5m-4-4.5h4"></path>
                        </svg>
                    </div>
                    <p className="text-xl text-gray-600">Your cart is empty</p>
                    <p className="text-gray-500 mt-2">Add some products to see them here!</p>

                    <div className="mt-6 space-y-4">
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold mx-2"
                        >
                            Browse Products
                        </button>
                        <button
                            onClick={() => navigate('/track-order')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold mx-2"
                        >
                            Track Existing Order
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md">
                            {cartItems.map((item) => (
                                <div key={item._id} className="border-b border-gray-200 p-6 flex items-center">
                                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                        {item.image && (
                                            <img
                                                src={`http://localhost:5000${item.image}`}
                                                alt={item.productName}
                                                className="w-full h-20 object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="ml-6 flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{item.productName}</h3>
                                        <p className="text-gray-600 text-sm">Category: {item.category}</p>
                                        <p className="text-gray-600 text-sm">Quantity: {item.orderedQuantity} {item.unit}</p>
                                        <p className="text-green-600 font-semibold">Price: {item.price} Taka per {item.unit}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800">
                                            {item.price * item.orderedQuantity} Taka
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items:</span>
                                    <span className="font-semibold">{cartItems.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Quantity:</span>
                                    <span className="font-semibold">{getTotalQuantity()}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-green-600">{calculateTotal()} Taka</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleOrderNow}
                                disabled={cartItems.length === 0}
                                className={`w-full py-3 rounded-lg transition font-semibold ${cartItems.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                {cartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Payment'}
                            </button>
                        </div>

                        {/* Quick Tracking Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Track Your Order</h2>
                            <p className="text-gray-600 mb-4">Already placed an order? Track it here:</p>
                            <button
                                onClick={() => navigate('/track-order')}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                            >
                                Track Existing Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <Payment
                    cartItems={cartItems}
                    totalAmount={calculateTotal()}
                    userId={user.email}
                    onPaymentSuccess={handlePaymentSuccess}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}

            {/* Order Success Modal */}
            {showTrackingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully! 🎉</h3>

                            <p className="text-gray-600 mb-4">Your order has been confirmed and is being processed.</p>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-sm text-gray-600 mb-2">Your Order ID:</p>
                                <div className="flex items-center justify-between bg-white p-3 rounded border">
                                    <span className="font-mono font-bold text-lg text-blue-600 break-all">
                                        {trackingNumber || "Generating..."}
                                    </span>
                                    {trackingNumber && (
                                        <button
                                            onClick={copyToClipboard}
                                            className="text-blue-500 hover:text-blue-700 ml-2 flex-shrink-0"
                                            title="Copy to clipboard"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mb-6">
                                Save this Order ID to check your order status anytime.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={handleTrackOrder}
                                    disabled={!trackingNumber}
                                    className={`w-full py-3 rounded-lg transition font-semibold ${!trackingNumber
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    {!trackingNumber ? 'Processing...' : 'Track This Order'}
                                </button>
                                <button
                                    onClick={handleRateProducts}
                                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
                                >
                                    Rate Products
                                </button>
                                <button
                                    onClick={() => setShowTrackingModal(false)}
                                    className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Information */}
            {cartItems.length > 0 && (
                <div className="mt-12 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-600 mb-2">
                                <strong>Email:</strong> contact@agrilinker.com
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>Phone:</strong> 01612245678
                            </p>
                            <p className="text-gray-600">
                                <strong>Address:</strong> 123 Nahm Bazar, Dhaka, Bangladesh
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-4">
                                <strong>Follow Us:</strong> Join us on social media
                            </p>
                            <div className="flex space-x-4">
                                <button className="text-blue-600 hover:text-blue-800 transition">
                                    <span className="sr-only">Facebook</span>
                                    📘
                                </button>
                                <button className="text-blue-400 hover:text-blue-600 transition">
                                    <span className="sr-only">Twitter</span>
                                    🐦
                                </button>
                                <button className="text-pink-600 hover:text-pink-800 transition">
                                    <span className="sr-only">Instagram</span>
                                    📷
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;