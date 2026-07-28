import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import { 
    FiShoppingCart, 
    FiTrendingUp, 
    FiCpu, 
    FiTruck, 
    FiPlusCircle, 
    FiStar, 
    FiCheckCircle, 
    FiPlay, 
    FiX, 
    FiArrowRight, 
    FiShield, 
    FiUserCheck, 
    FiDollarSign 
} from "react-icons/fi";

export default function LandingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("buyers");
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    // Determine user roles
    const isFarmer = user?.role === 'farmer';
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    return (
        <div className="font-sans text-gray-800 bg-white">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center min-h-[90vh] flex flex-col justify-center items-start px-6 lg:px-16 text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80')",
                }}
            >
                <div className="bg-gradient-to-r from-black/80 via-black/50 to-transparent absolute inset-0"></div>
                
                <div className="relative z-10 max-w-3xl py-12">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 backdrop-blur-md text-green-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Next-Gen Agricultural Ecosystem
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-white drop-shadow-md">
                        Connecting Farmers, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">
                            Buyers & Investors
                        </span>
                    </h1>

                    <p className="mb-8 text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl font-light">
                        AgriLinker empowers local farmers with direct crop sales, AI-driven cultivation advice, and micro-loan investments — removing middlemen and maximizing agricultural growth.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => navigate("/products")}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-green-900/30 hover:shadow-green-600/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <FiShoppingCart className="text-lg" />
                            Explore Marketplace
                        </button>

                        <button
                            onClick={() => navigate("/crop-recommendation")}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold px-7 py-3.5 rounded-full transition-all duration-300 flex items-center gap-2"
                        >
                            <FiCpu className="text-green-400 text-lg" />
                            AI Crop Advisor
                        </button>

                        {user ? (
                            isFarmer ? (
                                <button
                                    onClick={() => navigate("/add-product")}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-md transition-all duration-300 flex items-center gap-2"
                                >
                                    <FiPlusCircle className="text-lg" />
                                    Sell Produce
                                </button>
                            ) : isAdmin ? (
                                <button
                                    onClick={() => navigate("/admin-dashboard")}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-md transition-all duration-300 flex items-center gap-2"
                                >
                                    <FiShield className="text-lg" />
                                    Admin Panel
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/invest")}
                                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-md transition-all duration-300 flex items-center gap-2"
                                >
                                    <FiTrendingUp className="text-lg" />
                                    Invest in Farms
                                </button>
                            )
                        ) : (
                            <button
                                onClick={() => navigate("/signup")}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-md transition-all duration-300 flex items-center gap-2"
                            >
                                <FiUserCheck className="text-lg" />
                                Join AgriLinker
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Feature Cards Section */}
            <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Direct Marketplace",
                            desc: "Buy fresh organic crops directly from verified local farmers at fair prices.",
                            icon: FiShoppingCart,
                            badge: "Marketplace",
                            color: "text-emerald-600 bg-emerald-50 border-emerald-200",
                            btnText: "Shop Crops",
                            action: () => navigate("/products"),
                        },
                        {
                            title: "AI Crop Advisor",
                            desc: "Receive smart crop suggestions based on soil moisture and local weather conditions.",
                            icon: FiCpu,
                            badge: "AI Powered",
                            color: "text-blue-600 bg-blue-50 border-blue-200",
                            btnText: "Get Recommendation",
                            action: () => navigate("/crop-recommendation"),
                        },
                        {
                            title: "Farmer Crowdfunding",
                            desc: "Empower farmers with low-interest micro-loans or invest to earn returns.",
                            icon: FiTrendingUp,
                            badge: "Financing",
                            color: "text-amber-600 bg-amber-50 border-amber-200",
                            btnText: user ? (isFarmer ? "Request Loan" : "Invest Now") : "Learn Investment",
                            action: () => navigate(user ? (isFarmer ? "/loan-request" : "/invest") : "/invest"),
                        },
                        {
                            title: "Live Order Tracking",
                            desc: "Track delivery status from harvest field to your doorstep in real time.",
                            icon: FiTruck,
                            badge: "Logistics",
                            color: "text-purple-600 bg-purple-50 border-purple-200",
                            btnText: "Track Order",
                            action: () => navigate("/track-order"),
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${item.color} border`}>
                                        <item.icon className="text-2xl" />
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                                        {item.badge}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {item.desc}
                                </p>
                            </div>

                            <button
                                onClick={item.action}
                                className="w-full mt-auto py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:text-white hover:bg-green-600 hover:border-green-600 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                            >
                                <span>{item.btnText}</span>
                                <FiArrowRight className="text-base group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Platform Stats Bar */}
            <section className="my-16 bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 text-white py-8 px-6 shadow-md">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <p className="text-3xl lg:text-4xl font-extrabold mb-1">100%</p>
                        <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Direct Farm Sourcing</p>
                    </div>
                    <div>
                        <p className="text-3xl lg:text-4xl font-extrabold mb-1">0%</p>
                        <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Middleman Commission</p>
                    </div>
                    <div>
                        <p className="text-3xl lg:text-4xl font-extrabold mb-1">AI-Powered</p>
                        <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Crop Recommendation</p>
                    </div>
                    <div>
                        <p className="text-3xl lg:text-4xl font-extrabold mb-1">Verified</p>
                        <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Farmers & Loan Requests</p>
                    </div>
                </div>
            </section>

            {/* How AgriLinker Works Section */}
            <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">How It Works</span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
                        Tailored Solutions for Every User
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Select your role below to explore how AgriLinker simplifies your agricultural journey.
                    </p>

                    {/* Role Tabs */}
                    <div className="flex justify-center gap-3 mt-8 bg-gray-100 p-1.5 rounded-full max-w-md mx-auto">
                        {[
                            { id: "buyers", label: "For Buyers" },
                            { id: "farmers", label: "For Farmers" },
                            { id: "investors", label: "For Investors" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-2.5 px-5 rounded-full font-semibold text-sm transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? "bg-green-600 text-white shadow"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-sm">
                    {activeTab === "buyers" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Fresh Farm Produce At Your Fingertips
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Skip retail markups! Order fruits, vegetables, grains, and dairy straight from local farm harvests with guaranteed freshness.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        Browse categorized farm inventory in real time
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        Secure payment checkout & live delivery tracking
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        Rate & review purchased crops for quality control
                                    </li>
                                </ul>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate("/products")}
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
                                    >
                                        Browse Products
                                    </button>
                                    <button
                                        onClick={() => navigate("/track-order")}
                                        className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded-xl transition"
                                    >
                                        Track Order
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                                    alt="Fresh Vegetables"
                                    className="w-full h-80 object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "farmers" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Sell Produce Directly & Access Micro-Loans
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Empower your farm! List your crop yields without paying intermediary commissions and access financial backing when expanding.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        Add crops easily with images and custom pricing
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        Get AI recommendations for optimal crop selection
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        Submit micro-loan applications for farm equipment
                                    </li>
                                </ul>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate(user ? "/add-product" : "/login")}
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
                                    >
                                        Add Product
                                    </button>
                                    <button
                                        onClick={() => navigate(user ? "/loan-request" : "/login")}
                                        className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded-xl transition"
                                    >
                                        Request Loan
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"
                                    alt="Farmer in Field"
                                    className="w-full h-80 object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "investors" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Fund Farmers & Earn Sustainable Returns
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Support verified local farmers by funding transparent loan requests for seeds, equipment, and irrigation infrastructure.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        Browse vetted farmer loan requests with clear terms
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        Track investment performance and repayment status
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700 font-medium">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        Create real social impact in rural communities
                                    </li>
                                </ul>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate("/invest")}
                                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
                                    >
                                        Explore Loans to Invest
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80"
                                    alt="Sustainable Farming Investment"
                                    className="w-full h-80 object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Video Banner Section */}
            <section
                className="relative bg-cover bg-center py-24 px-6 text-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1920&q=80')",
                }}
            >
                <div className="bg-black/60 absolute inset-0"></div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                        Transforming Agriculture Through Technology
                    </h2>
                    <p className="text-gray-200 text-lg mb-8 font-light">
                        Watch how AgriLinker bridges the gap between field harvests and modern market demands.
                    </p>
                    
                    <button
                        onClick={() => setIsVideoOpen(true)}
                        className="w-20 h-20 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl hover:scale-110 transition-all duration-300"
                        title="Watch Overview Video"
                    >
                        <FiPlay className="text-3xl ml-1" />
                    </button>
                </div>
            </section>

            {/* Video Modal */}
            {isVideoOpen && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8" onClick={() => setIsVideoOpen(false)}>
                    <div className="relative bg-black rounded-2xl overflow-hidden w-full max-w-5xl shadow-2xl border border-gray-800" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsVideoOpen(false)}
                            className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition shadow-lg"
                        >
                            <FiX className="text-2xl" />
                        </button>
                        <div className="aspect-video w-full h-full">
                            <iframe
                                className="w-full h-full border-0"
                                src="https://www.youtube.com/embed/l36uoyUke-s?autoplay=1"
                                title="AgriLinker Video Player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Recently Added Crops Showcase */}
            <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Fresh Harvests</span>
                        <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                            Explore Fresh Farm Categories
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate("/products")}
                        className="mt-4 md:mt-0 text-green-600 hover:text-green-700 font-bold flex items-center gap-2 group text-base"
                    >
                        View Full Marketplace
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Organic Vegetables",
                            desc: "Fresh tomatoes, potatoes, onions, cucumbers & greens.",
                            img: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80",
                        },
                        {
                            title: "Seasonal Fruits",
                            desc: "Ripe mangoes, apples, watermelons & bananas.",
                            img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
                        },
                        {
                            title: "Grains & Cereals",
                            desc: "High quality rice, wheat, corn & pulses.",
                            img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
                        },
                        {
                            title: "Dairy & Poultry",
                            desc: "Pure farm milk, eggs & organic poultry products.",
                            img: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=600&q=80",
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate("/products")}
                            className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer h-80"
                        >
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                <p className="text-gray-300 text-xs mb-3 font-light">{item.desc}</p>
                                <span className="inline-flex items-center text-green-400 font-semibold text-xs group-hover:underline">
                                    Shop Category &rarr;
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reviews & Community Section */}
            <section className="bg-gray-50 border-t border-gray-200 py-20 px-6 lg:px-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    <div>
                        <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Verified Reviews</span>
                        <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-4">
                            Trusted By Farmers & Buyers Nationwide
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            AgriLinker builds transparency through verified buyer ratings and post-delivery product reviews.
                        </p>
                        <button
                            onClick={() => navigate("/rating-review")}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
                        >
                            <FiStar className="text-yellow-300 fill-current" />
                            View All Reviews & Rate
                        </button>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                            <div className="flex text-amber-400 text-lg mb-3">
                                {"★".repeat(5)}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                "Selling my crops through AgriLinker cut out local middleman fees completely. I received payment quickly and got fair market prices!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center">
                                    R
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Rahim Uddin</h4>
                                    <p className="text-gray-500 text-xs">Vegetable Farmer, Bogura</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                            <div className="flex text-amber-400 text-lg mb-3">
                                {"★".repeat(5)}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                "The AI Crop Advisor helped me select optimal crops for the monsoon season. Also, tracking delivery of ordered seeds was effortless!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                                    K
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Karim Hasan</h4>
                                    <p className="text-gray-500 text-xs">Buyer & Farm Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
