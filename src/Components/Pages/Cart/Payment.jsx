import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Payment = ({ cartItems, totalAmount, userId, onPaymentSuccess, onClose }) => {
    const axiosSecure = useAxiosSecure();
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardholderName, setCardholderName] = useState("");
    const [processing, setProcessing] = useState(false);

    const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Show payment completion alert
        alert('✅ Payment Completed Successfully!');
        
        // Create order after successful payment
        const response = await axiosSecure.post('/api/orders/create', {
            userId: userId,
            paymentMethod: paymentMethod,
            paymentStatus: 'completed',
            totalAmount: totalAmount
        });

        if (response.data.success) {
            onPaymentSuccess(response.data.order);
        } else {
            throw new Error('Failed to create order');
        }
    } catch (error) {
        console.error("Payment error:", error);
        alert('❌ Payment failed: ' + (error.response?.data?.message || error.message));
    } finally {
        setProcessing(false);
    }
};

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0; i < match.length; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        return parts.length ? parts.join(' ') : value;
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-green-500 text-white p-6 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Complete Payment</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                    <p className="mt-2">Total Amount: <span className="font-bold">{totalAmount} Taka</span></p>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePayment} className="p-6">
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className={`p-3 border-2 rounded-lg text-center transition ${
                                    paymentMethod === 'card' 
                                    ? 'border-green-500 bg-green-50 text-green-700' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                💳 Credit Card
                            </button>
                            <button
                                type="button"
                                className={`p-3 border-2 rounded-lg text-center transition ${
                                    paymentMethod === 'bkash' 
                                    ? 'border-green-500 bg-green-50 text-green-700' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onClick={() => setPaymentMethod('bkash')}
                            >
                                📱 bKash
                            </button>
                        </div>
                    </div>

                    {paymentMethod === 'card' ? (
                        <>
                            {/* Card Number */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* Cardholder Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    value={cardholderName}
                                    onChange={(e) => setCardholderName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* CVV */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        placeholder="123"
                                        maxLength={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* bKash Payment */
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
    <div className="text-center mb-4">
        <div className="text-3xl mb-2">📱</div>
        <h3 className="font-semibold text-blue-800">Pay with bKash</h3>
    </div>
    <p className="text-sm text-gray-600 mb-4">
        Send <strong>{totalAmount} Taka</strong> to <strong>015XXXXXXX</strong> using your bKash app.
    </p>
    
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash Phone Number
        </label>
        <input
            type="text"
            placeholder="01XXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
    </div>

    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash PIN/Password
        </label>
        <input
            type="password"
            placeholder="Enter your bKash PIN"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
    </div>

    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-yellow-800 text-center">
            💡 <strong>Tip:</strong> Use the bKash app to send money to our merchant number
        </p>
    </div>
</div>
                    )}

                    {/* Order Summary */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Order Summary</h4>
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600">
                                <span>{item.productName} (x{item.orderedQuantity})</span>
                                <span>{item.price * item.orderedQuantity} Taka</span>
                            </div>
                        ))}
                        <div className="border-t mt-2 pt-2 font-semibold flex justify-between">
                            <span>Total:</span>
                            <span>{totalAmount} Taka</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                            processing 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing Payment...
                            </div>
                        ) : (
                            `Pay ${totalAmount} Taka`
                        )}
                    </button>

                    {/* Security Notice */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        🔒 Your payment information is secure and encrypted
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Payment;