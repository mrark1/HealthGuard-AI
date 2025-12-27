
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// Always use process.env.API_KEY directly and instantiate inside functions
export const getHealthAdvice = async (prompt: string, language: Language = Language.ENGLISH) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are a helpful and reliable Public Health Assistant. 
        Language: ${language}.
        Goals: 
        1. Educate users on diseases, prevention, and general wellness.
        2. Detect misinformation: If a user asks about a common myth (e.g. 'Vaccines cause autism'), debunk it politely with facts from WHO/ICMR.
        3. Never provide a final medical diagnosis. 
        4. Always end medical-related responses with a short disclaimer to consult a doctor.
        5. Use simple, non-technical language suitable for rural communities.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my knowledge base. Please try again later.";
  }
};

export const analyzeHealthImage = async (base64Image: string, prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: `Analyze this health-related image (e.g., rash, prescription). ${prompt}. Provide general guidance only. Do not diagnose. If it looks like a prescription, help summarize the dosage instructions if clear, otherwise tell them to consult the pharmacist.` }] },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Vision API Error:", error);
    return "I couldn't process the image correctly. Please ensure it's clear.";
  }
};

export const checkSymptom = async (symptoms: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `User symptoms: ${symptoms}. List possible conditions (not a diagnosis), preventive measures, and when to seek urgent medical care. Output in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            possibleConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
            precautions: { type: Type.ARRAY, items: { type: Type.STRING } },
            emergencySigns: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["possibleConditions", "precautions", "emergencySigns", "summary"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Symptom Check Error:", error);
    return null;
  }
};
