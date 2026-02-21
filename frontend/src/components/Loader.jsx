import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-neon/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-neon rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-[10px] font-black text-neon uppercase tracking-widest animate-pulse">
        Fetching Intelligence...
      </p>
    </div>
  );
};

export default Loader;