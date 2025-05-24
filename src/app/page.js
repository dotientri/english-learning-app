import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#667eea] to-[#764ba2] font-montserrat">
        Welcome to English Mastery
      </h1>
      <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-2xl mx-auto">
        Master English vocabulary with interactive and engaging tools designed for effective learning.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link
          href="/chapters"
          className="btn btn-primary text-white text-center block py-4 rounded-xl text-lg font-montserrat"
        >
          Explore Chapters
        </Link>
        <Link
          href="/learn"
          className="btn btn-secondary text-white text-center block py-4 rounded-xl text-lg font-montserrat"
        >
          Start Learning
        </Link>
        <Link
          href="/review"
          className="btn btn-accent text-white text-center block py-4 rounded-xl text-lg font-montserrat"
        >
          Review Mistakes
        </Link>
      </div>
    </div>
  );
}