
import React, { useState } from 'react';
import { TUTOR_SECRET_CODE } from '../constants';

interface TutorLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

const TutorLogin: React.FC<TutorLoginProps> = ({ onSuccess, onBack }) => {
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode === TUTOR_SECRET_CODE) {
      onSuccess();
    } else {
      setError('Invalid secret code. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">Tutor Access</h2>
          <p className="mt-2 text-slate-600">Please enter the secret code to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="secret-code" className="sr-only">Secret Code</label>
            <input
              id="secret-code"
              type="password"
              value={secretCode}
              onChange={(e) => {
                setSecretCode(e.target.value);
                setError('');
              }}
              placeholder="Enter secret code"
              className="w-full px-4 py-3 text-lg border-2 border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-col gap-4 sm:flex-row-reverse">
            <button
              type="submit"
              className="w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full px-6 py-3 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorLogin;
