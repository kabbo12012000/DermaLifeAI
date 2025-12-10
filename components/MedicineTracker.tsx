import React, { useState } from 'react';
import { Plus, Check, Clock, Calendar, RefreshCcw, Scan, Loader2, ChevronRight } from 'lucide-react';
import { parsePrescription } from '../services/geminiService';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  status: 'taken' | 'pending' | 'missed';
  parsedTime: number; // for sorting/logic
}

export const MedicineTracker: React.FC = () => {
  // Sortable initial state
  const [meds, setMeds] = useState<Medication[]>([
    { id: 1, name: 'Amoxicillin', dosage: '500mg', time: '08:00 AM', status: 'taken', parsedTime: 800 },
    { id: 2, name: 'Vitamin D', dosage: '1000IU', time: '09:00 AM', status: 'taken', parsedTime: 900 },
    { id: 3, name: 'Amoxicillin', dosage: '500mg', time: '01:00 PM', status: 'pending', parsedTime: 1300 }, // Current active
    { id: 4, name: 'Cetirizine', dosage: '10mg', time: '09:00 PM', status: 'pending', parsedTime: 2100 },
  ]);

  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });
  const [isUploading, setIsUploading] = useState(false);

  // Identify the "Next" pending medication to highlight as Present
  const nextMedId = meds.find(m => m.status === 'pending')?.id;

  const toggleStatus = (id: number) => {
    setMeds(meds.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'taken' ? 'pending' : 'taken' };
      }
      return m;
    }));
  };

  const addMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;
    setMeds([...meds, { 
      ...newMed, 
      id: Date.now(), 
      status: 'pending',
      parsedTime: parseInt(newMed.time.replace(':', '')) 
    }]);
    setNewMed({ name: '', dosage: '', time: '' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const file = e.target.files[0];
        const extractedMeds = await parsePrescription(file);
        const newMedsList = extractedMeds.map(med => ({
          id: Date.now() + Math.random(),
          name: med.name,
          dosage: med.dosage,
          time: med.time,
          status: 'pending' as const,
          parsedTime: 0 // Simplification for demo
        }));
        setMeds(prev => [...prev, ...newMedsList]);
      } catch (error) {
        alert("Could not read prescription.");
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-24 md:pb-0">
       <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Medicine Schedule</h2>
            <p className="text-slate-500 font-medium">Keep track of your daily intake.</p>
         </div>
         <span className="text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100 shadow-sm">
           {Math.round((meds.filter(m => m.status === 'taken').length / meds.length) * 100)}% Adherence
         </span>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
         
         {/* Vertical Timeline */}
         <div className="lg:col-span-2 relative pl-4 order-2 lg:order-1">
            {/* Timeline Line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-200/60 rounded-full"></div>
            
            <div className="space-y-6">
               {meds.map((med) => {
                 const isTaken = med.status === 'taken';
                 const isPresent = med.id === nextMedId;
                 const isFuture = !isTaken && !isPresent;

                 return (
                   <div key={med.id} className={`relative flex items-center transition-all duration-500 ${isFuture ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}`}>
                      
                      {/* Timeline Node */}
                      <div className={`z-10 w-14 flex-shrink-0 flex flex-col items-center mr-6 transition-all duration-500`}>
                         <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                            isTaken ? 'bg-green-500 border-green-100 text-white shadow-green-500/30' : 
                            isPresent ? 'bg-blue-600 border-blue-100 text-white shadow-blue-500/30 scale-125' : 
                            'bg-white border-slate-200 text-slate-300'
                         }`}>
                            {isTaken && <Check size={14} strokeWidth={4} />}
                            {isPresent && <Clock size={14} strokeWidth={3} className="animate-pulse" />}
                            {isFuture && <div className="w-2 h-2 bg-slate-300 rounded-full" />}
                         </div>
                         {isPresent && (
                            <div className="mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                               Now
                            </div>
                         )}
                      </div>

                      {/* Card */}
                      <div 
                        onClick={() => (isPresent || isTaken) && toggleStatus(med.id)}
                        className={`flex-1 transition-all duration-500 cursor-pointer overflow-hidden border ${
                           isPresent 
                             ? 'bg-white p-6 rounded-[1.5rem] shadow-xl shadow-blue-900/5 border-blue-100 scale-[1.02]' 
                             : isTaken
                               ? 'bg-slate-50/50 p-4 rounded-2xl border-slate-100 hover:bg-white'
                               : 'bg-white p-4 rounded-2xl border-slate-100 hover:border-slate-300'
                        }`}
                      >
                         <div className="flex justify-between items-center">
                            <div>
                               <p className={`font-bold transition-all duration-300 ${
                                 isPresent ? 'text-xl text-slate-800' : 
                                 isTaken ? 'text-slate-500 line-through text-base' : 
                                 'text-slate-600 text-base'
                               }`}>
                                 {med.name}
                               </p>
                               <div className="flex items-center mt-1 space-x-2">
                                  <span className={`text-xs font-bold ${isPresent ? 'text-blue-500' : 'text-slate-400'}`}>{med.time}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-xs text-slate-500 font-medium">{med.dosage}</span>
                               </div>
                            </div>

                            {/* Action Area */}
                            <div>
                               {isPresent && (
                                  <button 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center group"
                                  >
                                    Take
                                    <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                  </button>
                               )}
                               {isTaken && (
                                  <div className="flex items-center text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                                    <RefreshCcw size={12} className="mr-2" />
                                    Undo
                                  </div>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>

         {/* Sticky Add Form */}
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 h-fit lg:sticky lg:top-6 order-1 lg:order-2 z-10 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                <Plus size={18} />
              </div>
              Add Meds
            </h3>
            
            <div className="mb-6">
               <label className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isUploading ? 'bg-slate-50 border-slate-300' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 bg-slate-50/30'}`}>
                 <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                 {isUploading ? (
                   <div className="flex flex-col items-center text-slate-500">
                     <Loader2 className="animate-spin mb-2" />
                     <span className="text-xs font-bold uppercase tracking-wider">Scanning Rx...</span>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                     <Scan className="mb-3 w-8 h-8" strokeWidth={1.5} />
                     <span className="text-sm font-bold text-slate-600">Scan Prescription</span>
                     <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wide">AI Auto-Fill</span>
                   </div>
                 )}
               </label>
               <div className="relative flex items-center py-6">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Or Type Manually</span>
                  <div className="flex-grow border-t border-slate-100"></div>
               </div>
            </div>

            <form onSubmit={addMed} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Name</label>
                 <input 
                   value={newMed.name} 
                   onChange={e => setNewMed({...newMed, name: e.target.value})}
                   className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-800" 
                   placeholder="e.g. Ibuprofen"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Dosage</label>
                   <input 
                     value={newMed.dosage} 
                     onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-800" 
                     placeholder="mg"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Time</label>
                   <input 
                     type="time"
                     value={newMed.time} 
                     onChange={e => setNewMed({...newMed, time: e.target.value})}
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-800" 
                   />
                 </div>
               </div>
               <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] mt-2">
                 Save to Schedule
               </button>
            </form>
         </div>
       </div>
    </div>
  );
};