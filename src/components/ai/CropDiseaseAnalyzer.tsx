import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, Loader, AlertTriangle, CheckCircle, Clock, Info, Zap } from 'lucide-react';
import Webcam from 'react-webcam';
import { geminiService, DiseaseAnalysisResult } from '../../services/geminiService';

const CropDiseaseAnalyzer: React.FC = () => {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    // Show uploaded image preview
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    try {
      const analysisResult = await geminiService.analyzeCropDisease(file);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze the image. Please try again.');
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
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
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

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6">
          <div className="flex items-center mb-2">
            <Zap className="h-6 w-6 mr-2" />
            <h2 className="text-2xl font-bold">AI Crop Disease Analyzer</h2>
          </div>
          <p className="text-green-100">Powered by Google Gemini AI - Upload or capture a photo of your crop for instant disease diagnosis</p>
        </div>

        <div className="p-6">
          {/* API Key Notice */}
          {!import.meta.env.VITE_GEMINI_API_KEY && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <Info className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-yellow-700 text-sm">
                    <strong>Setup Required:</strong> To use the AI disease analyzer, please add your Google Gemini API key to the environment variables.
                  </p>
                  <p className="text-yellow-600 text-xs mt-1">
                    Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Options */}
          {!result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setShowCamera(true)}
                disabled={isAnalyzing}
                className="flex items-center justify-center p-6 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-lg font-medium text-gray-900">Take Photo</div>
                  <div className="text-sm text-gray-500">Use camera to capture crop image</div>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="flex items-center justify-center p-6 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-lg font-medium text-gray-900">Upload Image</div>
                  <div className="text-sm text-gray-500">Select from gallery (max 10MB)</div>
                </div>
              </button>
            </div>
          )}

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

          {/* Uploaded Image Preview */}
          {uploadedImage && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Uploaded Image</h3>
              <div className="relative inline-block">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded crop" 
                  className="max-w-full h-64 object-cover rounded-lg border border-gray-200"
                />
                {!isAnalyzing && !result && (
                  <button
                    onClick={resetAnalysis}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="text-center py-8">
              <Loader className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Analyzing your crop image with Google Gemini AI...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={resetAnalysis}
                    className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {result && (
            <div className="space-y-6">
              {/* New Analysis Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
                <button
                  onClick={resetAnalysis}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Analyze New Image
                </button>
              </div>

              {/* Disease Identification */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-gray-900">Disease Identified</h4>
                  <div className="flex items-center">
                    {getUrgencyIcon(result.urgency)}
                    <span className="ml-2 text-sm font-medium capitalize">{result.urgency.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Disease/Condition</div>
                    <div className="text-lg font-medium text-gray-900">{result.disease}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">AI Confidence</div>
                    <div className="text-lg font-medium text-gray-900">{(result.confidence * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Severity Level</div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getSeverityColor(result.severity)}`}>
                      {result.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <h5 className="font-medium text-blue-900 mb-2">Description</h5>
                  <p className="text-blue-800 text-sm">{result.description}</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="text-sm text-yellow-700">
                    <strong>Expected Loss if Untreated:</strong> {result.expectedLoss}
                  </div>
                </div>
              </div>

              {/* Symptoms and Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-orange-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Observed Symptoms</h4>
                  <ul className="space-y-2">
                    {result.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Possible Causes</h4>
                  <ul className="space-y-2">
                    {result.causes.map((cause, index) => (
                      <li key={index} className="flex items-start">
                        <Info className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Treatment Recommendations */}
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Treatment Recommendations</h4>
                <div className="space-y-3">
                  {result.treatment.map((treatment, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{treatment}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention Tips */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Prevention for Future Crops</h4>
                <ul className="space-y-2">
                  {result.prevention.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-600">
                  <strong>Disclaimer:</strong> This AI analysis is for informational purposes only. 
                  For critical crop issues, please consult with local agricultural experts or extension officers. 
                  Always test treatments on a small area before applying to entire crops.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDiseaseAnalyzer;