import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';

// Types for AI service responses
export interface DiseaseAnalysisResult {
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  treatment: string[];
  prevention: string[];
  expectedLoss: string;
  urgency: 'immediate' | 'within_week' | 'monitor';
}

export interface MarketAnalysisResult {
  currentPrice: number;
  trend: 'rising' | 'falling' | 'stable';
  prediction: string;
  optimalSellingTime: string;
  nearbyMarkets: Array<{
    name: string;
    price: number;
    distance: number;
  }>;
}

export interface GovernmentScheme {
  name: string;
  description: string;
  eligibility: string[];
  benefits: string;
  applicationProcess: string[];
  documents: string[];
  deadline: string;
  applicationLink: string;
}

class AIService {
  // Crop Disease Diagnosis
  async analyzeCropDisease(imageFile: File): Promise<DiseaseAnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Call Firebase Function that uses Vertex AI Gemini
      const analyzeDiseaseFunction = httpsCallable(functions, 'analyzeCropDisease');
      const result = await analyzeDiseaseFunction({ image: base64Image });
      
      return result.data as DiseaseAnalysisResult;
    } catch (error) {
      console.error('Disease analysis error:', error);
      throw new Error('Failed to analyze crop disease');
    }
  }

  // Market Intelligence
  async getMarketAnalysis(crop: string, location: string): Promise<MarketAnalysisResult> {
    try {
      const marketAnalysisFunction = httpsCallable(functions, 'getMarketAnalysis');
      const result = await marketAnalysisFunction({ crop, location });
      
      return result.data as MarketAnalysisResult;
    } catch (error) {
      console.error('Market analysis error:', error);
      throw new Error('Failed to get market analysis');
    }
  }

  // Government Scheme Navigator
  async findGovernmentSchemes(
    farmerProfile: {
      crops: string[];
      landSize: number;
      location: string;
      income: number;
    }
  ): Promise<GovernmentScheme[]> {
    try {
      const findSchemesFunction = httpsCallable(functions, 'findGovernmentSchemes');
      const result = await findSchemesFunction({ farmerProfile });
      
      return result.data as GovernmentScheme[];
    } catch (error) {
      console.error('Scheme search error:', error);
      throw new Error('Failed to find government schemes');
    }
  }

  // Voice Processing
  async processVoiceQuery(audioBlob: Blob, language: string = 'en'): Promise<string> {
    try {
      // Convert audio to base64
      const base64Audio = await this.blobToBase64(audioBlob);
      
      const processVoiceFunction = httpsCallable(functions, 'processVoiceQuery');
      const result = await processVoiceFunction({ 
        audio: base64Audio, 
        language 
      });
      
      return result.data as string;
    } catch (error) {
      console.error('Voice processing error:', error);
      throw new Error('Failed to process voice query');
    }
  }

  // Text to Speech
  async textToSpeech(text: string, language: string = 'en'): Promise<string> {
    try {
      const textToSpeechFunction = httpsCallable(functions, 'textToSpeech');
      const result = await textToSpeechFunction({ text, language });
      
      return result.data as string; // Returns audio URL
    } catch (error) {
      console.error('Text to speech error:', error);
      throw new Error('Failed to convert text to speech');
    }
  }

  // Utility functions
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const aiService = new AIService();