import yahooFinance from 'yahoo-finance2';

async function testYahoo() {
    try {
        console.log('Fetching quoteSummary for AAPL...');
        const quoteSummary = await yahooFinance.quoteSummary('AAPL', {
            modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData', 'assetProfile'],
            validateResult: false
        });
        console.log('quoteSummary success:', quoteSummary ? 'Yes' : 'No');

        console.log('Fetching chart for AAPL...');
        const chart = await yahooFinance.chart('AAPL', {
            period1: '1mo',
            interval: '1d',
            validateResult: false
        });
        console.log('chart success:', chart ? 'Yes' : 'No');

    } catch (error: any) {
        console.error('Error:', error);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
    }
}

testYahoo();
