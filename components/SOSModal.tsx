import React, { useEffect, useRef, useState } from 'react';
import { Phone, X, Video, Users, Heart, VideoOff } from 'lucide-react';

interface SOSModalProps {
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          setPermissionError(false);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setPermissionError(true);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[600px] animate-in zoom-in-95 duration-300">
        
        {/* Left: Camera Feed & Status */}
        <div className="md:w-1/2 bg-black relative flex flex-col">
          <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/70 to-transparent z-10 flex justify-between items-start">
             <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${permissionError ? 'bg-slate-500' : 'bg-red-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${permissionError ? 'bg-slate-500' : 'bg-red-500'}`}></span>
                </span>
                <span className="text-white font-mono text-sm font-bold tracking-widest">LIVE FEED</span>
             </div>
             <div className="bg-red-600/20 backdrop-blur-sm border border-red-500/50 px-3 py-1 rounded-full text-red-200 text-xs font-bold">
               LOCATING...
             </div>
          </div>

          <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               muted 
               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${streamActive ? 'opacity-100' : 'opacity-30'}`}
             />
             
             {/* Loading State */}
             {!streamActive && !permissionError && <Video className="text-slate-700 w-16 h-16 animate-pulse" />}
             
             {/* Error State */}
             {permissionError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
                   <VideoOff className="text-red-500 w-12 h-12 mb-3 opacity-80" />
                   <p className="text-red-400 font-bold text-sm">Camera Access Denied</p>
                   <p className="text-slate-500 text-xs mt-1">Please enable permissions in your browser</p>
                </div>
             )}
             
             {/* Overlay Grid */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>

          <div className="p-6 bg-slate-900 text-white border-t border-slate-800">
            <h3 className="font-bold text-lg flex items-center mb-1">
              <Heart className="text-red-500 mr-2 fill-current animate-pulse" />
              Pulse Detected: 112 bpm
            </h3>
            <p className="text-slate-400 text-sm">Automated recording saved to cloud.</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="md:w-1/2 bg-white p-8 flex flex-col relative">
          <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
           >
             <X size={20} />
           </button>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Emergency Help</h2>
            <p className="text-slate-500">Select a contact to connect immediately.</p>
          </div>

          <div className="flex-1 space-y-4">
             {/* Primary Emergency */}
             <button className="w-full group relative overflow-hidden bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl shadow-xl shadow-red-500/30 transition-all transform active:scale-[0.98]">
               <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
               <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center">
                   <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                     <Phone className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-left">
                     <span className="block text-xs font-bold opacity-80 tracking-wider">EMERGENCY SERVICES</span>
                     <span className="block text-2xl font-bold">Call 911</span>
                   </div>
                 </div>
                 <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
               </div>
             </button>

             {/* Family Contacts */}
             <div className="grid grid-cols-2 gap-4">
               <button className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 p-4 rounded-2xl transition-all text-left group">
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <Users size={20} />
                 </div>
                 <span className="block font-bold text-slate-700 group-hover:text-blue-700">Call Mom</span>
                 <span className="text-xs text-slate-400">Mobile</span>
               </button>

               <button className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 p-4 rounded-2xl transition-all text-left group">
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <Users size={20} />
                 </div>
                 <span className="block font-bold text-slate-700 group-hover:text-blue-700">Call Partner</span>
                 <span className="text-xs text-slate-400">Work</span>
               </button>
             </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-100">
             <div className="flex items-center justify-between text-xs text-slate-400">
               <span>GPS Location Sent</span>
               <span>ID: #SOS-8821</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};