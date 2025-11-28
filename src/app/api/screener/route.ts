import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sector = searchParams.get('sector');
        const count = 20;

        // Map simplified sector names to Yahoo Finance screener IDs or predefined queries
        // Note: yahoo-finance2 screener support is limited to predefined IDs.
        // We will use a best-effort approach with predefined lists or search.

        let scrId = 'day_gainers'; // Default
        if (sector === 'tech') scrId = 'ms_technology';
        else if (sector === 'finance') scrId = 'ms_financial_services';
        else if (sector === 'healthcare') scrId = 'ms_healthcare';
        else if (sector === 'energy') scrId = 'ms_energy';
        else if (sector === 'losers') scrId = 'day_losers';
        else if (sector === 'active') scrId = 'most_actives';

        // If it's a standard screener ID
        try {
            const result = await yahooFinance.screener({ scrIds: scrId, count, region: 'US', lang: 'en-US', validateResult: false }) as any;
            return NextResponse.json(result.quotes);
        } catch (e) {
            // Fallback or specific handling if screener fails
            console.error(`Screener failed for ${scrId}`, e);
            return NextResponse.json({ error: 'Failed to fetch screener data' }, { status: 500 });
        }

    } catch (error) {
        console.error('Failed to fetch screener data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
