import React, { useState } from 'react';
import { Plus, Check, Clock, Calendar, RefreshCcw, Scan, Loader2 } from 'lucide-react';
import { parsePrescription } from '../services/geminiService';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  status: 'taken' | 'pending' | 'missed';
}

export const MedicineTracker: React.FC = () => {
  const [meds, setMeds] = useState<Medication[]>([
    { id: 1, name: 'Amoxicillin', dosage: '500mg', time: '08:00 AM', status: 'taken' },
    { id: 2, name: 'Vitamin D', dosage: '1000IU', time: '09:00 AM', status: 'taken' },
    { id: 3, name: 'Amoxicillin', dosage: '500mg', time: '01:00 PM', status: 'pending' },
    { id: 4, name: 'Cetirizine', dosage: '10mg', time: '09:00 PM', status: 'pending' },
  ]);

  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });
  const [isUploading, setIsUploading] = useState(false);

  // Toggle between taken and pending (Undo feature)
  const toggleStatus = (id: number) => {
    setMeds(meds.map(m => {
      if (m.id === id) {
        // If taken, undo to pending. If pending, mark taken.
        return { ...m, status: m.status === 'taken' ? 'pending' : 'taken' };
      }
      return m;
    }));
  };

  const addMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;
    setMeds([...meds, { ...newMed, id: Date.now(), status: 'pending' }]);
    setNewMed({ name: '', dosage: '', time: '' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const file = e.target.files[0];
        const extractedMeds = await parsePrescription(file);
        
        // Add extracted meds to the list
        const newMedsList = extractedMeds.map(med => ({
          id: Date.now() + Math.random(), // Simple unique ID
          name: med.name,
          dosage: med.dosage,
          time: med.time,
          status: 'pending' as const
        }));

        setMeds(prev => [...prev, ...newMedsList]);
      } catch (error) {
        console.error("Failed to parse prescription", error);
        alert("Could not read prescription. Please try again or enter manually.");
      } finally {
        setIsUploading(false);
        // Reset input
        e.target.value = '';
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-20 md:pb-0">
       <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-900">Medicine Tracker</h2>
         <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
           {meds.filter(m => m.status === 'taken').length} / {meds.length} doses completed
         </span>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
         {/* Timeline Column */}
         <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 order-2 lg:order-1">
            <h3 className="font-bold text-slate-800 mb-8 flex items-center">
              <Calendar className="mr-2 text-blue-600" size={20}/> Today's Schedule
            </h3>
            
            <div className="relative space-y-8 pl-8 before:absolute before:left-[14px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
               {meds.map((med) => (
                 <div key={med.id} className="relative group">
                    {/* Timeline Dot - Pixel perfect alignment */}
                    <div className={`absolute -left-[32px] top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 bg-white ${
                      med.status === 'taken' ? 'border-green-500 text-green-500' : 
                      med.status === 'missed' ? 'border-red-300 text-red-500' :
                      'border-slate-300 text-slate-300'
                    }`}>
                       {med.status === 'taken' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                       {med.status === 'pending' && <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" />}
                    </div>

                    {/* Card */}
                    <div 
                      onClick={() => med.status === 'taken' && toggleStatus(med.id)}
                      className={`p-5 rounded-2xl border transition-all duration-300 ${
                       med.status === 'pending' 
                        ? 'bg-blue-50/50 border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300' 
                        : 'bg-white border-slate-100 opacity-75 hover:opacity-100 cursor-pointer hover:border-slate-300'
                    }`}>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${med.status === 'taken' ? 'bg-green-100 text-green-600' : 'bg-white border border-slate-200 text-slate-400'}`}>
                               <RefreshCcw size={20} className={med.status === 'taken' ? 'hidden' : 'opacity-100'} /> 
                               {med.status === 'taken' && <Check size={24} />}
                             </div>
                             <div>
                               <p className={`font-bold text-lg transition-all ${med.status === 'taken' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{med.name}</p>
                               <p className="text-sm text-slate-500">{med.dosage} • {med.time}</p>
                             </div>
                          </div>
                          
                          {med.status === 'pending' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleStatus(med.id); }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-blue-500/20 shadow-lg transition-transform active:scale-95 flex items-center"
                            >
                              Take
                            </button>
                          )}
                          
                          {med.status === 'taken' && (
                             <div className="flex items-center text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                               <RefreshCcw size={12} className="mr-2" />
                               Tap to Undo
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Add Form Column - Sticky only on Desktop, Z-Index fix */}
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit lg:sticky lg:top-6 order-1 lg:order-2 z-10 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center">
              <Plus className="mr-2 text-blue-600" size={20}/> Add Prescription
            </h3>
            
            {/* Auto Scan Button */}
            <div className="mb-6">
               <label className={`w-full flex items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isUploading ? 'bg-slate-50 border-slate-300' : 'border-blue-200 hover:bg-blue-50 hover:border-blue-300 bg-white'}`}>
                 <input 
                   type="file" 
                   accept="image/*,.pdf" 
                   className="hidden" 
                   onChange={handleFileUpload}
                   disabled={isUploading}
                 />
                 {isUploading ? (
                   <div className="flex items-center text-slate-500">
                     <Loader2 className="animate-spin mr-2" />
                     <span className="text-sm font-bold">Scanning Rx...</span>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center text-blue-600">
                     <Scan className="mb-2" size={24} />
                     <span className="text-sm font-bold">Scan / Upload Rx</span>
                     <span className="text-[10px] text-slate-400 font-medium mt-1">Supports Images & PDF</span>
                   </div>
                 )}
               </label>
               <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-300 uppercase">OR Manually Enter</span>
                  <div className="flex-grow border-t border-slate-100"></div>
               </div>
            </div>

            <form onSubmit={addMed} className="space-y-5">
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Medicine Name</label>
                 <input 
                   value={newMed.name} 
                   onChange={e => setNewMed({...newMed, name: e.target.value})}
                   className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                   placeholder="e.g. Ibuprofen"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Dosage</label>
                 <input 
                   value={newMed.dosage} 
                   onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                   className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                   placeholder="e.g. 200mg"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Time</label>
                 <input 
                   type="time"
                   value={newMed.time} 
                   onChange={e => setNewMed({...newMed, time: e.target.value})}
                   className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                 />
               </div>
               <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                 Add to Schedule
               </button>
            </form>
         </div>
       </div>
    </div>
  );
};