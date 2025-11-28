import yahooFinance from 'yahoo-finance2';

async function verifyFix() {
    console.log('Verifying robust fetch logic...');
    const symbols = ['AAPL', 'INVALID_SYMBOL_XYZ', 'GOOGL'];

    try {
        console.log('Attempting bulk fetch...');
        const quotes = await yahooFinance.quote(symbols, { validateResult: false });
        console.log('Bulk fetch succeeded (unexpected but okay):', quotes);
    } catch (error) {
        console.log('Bulk fetch failed as expected. Testing fallback logic...');

        const results = [];
        for (const symbol of symbols) {
            try {
                const quote = await yahooFinance.quote(symbol, { validateResult: false });
                if (quote) {
                    console.log(`Found valid quote for ${symbol}`);
                    results.push(quote);
                }
            } catch (innerError) {
                console.log(`Failed to fetch quote for ${symbol} (expected for invalid)`);
            }
        }

        console.log(`Recovered ${results.length} valid quotes out of ${symbols.length} symbols.`);
        console.log('Recovered results:', JSON.stringify(results, null, 2));
        if (results.length === 2) {
            console.log('SUCCESS: Logic correctly recovered valid symbols.');
        } else {
            console.error('FAILURE: Did not recover expected number of symbols.');
        }
    }
}

verifyFix();
