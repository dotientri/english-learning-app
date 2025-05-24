// src/app/learn/page.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllChapterIds, getRandomWord, getChapterWords } from '@/lib/utils';

export default function LearnPage() {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [chapterWords, setChapterWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load danh sách chương và dữ liệu vocabulary từ API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/vocabulary', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch vocabulary');
        const vocabulary = await res.json();
        if (!Array.isArray(vocabulary)) {
          console.error('[DEBUG - learn/page.jsx] vocabulary.json is not an array');
          return;
        }
        const chapterIds = await getAllChapterIds(vocabulary);
        setChapters(chapterIds);
        setSelectedChapter(chapterIds[0] || ''); // Chọn chương đầu tiên mặc định nếu có
        const words = getChapterWords(vocabulary, chapterIds[0]);
        setChapterWords(words);
        setRandomWord(getRandomWord(words));
      } catch (error) {
        console.error('[DEBUG - learn/page.jsx] Failed to load data:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Cập nhật từ ngẫu nhiên khi chọn chương
  const handleChapterChange = (e) => {
    const chapterId = e.target.value;
    setSelectedChapter(chapterId);
    async function updateWords() {
      try {
        const res = await fetch('/api/vocabulary', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch vocabulary');
        const vocabulary = await res.json();
        const words = getChapterWords(vocabulary, chapterId);
        setChapterWords(words);
        setRandomWord(getRandomWord(words));
      } catch (error) {
        console.error('[DEBUG - learn/page.jsx] Failed to update words:', error.message);
      }
    }
    updateWords();
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Learn Random Words</h1>
      {chapters.length === 0 ? (
        <p className="text-center text-gray-500">No chapters available.</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <select
            value={selectedChapter}
            onChange={handleChapterChange}
            className="input-field p-2 border rounded-lg w-full max-w-[300px]"
          >
            {chapters.map((chapter) => (
              <option key={chapter} value={chapter}>
                Chapter {chapter}
              </option>
            ))}
          </select>
          {randomWord ? (
            <div className="card p-4 bg-white shadow-md rounded-lg text-center max-w-[300px]">
              <h2 className="text-xl font-bold text-[#667eea] font-montserrat">
                Vietnamese: {randomWord.meaning}
              </h2>
              <p className="text-gray-600 text-sm">English: {randomWord.word}</p>
              <p className="text-gray-600 text-sm">Part: {randomWord.partOfSpeech}</p>
              <p className="text-gray-600 text-sm">Phonetic: {randomWord.phonetic}</p>
            </div>
          ) : (
            <p className="text-center text-gray-500">No words available for this chapter.</p>
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
          href={`/learn/${selectedChapter}`}
          className="btn btn-primary text-white py-2 px-4 rounded-lg text-base font-montserrat hover:shadow-md transition"
        >
          Practice This Chapter
        </Link>
      </div>
    </div>
  );
}