import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { UserCheck } from 'lucide-react';

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
    <div className="screen-transition flex flex-col items-center justify-center min-h-[500px] p-6">
      <div className="retro-container max-w-md w-full flex flex-col gap-6">
        <h2 className="text-sm text-yellow-400 border-b-4 border-yellow-400 pb-2 mb-2">
          DADOS DO PROFISSIONAL
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-gray-300">NOME DO MÉDICO(A):</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..."
              maxLength={25}
              className="bg-black border-4 border-white text-white p-3 font-mono text-xs outline-none focus:border-yellow-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-gray-300">ESPECIALIDADE / PROGRAMA:</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="bg-black border-4 border-white text-white p-3 font-mono text-xs outline-none focus:border-yellow-400"
            >
              <option value="Clínica Médica">Clínica Médica</option>
              <option value="Medicina de Família e Comunidade">Medicina de Família (MFC)</option>
              <option value="Internato Médico">Internato de Medicina</option>
              <option value="Outro">Outros / Estudante</option>
            </select>
          </div>

          <div className="text-gray-400 font-sans text-xs leading-relaxed border-t border-gray-800 pt-4 mt-2">
            <p className="mb-2">
              <strong>Contexto:</strong> Você assumiu a equipe de saúde da família na Unidade Básica de Saúde local.
            </p>
            <p>
              Para iniciar os atendimentos, navegue pela comunidade atendida para compreender a realidade social de seus pacientes e, em seguida, conduza o atendimento clínico dentro da UBS.
            </p>
          </div>

          <button type="submit" className="retro-btn primary justify-center mt-4">
            <UserCheck size={14} className="mr-1" />
            CONFIRMAR
          </button>
        </form>
      </div>
    </div>
  );
};
