import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SCENARIO_DATA } from './ScenarioData';
import { BookOpen, MessageSquare, HelpCircle, Award, AlertCircle, RefreshCw, X } from 'lucide-react';

export const ScenarioContainer: React.FC = () => {
  const { currentScenarioId, completeScenario, exitScenario } = useGame();
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
    <div className="screen-transition flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full min-h-[500px]">
      <div className="retro-container w-full flex flex-col gap-5">
        
        {/* Scenario Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-sm text-yellow-400 font-retro uppercase tracking-wider">
            Estágio: {data.title}
          </h2>
          <button 
            onClick={exitScenario} 
            className="text-slate-500 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
            title="Voltar para o mapa"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step 1: Introduction Context */}
        {step === 'intro' && (
          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center gap-2 text-cyan-400">
              <BookOpen size={16} />
              <span className="text-[10px] font-retro uppercase tracking-widest">NARRATIVA / CONTEXTO</span>
            </div>
            <p className="font-sans text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-5 border border-slate-900 rounded-xl shadow-inner">
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
          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center gap-2 text-cyan-400">
              <MessageSquare size={16} />
              <span className="text-[10px] font-retro uppercase tracking-widest">FALAS E DEPOIMENTOS</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {data.dialogues.map((line, idx) => {
                const { speaker, text } = parseDialogue(line);
                return (
                  <div 
                    key={idx} 
                    className="bg-slate-950/40 p-4 border-l-4 border-cyan-500 rounded-r-xl font-sans text-xs text-slate-300 shadow-sm flex flex-col gap-1"
                  >
                    <strong className="text-[10px] text-cyan-400 font-retro uppercase tracking-wider">
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
          <div className="flex flex-col gap-5 text-left">
            <div className="flex items-center gap-2 text-yellow-400">
              <HelpCircle size={16} />
              <span className="text-[10px] font-retro uppercase tracking-widest">QUESTÃO CLÍNICA</span>
            </div>

            <p className="font-sans text-xs text-slate-200 font-semibold leading-relaxed mb-1 bg-slate-950/40 p-5 border border-slate-900 rounded-xl shadow-inner">
              {data.question.text}
            </p>

            <div className="flex flex-col gap-3">
              {data.question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className="text-left font-sans text-xs p-4 bg-slate-900/50 border border-slate-800 hover:border-cyan-500 hover:bg-slate-950 rounded-xl text-slate-300 transition-all flex items-start gap-3 cursor-pointer outline-none"
                >
                  <span className="font-retro text-[9px] px-1.5 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-500/20 select-none">
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
          <div className="flex flex-col gap-5 text-left">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-1">
              {isCorrect ? (
                <>
                  <Award size={18} className="text-emerald-400 animate-bounce" />
                  <span className="text-[10px] font-retro text-emerald-400 uppercase tracking-widest">RESPOSTA CORRETA</span>
                </>
              ) : (
                <>
                  <AlertCircle size={18} className="text-rose-400 animate-pulse" />
                  <span className="text-[10px] font-retro text-rose-400 uppercase tracking-widest">RESPOSTA INCORRETA</span>
                </>
              )}
            </div>

            {/* Selected Answer Box */}
            <div className="bg-slate-950/50 p-4 border border-slate-900 rounded-xl font-sans text-xs text-slate-300 shadow-inner">
              <p className="text-slate-500 font-semibold text-[9px] uppercase tracking-wider mb-1">Sua resposta:</p>
              <p className="font-semibold text-slate-200">
                {selectedOption !== null && data.question.options[selectedOption]}
              </p>
            </div>

            {/* Feedback message box */}
            <div className={`p-4 rounded-xl border font-sans text-xs leading-relaxed ${
              isCorrect 
                ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-300' 
                : 'bg-rose-950/10 border-rose-500/20 text-rose-300'
            }`}>
              <p>{isCorrect ? data.question.feedbackSuccess : data.question.feedbackError}</p>
            </div>

            <div className="flex gap-4 justify-end mt-2">
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
  );
};
