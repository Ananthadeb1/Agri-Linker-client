import { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const CropRecommendation = () => {
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState(null);

    const [formData, setFormData] = useState({
        month: '',
        cropType: 'all',
        landSize: '',
        budget: ''
    });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const cropTypes = [
        { value: 'all', label: 'All Crops' },
        { value: 'cereal', label: 'Cereals' },
        { value: 'pulse', label: 'Pulses' },
        { value: 'oilseed', label: 'Oil Seeds' },
        { value: 'vegetable', label: 'Vegetables' },
        { value: 'fruit', label: 'Fruits' },
        { value: 'cash-crop', label: 'Cash Crops' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGetRecommendations = async (e) => {
        e.preventDefault();
        setLoading(true);
        setRecommendations(null);

        try {
            const response = await axiosSecure.post('/api/crop-recommendation/recommend', formData);

            if (response.data.success) {
                setRecommendations(response.data);
            } else {
                alert('Failed to get recommendations');
            }
        } catch (error) {
            console.error("Recommendation error:", error);
            alert('Failed to get crop recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-green-700 mb-4">
                        Smart Crop Advisor
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get crop suggestions based on real Bangladesh agriculture data.
                        Maximize your profits with data-driven recommendations.
                    </p>
                </div>

                {/* Recommendation Form */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-green-100">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        Find Best Crops for Your Farm
                    </h2>

                    <form onSubmit={handleGetRecommendations} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Month Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Month *
                            </label>
                            <select
                                name="month"
                                value={formData.month}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">Choose a month</option>
                                {months.map(month => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-gray-500 mt-1">When do you want to sow?</p>
                        </div>

                        {/* Crop Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Crop Type Preference
                            </label>
                            <select
                                name="cropType"
                                value={formData.cropType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                {cropTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Land Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Land Size (Acres) - Optional
                            </label>
                            <input
                                type="number"
                                name="landSize"
                                value={formData.landSize}
                                onChange={handleInputChange}
                                placeholder="e.g., 2"
                                min="0.1"
                                step="0.1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget (Taka) - Optional
                            </label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                placeholder="e.g., 50000"
                                min="1000"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing Crops...
                                    </div>
                                ) : (
                                    '🌱 Get Smart Recommendations'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {recommendations && (
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-green-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Recommended Crops for {formData.month}
                            </h2>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                {recommendations.suitableCropsCount} crops found
                            </span>
                        </div>

                        {/* Summary Stats */}
                        {recommendations.analysis.mostProfitable && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <p className="text-sm text-green-600 font-medium">🥇 Most Profitable</p>
                                    <p className="text-xl font-bold text-green-800 mt-1">{recommendations.analysis.mostProfitable.name}</p>
                                    <p className="text-green-700 font-semibold">{recommendations.analysis.mostProfitable.roi}% ROI</p>
                                </div>
                                {recommendations.analysis.highestYield && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-600 font-medium">📈 Highest Yield</p>
                                        <p className="text-xl font-bold text-blue-800 mt-1">{recommendations.analysis.highestYield.name}</p>
                                        <p className="text-blue-700 font-semibold">{recommendations.analysis.highestYield.yieldPerAcre} kg/acre</p>
                                    </div>
                                )}
                                {recommendations.analysis.lowestInvestment && (
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                        <p className="text-sm text-purple-600 font-medium">💰 Lowest Investment</p>
                                        <p className="text-xl font-bold text-purple-800 mt-1">{recommendations.analysis.lowestInvestment.name}</p>
                                        <p className="text-purple-700 font-semibold">৳{recommendations.analysis.lowestInvestment.productionCost}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Crop Recommendations */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Recommendations (Sorted by Profitability):</h3>

                            {recommendations.recommendations.map((crop, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all bg-white">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                    #{index + 1}
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {crop.name}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium capitalize">
                                                    {crop.type}
                                                </span>
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                                    {crop.season} season
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${crop.roi > 100 ? 'bg-green-100 text-green-800' :
                                                    crop.roi > 50 ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    ROI: {crop.roi}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Yield/Acre</p>
                                            <p className="text-lg font-semibold text-gray-800">{crop.yieldPerAcre.toLocaleString()} kg</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Market Price</p>
                                            <p className="text-lg font-semibold text-gray-800">৳{crop.marketPrice}/kg</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Investment</p>
                                            <p className="text-lg font-semibold text-gray-800">৳{crop.productionCost.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Net Profit</p>
                                            <p className="text-lg font-semibold text-green-600">৳{crop.netProfit.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div>
                                            <p><strong>Sowing Time:</strong> {crop.sowingMonths.join(', ')}</p>
                                            <p><strong>Harvest Time:</strong> {crop.harvestMonths.join(', ')}</p>
                                        </div>
                                        <div>
                                            <p><strong>Duration:</strong> {crop.duration} days</p>
                                            <p><strong>Season:</strong> <span className="capitalize">{crop.season}</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {recommendations.recommendations.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🌾</div>
                                <p className="text-gray-600 text-lg mb-2">
                                    No suitable crops found for {formData.month}
                                </p>
                                <p className="text-gray-500">
                                    Try selecting a different month or crop type.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropRecommendation;