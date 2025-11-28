import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET() {
    const sectors = [
        { symbol: 'XLK', name: 'Technology' },
        { symbol: 'XLF', name: 'Financials' },
        { symbol: 'XLV', name: 'Healthcare' },
        { symbol: 'XLE', name: 'Energy' },
        { symbol: 'XLY', name: 'Cons. Discret.' },
        { symbol: 'XLP', name: 'Cons. Staples' },
        { symbol: 'XLI', name: 'Industrials' },
        { symbol: 'XLU', name: 'Utilities' },
        { symbol: 'XLB', name: 'Materials' },
        { symbol: 'XLRE', name: 'Real Estate' },
        { symbol: 'XLC', name: 'Comm. Services' },
    ];

    try {
        const promises = sectors.map(async (sector) => {
            try {
                const quote = await yahooFinance.quote(sector.symbol, { validateResult: false }) as any;
                return {
                    symbol: sector.symbol,
                    name: sector.name,
                    price: quote.regularMarketPrice,
                    change: quote.regularMarketChange,
                    changePercent: quote.regularMarketChangePercent,
                };
            } catch (e) {
                console.error(`Failed to fetch ${sector.symbol}`, e);
                return null;
            }
        });

        const results = (await Promise.all(promises)).filter(r => r !== null);
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching sector data:', error);
        return NextResponse.json({ error: 'Failed to fetch sector data' }, { status: 500 });
    }
}
