import yahooFinance from 'yahoo-finance2';

yahooFinance.suppressNotices(['resultSort']);

async function test() {
    try {
        console.log('1. Starting...');
        const quote = await yahooFinance.quote('AAPL');
        console.log('2. Quote:', quote ? 'Found' : 'Not Found');

        const history = await yahooFinance.historical('AAPL', { period1: '2023-01-01' });
        console.log('3. History:', history ? history.length : 'None');
    } catch (e) {
        console.log('ERROR CAUGHT:');
        console.log(e.message);
        if (e.errors) console.log(JSON.stringify(e.errors, null, 2));
    }
}

test();
