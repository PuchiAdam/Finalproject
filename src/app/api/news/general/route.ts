import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET() {
    try {
        // Fetch general market news
        // 'US' is a good default query for general market news if no specific symbol
        const result = await yahooFinance.search('US', { newsCount: 10, validateResult: false }) as any;

        // Filter for news items only
        const news = result.news || [];

        return NextResponse.json(news);
    } catch (error) {
        console.error('Failed to fetch general news:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
