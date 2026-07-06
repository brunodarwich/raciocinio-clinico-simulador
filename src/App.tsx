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

function App() {
  return (
    <GameProvider>
      <div className="flex-1 w-full min-h-screen flex flex-col justify-between py-6">
        <header className="max-w-4xl mx-auto w-full text-center px-4 mb-4 select-none">
          <h2 className="text-[10px] md:text-xs text-slate-500 font-retro tracking-widest uppercase">
            Raciocínio Clínico - Simulação Básica de Fluxo e Jogabilidade
          </h2>
        </header>

        <main className="flex-1 w-full flex items-center justify-center p-4">
          <GameRouter />
        </main>

        <footer className="max-w-4xl mx-auto w-full text-center px-4 mt-6 select-none">
          <p className="text-[9px] text-slate-600 font-mono">
            Pressione as teclas direcionais (WASD / Setas) no computador ou use os controles móveis para explorar.
          </p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;
