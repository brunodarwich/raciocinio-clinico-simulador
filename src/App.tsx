import { GameProvider, useGame } from './context/GameContext';
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
  const { screen, player, score, completedScenarios } = useGame();

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

  // On other screens, render a beautiful compact HUD
  return (
    <header className="max-w-4xl mx-auto w-full px-4 mb-6 select-none flex flex-col sm:flex-row items-center justify-between gap-4 hud-panel">
      <div className="flex items-center gap-3">
        <img 
          src="/assets/script_logo-WD1wTJUs.svg" 
          alt="Script Logo" 
          className="h-7 w-auto"
        />
        <div className="hidden sm:block h-6 w-[1px] bg-slate-800"></div>
        <div className="text-left">
          <p className="text-xs font-retro text-yellow-400">Dr(a). {player.name || 'Médico'}</p>
          <p className="text-[10px] text-slate-400 font-sans">{player.specialty}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center sm:text-right">
          <p className="text-[10px] text-slate-500 font-mono">RESOLVIDOS</p>
          <p className="text-xs font-bold font-retro text-teal-400">{completedScenarios.length} / 11</p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-[10px] text-slate-500 font-mono">PONTUAÇÃO</p>
          <p className="text-xs font-bold font-retro text-emerald-400">{score} XP</p>
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
