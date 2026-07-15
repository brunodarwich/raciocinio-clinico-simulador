import React from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowRight } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { startNewGame } = useGame();

  return (
    <div className="login-screen-bg-override">
      <div className="login-screen-wrapper">
        {/* Left Side: Login Card */}
        <div className="login-content-side">
          <div className="login-card">
            <div className="login-logo-container">
              <img 
                src="/assets/script_logo_cropped.png" 
                alt="Script Raciocínio Clínico" 
                className="login-logo-img"
              />
            </div>
            
            <div className="welcome-copy">
              <span className="welcome-kicker">Bem-vindo(a)</span>
              <h1>Pronto para iniciar sua simulação clínica?</h1>
              <p>
                Entre no ambiente da UBS, acompanhe o caso e tome decisões para treinar seu raciocínio clínico passo a passo.
              </p>
            </div>
            
            <button 
              onClick={startNewGame}
              className="retro-btn primary justify-center w-full shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-2"
              style={{ padding: '0.9rem 1.8rem', fontSize: '0.9rem', borderRadius: '12px' }}
            >
              <span>Iniciar Simulação</span>
              <ArrowRight size={18} />
            </button>
            
            <div className="login-footer">
              <p>Desenvolvido para UBS da Família • Idealizado por Dra. Lanna Lacerda</p>
            </div>
          </div>
        </div>
        
        {/* Right Side: Mascot */}
        <div className="login-mascot-side">
          <img 
            src="/assets/script_login_mascote_cropped-CMxvxDFt.png" 
            alt="Mascote Lanna" 
            className="login-mascote-img"
          />
        </div>
      </div>
    </div>
  );
};
