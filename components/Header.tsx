
import React from 'react';

interface HeaderProps {
  isTutor: boolean;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ isTutor, onGoHome }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between w-full max-w-5xl px-4 py-3 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 11-2 0V4H6v12a1 1 0 11-2 0V4zm3.293 3.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414L11.414 10l1.293 1.293a1 1 0 01-1.414 1.414L10 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.586 10 7.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl font-bold text-slate-800">Raikar's Questionnaire</h1>
        </div>
        {isTutor && (
          <span className="px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full">
            Tutor Mode
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
