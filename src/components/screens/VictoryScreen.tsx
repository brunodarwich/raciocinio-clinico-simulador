import React from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, RotateCcw, Award } from 'lucide-react';

export const VictoryScreen: React.FC = () => {
  const { player, score, resetGame, completedScenarios } = useGame();

  return (
    <div className="screen-transition flex flex-col items-center justify-center min-h-[500px] text-center p-6">
      <div className="retro-container max-w-lg w-full flex flex-col items-center gap-6 py-8">
        
        {/* Trophy with Glowing Backdrop */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-yellow-500/10 rounded-full blur-xl"></div>
          <Trophy size={48} className="text-yellow-400 relative z-10 animate-bounce" style={{ animationDuration: '2.5s' }} />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-2xl font-retro text-yellow-400 uppercase tracking-wider">
            Simulação Concluída!
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            Você demonstrou excelente raciocínio clínico.
          </p>
        </div>

        {/* Certificate / Clinical Report Sheet */}
        <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-xl w-full text-left font-sans text-xs text-slate-300 space-y-4 shadow-inner">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
            <Award size={14} className="text-yellow-400" />
            <span className="font-retro text-[10px] text-yellow-500 uppercase tracking-wider">
              RELATÓRIO CLÍNICO DE DESEMPENHO
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[11px]">
            <div>
              <p className="text-slate-500">MÉDICO(A) DE PLANTÃO:</p>
              <p className="font-semibold text-slate-200">Dr(a). {player.name}</p>
            </div>
            <div>
              <p className="text-slate-500">ESPECIALIDADE / PROGRAMA:</p>
              <p className="font-semibold text-slate-200">{player.specialty}</p>
            </div>
            <div>
              <p className="text-slate-500">CENÁRIOS RESOLVIDOS:</p>
              <p className="font-semibold text-slate-200">{completedScenarios.length} de 11 estágios</p>
            </div>
            <div>
              <p className="text-slate-500">EXPERIÊNCIA TOTAL CONQUISTADA:</p>
              <p className="font-semibold text-emerald-400">{score} XP</p>
            </div>
          </div>
          
          <div className="pt-3 text-slate-400 leading-relaxed border-t border-slate-800/80 text-[11px]">
            Você cobriu com êxito todas as etapas de atendimento do simulador. Percorreu a comunidade (Fase 1) mapeando saneamento e riscos socioambientais; atendeu demandas externas e regulação na UBS (Fase 2); e conduziu com sucesso o fluxo interno de triagem, consultório de gestante e anamnese de suspeita infecciosa (Fase 3).
          </div>
        </div>

        <button 
          onClick={resetGame}
          className="retro-btn primary text-xs py-3 px-6 mt-2 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
        >
          <RotateCcw size={12} /> REINICIAR SIMULAÇÃO
        </button>
      </div>
    </div>
  );
};
