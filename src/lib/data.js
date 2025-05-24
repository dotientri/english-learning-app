// src/lib/data.js
import fs from 'fs/promises';
import path from 'path';

const WORDS_PER_CHAPTER = 100;

// Hàm đọc dữ liệu từ vocabulary.json trực tiếp (chỉ chạy server-side)
async function loadVocabularyData() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'vocabulary.json');
        console.log('[loadVocabularyData] Attempting to read file at path:', filePath);

        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        console.log('[loadVocabularyData] Successfully loaded vocabulary. Number of entries:', data.length);
        return data;
    } catch (error) {
        console.error('[loadVocabularyData ERROR]: Failed to load or parse vocabulary.json:', error.message);
        return [];
    }
}

// Hàm lấy các từ vựng cho một chương cụ thể
export async function getChapterWords(chapterId) {
    const vocabulary = await loadVocabularyData(); // Tải dữ liệu ở đây
    const chapterNumber = parseInt(chapterId);

    if (isNaN(chapterNumber) || chapterNumber <= 0) {
        console.error(`[getChapterWords] Invalid chapterId: ${chapterId}`);
        return [];
    }

    const startNo = (chapterNumber - 1) * WORDS_PER_CHAPTER + 1;
    const endNo = chapterNumber * WORDS_PER_CHAPTER;

    const words = vocabulary.filter(word => {
        return typeof word.no === 'number' && word.no >= startNo && word.no <= endNo;
    });

    console.log(`[getChapterWords] Chapter ${chapterId} has ${words.length} words.`);
    return words;
}

// Hàm lấy tất cả các ID chương duy nhất (dùng cho generateStaticParams)
export async function getAllChapterIds() {
    const vocabulary = await loadVocabularyData(); // Tải dữ liệu ở đây
    if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
        console.warn('[getAllChapterIds] No vocabulary data or invalid format received for chapters.');
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
    console.log('[getAllChapterIds] Generated unique chapter IDs:', uniqueChapterNumbers.map(id => id.toString()));
    return uniqueChapterNumbers.map(id => id.toString());
}

// Các hàm khác nếu cần, ví dụ getRandomWord
export function getRandomWord(words) {
  if (!words || words.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}