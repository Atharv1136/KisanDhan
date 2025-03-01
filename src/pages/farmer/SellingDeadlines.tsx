import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Bell, BellOff, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Mock data for selling deadlines
const deadlinesData = [
  { id: 1, crop: 'Wheat', startDate: '2025-04-01', endDate: '2025-06-30', status: 'active' },
  { id: 2, crop: 'Rice (Paddy)', startDate: '2025-10-01', endDate: '2025-12-31', status: 'upcoming' },
  { id: 3, crop: 'Maize', startDate: '2025-05-15', endDate: '2025-07-15', status: 'upcoming' },
  { id: 4, crop: 'Cotton', startDate: '2025-09-01', endDate: '2025-11-30', status: 'upcoming' },
  { id: 5, crop: 'Soybean', startDate: '2025-03-01', endDate: '2025-04-15', status: 'expired' },
  { id: 6, crop: 'Sugarcane', startDate: '2025-04-15', endDate: '2025-07-31', status: 'active' },
  { id: 7, crop: 'Pulses (Tur)', startDate: '2025-11-01', endDate: '2026-01-31', status: 'upcoming' },
  { id: 8, crop: 'Groundnut', startDate: '2025-08-15', endDate: '2025-10-31', status: 'upcoming' }
];

const SellingDeadlines: React.FC = () => {
  const { t } = useTranslation();
  const [notificationSet, setNotificationSet] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const toggleNotification = (deadlineId: number) => {
    if (notificationSet.includes(deadlineId)) {
      setNotificationSet(notificationSet.filter(id => id !== deadlineId));
    } else {
      setNotificationSet([...notificationSet, deadlineId]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('selling_deadlines.active')}
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            {t('selling_deadlines.upcoming')}
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {t('selling_deadlines.expired')}
          </span>
        );
      default:
        return null;
    }
  };

  const filteredDeadlines = filterStatus === 'all' 
    ? deadlinesData 
    : deadlinesData.filter(deadline => deadline.status === filterStatus);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('selling_deadlines.title')}</h1>
        <p className="text-gray-600 mb-6">{t('selling_deadlines.subtitle')}</p>
        
        {/* Filter Controls */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'all' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'active' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('upcoming')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'upcoming' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filterStatus === 'expired' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Expired
          </button>
        </div>
        
        {/* Deadlines Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('selling_deadlines.crop')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('selling_deadlines.start_date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('selling_deadlines.end_date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('selling_deadlines.days_left')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {t('selling_deadlines.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    {t('selling_deadlines.notification')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeadlines.map((deadline) => (
                  <tr key={deadline.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{deadline.crop}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(deadline.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(deadline.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {deadline.status === 'expired' ? (
                        <span className="text-sm text-gray-500">-</span>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {calculateDaysLeft(deadline.endDate)} days
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(deadline.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {deadline.status !== 'expired' && (
                        <button
                          onClick={() => toggleNotification(deadline.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                            notificationSet.includes(deadline.id)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {notificationSet.includes(deadline.id) ? (
                            <>
                              <Bell className="h-4 w-4 mr-1" />
                              Notifying
                            </>
                          ) : (
                            <>
                              <BellOff className="h-4 w-4 mr-1" />
                              Notify Me
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Calendar View Placeholder */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendar View</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Calendar view will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellingDeadlines;