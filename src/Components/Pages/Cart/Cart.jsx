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
    const [showPayment, setShowPayment] = useState(false); // Add state for payment modal

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
                fetchCartItems(); // Refresh the cart
            }
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Failed to remove item from cart");
        }
    };

    // Updated handleOrderNow to show payment interface
    const handleOrderNow = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        setShowPayment(true);
    };

    // Handle successful payment
    const handlePaymentSuccess = (order) => {
        setShowPayment(false);
        setCartItems([]);
        fetchCartItems();
        
        // Navigate to rating and review page
        navigate('/rating-review', { 
            state: { 
                orderedProducts: order.items 
            } 
        });
    };

    // Handle payment close
    const handlePaymentClose = () => {
        setShowPayment(false);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.orderedQuantity), 0);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">Your cart is empty</p>
                    <p className="text-gray-500 mt-2">Add some products to see them here!</p>
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

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Items:</span>
                                    <span>{cartItems.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Quantity:</span>
                                    <span>{cartItems.reduce((sum, item) => sum + item.orderedQuantity, 0)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span>{calculateTotal()} Taka</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={handleOrderNow}
                                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
                            >
                                Order Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPayment && (
                <Payment
                    cartItems={cartItems}
                    totalAmount={calculateTotal()}
                    userId={user.email}
                    onPaymentSuccess={handlePaymentSuccess}
                    onClose={handlePaymentClose}
                />
            )}
        </div>
    );
};

export default Cart;