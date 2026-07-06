import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { startNewGame } = useGame();

  return (
    <div className="screen-transition flex flex-col items-center justify-center min-h-[500px] text-center p-6">
      <div className="retro-container max-w-lg w-full flex flex-col items-center gap-8 py-12">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl text-yellow-400 tracking-wider animate-pulse">
            RACIOCÍNIO
          </h1>
          <h1 className="text-2xl md:text-3xl text-yellow-400 tracking-wider">
            CLÍNICO
          </h1>
          <p className="text-xs text-blue-300 font-mono tracking-widest mt-2">
            SIMULADOR UBS v1.0
          </p>
        </div>

        {/* Console-like screen placeholder */}
        <div className="w-full bg-[#1e293b] border-4 border-gray-700 p-6 my-6 rounded text-left font-sans text-sm text-gray-300">
          <p className="text-yellow-400 font-bold mb-2 font-mono text-xs">LOG DE SISTEMA:</p>
          <p className="font-mono text-xs">✔ Inicializando Mapeamento de Comunidade...</p>
          <p className="font-mono text-xs">✔ Carregando Protocolo de Triagem...</p>
          <p className="font-mono text-xs">✔ Sistema de Anamnese Médico Pronto.</p>
        </div>

        <button 
          onClick={startNewGame}
          className="retro-btn primary text-sm py-4 px-8 mt-4 hover:scale-105 transition-transform"
        >
          <Play size={14} className="inline mr-1" />
          START GAME
        </button>

        <p className="text-[10px] text-gray-500 mt-8 font-mono">
          © 2026 ANTIGRAVITY HEALTH LABS
        </p>
      </div>
    </div>
  );
};
