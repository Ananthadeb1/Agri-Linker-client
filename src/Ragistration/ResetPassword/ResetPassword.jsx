import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock, faKey, faCheckCircle, faExclamationTriangle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useAuth from '../../Hooks/useAuth';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyResetCode, confirmResetPassword } = useAuth();

    const oobCode = searchParams.get('oobCode');

    const [userEmail, setUserEmail] = useState('');
    const [isVerifying, setIsVerifying] = useState(true);
    const [verificationError, setVerificationError] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        let isMounted = true;
        const verifyCode = async () => {
            if (!oobCode) {
                if (isMounted) {
                    setVerificationError('No reset token was found in the link. Please request a new password reset link.');
                    setIsVerifying(false);
                }
                return;
            }

            try {
                const email = await verifyResetCode(oobCode);
                if (isMounted) {
                    setUserEmail(email);
                    setIsVerifying(false);
                }
            } catch (err) {
                console.error('Action code verification failed:', err);
                if (isMounted) {
                    let msg = 'This password reset link is invalid or has expired.';
                    if (err.code === 'auth/expired-action-code') {
                        msg = 'This password reset link has expired. Please request a new one.';
                    } else if (err.code === 'auth/invalid-action-code') {
                        msg = 'This password reset link is invalid or has already been used.';
                    } else if (err.code === 'auth/user-disabled') {
                        msg = 'The account associated with this reset link has been disabled.';
                    }
                    setVerificationError(msg);
                    setIsVerifying(false);
                }
            }
        };

        verifyCode();
        return () => {
            isMounted = false;
        };
    }, [oobCode, verifyResetCode]);

    const handleReset = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!password) {
            setFormError('Please enter a new password.');
            return;
        }

        if (password.length < 6) {
            setFormError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            await confirmResetPassword(oobCode, password);
            Swal.fire({
                icon: 'success',
                title: 'Password Reset Successful!',
                text: 'Your password has been updated. You can now sign in with your new password.',
                confirmButtonColor: '#4BAF47',
            }).then(() => {
                navigate('/login');
            });
        } catch (err) {
            console.error('Password reset failed:', err);
            let msg = 'Failed to reset password. Please try again.';
            if (err.code === 'auth/weak-password') {
                msg = 'Password is too weak. Please use at least 6 characters.';
            } else if (err.code === 'auth/expired-action-code' || err.code === 'auth/invalid-action-code') {
                msg = 'This reset code is invalid or has expired. Please request a new password reset email.';
            }
            setFormError(msg);
            Swal.fire({
                icon: 'error',
                title: 'Reset Failed',
                text: msg,
                confirmButtonColor: '#4BAF47'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4BAF47] border-t-transparent"></div>
                    <h2 className="text-xl font-bold text-gray-800">Verifying Reset Link...</h2>
                    <p className="text-gray-600 text-sm">Please wait while we validate your security token.</p>
                </div>
            </div>
        );
    }

    if (verificationError) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6 border border-red-100">
                    <div className="w-16 h-16 mx-auto bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Reset Link Invalid</h2>
                        <p className="text-gray-600 mt-2 text-sm">{verificationError}</p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Link
                            to="/forgot-password"
                            className="block w-full py-3.5 px-4 rounded-xl bg-[#4BAF47] text-white font-bold hover:bg-[#3A8E36] transition-colors shadow-md text-center"
                        >
                            Request New Reset Link
                        </Link>
                        <Link
                            to="/login"
                            className="block w-full py-3.5 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors text-center"
                        >
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4BAF47]/10 text-[#4BAF47] mb-4 shadow-sm">
                        <FontAwesomeIcon icon={faKey} className="text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Set New Password</h1>
                    {userEmail && (
                        <p className="text-gray-600 text-sm">
                            Resetting password for <span className="font-semibold text-gray-800">{userEmail}</span>
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleReset} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-base">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className="text-gray-400 text-lg" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all text-base placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-[#4BAF47]"
                                    tabIndex={-1}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-base">Confirm New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className="text-gray-400 text-lg" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4BAF47] focus:border-[#4BAF47] transition-all text-base placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-[#4BAF47]"
                                    tabIndex={-1}
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        {/* Requirements Indicator */}
                        <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs">
                            <div className={`flex items-center gap-2 ${password.length >= 6 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                <FontAwesomeIcon icon={faCheckCircle} /> At least 6 characters
                            </div>
                            <div className={`flex items-center gap-2 ${password && password === confirmPassword ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                <FontAwesomeIcon icon={faCheckCircle} /> Passwords match
                            </div>
                        </div>

                        {formError && (
                            <p className="text-red-500 text-sm flex items-center">
                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {formError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-md ${
                                isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-gradient-to-r from-[#4BAF47] to-[#3A8E36] hover:from-[#3A8E36] hover:to-[#2D7A2D] text-white hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                            }`}
                        >
                            {isSubmitting ? 'Updating Password...' : 'Reset Password'}
                        </button>

                        <div className="text-center pt-2">
                            <Link
                                to="/login"
                                className="inline-flex items-center text-sm font-semibold text-[#4BAF47] hover:text-[#3A8E36] transition-colors gap-2"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} /> Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
