import React from 'react';
import { LayoutDashboard, Scan, FileText, Pill, LogOut, Activity, AlertOctagon } from 'lucide-react';
import { View } from '../App';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  onSOS: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onSOS }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'AI Scanner', icon: Scan },
    { id: 'records', label: 'Health Records', icon: FileText },
    { id: 'tracker', label: 'Meds Tracker', icon: Pill },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-20">
        <div className="p-8 flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mr-3 shadow-blue-500/30 shadow-lg">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">DermaLife</h1>
            <p className="text-xs text-slate-400 font-medium">PATIENT PORTAL</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as View)}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-4">
           <button 
            onClick={onSOS}
            className="w-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 hover:border-red-600 transition-all py-3 rounded-xl flex items-center justify-center font-bold animate-pulse"
           >
             <AlertOctagon className="mr-2" size={20} />
             SOS EMERGENCY
           </button>

           <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden mr-3">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">Alex Johnson</p>
                <p className="text-xs text-slate-500 truncate">alex.j@example.com</p>
              </div>
              <LogOut size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
           </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 md:hidden flex justify-around p-4 z-20 pb-safe">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as View)}
            className={`flex flex-col items-center ${
              currentView === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={24} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};