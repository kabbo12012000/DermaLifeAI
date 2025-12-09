import React from 'react';
import { Heart, Pill, Activity, TrendingUp, Watch, Droplets, Wind } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

const MOCK_HR_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: 65 + Math.random() * 20 + (i > 8 && i < 20 ? 15 : 0), // Higher during day
}));

const ADHERENCE_DATA = [
  { name: 'Taken', value: 85 },
  { name: 'Missed', value: 15 },
];

const COLORS = ['#2563eb', '#cbd5e1'];

// Mock Component for a single vital card
const VitalCard = ({ icon: Icon, label, value, unit, color, subValue }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:border-slate-300 transition-colors group cursor-default relative overflow-hidden">
     <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon size={64} />
     </div>
     <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('600', '50')} ${color}`}>
          <Icon size={20} />
        </div>
        {subValue && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center">
             <TrendingUp size={12} className="mr-1" /> {subValue}
          </span>
        )}
     </div>
     <div>
        <div className="flex items-baseline">
          <p className="text-2xl font-black text-slate-800">{value}</p>
          <span className="ml-1 text-xs font-bold text-slate-400 uppercase">{unit}</span>
        </div>
        <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
     </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Hello, Alex 👋</h2>
           <p className="text-slate-500 font-medium">Your vitals are stable. Have a great day!</p>
        </div>
        <div className="flex items-center space-x-4 bg-white p-2 pr-4 rounded-xl border border-slate-100 shadow-sm">
           <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
             <Watch size={20} />
           </div>
           <div>
             <div className="flex items-center">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
               <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Watch Sync Active</p>
             </div>
             <p className="text-[10px] text-slate-400 font-medium">Last update: Just now</p>
           </div>
        </div>
      </div>

      {/* Smart Watch Vitals Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <VitalCard 
          icon={Heart} 
          label="Heart Rate" 
          value="72" 
          unit="bpm" 
          color="text-rose-600" 
          subValue="+2%" 
        />
        <VitalCard 
          icon={Activity} 
          label="Blood Pressure" 
          value="120/80" 
          unit="mmHg" 
          color="text-blue-600" 
        />
        <VitalCard 
          icon={Wind} 
          label="SpO2" 
          value="98" 
          unit="%" 
          color="text-cyan-600" 
        />
        <VitalCard 
          icon={Droplets} 
          label="Hydration" 
          value="65" 
          unit="%" 
          color="text-indigo-600" 
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Heart Rate Chart */}
         <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">Heart Rate History</h3>
              <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-3 py-2 outline-none">
                <option>Today</option>
                <option>Yesterday</option>
              </select>
            </div>
            
            <div className="h-72 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={MOCK_HR_DATA}>
                   <defs>
                     <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                      itemStyle={{color: '#1e293b', fontWeight: 'bold'}}
                   />
                   <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2563eb" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorHr)" 
                   />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Adherence/Next Pill */}
         <div className="space-y-6">
            {/* Next Pill Card */}
            <div className="bg-slate-900 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Pill size={100} />
               </div>
               <div className="relative z-10">
                 <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 backdrop-blur-sm">Next Dose</span>
                 <h4 className="text-2xl font-bold mb-1">Amoxicillin</h4>
                 <p className="text-slate-400 text-sm mb-6">500mg • After Lunch</p>
                 <div className="flex items-center text-sm font-bold">
                   <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                     <Activity size={16} />
                   </div>
                   12:00 PM
                 </div>
               </div>
            </div>

            {/* Adherence Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[240px]">
               <h3 className="font-bold text-slate-800 mb-2">Adherence</h3>
               <div className="flex-1 relative flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={ADHERENCE_DATA}
                       cx="50%"
                       cy="50%"
                       innerRadius={55}
                       outerRadius={75}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                     >
                       {ADHERENCE_DATA.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-800">85%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Score</span>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};