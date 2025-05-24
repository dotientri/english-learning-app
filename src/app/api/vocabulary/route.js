// app/api/vocabulary/route.js
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'vocabulary.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API Vocabulary Error]:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to load vocabulary data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}