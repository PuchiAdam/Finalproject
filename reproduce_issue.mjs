import yahooFinance from 'yahoo-finance2';

async function test() {
    console.log('Testing yahooFinance.quote with multiple symbols...');
    const symbols = ['AAPL', 'GOOGL', 'INVALID_SYMBOL_XYZ'];

    try {
        const results = await yahooFinance.quote(symbols, { validateResult: false });
        console.log('Results:', JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('Error fetching quotes:', error.message);
        if (error.errors) {
            console.error('Partial errors:', JSON.stringify(error.errors, null, 2));
        }
    }
}

test();
