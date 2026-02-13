import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
        Fetching Data...
      </p>
    </div>
  );
};

export default Loader;