import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { PlusIcon } from '@heroicons/react/24/outline';

const MyProducts = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (user?.email) {
            fetchMyProducts();
        }
    }, [user]);

    const fetchMyProducts = async () => {
        try {
            setLoading(true);
            const response = await axiosSecure.get('/api/my-products');
            if (response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        try {
            setDeleting(productId);
            const response = await axiosSecure.delete(`/api/products/${productId}`);

            if (response.data.success) {
                alert('Product deleted successfully!');
                setProducts(prev => prev.filter(product => product._id !== productId));
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        } finally {
            setDeleting(null);
        }
    };

    const handleAddProduct = () => {
        navigate('/add-product');
    };

    const getStatusBadge = (product) => {
        if (product.status === 'sold-out') {
            return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Sold Out</span>;
        }
        if (product.quantity.value <= 0) {
            return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Out of Stock</span>;
        }
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Available</span>;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="text-xl text-gray-600 mt-4">Loading your products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Products</h1>
                    <p className="text-gray-600">
                        Manage your agricultural products and inventory
                    </p>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-4 md:mt-0"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add New Product
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-green-600">
                        {products.filter(p => p.status === 'available' && p.quantity.value > 0).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600">Sold Out</p>
                    <p className="text-2xl font-bold text-red-600">
                        {products.filter(p => p.status === 'sold-out' || p.quantity.value <= 0).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {new Set(products.map(p => p.category)).size}
                    </p>
                </div>
            </div>

            {/* Products Grid/Table */}
            {products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-6xl mb-4">🌾</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first agricultural product</p>
                    <button
                        onClick={handleAddProduct}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Add Your First Product
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={`http://localhost:5000${product.image}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Added {new Date(product.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.quantity.value} {product.quantity.unit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="font-semibold">{product.price}</span> Taka/{product.quantity.unit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(product)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden">
                        {products.map((product) => (
                            <div key={product._id} className="border-b border-gray-200 p-4 last:border-b-0">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={`http://localhost:5000${product.image}`}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                                            <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                                            <div className="mt-1">
                                                {getStatusBadge(product)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                    <div>
                                        <p className="text-gray-600">Quantity</p>
                                        <p className="font-medium">{product.quantity.value} {product.quantity.unit}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Price</p>
                                        <p className="font-medium">{product.price} Taka/{product.quantity.unit}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProducts;