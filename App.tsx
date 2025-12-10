import React, { useState } from 'react';
import { Activity, Lock } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { HealthRecords } from './components/HealthRecords';
import { MedicineTracker } from './components/MedicineTracker';
import { SOSModal } from './components/SOSModal';
import { SOSButton } from './components/SOSButton';

export type View = 'dashboard' | 'scanner' | 'records' | 'tracker';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 p-8 md:p-12">
           <div className="flex flex-col items-center mb-8">
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 shadow-sm">
               <Activity size={32} />
             </div>
             <h1 className="text-3xl font-bold text-slate-800 tracking-tight">DermaLife AI</h1>
             <p className="text-slate-500 mt-2 text-center font-medium">Secure Patient Portal</p>
           </div>
           
           <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Email ID</label>
               <input type="email" placeholder="patient@example.com" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-slate-800" />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Password</label>
               <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-slate-800" />
             </div>
             <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-transform active:scale-[0.98] flex items-center justify-center">
               <Lock className="w-4 h-4 mr-2" />
               Secure Login
             </button>
           </form>
           <p className="mt-8 text-xs text-center text-slate-400">HIPAA Compliant Environment.</p>
        </div>
      </div>
    );
  }

  // Main Dashboard Layout
  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      
      {/* Sidebar (Desktop) / Nav (Mobile) */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onSOS={() => setIsSOSOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-6 pb-24 md:pb-8">
          
          {/* Mobile Header with SOS (Only visible on small screens where sidebar is hidden/bottom) */}
          <div className="md:hidden flex justify-between items-center mb-6 pt-2 sticky top-0 bg-[#f8fafc]/90 backdrop-blur-sm z-20 pb-2">
            <h1 className="text-xl font-bold text-slate-800 flex items-center tracking-tight">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-2 shadow-md shadow-blue-500/20">
                 <Activity size={16} />
              </div>
              DermaLife
            </h1>
            <SOSButton onTrigger={() => setIsSOSOpen(true)} variant="icon" />
          </div>

          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'scanner' && <Scanner />}
          {currentView === 'records' && <HealthRecords />}
          {currentView === 'tracker' && <MedicineTracker />}
        </div>
      </main>

      {/* SOS Modal Overlay */}
      {isSOSOpen && <SOSModal onClose={() => setIsSOSOpen(false)} />}
    </div>
  );
};

export default App;