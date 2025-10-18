import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { FiPackage, FiTruck, FiCheckCircle, FiHome, FiClock } from 'react-icons/fi';

const OrderTracking = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const axiosSecure = useAxiosSecure();
    const location = useLocation();

    // Initialize tracking number from navigation state
    useEffect(() => {
        if (location.state?.trackingNumber) {
            setTrackingNumber(location.state.trackingNumber);
            handleTrackOrder(location.state.trackingNumber);
        }
    }, [location]);

    const handleTrackOrder = async (trackingNum = null) => {
        const trackNum = trackingNum || trackingNumber;
        
        if (!trackNum.trim()) {
            setError('Please enter a tracking number');
            return;
        }

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            console.log("🔍 Tracking order:", trackNum);
            const response = await axiosSecure.get(`/api/OrderTrack/track/${trackNum}`);
            
            if (response.data.success) {
                console.log("✅ Order found:", response.data.order);
                setOrder(response.data.order);
            } else {
                setError('Order not found');
            }
        } catch (error) {
            console.error("❌ Tracking error:", error);
            setError(error.response?.data?.message || 'Order not found or server error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <FiCheckCircle className="text-green-500 text-xl" />;
            case 'Shipped': return <FiTruck className="text-blue-500 text-xl" />;
            case 'Processing': return <FiPackage className="text-yellow-500 text-xl" />;
            case 'Order Placed': return <FiClock className="text-purple-500 text-xl" />;
            default: return <FiPackage className="text-gray-500 text-xl" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-600 bg-green-100';
            case 'Shipped': return 'text-blue-600 bg-blue-100';
            case 'Processing': return 'text-yellow-600 bg-yellow-100';
            case 'Order Placed': return 'text-purple-600 bg-purple-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusSteps = (currentStatus) => {
        const steps = [
            { status: 'Order Placed', label: 'Order Placed', description: 'Your order has been received' },
            { status: 'Processing', label: 'Processing', description: 'Preparing your order' },
            { status: 'Shipped', label: 'Shipped', description: 'Order is on the way' },
            { status: 'Delivered', label: 'Delivered', description: 'Order delivered successfully' }
        ];

        const currentIndex = steps.findIndex(step => step.status === currentStatus);
        
        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            current: index === currentIndex
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Tracking</h1>
                    <p className="text-gray-600">Track your order in real-time</p>
                </div>

                {/* Tracking Input */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter your tracking number"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                        />
                        <button
                            onClick={() => handleTrackOrder()}
                            disabled={loading}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Tracking...' : 'Track Order'}
                        </button>
                    </div>
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                            <p className="text-red-700 text-center">{error}</p>
                        </div>
                    )}
                </div>

                {/* Order Details */}
                {order && (
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Tracking Number</p>
                                    <p className="font-mono font-bold text-lg text-blue-600">{order.trackingNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Order Date</p>
                                    <p className="font-semibold">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Current Status</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        <span className="ml-2">{order.status}</span>
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="font-semibold text-lg">৳{order.totalAmount?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Progress */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Journey</h2>
                            
                            <div className="space-y-4">
                                {getStatusSteps(order.status).map((step, index) => (
                                    <div key={step.status} className="flex items-start">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                            step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                            {step.completed ? (
                                                <FiCheckCircle className="w-4 h-4" />
                                            ) : (
                                                <span>{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className={`font-semibold ${
                                                step.completed ? 'text-green-600' : 'text-gray-500'
                                            }`}>
                                                {step.label}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                            
                                            {/* Show date for completed steps from status history */}
                                            {step.completed && order.statusHistory && (() => {
                                                const statusEvent = order.statusHistory.find(h => h.status === step.status);
                                                return statusEvent ? (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(statusEvent.date).toLocaleDateString()} at{' '}
                                                        {new Date(statusEvent.date).toLocaleTimeString()}
                                                    </p>
                                                ) : null;
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex items-center border-b border-gray-200 pb-4 last:border-b-0">
                                        {item.image && (
                                            <img
                                                src={`http://localhost:5000${item.image}`}
                                                alt={item.productName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                                }}
                                            />
                                        )}
                                        <div className="ml-4 flex-1">
                                            <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity} {item.unit}</p>
                                            <p className="text-sm text-gray-600">Price: ৳{item.price} per {item.unit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Total Amount:</span>
                                    <span>৳{order.totalAmount?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h2>
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
            </div>
        </div>
    );
};

export default OrderTracking;