import React from 'react';
import { Heart, Pill, Activity, TrendingUp, Watch, Droplets, Wind, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

const MOCK_HR_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: 65 + Math.random() * 20 + (i > 8 && i < 20 ? 15 : 0), 
}));

const ADHERENCE_DATA = [
  { name: 'Taken', value: 85 },
  { name: 'Missed', value: 15 },
];

const COLORS = ['#3b82f6', '#e2e8f0'];

// Component for a single vital card (Bento Item)
const VitalCard = ({ icon: Icon, label, value, unit, color, subValue }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300 group cursor-default relative overflow-hidden h-40">
     <div className={`absolute -right-4 -top-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color} transform rotate-12`}>
        <Icon size={80} />
     </div>
     
     <div className="flex justify-between items-start mb-2 relative z-10">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${color.replace('text-', 'bg-').replace('600', '50')} ${color}`}>
          <Icon size={20} />
        </div>
        {subValue && (
          <div className="flex items-center space-x-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
             <TrendingUp size={10} /> <span>{subValue}</span>
          </div>
        )}
     </div>
     
     <div className="relative z-10">
        <div className="flex items-baseline space-x-1">
          <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
          <span className="text-xs font-bold text-slate-400">{unit}</span>
        </div>
        <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
     </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8 pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Morning, Alex</h2>
           <p className="text-slate-500 font-medium">Your vitals look stable today.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white pl-2 pr-4 py-2 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
             <Watch size={18} />
           </div>
           <div className="flex flex-col">
             <div className="flex items-center">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1.5"></span>
               <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Sync Active</p>
             </div>
             <p className="text-[10px] text-slate-400 font-bold mt-0.5">Battery 84%</p>
           </div>
        </div>
      </div>

      {/* Bento Grid Vitals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <VitalCard 
          icon={Heart} 
          label="Heart Rate" 
          value="72" 
          unit="bpm" 
          color="text-rose-500" 
          subValue="+2%" 
        />
        <VitalCard 
          icon={Activity} 
          label="Blood Pressure" 
          value="120/80" 
          unit="mmHg" 
          color="text-blue-500" 
        />
        <VitalCard 
          icon={Wind} 
          label="SpO2" 
          value="98" 
          unit="%" 
          color="text-cyan-500" 
        />
        <VitalCard 
          icon={Zap} 
          label="Stress Lvl" 
          value="Low" 
          unit="" 
          color="text-amber-500" 
        />
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Line Chart */}
         <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-96">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Heart Rate History</h3>
                <p className="text-xs text-slate-400 font-medium">Today vs Yesterday</p>
              </div>
            </div>
            
            <div className="flex-1 w-full relative -ml-2">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={MOCK_HR_DATA}>
                   <defs>
                     <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px'}}
                      itemStyle={{color: '#1e293b', fontWeight: 'bold', fontSize: '12px'}}
                      cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                   />
                   <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorHr)" 
                   />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Side Cards Column */}
         <div className="space-y-6 flex flex-col h-96">
            
            {/* Next Pill Card */}
            <div className="flex-1 bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500">
                 <Pill size={120} />
               </div>
               
               <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                   <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10">Next Dose</span>
                   <h4 className="text-2xl font-bold mb-1">Amoxicillin</h4>
                   <p className="text-slate-400 text-sm">500mg • With Food</p>
                 </div>
                 
                 <div className="flex items-center text-sm font-bold bg-white/10 w-fit px-4 py-3 rounded-xl border border-white/5 backdrop-blur-sm">
                   <div className="w-2 h-2 rounded-full bg-blue-400 mr-3 animate-pulse"></div>
                   12:00 PM
                 </div>
               </div>
            </div>

            {/* Adherence Donut */}
            <div className="h-40 bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center relative overflow-hidden">
               <div className="flex-1">
                 <h3 className="font-bold text-slate-800 text-sm mb-1">Daily Adherence</h3>
                 <p className="text-xs text-slate-400">2 doses remaining</p>
               </div>
               
               <div className="h-32 w-32 relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={ADHERENCE_DATA}
                       cx="50%"
                       cy="50%"
                       innerRadius={35}
                       outerRadius={50}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                       cornerRadius={10}
                     >
                       {ADHERENCE_DATA.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-lg font-bold text-slate-800">85%</span>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};