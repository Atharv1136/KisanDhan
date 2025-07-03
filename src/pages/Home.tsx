import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, MapPin, Calendar, TrendingUp, ArrowRight, Users, ShoppingBag, Leaf, Brain, Camera, Mic } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-green-700 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div 
          className="relative h-[500px] bg-cover bg-center flex items-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.welcome')}</h1>
              <p className="text-xl mb-8">{t('home.subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/ai-assistant" 
                  className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  <Brain className="mr-2" size={20} />
                  Try AI Assistant
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link 
                  to="/price-comparison" 
                  className="inline-flex items-center bg-transparent border-2 border-white hover:bg-white hover:text-green-700 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {t('home.get_started')}
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">AI-Powered Farming Assistant</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of farming with our advanced AI technology powered by Google's Vertex AI
            </p>
            <div className="w-20 h-1 bg-green-600 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Disease Detection */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Camera size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">AI Crop Disease Detection</h3>
              <p className="text-gray-600 text-center mb-4">
                Upload crop photos for instant AI-powered disease diagnosis and treatment recommendations
              </p>
              <div className="text-center">
                <Link to="/ai-assistant" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                  Try Disease Analyzer
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Voice Assistant */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mic size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Voice Assistant</h3>
              <p className="text-gray-600 text-center mb-4">
                Ask questions about farming, prices, and schemes using voice commands in your local language
              </p>
              <div className="text-center">
                <Link to="/ai-assistant" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                  Start Voice Chat
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Smart Market Analysis */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Brain size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Smart Market Analysis</h3>
              <p className="text-gray-600 text-center mb-4">
                Get AI-powered market insights, price predictions, and optimal selling recommendations
              </p>
              <div className="text-center">
                <Link to="/ai-assistant" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                  View Market AI
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('home.features.title')}</h2>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <TrendingUp size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{t('home.features.price_comparison.title')}</h3>
              <p className="text-gray-600 text-center">{t('home.features.price_comparison.description')}</p>
              <div className="mt-4 text-center">
                <Link to="/price-comparison" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                  {t('nav.price_comparison')}
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <BarChart3 size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{t('home.features.msp_info.title')}</h3>
              <p className="text-gray-600 text-center">{t('home.features.msp_info.description')}</p>
              <div className="mt-4 text-center">
                <Link to="/msp-information" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                  {t('nav.msp_information')}
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MapPin size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{t('home.features.procurement.title')}</h3>
              <p className="text-gray-600 text-center">{t('home.features.procurement.description')}</p>
              <div className="mt-4 text-center">
                <Link to="/procurement-centers" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                  {t('nav.procurement_centers')}
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calendar size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{t('home.features.deadlines.title')}</h3>
              <p className="text-gray-600 text-center">{t('home.features.deadlines.description')}</p>
              <div className="mt-4 text-center">
                <Link to="/selling-deadlines" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                  {t('nav.selling_deadlines')}
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-green-600 mb-2">
                <Users size={40} className="mx-auto" />
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">10,000+</div>
              <div className="text-gray-600">Farmers Registered</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-green-600 mb-2">
                <ShoppingBag size={40} className="mx-auto" />
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">500+</div>
              <div className="text-gray-600">Procurement Centers</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-green-600 mb-2">
                <Leaf size={40} className="mx-auto" />
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">25+</div>
              <div className="text-gray-600">Crop Types Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get fair prices for your crops?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Join thousands of farmers who are making informed decisions and getting better returns with KisanDhan's AI-powered platform.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/ai-assistant" className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center">
              <Brain className="mr-2" size={20} />
              Try AI Assistant
            </Link>
            <Link to="/register" className="bg-transparent hover:bg-green-600 border-2 border-white font-bold py-3 px-8 rounded-lg transition-colors">
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;