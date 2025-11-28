import yahooFinance from 'yahoo-finance2';

async function debugYahoo() {
    const symbol = 'AAPL';
    console.log(`Testing yahooFinance for ${symbol}...`);
    console.log('yahooFinance keys:', Object.keys(yahooFinance));

    // Try to find config methods
    if (yahooFinance.suppressNotices) {
        console.log('Found suppressNotices');
        yahooFinance.suppressNotices(['yahooSurvey', 'cantCookie']);
    } else {
        console.log('suppressNotices NOT found');
    }

    if (yahooFinance.setGlobalConfig) {
        console.log('Found setGlobalConfig');
    }

    try {
        console.log('Attempt 1: validateResult in 2nd arg');
        const res = await yahooFinance.quoteSummary(symbol, {
            modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData', 'assetProfile'],
            validateResult: false
        });
        console.log('Success 1');
    } catch (e) {
        console.log('Failed 1. Has result?', !!e.result);
        if (e.result) console.log('Result keys:', Object.keys(e.result));
    }

    try {
        console.log('Attempt 2: validateResult in 3rd arg');
        const res = await yahooFinance.quoteSummary(symbol, {
            modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData', 'assetProfile']
        }, { validateResult: false });
        console.log('Success 2');
    } catch (e) {
        console.log('Failed 2. Has result?', !!e.result);
    }
}

debugYahoo();
