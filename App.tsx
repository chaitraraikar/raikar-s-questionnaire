
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import TutorLogin from './components/TutorLogin';
import TutorDashboard from './components/TutorDashboard';
import StudentPortal from './components/StudentPortal';
import TestScreen from './components/TestScreen';
import ResultsScreen from './components/ResultsScreen';
import { useTest } from './hooks/useTest';
import type { Answer } from './types';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Home);
  const [isTutor, setIsTutor] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<Answer[]>([]);
  const { testConfig, clearTestConfig } = useTest();

  const handleLoginSuccess = useCallback(() => {
    setIsTutor(true);
    setAppState(AppState.TutorDashboard);
  }, []);

  const handleStartTest = useCallback(() => {
    if (testConfig && testConfig.questions.length > 0) {
      setStudentAnswers(Array(testConfig.questions.length).fill(null));
      setAppState(AppState.StudentTest);
    }
  }, [testConfig]);

  const handleSubmitTest = useCallback((answers: Answer[]) => {
    setStudentAnswers(answers);
    setAppState(AppState.StudentResults);
  }, []);

  const handleGoHome = useCallback(() => {
    setAppState(AppState.Home);
    setIsTutor(false);
  }, []);
  
  const handleResetTest = useCallback(() => {
    clearTestConfig();
    setAppState(AppState.TutorDashboard);
  },[clearTestConfig]);


  const renderContent = () => {
    switch (appState) {
      case AppState.TutorLogin:
        return <TutorLogin onSuccess={handleLoginSuccess} onBack={handleGoHome} />;
      case AppState.TutorDashboard:
        return isTutor ? <TutorDashboard onResetTest={handleResetTest} /> : <StudentPortal onStartTest={handleStartTest} />;
      case AppState.StudentTest:
        return <TestScreen onSubmit={handleSubmitTest} />;
      case AppState.StudentResults:
        return <ResultsScreen studentAnswers={studentAnswers} onGoHome={handleGoHome} />;
      case AppState.Home:
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8 text-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">Welcome to the Questionnaire</h2>
              <p className="text-lg text-slate-600">Please select your role to continue.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setAppState(AppState.TutorLogin)}
                className="w-48 px-8 py-3 font-semibold text-white transition-transform transform bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                I'm a Tutor
              </button>
              <button
                onClick={handleStartTest}
                className={`w-48 px-8 py-3 font-semibold text-white transition-transform transform rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  testConfig ? 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105 focus:ring-emerald-500' : 'bg-slate-400 cursor-not-allowed'
                }`}
                disabled={!testConfig}
              >
                I'm a Student
              </button>
            </div>
            {!testConfig && <p className="mt-4 text-sm text-slate-500">The student portal is disabled until a test is configured by a tutor.</p>}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-slate-800">
      <Header isTutor={isTutor} onGoHome={handleGoHome} />
      <main className="flex-grow w-full max-w-5xl p-4 mx-auto sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      <footer className="py-4 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Raikar's Questionnaire. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
