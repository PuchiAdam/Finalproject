import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET() {
    try {
        const symbols = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD', 'DOT-USD'];

        const results = await yahooFinance.quote(symbols, { validateResult: false });

        return NextResponse.json(results);
    } catch (error) {
        console.error('Failed to fetch crypto data:', error);
        return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 });
    }
}
