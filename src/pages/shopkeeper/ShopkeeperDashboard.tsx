import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Store, Wheat, BarChart3, Users, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

// Mock data for shopkeeper dashboard
const shopData = {
  totalShops: 2,
  totalCrops: 8,
  totalSales: 125,
  recentTransactions: [
    { id: 1, date: '2025-04-10', crop: 'Wheat', quantity: 25, amount: 56250 },
    { id: 2, date: '2025-04-09', crop: 'Rice', quantity: 30, amount: 58500 },
    { id: 3, date: '2025-04-08', crop: 'Cotton', quantity: 15, amount: 94500 },
    { id: 4, date: '2025-04-07', crop: 'Maize', quantity: 20, amount: 37400 }
  ],
  popularCrops: [
    { crop: 'Wheat', percentage: 35 },
    { crop: 'Rice', percentage: 25 },
    { crop: 'Cotton', percentage: 20 },
    { crop: 'Maize', percentage: 15 },
    { crop: 'Others', percentage: 5 }
  ]
};

const ShopkeeperDashboard: React.FC = () => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('shopkeeper.dashboard.title')}</h1>
        <p className="text-gray-600 mb-8">{t('shopkeeper.dashboard.welcome')}</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shops</p>
                <p className="text-2xl font-bold text-gray-900">{shopData.totalShops}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/shopkeeper/add-shop" 
                className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center"
              >
                Add New Shop
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <Wheat className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Crops</p>
                <p className="text-2xl font-bold text-gray-900">{shopData.totalCrops}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/shopkeeper/manage-crops" 
                className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center"
              >
                Manage Crops
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{shopData.totalSales}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="#" 
                className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center"
              >
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 bg-green-700 text-white">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crop
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity (Quintals)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (₹)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shopData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.crop}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link 
              to="#" 
              className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center"
            >
              View All Transactions
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Popular Crops */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Crops</h3>
            <div className="space-y-4">
              {shopData.popularCrops.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">{item.crop}</span>
                    <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Trends (Last 7 Days)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Wheat</span>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+2.5%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Rice</span>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+1.8%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Cotton</span>
                </div>
                <div className="flex items-center text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">-0.7%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Maize</span>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+3.2%</span>
                </div>
              </div>
              
              {/* Chart Placeholder */}
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center mt-4">
                <BarChart3 className="h-6 w-6 text-gray-400" />
                <span className="ml-2 text-gray-500">Price trend chart will be displayed here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;