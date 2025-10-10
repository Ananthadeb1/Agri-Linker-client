/* eslint-disable no-undef */
import { useState, useRef } from 'react';
import { ChevronRightIcon, CameraIcon, UserIcon, CalendarIcon, ClipboardDocumentListIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
// import Itinerary from './Itinerary/Itinerary';
// import ProfileTab from './ProfileTab/ProfileTab';
// import BookingStatusTab from './BookingStatusTab/BookingStatusTab';
// import HistoryTab from './HistoryTab/HistoryTab';
// import ExpenseTrackingTab from './ExpenseTrackingTab/ExpenseTrackingTab';
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const UserProfile = () => {
    const { loggedUser } = useAuth();
    const [activeTab, setActiveTab] = useState('Profile');
    const [userData, setUserData] = useState(loggedUser);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const tabs = [
        { name: 'Profile', icon: UserIcon },
        { name: 'Itinerary', icon: CalendarIcon },
        { name: 'Booking Status', icon: ClipboardDocumentListIcon },
        { name: 'History', icon: ClockIcon },
        { name: 'Expense Tracking', icon: ChartBarIcon },
    ];

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid file type',
                text: 'Please select an image file (JPEG, PNG, etc.)',
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'File too large',
                text: 'Please select an image smaller than 5MB',
            });
            return;
        }

        setUploading(true);

        try {
            // 1. Show temporary image immediately
            const tempUrl = URL.createObjectURL(file);
            setUserData({ ...userData, image: tempUrl });

            // 2. Create FormData for multer
            const formData = new FormData();
            formData.append('image', file);
            formData.append('userId', loggedUser._id);

            // 3. Upload to your backend with multer
            const uploadResponse = await axiosSecure.post('/upload/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (uploadResponse.data.success) {
                const imageUrl = uploadResponse.data.imageUrl;

                // 4. Update user profile with the new image URL
                await handleProfileUpdate({ image: imageUrl });

                await Swal.fire({
                    icon: 'success',
                    title: 'Profile picture updated!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            // Revert on error
            setUserData(loggedUser);

            Swal.fire({
                icon: 'error',
                title: 'Upload failed',
                text: error.response?.data?.message || error.message || 'Failed to upload image',
            });
            console.error('Image upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleProfileUpdate = async (updateData) => {
        try {
            const response = await axiosSecure.patch(`/users/${loggedUser._id}`, updateData);
            if (response.data.success) {
                const updatedUser = { ...loggedUser, ...updateData };
                setUserData(updatedUser);
                queryClient.setQueryData(['user', loggedUser._id], updatedUser);

                await Swal.fire({
                    icon: 'success',
                    title: 'Profile updated successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
                return true;
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: error.response?.data?.message || error.message,
            });
            throw error;
        }
    };

    const triggerFileInput = () => {
        if (!uploading) {
            fileInputRef.current.click();
        }
    };

    const renderTabContent = () => {
        // switch (activeTab) {
        //     case 'Profile':
        //         return (
        //             <ProfileTab
        //                 user={userData}
        //                 onEdit={handleProfileUpdate}
        //             />
        //         );
        //     case 'Itinerary':
        //         return <Itinerary trips={[]} />;
        //     case 'Booking Status':
        //         return <BookingStatusTab />;
        //     case 'History':
        //         return <HistoryTab />;
        //     case 'Expense Tracking':
        //         return <ExpenseTrackingTab />;
        //     default:
        //         return null;
        // }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Navigation with Profile */}
                    <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {/* Profile Picture and Name */}
                        <div className="flex flex-col items-center mb-8 relative group">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-[#4BAF47] relative">
                                    {userData?.image ? (
                                        <img
                                            src={userData.image}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                            <UserIcon className="w-10 h-10" />
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={triggerFileInput}
                                    disabled={uploading}
                                    className={`absolute bottom-2 right-0 p-2 rounded-full shadow-lg transition-colors ${uploading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#4BAF47] hover:bg-[#3A8E36] text-white'
                                        }`}
                                    aria-label="Change profile picture"
                                >
                                    <CameraIcon className="w-4 h-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    disabled={uploading}
                                />
                            </div>

                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                    {userData?.name || 'No Name Provided'}
                                </h1>
                                <p className="text-gray-600 text-sm">{userData?.email || 'No Email Provided'}</p>
                                <div className="mt-2 px-3 py-1 bg-[#F0F9F0] rounded-full">
                                    <span className="text-[#4BAF47] text-xs font-medium">Active Farmer</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.name}
                                        onClick={() => setActiveTab(tab.name)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 ${activeTab === tab.name
                                            ? 'bg-[#4BAF47] text-white shadow-md'
                                            : 'hover:bg-[#F0F9F0] text-gray-700 hover:text-[#4BAF47] border border-transparent hover:border-[#4BAF47]'
                                            }`}
                                        aria-current={activeTab === tab.name ? 'page' : undefined}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconComponent className={`w-5 h-5 ${activeTab === tab.name ? 'text-white' : 'text-gray-500'
                                                }`} />
                                            <span className="font-medium">{tab.name}</span>
                                        </div>
                                        {activeTab === tab.name && (
                                            <ChevronRightIcon className="w-5 h-5 text-white" />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Content Area */}
                    <main className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <div className="h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-3 h-8 rounded-full bg-[#4BAF47]`}></div>
                                <h2 className="text-2xl font-bold text-gray-800">{activeTab}</h2>
                            </div>
                            {renderTabContent()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;