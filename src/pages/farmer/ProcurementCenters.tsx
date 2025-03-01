import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Phone, Navigation, Star, StarOff } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Mock data for procurement centers
const procurementCenters = [
  {
    id: 1,
    name: 'Sharma Agro Center',
    address: '123 Farm Road, Jaipur, Rajasthan',
    location: { lat: 26.9124, lng: 75.7873 },
    distance: 2.5,
    cropsAccepted: ['Wheat', 'Rice', 'Maize'],
    currentPrices: { Wheat: 2250, Rice: 1980, Maize: 1890 },
    contact: '+91 98765 43210',
    openHours: '8:00 AM - 6:00 PM'
  },
  {
    id: 2,
    name: 'Patel Procurement Hub',
    address: '456 Market Street, Ahmedabad, Gujarat',
    location: { lat: 23.0225, lng: 72.5714 },
    distance: 3.8,
    cropsAccepted: ['Cotton', 'Groundnut', 'Wheat'],
    currentPrices: { Cotton: 6350, Groundnut: 5900, Wheat: 2180 },
    contact: '+91 87654 32109',
    openHours: '9:00 AM - 5:00 PM'
  },
  {
    id: 3,
    name: 'Singh Farmers Collective',
    address: '789 Rural Avenue, Ludhiana, Punjab',
    location: { lat: 30.9010, lng: 75.8573 },
    distance: 1.2,
    cropsAccepted: ['Wheat', 'Rice', 'Sugarcane'],
    currentPrices: { Wheat: 2220, Rice: 2050, Sugarcane: 295 },
    contact: '+91 76543 21098',
    openHours: '7:00 AM - 7:00 PM'
  },
  {
    id: 4,
    name: 'Krishna Agricultural Center',
    address: '234 Harvest Road, Nashik, Maharashtra',
    location: { lat: 19.9975, lng: 73.7898 },
    distance: 4.5,
    cropsAccepted: ['Soybean', 'Cotton', 'Pulses'],
    currentPrices: { Soybean: 3980, Cotton: 6280, Pulses: 6580 },
    contact: '+91 65432 10987',
    openHours: '8:30 AM - 6:30 PM'
  },
  {
    id: 5,
    name: 'Reddy Farmers Market',
    address: '567 Crop Street, Hyderabad, Telangana',
    location: { lat: 17.3850, lng: 78.4867 },
    distance: 5.7,
    cropsAccepted: ['Rice', 'Maize', 'Pulses'],
    currentPrices: { Rice: 1970, Maize: 1860, Pulses: 6520 },
    contact: '+91 54321 09876',
    openHours: '9:00 AM - 5:00 PM'
  }
];

const ProcurementCenters: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedCenters, setSavedCenters] = useState<number[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default to center of India
  const [mapZoom, setMapZoom] = useState(5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter centers based on location
    console.log('Searching for:', searchQuery);
  };

  const toggleSaveCenter = (centerId: number) => {
    if (savedCenters.includes(centerId)) {
      setSavedCenters(savedCenters.filter(id => id !== centerId));
    } else {
      setSavedCenters([...savedCenters, centerId]);
    }
  };

  const focusOnCenter = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(13);
  };

  const filteredCenters = searchQuery
    ? procurementCenters.filter(center => 
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.cropsAccepted.some(crop => crop.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : procurementCenters;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('procurement_centers.title')}</h1>
        <p className="text-gray-600 mb-6">{t('procurement_centers.subtitle')}</p>
        
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
                placeholder={t('procurement_centers.search')}
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
        
        {/* Map and Centers List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Centers List */}
          <div className="lg:col-span-1 space-y-4 h-[600px] overflow-y-auto pr-2">
            {filteredCenters.map((center) => (
              <div key={center.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                    <button 
                      onClick={() => toggleSaveCenter(center.id)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      {savedCenters.includes(center.id) ? (
                        <Star className="h-5 w-5 fill-current" />
                      ) : (
                        <StarOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-start mt-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="ml-2 text-sm text-gray-600">{center.address}</p>
                  </div>
                  
                  <div className="mt-3 flex items-center text-sm text-green-600">
                    <span className="font-medium">{t('procurement_centers.km_away', { distance: center.distance })}</span>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">{t('procurement_centers.crops_accepted')}</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {center.cropsAccepted.map((crop) => (
                        <span key={crop} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">{t('procurement_centers.current_prices')}</h4>
                    <div className="mt-1 space-y-1">
                      {Object.entries(center.currentPrices).map(([crop, price]) => (
                        <div key={crop} className="flex justify-between text-sm">
                          <span className="text-gray-600">{crop}</span>
                          <span className="font-medium text-gray-900">₹{price}/quintal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{center.contact}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <button
                        onClick={() => focusOnCenter(center.location.lat, center.location.lng)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Show on Map
                      </button>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${center.location.lat},${center.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        {t('procurement_centers.directions')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Map */}
          <div className="lg:col-span-2 h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              style={{ height: '100%', width: '100%' }}
              whenCreated={(map) => {
                map.setView(mapCenter, mapZoom);
                // Update map when center or zoom changes
                React.useEffect(() => {
                  map.setView(mapCenter, mapZoom);
                }, [mapCenter, mapZoom]);
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {procurementCenters.map((center) => (
                <Marker 
                  key={center.id} 
                  position={[center.location.lat, center.location.lng]}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-semibold">{center.name}</h3>
                      <p className="text-sm">{center.address}</p>
                      <p className="text-sm mt-1">
                        <span className="font-medium">Open:</span> {center.openHours}
                      </p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${center.location.lat},${center.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center mt-2"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        {t('procurement_centers.directions')}
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementCenters;