
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Answer } from '../types';
import { useTest } from '../hooks/useTest';
import { ClockIcon } from './icons/ClockIcon';

interface TestScreenProps {
  onSubmit: (answers: Answer[]) => void;
}

const TestScreen: React.FC<TestScreenProps> = ({ onSubmit }) => {
  const { testConfig } = useTest();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (testConfig) {
      setAnswers(Array(testConfig.questions.length).fill(null));
      setTimeLeft(testConfig.timeLimit * 60);
    }
  }, [testConfig]);

  const handleSubmit = useCallback(() => {
    if (window.confirm("Are you sure you want to submit?")) {
      onSubmit(answers);
    }
  }, [onSubmit, answers]);

  useEffect(() => {
    if (timeLeft <= 0 && testConfig) {
        alert("Time's up! Your test will be submitted automatically.");
        onSubmit(answers);
        return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, testConfig, onSubmit, answers]);

  const currentQuestion = useMemo(() => {
    return testConfig?.questions[currentQuestionIndex];
  }, [testConfig, currentQuestionIndex]);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const goToNext = () => {
    if (testConfig && currentQuestionIndex < testConfig.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!testConfig || !currentQuestion) {
    return <div>Loading test...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b">
          <h2 className="text-xl font-bold text-slate-700">Question {currentQuestionIndex + 1} of {testConfig.questions.length}</h2>
          <div className={`flex items-center gap-2 px-3 py-1 font-bold rounded-full ${timeLeft < 60 ? 'text-red-800 bg-red-100' : 'text-indigo-800 bg-indigo-100'}`}>
            <ClockIcon/>
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="py-4">
          <p className="mb-6 text-xl font-semibold text-slate-800">{currentQuestion.question}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  answers[currentQuestionIndex] === index
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-300 hover:border-indigo-400'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  checked={answers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(index)}
                  className="w-5 h-5 text-indigo-600 form-radio focus:ring-indigo-500"
                />
                <span className="ml-4 text-lg text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-6 mt-6 border-t">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentQuestionIndex === testConfig.questions.length - 1 ? (
             <button
              onClick={handleSubmit}
              className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={goToNext}
              className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestScreen;
