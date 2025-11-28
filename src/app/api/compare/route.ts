import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol1 = searchParams.get('symbol1');
        const symbol2 = searchParams.get('symbol2');
        const range = searchParams.get('range') || '1mo';
        const interval = searchParams.get('interval') || '1d';

        if (!symbol1 || !symbol2) {
            return NextResponse.json({ error: 'Symbols are required' }, { status: 400 });
        }

        // Calculate proper date range
        const getRangeDates = (rangeStr: string) => {
            const now = new Date();
            const period1 = new Date();

            switch (rangeStr) {
                case '1d':
                    period1.setDate(now.getDate() - 1);
                    break;
                case '5d':
                    period1.setDate(now.getDate() - 5);
                    break;
                case '1mo':
                    period1.setMonth(now.getMonth() - 1);
                    break;
                case '3mo':
                    period1.setMonth(now.getMonth() - 3);
                    break;
                case '6mo':
                    period1.setMonth(now.getMonth() - 6);
                    break;
                case '1y':
                    period1.setFullYear(now.getFullYear() - 1);
                    break;
                case '5y':
                    period1.setFullYear(now.getFullYear() - 5);
                    break;
                default:
                    period1.setMonth(now.getMonth() - 1);
            }

            return period1;
        };

        const queryOptions = { period1: getRangeDates(range), interval: interval as any, validateResult: false };

        // Fetch historical data for both
        const [hist1, hist2, quote1, quote2] = await Promise.all([
            yahooFinance.chart(symbol1, queryOptions) as any,
            yahooFinance.chart(symbol2, queryOptions) as any,
            yahooFinance.quote(symbol1, { validateResult: false }),
            yahooFinance.quote(symbol2, { validateResult: false })
        ]);

        return NextResponse.json({
            symbol1: { quote: quote1, history: hist1.quotes },
            symbol2: { quote: quote2, history: hist2.quotes }
        });

    } catch (error) {
        console.error('Failed to fetch comparison data:', error);
        return NextResponse.json({ error: 'Failed to fetch comparison data' }, { status: 500 });
    }
}
