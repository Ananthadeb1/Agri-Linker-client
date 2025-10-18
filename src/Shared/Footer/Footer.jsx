import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
    return (
        <footer className="font-sans">
            {/* Main Footer Section */}
            <div className="footer flex flex-col md:flex-row gap-0 py-0 text-white">
                {/* Left Section - Contact */}
                <div className="w-full md:w-1/2 py-16 flex justify-center items-center" style={{ backgroundColor: '#24231D' }}>
                    <div className="text-center h-max px-6">
                        <h2 className="text-2xl font-bold mb-8 text-[#cbad5a]">Contact Us</h2>
                        <div className="space-y-4 text-gray-100">
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-sm opacity-90">contact@agrilinker.com</span>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-sm opacity-90">01612345678</span>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-sm opacity-90">123 Natun Bazar, Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Social Media */}
                <div className="w-full md:w-1/2 py-16 flex justify-center items-center" style={{ backgroundColor: '#24231D' }}>
                    <div className="text-center px-6">
                        <h2 className="text-2xl font-bold mb-8 text-[#cbad5a]">Follow Us</h2>
                        <p className="text-sm mb-8 opacity-90">Join us on social media</p>
                        <div className="flex justify-center gap-8">
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center transition-opacity duration-300 hover:opacity-80 text-[#cbad5a]"
                            >
                                <FontAwesomeIcon
                                    icon={faFacebookF}
                                    size="lg"
                                />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center transition-opacity duration-300 hover:opacity-80 text-[#cbad5a]"
                            >
                                <FontAwesomeIcon
                                    icon={faYoutube}
                                    size="lg"
                                />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center transition-opacity duration-300 hover:opacity-80 text-[#cbad5a]"
                            >
                                <FontAwesomeIcon
                                    icon={faInstagram}
                                    size="lg"
                                />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center transition-opacity duration-300 hover:opacity-80 text-[#cbad5a]"
                            >
                                <FontAwesomeIcon
                                    icon={faTwitter}
                                    size="lg"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Section */}
            <div className="py-4 text-white text-center" style={{ backgroundColor: '#1F1E17' }}>
                <div className="container  mx-auto px-4">
                    <p className="text-sm opacity-90 mb-2">
                        Copyright © 2025 - All right reserved by <span className="text-[#cbad5a]">Agri_Linker</span>
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;