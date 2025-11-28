import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        const res = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            throw new Error(`Yahoo API Error: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error searching stocks:', error);
        return NextResponse.json({ error: 'Failed to search stocks' }, { status: 500 });
    }
}
