import React, { useState, useCallback, useMemo } from 'react';
import type { Question } from '../types';
import { useTest } from '../hooks/useTest';
import { parseExcel } from '../utils/parser';
import { generateQuestions } from '../services/geminiService';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface TutorDashboardProps {
  onResetTest: () => void;
}

const TutorDashboard: React.FC<TutorDashboardProps> = ({ onResetTest }) => {
  const { testConfig, saveTestConfig } = useTest();
  const [questions, setQuestions] = useState<Question[]>(testConfig?.questions || []);
  const [timeLimit, setTimeLimit] = useState(testConfig?.timeLimit || 30);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [aiTopic, setAiTopic] = useState('General Knowledge');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatusMessage('Parsing Excel file...');
    setError('');
    try {
      const data = await file.arrayBuffer();
      const parsedQuestions = parseExcel(data);
      setQuestions(parsedQuestions);
      setStatusMessage(`${parsedQuestions.length} questions loaded successfully from ${file.name}.`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to parse Excel file.');
      setStatusMessage('');
    }
  };
  
  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setError('');
    setStatusMessage(`Generating ${aiNumQuestions} questions about "${aiTopic}"...`);
    try {
      const generated = await generateQuestions(aiTopic, aiNumQuestions);
      setQuestions(generated);
      setStatusMessage(`${generated.length} questions generated successfully!`);
    } catch(err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate questions with AI.');
      setStatusMessage('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTest = () => {
    if (questions.length === 0) {
      setError('Please load or generate questions before saving.');
      return;
    }
    if (timeLimit <= 0) {
      setError('Time limit must be greater than zero.');
      return;
    }
    saveTestConfig({ questions, timeLimit });
    setError('');
    setStatusMessage('Test configuration saved and is now live for students!');
  };
  
  const isTestLive = useMemo(() => {
     return !!testConfig;
  }, [testConfig]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Tutor Dashboard</h2>
        <p className="mt-2 text-lg text-slate-600">Create and manage your questionnaire.</p>
      </div>

      {isTestLive && (
        <div className="p-4 text-center bg-green-100 border-l-4 border-green-500 rounded-r-lg">
          <p className="font-semibold text-green-800">A test is currently live. Saving a new configuration will overwrite it.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Excel Upload Section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-700">
            <UploadIcon />
            Option 1: Upload from Excel
          </h3>
          <p className="mt-2 text-sm text-slate-500">Upload an Excel file (.xlsx, .xls) with columns: `Q#`, `Question Text`, `Option A`, `Option B`, `Option C`, `Option D`, `Correct Answer` (A-D).</p>
          <div className="mt-4">
            <label className="block w-full px-4 py-6 text-center border-2 border-dashed rounded-lg cursor-pointer border-slate-300 hover:border-indigo-500 hover:bg-indigo-50">
              <span className="block text-sm font-semibold text-slate-600">Click to upload an .xlsx or .xls file</span>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* AI Generation Section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-700">
            <SparklesIcon />
            Option 2: Generate with AI
          </h3>
          <p className="mt-2 text-sm text-slate-500">Let AI create questions for you on any topic.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-slate-700">Topic</label>
              <input type="text" id="topic" value={aiTopic} onChange={e => setAiTopic(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="num-questions" className="block text-sm font-medium text-slate-700">Number of Questions</label>
              <input type="number" id="num-questions" min="1" max="20" value={aiNumQuestions} onChange={e => setAiNumQuestions(parseInt(e.target.value))} className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm border-slate-300 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="w-full inline-flex justify-center items-center px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isGenerating ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Test Configuration */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-slate-700">Test Configuration</h3>
        <div className="mt-4">
          <label htmlFor="time-limit" className="block text-sm font-medium text-slate-700">Time Limit (minutes)</label>
          <input
            id="time-limit"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
            className="w-full max-w-xs px-3 py-2 mt-1 border rounded-md shadow-sm border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
            min="1"
          />
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700">Questions Loaded: {questions.length}</p>
          {questions.length > 0 && (
            <div className="h-40 p-2 mt-2 overflow-y-auto border rounded-md bg-slate-50 border-slate-200">
              <ul className="text-sm list-decimal list-inside text-slate-600">
                {questions.map((q, i) => <li key={i} className="truncate">{q.question}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Status and Actions */}
      <div className="p-4 space-y-4 text-center">
        {statusMessage && <p className="text-green-700">{statusMessage}</p>}
        {error && <p className="text-red-700">{error}</p>}

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={handleSaveTest}
            className="w-full px-8 py-3 font-bold text-white bg-green-600 rounded-lg shadow-md sm:w-auto hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save & Activate Test
          </button>
           <button
            onClick={onResetTest}
            className="w-full px-8 py-3 font-bold text-white bg-red-600 rounded-lg shadow-md sm:w-auto hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Reset Live Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;