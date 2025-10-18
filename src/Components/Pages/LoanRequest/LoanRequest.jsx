import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../../../Hooks/useAuth'; // <-- Corrected import path

const LoanRequest = () => {
  const { user } = useAuth();

  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [repaymentPeriod, setRepaymentPeriod] = useState('');
  const [preferredStartDate, setPreferredStartDate] = useState('');
  const [previousLoans, setPreviousLoans] = useState('no');
  const [collateral, setCollateral] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('You must be logged in to request a loan.');
      return;
    }
    const farmerId = user._id || user.uid;

    try {
      await axios.post('http://localhost:5000/api/loans', {
        farmerId,
        amount,
        purpose,
        repaymentPeriod,
        preferredStartDate,
        previousLoans,
        collateral,
        notes,
      });
      setMessage('Loan request submitted successfully!');
      setAmount('');
      setPurpose('');
      setRepaymentPeriod('');
      setPreferredStartDate('');
      setPreviousLoans('no');
      setCollateral('');
      setNotes('');
    } catch (error) {
      console.error(error);
      setMessage('Error submitting loan request.');
    }
  };

  return (
    <div className="max-w-lg mx-auto my-14 p-8 bg-white rounded-2xl shadow-lg border border-green-200">
      <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Request a Loan</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-1 font-semibold">Amount Requested (৳)</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            className="w-full border py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g. 50000"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Loan Purpose</label>
          <input
            type="text"
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
            required
            className="w-full border py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g. Buy seeds for next season"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Repayment Period (months)</label>
          <input
            type="number"
            min="1"
            value={repaymentPeriod}
            onChange={e => setRepaymentPeriod(e.target.value)}
            required
            className="w-full border py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="e.g. 12"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Preferred Start Date</label>
          <input
            type="date"
            value={preferredStartDate}
            onChange={e => setPreferredStartDate(e.target.value)}
            required
            className="w-full border py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Previous Loans?</label>
          <select
            value={previousLoans}
            onChange={e => setPreviousLoans(e.target.value)}
            className="w-full border py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Collateral Provided</label>
          <input
            type="text"
            value={collateral}
            onChange={e => setCollateral(e.target.value)}
            className="w-full border py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Type of collateral (if any)"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Additional Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows="3"
            className="w-full border py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Anything else to mention?"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-700 rounded text-white font-semibold hover:bg-green-800 transition"
        >Submit Request</button>
      </form>
      {message && (
        <div className="mt-4 text-center text-green-700 font-medium">
          {message}
        </div>
      )}
    </div>
  );
};

export default LoanRequest;
