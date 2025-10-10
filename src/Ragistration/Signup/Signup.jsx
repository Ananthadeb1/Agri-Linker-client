import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faLock, faUser, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";
import SocialLogin from "../../Shared/SocialLogin/SocialLogin";

const Signup = () => {
    const axiosPublic = useAxiosPublic();
    const { register, setError, formState: { errors }, } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (event) => {
        event.preventDefault();
        const form = event.target;
        const data = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            confirm_password: form.confirm_password.value,
            role: form.role.value,
        };
        const name = data.name;
        const email = data.email;
        const password1 = data.password;
        const password2 = data.confirm_password;
        const role = data.role;

        if (password1.length < 6) {
            setError("password", { type: "manual", message: "Password must be at least 6 characters long" });
            return;
        }
        else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(password1)) {
            setError("password", { type: "manual", message: "Password must contain at least one letter, one number, and one special character" });
            return;
        }
        if (password1 !== password2) {
            setError("confirm_password", { type: "manual", message: "Passwords do not match!" });
            return;
        }

        setIsLoading(true);

        try {
            const result = await createUser(email, password1);
            await updateUserProfile(name, "");

            console.log("User profile updated successfully");
            const userInfo = {
                uid: result.user.uid,
                name: name,
                email: email,
                role: role,
                createdAt: new Date()
            }

            const res = await axiosPublic.post("/users", userInfo);
            if (res.data.insertedId) {
                console.log("User info saved to database:", res.data);
                navigate("/");
            } else {
                console.log("User info not saved to database:", res.data);
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.code === "auth/email-already-in-use") {
                setError("email", { type: "manual", message: "Email is already in use. Please use a different email." });
            } else if (error.code === "auth/invalid-email") {
                setError("email", { type: "manual", message: "Invalid email format. Please enter a valid email." });
            } else if (error.code === "auth/weak-password") {
                setError("password", { type: "manual", message: "Password is too weak. Please use a stronger password." });
            } else {
                setError("form", { type: "manual", message: "Failed to create user. Please try again." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">Join AgriLinker</h1>
                    <p className="text-gray-600 text-lg">Create your account to get started</p>
                </div>

                {/* Signup Form Card */}
                <div className="rounded-2xl shadow-lg border border-gray-200 p-8">
                    <form onSubmit={handleSignup} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-lg" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    {...register("name", { required: true })}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all duration-200 text-lg text-gray-800 placeholder-gray-400"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    This field is required
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-lg" />
                                </div>
                                <input
                                    type="email"
                                    {...register("email")}
                                    name="email"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all duration-200 text-lg text-gray-800 placeholder-gray-400"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">I am a</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <select
                                    name="role"
                                    {...register("role", { required: true })}
                                    className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all duration-200 text-lg text-gray-800 appearance-none bg-white cursor-pointer"
                                    defaultValue=""
                                >
                                    <option value="" disabled className="text-gray-400">Select your role</option>
                                    <option value="farmer" className="text-gray-800">Farmer</option>
                                    <option value="buyer" className="text-gray-800">Buyer</option>
                                    <option value="both" className="text-gray-800">Both Farmer & Buyer</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                                </div>
                            </div>
                            {errors.role && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Please select your role
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
                                    {...register("password")}
                                    name="password"
                                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all duration-200 text-lg text-gray-800 placeholder-gray-400"
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
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className="text-gray-400 text-lg" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirm_password")}
                                    name="confirm_password"
                                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all duration-200 text-lg text-gray-800 placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-[#4BAF47] transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:ring-opacity-20"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    tabIndex={-1}
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-lg" />
                                </button>
                            </div>
                            {errors.confirm_password && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    {errors.confirm_password.message}
                                </p>
                            )}
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
                                        Creating Account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                            {errors.form && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-600 text-center font-medium flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.form.message}
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

                    {/* Login Link */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-[#4BAF47] hover:text-[#3A8E36] font-bold transition-colors hover:underline"
                            >
                                Sign in now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;