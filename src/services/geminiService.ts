import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key-here';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface DiseaseAnalysisResult {
  disease: string;
  indianName: string;
  hindiName: string;
  localNames: string[];
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  treatment: string[];
  prevention: string[];
  expectedLoss: string;
  urgency: 'immediate' | 'within_week' | 'monitor';
  description: string;
  symptoms: string[];
  causes: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async analyzeCropDisease(imageFile: File): Promise<DiseaseAnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Create the prompt for crop disease analysis with Indian context
      const prompt = `
        You are an expert agricultural pathologist specializing in Indian crop diseases. Analyze this crop image and provide a comprehensive disease diagnosis with Indian context.

        Please analyze the image and provide a detailed response in the following JSON format:

        {
          "disease": "Scientific/English name of the disease",
          "indianName": "Common Indian name for the disease",
          "hindiName": "Hindi name of the disease",
          "localNames": ["Regional names in different Indian languages"],
          "confidence": 0.85,
          "severity": "low|medium|high",
          "description": "Detailed description of the disease in Indian farming context",
          "symptoms": ["List of visible symptoms"],
          "causes": ["Possible causes relevant to Indian climate and farming"],
          "organicTreatment": [
            "Traditional/organic treatment method 1",
            "Organic treatment method 2",
            "Home remedy or traditional practice"
          ],
          "chemicalTreatment": [
            "Chemical treatment option 1",
            "Chemical treatment option 2",
            "Specific fungicide/pesticide names available in India"
          ],
          "treatment": [
            "Combined best treatment approach",
            "Step-by-step treatment process",
            "Timing and application methods"
          ],
          "prevention": [
            "Prevention measure suitable for Indian farming",
            "Seasonal prevention tips",
            "Traditional prevention methods"
          ],
          "expectedLoss": "Realistic crop loss percentage for Indian conditions",
          "urgency": "immediate|within_week|monitor"
        }

        Guidelines for Indian context analysis:
        1. Include common Indian names for diseases (e.g., "Tikka disease" for leaf spot, "Jwar" for blight)
        2. Consider Indian climate conditions (monsoon, humidity, temperature)
        3. Suggest treatments available in Indian agricultural markets
        4. Include traditional/organic methods used by Indian farmers
        5. Consider crop varieties commonly grown in India
        6. Mention specific Indian brands of pesticides/fungicides when relevant
        7. Include regional names in languages like Hindi, Marathi, Tamil, Telugu, Gujarati, Punjabi
        8. Consider Indian farming practices and seasonal patterns
        9. Suggest locally available organic materials (neem, turmeric, cow urine, etc.)
        10. Include government scheme references if applicable

        Common Indian disease names to consider:
        - Tikka disease (Leaf spot)
        - Jwar/Jhulsa (Blight)
        - Kala Dhaba (Black spot)
        - Safed Dhaba (White spot)
        - Patta Jalna (Leaf burn)
        - Jad Galan (Root rot)
        - Phool Galan (Flower rot)
        - Phal Galan (Fruit rot)
        - Mosaic (Mosaic virus)
        - Curl (Leaf curl)

        Focus on practical advice that Indian farmers can implement with locally available resources.
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
          indianName: analysisResult.indianName || 'अज्ञात रोग',
          hindiName: analysisResult.hindiName || 'अज्ञात रोग',
          localNames: Array.isArray(analysisResult.localNames) 
            ? analysisResult.localNames 
            : ['स्थानीय नाम उपलब्ध नहीं'],
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
          organicTreatment: Array.isArray(analysisResult.organicTreatment) 
            ? analysisResult.organicTreatment 
            : ['नीम का तेल छिड़काव', 'गोमूत्र का उपयोग', 'हल्दी पाउडर का प्रयोग'],
          chemicalTreatment: Array.isArray(analysisResult.chemicalTreatment) 
            ? analysisResult.chemicalTreatment 
            : ['उपयुक्त कवकनाशी का प्रयोग', 'स्थानीय कृषि विशेषज्ञ से सलाह लें'],
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
      indianName: 'विश्लेषण पूर्ण',
      hindiName: 'विश्लेषण पूर्ण',
      localNames: ['स्थानीय नाम उपलब्ध नहीं'],
      confidence: 0.75,
      severity: 'medium',
      description: responseText.substring(0, 200) + '...',
      symptoms: ['Visual symptoms detected in the uploaded image'],
      causes: ['Multiple environmental and pathological factors'],
      organicTreatment: [
        'नीम का तेल (Neem oil) - 5ml प्रति लीटर पानी में मिलाकर छिड़काव',
        'गोमूत्र (Cow urine) - 200ml प्रति लीटर पानी में मिलाकर स्प्रे',
        'हल्दी पाउडर (Turmeric powder) - पानी में घोलकर प्रभावित भाग पर लगाएं'
      ],
      chemicalTreatment: [
        'कॉपर सल्फेट (Copper Sulphate) - 2 ग्राम प्रति लीटर',
        'मैंकोजेब (Mancozeb) - निर्देशानुसार उपयोग',
        'स्थानीय कृषि केंद्र से उपयुक्त दवा की सलाह लें'
      ],
      treatment: [
        'Consult with local agricultural extension officer',
        'Apply appropriate fungicide or pesticide as recommended',
        'Improve drainage and air circulation around plants',
        'Remove affected plant parts if necessary'
      ],
      prevention: [
        'रोग प्रतिरोधी किस्मों का उपयोग (Use disease-resistant varieties)',
        'उचित दूरी बनाए रखें (Maintain proper plant spacing)',
        'फसल चक्र अपनाएं (Follow crop rotation)',
        'सिंचाई प्रबंधन (Proper irrigation management)'
      ],
      expectedLoss: '10-20% if treated promptly',
      urgency: 'within_week'
    };
  }

  async getCropAdvice(query: string): Promise<string> {
    try {
      const result = await this.model.generateContent(query);
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
        As an agricultural market analyst specializing in Indian markets, provide insights for ${crop} in ${location}.
        
        Include information about:
        - Current market trends in Indian mandis
        - Seasonal price patterns specific to India
        - Factors affecting prices (monsoon, festivals, government policies)
        - Best selling strategies for Indian farmers
        - Nearby APMC markets and mandi recommendations
        - Government MSP (Minimum Support Price) considerations
        - Export opportunities from India
        - Storage and transportation tips for Indian conditions
        
        Keep the response practical and actionable for Indian farmers.
        Include both Hindi and English terms where helpful.
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