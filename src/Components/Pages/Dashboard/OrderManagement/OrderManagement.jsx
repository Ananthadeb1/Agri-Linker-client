import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { FiPackage, FiDollarSign } from "react-icons/fi";
import Swal from "sweetalert2";

const OrderManagement = () => {
    const axiosSecure = useAxiosSecure();
    
    const { data: ordersData = {}, isLoading, refetch } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/admin/orders');
            return res.data;
        }
    });

    const orders = ordersData.orders || [];
    const stats = ordersData;

    // Update order status (mark as delivered) - UPDATED TO SYNC BOTH COLLECTIONS
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            if (newStatus === 'Delivered') {
                const res = await axiosSecure.patch(`/api/admin/orders/${orderId}/deliver`);
                
                if (res.data.success) {
                    Swal.fire('Success!', 'Order marked as delivered successfully', 'success');
                    refetch();
                }
            } else {
                Swal.fire('Info', 'Only delivery status can be updated for now', 'info');
            }
        } catch (error) {
            console.error("Error updating order:", error);
            Swal.fire('Error!', 'Failed to update order status', 'error');
        }
    };

    const getStatusColor = (delivered) => {
        return delivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

    const getStatusText = (delivered) => {
        return delivered ? 'Delivered' : 'Processing';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format currency with proper spacing
    const formatCurrency = (amount) => {
        return '৳' + parseFloat(amount || 0).toFixed(2);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2056]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards - UPDATED REVENUE DISPLAY */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiPackage className="text-blue-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total || orders.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FiPackage className="text-green-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Delivered</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.delivered || orders.filter(order => order.delivered).length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <FiPackage className="text-yellow-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.pending || orders.filter(order => !order.delivered).length}
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* FIXED: Revenue display with proper formatting */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FiDollarSign className="text-red-600 text-xl" />
                        </div>
                        <div className="ml-4 min-w-0"> {/* Added min-w-0 for text truncation */}
                            <p className="text-sm text-gray-600 truncate">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 truncate">
                                {formatCurrency(stats.totalRevenue || orders.reduce((total, order) => total + (order.totalPrice || 0), 0))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">All Orders</h2>
                    <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
                    <div className="mt-2 text-sm text-gray-500">
                        Showing {orders.length} orders
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by placing some orders.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ORDER ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CUSTOMER
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ITEMS
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        AMOUNT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        STATUS
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        DATE
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-sm font-medium text-gray-900 font-mono">
                                                    {order.orderId}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="font-medium">{order.userId}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                <div className="font-medium">{order.items?.length || 0} items</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {order.items?.slice(0, 2).map(item => item.productName).join(', ')}
                                                    {order.items?.length > 2 && '...'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(order.totalPrice)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.delivered)}`}>
                                                {getStatusText(order.delivered)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(order.orderedDate)}
                                            {order.deliveredAt && (
                                                <div className="text-xs text-green-600">
                                                    Delivered: {formatDate(order.deliveredAt)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {!order.delivered ? (
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                                    className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 transition-colors font-medium"
                                                >
                                                    Mark Delivered
                                                </button>
                                            ) : (
                                                <span className="text-green-600 text-xs font-medium">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagement;