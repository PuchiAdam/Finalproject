import yahooFinance from 'yahoo-finance2';

async function testStockData() {
    const symbol = 'AAPL';
    console.log(`Fetching data for ${symbol}...`);

    try {
        // Try instantiating as suggested by the error
        const yf = new yahooFinance();

        console.log('Testing quoteSummary with instance...');
        const quoteSummary = await yf.quoteSummary(symbol, {
            modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData', 'assetProfile']
        });
        console.log('quoteSummary success. Price:', quoteSummary.price?.regularMarketPrice);

        console.log('Testing chart with instance...');
        const chartResult = await yf.chart(symbol, {
            period1: '1mo',
            interval: '1d',
            validateResult: false
        });
        console.log('chart success. Quotes length:', chartResult.quotes.length);

    } catch (e) {
        console.error('Error fetching stock data:', e);
        if (e.errors) {
            console.error('Validation errors:', JSON.stringify(e.errors, null, 2));
        }
    }
}

testStockData();

