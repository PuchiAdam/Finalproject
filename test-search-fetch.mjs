async function testSearchFetch() {
    try {
        console.log('Fetching Search (v1)...');
        const searchRes = await fetch('https://query1.finance.yahoo.com/v1/finance/search?q=AAPL', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log('Search Status:', searchRes.status);
        if (searchRes.ok) {
            const data = await searchRes.json();
            console.log('Search Results:', data.quotes.length);
            console.log('First Result:', JSON.stringify(data.quotes[0], null, 2));
        } else {
            console.log('Search Text:', await searchRes.text());
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testSearchFetch();
