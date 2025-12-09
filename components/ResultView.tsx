import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, Activity, ShieldCheck, Thermometer, Pill, ArrowRight, HeartHandshake } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

// Empathetic badge that avoids scary red colors even for emergencies
const TriageBadge = ({ level, message }: { level: string, message: string }) => {
  const isEmergency = level === 'EMERGENCY' || level === 'URGENT';
  
  // Mapped display text to be calmer
  const displayText = level === 'EMERGENCY' ? 'Priority Medical Attention' : 
                      level === 'URGENT' ? 'Professional Care Recommended' :
                      level === 'ROUTINE' ? 'Routine Monitoring' : 'Self-Care Management';

  const styles = isEmergency 
    ? "bg-rose-50 text-rose-900 border-rose-100" // Softer rose instead of bright red
    : "bg-teal-50 text-teal-900 border-teal-100"; // Calming teal for others

  const icon = isEmergency ? <HeartHandshake className="w-6 h-6 mr-3 text-rose-500" /> : <ShieldCheck className="w-6 h-6 mr-3 text-teal-500" />;

  return (
    <div className={`p-6 rounded-3xl border ${styles} flex flex-col md:flex-row items-start md:items-center mb-8 shadow-sm`}>
      <div className="flex-shrink-0 flex items-center mb-4 md:mb-0 mr-6">
        {icon}
        <div>
          <span className="block text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Assessment Level</span>
          <span className="block text-xl font-bold tracking-tight">{displayText}</span>
        </div>
      </div>
      <div className={`text-sm md:text-base leading-relaxed pl-0 md:pl-6 md:border-l ${isEmergency ? 'border-rose-200 opacity-90' : 'border-teal-200 opacity-80'}`}>
        {message || "Analysis complete. Please review the detailed insights below."}
      </div>
    </div>
  );
};

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  
  const chartData = result.diagnoses.map(d => ({
    name: d.condition_name,
    value: d.confidence_score * 100,
  }));

  return (
    <div className="animate-fade-in space-y-8 max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="text-center space-y-4 py-4">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Analysis Results</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed font-light">{result.ui_summary}</p>
      </div>

      {/* Triage Section */}
      <TriageBadge 
        level={result.triage_assessment.level} 
        message={result.triage_assessment.alert_message} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Diagnoses */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Diagnostic Insights
            </h3>
            
            <div className="h-64 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={chartData} margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={140} tick={{fontSize: 13, fill: '#64748b', fontWeight: 500}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {result.diagnoses.map((d, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-colors hover:border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg text-slate-800">{d.condition_name}</span>
                    <span className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full shadow-sm">
                      {(d.confidence_score * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-900 mr-1">Observed Evidence:</span> {d.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
             <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Thermometer className="w-5 h-5 mr-2 text-blue-600" />
              Holistic Correlation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-3 text-sm uppercase tracking-wider">Biometric Factors</h4>
                <p className="text-sm text-indigo-900/80 leading-relaxed">{result.holistic_insights.biometric_analysis}</p>
              </div>
              <div className="p-6 bg-pink-50/50 rounded-2xl border border-pink-100">
                <h4 className="font-bold text-pink-900 mb-3 text-sm uppercase tracking-wider">Medication Impact</h4>
                <p className="text-sm text-pink-900/80 leading-relaxed">{result.holistic_insights.medication_review}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Plan */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-8 flex items-center">
                <Pill className="w-5 h-5 mr-3" />
                Personalized Care Plan
              </h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Steps to Take Now</h4>
                  <ul className="space-y-3">
                    {result.patient_plan.immediate_actions.map((action, i) => (
                      <li key={i} className="flex items-start text-sm group">
                        <span className="bg-blue-600 group-hover:bg-blue-500 transition-colors rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mr-3 mt-0.5 shadow-lg shadow-blue-900/50">{i+1}</span>
                        <span className="opacity-90 font-medium leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Lifestyle Adjustments</h4>
                  <ul className="space-y-3">
                     {result.patient_plan.lifestyle_modifications.map((item, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <CheckCircle className="w-5 h-5 text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="opacity-80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                 <div className="pt-6 border-t border-slate-800">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Monitoring</h4>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-sm opacity-80 leading-relaxed italic">
                      "{result.patient_plan.monitoring_guide}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-xs text-slate-400 text-center">
            <p className="font-bold mb-1 text-slate-500 uppercase">AI Disclaimer</p>
            {result.disclaimer}
          </div>
          
           <button 
            onClick={onReset}
            className="w-full py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-2xl transition-all flex items-center justify-center shadow-sm hover:shadow-md"
          >
            Start New Analysis <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
};