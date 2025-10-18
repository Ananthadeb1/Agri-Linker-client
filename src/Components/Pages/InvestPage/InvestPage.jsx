import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FiDollarSign, FiUser, FiCalendar, FiMapPin, FiTrendingUp, FiShield } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";

const InvestPage = () => {
    const axiosSecure = useAxiosSecure();
    
    const { data: loans = [], isLoading, refetch } = useQuery({
        queryKey: ['invest-loans'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/loans/all');
            return res.data;
        }
    });

    const handleInvest = (loan) => {
        Swal.fire({
            title: 'Invest in Loan?',
            html: `
                <div class="text-left">
                    <p class="mb-3">Are you sure you want to invest in this loan request?</p>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p><strong>Farmer:</strong> ${loan.farmerId}</p>
                        <p><strong>Amount:</strong> ৳${loan.amount?.toLocaleString()}</p>
                        <p><strong>Purpose:</strong> ${loan.purpose}</p>
                        <p><strong>Repayment:</strong> ${loan.repaymentPeriod} months</p>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Investment Amount (৳)</label>
                        <input 
                            type="number" 
                            id="investmentAmount"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter amount"
                            min="1000"
                            max="${loan.amount}"
                        />
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Confirm Investment',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const amount = document.getElementById('investmentAmount').value;
                if (!amount || amount < 1000 || amount > loan.amount) {
                    Swal.showValidationMessage('Please enter a valid amount between 1,000 and ' + loan.amount);
                }
                return { amount: parseInt(amount) };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const investmentData = {
                    loanId: loan._id,
                    farmerId: loan.farmerId,
                    amount: result.value.amount,
                    investorId: "current_user_id", // You'll need to get this from auth
                    investedAt: new Date()
                };

                try {
                    // API call to create investment
                    // await axiosSecure.post('/api/investments', investmentData);
                    Swal.fire('Success!', `You have successfully invested ৳${result.value.amount.toLocaleString()} in this loan.`, 'success');
                    refetch();
                } catch (error) {
                    Swal.fire('Error!', 'Failed to process investment.', 'error');
                }
            }
        });
    };

    const getRiskLevel = (loan) => {
        if (loan.previousLoans === 'yes') return 'Low Risk';
        if (loan.collateral) return 'Medium Risk';
        return 'High Risk';
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'Low Risk': return 'bg-green-100 text-green-800';
            case 'Medium Risk': return 'bg-yellow-100 text-yellow-800';
            case 'High Risk': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading investment opportunities...</p>
                </div>
            </div>
        );
    }

    const availableLoans = loans.filter(loan => loan.status === 'pending' || loan.status === 'approved');

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Invest in Farmer Loans
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Support local farmers and earn returns by investing in agricultural loans. 
                    Help farmers grow while growing your investment.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiTrendingUp className="text-green-600 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Available Loans</p>
                            <p className="text-2xl font-bold text-gray-900">{availableLoans.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiDollarSign className="text-blue-600 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ৳{availableLoans.reduce((total, loan) => total + loan.amount, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <FiUser className="text-purple-600 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Active Farmers</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Set(availableLoans.map(loan => loan.farmerId)).size}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <FiShield className="text-orange-600 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Avg. Return</p>
                            <p className="text-2xl font-bold text-gray-900">8-12%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loan Listings */}
            {availableLoans.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                        <h2 className="text-2xl font-bold text-gray-800">Available Loan Opportunities</h2>
                        <p className="text-gray-600 mt-2">Browse and invest in farmer loan requests</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repayment</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {availableLoans.map((loan) => (
                                    <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                                    <FiUser className="text-green-600 text-lg" />
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
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                <FiCalendar className="mr-1" size={14} />
                                                {loan.preferredStartDate ? formatDate(loan.preferredStartDate) : 'Flexible'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs">
                                                {loan.purpose}
                                            </div>
                                            {loan.notes && (
                                                <Tooltip title={loan.notes} arrow>
                                                    <div className="text-sm text-gray-500 truncate">
                                                        {loan.notes.substring(0, 50)}...
                                                    </div>
                                                </Tooltip>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {loan.repaymentPeriod} months
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {loan.previousLoans === 'yes' ? 'Has previous loans' : 'First-time borrower'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(getRiskLevel(loan))}`}>
                                                {getRiskLevel(loan)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(loan.requestedAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleInvest(loan)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
                                            >
                                                <FiDollarSign className="mr-2" size={16} />
                                                Invest
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center mb-8">
                    <FiDollarSign className="mx-auto text-6xl text-gray-400 mb-4" />
                    <h3 className="text-2xl font-medium text-gray-900 mb-2">No loan requests available</h3>
                    <p className="text-gray-500 mb-6">There are no loan requests available for investment at the moment.</p>
                    <button 
                        onClick={() => refetch()}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Refresh List
                    </button>
                </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Invest with AgriLinker?</h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center">
                                <FiTrendingUp className="text-green-500 mr-3" />
                                <span>Earn competitive returns of 8-12% annually</span>
                            </li>
                            <li className="flex items-center">
                                <FiShield className="text-blue-500 mr-3" />
                                <span>Secure investments with farmer collateral</span>
                            </li>
                            <li className="flex items-center">
                                <FiUser className="text-purple-500 mr-3" />
                                <span>Direct impact on local farmers' livelihoods</span>
                            </li>
                            <li className="flex items-center">
                                <FiMapPin className="text-orange-500 mr-3" />
                                <span>Support sustainable agriculture in Bangladesh</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h3>
                        <div className="space-y-3 text-gray-600">
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Email:</span>
                                contact@agrilinker.com
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Phone:</span>
                                01612345678
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Address:</span>
                                123 Natura Bazar, Dhaka, Bangladesh
                            </p>
                        </div>
                        
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Follow Us</h4>
                            <p className="text-gray-600 mb-4">Join us on social media</p>
                            <div className="flex space-x-4">
                                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    📘
                                </button>
                                <button className="text-blue-400 hover:text-blue-600 transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    🐦
                                </button>
                                <button className="text-pink-600 hover:text-pink-800 transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    📷
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-500">
                        Copyright © 2025 - All right reserved by Agri Linker
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InvestPage;