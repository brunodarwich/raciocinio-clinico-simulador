import React, { createContext, useContext, useState, useEffect } from 'react';

export type ScreenType = 'welcome' | 'info' | 'tutorial' | 'main-map' | 'extra-map' | 'scenario' | 'victory';

export interface PlayerInfo {
  name: string;
  specialty: string;
}

export interface GameContextType {
  screen: ScreenType;
  player: PlayerInfo;
  currentScenarioId: string | null;
  completedScenarios: string[];
  score: number;
  unlockedPhase: 1 | 2 | 3;
  mainMapPlayerPos: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' };
  extraMapPlayerPos: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' };
  setScreen: (screen: ScreenType) => void;
  setPlayer: (player: PlayerInfo) => void;
  startNewGame: () => void;
  enterScenario: (id: string) => void;
  completeScenario: (id: string, scoreGained: number) => void;
  exitScenario: () => void;
  movePlayerOnMainMap: (dx: number, dy: number) => void;
  movePlayerOnExtraMap: (dx: number, dy: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Definição da ordem linear de desbloqueio dos cenários
export const SCENARIO_ORDER = [
  // Fase 1: Comunidade
  'rua-acesso',
  'centro-comunitario',
  'casa-dona-maria',
  'condominio',
  // Fase 2: UBS Externa
  'entrada-unidade',
  'placa-ubs',
  'ambulancia',
  // Fase 3: UBS Interna
  'recepcao',
  'triagem',
  'consultorio',
  'anamnese'
];

export const SCENARIO_LABELS: Record<string, { title: string; phase: 1 | 2 | 3 }> = {
  'rua-acesso': { title: 'Rua de Acesso', phase: 1 },
  'centro-comunitario': { title: 'Centro Comunitário', phase: 1 },
  'casa-dona-maria': { title: 'Casa da Dona Maria', phase: 1 },
  'condominio': { title: 'Condomínio Residencial', phase: 1 },
  'entrada-unidade': { title: 'Entrada da Unidade', phase: 2 },
  'placa-ubs': { title: 'Placa da UBS', phase: 2 },
  'ambulancia': { title: 'Ambulância', phase: 2 },
  'recepcao': { title: 'Recepção', phase: 3 },
  'triagem': { title: 'Sala de Triagem', phase: 3 },
  'consultorio': { title: 'Consultório Médico', phase: 3 },
  'anamnese': { title: 'Anamnese Clínico', phase: 3 },
};

// Definição de obstáculos no Mapa Principal (Grid 15x7)
// x: 0..14, y: 0..6
// 1 = Caminho percorrível (Walkable Path)
// Outros valores ou vazios = Obstáculos (Casas, Prédios, Paredes, Grama)
export const MAIN_MAP_GRID = [
  // y=0 (Linha superior - obstáculo/limites)
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // y=1 (Casas / Condomínio / Ambulância)
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // y=2 (Conexões verticais Dona Maria e Condomínio, Entrada UBS)
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  // y=3 (Pontos Dona Maria/Condomínio, Placa UBS, Centro Comunitário)
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
  // y=4 (Conexões verticais mais baixas)
  [0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0],
  // y=5 (Rua Horizontal Principal)
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  // y=6 (Grama inferior)
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Definição de obstáculos no Mapa Extra / UBS Interna (Grid 10x8)
// y: 0..7, x: 0..9
// 1 = Walkable, 0 = Wall
export const EXTRA_MAP_GRID = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Parede Superior
  [0, 1, 1, 0, 1, 1, 1, 0, 1, 0], // Triagem (1..2,1), Corredor (4..6,1), Consultório (8,1)
  [0, 1, 1, 0, 1, 1, 1, 0, 1, 0], // Triagem (1..2,2), Corredor (4..6,2), Consultório (8,2)
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0], // Paredes separando salas
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0], // Recepção principal (caminho livre horizontal)
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0], // Recepção principal (caminho livre horizontal)
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0], // Recepção principal (caminho livre horizontal)
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Parede Inferior
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreenState] = useState<ScreenType>('welcome');
  const [player, setPlayerState] = useState<PlayerInfo>({ name: '', specialty: '' });
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [unlockedPhase, setUnlockedPhase] = useState<1 | 2 | 3>(1);

  // Avatar no Mapa Principal
  const [mainMapPlayerPos, setMainMapPlayerPos] = useState<{ x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' }>({ x: 2, y: 5, dir: 'down' });

  // Avatar no Mapa Extra (UBS Interna)
  const [extraMapPlayerPos, setExtraMapPlayerPos] = useState<{ x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' }>({ x: 4, y: 5, dir: 'up' });

  // Sincronizar fase desbloqueada baseada nos cenários completos
  useEffect(() => {
    // Fase 1 cenários: 'rua-acesso', 'centro-comunitario', 'casa-dona-maria', 'condominio'
    const phase1Done = ['rua-acesso', 'centro-comunitario', 'casa-dona-maria', 'condominio'].every(s =>
      completedScenarios.includes(s)
    );
    // Fase 2 cenários: 'entrada-unidade', 'placa-ubs', 'ambulancia'
    const phase2Done = ['entrada-unidade', 'placa-ubs', 'ambulancia'].every(s =>
      completedScenarios.includes(s)
    );

    if (phase1Done && phase2Done) {
      setUnlockedPhase(3);
    } else if (phase1Done) {
      setUnlockedPhase(2);
    } else {
      setUnlockedPhase(1);
    }
  }, [completedScenarios]);

  // Carregar dados salvos do LocalStorage (Persistência)
  useEffect(() => {
    const saved = localStorage.getItem('raciocinio-clinico-game');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.player) setPlayerState(parsed.player);
        if (parsed.completedScenarios) setCompletedScenarios(parsed.completedScenarios);
        if (parsed.score) setScore(parsed.score);
        if (parsed.screen) setScreenState(parsed.screen);
        if (parsed.mainMapPlayerPos) setMainMapPlayerPos(parsed.mainMapPlayerPos);
        if (parsed.extraMapPlayerPos) setExtraMapPlayerPos(parsed.extraMapPlayerPos);
      } catch (e) {
        console.error('Erro ao ler progresso salvo', e);
      }
    }
  }, []);

  // Salvar progresso no LocalStorage
  const saveGameState = (
    scr: ScreenType,
    pInfo: PlayerInfo,
    compScen: string[],
    scrVal: number,
    mPos: typeof mainMapPlayerPos,
    ePos: typeof extraMapPlayerPos
  ) => {
    localStorage.setItem(
      'raciocinio-clinico-game',
      JSON.stringify({
        screen: scr,
        player: pInfo,
        completedScenarios: compScen,
        score: scrVal,
        mainMapPlayerPos: mPos,
        extraMapPlayerPos: ePos,
      })
    );
  };

  const setScreen = (newScreen: ScreenType) => {
    setScreenState(newScreen);
    saveGameState(newScreen, player, completedScenarios, score, mainMapPlayerPos, extraMapPlayerPos);
  };

  const setPlayer = (info: PlayerInfo) => {
    setPlayerState(info);
    saveGameState(screen, info, completedScenarios, score, mainMapPlayerPos, extraMapPlayerPos);
  };

  const startNewGame = () => {
    setCompletedScenarios([]);
    setScore(0);
    setUnlockedPhase(1);
    setMainMapPlayerPos({ x: 2, y: 5, dir: 'down' });
    setExtraMapPlayerPos({ x: 4, y: 5, dir: 'up' });
    setScreenState('info');
    localStorage.removeItem('raciocinio-clinico-game');
  };

  const enterScenario = (id: string) => {
    setCurrentScenarioId(id);
    setScreenState('scenario');
  };

  const completeScenario = (id: string, scoreGained: number) => {
    let nextCompleted = [...completedScenarios];
    if (!completedScenarios.includes(id)) {
      nextCompleted.push(id);
      setScore(prev => prev + scoreGained);
    }
    setCompletedScenarios(nextCompleted);
    setCurrentScenarioId(null);

    // Se concluiu o último cenário de todos ('anamnese'), vai para a vitória!
    if (id === 'anamnese') {
      setScreenState('victory');
      saveGameState('victory', player, nextCompleted, score + scoreGained, mainMapPlayerPos, extraMapPlayerPos);
    } else {
      // Se concluiu a ambulância (fim da fase 2), transiciona para o Mapa Extra
      if (id === 'ambulancia') {
        setScreenState('extra-map');
        saveGameState('extra-map', player, nextCompleted, score + scoreGained, mainMapPlayerPos, extraMapPlayerPos);
      } else {
        setScreenState('main-map');
        saveGameState('main-map', player, nextCompleted, score + scoreGained, mainMapPlayerPos, extraMapPlayerPos);
      }
    }
  };

  const exitScenario = () => {
    setCurrentScenarioId(null);
    if (unlockedPhase === 3) {
      setScreenState('extra-map');
    } else {
      setScreenState('main-map');
    }
  };

  const movePlayerOnMainMap = (dx: number, dy: number) => {
    const nextX = mainMapPlayerPos.x + dx;
    const nextY = mainMapPlayerPos.y + dy;
    let newDir = mainMapPlayerPos.dir;

    if (dx > 0) newDir = 'right';
    else if (dx < 0) newDir = 'left';
    else if (dy > 0) newDir = 'down';
    else if (dy < 0) newDir = 'up';

    // Verificar limites
    if (nextX < 0 || nextX >= 15 || nextY < 0 || nextY >= 7) {
      setMainMapPlayerPos(prev => ({ ...prev, dir: newDir }));
      return;
    }

    // Verificar se é caminho caminhável
    if (MAIN_MAP_GRID[nextY][nextX] !== 1) {
      setMainMapPlayerPos(prev => ({ ...prev, dir: newDir }));
      return;
    }

    // Regra de transição da Fase 1 para Fase 2 (bloqueio por progresso)
    // Se tentar cruzar para a metade direita (x >= 8) e a Fase 2 estiver trancada
    if (nextX >= 8 && unlockedPhase < 2) {
      // Bloqueado
      alert('Acesso Bloqueado! Você precisa concluir todos os cenários da Comunidade (Fase 1) antes de entrar na UBS.');
      setMainMapPlayerPos(prev => ({ ...prev, dir: newDir }));
      return;
    }

    const newPos = { x: nextX, y: nextY, dir: newDir };
    setMainMapPlayerPos(newPos);
    saveGameState(screen, player, completedScenarios, score, newPos, extraMapPlayerPos);
  };

  const movePlayerOnExtraMap = (dx: number, dy: number) => {
    const nextX = extraMapPlayerPos.x + dx;
    const nextY = extraMapPlayerPos.y + dy;
    let newDir = extraMapPlayerPos.dir;

    if (dx > 0) newDir = 'right';
    else if (dx < 0) newDir = 'left';
    else if (dy > 0) newDir = 'down';
    else if (dy < 0) newDir = 'up';

    // Verificar limites
    if (nextX < 0 || nextX >= 10 || nextY < 0 || nextY >= 8) {
      setExtraMapPlayerPos(prev => ({ ...prev, dir: newDir }));
      return;
    }

    // Verificar se bate em parede
    if (EXTRA_MAP_GRID[nextY][nextX] !== 1) {
      setExtraMapPlayerPos(prev => ({ ...prev, dir: newDir }));
      return;
    }

    const newPos = { x: nextX, y: nextY, dir: newDir };
    setExtraMapPlayerPos(newPos);
    saveGameState(screen, player, completedScenarios, score, mainMapPlayerPos, newPos);
  };

  const resetGame = () => {
    startNewGame();
  };

  return (
    <GameContext.Provider
      value={{
        screen,
        player,
        currentScenarioId,
        completedScenarios,
        score,
        unlockedPhase,
        mainMapPlayerPos,
        extraMapPlayerPos,
        setScreen,
        setPlayer,
        startNewGame,
        enterScenario,
        completeScenario,
        exitScenario,
        movePlayerOnMainMap,
        movePlayerOnExtraMap,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame deve ser utilizado dentro de um GameProvider');
  }
  return context;
};
