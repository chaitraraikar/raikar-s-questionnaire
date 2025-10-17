
import React, { useMemo } from 'react';
import type { Answer } from '../types';
import { useTest } from '../hooks/useTest';

interface ResultsScreenProps {
  studentAnswers: Answer[];
  onGoHome: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ studentAnswers, onGoHome }) => {
  const { testConfig } = useTest();

  const score = useMemo(() => {
    if (!testConfig) return 0;
    return studentAnswers.reduce((correctCount, answer, index) => {
      if (answer === testConfig.questions[index].correctAnswerIndex) {
        return correctCount + 1;
      }
      return correctCount;
    }, 0);
  }, [studentAnswers, testConfig]);
  
  const scorePercentage = useMemo(() => {
      if(!testConfig || testConfig.questions.length === 0) return 0;
      return Math.round((score / testConfig.questions.length) * 100);
  }, [score, testConfig]);

  if (!testConfig) {
    return (
      <div className="text-center">
        <p>Could not load test results. Please try again.</p>
        <button onClick={onGoHome} className="mt-4 px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800">Test Results</h2>
          <p className="mt-4 text-6xl font-bold text-indigo-600">
            {score} <span className="text-4xl text-slate-500">/ {testConfig.questions.length}</span>
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-600">({scorePercentage}%)</p>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-center text-slate-700">Answer Review</h3>
          {testConfig.questions.map((q, index) => {
            const studentAnswer = studentAnswers[index];
            const isCorrect = studentAnswer === q.correctAnswerIndex;
            return (
              <div key={index} className={`p-4 border-l-4 rounded-r-lg ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                <p className="font-bold text-slate-800">{index + 1}. {q.question}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Correct Answer: <span className="font-semibold">{q.options[q.correctAnswerIndex]}</span>
                </p>
                <p className={`mt-1 text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  Your Answer: <span className="font-semibold">{studentAnswer !== null ? q.options[studentAnswer] : 'Not Answered'}</span>
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-6 text-center border-t">
          <button
            onClick={onGoHome}
            className="px-8 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
