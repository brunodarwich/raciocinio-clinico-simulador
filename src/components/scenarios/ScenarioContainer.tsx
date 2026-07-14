import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SCENARIO_DATA } from './ScenarioData';
import { BookOpen, MessageSquare, HelpCircle, Award, AlertCircle, RefreshCw, X, Home, Map } from 'lucide-react';

const getScenarioBackground = (id: string): string => {
  switch (id) {
    case 'centro-comunitario':
      return '/assets/script_espera_bg.png';
    case 'casa-dona-maria':
      return '/assets/script_casa_maria.png';
    case 'condominio':
      return '/assets/script_condominio.png';
    case 'placa-ubs':
      return '/assets/script_placa_ubs.png';
    // Inside UBS scenarios (Phase 3)
    case 'recepcao':
    case 'triagem':
    case 'consultorio':
    case 'anamnese':
      return '/assets/script_espera_bg.png';
    // Default fallback
    default:
      return '/assets/script_map_gpt.png';
  }
};

export const ScenarioContainer: React.FC = () => {
  const { currentScenarioId, completeScenario, exitScenario, resetGame } = useGame();
  const [step, setStep] = useState<'intro' | 'dialogue' | 'question' | 'feedback'>('intro');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!currentScenarioId) return null;

  const data = SCENARIO_DATA[currentScenarioId];
  if (!data) {
    return (
      <div className="retro-container text-center max-w-md mx-auto my-12 p-6">
        <p className="text-red-500 font-bold mb-4">CENÁRIO NÃO ENCONTRADO</p>
        <button onClick={exitScenario} className="retro-btn">Sair</button>
      </div>
    );
  }

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    const correct = index === data.question.correctIndex;
    setIsCorrect(correct);
    setStep('feedback');
  };

  const handleNextStep = () => {
    if (step === 'intro') {
      if (data.dialogues && data.dialogues.length > 0) {
        setStep('dialogue');
      } else {
        setStep('question');
      }
    } else if (step === 'dialogue') {
      setStep('question');
    }
  };

  const handleComplete = () => {
    completeScenario(currentScenarioId, 10);
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setStep('question');
  };

  // Helper to parse dialogues like "Agente de Saúde: '...'" into formatted speaker/text
  const parseDialogue = (line: string) => {
    const dividerIdx = line.indexOf(':');
    if (dividerIdx === -1) {
      return { speaker: 'Narração', text: line };
    }
    const speaker = line.substring(0, dividerIdx).trim();
    const text = line.substring(dividerIdx + 1).trim().replace(/^["']|["']$/g, '');
    return { speaker, text };
  };

  return (
    <div className="screen-transition flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
      <div className="gameboy-frame w-full">
        <div className="gameboy-screen-wrapper">
          <div 
            className="scenario-bg-overlay w-full min-h-[460px] p-4 md:p-6 flex items-center justify-center select-none"
            style={{ 
              backgroundImage: `url(${getScenarioBackground(currentScenarioId)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="scenario-glass-overlay w-full max-w-xl text-left flex flex-col gap-4">
              {/* Scenario Header inside overlay */}
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-2 mb-1">
                <h2 className="text-xs text-yellow-400 font-retro uppercase tracking-wider">
                  Estágio: {data.title}
                </h2>
                <button 
                  onClick={exitScenario} 
                  className="text-slate-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                  title="Voltar para o mapa"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Step 1: Introduction Context */}
              {step === 'intro' && (
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <BookOpen size={14} />
                    <span className="text-[9px] font-retro uppercase tracking-widest">NARRATIVA / CONTEXTO</span>
                  </div>
                  <p className="font-sans text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-4 border border-slate-800/50 rounded-xl shadow-inner max-h-[220px] overflow-y-auto">
                    {data.description}
                  </p>
                  <button 
                    onClick={handleNextStep} 
                    className="retro-btn primary justify-center self-end shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  >
                    AVANÇAR
                  </button>
                </div>
              )}

              {/* Step 2: Dialogues and Testimony */}
              {step === 'dialogue' && (
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <MessageSquare size={14} />
                    <span className="text-[9px] font-retro uppercase tracking-widest">FALAS E DEPOIMENTOS</span>
                  </div>
                  
                  <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
                    {data.dialogues.map((line, idx) => {
                      const { speaker, text } = parseDialogue(line);
                      return (
                        <div 
                          key={idx} 
                          className="bg-slate-950/60 p-3 border-l-4 border-cyan-500 rounded-r-xl font-sans text-xs text-slate-200 shadow-sm flex flex-col gap-1"
                        >
                          <strong className="text-[9px] text-cyan-400 font-retro uppercase tracking-wider">
                            {speaker}
                          </strong>
                          <p className="italic text-slate-300">"{text}"</p>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={handleNextStep} 
                    className="retro-btn primary justify-center self-end shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  >
                    IR PARA O CASO CLÍNICO
                  </button>
                </div>
              )}

              {/* Step 3: Clinical Question / Choices */}
              {step === 'question' && (
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <HelpCircle size={14} />
                    <span className="text-[9px] font-retro uppercase tracking-widest">QUESTÃO CLÍNICA</span>
                  </div>

                  <p className="font-sans text-xs text-slate-100 font-semibold leading-relaxed bg-slate-950/60 p-4 border border-slate-800/50 rounded-xl shadow-inner max-h-[120px] overflow-y-auto">
                    {data.question.text}
                  </p>

                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {data.question.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className="text-left font-sans text-xs p-3 bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500 hover:bg-slate-950 rounded-xl text-slate-200 transition-all flex items-start gap-3 cursor-pointer outline-none"
                      >
                        <span className="font-retro text-[8px] px-1.5 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-500/20 select-none">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 leading-normal">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Question Response Feedback */}
              {step === 'feedback' && (
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-2 border-b border-slate-800/50 pb-2 mb-1">
                    {isCorrect ? (
                      <>
                        <Award size={16} className="text-emerald-400 animate-bounce" />
                        <span className="text-[9px] font-retro text-emerald-400 uppercase tracking-widest">RESPOSTA CORRETA</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-rose-400 animate-pulse" />
                        <span className="text-[9px] font-retro text-rose-400 uppercase tracking-widest">RESPOSTA INCORRETA</span>
                      </>
                    )}
                  </div>

                  {/* Selected Answer Box */}
                  <div className="bg-slate-950/60 p-3 border border-slate-800/50 rounded-xl font-sans text-xs text-slate-300 shadow-inner">
                    <p className="text-slate-500 font-semibold text-[8px] uppercase tracking-wider mb-1">Sua resposta:</p>
                    <p className="font-semibold text-slate-200">
                      {selectedOption !== null && data.question.options[selectedOption]}
                    </p>
                  </div>

                  {/* Feedback message box */}
                  <div className={`p-3 rounded-xl border font-sans text-xs leading-relaxed max-h-[120px] overflow-y-auto ${
                    isCorrect 
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200' 
                      : 'bg-rose-950/20 border-rose-500/20 text-rose-200'
                  }`}>
                    <p>{isCorrect ? data.question.feedbackSuccess : data.question.feedbackError}</p>
                  </div>

                  <div className="flex gap-4 justify-end mt-1">
                    {isCorrect ? (
                      <button 
                        onClick={handleComplete}
                        className="retro-btn primary shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                      >
                        CONCLUIR (+10 XP)
                      </button>
                    ) : (
                      <button 
                        onClick={handleRetry}
                        className="retro-btn flex items-center gap-2"
                      >
                        <RefreshCw size={12} /> TENTAR NOVAMENTE
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div className="flex justify-center mt-4">
        <div className="nav-pill-container">
          <button 
            onClick={resetGame}
            className="nav-pill-button"
            title="Ir para a tela inicial"
          >
            <Home size={14} /> Home
          </button>
          <button 
            onClick={exitScenario}
            className="nav-pill-button"
            title="Voltar para o mapa"
          >
            <Map size={14} /> Mapa
          </button>
        </div>
      </div>
    </div>
  );
};
