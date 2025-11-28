import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ symbol: string }> }
) {
    const symbol = (await params).symbol;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '1mo';
    const interval = searchParams.get('interval') || '1d';

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        console.log(`Fetching data for ${symbol}...`);

        // Get basic quote data
        const quoteData = await yahooFinance.quote(symbol, {}, { validateResult: false }) as any;
        console.log('Quote fetched successfully');

        // Build quote object from the data
        const quote = {
            symbol: quoteData.symbol || symbol,
            shortName: quoteData.shortName || quoteData.longName || symbol,
            longName: quoteData.longName || quoteData.shortName || symbol,
            regularMarketPrice: quoteData.regularMarketPrice,
            regularMarketChange: quoteData.regularMarketChange,
            regularMarketChangePercent: quoteData.regularMarketChangePercent,
            regularMarketOpen: quoteData.regularMarketOpen,
            regularMarketDayHigh: quoteData.regularMarketDayHigh,
            regularMarketDayLow: quoteData.regularMarketDayLow,
            regularMarketVolume: quoteData.regularMarketVolume,
            marketCap: quoteData.marketCap,
            trailingPE: quoteData.trailingPE || null,
            forwardPE: quoteData.forwardPE || null,
            eps: quoteData.epsTrailingTwelveMonths || null,
            beta: quoteData.beta || null,
            dividendYield: quoteData.dividendYield ? quoteData.dividendYield * 100 : null,
            fiftyTwoWeekHigh: quoteData.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: quoteData.fiftyTwoWeekLow,
            longBusinessSummary: "No summary available.",
            sector: null,
            industry: null,
            website: null
        };

        // Fetch historical chart data
        let historical: any[] = [];
        try {
            console.log(`Fetching historical data for ${symbol} with range ${range}...`);

            // Calculate date range
            const now = new Date();
            const startDate = new Date();

            switch (range) {
                case '1d':
                    startDate.setDate(now.getDate() - 1);
                    break;
                case '5d':
                    startDate.setDate(now.getDate() - 5);
                    break;
                case '1mo':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case '3mo':
                    startDate.setMonth(now.getMonth() - 3);
                    break;
                case '6mo':
                    startDate.setMonth(now.getMonth() - 6);
                    break;
                case '1y':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
                case '5y':
                    startDate.setFullYear(now.getFullYear() - 5);
                    break;
                default:
                    startDate.setMonth(now.getMonth() - 1);
            }

            console.log(`Date range: ${startDate.toISOString()} to ${now.toISOString()}`);

            const chartResult = await yahooFinance.chart(symbol, {
                period1: startDate,
                period2: now,
                interval: interval as any,
            }, { validateResult: false }) as any;
            console.log(`Chart data fetched: ${chartResult.quotes.length} points`);

            historical = chartResult.quotes.map((q: any) => ({
                date: new Date(q.date).toISOString(),
                close: q.close,
                open: q.open,
                high: q.high,
                low: q.low,
                volume: q.volume
            })).filter((item: any) => item.close !== null && item.close !== undefined);
        } catch (chartError) {
            console.error('Chart fetch failed:', chartError);
            // Continue without chart data
        }

        // Calculate simple advice based on available data
        let advice = 'HOLD';
        let reason = 'Market conditions are neutral.';
        let score = 50;

        if (historical.length > 5) {
            const lastPrice = historical[historical.length - 1].close;
            const firstPrice = historical[0].close;
            const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;

            if (priceChange > 10) {
                advice = 'BUY';
                reason = `Strong upward trend detected (+${priceChange.toFixed(1)}% over period).`;
                score = 75;
            } else if (priceChange < -10) {
                advice = 'SELL';
                reason = `Downward trend detected (${priceChange.toFixed(1)}% over period).`;
                score = 25;
            } else {
                advice = 'HOLD';
                reason = `Price relatively stable (${priceChange.toFixed(1)}% change).`;
                score = 50;
            }
        }

        return NextResponse.json({
            symbol: symbol.toUpperCase(),
            quote,
            historical,
            advice: {
                action: advice,
                reason,
                score
            }
        });
    } catch (error: any) {
        console.error(`Error fetching data for ${symbol}:`, error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        return NextResponse.json({
            error: 'Failed to fetch stock data',
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
