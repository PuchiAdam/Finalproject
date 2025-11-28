import { NextResponse } from 'next/server';

export async function GET() {
    const symbols = ['^GSPC', '^DJI', '^IXIC'];
    const results = [];

    try {
        for (const symbol of symbols) {
            const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            if (!res.ok) continue;

            const data = await res.json();
            const result = data.chart.result[0];
            const meta = result.meta;

            results.push({
                symbol: meta.symbol,
                shortName: getSymbolName(meta.symbol),
                regularMarketPrice: meta.regularMarketPrice,
                regularMarketChange: meta.regularMarketPrice - meta.chartPreviousClose,
                regularMarketChangePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100
            });
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching market data:', error);
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
    }
}

function getSymbolName(symbol: string) {
    switch (symbol) {
        case '^GSPC': return 'S&P 500';
        case '^DJI': return 'Dow Jones';
        case '^IXIC': return 'Nasdaq';
        default: return symbol;
    }
}
