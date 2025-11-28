import yahooFinance from 'yahoo-finance2';

async function testStockAPI() {
    const symbol = 'AAPL';
    const range = '1mo';
    const interval = '1d';

    console.log(`Testing stock API for ${symbol}...`);

    try {
        // Calculate proper date range
        const getRangeDates = (rangeStr) => {
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

        console.log('\n1. Testing quoteSummary...');
        const quoteSummary = await yahooFinance.quoteSummary(symbol, {
            modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData', 'assetProfile'],
            validateResult: false
        });
        console.log('✓ quoteSummary successful');
        console.log('Price:', quoteSummary.price?.regularMarketPrice);

        console.log('\n2. Testing chart...');
        const period1 = getRangeDates(range);
        console.log('Period1 date:', period1);

        const chartResult = await yahooFinance.chart(symbol, {
            period1: period1,
            interval: interval,
            validateResult: false
        });
        console.log('✓ chart successful');
        console.log('Number of quotes:', chartResult.quotes.length);

        console.log('\n✓ All tests passed!');
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        console.error('Full error:', error);
    }
}

testStockAPI();
