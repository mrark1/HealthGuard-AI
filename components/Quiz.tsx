
import React, { useState } from 'react';
import { HYGIENE_QUIZ } from '../constants';

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    if (selectedOption === HYGIENE_QUIZ[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < HYGIENE_QUIZ.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
        <p className="text-slate-600 mb-6">
          You scored <span className="text-emerald-600 font-bold">{score}</span> out of <span className="font-bold">{HYGIENE_QUIZ.length}</span>
        </p>
        <div className="bg-slate-50 p-6 rounded-xl mb-8">
          <h3 className="font-bold text-slate-700 mb-2">Health Tip of the Day</h3>
          <p className="text-sm text-slate-600 italic">"Good health is not something we can buy. However, it can be an extremely valuable savings account."</p>
        </div>
        <button 
          onClick={() => {
            setCurrentQuestion(0);
            setScore(0);
            setIsFinished(false);
            setSelectedOption(null);
            setShowResult(false);
          }}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const question = HYGIENE_QUIZ[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-emerald-600 p-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium uppercase tracking-wider opacity-80">Health Awareness Quiz</span>
          <span className="bg-emerald-700 px-3 py-1 rounded-full text-xs">Question {currentQuestion + 1} / {HYGIENE_QUIZ.length}</span>
        </div>
        <h2 className="text-xl font-bold">{question.question}</h2>
      </div>

      <div className="p-8">
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                showResult
                  ? index === question.correctAnswer
                    ? 'border-emerald-500 bg-emerald-50'
                    : selectedOption === index
                      ? 'border-red-400 bg-red-50'
                      : 'border-slate-100 opacity-50'
                  : selectedOption === index
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium text-slate-700">{option}</span>
              {showResult && index === question.correctAnswer && <span className="text-emerald-500">✅</span>}
              {showResult && selectedOption === index && index !== question.correctAnswer && <span className="text-red-500">❌</span>}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-8 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r">
            <h4 className="font-bold text-emerald-800 mb-1">Explanation</h4>
            <p className="text-sm text-emerald-700">{question.explanation}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!showResult ? (
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
            >
              {currentQuestion === HYGIENE_QUIZ.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
