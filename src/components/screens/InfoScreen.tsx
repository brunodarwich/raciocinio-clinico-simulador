import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { UserCheck, User, ShieldAlert } from 'lucide-react';

export const InfoScreen: React.FC = () => {
  const { setPlayer, setScreen } = useGame();
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Clínica Médica');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, digite seu nome!');
      return;
    }
    setPlayer({ name, specialty });
    setScreen('tutorial');
  };

  return (
    <div className="login-screen-bg-override">
      <div className="retro-container max-w-md w-full flex flex-col gap-6">
        <h2 className="text-sm text-yellow-400 border-b border-slate-800 pb-3 mb-2 font-retro uppercase">
          Cadastro do Profissional
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          <div className="flex flex-col gap-2">
            <label className="font-sans font-semibold text-xs text-slate-300 flex items-center gap-1.5">
              <User size={12} className="text-cyan-400" />
              NOME COMPLETO DO MÉDICO(A):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome profissional..."
              maxLength={25}
              className="w-full bg-slate-950/40 border border-slate-800 text-white rounded-lg p-3 outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans font-semibold text-xs text-slate-300 flex items-center gap-1.5">
              <ShieldAlert size={12} className="text-cyan-400" />
              ESPECIALIDADE / PROGRAMA:
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-800 text-white rounded-lg p-3 outline-none focus:border-cyan-500 font-sans cursor-pointer"
            >
              <option value="Clínica Médica">Clínica Médica</option>
              <option value="Medicina de Família e Comunidade">Medicina de Família (MFC)</option>
              <option value="Internato Médico">Internato de Medicina</option>
              <option value="Outro">Outros / Estudante</option>
            </select>
          </div>

          <div className="text-slate-400 font-sans text-xs leading-relaxed border-t border-slate-800/80 pt-4 mt-2 bg-slate-950/20 p-3 rounded-lg border border-slate-900">
            <p className="mb-2 text-slate-300">
              <strong>Contexto Clínico:</strong> Você assumiu o plantão de saúde da família na Unidade Básica de Saúde (UBS) local.
            </p>
            <p className="text-[11px] text-slate-400">
              Antes de iniciar o atendimento clínico de consultório, explore a comunidade para compreender a realidade social, o saneamento básico e os fatores ambientais dos seus pacientes.
            </p>
          </div>

          <button 
            type="submit" 
            className="retro-btn primary justify-center mt-3 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
          >
            <UserCheck size={14} className="mr-1" />
            CONFIRMAR CADASTRO
          </button>
        </form>
      </div>
    </div>
  );
};
