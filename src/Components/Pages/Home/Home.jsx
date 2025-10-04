import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Home = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searching, setSearching] = useState(false);

    // Fetch products when component loads
    useEffect(() => {
        fetchProducts();
    }, [user, axiosSecure]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            
            if (user?.email) {
                // Get recommended products for logged-in users
                const response = await axiosSecure.get(`/api/products/recommended/${user.email}`);
                setProducts(response.data);
                setAllProducts(response.data);
            } else {
                // Get all products for guests
                const response = await axiosSecure.get('/api/products');
                setProducts(response.data);
                setAllProducts(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchTerm.trim()) {
            alert("Please enter a search term");
            return;
        }

        if (!user?.email) {
            // For guests, just filter locally
            const filtered = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (filtered.length > 0) {
                setProducts(filtered);
            } else {
                alert('No products found with that name!');
            }
            return;
        }

        // For logged-in users, track search and get results
        try {
            setSearching(true);
            const response = await axiosSecure.post('/api/search-product', {
                searchTerm: searchTerm.trim()
            });

            if (response.data.products && response.data.products.length > 0) {
                setProducts(response.data.products);
                console.log(`Category "${response.data.trackedCategory}" count increased!`);
            } else {
                alert('No products found with that name!');
            }
        } catch (error) {
            if (error.response?.status === 404) {
                alert('No products found with that name!');
            } else {
                console.error("Search error:", error);
                alert('An error occurred during search');
            }
        } finally {
            setSearching(false);
        }
    };

    // Reset to show all products
    const handleReset = () => {
        setSearchTerm("");
        setProducts(allProducts);
    };

    // Refresh products (reload with new recommendations)
    const handleRefresh = async () => {
        setSearchTerm("");
        await fetchProducts();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome, {user?.name || 'Guest'}!
                </h1>
                {user?.role && (
                    <p className="text-gray-600">Your role: {user.role}</p>
                )}
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products (e.g., apple, potato, rice)..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        disabled={searching}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                        {searching ? 'Searching...' : 'Search'}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Reset
                    </button>
                    {user?.email && (
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Refresh
                        </button>
                    )}
                </form>
                {user?.email && (
                    <p className="text-sm text-gray-500 mt-2">
                        💡 Search products to build your preferences. Products will be sorted based on your search history!
                    </p>
                )}
            </div>

            {/* Products Section Title */}
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {searchTerm ? 'Search Results' : user?.email ? 'Recommended For You' : 'All Products'}
                    </h2>
                    <p className="text-gray-600">
                        {products.length} product{products.length !== 1 ? 's' : ''} found
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">Loading products...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No products available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                        >
                            {/* Product Image */}
                            <div className="h-48 bg-gray-100">
                                <img
                                    src={`http://localhost:5000${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                    }}
                                />
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {product.name}
                                    </h3>
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                        {product.category}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-2">
                                    Quantity: {product.quantity.value} {product.quantity.unit}
                                </p>

                                <div className="flex justify-between items-center">
                                    <p className="text-xl font-bold text-green-600">
                                        ${product.price}
                                    </p>
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                                        product.status === 'available' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;