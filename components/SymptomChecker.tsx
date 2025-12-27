
import React, { useState } from 'react';
import { checkSymptom } from '../services/geminiService';

const COMMON_SYMPTOMS = [
  'Fever', 'Dry Cough', 'Headache', 'Muscle Ache', 'Fatigue', 
  'Sore Throat', 'Diarrhea', 'Loss of Taste/Smell', 'Skin Rash', 
  'Shortness of Breath', 'Nausea', 'Chills'
];

const SymptomChecker: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return;
    setIsLoading(true);
    const result = await checkSymptom(selectedSymptoms.join(', '));
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Smart Symptom Analysis</h2>
        <p className="text-slate-500">Select your symptoms for an AI-powered health assessment report.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Selector Panel */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center">
            <span className="mr-2">👆</span> Select Symptoms
          </h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {COMMON_SYMPTOMS.map(s => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  selectedSymptoms.includes(s)
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={selectedSymptoms.length === 0 || isLoading}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Symptoms...</span>
              </>
            ) : (
              <>
                <span>Run Smart Diagnosis</span>
                <span>🤖</span>
              </>
            )}
          </button>
          
          <p className="mt-4 text-[10px] text-slate-400 text-center italic">
            Note: This tool uses Gemini 3 Pro reasoning. Data is processed privately.
          </p>
        </div>

        {/* Results Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[400px]">
          <div className="bg-slate-50 p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-700">Analysis Report</h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {analysis ? (
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <h4 className="text-xs font-bold text-amber-800 uppercase mb-2">Summary</h4>
                  <p className="text-sm text-amber-900 leading-relaxed">{analysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Potential Conditions</h4>
                    <ul className="space-y-2">
                      {analysis.possibleConditions.map((c: string, i: number) => (
                        <li key={i} className="flex items-center text-sm font-medium text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <h4 className="text-xs font-bold text-red-800 uppercase mb-3">Emergency Signs</h4>
                    <ul className="space-y-2">
                      {analysis.emergencySigns.map((s: string, i: number) => (
                        <li key={i} className="text-xs text-red-700 flex items-start">
                          <span className="mr-2">⚠️</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={() => setAnalysis(null)}
                  className="w-full py-3 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  Clear Results
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-300">
                <div className="text-6xl mb-4">🩺</div>
                <p className="text-sm font-medium">Select symptoms on the left to start analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
