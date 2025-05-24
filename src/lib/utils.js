// src/lib/utils.js
const WORDS_PER_CHAPTER = 100;

// Hàm để lấy các từ vựng cho một chương cụ thể từ dữ liệu đã được truyền vào
export function getChapterWords(vocabulary, chapterId) {
  const chapterNumber = parseInt(chapterId);
  if (isNaN(chapterNumber)) {
    console.error(`Invalid chapterId: ${chapterId}`);
    return [];
  }

  const startNo = (chapterNumber - 1) * WORDS_PER_CHAPTER + 1;
  const endNo = chapterNumber * WORDS_PER_CHAPTER;

  return vocabulary.filter(word => {
    return typeof word.no === 'number' && word.no >= startNo && word.no <= endNo;
  });
}

// Hàm để lấy một từ ngẫu nhiên từ một danh sách các từ
export function getRandomWord(words) {
  if (!words || words.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

// Hàm để lấy tổng số chương (dựa trên dữ liệu từ API)
export async function getTotalChapters(vocabulary) {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    console.warn('No vocabulary data or invalid format received for chapters.');
    return 0;
  }
  const uniqueChapterIds = Array.from(
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
  return uniqueChapterIds.length;
}

// Hàm để lấy tất cả các ID chương duy nhất và hợp lệ
export async function getAllChapterIds(vocabulary) {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    console.warn('No vocabulary data or invalid format received for chapters.');
    return [];
  }

  const uniqueChapterIds = Array.from(
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

  uniqueChapterIds.sort((a, b) => a - b);
  return uniqueChapterIds.map(id => id.toString());
}