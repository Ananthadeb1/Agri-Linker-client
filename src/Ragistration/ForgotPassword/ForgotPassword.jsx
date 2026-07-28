import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowLeft, faPaperPlane, faShieldHalved, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import useAuth from '../../Hooks/useAuth';

const ForgotPassword = () => {
    const { sendPasswordReset } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError('Please enter your email address.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await sendPasswordReset(trimmedEmail);
            setIsSent(true);
            Swal.fire({
                icon: 'success',
                title: 'Reset Link Sent!',
                text: `We've sent a password reset link to ${trimmedEmail}. Please check your inbox.`,
                confirmButtonColor: '#4BAF47',
            });
        } catch (err) {
            console.error('Password reset request error:', err);
            let message = 'Failed to send password reset email. Please try again.';
            if (err.code === 'auth/user-not-found') {
                message = 'No account associated with this email address was found.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'The email address entered is invalid.';
            } else if (err.code === 'auth/too-many-requests') {
                message = 'Too many attempts. Please wait a few minutes before trying again.';
            }
            setError(message);
            Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                text: message,
                confirmButtonColor: '#4BAF47'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4BAF47]/10 text-[#4BAF47] mb-4 shadow-sm">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
                    <p className="text-gray-600 text-base">
                        No worries! Enter your registered email and we&apos;ll send you instructions to reset your password.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {isSent ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Check Your Email</h3>
                                <p className="text-gray-600 mt-2 text-sm">
                                    We sent a reset link to <span className="font-semibold text-gray-800">{email}</span>.
                                    Click the link in the email to reset your password.
                                </p>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs text-left">
                                <span className="font-semibold">Didn&apos;t receive the email?</span> Check your spam or junk folder, or try resending below.
                            </div>

                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 rounded-xl border border-[#4BAF47] text-[#4BAF47] font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Resending...' : 'Resend Reset Link'}
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} /> Return to Login
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-base">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-lg" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError('');
                                        }}
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all text-base placeholder-gray-400"
                                        placeholder="you@example.com"
                                        autoFocus
                                    />
                                </div>
                                {error && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-md ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-gradient-to-r from-[#4BAF47] to-[#3A8E36] hover:from-[#3A8E36] hover:to-[#2D7A2D] text-white hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                                } flex items-center justify-center gap-2`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Reset Link...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faPaperPlane} /> Send Reset Link
                                    </>
                                )}
                            </button>

                            <div className="text-center pt-4 border-t border-gray-100">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center text-sm font-semibold text-[#4BAF47] hover:text-[#3A8E36] transition-colors gap-2"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Sign In
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
