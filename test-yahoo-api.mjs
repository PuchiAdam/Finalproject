import yahooFinance from 'yahoo-finance2';

async function testAPI() {
    try {
        console.log('Testing quote...');
        const quote = await yahooFinance.quote('AAPL', { validateResult: false });
        console.log('✓ Quote successful:', quote.symbol, quote.regularMarketPrice);

        console.log('\nTesting chart (not historical)...');
        const now = new Date();
        const startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);

        // Try using chart instead of historical
        const chartData = await yahooFinance.chart('AAPL', {
            period1: startDate,
            period2: now,
            interval: '1d',
        });
        console.log('✓ Chart successful:', chartData.quotes.length, 'data points');

        console.log('\n✓✓✓ All tests passed!');
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error('Full error:', error);
    }
}

testAPI();
