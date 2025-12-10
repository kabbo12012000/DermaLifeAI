import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { Download, FileText, TrendingUp, Activity } from 'lucide-react';

const RANGE_DATA = [
  { day: 'Mon', min: 60, max: 90 },
  { day: 'Tue', min: 58, max: 88 },
  { day: 'Wed', min: 62, max: 95 },
  { day: 'Thu', min: 59, max: 85 },
  { day: 'Fri', min: 65, max: 92 },
  { day: 'Sat', min: 60, max: 88 },
  { day: 'Sun', min: 58, max: 82 },
];

const PRESCRIPTIONS = [
  { date: 'Oct 12', doctor: 'Dr. Smith', diagnosis: 'Eczema', meds: 'Hydrocortisone', status: 'Active', trend: [30, 40, 35, 50, 45, 60, 55] },
  { date: 'Sep 05', doctor: 'Dr. Doe', diagnosis: 'Acne', meds: 'Doxycycline', status: 'Completed', trend: [60, 55, 50, 40, 30, 25, 20] },
  { date: 'Jun 15', doctor: 'Dr. Chen', diagnosis: 'Tinea', meds: 'Terbinafine', status: 'Completed', trend: [40, 45, 40, 45, 40, 45, 40] },
];

export const HealthRecords: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8 pb-24 md:pb-0">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Health Records</h2>
         <button className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Download size={16} />
            <span>Export All</span>
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-8 flex items-center">
             <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
               <Activity size={18} />
             </div>
             Weekly Vitals Range
          </h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={RANGE_DATA} barGap={0}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[40, 120]} />
                 <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                 />
                 <Bar dataKey="max" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} name="Max" />
                 <Bar dataKey="min" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} name="Min" />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Summary / Highlights */}
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl">
           <div>
             <h3 className="font-bold text-lg mb-1">Wellness Score</h3>
             <p className="text-slate-400 text-sm">Based on recent adherence.</p>
           </div>
           
           <div className="flex items-center justify-center py-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="64" cy="64" r="56" stroke="#1e293b" strokeWidth="8" fill="none" />
                   <circle cx="64" cy="64" r="56" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="351" strokeDashoffset="35" strokeLinecap="round" />
                 </svg>
                 <span className="absolute text-3xl font-bold">92</span>
              </div>
           </div>

           <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-bold text-slate-300 uppercase">Trend</span>
               <TrendingUp size={14} className="text-green-400" />
             </div>
             <p className="text-sm font-medium">Your vitals have improved by 5% this week.</p>
           </div>
        </div>
      </div>

      {/* Modern List View with Sparklines */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <h3 className="font-bold text-slate-800 text-lg">Recent Consultations</h3>
           <div className="flex space-x-2">
             <span className="w-2 h-2 rounded-full bg-orange-400"></span>
             <span className="w-2 h-2 rounded-full bg-blue-400"></span>
             <span className="w-2 h-2 rounded-full bg-slate-300"></span>
           </div>
        </div>
        
        <div className="divide-y divide-slate-50">
          {PRESCRIPTIONS.map((rx, i) => (
            <div key={i} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row items-center justify-between group">
               {/* Left: Info */}
               <div className="flex items-center w-full md:w-1/3 mb-4 md:mb-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4 font-bold text-xs flex-shrink-0">
                    {rx.date.split(' ')[0]}
                    <br/>
                    {rx.date.split(' ')[1]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{rx.diagnosis}</h4>
                    <p className="text-sm text-slate-500">{rx.doctor}</p>
                  </div>
               </div>

               {/* Middle: Sparkline (The "Trend") */}
               <div className="w-full md:w-1/3 h-12 mb-4 md:mb-0 px-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rx.trend.map((val, idx) => ({ val, idx }))}>
                      <Line type="monotone" dataKey="val" stroke={i === 0 ? '#f97316' : '#3b82f6'} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>

               {/* Right: Status & Action */}
               <div className="w-full md:w-1/3 flex items-center justify-between md:justify-end">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold mr-6 ${
                     rx.status === 'Active' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'
                  }`}>
                    {rx.status}
                  </span>
                  
                  <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors bg-white">
                     <FileText size={14} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};