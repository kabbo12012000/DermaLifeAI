import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { analyzeSkinCondition } from '../services/geminiService';
import { AnalysisInput, AnalysisResult, PatientProfile, CurrentStatus, Biometrics } from '../types';
import { Loader2, ArrowRight, Settings2, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { ResultView } from './ResultView';

export const Scanner: React.FC = () => {
  const [skinImages, setSkinImages] = useState<File[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showContextForm, setShowContextForm] = useState(false);

  // Default mock context for the AI
  const [profile, setProfile] = useState<PatientProfile>({
    age: '32',
    gender: 'Female',
    allergies: 'None',
    chronicConditions: 'None',
  });
  const [status, setStatus] = useState<CurrentStatus>({
    symptoms: 'Redness and itching',
    painLevel: 3,
    duration: '2 days',
  });
  const [biometrics] = useState<Biometrics>({
    heartRate: 72,
    hrv: 45,
    sleepQuality: 'Good',
    temperature: 98.6,
  });

  const handleAnalyze = async () => {
    if (skinImages.length === 0) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await analyzeSkinCondition({
        skinImages,
        medicalRecords,
        profile,
        status,
        biometrics
      });
      setResult(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSkinImages([]);
    setError(null);
  }

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col animate-fade-in pb-20 md:pb-0">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">AI Skin Analysis</h2>
           <p className="text-slate-500">Upload high-quality images for multi-label diagnosis.</p>
        </div>
        <button 
          onClick={() => setShowContextForm(!showContextForm)}
          className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <Settings2 size={16} className="mr-2" />
          {showContextForm ? 'Hide Context' : 'Edit Patient Context'}
        </button>
      </div>

      {showContextForm && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4">
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase">Symptom Description</label>
             <input value={status.symptoms} onChange={e => setStatus({...status, symptoms: e.target.value})} className="w-full text-sm p-2 border rounded mt-1" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
             <input value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} className="w-full text-sm p-2 border rounded mt-1" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase">Pain (1-10)</label>
             <input type="number" value={status.painLevel} onChange={e => setStatus({...status, painLevel: parseInt(e.target.value)})} className="w-full text-sm p-2 border rounded mt-1" />
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Left: Drop Zone */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-dashed border-slate-300 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-blue-400 transition-colors">
          <div className="w-full max-w-md space-y-6 z-10">
             <FileUpload 
               label="Upload Skin Image" 
               accept="image/*" 
               files={skinImages} 
               onFilesChange={setSkinImages} 
             />
             
             {skinImages.length > 0 && !result && (
               <button 
                 onClick={handleAnalyze}
                 disabled={loading}
                 className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center"
               >
                 {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
                 {loading ? 'Analyzing...' : 'Analyze Condition'}
               </button>
             )}

             {result && (
                <button 
                 onClick={handleReset}
                 className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center"
               >
                 Start New Analysis
               </button>
             )}
          </div>
          <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" />
        </div>

        {/* Right: Results Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
          
          {/* Error State */}
          {error && !loading && !result && (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="text-red-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Analysis Failed</h3>
                <p className="text-slate-500 max-w-xs">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Try Again
                </button>
             </div>
          )}

          {!result && !loading && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
               <Info size={48} className="mb-4 opacity-50" />
               <p className="font-medium">Waiting for input...</p>
               <p className="text-sm mt-2">Upload an image to start the dermatological assessment.</p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center">
               <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
               <p className="text-slate-600 font-medium animate-pulse">Running Multi-Label Diagnostics...</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex-1 overflow-y-auto p-2">
               {/* Simplified Result View for the 50/50 layout */}
               <div className="p-6">
                 <div className={`p-4 rounded-xl border mb-6 flex items-start ${
                    result.triage_assessment.level === 'EMERGENCY' ? 'bg-red-50 border-red-200 text-red-800' : 
                    result.triage_assessment.level === 'URGENT' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                    'bg-green-50 border-green-200 text-green-800'
                 }`}>
                    <AlertTriangle className="mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">{result.triage_assessment.level === 'EMERGENCY' ? 'Priority Care Required' : result.triage_assessment.level}</h3>
                      <p className="text-sm mt-1">{result.triage_assessment.alert_message || "No immediate emergency signs detected."}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Primary Diagnosis</h4>
                       {result.diagnoses.map((d, i) => (
                         <div key={i} className="mb-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                               <span className="font-bold text-slate-800">{d.condition_name}</span>
                               <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">{(d.confidence_score * 100).toFixed(0)}%</span>
                            </div>
                            <p className="text-xs text-slate-500">{d.evidence}</p>
                         </div>
                       ))}
                    </div>
                    
                    <div>
                       <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Holistic Plan</h4>
                       <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-900 space-y-2">
                          <p><strong>Immediate:</strong> {result.patient_plan.immediate_actions[0]}</p>
                          <p><strong>Lifestyle:</strong> {result.patient_plan.lifestyle_modifications[0]}</p>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};