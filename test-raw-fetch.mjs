async function testRawFetch() {
    try {
        console.log('1. Fetching Quote (v7)...');
        const quoteRes = await fetch('https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log('Quote Status:', quoteRes.status);
        if (quoteRes.ok) {
            const data = await quoteRes.json();
            console.log('Quote Data:', JSON.stringify(data.quoteResponse.result[0], null, 2));
        } else {
            console.log('Quote Text:', await quoteRes.text());
        }

        console.log('\n2. Fetching Chart (v8)...');
        const chartRes = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=1mo&interval=1d', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log('Chart Status:', chartRes.status);
        if (chartRes.ok) {
            const data = await chartRes.json();
            console.log('Chart Data Points:', data.chart.result[0].timestamp.length);
        } else {
            console.log('Chart Text:', await chartRes.text());
        }

    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testRawFetch();
