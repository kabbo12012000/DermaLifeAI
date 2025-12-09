import React, { useState } from 'react';
import { Activity, Lock, AlertCircle } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { HealthRecords } from './components/HealthRecords';
import { MedicineTracker } from './components/MedicineTracker';
import { SOSModal } from './components/SOSModal';

export type View = 'dashboard' | 'scanner' | 'records' | 'tracker';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-8 md:p-12">
           <div className="flex flex-col items-center mb-8">
             <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
               <Activity size={32} />
             </div>
             <h1 className="text-3xl font-bold text-slate-800">DermaLife AI</h1>
             <p className="text-slate-500 mt-2 text-center">Secure Patient Portal</p>
           </div>
           
           <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
             <div>
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email ID</label>
               <input type="email" placeholder="patient@example.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
             </div>
             <div>
               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
               <input type="password" placeholder="••••••••" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
             </div>
             <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center">
               <Lock className="w-4 h-4 mr-2" />
               Secure Login
             </button>
           </form>
           <p className="mt-6 text-xs text-center text-slate-400">HIPAA Compliant Environment.</p>
        </div>
      </div>
    );
  }

  // Main Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* Sidebar (Desktop) / Nav (Mobile) */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onSOS={() => setIsSOSOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Mobile Header with SOS (Only visible on small screens where sidebar is hidden/bottom) */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-slate-800 flex items-center">
              <Activity className="w-6 h-6 text-blue-600 mr-2" />
              DermaLife
            </h1>
            <button 
              onClick={() => setIsSOSOpen(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-red-500/30 shadow-lg"
            >
              SOS
            </button>
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