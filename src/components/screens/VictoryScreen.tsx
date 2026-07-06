import { useGame } from '../../context/GameContext';
import { Trophy, RotateCcw } from 'lucide-react';

export const VictoryScreen: React.FC = () => {
  const { player, score, resetGame, completedScenarios } = useGame();

  return (
    <div className="screen-transition flex flex-col items-center justify-center min-h-[500px] text-center p-6">
      <div className="retro-container max-w-lg w-full flex flex-col items-center gap-6 py-10">
        <Trophy size={48} className="text-yellow-400 animate-bounce" />
        
        <h1 className="text-xl md:text-2xl text-yellow-400">
          PARABÉNS, DOUTOR(A)!
        </h1>

        <div className="bg-[#111] border-2 border-gray-800 p-6 rounded w-full text-left font-sans text-xs text-slate-300 space-y-4">
          <p className="font-retro text-[10px] text-yellow-500 border-b border-gray-800 pb-2">
            RELATÓRIO CLÍNICO DE CONCLUSÃO
          </p>
          <p>
            <strong>Médico:</strong> {player.name}
          </p>
          <p>
            <strong>Especialidade/Programa:</strong> {player.specialty}
          </p>
          <p>
            <strong>Cenários Resolvidos:</strong> {completedScenarios.length} / 11
          </p>
          <p>
            <strong>Pontuação Total:</strong> <span className="text-emerald-400 font-bold">{score} XP</span>
          </p>
          
          <div className="pt-2 text-slate-400 leading-relaxed border-t border-gray-800 text-[11px]">
            Você concluiu com sucesso toda a simulação do Raciocínio Clínico na Atenção Primária à Saúde (APS). Percorreu o território comunitário da Fase 1, analisou os fluxos externos da Fase 2 e executou as etapas clínicas e diagnósticas na UBS Interna da Fase 3.
          </div>
        </div>

        <button 
          onClick={resetGame}
          className="retro-btn primary text-xs py-3 px-6 mt-4 flex items-center gap-1"
        >
          <RotateCcw size={12} /> REINICIAR SIMULAÇÃO
        </button>
      </div>
    </div>
  );
};
