
import React from 'react';
import { Outbreak, QuizQuestion, Language } from './types';

export const MEDICAL_DISCLAIMER = "DISCLAIMER: This chatbot is for educational and awareness purposes only. It is NOT a diagnostic tool and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. In case of an emergency, call your local emergency services or visit the nearest hospital immediately.";

export const MOCK_OUTBREAKS: Outbreak[] = [
  {
    id: '1',
    district: 'Pune',
    state: 'Maharashtra',
    disease: 'Dengue',
    severity: 'High',
    lastUpdated: '2024-05-20',
    precautions: ['Remove stagnant water', 'Use mosquito nets', 'Wear long-sleeved clothes']
  },
  {
    id: '2',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    disease: 'Malaria',
    severity: 'Medium',
    lastUpdated: '2024-05-18',
    precautions: ['Use repellent', 'Sleep under insecticide-treated nets']
  }
];

export const MOCK_HELPLINES = [
  { name: 'National Health Helpline', number: '1800-11-6666' },
  { name: 'COVID-19 Helpline', number: '1075' },
  { name: 'Women Helpline', number: '1091' },
  { name: 'Child Helpline', number: '1098' }
];

export const HYGIENE_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How long should you wash your hands with soap to effectively kill germs?',
    options: ['5 seconds', '10 seconds', '20 seconds', '60 seconds'],
    correctAnswer: 2,
    explanation: 'Washing your hands for at least 20 seconds is recommended by health organizations to remove most germs.'
  },
  {
    id: 'q2',
    question: 'Which of the following diseases is spread by stagnant water?',
    options: ['Common Cold', 'Dengue', 'Diabetes', 'Arthritis'],
    correctAnswer: 1,
    explanation: 'Dengue-carrying mosquitoes (Aedes) breed in clean, stagnant water around homes.'
  }
];

export const LANGUAGE_OPTIONS = [
  { value: Language.ENGLISH, label: 'English' },
  { value: Language.HINDI, label: 'हिन्दी (Hindi)' },
  { value: Language.MARATHI, label: 'मराठी (Marathi)' }
];
