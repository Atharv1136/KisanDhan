import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key-here';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface DiseaseAnalysisResult {
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  treatment: string[];
  prevention: string[];
  expectedLoss: string;
  urgency: 'immediate' | 'within_week' | 'monitor';
  description: string;
  symptoms: string[];
  causes: string[];
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async analyzeCropDisease(imageFile: File): Promise<DiseaseAnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Create the prompt for crop disease analysis
      const prompt = `
        You are an expert agricultural pathologist and crop disease specialist. Analyze this crop image and provide a comprehensive disease diagnosis.

        Please analyze the image and provide a detailed response in the following JSON format:

        {
          "disease": "Name of the disease or condition",
          "confidence": 0.85,
          "severity": "low|medium|high",
          "description": "Detailed description of the disease",
          "symptoms": ["List of visible symptoms"],
          "causes": ["Possible causes of the disease"],
          "treatment": [
            "Immediate treatment step 1",
            "Treatment step 2",
            "Treatment step 3"
          ],
          "prevention": [
            "Prevention measure 1",
            "Prevention measure 2",
            "Prevention measure 3"
          ],
          "expectedLoss": "Percentage or description of expected crop loss",
          "urgency": "immediate|within_week|monitor"
        }

        Guidelines for analysis:
        1. If you can identify a specific disease, provide the exact name
        2. If the plant looks healthy, indicate "Healthy Plant" as the disease
        3. Consider common crop diseases like blight, rust, wilt, mosaic virus, etc.
        4. Provide practical, locally available treatment options
        5. Include both organic and chemical treatment options where applicable
        6. Consider the severity based on the extent of damage visible
        7. Urgency should be "immediate" for severe infections, "within_week" for moderate, "monitor" for mild
        8. Expected loss should be realistic (e.g., "5-10%", "20-30%", "Minimal if treated promptly")

        Focus on actionable advice that farmers can implement with commonly available resources.
      `;

      // Prepare the image data
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: imageFile.type
        }
      };

      // Generate content with image and prompt
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      try {
        // Extract JSON from the response (in case there's additional text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        const analysisResult = JSON.parse(jsonMatch[0]);
        
        // Validate and ensure all required fields are present
        return {
          disease: analysisResult.disease || 'Unknown Condition',
          confidence: Math.min(Math.max(analysisResult.confidence || 0.7, 0), 1),
          severity: ['low', 'medium', 'high'].includes(analysisResult.severity) 
            ? analysisResult.severity 
            : 'medium',
          description: analysisResult.description || 'Disease analysis completed',
          symptoms: Array.isArray(analysisResult.symptoms) 
            ? analysisResult.symptoms 
            : ['Symptoms detected in image'],
          causes: Array.isArray(analysisResult.causes) 
            ? analysisResult.causes 
            : ['Multiple factors may contribute'],
          treatment: Array.isArray(analysisResult.treatment) 
            ? analysisResult.treatment 
            : ['Consult local agricultural expert'],
          prevention: Array.isArray(analysisResult.prevention) 
            ? analysisResult.prevention 
            : ['Follow good agricultural practices'],
          expectedLoss: analysisResult.expectedLoss || 'Variable depending on treatment',
          urgency: ['immediate', 'within_week', 'monitor'].includes(analysisResult.urgency) 
            ? analysisResult.urgency 
            : 'within_week'
        };
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        // Fallback analysis if JSON parsing fails
        return this.createFallbackAnalysis(text);
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to analyze crop image. Please check your internet connection and try again.');
    }
  }

  private createFallbackAnalysis(responseText: string): DiseaseAnalysisResult {
    // Create a basic analysis from the text response if JSON parsing fails
    return {
      disease: 'Analysis Completed',
      confidence: 0.75,
      severity: 'medium',
      description: responseText.substring(0, 200) + '...',
      symptoms: ['Visual symptoms detected in the uploaded image'],
      causes: ['Multiple environmental and pathological factors'],
      treatment: [
        'Consult with local agricultural extension officer',
        'Apply appropriate fungicide or pesticide as recommended',
        'Improve drainage and air circulation around plants',
        'Remove affected plant parts if necessary'
      ],
      prevention: [
        'Use disease-resistant crop varieties',
        'Maintain proper plant spacing',
        'Follow crop rotation practices',
        'Ensure proper irrigation management'
      ],
      expectedLoss: '10-20% if treated promptly',
      urgency: 'within_week'
    };
  }

  async getCropAdvice(query: string): Promise<string> {
    try {
      const prompt = `
        You are an expert agricultural advisor. A farmer is asking: "${query}"
        
        Provide practical, actionable advice in a conversational tone. Keep the response concise but informative.
        Focus on solutions that are accessible to small-scale farmers in India.
        Include specific steps they can take and mention any timing considerations.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting crop advice:', error);
      throw new Error('Failed to get crop advice. Please try again.');
    }
  }

  async getMarketInsights(crop: string, location: string): Promise<string> {
    try {
      const prompt = `
        As an agricultural market analyst, provide insights for ${crop} in ${location}.
        
        Include information about:
        - Current market trends
        - Seasonal price patterns
        - Factors affecting prices
        - Best selling strategies
        - Nearby market recommendations
        
        Keep the response practical and actionable for farmers.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting market insights:', error);
      throw new Error('Failed to get market insights. Please try again.');
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        resolve(base64.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const geminiService = new GeminiService();