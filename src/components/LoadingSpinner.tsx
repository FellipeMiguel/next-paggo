"use client";

import { PulseLoader } from 'react-spinners';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#222831]">
      <PulseLoader color="#948979" size={15} margin={5} />
      <p className="mt-4 text-[#DFD0B8]">Carregando...</p>
    </div>
  );
}