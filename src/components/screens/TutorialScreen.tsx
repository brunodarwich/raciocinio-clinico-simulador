import React from 'react';
import { useGame } from '../../context/GameContext';
import { HelpCircle, Move, Compass, CheckCircle2 } from 'lucide-react';

export const TutorialScreen: React.FC = () => {
  const { setScreen } = useGame();

  return (
    <div className="screen-transition flex flex-col items-center justify-center min-h-[500px] p-6">
      <div className="retro-container max-w-lg w-full flex flex-col gap-6">
        <h2 className="text-sm text-yellow-400 border-b border-slate-800 pb-3 mb-2 flex items-center gap-2 font-retro uppercase">
          <HelpCircle size={16} className="text-cyan-400" />
          Como Jogar e Navegar
        </h2>

        <div className="flex flex-col gap-5 text-left font-sans text-xs text-slate-300 leading-relaxed">
          {/* Movement Box */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex gap-3">
            <div className="text-cyan-400 mt-0.5">
              <Move size={18} />
            </div>
            <div>
              <h3 className="font-retro text-[11px] text-white mb-1.5 uppercase">1. Movimentação do Avatar</h3>
              <p>
                • <strong>Teclado (Desktop)</strong>: Use as setas do teclado (▲ ▼ ◄ ►) ou as teclas <strong>W, A, S, D</strong> para caminhar com o avatar médico pela rua.
              </p>
              <p className="mt-1">
                • <strong>Celular ou Touch</strong>: Use o controle D-Pad virtual que aparecerá na parte inferior da tela.
              </p>
            </div>
          </div>

          {/* Interaction Box */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex gap-3">
            <div className="text-yellow-400 mt-0.5">
              <Compass size={18} />
            </div>
            <div>
              <h3 className="font-retro text-[11px] text-white mb-1.5 uppercase">2. Ativação de Cenários</h3>
              <p>
                • Caminhe até as estrelas douradas piscantes (<code>*</code>) localizadas próximas às residências ou prédios públicos.
              </p>
              <p className="mt-1">
                • <strong>Interação Rápida</strong>: Você também pode clicar/tocar diretamente sobre os ícones de casa, prédio ou ambulância para abrir o cenário correspondente de imediato!
              </p>
            </div>
          </div>

          {/* Progression Box */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex gap-3">
            <div className="text-emerald-400 mt-0.5">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 className="font-retro text-[11px] text-white mb-1.5 uppercase">3. Progressão da Simulação</h3>
              <p>
                • Resolva com sucesso as tarefas da <strong>Fase 1 (Comunidade)</strong> para abrir o portão de acesso à <strong>Fase 2 (UBS Externa)</strong>.
              </p>
              <p className="mt-1">
                • Conclua a ambulância ao fim da Fase 2 para liberar a transição para o mapa interno da <strong>Fase 3 (UBS Interna)</strong>.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setScreen('main-map')}
          className="retro-btn primary justify-center mt-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          ENTRAR NO MAPA
        </button>
      </div>
    </div>
  );
};
