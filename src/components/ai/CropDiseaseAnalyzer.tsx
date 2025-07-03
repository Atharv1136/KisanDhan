import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, Loader, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Webcam from 'react-webcam';
import { aiService, DiseaseAnalysisResult } from '../../services/aiService';

const CropDiseaseAnalyzer: React.FC = () => {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await aiService.analyzeCropDisease(file);
      setResult(analysisResult);
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error('Disease analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Convert base64 to file
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'crop-photo.jpg', { type: 'image/jpeg' });
          handleImageUpload(file);
        });
      setShowCamera(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'within_week': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'monitor': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">AI Crop Disease Analyzer</h2>
          <p className="text-green-100">Upload or capture a photo of your crop for instant disease diagnosis</p>
        </div>

        <div className="p-6">
          {/* Upload Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center justify-center p-6 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 transition-colors"
            >
              <Camera className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-lg font-medium text-gray-900">Take Photo</div>
                <div className="text-sm text-gray-500">Use camera to capture crop image</div>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center p-6 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 transition-colors"
            >
              <Upload className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-lg font-medium text-gray-900">Upload Image</div>
                <div className="text-sm text-gray-500">Select from gallery</div>
              </div>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Camera Modal */}
          {showCamera && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Capture Crop Photo</h3>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg mb-4"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCamera(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Capture
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="text-center py-8">
              <Loader className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Analyzing your crop image with AI...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {result && (
            <div className="space-y-6">
              {/* Disease Identification */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Disease Identified</h3>
                  <div className="flex items-center">
                    {getUrgencyIcon(result.urgency)}
                    <span className="ml-2 text-sm font-medium capitalize">{result.urgency.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Disease</div>
                    <div className="text-lg font-medium text-gray-900">{result.disease}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Confidence</div>
                    <div className="text-lg font-medium text-gray-900">{(result.confidence * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Severity</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(result.severity)}`}>
                      {result.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="text-sm text-yellow-700">
                    <strong>Expected Loss:</strong> {result.expectedLoss}
                  </div>
                </div>
              </div>

              {/* Treatment Recommendations */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Treatment Recommendations</h3>
                <ul className="space-y-2">
                  {result.treatment.map((treatment, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention Tips */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Prevention for Future</h3>
                <ul className="space-y-2">
                  {result.prevention.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDiseaseAnalyzer;