import { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantityValue: '',
    quantityUnit: 'kg',
    category: 'vegetables',
    price: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to add products');
      return;
    }

    if (!image) {
      alert('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', image);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('quantityValue', formData.quantityValue);
      formDataToSend.append('quantityUnit', formData.quantityUnit);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);

      const response = await axiosSecure.post('/api/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Product added successfully!');
        navigate('/');
        // Reset form
        setFormData({
          name: '',
          quantityValue: '',
          quantityUnit: 'kg',
          category: 'vegetables',
          price: ''
        });
        setImage(null);
        setImagePreview(null);
        document.getElementById('imageInput').value = '';
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Image Upload with Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded" />
            </div>
          )}
        </div>

        {/* Quantity and Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantityValue"
              value={formData.quantityValue}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select
              name="quantityUnit"
              value={formData.quantityUnit}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="kg">kg</option>
              <option value="grams">grams</option>
              <option value="pounds">pounds</option>
              <option value="liters">liters</option>
              <option value="pieces">pieces</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="poultry">Poultry</option>
            <option value="seafood">Seafood</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (Taka per {formData.quantityUnit})</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Farmer Email (Auto-filled) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Farmer Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;