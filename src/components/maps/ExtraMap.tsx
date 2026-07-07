import React, { useEffect, useState } from 'react';
import { useGame, EXTRA_MAP_GRID, SCENARIO_LABELS, SCENARIO_ORDER } from '../../context/GameContext';
import { Controls } from './Controls';
import { Check, Star, ArrowLeft, ShieldAlert } from 'lucide-react';

export const ExtraMap: React.FC = () => {
  const {
    extraMapPlayerPos,
    movePlayerOnExtraMap,
    completedScenarios,
    enterScenario,
    setScreen,
    score
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
      setDialogText('Recepção da UBS. Acolha o paciente e decida sobre sua ficha de cadastro.');
    } else if (x === 2 && y === 1) {
      setDialogText('Sala de Triagem. Avalie os sinais vitais e defina o manejo de urgência do paciente.');
    } else if (x === 8 && y === 2) {
      setDialogText('Consultório Médico. Conduza a triagem de diabetes gestacional da gestante.');
    } else if (x === 8 && y === 1) {
      setDialogText('Anamnese Clínico. Realize a investigação ativa de Tuberculose no sintomático respiratório.');
    } else if (y >= 4 && y <= 6) {
      setDialogText('Você está na Sala de Espera / Recepção.');
    } else if (x >= 4 && x <= 6 && y >= 1 && y <= 2) {
      setDialogText('Corredor interno de acesso aos consultórios.');
    } else {
      setDialogText('UBS Interna. Use setas/WASD para caminhar pelas salas.');
    }
  }, [extraMapPlayerPos]);

  const isScenarioUnlocked = (id: string): boolean => {
    const idx = SCENARIO_ORDER.indexOf(id);
    if (idx === -1) return false;
    if (idx === 0) return true;

    const prevScen = SCENARIO_ORDER[idx - 1];
    return completedScenarios.includes(prevScen);
  };

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

  const renderGridCells = () => {
    const cells = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        const isWalkable = EXTRA_MAP_GRID[y][x] === 1;
        const isPlayer = extraMapPlayerPos.x === x && extraMapPlayerPos.y === y;
        
        let cellClass = 'relative w-full aspect-square flex items-center justify-center border border-slate-900/30 ';
        let cellContent: React.ReactNode = null;

        if (isWalkable) {
          cellClass += 'bg-slate-800/40 border-slate-700/20'; // Inside floor

          // Recepção Star Point (x:3, y:5)
          if (x === 3 && y === 5) {
            const isDone = completedScenarios.includes('recepcao');
            const isUnlocked = isScenarioUnlocked('recepcao');
            cellContent = (
              <div 
                onClick={() => handleElementClick('recepcao')}
                className={`cursor-pointer p-1 rounded-full flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-bounce shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                }`}
                title="Acessar Recepção"
              >
                {isDone ? <Check size={8} /> : <Star size={8} />}
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
                className={`cursor-pointer p-1 rounded-full flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-bounce shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                }`}
                title="Acessar Triagem"
              >
                {isDone ? <Check size={8} /> : <Star size={8} />}
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
                className={`cursor-pointer p-1 rounded-full flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-bounce shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                }`}
                title="Acessar Consultório"
              >
                {isDone ? <Check size={8} /> : <Star size={8} />}
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
                className={`cursor-pointer p-1 rounded-full flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                    : isUnlocked 
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 animate-bounce shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                }`}
                title="Acessar Anamnese"
              >
                {isDone ? <Check size={8} /> : <Star size={8} />}
              </div>
            );
          }

        } else {
          // Walls - Glass panels
          cellClass += 'bg-[#0a0f1b] border-slate-950/40';

          if (x === 2 && y === 0) {
            cellContent = <span className="text-[6px] font-retro text-cyan-400/80 select-none">TRIAGEM</span>;
          }
          if (x === 8 && y === 0) {
            cellContent = <span className="text-[6px] font-retro text-cyan-400/80 select-none">MÉDICO</span>;
          }
          if (x === 5 && y === 7) {
            cellContent = <span className="text-[6px] font-retro text-cyan-400/80 select-none">ESPERA</span>;
          }
        }

        // Pulse Cyan Player Badge
        if (isPlayer) {
          cellContent = (
            <div className="absolute z-10 w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-600 border border-cyan-200 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all animate-pulse">
              <span className="text-lg">👨‍⚕️</span>
              <div className={`absolute w-2 h-2 bg-rose-500 border border-white rounded-full ${
                extraMapPlayerPos.dir === 'up' ? '-top-0.5' :
                extraMapPlayerPos.dir === 'down' ? '-bottom-0.5' :
                extraMapPlayerPos.dir === 'left' ? '-left-0.5' :
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
    <div className="screen-transition flex flex-col gap-4 max-w-2xl mx-auto w-full p-4">
      
      {/* HUD Info */}
      <div className="flex justify-between items-center p-4 rounded-xl hud-panel border border-slate-800/80 font-sans text-xs">
        <div>
          <button 
            onClick={() => setScreen('main-map')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors"
            title="Voltar para a área externa"
          >
            <ArrowLeft size={12} /> Voltar à Rua
          </button>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-slate-400 font-medium">UBS Interna (Fase 3)</p>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <p className="text-slate-400 font-medium">
            Score: <span className="text-emerald-400 font-retro">{score} XP</span>
          </p>
        </div>
      </div>

      {/* Futuristic Map Wrapper */}
      <div className="gameboy-frame">
        <div className="gameboy-screen-wrapper">
          <div className="grid grid-cols-10 bg-[#070b13] relative overflow-hidden select-none border border-slate-900 rounded-lg map-grid-container">
            {renderGridCells()}
          </div>
        </div>
      </div>

      {/* bottom Dialogue box formatted in glassmorphism */}
      <div className="retro-dialog mt-2 text-left">
        <div className="flex items-center gap-1.5 mb-1.5">
          <ShieldAlert size={12} className="text-yellow-400" />
          <span className="text-yellow-400 text-[10px] font-retro uppercase tracking-wider">ORIENTAÇÃO UBS:</span>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-normal">{dialogText}</p>
      </div>

      {/* mobile Directional controller */}
      <div className="md:hidden">
        <Controls onMove={movePlayerOnExtraMap} />
      </div>
    </div>
  );
};
