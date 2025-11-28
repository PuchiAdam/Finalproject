import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');

    if (!symbolsParam) {
        return NextResponse.json({ error: 'Symbols parameter is required' }, { status: 400 });
    }

    const symbols = symbolsParam.split(',').filter(s => s.trim().length > 0);

    if (symbols.length === 0) {
        return NextResponse.json([], { status: 200 });
    }

    try {
        const quotes = await yahooFinance.quote(symbols, { validateResult: false });
        // yahooFinance.quote returns an array if multiple symbols, or a single object if one.
        // Ensure we always return an array.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results: any[] = Array.isArray(quotes) ? quotes : [quotes];

        const simplifiedQuotes = results.map(q => ({
            symbol: q.symbol,
            regularMarketPrice: q.regularMarketPrice,
            regularMarketChange: q.regularMarketChange,
            regularMarketChangePercent: q.regularMarketChangePercent,
            shortName: q.shortName || q.longName || q.symbol
        }));

        return NextResponse.json(simplifiedQuotes);
    } catch (error) {
        console.error('Bulk fetch failed, retrying individually:', error);

        // Fallback: fetch individually
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results: any[] = [];
        for (const symbol of symbols) {
            try {
                const quote = await yahooFinance.quote(symbol, { validateResult: false });
                if (quote) {
                    results.push({
                        symbol: quote.symbol,
                        regularMarketPrice: quote.regularMarketPrice,
                        regularMarketChange: quote.regularMarketChange,
                        regularMarketChangePercent: quote.regularMarketChangePercent,
                        shortName: quote.shortName || quote.longName || quote.symbol
                    });
                }
            } catch (innerError) {
                console.error(`Failed to fetch quote for ${symbol}:`, innerError);
            }
        }

        return NextResponse.json(results);
    }
}
