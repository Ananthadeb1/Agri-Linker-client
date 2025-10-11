import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvestPage = () => {
  const [loans, setLoans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/loans/all')
      .then(res => setLoans(res.data))
      .catch(err => console.error('Error fetching loans:', err));
  }, []);

  const handleInvest = (loanId) => {
    setSelectedLoanId(loanId);
    setAmount('');
    setShowModal(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setShowModal(false);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-4xl font-bold mb-8 text-center text-green-700">Invest in Farmer Loans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loans.length === 0 && <p className="text-center col-span-full">No loan requests available at the moment.</p>}
        {loans.map(loan => (
          <div key={loan._id} className="bg-white rounded-lg p-6 shadow-md flex flex-col">
            <h3 className="text-2xl font-semibold mb-2">{loan.purpose}</h3>
            <p><strong>Amount Requested:</strong> ৳{loan.amount}</p>
            <p><strong>Repayment Period:</strong> {loan.repaymentPeriod} months</p>
            <p><strong>Preferred Start Date:</strong> {loan.preferredStartDate}</p>
            <p><strong>Previous Loans:</strong> {loan.previousLoans}</p>
            <p><strong>Collateral:</strong> {loan.collateral}</p>
            <p className="mt-2 mb-4"><strong>Additional Notes:</strong><br />{loan.notes}</p>
            <button
              onClick={() => handleInvest(loan._id)}
              className="mt-auto bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800 font-semibold transition"
            >
              Invest
            </button>
          </div>
        ))}
      </div>
      {/* Dummy payment modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form 
            onSubmit={handlePayment} 
            className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full"
          >
            <h4 className="text-2xl font-semibold mb-4 text-green-700">Pay Investment Amount</h4>
            <label className="block mb-2 font-medium text-gray-700">Amount to Invest (৳):</label>
            <input
              type="number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded mb-6 focus:outline-none focus:border-green-700"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min={1}
            />
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-800 transition mt-2"
            >
              Pay Now
            </button>
            <button
              type="button"
              className="w-full mt-2 py-2 rounded text-gray-700 hover:text-red-700"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      {/* Success popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <h4 className="text-xl font-bold text-green-700 mb-2">Payment Successful!</h4>
            <p className="mb-4">Thank you for investing. Your transaction was completed.</p>
            <button
              className="bg-green-600 px-6 py-2 rounded text-white font-semibold hover:bg-green-800 transition"
              onClick={handleCloseSuccess}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestPage;
