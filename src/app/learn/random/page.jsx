// src/app/learn/random/page.jsx
'use client';

import { useState, useEffect } from 'react';
import RandomWord from '@/components/RandomWord';
import { getVocabularyData, getRandomWord } from '@/lib/utils'; // Import để lấy từ mới

export default function LearnRandomPage() {
  const [currentWord, setCurrentWord] = useState(null);
  const [allWords, setAllWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initializeWords() {
      setLoading(true);
      setError(null);
      try {
        const vocabulary = await getVocabularyData(); // Fetch toàn bộ từ vựng (qua API)
        setAllWords(vocabulary);
        setCurrentWord(getRandomWord(vocabulary)); // Lấy từ ngẫu nhiên ban đầu
      } catch (err) {
        console.error("Failed to load all words for random learning:", err);
        setError("Failed to load words for random learning. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    initializeWords();
  }, []); // Chỉ chạy một lần khi component mount

  const handleNextWord = () => {
    setCurrentWord(getRandomWord(allWords));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-lg text-gray-600">Loading random words...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl md::text-4xl font-bold mb-6 text-[#667eea] font-montserrat">
          Random Learning
        </h1>
        <p className="text-lg text-gray-600">No words available for random learning.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#667eea] font-montserrat">
        Random Learning
      </h1>
      <p className="text-xl text-gray-700 mb-8">Practice a random word from all chapters:</p>
      <RandomWord word={currentWord} onNextWord={handleNextWord} />
    </div>
  );
}