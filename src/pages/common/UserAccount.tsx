import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Bell, Star, Settings, LogOut } from 'lucide-react';

// Mock user data
const userData = {
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@example.com',
  phone: '+91 98765 43210',
  location: 'Jaipur, Rajasthan',
  preferredCrops: ['Wheat', 'Rice', 'Maize'],
  savedCenters: [
    { id: 1, name: 'Sharma Agro Center', address: '123 Farm Road, Jaipur, Rajasthan' },
    { id: 3, name: 'Singh Farmers Collective', address: '789 Rural Avenue, Ludhiana, Punjab' }
  ],
  notifications: [
    { id: 1, type: 'price', message: 'Wheat prices increased by 5% in your area', date: '2025-04-10T10:30:00', read: false },
    { id: 2, type: 'deadline', message: 'Selling deadline for Sugarcane is approaching (15 days left)', date: '2025-04-09T14:45:00', read: true },
    { id: 3, type: 'center', message: 'New procurement center opened near your location', date: '2025-04-08T09:15:00', read: false }
  ]
};

const UserAccount: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    location: userData.location
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    console.log('Updated profile:', formData);
    alert('Profile updated successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('user_account.title')}</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex space-x-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === 'profile'
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                {t('user_account.profile')}
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === 'preferences'
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                {t('user_account.preferences')}
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === 'saved'
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Star className="h-4 w-4 mr-2" />
                {t('user_account.saved_centers')}
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === 'notifications'
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Bell className="h-4 w-4 mr-2" />
                {t('user_account.notifications')}
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  {userData.notifications.filter(n => !n.read).length}
                </span>
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('user_account.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('user_account.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('user_account.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('user_account.location')}
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {t('user_account.update')}
                  </button>
                </div>
              </form>
            )}
            
            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('user_account.preferred_crops')}</h3>
                <div className="space-y-4">
                  {availableCrops.map((crop) => (
                    <div key={crop.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`pref-crop-${crop.id}`}
                        checked={userData.preferredCrops.includes(crop.name)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`pref-crop-${crop.id}`} className="ml-2 text-sm text-gray-700">
                        {crop.name}
                      </label>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-price"
                      checked={true}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-price" className="ml-2 text-sm text-gray-700">
                      Price changes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-deadline"
                      checked={true}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-deadline" className="ml-2 text-sm text-gray-700">
                      Selling deadlines
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-center"
                      checked={true}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify-center" className="ml-2 text-sm text-gray-700">
                      New procurement centers
                    </label>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
            
            {/* Saved Centers Tab */}
            {activeTab === 'saved' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Procurement Centers</h3>
                {userData.savedCenters.length > 0 ? (
                  <div className="space-y-4">
                    {userData.savedCenters.map((center) => (
                      <div key={center.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">{center.name}</h4>
                            <div className="flex items-start mt-1">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="ml-2 text-sm text-gray-600">{center.address}</p>
                            </div>
                          </div>
                          <div>
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No saved centers yet. You can save centers from the Procurement Centers page.</p>
                )}
              </div>
            )}
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Notifications</h3>
                {userData.notifications.length > 0 ? (
                  <div className="space-y-4">
                    {userData.notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-lg border-l-4 ${
                          notification.read 
                            ? 'bg-gray-50 border-gray-300' 
                            : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(notification.date)}
                            </p>
                          </div>
                          {!notification.read && (
                            <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No notifications yet.</p>
                )}
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Mark All as Read
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

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

export default UserAccount;