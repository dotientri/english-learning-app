// src/app/review/page.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

export default function ReviewPage() {
  const [incorrectWords, setIncorrectWords] = useState([]);

  useEffect(() => {
    const storedWords = localStorage.getItem('incorrectWords');
    if (storedWords) {
      setIncorrectWords(JSON.parse(storedWords));
    }
  }, []);

  const speak = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Review Incorrect Words</h1>
      {incorrectWords.length === 0 ? (
        <p className="text-center text-gray-500">No incorrect words to review.</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {incorrectWords.map((word) => (
            <div
              key={word.no}
              className="card p-3 bg-white shadow-md rounded-lg flex flex-col h-full max-w-[200px]"
            >
              <h2 className="text-base font-bold text-[#667eea] mb-1 font-montserrat truncate">
                {word.word}
              </h2>
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
                onClick={() => speak(word.word)}
                className="btn btn-primary text-white py-1 px-2 rounded-md text-xs font-montserrat flex items-center gap-1 hover:shadow-md transition mt-auto"
              >
                <FontAwesomeIcon icon={faVolumeUp} className="w-4 h-4" />
                Play
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Link
          href="/chapters"
          className="btn btn-secondary text-white py-2 px-4 rounded-lg text-base font-montserrat hover:shadow-md transition"
        >
          Back to Chapters
        </Link>
      </div>
    </div>
  );
}