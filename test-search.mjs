import yahooFinance from 'yahoo-finance2';

async function testSearch() {
    try {
        console.log('Searching for AAPL...');
        const res = await yahooFinance.search('AAPL');
        console.log('Search success:', res.quotes.length);
        console.log('First result:', res.quotes[0]);
    } catch (e) {
        console.error('Search error:', e);
    }
}

testSearch();
