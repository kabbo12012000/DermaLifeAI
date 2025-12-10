import React from 'react';
import { LayoutDashboard, Scan, FileText, Pill, LogOut, Activity } from 'lucide-react';
import { View } from '../App';
import { SOSButton } from './SOSButton';

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
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 hidden md:flex flex-col z-30 shadow-sm">
        <div className="p-8 flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-500/20">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">DermaLife</h1>
            <p className="text-xs text-slate-400 font-semibold tracking-wider">PATIENT PORTAL</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as View)}
              className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100 translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-6">
           {/* Press and Hold SOS Button */}
           <div className="space-y-2">
             <SOSButton onTrigger={onSOS} />
             <p className="text-[10px] text-center text-slate-400">Press & Hold for 3s to Activate</p>
           </div>

           <div className="flex items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden mr-3 border-2 border-white shadow-sm">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">Alex Johnson</p>
                <p className="text-xs text-slate-500 truncate">alex.j@example.com</p>
              </div>
              <LogOut size={16} className="text-slate-400 group-hover:text-slate-600" />
           </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 md:hidden flex justify-around p-4 z-40 pb-safe shadow-lg">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as View)}
            className={`flex flex-col items-center transition-colors ${
              currentView === item.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.id ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};