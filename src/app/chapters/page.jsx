// src/app/chapters/page.jsx
import Link from "next/link";
import { getAllChapterIds } from "@/lib/utils";
import fs from 'fs/promises';
import path from 'path';

// ChapterCard là một component nhỏ để hiển thị mỗi chương
function ChapterCard({ chapterId }) {
  return (
    <Link href={`/chapters/${chapterId}`} className="block">
      <div className="card p-4 bg-white shadow-md rounded-lg text-center transform transition-transform hover:scale-105 h-full w-full max-w-[200px] flex items-center justify-center">
        <h2 className="text-xl font-bold text-[#667eea] font-montserrat">
          Chapter {chapterId}
        </h2>
      </div>
    </Link>
  );
}

// Hàm load dữ liệu vocabulary
async function loadVocabularyData() {
  const filePath = path.join(process.cwd(), 'public', 'vocabulary.json');
  try {
    await fs.access(filePath, fs.constants.F_OK);
    console.log('[DEBUG - chapters/page.jsx] vocabulary.json exists and is accessible.');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    if (!Array.isArray(data)) {
      console.error('[DEBUG - chapters/page.jsx] vocabulary.json is not an array');
      return [];
    }
    console.log('[DEBUG - chapters/page.jsx] Successfully loaded vocabulary. Number of entries:', data.length);
    return data;
  } catch (error) {
    console.error('[DEBUG - chapters/page.jsx] Failed to load vocabulary.json:', error.message);
    return [];
  }
}

// Đây là Server Component chính cho trang Chapters
export default async function ChaptersPage() {
  const vocabulary = await loadVocabularyData();
  const chapterIds = await getAllChapterIds(vocabulary);
  chapterIds.sort((a, b) => a - b);
  console.log('[DEBUG - ChaptersPage] Chapter IDs:', chapterIds);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#667eea] font-montserrat text-center">
        All Chapters
      </h1>
      {chapterIds.length === 0 ? (
        <p className="text-center text-gray-600">No chapters available. Check console for errors.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          {chapterIds.map((id) => (
            <ChapterCard key={id} chapterId={id} />
          ))}
        </div>
      )}
    </div>
  );
}