import { useEffect, useState } from 'react';
import { useGame, MAIN_MAP_GRID, SCENARIO_LABELS, SCENARIO_ORDER } from '../../context/GameContext';
import { Controls } from './Controls';
import { Lock, Check, Star, LogOut } from 'lucide-react';

export const MainMap: React.FC = () => {
  const {
    mainMapPlayerPos,
    movePlayerOnMainMap,
    completedScenarios,
    unlockedPhase,
    enterScenario,
    resetGame,
    player
  } = useGame();

  const [dialogText, setDialogText] = useState<string>('Use as SETAS/WASD para andar. Aproxime-se dos pontos com "*" ou clique neles.');

  // Configurar escuta do teclado para movimento
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar rolagem de tela com as setas
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          movePlayerOnMainMap(0, -1);
          break;
        case 'arrowdown':
        case 's':
          movePlayerOnMainMap(0, 1);
          break;
        case 'arrowleft':
        case 'a':
          movePlayerOnMainMap(-1, 0);
          break;
        case 'arrowright':
        case 'd':
          movePlayerOnMainMap(1, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayerOnMainMap]);

  // Verificar em qual ponto o jogador está pisando para atualizar o diálogo
  useEffect(() => {
    const { x, y } = mainMapPlayerPos;
    
    // Mapear posições para cenários
    if (x === 4 && y === 5) {
      setDialogText('Você está na Rua de Acesso. Encoste ou clique para avaliar a comunidade.');
    } else if (x === 2 && y === 3) {
      setDialogText('Centro Comunitário. Local de reuniões locais.');
    } else if (x === 2 && y === 2) {
      setDialogText('Casa da Dona Maria. Lar de uma paciente querida.');
    } else if (x === 6 && y === 2) {
      setDialogText('Condomínio Residencial. Muitos moradores residem aqui.');
    } else if (x === 10 && y === 2) {
      setDialogText('Entrada da Unidade Básica de Saúde.');
    } else if (x === 9 && y === 3) {
      setDialogText('Placa oficial da Unidade Básica de Saúde.');
    } else if (x === 12 && y === 2) {
      setDialogText('Ambulância de resgate da UBS.');
    } else if (x === 7 && y === 5) {
      setDialogText('Portão da UBS. Divisa entre a Comunidade e a Área da Saúde.');
    } else {
      setDialogText('Navegue pelas ruas. Conclua a Comunidade (Fase 1) para abrir a UBS (Fase 2).');
    }
  }, [mainMapPlayerPos]);

  // Checar se cenário está desbloqueado linearmente
  const isScenarioUnlocked = (id: string): boolean => {
    const idx = SCENARIO_ORDER.indexOf(id);
    if (idx === -1) return false;
    if (idx === 0) return true; // Primeiro cenário sempre aberto

    // O anterior deve estar concluído
    const prevScen = SCENARIO_ORDER[idx - 1];
    return completedScenarios.includes(prevScen);
  };

  // Trata cliques diretos nos elementos
  const handleElementClick = (id: string) => {
    const details = SCENARIO_LABELS[id];
    if (!details) return;

    if (details.phase === 2 && unlockedPhase < 2) {
      setDialogText('ACESSO BLOQUEADO: Complete a Fase 1 (Comunidade) primeiro!');
      return;
    }

    if (!isScenarioUnlocked(id)) {
      // Localizar qual está bloqueando
      const idx = SCENARIO_ORDER.indexOf(id);
      const pendingScen = SCENARIO_ORDER[idx - 1];
      const pendingTitle = SCENARIO_LABELS[pendingScen]?.title || pendingScen;
      setDialogText(`BLOQUEADO: Conclua primeiro "${pendingTitle}"!`);
      return;
    }

    // Se passou na validação, inicia o cenário
    enterScenario(id);
  };

  // Renderizar o Grid de forma visual
  const renderGridCells = () => {
    const cells = [];
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 15; x++) {
        const isPath = MAIN_MAP_GRID[y][x] === 1;
        const isPlayer = mainMapPlayerPos.x === x && mainMapPlayerPos.y === y;
        
        let cellClass = 'relative w-full aspect-square flex items-center justify-center border border-slate-800/10 ';
        let cellContent: React.ReactNode = null;

        // Renderização dos Tipos de Terreno e Elementos
        if (isPath) {
          cellClass += 'bg-[#e2e8f0]'; // Cor de asfalto/rua
          
          // Divisória do Portão (Fase 1 / Fase 2)
          if (x === 7 && y === 5) {
            cellClass += ' border-l-4 border-l-amber-800 border-r-4 border-r-amber-800 bg-[#cbd5e1]';
            if (unlockedPhase < 2) {
              cellContent = <Lock size={12} className="text-red-500 animate-pulse" />;
            } else {
              cellContent = <div className="text-[8px] font-bold text-emerald-600">OPEN</div>;
            }
          }

          // Estrela da Rua de Acesso (x:4, y:5)
          if (x === 4 && y === 5) {
            const isDone = completedScenarios.includes('rua-acesso');
            const isUnlocked = isScenarioUnlocked('rua-acesso');
            cellContent = (
              <div 
                onClick={() => handleElementClick('rua-acesso')}
                className={`cursor-pointer p-1 rounded-full ${isDone ? 'bg-emerald-600 text-white' : isUnlocked ? 'bg-yellow-500 text-black animate-bounce' : 'bg-gray-500 text-gray-300'}`}
              >
                {isDone ? <Check size={10} /> : <Star size={10} />}
              </div>
            );
          }

        } else {
          // Obstáculo ou Elemento Estático
          cellClass += 'bg-[#1e3a1e]'; // Grama de fundo escuro retro

          // Casa da Dona Maria (x:2, y:1-2)
          if (x === 2 && y === 1) {
            cellClass += ' bg-amber-700/80 border-t-4 border-l-4 border-r-4 border-amber-950 rounded-t';
            cellContent = <div className="text-[8px] text-white font-bold">CASA</div>;
          }
          if (x === 2 && y === 2) {
            cellClass += ' bg-amber-700/80 border-b-4 border-l-4 border-r-4 border-amber-950 flex flex-col items-center';
            const isDone = completedScenarios.includes('casa-dona-maria');
            const isUnlocked = isScenarioUnlocked('casa-dona-maria');
            cellContent = (
              <div 
                onClick={() => handleElementClick('casa-dona-maria')}
                className={`cursor-pointer p-1 rounded ${isDone ? 'bg-emerald-600' : isUnlocked ? 'bg-yellow-500 animate-pulse' : 'bg-slate-700'}`}
                title="Casa da Dona Maria"
              >
                {isDone ? <Check size={10} className="text-white" /> : <span className="text-[10px] text-black font-bold">D.M</span>}
              </div>
            );
          }

          // Centro Comunitário (x:2, y:4)
          if (x === 2 && y === 4) {
            cellClass += ' bg-blue-800 border-4 border-blue-950 rounded';
            const isDone = completedScenarios.includes('centro-comunitario');
            const isUnlocked = isScenarioUnlocked('centro-comunitario');
            cellContent = (
              <div 
                onClick={() => handleElementClick('centro-comunitario')}
                className={`cursor-pointer p-1 rounded text-center ${isDone ? 'bg-emerald-600' : isUnlocked ? 'bg-yellow-500 animate-pulse' : 'bg-slate-700'}`}
                title="Centro Comunitário"
              >
                {isDone ? <Check size={10} className="text-white" /> : <span className="text-[8px] text-white font-bold">CC</span>}
              </div>
            );
          }

          // Condomínio (x:6, y:1-2)
          if (x === 6 && y === 1) {
            cellClass += ' bg-teal-800 border-t-4 border-l-4 border-r-4 border-teal-950';
            cellContent = <div className="text-[8px] text-white">CDHU</div>;
          }
          if (x === 6 && y === 2) {
            cellClass += ' bg-teal-800 border-b-4 border-l-4 border-r-4 border-teal-950';
            const isDone = completedScenarios.includes('condominio');
            const isUnlocked = isScenarioUnlocked('condominio');
            cellContent = (
              <div 
                onClick={() => handleElementClick('condominio')}
                className={`cursor-pointer p-1 rounded ${isDone ? 'bg-emerald-600' : isUnlocked ? 'bg-yellow-500 animate-pulse' : 'bg-slate-700'}`}
                title="Condomínio"
              >
                {isDone ? <Check size={10} className="text-white" /> : <span className="text-[8px] text-white font-bold">APT</span>}
              </div>
            );
          }

          // Unidade Básica de Saúde (UBS) - Células x:10-11, y:2-3
          const isUbsCell = (x === 10 || x === 11) && (y === 2 || y === 3);
          if (isUbsCell) {
            cellClass += ' bg-slate-100 border border-slate-400';
            
            // Desenhar cadeado ou identificação
            if (x === 10 && y === 2) {
              cellClass += ' border-t-4 border-l-4 border-slate-600 rounded-tl';
              if (unlockedPhase < 2) {
                cellContent = (
                  <span title="UBS Bloqueada">
                    <Lock size={14} className="text-red-500 animate-bounce" />
                  </span>
                );
              } else {
                cellContent = <div className="text-[8px] text-blue-600 font-bold">SUS</div>;
              }
            }
            if (x === 11 && y === 2) {
              cellClass += ' border-t-4 border-r-4 border-slate-600 rounded-tr';
              cellContent = <div className="text-[8px] text-gray-500">UBS</div>;
            }
            if (x === 10 && y === 3) {
              cellClass += ' border-b-4 border-l-4 border-slate-600';
              // Entrada da Unidade interact
              const isDone = completedScenarios.includes('entrada-unidade');
              const isUnlocked = isScenarioUnlocked('entrada-unidade');
              cellContent = (
                <div 
                  onClick={() => handleElementClick('entrada-unidade')}
                  className={`cursor-pointer p-1 rounded ${isDone ? 'bg-emerald-600' : isUnlocked ? 'bg-yellow-500 animate-pulse' : 'bg-slate-700'}`}
                  title="Entrada da UBS"
                >
                  {isDone ? <Check size={8} className="text-white" /> : <span className="text-[8px] text-white">PORTA</span>}
                </div>
              );
            }
            if (x === 11 && y === 3) {
              cellClass += ' border-b-4 border-r-4 border-slate-600';
            }
          }

          // Placa da UBS (x:9, y:3)
          if (x === 9 && y === 3) {
            cellClass += ' bg-amber-600 border-2 border-amber-900 rounded-t';
            const isDone = completedScenarios.includes('placa-ubs');
            const isUnlocked = isScenarioUnlocked('placa-ubs');
            cellContent = (
              <div 
                onClick={() => handleElementClick('placa-ubs')}
                className={`cursor-pointer p-1 rounded ${isDone ? 'bg-emerald-600' : isUnlocked ? 'bg-yellow-500 animate-pulse' : 'bg-slate-700'}`}
                title="Placa da UBS"
              >
                {isDone ? <Check size={10} className="text-white" /> : <span className="text-[8px] text-black font-bold">PLACA</span>}
              </div>
            );
          }

          // Ambulância (x:12, y:2)
          if (x === 12 && y === 2) {
            cellClass += ' bg-red-100 border-4 border-red-700 rounded';
            const isDone = completedScenarios.includes('ambulancia');
            const isUnlocked = isScenarioUnlocked('ambulancia');
            cellContent = (
              <div 
                onClick={() => handleElementClick('ambulancia')}
                className={`cursor-pointer p-1 rounded ${isDone ? 'bg-emerald-600' : isUnlocked ? 'bg-yellow-500 animate-pulse' : 'bg-slate-700'}`}
                title="Ambulância"
              >
                {isDone ? <Check size={10} className="text-white" /> : <span className="text-[8px] text-red-600 font-bold">SAMU</span>}
              </div>
            );
          }
        }

        // Renderização do Avatar do Jogador (👨‍⚕️ / 👩‍⚕️)
        if (isPlayer) {
          cellContent = (
            <div className="absolute z-10 w-10 h-10 bg-blue-500 border-4 border-black rounded-full flex items-center justify-center shadow-lg transition-all animate-bounce">
              <span className="text-lg">👨‍⚕️</span>
              {/* Seta direcional do avatar */}
              <div className={`absolute w-3 h-3 bg-red-600 border border-black rounded-full ${
                mainMapPlayerPos.dir === 'up' ? '-top-1' :
                mainMapPlayerPos.dir === 'down' ? '-bottom-1' :
                mainMapPlayerPos.dir === 'left' ? '-left-1' :
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
    <div className="screen-transition flex flex-col gap-4 max-w-4xl mx-auto w-full p-4">
      {/* HUD Superior */}
      <div className="flex justify-between items-center bg-[#1e293b] border-4 border-slate-700 p-3 rounded font-mono text-xs">
        <div className="flex gap-4">
          <p>
            Médico(a): <span className="text-yellow-400">{player.name || 'Doutor'}</span>
          </p>
          <p>
            Fase Atual: <span className="text-blue-400">
              {unlockedPhase === 1 ? '1: Comunidade' : unlockedPhase === 2 ? '2: UBS Externa' : '3: UBS Interna'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p>
            Score: <span className="text-emerald-400">{completedScenarios.length * 10} XP</span>
          </p>
          <button 
            onClick={resetGame}
            className="text-red-400 hover:text-red-500 font-bold flex items-center gap-1 bg-none border-0 cursor-pointer"
            title="Reiniciar Simulação"
          >
            <LogOut size={12} /> Sair
          </button>
        </div>
      </div>

      {/* Tela do Jogo / Grid do Mapa */}
      <div className="gameboy-frame">
        <div className="gameboy-screen-wrapper">
          <div className="grid grid-cols-15 bg-[#1e3a1e] relative overflow-hidden select-none border-4 border-black">
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
        <Controls onMove={movePlayerOnMainMap} />
      </div>
    </div>
  );
};
