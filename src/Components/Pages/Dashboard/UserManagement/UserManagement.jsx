import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiShield, FiTrash2 } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { Tooltip } from "@mui/material";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";

const UserManagement = () => {
    const axiosSecure = useAxiosSecure();
    const { user: currentUser } = useAuth();
    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    const SUPER_ADMIN_EMAIL = 'ananthadebnath103@gmail.com';

    const canEditUser = (targetUser) => {
        if (!currentUser) return false;
        if (targetUser.role === 'superadmin' || targetUser.email === SUPER_ADMIN_EMAIL) return false;
        if (currentUser.role === 'superadmin' || currentUser.email === SUPER_ADMIN_EMAIL) return true;
        if (currentUser.role === 'admin') {
            return targetUser.role !== 'admin';
        }
        return false;
    };

    const canDeleteUser = (targetUser) => {
        if (!currentUser) return false;
        if (targetUser.role === 'superadmin' || targetUser.email === SUPER_ADMIN_EMAIL) return false;
        if (currentUser.role === 'superadmin' || currentUser.email === SUPER_ADMIN_EMAIL) return true;
        if (currentUser.role === 'admin') {
            return targetUser.role !== 'admin';
        }
        return false;
    };

    const roleOptions = [
        { value: 'buyer', label: 'Buyer' },
        { value: 'farmer', label: 'Farmer' },
        { value: 'admin', label: 'Admin' },
    ];

    const handleChangeRole = async (user, newRole) => {
        if (user.role === newRole) return;

        const result = await Swal.fire({
            title: `Change ${user.name}'s role to ${newRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, change role',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#4BAF47',
            cancelButtonColor: '#6b7280',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const res = await axiosSecure.patch(`/users/admin/${user._id}`, { role: newRole });
            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    icon: 'success',
                    title: 'Role updated',
                    text: `${user.name} is now a ${newRole}.`,
                    timer: 1800,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || error.message || 'Could not update role.',
            });
        }
    };

    const handleDeleteUser = (user) => {
        Swal.fire({
            title: 'Confirm User Deletion',
            text: `Are you sure you want to delete ${user.name}? This will remove the user from both the database and Firebase.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete!',
            background: '#f9fafb',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/users/${user._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0 || res.data.success) {
                            refetch();
                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: `${user.name} has been removed from database and Firebase.`,
                                timer: 2000,
                                showConfirmButton: false,
                                background: '#f9fafb'
                            });
                        }
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Deletion Failed',
                            text: error.response?.data?.message || error.message,
                            background: '#f9fafb'
                        });
                    });
            }
        });
    }




    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loader border-4 border-indigo-200 border-t-indigo-600 rounded-full w-12 h-12 animate-spin"></span>
                <span className="ml-4 text-indigo-600 font-medium">Loading users...</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-gray-50">
                <p className="text-gray-600 mt-2">Manage all registered users and their permissions</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <FiUser className="mr-3" size={18} />
                                    User
                                </div>
                            </th>
                            <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <FiMail className="mr-3" size={18} />
                                    Contact
                                </div>
                            </th>
                            <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <FiShield className="mr-3" size={18} />
                                    Role
                                </div>
                            </th>
                            <th scope="col" className="px-8 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-5 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-100">
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600 font-medium text-xl">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-lg font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 whitespace-nowrap">
                                    <div className="text-lg text-gray-900">{user.email}</div>
                                    <div className="text-sm text-gray-500">{user.phone || 'No phone provided'}</div>
                                </td>
                                <td className="px-8 py-5 whitespace-nowrap">
                                    {user.role === 'superadmin' ? (
                                        <span className="px-3 py-1.5 inline-flex items-center text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            <MdAdminPanelSettings className="mr-2" size={16} />
                                            Super Admin
                                        </span>
                                    ) : !canEditUser(user) ? (
                                        <span className="px-3 py-1.5 inline-flex items-center text-sm leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                            <MdAdminPanelSettings className="mr-2" size={16} />
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    ) : (
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user, e.target.value)}
                                            className="border border-gray-300 bg-white text-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4BAF47] transition"
                                        >
                                            {roleOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                                <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                                    {canDeleteUser(user) ? (
                                        <Tooltip title="Delete user" arrow>
                                            <button
                                                onClick={() => handleDeleteUser(user)}
                                                className="text-red-600 hover:text-red-800 p-3 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </Tooltip>
                                    ) : (
                                        <div className="text-sm text-gray-400">No actions</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{users.length}</span> users
                </div>
                <div className="flex space-x-3">
                    <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        Previous
                    </button>
                    <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;