// src/components/WordCard.jsx
'use client'; // Đây là một Client Component

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

export default function WordCard({ word }) {
  const speak = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this environment.");
    }
  };

  if (!word) {
    return null; // Không render nếu không có từ
  }

  return (
    <div className="card p-3 bg-white shadow-md rounded-lg flex flex-col h-full w-full max-w-[200px]">
      <h2 className="text-base font-bold text-[#667eea] mb-1 font-montserrat truncate">{word.word}</h2>
      <p className="text-gray-600 text-xs mb-1 truncate">
        <span className="text-highlight mr-1">Part:</span> {word.partOfSpeech}
      </p>
      <p className="text-gray-600 text-xs mb-1 truncate">
        <span className="text-highlight mr-1">Phonetic:</span> {word.phonetic}
      </p>
      <p className="text-gray-800 text-xs mb-2 line-clamp-2 flex-1">
        <span className="text-highlight mr-1">Meaning:</span> {word.meaning}
      </p>
      <button
        onClick={speak}
        className="btn btn-primary text-white py-1 px-2 rounded-md text-xs font-montserrat flex items-center gap-1 hover:shadow-md transition mt-auto"
      >
        <FontAwesomeIcon icon={faVolumeUp} className="w-4 h-4" />
        Play
      </button>
    </div>
  );
}