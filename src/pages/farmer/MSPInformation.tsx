import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Download } from 'lucide-react';

// Mock data for MSP information
const mspData = [
  { id: 1, crop: 'Wheat', currentMSP: 2015, previousMSP: 1975, effectiveDate: '2024-10-01' },
  { id: 2, crop: 'Rice (Paddy)', currentMSP: 2060, previousMSP: 1940, effectiveDate: '2024-10-01' },
  { id: 3, crop: 'Maize', currentMSP: 1850, previousMSP: 1760, effectiveDate: '2024-10-01' },
  { id: 4, crop: 'Soybean', currentMSP: 3950, previousMSP: 3880, effectiveDate: '2024-10-01' },
  { id: 5, crop: 'Cotton', currentMSP: 6080, previousMSP: 5850, effectiveDate: '2024-10-01' },
  { id: 6, crop: 'Sugarcane', currentMSP: 285, previousMSP: 275, effectiveDate: '2024-10-01' },
  { id: 7, crop: 'Pulses (Tur)', currentMSP: 6600, previousMSP: 6300, effectiveDate: '2024-10-01' },
  { id: 8, crop: 'Groundnut', currentMSP: 5550, previousMSP: 5275, effectiveDate: '2024-10-01' },
  { id: 9, crop: 'Barley', currentMSP: 1635, previousMSP: 1525, effectiveDate: '2024-10-01' },
  { id: 10, crop: 'Jowar', currentMSP: 2758, previousMSP: 2640, effectiveDate: '2024-10-01' },
  { id: 11, crop: 'Ragi', currentMSP: 3578, previousMSP: 3377, effectiveDate: '2024-10-01' },
  { id: 12, crop: 'Sunflower', currentMSP: 6015, previousMSP: 5885, effectiveDate: '2024-10-01' }
];

const MSPInformation: React.FC = () => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateIncrease = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('msp_information.title')}</h1>
        <p className="text-gray-600 mb-6">{t('msp_information.subtitle')}</p>
        
        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                MSP (Minimum Support Price) is the price at which the government purchases crops from farmers, regardless of market conditions.
              </p>
            </div>
          </div>
        </div>
        
        {/* MSP Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('msp_information.crop')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('msp_information.current_msp')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('msp_information.previous_msp')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('msp_information.increase')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('msp_information.effective_date')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mspData.map((crop) => (
                  <tr key={crop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {crop.crop}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{crop.currentMSP}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{crop.previousMSP}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        +{calculateIncrease(crop.currentMSP, crop.previousMSP)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(crop.effectiveDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Download Section */}
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Download Complete MSP Information</h3>
            <p className="text-sm text-gray-500">Get detailed MSP data for all crops in PDF format</p>
          </div>
          <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Download className="-ml-1 mr-2 h-5 w-5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default MSPInformation;