import { NextResponse } from 'next/server';

// Pi's API URL - configured via environment
const PI_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://100.97.211.24:3002';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  try {
    let piUrl = '';
    
    switch (action) {
      case 'daily':
        piUrl = `${PI_API_URL}/api/memory/daily`;
        break;
      case 'longterm':
        piUrl = `${PI_API_URL}/api/memory`;
        break;
      case 'search':
        const query = searchParams.get('query') || '';
        piUrl = `${PI_API_URL}/api/memory/search?q=${encodeURIComponent(query)}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    const response = await fetch(piUrl, {
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) {
      throw new Error(`Pi API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Normalize response format
    if (action === 'longterm') {
      return NextResponse.json({ content: result.data });
    }
    
    return NextResponse.json(result.data || []);
  } catch (error: any) {
    console.error('Memory API error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}