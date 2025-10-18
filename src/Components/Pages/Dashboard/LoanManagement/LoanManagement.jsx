import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { FiDollarSign, FiUser, FiCalendar, FiCheck, FiX, FiClock, FiFileText } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";

const LoanManagement = () => {
    const axiosSecure = useAxiosSecure();
    
    const { data: loans = [], isLoading, refetch } = useQuery({
        queryKey: ['loan-applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/loans/all');
            return res.data;
        }
    });

    const handleApproveLoan = async (loan) => {
        Swal.fire({
            title: 'Approve Loan?',
            html: `Approve loan application from <strong>${loan.farmerId}</strong> for ৳${loan.amount}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Approve Loan',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/api/loans/${loan._id}/approve`);
                    Swal.fire('Approved!', 'Loan application has been approved.', 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error!', 'Failed to approve loan.', 'error');
                }
            }
        });
    };

    const handleRejectLoan = async (loan) => {
        Swal.fire({
            title: 'Reject Loan?',
            html: `Reject loan application from <strong>${loan.farmerId}</strong> for ৳${loan.amount}?`,
            icon: 'warning',
            input: 'text',
            inputLabel: 'Reason for rejection',
            inputPlaceholder: 'Enter reason...',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Reject Loan',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please provide a reason for rejection';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const reason = result.value;
                try {
                    await axiosSecure.patch(`/api/loans/${loan._id}/reject`, { reason });
                    Swal.fire('Rejected!', `Loan application rejected. Reason: ${reason}`, 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error!', 'Failed to reject loan.', 'error');
                }
            }
        });
    };

    const handleDisburseLoan = async (loan) => {
        Swal.fire({
            title: 'Disburse Funds?',
            html: `Disburse ৳${loan.amount} to <strong>${loan.farmerId}</strong>?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Disburse Funds',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/api/loans/${loan._id}/disburse`);
                    Swal.fire('Disbursed!', 'Loan funds have been disbursed.', 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error!', 'Failed to disburse loan.', 'error');
                }
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'disbursed': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <FiCheck className="text-green-600" />;
            case 'rejected': return <FiX className="text-red-600" />;
            case 'disbursed': return <FiDollarSign className="text-blue-600" />;
            case 'pending': return <FiClock className="text-yellow-600" />;
            case 'completed': return <FiCheck className="text-purple-600" />;
            default: return <FiClock className="text-gray-600" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2056]"></div>
                <span className="ml-4 text-gray-600">Loading loan applications...</span>
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
                            <FiFileText className="text-blue-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Applications</p>
                            <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <FiClock className="text-yellow-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loans.filter(loan => loan.status === 'pending').length}
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
                            <p className="text-sm text-gray-600">Approved</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loans.filter(loan => loan.status === 'approved').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FiDollarSign className="text-purple-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ৳{loans.reduce((total, loan) => total + loan.amount, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loans Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Loan Applications</h2>
                    <p className="text-gray-600 mt-2">Manage farmer loan applications and disbursements</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repayment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loans.map((loan) => (
                                <tr key={loan._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                <FiUser className="text-orange-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{loan.farmerId}</div>
                                                <div className="text-sm text-gray-500">Farmer</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            ৳{loan.amount?.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {loan.preferredStartDate ? formatDate(loan.preferredStartDate) : 'Not specified'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                            {loan.purpose}
                                        </div>
                                        {loan.notes && (
                                            <Tooltip title={loan.notes} arrow>
                                                <div className="text-sm text-gray-500 truncate">
                                                    {loan.notes.substring(0, 30)}...
                                                </div>
                                            </Tooltip>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {loan.repaymentPeriod} months
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {loan.previousLoans || 'No previous loans'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(loan.status)}
                                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                                                {loan.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(loan.requestedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {loan.status === 'pending' && (
                                                <>
                                                    <Tooltip title="Approve Loan" arrow>
                                                        <button
                                                            onClick={() => handleApproveLoan(loan)}
                                                            className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                                        >
                                                            <FiCheck size={18} />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Reject Loan" arrow>
                                                        <button
                                                            onClick={() => handleRejectLoan(loan)}
                                                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            <FiX size={18} />
                                                        </button>
                                                    </Tooltip>
                                                </>
                                            )}
                                            {loan.status === 'approved' && (
                                                <Tooltip title="Disburse Funds" arrow>
                                                    <button
                                                        onClick={() => handleDisburseLoan(loan)}
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        <FiDollarSign size={18} />
                                                    </button>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="View Details" arrow>
                                                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <FiFileText size={18} />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loans.length === 0 && (
                    <div className="text-center py-12">
                        <FiDollarSign className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No loan applications</h3>
                        <p className="text-gray-500 mt-1">There are no pending loan applications to review.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanManagement;
