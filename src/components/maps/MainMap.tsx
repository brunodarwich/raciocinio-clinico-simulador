import React, { useEffect, useState } from 'react';
import { useGame, MAIN_MAP_GRID, SCENARIO_LABELS, SCENARIO_ORDER } from '../../context/GameContext';
import { Controls } from './Controls';
import { Lock, Check, Star, LogOut, ShieldAlert } from 'lucide-react';

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Context updates based on positioning
  useEffect(() => {
    const { x, y } = mainMapPlayerPos;
    
    if (x === 4 && y === 5) {
      setDialogText('Você está na Rua de Acesso. Entre para avaliar a situação socioambiental da comunidade.');
    } else if (x === 2 && y === 3) {
      setDialogText('Centro Comunitário. Local do grupo de promoção e prevenção do NASF.');
    } else if (x === 2 && y === 2) {
      setDialogText('Casa da Dona Maria. Lar de uma idosa com polifarmácia e dificuldades de adesão.');
    } else if (x === 6 && y === 2) {
      setDialogText('Condomínio Residencial. Local com alta densidade e relatos de surto de febre.');
    } else if (x === 10 && y === 3) {
      setDialogText('Entrada da Unidade Básica de Saúde. Inicie a acolhida dos pacientes.');
    } else if (x === 9 && y === 3) {
      setDialogText('Placa oficial da UBS. Reflita sobre as diretrizes doutrinárias do SUS.');
    } else if (x === 12 && y === 2) {
      setDialogText('Ambulância do SAMU. Paciente em emergência necessitando de estabilização.');
    } else if (x === 7 && y === 5) {
      setDialogText('Portão de acesso à UBS. Divisão entre o território e a unidade física.');
    } else {
      setDialogText('Explore o mapa da cidade. Conclua os cenários da Comunidade (Fase 1) para abrir a UBS.');
    }
  }, [mainMapPlayerPos]);

  const isScenarioUnlocked = (id: string): boolean => {
    const idx = SCENARIO_ORDER.indexOf(id);
    if (idx === -1) return false;
    if (idx === 0) return true;

    const prevScen = SCENARIO_ORDER[idx - 1];
    return completedScenarios.includes(prevScen);
  };

  const handleElementClick = (id: string) => {
    const details = SCENARIO_LABELS[id];
    if (!details) return;

    if (details.phase === 2 && unlockedPhase < 2) {
      setDialogText('ACESSO BLOQUEADO: Complete a Fase 1 (Comunidade) primeiro!');
      return;
    }

    if (!isScenarioUnlocked(id)) {
      const idx = SCENARIO_ORDER.indexOf(id);
      const pendingScen = SCENARIO_ORDER[idx - 1];
      const pendingTitle = SCENARIO_LABELS[pendingScen]?.title || pendingScen;
      setDialogText(`BLOQUEADO: Conclua primeiro "${pendingTitle}"!`);
      return;
    }

    enterScenario(id);
  };

  const renderGridCells = () => {
    const cells = [];
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 15; x++) {
        const isPath = MAIN_MAP_GRID[y][x] === 1;
        const isPlayer = mainMapPlayerPos.x === x && mainMapPlayerPos.y === y;
        
        let cellClass = 'relative w-full aspect-square flex items-center justify-center border border-slate-900/30 ';
        let cellContent: React.ReactNode = null;

        if (isPath) {
          cellClass += 'bg-slate-800/40 border-slate-700/20'; // Cyber path/road
          
          // Gate Border Cell
          if (x === 7 && y === 5) {
            cellClass += ' border-l-2 border-r-2 border-cyan-500/30 bg-slate-900/70';
            if (unlockedPhase < 2) {
              cellContent = <Lock size={12} className="text-rose-500 animate-pulse" />;
            } else {
              cellContent = <span className="text-[6px] font-retro text-emerald-400">OPEN</span>;
            }
          }

          // Rua de Acesso Point (x:4, y:5)
          if (x === 4 && y === 5) {
            const isDone = completedScenarios.includes('rua-acesso');
            const isUnlocked = isScenarioUnlocked('rua-acesso');
            cellContent = (
              <div 
                onClick={() => handleElementClick('rua-acesso')}
                className={`cursor-pointer p-1 rounded-full flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-bounce shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                }`}
                title="Acessar Rua de Acesso"
              >
                {isDone ? <Check size={8} /> : <Star size={8} />}
              </div>
            );
          }

        } else {
          // Obstacles - Replaced retro green with cyber matrix dark grid
          cellClass += 'bg-[#0a0f1b] border-slate-950/40';

          // Casa da Dona Maria (x:2, y:1-2)
          if (x === 2 && y === 1) {
            cellClass += ' bg-amber-950/20 border border-amber-500/20 rounded-t flex items-center justify-center';
            cellContent = <span className="text-[6px] font-retro text-amber-400/80 select-none">CASA</span>;
          }
          if (x === 2 && y === 2) {
            cellClass += ' bg-amber-950/20 border border-amber-500/20 rounded-b flex items-center justify-center';
            const isDone = completedScenarios.includes('casa-dona-maria');
            const isUnlocked = isScenarioUnlocked('casa-dona-maria');
            cellContent = (
              <div 
                onClick={() => handleElementClick('casa-dona-maria')}
                className={`cursor-pointer p-1 rounded flex items-center justify-center text-[7px] font-retro transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-pulse' 
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}
                title="Casa da Dona Maria"
              >
                {isDone ? <Check size={8} /> : <span>D.M</span>}
              </div>
            );
          }

          // Centro Comunitário (x:2, y:4)
          if (x === 2 && y === 4) {
            cellClass += ' bg-blue-950/20 border border-blue-500/20 rounded flex items-center justify-center';
            const isDone = completedScenarios.includes('centro-comunitario');
            const isUnlocked = isScenarioUnlocked('centro-comunitario');
            cellContent = (
              <div 
                onClick={() => handleElementClick('centro-comunitario')}
                className={`cursor-pointer p-1 rounded flex items-center justify-center text-[7px] font-retro transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-pulse' 
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}
                title="Centro Comunitário"
              >
                {isDone ? <Check size={8} /> : <span>C.C</span>}
              </div>
            );
          }

          // Condomínio (x:6, y:1-2)
          if (x === 6 && y === 1) {
            cellClass += ' bg-teal-950/20 border border-teal-500/20 rounded-t flex items-center justify-center';
            cellContent = <span className="text-[6px] font-retro text-teal-400/80 select-none">CDHU</span>;
          }
          if (x === 6 && y === 2) {
            cellClass += ' bg-teal-950/20 border border-teal-500/20 rounded-b flex items-center justify-center';
            const isDone = completedScenarios.includes('condominio');
            const isUnlocked = isScenarioUnlocked('condominio');
            cellContent = (
              <div 
                onClick={() => handleElementClick('condominio')}
                className={`cursor-pointer p-1 rounded flex items-center justify-center text-[7px] font-retro transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-pulse' 
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}
                title="Condomínio"
              >
                {isDone ? <Check size={8} /> : <span>APT</span>}
              </div>
            );
          }

          // UBS (x:10-11, y:2-3)
          const isUbsCell = (x === 10 || x === 11) && (y === 2 || y === 3);
          if (isUbsCell) {
            cellClass += ' bg-cyan-950/15 border border-cyan-500/10';
            
            if (x === 10 && y === 2) {
              cellClass += ' rounded-tl flex items-center justify-center';
              if (unlockedPhase < 2) {
                cellContent = <Lock size={10} className="text-rose-500/50" />;
              } else {
                cellContent = <span className="text-[6px] font-retro text-cyan-400/80">SUS</span>;
              }
            }
            if (x === 11 && y === 2) {
              cellClass += ' rounded-tr flex items-center justify-center';
              cellContent = <span className="text-[6px] font-retro text-slate-500">UBS</span>;
            }
            if (x === 10 && y === 3) {
              const isDone = completedScenarios.includes('entrada-unidade');
              const isUnlocked = isScenarioUnlocked('entrada-unidade');
              cellContent = (
                <div 
                  onClick={() => handleElementClick('entrada-unidade')}
                  className={`cursor-pointer p-1 rounded flex items-center justify-center text-[6px] font-retro transition-all ${
                    isDone 
                      ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                      : isUnlocked 
                        ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-300 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}
                  title="Entrada da UBS"
                >
                  {isDone ? <Check size={8} /> : <span>PORTA</span>}
                </div>
              );
            }
            if (x === 11 && y === 3) {
              cellClass += ' rounded-br';
            }
          }

          // Placa da UBS (x:9, y:3)
          if (x === 9 && y === 3) {
            cellClass += ' bg-amber-950/20 border border-amber-500/20 rounded flex items-center justify-center';
            const isDone = completedScenarios.includes('placa-ubs');
            const isUnlocked = isScenarioUnlocked('placa-ubs');
            cellContent = (
              <div 
                onClick={() => handleElementClick('placa-ubs')}
                className={`cursor-pointer p-1 rounded flex items-center justify-center text-[6px] font-retro transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-pulse' 
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}
                title="Placa da UBS"
              >
                {isDone ? <Check size={8} /> : <span>PLACA</span>}
              </div>
            );
          }

          // Ambulância (x:12, y:2)
          if (x === 12 && y === 2) {
            cellClass += ' bg-rose-950/20 border border-rose-500/20 rounded flex items-center justify-center';
            const isDone = completedScenarios.includes('ambulancia');
            const isUnlocked = isScenarioUnlocked('ambulancia');
            cellContent = (
              <div 
                onClick={() => handleElementClick('ambulancia')}
                className={`cursor-pointer p-1 rounded flex items-center justify-center text-[6px] font-retro transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}
                title="Ambulância"
              >
                {isDone ? <Check size={8} /> : <span>SAMU</span>}
              </div>
            );
          }
        }

        // Pulse Cyan Player Badge
        if (isPlayer) {
          cellContent = (
            <div className="absolute z-10 w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-600 border border-cyan-200 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all animate-pulse">
              <span className="text-lg">👨‍⚕️</span>
              <div className={`absolute w-2 h-2 bg-rose-500 border border-white rounded-full ${
                mainMapPlayerPos.dir === 'up' ? '-top-0.5' :
                mainMapPlayerPos.dir === 'down' ? '-bottom-0.5' :
                mainMapPlayerPos.dir === 'left' ? '-left-0.5' :
                '-right-0.5'
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
      
      {/* HUD Info */}
      <div className="flex justify-between items-center p-4 rounded-xl hud-panel border border-slate-800/80 font-sans text-xs">
        <div className="flex gap-4">
          <p className="text-slate-400 font-medium">
            Médico: <span className="text-yellow-400 font-retro">Dr(a). {player.name || 'Médico'}</span>
          </p>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <p className="text-slate-400 font-medium">
            Fase: <span className="text-cyan-400 font-retro">
              {unlockedPhase === 1 ? '1: Comunidade' : unlockedPhase === 2 ? '2: UBS Externa' : '3: UBS Interna'}
            </span>
          </p>
        </div>
        <div>
          <button 
            onClick={resetGame}
            className="text-rose-400 hover:text-rose-500 font-semibold flex items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors"
            title="Reiniciar Simulação"
          >
            <LogOut size={12} /> Reiniciar
          </button>
        </div>
      </div>

      {/* Futuristic Map Wrapper */}
      <div className="gameboy-frame">
        <div className="gameboy-screen-wrapper">
          <div className="grid grid-cols-15 bg-[#070b13] relative overflow-hidden select-none border border-slate-900 rounded-lg map-grid-container">
            {renderGridCells()}
          </div>
        </div>
      </div>

      {/* bottom Dialogue box formatted in glassmorphism */}
      <div className="retro-dialog mt-2 text-left">
        <div className="flex items-center gap-1.5 mb-1.5">
          <ShieldAlert size={12} className="text-yellow-400" />
          <span className="text-yellow-400 text-[10px] font-retro uppercase tracking-wider">DIRETRIZ E ORIENTAÇÃO:</span>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-normal">{dialogText}</p>
      </div>

      {/* mobile Directional controller */}
      <div className="md:hidden">
        <Controls onMove={movePlayerOnMainMap} />
      </div>
    </div>
  );
};
