import { NextResponse } from 'next/server';
import yf from 'yahoo-finance2';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        const result: any = await yf.search(symbol, { newsCount: 5 });
        return NextResponse.json(result.news || []);
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
