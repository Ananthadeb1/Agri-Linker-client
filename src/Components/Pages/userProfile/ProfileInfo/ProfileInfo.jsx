import React from 'react';
import { useState, useEffect } from 'react';
import useAuth from '../../../../Hooks/useAuth';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';



import { PencilIcon, CheckIcon, XMarkIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const ProfileInfo = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        nidNumber: '',
        address: ''
    });

    // Initialize form data when user data is available
    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                email: user.email || '',
                nidNumber: user.nidNumber || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Format NID number (auto-add dashes)
        if (name === 'nidNumber') {
            const formattedValue = value.replace(/\D/g, '') // Remove non-digits
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(\d{4}-\d{3})(\d)/, '$1-$2')
                .replace(/(\d{4}-\d{3}-\d{4})(\d)/, '$1-$2')
                .slice(0, 14); // Limit to 13 digits + 2 dashes
            
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        if (!formData.displayName.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Full name is required',
            });
            return false;
        }

        if (formData.nidNumber && !/^\d{4}-\d{3}-\d{4}$/.test(formData.nidNumber)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid NID Format',
                text: 'Please enter a valid NID number (e.g., 1234-567-8901)',
            });
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            // Update profile in Firebase Auth
            await updateUserProfile({
                displayName: formData.displayName.trim()
            });

            // Update additional user data in your database
            const updateData = {
                displayName: formData.displayName.trim(),
                nidNumber: formData.nidNumber || '',
                address: formData.address.trim(),
                updatedAt: new Date().toISOString()
            };

            const response = await axiosSecure.patch('/users/update-profile', updateData);

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated!',
                    text: 'Your profile has been updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update profile. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original user data
        setFormData({
            displayName: user.displayName || '',
            email: user.email || '',
            nidNumber: user.nidNumber || '',
            address: user.address || ''
        });
        setIsEditing(false);
    };

    const formatNIDDisplay = (nid) => {
        if (!nid) return 'Not provided';
        return nid;
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                    <p className="text-gray-600 mt-1">Manage your personal details and identification</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4BAF47] text-white rounded-lg hover:bg-[#3A8E36] transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-[#4BAF47] text-white rounded-lg hover:bg-[#3A8E36] transition-colors disabled:opacity-50"
                        >
                            <CheckIcon className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Information Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4BAF47] focus:border-transparent"
                                placeholder="Enter your full name"
                                required
                            />
                        ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                                {user?.displayName || 'Not provided'}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {user?.email}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* NID Number */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <IdentificationIcon className="w-4 h-4" />
                                NID Number
                            </div>
                        </label>
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    name="nidNumber"
                                    value={formData.nidNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4BAF47] focus:border-transparent"
                                    placeholder="e.g., 1234-567-8901"
                                    maxLength={14}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Format: XXXX-XXX-XXXX
                                </p>
                            </div>
                        ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                                {formatNIDDisplay(user?.nidNumber)}
                            </div>
                        )}
                    </div>

                    {/* Address */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        {isEditing ? (
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4BAF47] focus:border-transparent resize-none"
                                placeholder="Enter your complete address (House, Road, Area, City, Postal Code)"
                            />
                        ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-wrap">
                                {user?.address || 'Not provided'}
                            </div>
                        )}
                    </div>

                    {/* Account Status Section */}
                    <div className="col-span-2 border-t pt-6 mt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Type
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 capitalize">
                                        {user?.role || 'user'}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user?.emailVerified 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {user?.emailVerified ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Member Since
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                                    {user?.metadata?.creationTime ? 
                                        new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 
                                        'Not available'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Helper Text */}
                {isEditing && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Important Information
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Fields marked with * are required</li>
                                        <li>Email address cannot be changed for security reasons</li>
                                        <li>NID number should be in the format: XXXX-XXX-XXXX</li>
                                        <li>Ensure your address is complete and accurate</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileInfo;