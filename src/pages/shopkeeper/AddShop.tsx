import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, MapPin, Phone, Info, Check } from 'lucide-react';

// Mock data for available crops
const availableCrops = [
  { id: 1, name: 'Wheat' },
  { id: 2, name: 'Rice (Paddy)' },
  { id: 3, name: 'Maize' },
  { id: 4, name: 'Soybean' },
  { id: 5, name: 'Cotton' },
  { id: 6, name: 'Sugarcane' },
  { id: 7, name: 'Pulses (Tur)' },
  { id: 8, name: 'Groundnut' }
];

const AddShop: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactNumber: '',
    description: '',
    cropsAccepted: [] as number[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCropToggle = (cropId: number) => {
    setFormData(prev => {
      const cropsAccepted = prev.cropsAccepted.includes(cropId)
        ? prev.cropsAccepted.filter(id => id !== cropId)
        : [...prev.cropsAccepted, cropId];
      
      return {
        ...prev,
        cropsAccepted
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Shop data submitted:', formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          shopName: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          contactNumber: '',
          description: '',
          cropsAccepted: []
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('shopkeeper.add_shop.title')}</h1>
        
        {isSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Shop has been successfully added! You can now manage your crops and prices.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-700 text-white flex items-center">
            <Store className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Shop Information</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Shop Name */}
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('shopkeeper.add_shop.shop_name')} *
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              {/* Contact Number */}
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('shopkeeper.add_shop.contact')} *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            {/* Address */}
            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                {t('shopkeeper.add_shop.address')} *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>
              
              {/* Pincode */}
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('shopkeeper.add_shop.description')}
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>
            
            {/* Crops Accepted */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('shopkeeper.add_shop.crops_accepted')} *
              </label>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableCrops.map((crop) => (
                    <div key={crop.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`crop-${crop.id}`}
                        checked={formData.cropsAccepted.includes(crop.id)}
                        onChange={() => handleCropToggle(crop.id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`crop-${crop.id}`} className="ml-2 text-sm text-gray-700">
                        {crop.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {formData.cropsAccepted.length === 0 && (
                <p className="mt-1 text-sm text-red-600">Please select at least one crop</p>
              )}
            </div>
            
            {/* Map Location Placeholder */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pin Shop Location on Map
              </label>
              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <MapPin className="h-6 w-6 text-gray-400" />
                <span className="ml-2 text-gray-500">Map will be displayed here</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Click on the map to set your shop's exact location
              </p>
            </div>
            
            {/* Info Note */}
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your shop information will be visible to farmers looking for places to sell their crops. Make sure all details are accurate.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || formData.cropsAccepted.length === 0}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  isSubmitting || formData.cropsAccepted.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  t('shopkeeper.add_shop.add_shop')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShop;