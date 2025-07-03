import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, FileText, ExternalLink, CheckCircle, Clock, User, MapPin } from 'lucide-react';
import { aiService, GovernmentScheme } from '../../services/aiService';

const GovernmentSchemeNavigator: React.FC = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [farmerProfile, setFarmerProfile] = useState({
    crops: [] as string[],
    landSize: 0,
    location: '',
    income: 0
  });
  const [showProfileForm, setShowProfileForm] = useState(false);

  const availableCrops = [
    'Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 
    'Pulses', 'Groundnut', 'Barley', 'Jowar', 'Ragi', 'Sunflower'
  ];

  const handleCropToggle = (crop: string) => {
    setFarmerProfile(prev => ({
      ...prev,
      crops: prev.crops.includes(crop)
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop]
    }));
  };

  const searchSchemes = async () => {
    if (farmerProfile.crops.length === 0 || !farmerProfile.location) {
      alert('Please complete your farmer profile first');
      setShowProfileForm(true);
      return;
    }

    setLoading(true);
    try {
      const foundSchemes = await aiService.findGovernmentSchemes(farmerProfile);
      setSchemes(foundSchemes);
    } catch (error) {
      console.error('Error searching schemes:', error);
      // Fallback to mock data for demo
      setSchemes(mockSchemes);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Government Scheme Navigator</h2>
          <p className="text-green-100">Find and apply for government schemes tailored to your farming needs</p>
        </div>

        <div className="p-6">
          {/* Farmer Profile Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Farmer Profile</h3>
              <button
                onClick={() => setShowProfileForm(!showProfileForm)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                {showProfileForm ? 'Hide' : 'Edit Profile'}
              </button>
            </div>

            {showProfileForm && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location (State/District)
                    </label>
                    <input
                      type="text"
                      value={farmerProfile.location}
                      onChange={(e) => setFarmerProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Karnataka, Bangalore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Land Size (Acres)
                    </label>
                    <input
                      type="number"
                      value={farmerProfile.landSize}
                      onChange={(e) => setFarmerProfile(prev => ({ ...prev, landSize: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter land size"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Income (₹)
                    </label>
                    <input
                      type="number"
                      value={farmerProfile.income}
                      onChange={(e) => setFarmerProfile(prev => ({ ...prev, income: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter annual income"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crops You Grow
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableCrops.map((crop) => (
                      <div key={crop} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`crop-${crop}`}
                          checked={farmerProfile.crops.includes(crop)}
                          onChange={() => handleCropToggle(crop)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`crop-${crop}`} className="ml-2 text-sm text-gray-700">
                          {crop}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                  <span>{farmerProfile.location || 'Location not set'}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-blue-600 mr-2" />
                  <span>{farmerProfile.landSize} acres</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-blue-600 mr-2" />
                  <span>₹{farmerProfile.income.toLocaleString()}/year</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <span>{farmerProfile.crops.length} crops</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Find Schemes */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search schemes by name or description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <button
                onClick={searchSchemes}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find Schemes'}
              </button>
            </div>
          </div>

          {/* Schemes List */}
          <div className="space-y-6">
            {filteredSchemes.map((scheme, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.name}</h3>
                    <p className="text-gray-600">{scheme.description}</p>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-orange-600 font-medium">
                      {formatDeadline(scheme.deadline)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Eligibility */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Eligibility Criteria</h4>
                    <ul className="space-y-1">
                      {scheme.eligibility.map((criteria, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                    <p className="text-sm text-gray-600">{scheme.benefits}</p>
                  </div>
                </div>

                {/* Documents Required */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Documents Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {scheme.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Application Process */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Application Process</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {scheme.applicationProcess.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Apply Button */}
                <div className="flex justify-end">
                  <a
                    href={scheme.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
            ))}

            {filteredSchemes.length === 0 && !loading && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No schemes found. Try updating your profile or search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for demo purposes
const mockSchemes: GovernmentScheme[] = [
  {
    name: "PM-KISAN Samman Nidhi",
    description: "Direct income support to farmers with cultivable land holding",
    eligibility: [
      "Small and marginal farmers",
      "Cultivable land holding",
      "Valid Aadhaar card"
    ],
    benefits: "₹6,000 per year in three equal installments",
    applicationProcess: [
      "Visit PM-KISAN portal",
      "Fill registration form",
      "Upload required documents",
      "Submit application"
    ],
    documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
    deadline: "2025-12-31",
    applicationLink: "https://pmkisan.gov.in"
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme to protect farmers against crop loss",
    eligibility: [
      "All farmers growing notified crops",
      "Sharecroppers and tenant farmers",
      "Valid land documents"
    ],
    benefits: "Insurance coverage for crop loss due to natural calamities",
    applicationProcess: [
      "Contact nearest bank or CSC",
      "Fill application form",
      "Pay premium amount",
      "Get insurance certificate"
    ],
    documents: ["Land Records", "Aadhaar Card", "Bank Account", "Sowing Certificate"],
    deadline: "2025-06-30",
    applicationLink: "https://pmfby.gov.in"
  }
];

export default GovernmentSchemeNavigator;