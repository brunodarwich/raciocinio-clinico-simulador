import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ControlsProps {
  onMove: (dx: number, dy: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ onMove }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 border-4 border-slate-700 rounded mt-4 max-w-[200px] mx-auto select-none">
      {/* Botão Up */}
      <button
        onClick={() => onMove(0, -1)}
        className="w-12 h-12 bg-slate-800 border-2 border-slate-600 active:bg-slate-700 text-white rounded flex items-center justify-center mb-1 outline-none shadow-md"
        title="Mover para Cima"
      >
        <ArrowUp size={20} />
      </button>

      {/* Botões Esquerda e Direita */}
      <div className="flex gap-4">
        <button
          onClick={() => onMove(-1, 0)}
          className="w-12 h-12 bg-slate-800 border-2 border-slate-600 active:bg-slate-700 text-white rounded flex items-center justify-center outline-none shadow-md"
          title="Mover para Esquerda"
        >
          <ArrowLeft size={20} />
        </button>

        <button
          onClick={() => onMove(1, 0)}
          className="w-12 h-12 bg-slate-800 border-2 border-slate-600 active:bg-slate-700 text-white rounded flex items-center justify-center outline-none shadow-md"
          title="Mover para Direita"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Botão Down */}
      <button
        onClick={() => onMove(0, 1)}
        className="w-12 h-12 bg-slate-800 border-2 border-slate-600 active:bg-slate-700 text-white rounded flex items-center justify-center mt-1 outline-none shadow-md"
        title="Mover para Baixo"
      >
        <ArrowDown size={20} />
      </button>
    </div>
  );
};
