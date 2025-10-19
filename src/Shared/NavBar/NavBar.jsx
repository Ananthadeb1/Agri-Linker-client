import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";

const NavBar = () => {
    const [isAdmin] = useAdmin();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    console.log(isAdmin);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    const handleLogOut = () => {
        logout()
            .then(() => setMobileMenuOpen(false))
            .catch(error => console.log(error));
    };

    // Updated navLinks logic with My Products, Crop Advisor, Loan Request, Invest and Cart
    const navLinks = [
        { path: "/", label: "Home" },
        ...(user ? [{ path: "/products", label: "Products" }] : []),
        ...(user ? [{ path: "/my-products", label: "My Products" }] : []),
        ...(user ? [{ path: "/crop-recommendation", label: "Crop Advisor" }] : []),
        ...(user ? [{ path: "/loan-request", label: "Loan Request" }] : []),
        ...(user ? [{ path: "/invest", label: "Invest" }] : []),
        ...(user ? [{ path: "/cart", label: "My Cart" }] : []),
        ...(user ? [{ path: "/add-product", label: "Add Product" }] : []),
        ...(user ? [{ path: "/rating-review", label: "Rate Products" }] : []), 
        ...(isAdmin ? [{ path: "/admin-dashboard", label: "Admin Dashboard" }] : []),
        
    ];

    return (
        <nav className={`sticky top-0 z-50 bg-white/70 shadow-md backdrop-blur-sm transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="px-4 w-full">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-2xl font-bold text-[#4BAF47] tracking-wider">
                        <span className="text-gray-900">Agri</span>Linker
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        <div className="flex space-x-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-2 py-2 font-medium transition-colors duration-300 border-b-2 ${isActive
                                            ? 'text-[#4BAF47] border-[#4BAF47]'
                                            : 'text-black hover:text-[#4BAF47] border-transparent hover:border-[#4BAF47]'}`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>

                        {user ? (
                            <div className="ml-6 flex items-center">
                                <div className="dropdown dropdown-end dropdown-hover">
                                    <label tabIndex={0} className="cursor-pointer group">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-[#4BAF47] transition-colors duration-300">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-600 text-lg font-medium">
                                                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content mt-2 p-2 shadow-lg menu bg-[#ebe9dd] rounded-md w-52 border border-gray-100 backdrop-blur-sm z-50">
                                        <li>
                                            <NavLink
                                                to="/userProfile"
                                                className={({ isActive }) =>
                                                    `block px-4 py-2 rounded transition-colors duration-200 ${isActive
                                                        ? 'text-[#4BAF47] bg-[#F0F9F0]'
                                                        : 'text-black hover:bg-[#F0F9F0] hover:text-[#4BAF47]'}`
                                                }
                                            >
                                                Profile
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/cart"
                                                className={({ isActive }) =>
                                                    `block px-4 py-2 rounded transition-colors duration-200 ${isActive
                                                        ? 'text-[#4BAF47] bg-[#F0F9F0]'
                                                        : 'text-black hover:bg-[#F0F9F0] hover:text-[#4BAF47]'}`
                                                }
                                            >
                                                My Cart
                                            </NavLink>
                                        </li>
                                        {/* ---- Added Order Track link ---- */}
                                        <li>
                                            <NavLink
                                                to="/track-order"
                                                className={({ isActive }) =>
                                                    `block px-4 py-2 rounded transition-colors duration-200 ${isActive
                                                        ? 'text-[#4BAF47] bg-[#F0F9F0]'
                                                        : 'text-black hover:bg-[#F0F9F0] hover:text-[#4BAF47]'}`
                                                }
                                            >
                                                Order Track
                                            </NavLink>
                                        </li>
                                        {/* ---- End Addition ---- */}
                                        <li>
                                            <button
                                                onClick={handleLogOut}
                                                className="block w-full text-left px-4 py-2 text-black hover:bg-[#F0F9F0] hover:text-[#4BAF47] rounded transition-colors duration-200"
                                            >
                                                Log out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="ml-6 flex items-center">
                                {(() => {
                                    const isLoginActive = window.location.pathname === '/login';
                                    const to = isLoginActive ? '/signup' : '/login';
                                    const label = isLoginActive ? 'Sign up' : 'Log in';
                                    return (
                                        <NavLink
                                            to={to}
                                            className={({ isActive }) =>
                                                `px-5 py-1.5 rounded-md font-medium transition-colors duration-300 shadow-sm ${isActive
                                                    ? 'bg-[#3A8E36] text-white'
                                                    : 'bg-[#4BAF47] text-white hover:bg-[#3A8E36]'}`
                                            }
                                        >
                                            {label}
                                        </NavLink>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-black hover:text-[#4BAF47] focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white/70 backdrop-blur-sm shadow-lg`}>
                <div className="px-4 pt-2 pb-4 space-y-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'text-[#4BAF47] bg-[#F0F9F0]'
                                    : 'text-black hover:text-[#4BAF47] hover:bg-[#F0F9F0]'}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    {user ? (
                        <>
                            <NavLink
                                to="/userProfile"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                        ? 'text-[#4BAF47] bg-[#F0F9F0]'
                                        : 'text-black hover:text-[#4BAF47] hover:bg-[#F0F9F0]'}`
                                }
                            >
                                Profile
                            </NavLink>
                            <NavLink
                                to="/cart"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                        ? 'text-[#4BAF47] bg-[#F0F9F0]'
                                        : 'text-black hover:text-[#4BAF47] hover:bg-[#F0F9F0]'}`
                                }
                            >
                                My Cart
                            </NavLink>
                            {/* ---- Added Order Track link ---- */}
                            <NavLink
                                to="/track-order"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                        ? 'text-[#4BAF47] bg-[#F0F9F0]'
                                        : 'text-black hover:text-[#4BAF47] hover:bg-[#F0F9F0]'}`
                                }
                            >
                                Order Track
                            </NavLink>
                            {/* ---- End Addition ---- */}
                            <button
                                onClick={handleLogOut}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-black hover:text-[#4BAF47] hover:bg-[#F0F9F0]"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-[#3A8E36] text-white'
                                    : 'bg-[#4BAF47] text-white hover:bg-[#3A8E36]'}`
                            }
                        >
                            Log in
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;