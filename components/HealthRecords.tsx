import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Download, FileText } from 'lucide-react';

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
  { date: '2023-10-12', doctor: 'Dr. Sarah Smith', diagnosis: 'Eczema', meds: 'Hydrocortisone', status: 'Active' },
  { date: '2023-09-05', doctor: 'Dr. John Doe', diagnosis: 'Acne Vulgaris', meds: 'Doxycycline', status: 'Completed' },
  { date: '2023-06-15', doctor: 'Dr. Emily Chen', diagnosis: 'Tinea Corporis', meds: 'Terbinafine', status: 'Completed' },
];

export const HealthRecords: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8 pb-20 md:pb-0">
      <h2 className="text-2xl font-bold text-slate-900">Health Records</h2>

      {/* Heart Rate Range Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6">Weekly Heart Rate Range (Min/Max)</h3>
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={RANGE_DATA}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
               <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[40, 120]} />
               <Tooltip 
                 cursor={{fill: '#f1f5f9'}}
                 contentStyle={{borderRadius: '8px', border: 'none'}}
               />
               <Bar dataKey="max" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} name="Max HR" />
               <Bar dataKey="min" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={20} name="Min HR" />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Prescription Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
           <h3 className="font-bold text-slate-800">Prescription History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Diagnosis</th>
                <th className="p-4">Prescription</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PRESCRIPTIONS.map((rx, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{rx.date}</td>
                  <td className="p-4 text-sm text-slate-600">{rx.doctor}</td>
                  <td className="p-4">
                     <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                       rx.diagnosis === 'Eczema' ? 'bg-orange-100 text-orange-700' :
                       rx.diagnosis === 'Acne Vulgaris' ? 'bg-red-100 text-red-700' :
                       'bg-blue-100 text-blue-700'
                     }`}>
                       {rx.diagnosis}
                     </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{rx.meds}</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                       <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};