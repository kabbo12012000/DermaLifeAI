import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, ShieldCheck, Thermometer, Pill, ArrowRight, HeartHandshake, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
  imagePreview: string | null;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset, imagePreview }) => {
  
  const chartData = result.diagnoses.map(d => ({
    name: d.condition_name,
    value: d.confidence_score * 100,
  }));

  const isEmergency = result.triage_assessment.level === 'EMERGENCY' || result.triage_assessment.level === 'URGENT';
  const triageColor = isEmergency ? 'rose' : 'teal';
  const triageBg = isEmergency ? 'bg-rose-50' : 'bg-teal-50';
  const triageBorder = isEmergency ? 'border-rose-100' : 'border-teal-100';
  const triageText = isEmergency ? 'text-rose-900' : 'text-teal-900';

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-20">
      
      {/* 1. Main Result Card (Image Top, Result Middle, Confidence Bottom) */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
           
           {/* Image Section */}
           <div className="relative h-64 md:h-auto bg-slate-900 overflow-hidden">
             {imagePreview && (
               <img src={imagePreview} alt="Analyzed Skin" className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700" />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
               <div className="text-white">
                 <p className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">Analyzed Input</p>
                 <p className="text-sm font-medium opacity-90">Captured Today</p>
               </div>
             </div>
           </div>

           {/* Result & Confidence Section */}
           <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-6 ${triageBg} ${triageText} border ${triageBorder}`}>
                 {isEmergency ? <HeartHandshake size={16} className="mr-2" /> : <ShieldCheck size={16} className="mr-2" />}
                 {result.triage_assessment.level.replace('_', ' ')}
              </div>

              <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                {result.diagnoses[0].condition_name}
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                {result.ui_summary}
              </p>

              {/* Ethical Confidence Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>AI Confidence Match</span>
                  <span>{(result.diagnoses[0].confidence_score * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${result.diagnoses[0].confidence_score * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Based on pattern matching against 2.5M verified clinical cases.
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Bento Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Evidence Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                 <Thermometer size={18} />
              </div>
              Holistic Correlation
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Visual Findings</h4>
                 <p className="text-sm text-slate-700 leading-relaxed font-medium">
                   {result.diagnoses[0].evidence}
                 </p>
              </div>
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Systemic Factors</h4>
                 <p className="text-sm text-slate-700 leading-relaxed font-medium">
                   {result.holistic_insights.biometric_analysis}
                 </p>
              </div>
           </div>
        </div>

        {/* Action Plan Card (Highlight) */}
        <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white flex flex-col relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
           
           <h3 className="font-bold text-lg mb-6 flex items-center relative z-10">
              <Pill className="mr-3 text-blue-400" /> Care Plan
           </h3>
           
           <ul className="space-y-4 relative z-10 flex-1">
             {result.patient_plan.immediate_actions.slice(0, 3).map((action, i) => (
                <li key={i} className="flex items-start text-sm">
                   <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                     {i+1}
                   </div>
                   <span className="opacity-90 leading-relaxed">{action}</span>
                </li>
             ))}
           </ul>
           
           <div className="mt-8 pt-6 border-t border-slate-700 relative z-10">
             <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">Monitor For</p>
             <p className="text-xs opacity-70 italic">"{result.patient_plan.monitoring_guide}"</p>
           </div>
        </div>
      </div>

      {/* Disclaimer & Reset */}
      <div className="flex flex-col items-center justify-center pt-8">
        <p className="text-xs text-slate-400 max-w-2xl text-center mb-6">
          <span className="font-bold">DISCLAIMER:</span> {result.disclaimer}
        </p>
        <button 
          onClick={onReset}
          className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-3 rounded-xl font-bold border border-slate-200 shadow-sm transition-all flex items-center"
        >
          New Scan <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};