import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import useAuth from '../../Hooks/useAuth';
import SocialLogin from '../../Shared/SocialLogin/SocialLogin';

const Login = () => {
    const { login, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [errors, setErrors] = useState({ email: '', password: '', general: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        let hasError = false;
        const newErrors = { email: '', password: '', general: '' };

        if (!email) {
            newErrors.email = 'Email is required';
            hasError = true;
        }
        if (!password) {
            newErrors.password = 'Password is required';
            hasError = true;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({ email: '', password: '', general: '' });

        try {
            const result = await login(email, password);
            const user = result.user;
            setUser(user);
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login failed:", error);
            setErrors({ ...newErrors, general: 'Invalid email or password' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome Back</h1>
                    <p className="text-gray-600 text-lg">Sign in to continue to AgriLinker</p>
                </div>

                {/* Login Form Card */}
                <div className="rounded-2xl shadow-lg border border-gray-200 p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-lg" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all duration-200 text-lg placeholder-gray-400"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className="text-gray-400 text-lg" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all duration-200 text-lg placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-[#4BAF47] transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:ring-opacity-20"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    tabIndex={-1}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-lg" />
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <a className="text-[#4BAF47] hover:text-[#3A8E36] transition-colors font-semibold text-lg cursor-pointer">
                                Forgot your password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-gradient-to-r from-[#4BAF47] to-[#3A8E36] hover:from-[#3A8E36] hover:to-[#2D7A2D] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : (
                                    'Sign In to AgriLinker'
                                )}
                            </button>
                            {errors.general && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-600 text-center font-medium flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.general}
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-8">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <div className="px-4 text-gray-500 font-medium text-sm">OR CONTINUE WITH</div>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Social Login */}
                    <SocialLogin />

                    {/* Sign Up Link */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-[#4BAF47] hover:text-[#3A8E36] font-bold transition-colors hover:underline"
                            >
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;