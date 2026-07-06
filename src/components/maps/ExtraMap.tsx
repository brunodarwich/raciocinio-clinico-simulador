import React, { useEffect, useState } from 'react';
import { useGame, EXTRA_MAP_GRID, SCENARIO_LABELS, SCENARIO_ORDER } from '../../context/GameContext';
import { Controls } from './Controls';
import { Check, Star, ArrowLeft } from 'lucide-react';

export const ExtraMap: React.FC = () => {
  const {
    extraMapPlayerPos,
    movePlayerOnExtraMap,
    completedScenarios,
    enterScenario,
    setScreen
  } = useGame();

  const [dialogText, setDialogText] = useState<string>('Você entrou na UBS. Complete o atendimento: Recepção -> Triagem -> Consultório -> Anamnese.');

  // Configurar escuta do teclado para movimento
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          movePlayerOnExtraMap(0, -1);
          break;
        case 'arrowdown':
        case 's':
          movePlayerOnExtraMap(0, 1);
          break;
        case 'arrowleft':
        case 'a':
          movePlayerOnExtraMap(-1, 0);
          break;
        case 'arrowright':
        case 'd':
          movePlayerOnExtraMap(1, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayerOnExtraMap]);

  // Verificar em qual ponto o jogador está pisando para atualizar o diálogo
  useEffect(() => {
    const { x, y } = extraMapPlayerPos;
    
    if (x === 3 && y === 5) {
      setDialogText('Recepção da UBS. Fale com a recepcionista para cadastrar a ficha de atendimento.');
    } else if (x === 2 && y === 1) {
      setDialogText('Sala de Triagem. Aferição de sinais vitais e peso.');
    } else if (x === 8 && y === 2) {
      setDialogText('Consultório Médico. Inicie a consulta clínica.');
    } else if (x === 8 && y === 1) {
      setDialogText('Anamnese Detalhada. Entrevista profunda para raciocínio diagnóstico.');
    } else if (y >= 4 && y <= 6) {
      setDialogText('Você está na Sala de Espera / Recepção.');
    } else if (x >= 4 && x <= 6 && y >= 1 && y <= 2) {
      setDialogText('Corredor interno de acesso aos consultórios.');
    } else {
      setDialogText('UBS Interna. Use setas/WASD para caminhar pelas salas.');
    }
  }, [extraMapPlayerPos]);

  // Checar se cenário está desbloqueado linearmente
  const isScenarioUnlocked = (id: string): boolean => {
    const idx = SCENARIO_ORDER.indexOf(id);
    if (idx === -1) return false;
    if (idx === 0) return true;

    const prevScen = SCENARIO_ORDER[idx - 1];
    return completedScenarios.includes(prevScen);
  };

  // Trata cliques diretos nos elementos
  const handleElementClick = (id: string) => {
    if (!isScenarioUnlocked(id)) {
      const idx = SCENARIO_ORDER.indexOf(id);
      const pendingScen = SCENARIO_ORDER[idx - 1];
      const pendingTitle = SCENARIO_LABELS[pendingScen]?.title || pendingScen;
      setDialogText(`BLOQUEADO: Conclua primeiro "${pendingTitle}"!`);
      return;
    }
    enterScenario(id);
  };

  // Renderizar o Grid de forma visual
  const renderGridCells = () => {
    const cells = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        const isWalkable = EXTRA_MAP_GRID[y][x] === 1;
        const isPlayer = extraMapPlayerPos.x === x && extraMapPlayerPos.y === y;
        
        let cellClass = 'relative w-full aspect-square flex items-center justify-center border ';
        let cellContent: React.ReactNode = null;

        if (isWalkable) {
          cellClass += 'bg-[#e2e8f0] border-slate-300'; // Piso interno cinza claro

          // Recepção Star Point (x:3, y:5)
          if (x === 3 && y === 5) {
            const isDone = completedScenarios.includes('recepcao');
            const isUnlocked = isScenarioUnlocked('recepcao');
            cellContent = (
              <div 
                onClick={() => handleElementClick('recepcao')}
                className={`cursor-pointer p-1 rounded-full ${isDone ? 'bg-emerald-600 text-white' : isUnlocked ? 'bg-yellow-500 text-black animate-bounce' : 'bg-gray-500 text-gray-300'}`}
                title="Acessar Recepção"
              >
                {isDone ? <Check size={10} /> : <Star size={10} />}
              </div>
            );
          }

          // Triagem Star Point (x:2, y:1)
          if (x === 2 && y === 1) {
            const isDone = completedScenarios.includes('triagem');
            const isUnlocked = isScenarioUnlocked('triagem');
            cellContent = (
              <div 
                onClick={() => handleElementClick('triagem')}
                className={`cursor-pointer p-1 rounded-full ${isDone ? 'bg-emerald-600 text-white' : isUnlocked ? 'bg-yellow-500 text-black animate-bounce' : 'bg-gray-500 text-gray-300'}`}
                title="Acessar Triagem"
              >
                {isDone ? <Check size={10} /> : <Star size={10} />}
              </div>
            );
          }

          // Consultório Star Point (x:8, y:2)
          if (x === 8 && y === 2) {
            const isDone = completedScenarios.includes('consultorio');
            const isUnlocked = isScenarioUnlocked('consultorio');
            cellContent = (
              <div 
                onClick={() => handleElementClick('consultorio')}
                className={`cursor-pointer p-1 rounded-full ${isDone ? 'bg-emerald-600 text-white' : isUnlocked ? 'bg-yellow-500 text-black animate-bounce' : 'bg-gray-500 text-gray-300'}`}
                title="Acessar Consultório"
              >
                {isDone ? <Check size={10} /> : <Star size={10} />}
              </div>
            );
          }

          // Anamnese Star Point (x:8, y:1)
          if (x === 8 && y === 1) {
            const isDone = completedScenarios.includes('anamnese');
            const isUnlocked = isScenarioUnlocked('anamnese');
            cellContent = (
              <div 
                onClick={() => handleElementClick('anamnese')}
                className={`cursor-pointer p-1 rounded-full ${isDone ? 'bg-emerald-600 text-white' : isUnlocked ? 'bg-yellow-500 text-black animate-bounce' : 'bg-gray-500 text-gray-300'}`}
                title="Acessar Anamnese"
              >
                {isDone ? <Check size={10} /> : <Star size={10} />}
              </div>
            );
          }

        } else {
          // Parede / Obstáculo
          cellClass += 'bg-[#475569] border-slate-700'; // Cor de parede cinza escuro

          // Adicionar rótulos nas salas nas paredes divisórias
          if (x === 2 && y === 0) {
            cellContent = <span className="text-[7px] text-yellow-300 font-bold select-none">TRIAGEM</span>;
          }
          if (x === 8 && y === 0) {
            cellContent = <span className="text-[7px] text-yellow-300 font-bold select-none">MÉDICO</span>;
          }
          if (x === 5 && y === 7) {
            cellContent = <span className="text-[7px] text-yellow-300 font-bold select-none">ESPERA</span>;
          }
        }

        // Renderização do Avatar do Jogador (👨‍⚕️)
        if (isPlayer) {
          cellContent = (
            <div className="absolute z-10 w-10 h-10 bg-blue-500 border-4 border-black rounded-full flex items-center justify-center shadow-lg transition-all animate-bounce">
              <span className="text-lg">👨‍⚕️</span>
              {/* Seta direcional */}
              <div className={`absolute w-3 h-3 bg-red-600 border border-black rounded-full ${
                extraMapPlayerPos.dir === 'up' ? '-top-1' :
                extraMapPlayerPos.dir === 'down' ? '-bottom-1' :
                extraMapPlayerPos.dir === 'left' ? '-left-1' :
                '-right-1'
              }`} />
            </div>
          );
        }

        cells.push(
          <div key={`${x}-${y}`} className={cellClass}>
            {cellContent}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="screen-transition flex flex-col gap-4 max-w-2xl mx-auto w-full p-4">
      {/* HUD Superior */}
      <div className="flex justify-between items-center bg-[#1e293b] border-4 border-slate-700 p-3 rounded font-mono text-xs">
        <div className="flex gap-4">
          <button 
            onClick={() => setScreen('main-map')}
            className="text-yellow-400 hover:text-yellow-500 font-bold flex items-center gap-1 bg-none border-0 cursor-pointer"
            title="Voltar para a área externa"
          >
            <ArrowLeft size={12} /> Voltar à Rua
          </button>
        </div>
        <div className="flex items-center gap-4">
          <p>
            UBS Interna
          </p>
          <p>
            Score: <span className="text-emerald-400">{completedScenarios.length * 10} XP</span>
          </p>
        </div>
      </div>

      {/* Tela do Jogo / Grid do Mapa Extra */}
      <div className="gameboy-frame">
        <div className="gameboy-screen-wrapper">
          <div className="grid grid-cols-10 bg-[#475569] relative overflow-hidden select-none border-4 border-black">
            {renderGridCells()}
          </div>
        </div>
      </div>

      {/* Caixa de Diálogo Retro */}
      <div className="retro-dialog mt-2 text-left">
        <p className="text-yellow-400 text-[10px] mb-2 font-mono">DICA / EVENTO:</p>
        <p className="text-xs font-mono">{dialogText}</p>
      </div>

      {/* Controles para Dispositivos Móveis */}
      <div className="md:hidden">
        <Controls onMove={movePlayerOnExtraMap} />
      </div>
    </div>
  );
};
