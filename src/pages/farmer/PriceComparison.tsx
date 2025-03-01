import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

// Mock data for price comparison
const cropPriceData = [
  { id: 1, name: 'Wheat', marketPrice: 2200, msp: 2015, lastUpdated: '2025-04-10T10:30:00' },
  { id: 2, name: 'Rice (Paddy)', marketPrice: 1950, msp: 2060, lastUpdated: '2025-04-10T09:15:00' },
  { id: 3, name: 'Maize', marketPrice: 1870, msp: 1850, lastUpdated: '2025-04-10T11:45:00' },
  { id: 4, name: 'Soybean', marketPrice: 3950, msp: 3950, lastUpdated: '2025-04-10T08:30:00' },
  { id: 5, name: 'Cotton', marketPrice: 6300, msp: 6080, lastUpdated: '2025-04-10T10:00:00' },
  { id: 6, name: 'Sugarcane', marketPrice: 290, msp: 285, lastUpdated: '2025-04-10T09:30:00' },
  { id: 7, name: 'Pulses (Tur)', marketPrice: 6550, msp: 6600, lastUpdated: '2025-04-10T11:00:00' },
  { id: 8, name: 'Groundnut', marketPrice: 5850, msp: 5550, lastUpdated: '2025-04-10T10:15:00' }
];

const PriceComparison: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState<number>(1);

  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCrop(Number(e.target.value));
  };

  const selectedCropData = cropPriceData.find(crop => crop.id === selectedCrop);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getDifference = () => {
    if (!selectedCropData) return 0;
    return selectedCropData.marketPrice - selectedCropData.msp;
  };

  const getDifferencePercentage = () => {
    if (!selectedCropData) return 0;
    return ((selectedCropData.marketPrice - selectedCropData.msp) / selectedCropData.msp * 100).toFixed(2);
  };

  const getRecommendation = () => {
    if (!selectedCropData) return '';
    
    const difference = selectedCropData.marketPrice - selectedCropData.msp;
    if (difference >= 0) {
      return t('price_comparison.sell');
    } else {
      return t('price_comparison.wait');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('price_comparison.title')}</h1>
        
        {/* Crop Selection */}
        <div className="mb-8">
          <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700 mb-2">
            {t('price_comparison.select_crop')}
          </label>
          <select
            id="crop-select"
            value={selectedCrop}
            onChange={handleCropChange}
            className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            {cropPriceData.map(crop => (
              <option key={crop.id} value={crop.id}>{crop.name}</option>
            ))}
          </select>
        </div>

        {selectedCropData && (
          <>
            {/* Price Comparison Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="bg-green-700 text-white p-4">
                <h2 className="text-xl font-semibold">{selectedCropData.name} - {t('price_comparison.title')}</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Market Price */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">{t('price_comparison.market_price')}</div>
                    <div className="text-3xl font-bold text-gray-800">₹{selectedCropData.marketPrice}</div>
                    <div className="text-xs text-gray-500 mt-1">{t('price_comparison.last_updated')}: {formatDate(selectedCropData.lastUpdated)}</div>
                  </div>
                  
                  {/* MSP */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">{t('price_comparison.msp')}</div>
                    <div className="text-3xl font-bold text-gray-800">₹{selectedCropData.msp}</div>
                  </div>
                </div>
                
                {/* Difference */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{t('price_comparison.difference')}</div>
                      <div className="text-2xl font-bold flex items-center">
                        ₹{Math.abs(getDifference())}
                        {getDifference() > 0 ? (
                          <TrendingUp className="ml-2 text-green-600" size={20} />
                        ) : getDifference() < 0 ? (
                          <TrendingDown className="ml-2 text-red-600" size={20} />
                        ) : null}
                      </div>
                      <div className="text-sm mt-1">
                        {getDifference() > 0 ? (
                          <span className="text-green-600">+{getDifferencePercentage()}% above MSP</span>
                        ) : getDifference() < 0 ? (
                          <span className="text-red-600">{getDifferencePercentage()}% below MSP</span>
                        ) : (
                          <span className="text-gray-600">Equal to MSP</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">{t('price_comparison.recommendation')}</div>
                      <div className={`text-lg font-semibold ${getDifference() >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                        {getRecommendation()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Historical Chart Placeholder */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Trends (Last 30 Days)</h3>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">Historical price chart will be displayed here</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-1" />
                <span>Updated daily</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceComparison;