export interface PatientProfile {
  age: string;
  gender: string;
  allergies: string;
  chronicConditions: string;
}

export interface CurrentStatus {
  symptoms: string;
  painLevel: number; // 1-10
  duration: string;
}

export interface Biometrics {
  heartRate: number;
  hrv: number;
  sleepQuality: string;
  temperature: number;
}

export interface AnalysisInput {
  skinImages: File[];
  medicalRecords: File[];
  profile: PatientProfile;
  status: CurrentStatus;
  biometrics: Biometrics;
}

// Output Structure defined by the Prompt
export interface TriageAssessment {
  level: "EMERGENCY" | "URGENT" | "ROUTINE" | "SELF_CARE";
  alert_message: string;
}

export interface Diagnosis {
  condition_name: string;
  confidence_score: number;
  evidence: string;
}

export interface HolisticInsights {
  biometric_analysis: string;
  medication_review: string;
}

export interface PatientPlan {
  immediate_actions: string[];
  lifestyle_modifications: string[];
  monitoring_guide: string;
}

export interface AnalysisResult {
  triage_assessment: TriageAssessment;
  diagnoses: Diagnosis[];
  holistic_insights: HolisticInsights;
  patient_plan: PatientPlan;
  ui_summary: string;
  disclaimer: string;
}
