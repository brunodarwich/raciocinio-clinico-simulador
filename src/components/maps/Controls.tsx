import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ControlsProps {
  onMove: (dx: number, dy: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ onMove }) => {
  return (
    <div className="dpad-container mt-4 select-none">
      <button
        onClick={() => onMove(0, -1)}
        className="dpad-btn outline-none"
        style={{ gridArea: 'up' }}
        title="Mover para Cima"
      >
        <ArrowUp size={18} />
      </button>

      <button
        onClick={() => onMove(-1, 0)}
        className="dpad-btn outline-none"
        style={{ gridArea: 'left' }}
        title="Mover para Esquerda"
      >
        <ArrowLeft size={18} />
      </button>

      <button
        onClick={() => onMove(1, 0)}
        className="dpad-btn outline-none"
        style={{ gridArea: 'right' }}
        title="Mover para Direita"
      >
        <ArrowRight size={18} />
      </button>

      <button
        onClick={() => onMove(0, 1)}
        className="dpad-btn outline-none"
        style={{ gridArea: 'down' }}
        title="Mover para Baixo"
      >
        <ArrowDown size={18} />
      </button>
    </div>
  );
};
