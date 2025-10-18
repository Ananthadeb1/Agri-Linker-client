import React from "react";
import bannerImg from "./LandingPageImages/farming_banner.jpg";

export default function LandingPage() {
    return (
        <div className="font-sans text-gray-800">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-[90vh] flex flex-col justify-center items-start px-10 text-white"
                style={{
                    backgroundImage: `url('${bannerImg}')`,
                }}
            >
                <div className="bg-black/40 absolute inset-0"></div>
                <div className="relative z-10 max-w-2xl">
                    <p className="uppercase tracking-widest text-sm mb-2">
                        Welcome to Agrios Farming
                    </p>
                    <h1 className="text-5xl font-bold leading-tight mb-4">
                        Agriculture <br /> Eco Farming
                    </h1>
                    <p className="mb-6 text-lg">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                        tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md">
                        Discover More
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="flex justify-center gap-6 -mt-16 relative z-20 px-6 flex-wrap">
                {[
                    {
                        title: "We're using a new technology",
                        img: "https://img.freepik.com/free-photo/planting-young-tree_1150-11114.jpg",
                        label: "Feature 01",
                    },
                    {
                        title: "Good in smart organic services",
                        img: "https://img.freepik.com/free-photo/fresh-organic-vegetables_144627-20164.jpg",
                        label: "Feature 02",
                    },
                    {
                        title: "Reforming in the systems",
                        img: "https://img.freepik.com/free-photo/eco-friendly-planting-farming-concept_53876-133965.jpg",
                        label: "Feature 03",
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg w-80 text-center p-6 hover:-translate-y-2 transition-transform"
                    >
                        <p className="text-yellow-500 font-semibold mb-2">{item.label}</p>
                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                        <img
                            src={item.img}
                            alt="Feature"
                            className="w-20 h-20 mx-auto rounded-full object-cover"
                        />
                    </div>
                ))}
            </section>

            {/* Infrastructure Section */}
            <section className="flex flex-col lg:flex-row items-center justify-center py-24 px-10 gap-10">
                <div className="relative flex-1 flex justify-center">
                    <img
                        src="https://img.freepik.com/free-photo/tractor-harvesting-field-during-sunset_181624-6158.jpg"
                        alt="Farm"
                        className="w-[400px] h-[400px] rounded-full object-cover shadow-lg"
                    />
                </div>

                <div className="flex-1 max-w-lg">
                    <p className="text-yellow-500 font-semibold mb-2">Our Infrastructure</p>
                    <h2 className="text-3xl font-bold mb-3">
                        Agriculture & Organic <br /> Product Farm
                    </h2>
                    <p className="text-green-600 font-semibold mb-3">
                        Agrios is the largest global organic farm.
                    </p>
                    <p className="mb-4 text-gray-600">
                        There are many variations of passages of lorem ipsum available, but
                        the majority have suffered alteration in some form by injected
                        humour or random words which don't look even.
                    </p>

                    <ul className="mb-5 space-y-2">
                        <li>🌱 Growing fruits & vegetables</li>
                        <li>🍋 Tips for ripening your fruits</li>
                        <li>
                            📄 Lorem Ipsum is not simply random text, making this the first
                            true text generator on the internet.
                        </li>
                    </ul>

                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md">
                        Discover More
                    </button>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="text-center py-20 bg-[#fffef6]">
                <p className="text-yellow-500 font-semibold">Our Services</p>
                <h2 className="text-3xl font-bold mb-10">What We Offer</h2>
                <div className="flex flex-wrap justify-center gap-6 px-6">
                    {[
                        {
                            title: "Agriculture Products",
                            img: "https://img.freepik.com/free-photo/red-apple-tree_144627-10528.jpg",
                        },
                        {
                            title: "Organic Products",
                            img: "https://img.freepik.com/free-photo/fresh-organic-vegetables_144627-20164.jpg",
                        },
                        {
                            title: "Fresh Vegetables",
                            img: "https://img.freepik.com/free-photo/close-up-farmer-hands-holding-fresh-vegetables_53876-133966.jpg",
                        },
                        {
                            title: "Dairy Products",
                            img: "https://img.freepik.com/free-photo/grapevine-close-up-vineyard_144627-10480.jpg",
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
                {["Agriculture Products", "Projects Completed", "Satisfied Clients", "Experts Farmers"].map(
                    (item, index) => (
                        <p key={index} className="font-semibold">
                            {item}
                        </p>
                    )
                )}
            </section>

            {/* Agriculture Matters Section */}
            <section
                className="relative bg-cover bg-center h-[70vh] flex flex-col justify-center px-10 text-white"
                style={{
                    backgroundImage:
                        "url('https://img.freepik.com/free-photo/sapling-growing-ground-with-sunlight_1150-11147.jpg')",
                }}
            >
                <div className="bg-black/40 absolute inset-0"></div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-bold mb-4">
                        Agriculture Matters to the <br /> Future of Development
                    </h2>
                </div>
                <div className="relative z-10 mt-4">
                    <button className="bg-white text-green-600 rounded-full p-4 text-xl shadow-md hover:bg-green-100">
                        ▶
                    </button>
                </div>
            </section>

            {/* Explore Projects Section */}
            <section className="text-center py-20">
                <p className="text-yellow-500 font-semibold">Recently Completed</p>
                <h2 className="text-3xl font-bold mb-10">Explore Projects</h2>
                <div className="flex flex-wrap justify-center gap-6 px-6">
                    {[
                        {
                            title: "Easy Harvesting",
                            img: "https://img.freepik.com/free-photo/wheat-field-closeup_1150-11113.jpg",
                        },
                        {
                            title: "Agriculture Farming",
                            img: "https://img.freepik.com/free-photo/tractor-working-field_1150-11112.jpg",
                        },
                        {
                            title: "Ecological Farming",
                            img: "https://img.freepik.com/free-photo/farmland-with-green-plants_1150-11111.jpg",
                        },
                        {
                            title: "Organic Solutions",
                            img: "https://img.freepik.com/free-photo/wheat-close-up-hand_1150-11110.jpg",
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
            <section className="bg-[#fffef6] py-20 px-10 flex flex-col lg:flex-row items-center justify-center gap-10">
                <div className="max-w-sm">
                    <p className="text-yellow-500 font-semibold">Our Testimonials</p>
                    <h2 className="text-3xl font-bold mb-3">
                        What They’re Talking About Agrios
                    </h2>
                    <p className="text-gray-600 mb-4">
                        There are many variations of passages of available but the majority
                        have suffered alteration in some form by injected humour or random
                        words which don't look even.
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md">
                        View All Testimonials
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
                    <p className="text-gray-700 mb-4">
                        There are many variations of passages of available but the majority
                        have suffered alteration in some form by injected humour or random
                        word which don't look even.
                    </p>
                    <p className="font-semibold">Bonnie Tolbert</p>
                    <p className="text-yellow-400">★★★★★</p>
                </div>
            </section>
        </div>
    );
}
