import React from 'react';
import { useGame } from '../../context/GameContext';
import { HelpCircle } from 'lucide-react';

export const TutorialScreen: React.FC = () => {
  const { setScreen } = useGame();

  return (
    <div className="screen-transition flex flex-col items-center justify-center min-h-[500px] p-6">
      <div className="retro-container max-w-lg w-full flex flex-col gap-6">
        <h2 className="text-sm text-yellow-400 border-b-4 border-yellow-400 pb-2 mb-2 flex items-center gap-2">
          <HelpCircle size={16} />
          COMO JOGAR
        </h2>

        <div className="flex flex-col gap-4 text-left font-sans text-xs text-gray-300 leading-relaxed">
          <div>
            <h3 className="font-retro text-[10px] text-white mb-2">1. MOVIMENTAÇÃO</h3>
            <p className="pl-4">
              • **Teclado (Computador)**: Use as setas do teclado (▲ ▼ ◄ ►) ou as teclas **W, A, S, D** para andar com seu avatar médico pelo caminho livre.
            </p>
            <p className="pl-4 mt-1">
              • **Celular / Touch**: Use o controle direcional digital que aparecerá na parte inferior da tela.
            </p>
          </div>

          <div>
            <h3 className="font-retro text-[10px] text-white mb-2">2. INTERAÇÃO</h3>
            <p className="pl-4">
              • Caminhe até as estrelas piscantes (`*`) que representam os pontos de interesse.
            </p>
            <p className="pl-4 mt-1">
              • Ao encostar nelas com o avatar, você poderá iniciar o cenário correspondente.
            </p>
            <p className="pl-4 mt-1">
              • **Atalho**: Você também pode clicar diretamente nos ícones interativos no mapa com o mouse ou toque para entrar no cenário!
            </p>
          </div>

          <div>
            <h3 className="font-retro text-[10px] text-white mb-2">3. PROGRESSÃO LINEAR</h3>
            <p className="pl-4">
              • Complete as tarefas da **Fase 1 (Comunidade)** para abrir a **Fase 2 (UBS Externa)**.
            </p>
            <p className="pl-4 mt-1">
              • Complete a Fase 2 para ter acesso ao mapa interno da **Fase 3 (UBS Interna)**.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setScreen('main-map')}
          className="retro-btn primary justify-center mt-4"
        >
          ENTRAR NO MAPA
        </button>
      </div>
    </div>
  );
};
