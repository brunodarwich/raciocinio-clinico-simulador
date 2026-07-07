import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { startNewGame } = useGame();

  return (
    <div className="screen-transition flex flex-col items-center justify-center min-h-[500px] text-center p-6">
      <div className="retro-container max-w-lg w-full flex flex-col items-center gap-6 py-10">
        
        {/* Mascot Image */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <img 
            src="/assets/script_login_mascote_cropped-CMxvxDFt.png" 
            alt="Mascote Lanna" 
            className="h-36 w-auto relative z-10 animate-pulse"
            style={{ animationDuration: '4s' }}
          />
        </div>

        <div className="space-y-2 mt-2">
          <h1 className="text-3xl font-retro text-yellow-400 tracking-wider">
            RACIOCÍNIO CLÍNICO
          </h1>
          <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase">
            Simulador UBS v1.0
          </p>
        </div>

        {/* System log styled in glassmorphism */}
        <div className="w-full bg-slate-950/50 border border-slate-800/80 p-5 rounded-xl text-left font-sans text-xs text-slate-300 space-y-1.5 shadow-inner">
          <p className="text-yellow-400 font-bold font-retro mb-1">INICIALIZANDO SIMULADOR:</p>
          <p className="font-mono text-slate-400">✔ Carregando prontuários da comunidade...</p>
          <p className="font-mono text-slate-400">✔ Sincronizando diretrizes e princípios do SUS...</p>
          <p className="font-mono text-slate-400">✔ Modulador de triagem e anamnese ativo.</p>
        </div>

        <button 
          onClick={startNewGame}
          className="retro-btn primary text-sm py-3 px-8 mt-2 hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Play size={14} className="inline mr-1" />
          INICIAR SIMULAÇÃO
        </button>

        <p className="text-[9px] text-slate-500 mt-6 font-mono">
          Desenvolvido com diretrizes do Programa de Saúde da Família.
        </p>
      </div>
    </div>
  );
};
