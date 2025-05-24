// src/app/chapters/[chapterId]/page.jsx
import WordCard from '@/components/WordCard';
import fs from 'fs/promises';
import path from 'path';

const WORDS_PER_CHAPTER = 100;

// Hàm đọc dữ liệu từ vocabulary.json trực tiếp
async function loadVocabularyData() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'vocabulary.json');
    console.log('[DEBUG - page.jsx] Attempting to read file at path:', filePath);

    await fs.access(filePath, fs.constants.F_OK);
    console.log('[DEBUG - page.jsx] vocabulary.json exists and is accessible.');

    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    if (!Array.isArray(data)) {
      console.error('[DEBUG - page.jsx ERROR] vocabulary.json is not an array');
      return [];
    }
    console.log('[DEBUG - page.jsx] Successfully loaded vocabulary. Number of entries:', data.length);
    return data;
  } catch (error) {
    console.error('[DEBUG - page.jsx ERROR]: Failed to load or parse vocabulary.json:', error.message);
    return [];
  }
}

export async function generateStaticParams() {
  console.log('[DEBUG - generateStaticParams] Starting to generate static params...');
  const vocabulary = await loadVocabularyData();

  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    console.warn('[DEBUG - generateStaticParams] No vocabulary data available for static params generation. Returning empty array.');
    return [];
  }

  const uniqueChapterNumbers = Array.from(
    new Set(
      vocabulary
        .map(word => {
          if (typeof word.no !== 'number' || isNaN(word.no) || word.no <= 0) {
            return null;
          }
          return Math.ceil(word.no / WORDS_PER_CHAPTER);
        })
        .filter(id => id !== null)
    )
  );

  uniqueChapterNumbers.sort((a, b) => a - b);
  console.log('[DEBUG - generateStaticParams] Generated unique chapter IDs:', uniqueChapterNumbers.map(id => id.toString()));
  return uniqueChapterNumbers.map(chapterNum => ({
    chapterId: chapterNum.toString(),
  }));
}

export default async function ChapterPage({ params }) {
  const { chapterId } = params;

  console.log(`[DEBUG - ChapterPage] Loading words for chapter: ${chapterId}`);
  const vocabulary = await loadVocabularyData();

  const chapterNumber = parseInt(chapterId);
  let wordsInChapter = [];

  if (!isNaN(chapterNumber) && chapterNumber > 0 && Array.isArray(vocabulary)) {
    const startNo = (chapterNumber - 1) * WORDS_PER_CHAPTER + 1;
    const endNo = chapterNumber * WORDS_PER_CHAPTER;

    wordsInChapter = vocabulary.filter(word => {
      return typeof word.no === 'number' && word.no >= startNo && word.no <= endNo;
    });
  } else {
    console.error(`[DEBUG - ChapterPage] Invalid chapterId or vocabulary data: chapterId=${chapterId}, vocabulary is array=${Array.isArray(vocabulary)}`);
  }

  console.log(`[DEBUG - ChapterPage] Number of words in chapter ${chapterId}:`, wordsInChapter.length);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Chapter {chapterId}</h1>
      {wordsInChapter.length === 0 ? (
        <p className="text-center text-gray-500">No words found for this chapter.</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {wordsInChapter.map((word) => (
            <WordCard key={word.no} word={word} />
          ))}
        </div>
      )}
    </div>
  );
}