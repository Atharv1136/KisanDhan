import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Camera, Mic, FileText, BarChart3 } from 'lucide-react';
import CropDiseaseAnalyzer from '../../components/ai/CropDiseaseAnalyzer';
import VoiceAssistant from '../../components/ai/VoiceAssistant';
import GovernmentSchemeNavigator from '../../components/ai/GovernmentSchemeNavigator';
import EnhancedMarketAnalysis from '../../components/ai/EnhancedMarketAnalysis';

const AIAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'disease-analyzer',
      title: 'Crop Disease Analyzer',
      description: 'Upload crop photos for instant AI-powered disease diagnosis and treatment recommendations',
      icon: Camera,
      color: 'bg-green-600',
      component: CropDiseaseAnalyzer
    },
    {
      id: 'voice-assistant',
      title: 'Voice Assistant',
      description: 'Ask questions about farming, prices, and schemes using voice commands in your local language',
      icon: Mic,
      color: 'bg-blue-600',
      component: VoiceAssistant
    },
    {
      id: 'market-analysis',
      title: 'Smart Market Analysis',
      description: 'Get AI-powered market insights, price predictions, and optimal selling recommendations',
      icon: BarChart3,
      color: 'bg-purple-600',
      component: EnhancedMarketAnalysis
    },
    {
      id: 'scheme-navigator',
      title: 'Government Scheme Navigator',
      description: 'Find and apply for government schemes tailored to your farming profile and location',
      icon: FileText,
      color: 'bg-orange-600',
      component: GovernmentSchemeNavigator
    }
  ];

  const renderActiveComponent = () => {
    const feature = features.find(f => f.id === activeFeature);
    if (!feature) return null;
    
    const Component = feature.component;
    return <Component />;
  };

  if (activeFeature) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => setActiveFeature(null)}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              ← Back to AI Assistant
            </button>
          </div>
        </div>
        {renderActiveComponent()}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <Brain className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Agricultural Assistant</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your personal agronomist powered by advanced AI. Get instant crop diagnosis, 
            market insights, and personalized farming advice.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className={`${feature.color} p-6 text-white`}>
                  <div className="flex items-center mb-4">
                    <IconComponent className="h-8 w-8 mr-3" />
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-white/90">{feature.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-medium">Try Now →</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">AI Powered</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Why Choose Our AI Assistant?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Advanced AI Technology</h3>
              <p className="text-gray-600 text-sm">
                Powered by Google's Vertex AI and Gemini models for accurate analysis
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Multi-Language Support</h3>
              <p className="text-gray-600 text-sm">
                Communicate in your local language with voice recognition
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Real-Time Insights</h3>
              <p className="text-gray-600 text-sm">
                Get instant market analysis and personalized recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-green-700 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Farming?</h2>
            <p className="text-green-100 mb-6">
              Join thousands of farmers who are already using AI to increase their crop yields and income.
            </p>
            <button
              onClick={() => setActiveFeature('disease-analyzer')}
              className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Start with Disease Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;