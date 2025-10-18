import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCheck, FiX, FiFileText, FiClock, FiDownload } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";

const FarmerVerification = () => {
    const axiosSecure = useAxiosSecure();
    
    const { data: farmers = [], isLoading, refetch } = useQuery({
        queryKey: ['farmers-verification'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/farmers/pending-verification');
            return res.data;
        }
    });

    const handleApprove = async (farmer) => {
        Swal.fire({
            title: 'Approve Farmer?',
            html: `Are you sure you want to approve <strong>${farmer.name}</strong> as a verified farmer?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Approve!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/api/farmers/${farmer._id}/approve`);
                    Swal.fire('Approved!', `${farmer.name} is now a verified farmer.`, 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error!', 'Failed to approve farmer.', 'error');
                }
            }
        });
    };

    const handleReject = async (farmer) => {
        Swal.fire({
            title: 'Reject Application?',
            html: `Are you sure you want to reject <strong>${farmer.name}</strong>'s application?`,
            icon: 'warning',
            input: 'text',
            inputLabel: 'Reason for rejection (optional)',
            inputPlaceholder: 'Enter reason...',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Reject',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const reason = result.value;
                try {
                    await axiosSecure.patch(`/api/farmers/${farmer._id}/reject`, { reason });
                    Swal.fire('Rejected!', `Application has been rejected.${reason ? ` Reason: ${reason}` : ''}`, 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error!', 'Failed to reject application.', 'error');
                }
            }
        });
    };

    const handleViewDocuments = (farmer) => {
        Swal.fire({
            title: `${farmer.name}'s Documents`,
            html: `
                <div class="text-left">
                    <div class="mb-4">
                        <strong class="block mb-2">Uploaded Documents:</strong>
                        <div class="space-y-2">
                            ${Object.entries(farmer.documents || {}).map(([docType, status]) => `
                                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span class="capitalize">${docType.replace(/([A-Z])/g, ' $1')}:</span>
                                    <span class="px-2 py-1 text-xs rounded ${
                                        status === 'uploaded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }">
                                        ${status}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="mb-4">
                        <strong class="block mb-2">Farm Information:</strong>
                        <div class="space-y-1 text-sm">
                            <div><strong>Location:</strong> ${farmer.farmLocation}</div>
                            <div><strong>Size:</strong> ${farmer.farmSize}</div>
                            <div><strong>Crops:</strong> ${farmer.crops?.join(', ') || 'Not specified'}</div>
                            <div><strong>Experience:</strong> ${farmer.experience}</div>
                        </div>
                    </div>
                </div>
            `,
            icon: 'info',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Close'
        });
    };

    const getDocumentStatus = (documents) => {
        if (!documents) return 'No documents';
        const uploaded = Object.values(documents).filter(status => status === 'uploaded').length;
        const total = Object.keys(documents).length;
        return `${uploaded}/${total} documents`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2056]"></div>
                <span className="ml-4 text-gray-600">Loading farmer applications...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiUser className="text-blue-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Applications</p>
                            <p className="text-2xl font-bold text-gray-900">{farmers.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <FiClock className="text-yellow-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Pending Review</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {farmers.filter(f => f.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FiCheck className="text-green-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Verified Farmers</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {farmers.filter(f => f.status === 'verified').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FiX className="text-red-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Rejected</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {farmers.filter(f => f.status === 'rejected').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Farmers Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Farmer Verification Applications</h2>
                    <p className="text-gray-600 mt-2">Review and verify farmer applications</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farm Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {farmers.map((farmer) => (
                                <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiUser className="text-green-600 text-lg" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{farmer.name}</div>
                                                <div className="text-sm text-gray-500">{farmer.experience || 'Experience not specified'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center">
                                            <FiMail className="mr-2 text-gray-400" size={14} />
                                            {farmer.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center mt-1">
                                            <FiPhone className="mr-2 text-gray-400" size={14} />
                                            {farmer.phone || 'No phone provided'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <FiMapPin className="mr-2 text-gray-400" size={14} />
                                                {farmer.farmLocation || 'Location not specified'}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {farmer.farmSize || 'Size not specified'} • {farmer.crops?.join(', ') || 'Crops not specified'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {getDocumentStatus(farmer.documents)}
                                        </div>
                                        <Tooltip title="View Documents & Details" arrow>
                                            <button 
                                                onClick={() => handleViewDocuments(farmer)}
                                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1 transition-colors"
                                            >
                                                <FiFileText className="mr-1" size={14} />
                                                View Details
                                            </button>
                                        </Tooltip>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(farmer.status)}`}>
                                            {farmer.status?.charAt(0).toUpperCase() + farmer.status?.slice(1) || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {farmer.appliedDate ? formatDate(farmer.appliedDate) : farmer.createdAt ? formatDate(farmer.createdAt) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {farmer.status === 'pending' && (
                                                <>
                                                    <Tooltip title="Approve Farmer" arrow>
                                                        <button
                                                            onClick={() => handleApprove(farmer)}
                                                            className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                                        >
                                                            <FiCheck size={18} />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Reject Application" arrow>
                                                        <button
                                                            onClick={() => handleReject(farmer)}
                                                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            <FiX size={18} />
                                                        </button>
                                                    </Tooltip>
                                                </>
                                            )}
                                            {(farmer.status === 'verified' || farmer.status === 'rejected') && (
                                                <Tooltip title="Download Certificate" arrow>
                                                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                                        <FiDownload size={18} />
                                                    </button>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {farmers.length === 0 && (
                    <div className="text-center py-12">
                        <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No pending applications</h3>
                        <p className="text-gray-500 mt-1">All farmer applications have been processed.</p>
                    </div>
                )}
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <FiFileText className="text-blue-600 text-xl mt-1" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Verification Process</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p className="mb-1">• Review all submitted documents carefully</p>
                            <p className="mb-1">• Verify farm location and size details</p>
                            <p className="mb-1">• Check for any previous verification history</p>
                            <p>• Contact farmer if additional information is needed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerVerification;