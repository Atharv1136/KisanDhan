import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Store, Wheat, FileText, Settings, Search, Edit, Trash, Plus } from 'lucide-react';

// Mock data for admin dashboard
const adminData = {
  users: [
    { id: 1, name: 'Rajesh Kumar', type: 'farmer', location: 'Jaipur, Rajasthan', status: 'active' },
    { id: 2, name: 'Amit Patel', type: 'shopkeeper', location: 'Ahmedabad, Gujarat', status: 'active' },
    { id: 3, name: 'Priya Singh', type: 'farmer', location: 'Ludhiana, Punjab', status: 'inactive' },
    { id: 4, name: 'Suresh Reddy', type: 'shopkeeper', location: 'Hyderabad, Telangana', status: 'active' }
  ],
  shops: [
    { id: 1, name: 'Sharma Agro Center', owner: 'Amit Patel', location: 'Jaipur, Rajasthan', status: 'verified' },
    { id: 2, name: 'Patel Procurement Hub', owner: 'Suresh Reddy', location: 'Ahmedabad, Gujarat', status: 'pending' }
  ],
  crops: [
    { id: 1, name: 'Wheat', currentMSP: 2015, marketPrice: 2200, lastUpdated: '2025-04-10' },
    { id: 2, name: 'Rice (Paddy)', currentMSP: 2060, marketPrice: 1950, lastUpdated: '2025-04-10' },
    { id: 3, name: 'Maize', currentMSP: 1850, marketPrice: 1870, lastUpdated: '2025-04-10' },
    { id: 4, name: 'Cotton', currentMSP: 6080, marketPrice: 6300, lastUpdated: '2025-04-10' }
  ]
};

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter data based on search query
    console.log('Searching for:', searchQuery);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('admin.title')}</h1>
        <p className="text-gray-600 mb-8">Manage users, shops, crops, and platform settings</p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Search
            </button>
          </div>
        </form>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex space-x-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === 'users'
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                {t('admin.users')}
              </button>
              <button
                onClick={() => setActiveTab('shops')}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === 'shops'
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Store className="h-4 w-4 mr-2" />
                {t('admin.shops')}
              </button>
              <button
                onClick={() => setActiveTab('crops')}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === 'crops'
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Wheat className="h-4 w-4 mr-2" />
                {t('admin.crops')}
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === 'reports'
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                {t('admin.reports')}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === 'settings'
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                {t('admin.settings')}
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Manage Users</h2>
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add User
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {adminData.users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.type === 'farmer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Shops Tab */}
            {activeTab === 'shops' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Manage Shops</h2>
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Shop
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Shop Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {adminData.shops.map((shop) => (
                        <tr key={shop.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shop.owner}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shop.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              shop.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {shop.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Crops Tab */}
            {activeTab === 'crops' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Manage Crops</h2>
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Crop
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Crop Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current MSP (₹)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Market Price (₹)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {adminData.crops.map((crop) => (
                        <tr key={crop.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{crop.currentMSP}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{crop.marketPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(crop.lastUpdated)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Reports & Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-700 mb-3">User Registration</h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-500">User registration chart will be displayed here</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Platform Usage</h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-500">Platform usage chart will be displayed here</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Price Trends</h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-500">Price trends chart will be displayed here</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Regional Distribution</h3>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-500">Regional distribution chart will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Platform Settings</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-700 mb-3">General Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="platform-name" className="block text-sm font-medium text-gray-700 mb-1">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          id="platform-name"
                          defaultValue="KisanDhan"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          defaultValue="admin@kisandhan.com"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Notification Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notify-price-changes"
                          defaultChecked
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notify-price-changes" className="ml-2 text-sm text-gray-700">
                          Send notifications for price changes
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notify-new-users"
                          defaultChecked
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notify-new-users" className="ml-2 text-sm text-gray-700">
                          Send notifications for new user registrations
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notify-new-shops"
                          defaultChecked
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notify-new-shops" className="ml-2 text-sm text-gray-700">
                          Send notifications for new shop registrations
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-700 mb-3">API Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            id="api-key"
                            defaultValue="ks_live_xxxxxxxxxxxxxxxxxxxxx"
                            readOnly
                            className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-100"
                          />
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-green-600 hover:bg-green-700">
                            Regenerate
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 mb-1">
                          Webhook URL
                        </label>
                        <input
                          type="text"
                          id="webhook-url"
                          placeholder="https://your-server.com/webhook"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

