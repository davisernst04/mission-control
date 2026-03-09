import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MEMORY_DIR = process.env.MEMORY_DIR || '/home/davis/.openclaw/workspace/memory';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  // Check if memory directory exists
  let dirExists = false;
  try {
    await fs.access(MEMORY_DIR);
    dirExists = true;
  } catch {
    dirExists = false;
  }
  
  // If directory doesn't exist, return empty data gracefully
  if (!dirExists) {
    return NextResponse.json([]);
  }
  
  try {
    switch (action) {
      case 'daily': {
        const files = await fs.readdir(MEMORY_DIR);
        const dailyFiles = files
          .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
          .sort()
          .reverse()
          .slice(0, 7);
        
        const memories = await Promise.all(
          dailyFiles.map(async (file) => {
            const date = file.replace('.md', '');
            const content = await fs.readFile(path.join(MEMORY_DIR, file), 'utf-8');
            return { date, content };
          })
        );
        
        return NextResponse.json(memories);
      }
      
      case 'longterm': {
        try {
          const content = await fs.readFile(path.join(MEMORY_DIR, 'MEMORY.md'), 'utf-8');
          return NextResponse.json({ content });
        } catch {
          return NextResponse.json({ content: null });
        }
      }
      
      case 'search': {
        const query = searchParams.get('query') || '';
        const files = await fs.readdir(MEMORY_DIR);
        const results: { file: string; matches: string[] }[] = [];
        
        // Search daily memories
        for (const file of files) {
          if (!file.endsWith('.md')) continue;
          const content = await fs.readFile(path.join(MEMORY_DIR, file), 'utf-8');
          const lines = content.split('\n').filter(line => 
            line.toLowerCase().includes(query.toLowerCase())
          );
          if (lines.length > 0) {
            results.push({ file, matches: lines });
          }
        }
        
        return NextResponse.json(results);
      }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Memory API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}