import { geminiService } from './geminiService';

// Re-export types and services for backward compatibility
export type { DiseaseAnalysisResult } from './geminiService';

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
  // Crop Disease Diagnosis using Gemini
  async analyzeCropDisease(imageFile: File) {
    return await geminiService.analyzeCropDisease(imageFile);
  }

  // Get crop advice using Gemini
  async getCropAdvice(query: string): Promise<string> {
    return await geminiService.getCropAdvice(query);
  }

  // Market Intelligence (mock implementation for now)
  async getMarketAnalysis(crop: string, location: string): Promise<MarketAnalysisResult> {
    try {
      // Get AI insights about the market
      const insights = await geminiService.getMarketInsights(crop, location);
      
      // For now, return mock data with AI insights
      // In production, this would integrate with real market APIs
      return {
        currentPrice: Math.floor(Math.random() * 1000) + 2000,
        trend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)] as any,
        prediction: insights,
        optimalSellingTime: 'Based on current trends, consider selling within the next 7-10 days',
        nearbyMarkets: [
          { name: `${location} APMC`, price: Math.floor(Math.random() * 100) + 2200, distance: 15 },
          { name: `${location} Mandi`, price: Math.floor(Math.random() * 100) + 2150, distance: 25 },
          { name: 'Regional Market', price: Math.floor(Math.random() * 100) + 2180, distance: 35 }
        ]
      };
    } catch (error) {
      console.error('Market analysis error:', error);
      throw new Error('Failed to get market analysis');
    }
  }

  // Government Scheme Navigator (mock implementation)
  async findGovernmentSchemes(farmerProfile: {
    crops: string[];
    landSize: number;
    location: string;
    income: number;
  }): Promise<GovernmentScheme[]> {
    // This would integrate with government APIs in production
    return [
      {
        name: "PM-KISAN Samman Nidhi",
        description: "Direct income support to farmers with cultivable land holding",
        eligibility: [
          "Small and marginal farmers",
          "Cultivable land holding",
          "Valid Aadhaar card"
        ],
        benefits: "₹6,000 per year in three equal installments",
        applicationProcess: [
          "Visit PM-KISAN portal",
          "Fill registration form",
          "Upload required documents",
          "Submit application"
        ],
        documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
        deadline: "2025-12-31",
        applicationLink: "https://pmkisan.gov.in"
      }
    ];
  }

  // Voice Processing (placeholder)
  async processVoiceQuery(audioBlob: Blob, language: string = 'en'): Promise<string> {
    // This would integrate with speech-to-text and then process with Gemini
    return "Voice processing feature will be available soon. Please use text input for now.";
  }

  // Text to Speech (placeholder)
  async textToSpeech(text: string, language: string = 'en'): Promise<string> {
    // This would integrate with text-to-speech services
    return "data:audio/wav;base64,"; // Placeholder
  }
}

export const aiService = new AIService();