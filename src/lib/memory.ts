/**
 * Memory file reading utilities for Mission Control.
 * Reads memory files from the local filesystem.
 */

import { promises as fs } from 'fs';
import path from 'path';

const MEMORY_DIR = '/home/davis/.openclaw/workspace/memory';

export interface DailyMemory {
  date: string;
  content: string;
  path: string;
}

export interface LongTermMemory {
  content: string;
  path: string;
}

/**
 * Get list of all daily memory files (YYYY-MM-DD.md)
 */
export async function getDailyMemoryFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(MEMORY_DIR);
    return files
      .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .sort()
      .reverse(); // Most recent first
  } catch (error) {
    console.error('Error reading memory directory:', error);
    return [];
  }
}

/**
 * Read a specific daily memory file
 */
export async function readDailyMemory(date: string): Promise<DailyMemory | null> {
  try {
    const filePath = path.join(MEMORY_DIR, `${date}.md`);
    const content = await fs.readFile(filePath, 'utf-8');
    return { date, content, path: filePath };
  } catch (error) {
    return null;
  }
}

/**
 * Read multiple daily memories
 */
export async function getDailyMemories(limit: number = 7): Promise<DailyMemory[]> {
  const files = await getDailyMemoryFiles();
  const memories: DailyMemory[] = [];
  
  for (const file of files.slice(0, limit)) {
    const date = file.replace('.md', '');
    const memory = await readDailyMemory(date);
    if (memory) {
      memories.push(memory);
    }
  }
  
  return memories;
}

/**
 * Read long-term memory (MEMORY.md)
 */
export async function getLongTermMemory(): Promise<LongTermMemory | null> {
  try {
    const filePath = path.join(MEMORY_DIR, 'MEMORY.md');
    const content = await fs.readFile(filePath, 'utf-8');
    return { content, path: filePath };
  } catch (error) {
    return null;
  }
}

/**
 * Search memories for a keyword
 */
export async function searchMemories(query: string): Promise<{ file: string; matches: string[] }[]> {
  const results: { file: string; matches: string[] }[] = [];
  const files = await getDailyMemoryFiles();
  const longTerm = await getLongTermMemory();
  
  // Search daily memories
  for (const file of files) {
    const date = file.replace('.md', '');
    const memory = await readDailyMemory(date);
    if (memory) {
      const lines = memory.content.split('\n').filter(line => 
        line.toLowerCase().includes(query.toLowerCase())
      );
      if (lines.length > 0) {
        results.push({ file, matches: lines });
      }
    }
  }
  
  // Search long-term memory
  if (longTerm) {
    const lines = longTerm.content.split('\n').filter(line => 
      line.toLowerCase().includes(query.toLowerCase())
    );
    if (lines.length > 0) {
      results.push({ file: 'MEMORY.md', matches: lines });
    }
  }
  
  return results;
}