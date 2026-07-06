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
    // Cada cenário concluído concede 10 pontos
    completeScenario(currentScenarioId, 10);
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setStep('question');
  };

  return (
    <div className="screen-transition flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full min-h-[500px]">
      <div className="retro-container w-full flex flex-col gap-6">
        
        {/* Cabeçalho do Cenário */}
        <div className="flex justify-between items-center border-b-4 border-white pb-3">
          <h2 className="text-xs text-yellow-400 font-retro">
            {data.title.toUpperCase()}
          </h2>
          <button 
            onClick={exitScenario} 
            className="text-gray-400 hover:text-white transition-colors"
            title="Voltar para o mapa"
          >
            <X size={16} />
          </button>
        </div>

        {/* Passo 1: Narrativa de Introdução */}
        {step === 'intro' && (
          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center gap-2 text-blue-400">
              <BookOpen size={16} />
              <span className="text-[10px] font-retro">NARRATIVA / CONTEXTO</span>
            </div>
            <p className="font-sans text-xs text-gray-200 leading-relaxed bg-[#111] p-4 border border-gray-800 rounded">
              {data.description}
            </p>
            <button onClick={handleNextStep} className="retro-btn primary justify-center self-end">
              AVANÇAR
            </button>
          </div>
        )}

        {/* Passo 2: Diálogos no Território */}
        {step === 'dialogue' && (
          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center gap-2 text-teal-400">
              <MessageSquare size={16} />
              <span className="text-[10px] font-retro font-bold">FALAS E DEPOIMENTOS</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {data.dialogues.map((dialogue, idx) => (
                <div key={idx} className="bg-slate-950 p-4 border-l-4 border-teal-500 font-sans text-xs text-gray-300 italic">
                  {dialogue}
                </div>
              ))}
            </div>

            <button onClick={handleNextStep} className="retro-btn primary justify-center self-end">
              IR PARA O CASO CLÍNICO
            </button>
          </div>
        )}

        {/* Passo 3: Questão / Desafio Clínico */}
        {step === 'question' && (
          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center gap-2 text-yellow-400">
              <HelpCircle size={16} />
              <span className="text-[10px] font-retro">QUESTÃO CLÍNICA</span>
            </div>

            <p className="font-sans text-xs text-gray-200 font-bold leading-relaxed mb-2 bg-[#111] p-4 border border-gray-800 rounded">
              {data.question.text}
            </p>

            <div className="flex flex-col gap-3">
              {data.question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className="text-left font-sans text-xs p-4 bg-slate-900 border-2 border-slate-700 hover:border-yellow-400 hover:bg-slate-800 rounded text-slate-200 transition-colors"
                >
                  <span className="font-retro text-[9px] mr-2 text-yellow-500">[{String.fromCharCode(65 + idx)}]</span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Passo 4: Feedback da Resposta */}
        {step === 'feedback' && (
          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <Award size={18} className="text-emerald-400 animate-bounce" />
                  <span className="text-[10px] font-retro text-emerald-400">RESPOSTA CORRETA</span>
                </>
              ) : (
                <>
                  <AlertCircle size={18} className="text-red-400 animate-pulse" />
                  <span className="text-[10px] font-retro text-red-400">RESPOSTA INCORRETA</span>
                </>
              )}
            </div>

            {/* Quadro de Resposta Selecionada */}
            <div className="bg-[#111] p-4 border border-gray-800 rounded font-sans text-xs text-gray-300">
              <p className="text-slate-500 mb-1">Sua resposta:</p>
              <p className="font-bold">
                {selectedOption !== null && data.question.options[selectedOption]}
              </p>
            </div>

            {/* Texto de Feedback */}
            <p className="font-sans text-xs leading-relaxed text-gray-200">
              {isCorrect ? data.question.feedbackSuccess : data.question.feedbackError}
            </p>

            <div className="flex gap-4 justify-end mt-4">
              {isCorrect ? (
                <button 
                  onClick={handleComplete}
                  className="retro-btn primary"
                >
                  CONCLUIR (+10 XP)
                </button>
              ) : (
                <button 
                  onClick={handleRetry}
                  className="retro-btn flex items-center gap-1"
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
