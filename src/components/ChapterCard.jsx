import Link from 'next/link';
import { getAllChapterIds } from '@/lib/utils'; // Import hàm mới

// Component ChapterCard để hiển thị mỗi chương
function ChapterCard({ chapterId }) {
  return (
    <Link href={`/chapter/${chapterId}`} className="block">
      <div className="card p-4 bg-white shadow-md rounded-lg text-center transform transition-transform hover:scale-105 h-full w-full max-w-[200px] flex items-center justify-center">
        <h2 className="text-xl font-bold text-[#667eea] font-montserrat">
          Chapter {chapterId}
        </h2>
      </div>
    </Link>
  );
}

export default async function ChaptersPage() {
  const chapterIds = await getAllChapterIds(); // Lấy tất cả Chapter ID
  chapterIds.sort((a, b) => a - b); // Sắp xếp theo thứ tự tăng dần

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#667eea] font-montserrat text-center">
        All Chapters
      </h1>
      
      {chapterIds.length === 0 ? (
        <p className="text-center text-gray-600">No chapters available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
          {chapterIds.map((id) => (
            <ChapterCard key={id} chapterId={id} />
          ))}
        </div>
      )}
    </div>
  );
}