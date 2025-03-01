import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wheat, Plus, Edit, Trash, Save, X } from 'lucide-react';

// Mock data for crops
const initialCrops = [
  { id: 1, name: 'Wheat', price: 2250, quantity: 150, isEditing: false },
  { id: 2, name: 'Rice (Paddy)', price: 1980, quantity: 200, isEditing: false },
  { id: 3, name: 'Maize', price: 1890, quantity: 120, isEditing: false },
  { id: 4, name: 'Cotton', price: 6350, quantity: 80, isEditing: false }
];

const ManageCrops: React.FC = () => {
  const { t } = useTranslation();
  const [crops, setCrops] = useState(initialCrops);
  const [newCrop, setNewCrop] = useState({ name: '', price: '', quantity: '' });
  const [isAddingCrop, setIsAddingCrop] = useState(false);

  const handleEditToggle = (id: number) => {
    setCrops(crops.map(crop => 
      crop.id === id ? { ...crop, isEditing: !crop.isEditing } : crop
    ));
  };

  const handleCropChange = (id: number, field: string, value: string) => {
    setCrops(crops.map(crop => 
      crop.id === id 
        ? { 
            ...crop, 
            [field]: field === 'name' ? value : Number(value) 
          } 
        : crop
    ));
  };

  const handleNewCropChange = (field: string, value: string) => {
    setNewCrop({
      ...newCrop,
      [field]: value
    });
  };

  const handleAddCrop = () => {
    if (newCrop.name && newCrop.price && newCrop.quantity) {
      const newId = Math.max(...crops.map(crop => crop.id), 0) + 1;
      setCrops([
        ...crops,
        {
          id: newId,
          name: newCrop.name,
          price: Number(newCrop.price),
          quantity: Number(newCrop.quantity),
          isEditing: false
        }
      ]);
      setNewCrop({ name: '', price: '', quantity: '' });
      setIsAddingCrop(false);
    }
  };

  const handleDeleteCrop = (id: number) => {
    setCrops(crops.filter(crop => crop.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('shopkeeper.manage_crops.title')}</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-green-700 text-white flex justify-between items-center">
            <div className="flex items-center">
              <Wheat className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">Your Crops</h2>
            </div>
            <button
              onClick={() => setIsAddingCrop(!isAddingCrop)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {isAddingCrop ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('shopkeeper.manage_crops.add_crop')}
                </>
              )}
            </button>
          </div>
          
          {/* Add New Crop Form */}
          {isAddingCrop && (
            <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t('shopkeeper.manage_crops.add_crop')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="new-crop-name" className="block text-xs font-medium text-gray-500 mb-1">
                    {t('shopkeeper.manage_crops.crop_name')}
                  </label>
                  <input
                    type="text"
                    id="new-crop-name"
                    value={newCrop.name}
                    onChange={(e) => handleNewCropChange('name', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Enter crop name"
                  />
                </div>
                <div>
                  <label htmlFor="new-crop-price" className="block text-xs font-medium text-gray-500 mb-1">
                    {t('shopkeeper.manage_crops.current_price')}
                  </label>
                  <input
                    type="number"
                    id="new-crop-price"
                    value={newCrop.price}
                    onChange={(e) => handleNewCropChange('price', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label htmlFor="new-crop-quantity" className="block text-xs font-medium text-gray-500 mb-1">
                    {t('shopkeeper.manage_crops.quantity_available')}
                  </label>
                  <input
                    type="number"
                    id="new-crop-quantity"
                    value={newCrop.quantity}
                    onChange={(e) => handleNewCropChange('quantity', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddCrop}
                  disabled={!newCrop.name || !newCrop.price || !newCrop.quantity}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    !newCrop.name || !newCrop.price || !newCrop.quantity
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Crop
                </button>
              </div>
            </div>
          )}
          
          {/* Crops Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('shopkeeper.manage_crops.crop_name')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('shopkeeper.manage_crops.current_price')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('shopkeeper.manage_crops.quantity_available')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {crops.map((crop) => (
                  <tr key={crop.id} className={crop.isEditing ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {crop.isEditing ? (
                        <input
                          type="text"
                          value={crop.name}
                          onChange={(e) => handleCropChange(crop.id, 'name', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {crop.isEditing ? (
                        <input
                          type="number"
                          value={crop.price}
                          onChange={(e) => handleCropChange(crop.id, 'price', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">₹{crop.price}/quintal</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {crop.isEditing ? (
                        <input
                          type="number"
                          value={crop.quantity}
                          onChange={(e) => handleCropChange(crop.id, 'quantity', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{crop.quantity} quintals</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {crop.isEditing ? (
                        <button
                          onClick={() => handleEditToggle(crop.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditToggle(crop.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCrop(crop.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {crops.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No crops added yet. Click the "Add New Crop" button to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Bulk Update Section */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('shopkeeper.manage_crops.update_price')}</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="bulk-update-percentage" className="block text-xs font-medium text-gray-500 mb-1">
                  Percentage Change
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="bulk-update-percentage"
                    id="bulk-update-percentage"
                    className="focus:ring-green-500 focus:border-green-500 flex-1 block w-full rounded-none rounded-l-md text-sm border-gray-300"
                    placeholder="e.g. 5 for 5% increase"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    %
                  </span>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Apply to All
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {t('shopkeeper.manage_crops.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCrops;