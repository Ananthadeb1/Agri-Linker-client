import React from "react";

export default function LandingPage() {
    return (
        <div className="font-sans text-gray-800">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-[90vh] flex flex-col justify-center items-start px-10 text-white"
                style={{
                    backgroundImage:
                        "url('https://img.freepik.com/free-photo/farmer-standing-wheat-field-with-tablet_342744-1040.jpg')",
                }}
            >
                <div className="bg-black/40 absolute inset-0"></div>
                <div className="relative z-10 max-w-2xl">
                    <p className="uppercase tracking-widest text-sm mb-2">
                        Welcome to Smart Farming
                    </p>
                    <h1 className="text-5xl font-bold leading-tight mb-4">
                        Grow Smarter <br /> with Modern Agriculture
                    </h1>
                    <p className="mb-6 text-lg">
                        Empowering farmers with smart tools, real-time data, and AI-based
                        insights for better crop yield and sustainability.
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md">
                        Get Started
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="flex justify-center gap-6 -mt-16 relative z-20 px-6 flex-wrap">
                {[
                    {
                        title: "IoT Crop Monitoring",
                        img: "https://img.freepik.com/free-photo/closeup-shot-hand-holding-smartphone-with-smart-farming-app_181624-45960.jpg",
                        label: "Feature 01",
                    },
                    {
                        title: "AI-Based Weather Forecast",
                        img: "https://img.freepik.com/free-photo/agronomist-using-weather-forecast-smartphone-farm_342744-1224.jpg",
                        label: "Feature 02",
                    },
                    {
                        title: "Smart Irrigation System",
                        img: "https://img.freepik.com/free-photo/smart-irrigation-system-with-tablet_342744-990.jpg",
                        label: "Feature 03",
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg w-80 text-center p-6 hover:-translate-y-2 transition-transform"
                    >
                        <p className="text-green-500 font-semibold mb-2">{item.label}</p>
                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                        <img
                            src={item.img}
                            alt="Feature"
                            className="w-20 h-20 mx-auto rounded-full object-cover"
                        />
                    </div>
                ))}
            </section>

            {/* System Section */}
            <section className="flex flex-col lg:flex-row items-center justify-center py-24 px-10 gap-10">
                <div className="relative flex-1 flex justify-center">
                    <img
                        src="https://img.freepik.com/free-photo/modern-agricultural-concept-with-drone-field_342744-1155.jpg"
                        alt="Smart Farming"
                        className="w-[400px] h-[400px] rounded-full object-cover shadow-lg"
                    />
                </div>

                <div className="flex-1 max-w-lg">
                    <p className="text-green-500 font-semibold mb-2">Our System</p>
                    <h2 className="text-3xl font-bold mb-3">
                        Digital Solutions <br /> for Every Farmer
                    </h2>
                    <p className="text-green-600 font-semibold mb-3">
                        Bringing innovation and intelligence to agriculture.
                    </p>
                    <p className="mb-4 text-gray-600">
                        Smart Farming uses sensors, weather data, and analytics to optimize
                        irrigation, fertilizer, and crop management for maximum efficiency.
                    </p>

                    <ul className="mb-5 space-y-2">
                        <li>🌾 Monitor soil moisture and crop health</li>
                        <li>☀️ Get AI-powered weather and pest predictions</li>
                        <li>💧 Automate irrigation with IoT sensors</li>
                    </ul>

                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md">
                        Learn More
                    </button>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="text-center py-20 bg-[#f7fff7]">
                <p className="text-green-500 font-semibold">Our Services</p>
                <h2 className="text-3xl font-bold mb-10">What We Offer</h2>
                <div className="flex flex-wrap justify-center gap-6 px-6">
                    {[
                        {
                            title: "Crop Disease Detection",
                            img: "https://img.freepik.com/free-photo/agronomist-analyzing-plant-diseases-tablet_342744-1190.jpg",
                        },
                        {
                            title: "Farm Management System",
                            img: "https://img.freepik.com/free-photo/farmer-using-digital-tablet-farm_342744-1101.jpg",
                        },
                        {
                            title: "Fertilizer Recommendation",
                            img: "https://img.freepik.com/free-photo/farmer-holding-fertilizer-field_342744-1215.jpg",
                        },
                        {
                            title: "Smart Equipment Integration",
                            img: "https://img.freepik.com/free-photo/tractor-field-agriculture_342744-970.jpg",
                        },
                    ].map((item, index) => (
                        <div key={index} className="relative w-64 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-80 object-cover"
                            />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg py-2 px-4 shadow-md text-center">
                                <p className="text-green-600 text-sm font-semibold">Read More</p>
                                <h3 className="font-semibold">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Bar Section */}
            <section className="bg-green-600 text-white py-4 flex justify-center gap-10 text-center flex-wrap">
                {["Farms Connected", "Sensors Active", "Farmers Trained", "Crops Monitored"].map(
                    (item, index) => (
                        <p key={index} className="font-semibold">
                            {item}
                        </p>
                    )
                )}
            </section>

            {/* Farming Inspiration Section */}
            <section
                className="relative bg-cover bg-center h-[70vh] flex flex-col justify-center px-10 text-white"
                style={{
                    backgroundImage:
                        "url('https://img.freepik.com/free-photo/smart-farming-concept-using-digital-technology-monitor-crop-growth_342744-1160.jpg')",
                }}
            >
                <div className="bg-black/40 absolute inset-0"></div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-bold mb-4">
                        Farming Smarter for a <br /> Sustainable Future
                    </h2>
                </div>
                <div className="relative z-10 mt-4">
                    <button className="bg-white text-green-600 rounded-full p-4 text-xl shadow-md hover:bg-green-100">
                        ▶
                    </button>
                </div>
            </section>

            {/* Popular Practices Section */}
            <section className="text-center py-20">
                <p className="text-green-500 font-semibold">Recently Adopted</p>
                <h2 className="text-3xl font-bold mb-10">Popular Farming Practices</h2>
                <div className="flex flex-wrap justify-center gap-6 px-6">
                    {[
                        {
                            title: "Organic Farming",
                            img: "https://img.freepik.com/free-photo/organic-farming-fresh-vegetables_342744-1179.jpg",
                        },
                        {
                            title: "Hydroponic Systems",
                            img: "https://img.freepik.com/free-photo/hydroponic-vegetable-farm_1150-11063.jpg",
                        },
                        {
                            title: "Drone Crop Monitoring",
                            img: "https://img.freepik.com/free-photo/drone-flying-over-field-agriculture_342744-985.jpg",
                        },
                        {
                            title: "Sustainable Irrigation",
                            img: "https://img.freepik.com/free-photo/sprinkler-watering-agriculture-field_342744-1137.jpg",
                        },
                    ].map((item, index) => (
                        <div key={index} className="relative w-64 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-72 object-cover"
                            />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 text-black rounded-lg py-2 px-4 text-sm font-semibold">
                                {item.title}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-[#f7fff7] py-20 px-10 flex flex-col lg:flex-row items-center justify-center gap-10">
                <div className="max-w-sm">
                    <p className="text-green-500 font-semibold">Our Testimonials</p>
                    <h2 className="text-3xl font-bold mb-3">
                        What Farmers Say About Us
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Thousands of farmers trust Smart Farming to manage their fields
                        efficiently using technology-driven solutions.
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md">
                        View All Reviews
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
                    <p className="text-gray-700 mb-4">
                        Smart Farming transformed my productivity. I can now monitor my
                        crops and irrigation right from my phone!
                    </p>
                    <p className="font-semibold">Rahim Uddin</p>
                    <p className="text-yellow-400">★★★★★</p>
                </div>
            </section>
        </div>
    );
}
