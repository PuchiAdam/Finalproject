import yahooFinance from 'yahoo-finance2';

async function testBasic() {
    try {
        console.log('Fetching AAPL...');
        const quote = await yahooFinance.quote('AAPL');
        console.log('Success:', quote.symbol, quote.regularMarketPrice);
    } catch (e) {
        console.error('Basic fetch failed:', e.message);
        if (e.errors) console.error('Errors:', JSON.stringify(e.errors, null, 2));
    }
}

testBasic();
