import fetch from 'node-fetch';

async function testMarket() {
    const symbol = '^GSPC';
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1d`;
    console.log(`Fetching ${url}...`);

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            console.error('Error:', res.status, res.statusText);
            return;
        }

        const data = await res.json();
        const result = data.chart.result[0];
        const meta = result.meta;

        console.log('Symbol:', meta.symbol);
        console.log('Price:', meta.regularMarketPrice);
        console.log('Prev Close:', meta.chartPreviousClose);
    } catch (e) {
        console.error('Exception:', e);
    }
}

testMarket();
