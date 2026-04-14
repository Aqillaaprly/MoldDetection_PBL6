import React from 'react';

export default function DevicePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFE]">
      
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* Header Section - Profil Beverly sudah dihapus */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h2 className="text-3xl font-extrabold text-[#1E293B]">Device Management</h2>
          
          <div className="flex items-center w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white py-2.5 px-10 rounded-full text-sm outline-none border border-slate-200 focus:border-indigo-300 w-full md:w-64 shadow-sm" 
              />
              <span className="absolute left-4 top-3 text-slate-400">🔍</span>
            </div>
          </div>
        </header>

        {/* Layout Grid Utama */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Kolom Kiri: Device Cards (8 Col) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Main Air Purifier */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xl">💨</div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg h-fit uppercase">Status: Off</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">Main Air Purifier</h3>
                <p className="text-sm text-slate-400 mb-8">Location: Primary Living Suite</p>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-sm py-3 border-y border-slate-50">
                    <span className="text-slate-400 font-medium">Filter Health</span> 
                    <span className="font-bold text-emerald-500">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Current Mode</span> 
                    <span className="font-bold text-slate-300">N/A</span>
                  </div>
                </div>
                <button className="w-full bg-[#3D31D2] text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#3429b5] transition-colors">
                  Turn ON
                </button>
              </div>

              {/* Card 2: Basement Exhaust */}
              <div className="bg-[#5143FB] p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
                <div className="flex justify-between mb-8">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md text-xl">🌀</div>
                  <span className="text-[10px] font-bold bg-[#4ADE80] text-[#064E3B] px-3 py-1.5 rounded-lg h-fit uppercase tracking-tighter">Status: On</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">Basement Exhaust</h3>
                <p className="text-indigo-100/70 text-sm mb-8">Location: Utility Zone 02</p>
                <div className="space-y-4 mb-10">
                  <div className="bg-white/10 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-medium opacity-80 uppercase tracking-wider">Speed Indicator</span> 
                    <span className="text-lg font-bold">III</span>
                  </div>
                  <div className="flex justify-between text-sm px-4">
                    <span className="opacity-70">Current RPM</span> 
                    <span className="font-bold font-mono">1,240</span>
                  </div>
                </div>
                <button className="w-full bg-white text-[#5143FB] py-4 rounded-2xl font-bold hover:bg-slate-50 transition-transform active:scale-95">
                  Turn OFF
                </button>
              </div>
            </div>

            {/* Zone Calibration Box */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row gap-8 items-center shadow-sm">
               <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Zone Calibration</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Fine-tune the moisture extraction parameters for the <span className="text-indigo-600 font-bold underline">East Laboratory Wing</span>. 
                  </p>
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="px-8 py-3 rounded-2xl border border-slate-200 font-bold text-slate-800 hover:bg-slate-50 transition-colors">Manual Override</button>
                    <button className="px-8 py-3 rounded-2xl bg-[#3D31D2] font-bold text-white shadow-lg shadow-indigo-100 hover:bg-[#3429b5] transition-colors">Sync All Devices</button>
                  </div>
               </div>
               <div className="w-full md:w-1/3 bg-slate-50 rounded-3xl h-48 overflow-hidden relative border border-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1558444479-c8f027d49975?q=80&w=300&auto=format&fit=crop" 
                    className="object-cover w-full h-full opacity-80" 
                    alt="circuit" 
                  />
                  <div className="absolute bottom-3 right-3 bg-white p-2.5 rounded-full shadow-md text-sm">📡</div>
               </div>
            </div>
          </div>

          {/* Kolom Kanan: Stats */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-800">Automation Mode</span>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Humidity Threshold: 70%</p>
              <div className="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
                <div className="w-[70%] h-full bg-indigo-500"></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Avg. Humidity</p>
                  <p className="text-2xl font-bold text-slate-800">54%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">VOC Level</p>
                  <p className="text-sm font-bold text-emerald-500 bg-emerald-50 rounded-md py-1 mt-1">LOW</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}