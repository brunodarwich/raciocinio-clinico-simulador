import { GameProvider, useGame, SCENARIO_LABELS } from './context/GameContext';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { InfoScreen } from './components/screens/InfoScreen';
import { TutorialScreen } from './components/screens/TutorialScreen';
import { MainMap } from './components/maps/MainMap';
import { ExtraMap } from './components/maps/ExtraMap';
import { ScenarioContainer } from './components/scenarios/ScenarioContainer';
import { VictoryScreen } from './components/screens/VictoryScreen';

function GameRouter() {
  const { screen } = useGame();

  switch (screen) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'info':
      return <InfoScreen />;
    case 'tutorial':
      return <TutorialScreen />;
    case 'main-map':
      return <MainMap />;
    case 'extra-map':
      return <ExtraMap />;
    case 'scenario':
      return <ScenarioContainer />;
    case 'victory':
      return <VictoryScreen />;
    default:
      return <WelcomeScreen />;
  }
}

function HeaderBar() {
  const { screen, player, score, completedScenarios, mainMapPlayerPos, extraMapPlayerPos, currentScenarioId } = useGame();

  // On welcome or info, render a simple centralized logo
  if (screen === 'welcome' || screen === 'info') {
    return (
      <header className="max-w-4xl mx-auto w-full text-center px-4 mb-4 select-none flex flex-col items-center gap-2">
        <img 
          src="/assets/script_logo-WD1wTJUs.svg" 
          alt="Script Raciocínio Clínico" 
          className="h-10 md:h-12 w-auto animate-fade-in"
        />
        <h2 className="text-[10px] md:text-xs text-slate-500 font-retro tracking-widest uppercase mt-1">
          Simulador de Casos Clínicos e Vigilância à Saúde
        </h2>
      </header>
    );
  }

  // Helper to determine the current title and subtitle based on positioning or scenario
  const getHeaderInfo = () => {
    if (screen === 'scenario' && currentScenarioId) {
      const title = SCENARIO_LABELS[currentScenarioId]?.title || 'Cenário Clínico';
      return {
        title,
        subtitle: 'Responda à questão clínica para prosseguir.'
      };
    }
    if (screen === 'extra-map') {
      const { x, y } = extraMapPlayerPos;
      let loc = 'Interior da UBS';
      if (x === 3 && y === 5) loc = 'Recepção da UBS';
      else if (x === 2 && y === 1) loc = 'Sala de Triagem';
      else if (x === 8 && y === 2) loc = 'Consultório Médico';
      else if (x === 8 && y === 1) loc = 'Anamnese Clínico';
      return {
        title: loc,
        subtitle: 'Caminhe com seu avatar até o estágio desejado.'
      };
    }
    // Default to main-map
    const { x, y } = mainMapPlayerPos;
    let loc = 'Mapa Principal';
    if (x === 4 && y === 5) loc = 'Rua de Acesso';
    else if (x === 2 && y === 3) loc = 'Centro Comunitário';
    else if (x === 2 && y === 2) loc = 'Casa da Dona Maria';
    else if (x === 6 && y === 2) loc = 'Condomínio Residencial';
    else if (x === 10 && y === 3) loc = 'Entrada da Unidade';
    else if (x === 9 && y === 3) loc = 'Placa da UBS';
    else if (x === 12 && y === 2) loc = 'Ambulância';
    return {
      title: loc,
      subtitle: 'Caminhe com seu avatar até o estágio desejado.'
    };
  };

  const info = getHeaderInfo();

  return (
    <header className="white-header select-none">
      <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        {/* Left: Avatar & Profile info */}
        <div className="flex items-center gap-3 w-full sm:w-1/3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 flex items-center justify-center">
            <img 
              src="/assets/avatar-01.png" 
              alt="Avatar Médico" 
              className="w-full h-full object-cover scale-110 translate-y-0.5"
            />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              Dr(a). {player.name || 'Médico'}
            </p>
            <p className="text-[10px] text-slate-400 font-sans leading-tight">
              {player.specialty || 'Médico da Família'}
            </p>
          </div>
        </div>

        {/* Center: Screen Title & Subtitle */}
        <div className="text-center w-full sm:w-1/3 flex flex-col items-center">
          <h1 className="text-lg md:text-xl font-extrabold font-sans text-[#1a426e] leading-snug">
            {info.title}
          </h1>
          <p className="text-[10px] text-slate-500 font-sans">
            {info.subtitle}
          </p>
        </div>

        {/* Right: Score and stats */}
        <div className="flex items-center justify-center sm:justify-end gap-6 w-full sm:w-1/3 text-slate-700 font-sans text-xs">
          <div className="text-center sm:text-right">
            <p className="text-[9px] text-slate-400 font-mono">RESOLVIDOS</p>
            <p className="text-xs font-bold font-retro text-[#1a426e]">{completedScenarios.length} / 11</p>
          </div>
          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>
          <div className="text-center sm:text-right">
            <p className="text-[9px] text-slate-400 font-mono">PONTUAÇÃO</p>
            <p className="text-xs font-bold font-retro text-emerald-600">{score} XP</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <GameProvider>
      <div className="flex-1 w-full min-h-screen flex flex-col justify-between py-6">
        <HeaderBar />

        <main className="flex-1 w-full flex items-center justify-center p-4">
          <GameRouter />
        </main>

        <footer className="max-w-4xl mx-auto w-full text-center px-4 mt-8 select-none">
          <p className="text-[9px] text-slate-600 font-mono leading-relaxed">
            Pressione as teclas direcionais (WASD / Setas) ou use os direcionais virtuais na tela para caminhar pelo mapa.
            <br />
            © 2026 Script Raciocínio Clínico — Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;
