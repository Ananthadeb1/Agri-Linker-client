import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import { getImageUrl } from '../../../utils/getImageUrl';

const OrderTracking = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [orders, setOrders] = useState([]);
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        if (user?.email) {
            fetchUserOrders();
        }
    }, [user, axiosSecure]);

    const fetchUserOrders = async () => {
        if (!user?.email) return;

        setLoadingOrders(true);
        try {
            const response = await axiosSecure.get(`/api/OrderTrack/user/${user.email}`);
            if (response.data.success) {
                setOrders(response.data.orders || []);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching user orders:', error);
            setOrders([]);
            Swal.fire({ icon: 'error', title: 'Order history failed', text: 'Unable to load your orders right now.' });
        } finally {
            setLoadingOrders(false);
        }
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrderIds(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]);
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
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Tracking</h1>
                    <p className="text-gray-600">Click on any order below to see its full status and delivery journey.</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Order History</h2>
                    {loadingOrders ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            <p className="text-gray-600 mt-4">Loading your orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <p className="text-gray-600">No orders found yet. Your recent purchases will appear here.</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((history) => {
                                const isExpanded = expandedOrderIds.includes(history._id);
                                return (
                                    <div key={history._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => toggleOrderExpand(history._id)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            <div className="text-left">
                                                <p className="font-semibold text-gray-800">{history.trackingNumber || history.orderId}</p>
                                                <p className="text-sm text-gray-600">Placed on {new Date(history.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(history.status)}`}>
                                                    {getStatusIcon(history.status)}
                                                    <span className="ml-2">{history.status}</span>
                                                </span>
                                            </div>
                                        </button>
                                        {isExpanded && (
                                            <div className="p-4 bg-white space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Order ID</p>
                                                        <p className="font-semibold">{history.orderId}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Tracking Number</p>
                                                        <p className="font-mono font-semibold text-blue-600">{history.trackingNumber}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Items</p>
                                                        <p className="font-semibold">{history.items?.length || 0}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Total</p>
                                                        <p className="font-semibold">৳{history.totalAmount?.toFixed(2)}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-gray-800 mb-3">Order Journey (Kothay Ache)</h3>
                                                    <div className="space-y-4">
                                                        {getStatusSteps(history.status).map((step, index) => (
                                                            <div key={step.status} className="flex items-start">
                                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                                    {step.completed ? <FiCheckCircle className="w-4 h-4" /> : <span>{index + 1}</span>}
                                                                </div>
                                                                <div className="ml-4 flex-1">
                                                                    <div className={`font-semibold ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                                                                        {step.label}
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                                                    {step.completed && history.statusHistory && (() => {
                                                                        const statusEvent = history.statusHistory.find(h => h.status === step.status);
                                                                        return statusEvent ? (
                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                {new Date(statusEvent.date).toLocaleDateString()} at {new Date(statusEvent.date).toLocaleTimeString()}
                                                                            </p>
                                                                        ) : null;
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-gray-800 mb-2">Status History</h3>
                                                    <div className="space-y-2">
                                                        {history.statusHistory?.map((event, index) => (
                                                            <div key={index} className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                                                                <p className="text-sm font-medium text-gray-800">{event.status}</p>
                                                                <p className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</p>
                                                                {event.note && <p className="text-sm text-gray-600 mt-1">{event.note}</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-gray-800 mb-2">Ordered Items</h3>
                                                    <div className="space-y-3">
                                                        {history.items?.map((item, index) => (
                                                            <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                                                                {item.image && (
                                                                    <img
                                                                        src={getImageUrl(item.image)}
                                                                        alt={item.productName}
                                                                        className="w-16 h-16 object-cover rounded-lg"
                                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64x64?text=No+Image'; }}
                                                                    />
                                                                )}
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-gray-800">{item.productName}</p>
                                                                    <p className="text-sm text-gray-600">{item.orderedQuantity} {item.unit} × ৳{item.price}</p>
                                                                </div>
                                                                <p className="font-semibold text-gray-800">৳{(item.orderedQuantity * item.price).toFixed(2)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

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