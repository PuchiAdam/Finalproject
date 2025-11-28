import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET() {
    try {
        const queryOptions = { count: 5, region: 'US', lang: 'en-US', validateResult: false };

        // Fetch Day Gainers
        const gainersPromise = yahooFinance.screener({ scrIds: 'day_gainers', ...queryOptions });

        // Fetch Day Losers
        const losersPromise = yahooFinance.screener({ scrIds: 'day_losers', ...queryOptions });

        // Fetch Most Active
        const activePromise = yahooFinance.screener({ scrIds: 'most_actives', ...queryOptions });

        const [gainersRes, losersRes, activeRes] = await Promise.all([
            gainersPromise,
            losersPromise,
            activePromise
        ]) as any;

        return NextResponse.json({
            gainers: gainersRes.quotes,
            losers: losersRes.quotes,
            active: activeRes.quotes
        });
    } catch (error) {
        console.error('Failed to fetch market movers:', error);
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
    }
}
