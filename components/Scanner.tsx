import React, { useState, useRef } from 'react';
import { analyzeSkinCondition } from '../services/geminiService';
import { AnalysisResult, PatientProfile, CurrentStatus, Biometrics } from '../types';
import { Loader2, ArrowRight, Settings2, Info, XCircle, ScanLine, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { ResultView } from './ResultView';

export const Scanner: React.FC = () => {
  const [skinImages, setSkinImages] = useState<File[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<File[]>([]); // Keeping for API signature compatibility, though currently unused in UI
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showContextForm, setShowContextForm] = useState(false);

  // References for the hidden file inputs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSkinImages(Array.from(e.target.files));
    }
    // Reset value to allow re-selecting the same file if needed
    e.target.value = '';
  };

  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const triggerGallery = () => {
    galleryInputRef.current?.click();
  };

  const imagePreviewUrl = skinImages.length > 0 ? URL.createObjectURL(skinImages[0]) : null;

  return (
    <div className="flex flex-col animate-fade-in min-h-[calc(100vh-100px)]">
      
      {/* Hidden Inputs for separating Camera vs Gallery logic */}
      <input 
        ref={cameraInputRef}
        type="file" 
        className="hidden" 
        accept="image/*" 
        capture="environment" // Forces Camera on Mobile
        onChange={handleFileChange} 
      />
      <input 
        ref={galleryInputRef}
        type="file" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Skin AI Scanner</h2>
           <p className="text-slate-500 font-medium mt-1">Holistic multi-label dermatological assessment.</p>
        </div>
        {!result && (
          <button 
            onClick={() => setShowContextForm(!showContextForm)}
            className="text-sm text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors flex items-center"
          >
            <Settings2 size={16} className="mr-2" />
            {showContextForm ? 'Hide Profile' : 'Edit Profile'}
          </button>
        )}
      </div>

      {showContextForm && !result && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4">
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Symptom Description</label>
             <input value={status.symptoms} onChange={e => setStatus({...status, symptoms: e.target.value})} className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Age</label>
             <input value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all" />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Pain (1-10)</label>
             <input type="number" value={status.painLevel} onChange={e => setStatus({...status, painLevel: parseInt(e.target.value)})} className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all" />
           </div>
        </div>
      )}

      {/* Main Content Area */}
      {result ? (
        <ResultView result={result} onReset={handleReset} imagePreview={imagePreviewUrl} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          
          {/* Left: Viewfinder / Drop Zone */}
          <div className="relative group bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200 flex flex-col items-center justify-center min-h-[500px] border border-slate-800">
            
            {/* Background Image Preview */}
            {imagePreviewUrl && (
              <div className="absolute inset-0 z-0">
                <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover opacity-60" />
              </div>
            )}

            {/* Scanning Animation Layer */}
            {loading && (
              <div className="absolute inset-0 z-10 scan-mesh"></div>
            )}

            {/* Silhouette Overlay (Always visible guide) */}
            <div className={`absolute inset-0 z-10 pointer-events-none border-[20px] border-slate-900/50 transition-all duration-500 ${imagePreviewUrl ? 'opacity-0' : 'opacity-100'}`}>
               <div className="w-full h-full border-2 border-dashed border-slate-500/50 rounded-3xl m-auto relative">
                  {/* Corner Markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-slate-400 -mt-1 -ml-1 rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-slate-400 -mt-1 -mr-1 rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-slate-400 -mb-1 -ml-1 rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-slate-400 -mb-1 -mr-1 rounded-br-xl"></div>
               </div>
            </div>

            {/* Interaction Layer - Large Click Targets */}
            <div className="relative z-20 w-full max-w-sm px-8 text-center">
              {!imagePreviewUrl ? (
                <div className="space-y-6 flex flex-col items-center">
                  
                  {/* Primary Trigger: Camera */}
                  <button 
                    onClick={triggerCamera}
                    className="group/trigger focus:outline-none"
                  >
                    <div className="w-24 h-24 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-slate-700 shadow-2xl group-hover/trigger:bg-slate-700 group-hover/trigger:scale-105 transition-all duration-300 group-hover/trigger:border-blue-500/50">
                      <Camera size={36} className="text-blue-400 group-hover/trigger:text-blue-300 transition-colors" />
                    </div>
                    <div className="text-white mt-4">
                      <h3 className="text-xl font-bold mb-1">Take Photo</h3>
                      <p className="text-slate-400 text-sm group-hover/trigger:text-slate-300 transition-colors">Opens Camera App</p>
                    </div>
                  </button>
                  
                  {/* Secondary Trigger: Gallery */}
                  <button 
                    onClick={triggerGallery}
                    className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white/80 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase border border-white/5 transition-colors mt-2"
                  >
                    <ImageIcon size={14} className="mr-2" />
                    <span>Upload from Gallery</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                   {!loading && (
                     <button 
                       onClick={() => setSkinImages([])}
                       className="bg-black/50 hover:bg-black/70 text-white px-6 py-2.5 rounded-full text-sm font-medium backdrop-blur-md transition-colors border border-white/10"
                     >
                       Retake Photo
                     </button>
                   )}
                </div>
              )}
            </div>
            
            {/* Scanning Status */}
            {loading && (
              <div className="absolute bottom-8 left-0 right-0 text-center z-20">
                 <div className="inline-flex items-center bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/30 text-blue-400 font-mono text-sm shadow-lg">
                    <ScanLine className="animate-pulse mr-3" size={18} />
                    ANALYZING TEXTURE TOPOLOGY...
                 </div>
              </div>
            )}
          </div>

          {/* Right: Action / Status Panel */}
          <div className="flex flex-col justify-center space-y-8 p-4">
             {error && (
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start text-red-700">
                  <XCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Analysis Failed</h3>
                    <p className="text-sm mt-1 opacity-80">{error}</p>
                    <button onClick={() => setError(null)} className="mt-3 text-xs font-bold uppercase tracking-wider hover:underline">Dismiss</button>
                  </div>
                </div>
             )}

             <div className="space-y-4">
               <h3 className="text-xl font-bold text-slate-800">Ready to Diagnose?</h3>
               <p className="text-slate-500 leading-relaxed">
                 DermaLife uses multimodal AI to correlate visual findings with your biometrics. 
                 This process typically takes 5-10 seconds.
               </p>
               
               <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                 <div className="flex items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                   <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                   Biometrics Synced
                 </div>
                 <div className="flex items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                   <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                   Profile Active
                 </div>
               </div>

               <button 
                 onClick={handleAnalyze}
                 disabled={loading || skinImages.length === 0}
                 className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center ${
                   loading 
                     ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                     : skinImages.length > 0
                       ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                       : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                 }`}
               >
                 {loading ? (
                   <>
                     <Loader2 className="animate-spin mr-3" />
                     Processing...
                   </>
                 ) : (
                   <>
                     Start Analysis <ArrowRight className="ml-2" />
                   </>
                 )}
               </button>
               
               {!imagePreviewUrl && (
                  <div className="flex items-center justify-center text-xs text-slate-400 mt-4">
                    <Info size={14} className="mr-1" />
                    Capture a photo to enable analysis
                  </div>
               )}
             </div>
          </div>

        </div>
      )}
    </div>
  );
};
