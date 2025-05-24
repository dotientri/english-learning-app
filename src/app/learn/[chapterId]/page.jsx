// src/app/learn/[chapterId]/page.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getChapterWords, getRandomWord } from '@/lib/utils';

export default function LearnChapterPage({ params }) {
  const { chapterId } = params;
  const [chapterWords, setChapterWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/vocabulary`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch vocabulary');
        const vocabulary = await res.json();
        const words = getChapterWords(vocabulary, chapterId);
        setChapterWords(words);
        setCurrentWord(getRandomWord(words));
      } catch (error) {
        console.error('[DEBUG - learn/[chapterId]/page.jsx] Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [chapterId]);

  // Load danh sách từ sai từ localStorage khi component mount
  useEffect(() => {
    const storedWords = localStorage.getItem('incorrectWords');
    if (storedWords) {
      setIncorrectWords(JSON.parse(storedWords));
    }
  }, []);

  // Lưu danh sách từ sai vào localStorage khi có thay đổi
  useEffect(() => {
    if (incorrectWords.length > 0) {
      localStorage.setItem('incorrectWords', JSON.stringify(incorrectWords));
    }
  }, [incorrectWords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      setFeedback('Correct!');
      setUserInput('');
      setShowAnswer(false);
      setTimeout(() => {
        setFeedback('');
        setCurrentWord(getRandomWord(chapterWords.filter(w => w.no !== currentWord.no)));
      }, 1000);
    } else {
      setFeedback('Incorrect.');
      setShowAnswer(true); // Hiển thị đáp án đúng khi sai
      setIncorrectWords((prev) => {
        if (!prev.some((w) => w.no === currentWord.no)) {
          return [...prev, currentWord];
        }
        return prev;
      });
    }
  };

  const handleRandomNewWord = () => {
    setUserInput('');
    setFeedback('');
    setShowAnswer(false);
    setCurrentWord(getRandomWord(chapterWords.filter(w => w.no !== currentWord.no)));
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Learn Random Words - Chapter {chapterId}
      </h1>
      {chapterWords.length === 0 || !currentWord ? (
        <p className="text-center text-gray-500">No words available for this chapter.</p>
      ) : (
        <div className="flex flex-col items-center">
          <div className="card p-4 bg-white shadow-md rounded-lg text-center max-w-[300px] mb-4">
            <h2 className="text-xl font-bold text-[#667eea] font-montserrat">
              Vietnamese: {currentWord.meaning}
            </h2>
            <p className="text-gray-600 text-sm">Enter the English word.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="input-field p-2 border rounded-lg"
              placeholder="Type the English word"
              disabled={showAnswer} // Vô hiệu hóa input khi hiển thị đáp án
            />
            <button
              type="submit"
              className="btn btn-primary text-white py-2 px-4 rounded-lg font-montserrat"
              disabled={showAnswer} // Vô hiệu hóa nút Submit khi hiển thị đáp án
            >
              Submit
            </button>
          </form>
          {showAnswer && (
            <div className="mt-4 text-center">
              <p className="text-red-500">Correct Answer: {currentWord.word}</p>
              <button
                onClick={handleRandomNewWord}
                className="btn btn-secondary text-white py-1 px-3 rounded-lg mt-2 font-montserrat hover:shadow-md transition"
              >
                Random New Word
              </button>
            </div>
          )}
          {feedback && !showAnswer && (
            <p
              className={`mt-4 text-center ${
                feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {feedback}
            </p>
          )}
        </div>
      )}
      <div className="flex justify-center mt-6 gap-4">
        <Link
          href="/chapters"
          className="btn btn-secondary text-white py-2 px-4 rounded-lg text-base font-montserrat hover:shadow-md transition"
        >
          Back to Chapters
        </Link>
        <Link
          href="/review"
          className="btn btn-accent text-white py-2 px-4 rounded-lg text-base font-montserrat hover:shadow-md transition"
        >
          Review Incorrect Words
        </Link>
      </div>
    </div>
  );
}