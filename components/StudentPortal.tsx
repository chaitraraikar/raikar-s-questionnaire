
import React from 'react';
import { useTest } from '../hooks/useTest';

interface StudentPortalProps {
  onStartTest: () => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ onStartTest }) => {
  const { testConfig } = useTest();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-xl">
        {testConfig && testConfig.questions.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold text-slate-800">The Test is Ready!</h2>
            <p className="mt-4 text-lg text-slate-600">
              You will have <span className="font-bold text-indigo-600">{testConfig.timeLimit} minutes</span> to answer{' '}
              <span className="font-bold text-indigo-600">{testConfig.questions.length} questions</span>.
            </p>
            <p className="mt-2 text-slate-600">Please make sure you are in a quiet environment before you begin. The timer will start as soon as you click the button.</p>
            <div className="mt-8">
              <button
                onClick={onStartTest}
                className="px-10 py-4 text-xl font-bold text-white transition-transform transform bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Start Test
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-slate-800">Please Wait</h2>
            <p className="mt-4 text-lg text-slate-600">
              The test has not been set up by the tutor yet. Please check back later.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
