import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, BarChart3, MapPin, Calendar, Target, Loader } from 'lucide-react';
import { aiService, MarketAnalysisResult } from '../../services/aiService';

const EnhancedMarketAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [location, setLocation] = useState('Karnataka');
  const [analysis, setAnalysis] = useState<MarketAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState<Array<{ date: string; price: number }>>([]);

  const crops = [
    'Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 
    'Pulses', 'Groundnut', 'Barley', 'Jowar', 'Ragi', 'Sunflower'
  ];

  const states = [
    'Karnataka', 'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh',
    'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Tamil Nadu', 'Andhra Pradesh'
  ];

  useEffect(() => {
    fetchMarketAnalysis();
  }, [selectedCrop, location]);

  const fetchMarketAnalysis = async () => {
    setLoading(true);
    try {
      const result = await aiService.getMarketAnalysis(selectedCrop, location);
      setAnalysis(result);
      
      // Generate mock price history for demo
      generatePriceHistory(result.currentPrice);
    } catch (error) {
      console.error('Error fetching market analysis:', error);
      // Fallback to mock data
      setAnalysis(mockAnalysisData);
      generatePriceHistory(mockAnalysisData.currentPrice);
    } finally {
      setLoading(false);
    }
  };

  const generatePriceHistory = (currentPrice: number) => {
    const history = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic price variations
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = Math.round(currentPrice * (1 + variation * (i / 30)));
      
      history.push({
        date: date.toISOString().split('T')[0],
        price: price
      });
    }
    
    setPriceHistory(history);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'falling':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <BarChart3 className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-green-600 bg-green-100';
      case 'falling': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">AI-Powered Market Analysis</h2>
          <p className="text-green-100">Get intelligent insights and predictions for optimal selling decisions</p>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                {crops.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Loader className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Analyzing market data with AI...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Current Price and Trend */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Current Price</h3>
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">₹{analysis.currentPrice}</div>
                  <div className="text-sm text-gray-600">per quintal</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Market Trend</h3>
                    {getTrendIcon(analysis.trend)}
                  </div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(analysis.trend)}`}>
                    {analysis.trend.toUpperCase()}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">AI Recommendation</h3>
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-700">{analysis.optimalSellingTime}</div>
                </div>
              </div>

              {/* AI Prediction */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-yellow-800">AI Market Prediction</h3>
                    <p className="text-yellow-700 mt-1">{analysis.prediction}</p>
                  </div>
                </div>
              </div>

              {/* Price History Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Price Trend</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive price chart will be displayed here</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Price range: ₹{Math.min(...priceHistory.map(p => p.price))} - ₹{Math.max(...priceHistory.map(p => p.price))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nearby Markets */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Markets</h3>
                <div className="space-y-4">
                  {analysis.nearbyMarkets.map((market, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{market.name}</div>
                          <div className="text-sm text-gray-500">{market.distance} km away</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">₹{market.price}</div>
                        <div className="text-sm text-gray-500">per quintal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Intelligence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Factors</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>High demand in urban markets</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <span>Seasonal harvest affecting supply</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Export opportunities available</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span>Weather impact on neighboring regions</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selling Strategy</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Best Selling Window</div>
                        <div className="text-xs text-gray-600">Next 7-10 days</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Target className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Target Price</div>
                        <div className="text-xs text-gray-600">₹{analysis.currentPrice + 50} - ₹{analysis.currentPrice + 100}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Recommended Market</div>
                        <div className="text-xs text-gray-600">{analysis.nearbyMarkets[0]?.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Mock data for demo
const mockAnalysisData: MarketAnalysisResult = {
  currentPrice: 2250,
  trend: 'rising',
  prediction: 'Prices are expected to increase by 8-12% over the next 2 weeks due to increased demand and reduced supply from neighboring states. Consider selling within the next 7-10 days for optimal returns.',
  optimalSellingTime: 'Sell within next 7-10 days',
  nearbyMarkets: [
    { name: 'Bangalore APMC', price: 2280, distance: 15 },
    { name: 'Mysore Mandi', price: 2240, distance: 45 },
    { name: 'Tumkur Market', price: 2220, distance: 35 },
    { name: 'Hassan APMC', price: 2260, distance: 60 }
  ]
};

export default EnhancedMarketAnalysis;