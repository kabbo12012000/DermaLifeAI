import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisInput, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
const fileToPart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (!result || !result.includes(',')) {
        reject(new Error("Failed to read file"));
        return;
      }
      const base64String = result.split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type || 'image/jpeg',
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const SYSTEM_INSTRUCTION = `
You are DermaLife AI, an advanced, multimodal dermatological health engine. Your purpose is to analyze skin conditions using a holistic approach that combines computer vision, patient history, and real-time biometric data.

CRITICAL DIRECTIVE: You are a Multi-Label Classifier. Patients often have co-morbidities. You must identify ALL distinct conditions present in the visual data.

ANALYSIS PIPELINE:
1. SAFETY TRIAGE (Zero Tolerance): Check for Sepsis, Anaphylaxis, SJS/TEN, Necrotizing Fasciitis.
2. MULTI-LABEL VISUAL DIAGNOSIS: Analyze primary/secondary lesions, pattern, and color.
3. HOLISTIC CORRELATION: Correlate visual findings with HR, HRV, Sleep, and Medical Records.

Return valid JSON adhering strictly to the schema.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    triage_assessment: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING, enum: ["EMERGENCY", "URGENT", "ROUTINE", "SELF_CARE"] },
        alert_message: { type: Type.STRING },
      },
      required: ["level", "alert_message"],
    },
    diagnoses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          condition_name: { type: Type.STRING },
          confidence_score: { type: Type.NUMBER },
          evidence: { type: Type.STRING },
        },
        required: ["condition_name", "confidence_score", "evidence"],
      },
    },
    holistic_insights: {
      type: Type.OBJECT,
      properties: {
        biometric_analysis: { type: Type.STRING },
        medication_review: { type: Type.STRING },
      },
      required: ["biometric_analysis", "medication_review"],
    },
    patient_plan: {
      type: Type.OBJECT,
      properties: {
        immediate_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
        lifestyle_modifications: { type: Type.ARRAY, items: { type: Type.STRING } },
        monitoring_guide: { type: Type.STRING },
      },
      required: ["immediate_actions", "lifestyle_modifications", "monitoring_guide"],
    },
    ui_summary: { type: Type.STRING },
    disclaimer: { type: Type.STRING },
  },
  required: ["triage_assessment", "diagnoses", "holistic_insights", "patient_plan", "ui_summary", "disclaimer"],
};

// Schema for Prescription Parsing
const prescriptionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the medication" },
      dosage: { type: Type.STRING, description: "Dosage (e.g., 500mg)" },
      time: { type: Type.STRING, description: "Suggested time formatted as HH:MM AM/PM" },
    },
    required: ["name", "dosage", "time"],
  },
};

export const analyzeSkinCondition = async (input: AnalysisInput): Promise<AnalysisResult> => {
  try {
    const skinImageParts = await Promise.all(input.skinImages.map(fileToPart));
    const recordParts = await Promise.all(input.medicalRecords.map(fileToPart));

    const promptText = `
      Analyze this patient case:
      
      PATIENT PROFILE:
      - Age: ${input.profile.age}
      - Gender: ${input.profile.gender}
      - Allergies: ${input.profile.allergies}
      - Chronic Conditions: ${input.profile.chronicConditions}

      CURRENT STATUS:
      - Symptoms: ${input.status.symptoms}
      - Pain Level: ${input.status.painLevel}/10
      - Duration: ${input.status.duration}

      BIOMETRICS (Wearable Data):
      - Heart Rate: ${input.biometrics.heartRate} bpm
      - HRV: ${input.biometrics.hrv} ms
      - Sleep Quality: ${input.biometrics.sleepQuality}
      - Body Temperature: ${input.biometrics.temperature} F

      See attached images for visual skin analysis and medical records (OCR).
    `;

    // Construct the parts array for the request
    const parts = [
      ...skinImageParts,
      ...recordParts,
      { text: promptText }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts }, // Correct structure: single content object with parts
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // Check if text is present. If not, check candidates for safety blocks.
    if (!response.text) {
      const candidate = response.candidates?.[0];
      if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
         throw new Error(`Analysis blocked by AI safety filters. Reason: ${candidate.finishReason}`);
      }
      throw new Error("No response text generated. Please try a clearer image.");
    }

    return JSON.parse(response.text) as AnalysisResult;

  } catch (error: any) {
    console.error("Gemini Analysis Failed", error);
    throw new Error(error.message || "Failed to analyze skin condition");
  }
};

export const parsePrescription = async (file: File): Promise<{ name: string; dosage: string; time: string }[]> => {
  try {
    const filePart = await fileToPart(file);

    const promptText = `
      Analyze the attached prescription image or document.
      Extract details for each medication prescribed.
      For each medication, identify:
      - Name
      - Dosage (e.g., 500mg). If not specified, put "As directed".
      - Time (Infer a specific time like "08:00 AM" based on frequency, e.g., "Once daily" -> "09:00 AM", "Twice daily" -> "09:00 AM, 09:00 PM". If multiple times, pick the first morning slot).
      
      Return a JSON array.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          filePart,
          { text: promptText }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: prescriptionSchema,
      }
    });

    if (!response.text) {
       throw new Error("Could not extract text from prescription.");
    }

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Prescription Parsing Failed", error);
    throw new Error(error.message || "Failed to parse prescription");
  }
};