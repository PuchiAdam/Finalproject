import yahooFinance from 'yahoo-finance2';

async function testNews() {
    try {
        const symbol = 'AAPL';
        const result = await yahooFinance.search(symbol, { newsCount: 5 });
        console.log('Search Result with News:', JSON.stringify(result, null, 2));

        // Also try quoteSummary which sometimes has news
        // const quoteSummary = await yahooFinance.quoteSummary(symbol, { modules: ['news'] });
        // console.log('Quote Summary News:', JSON.stringify(quoteSummary, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

testNews();
