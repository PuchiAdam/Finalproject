// Built-in fetch is available in Node.js 18+

async function testAIAnalysis() {
    const url = 'http://localhost:3000/api/ai-analysis';
    const payload = {
        symbol: 'AAPL',
        price: 150.00,
        indicators: {
            sma20: 145.00,
            rsi: 65,
            macd: 'bullish'
        }
    };

    console.log('Testing AI Analysis API...');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('API Error Status:', response.status);
            console.error('API Error Body:', text);
            return;
        }

        const text = await response.text();
        try {
            const data = JSON.parse(text);
            console.log('API Response:', JSON.stringify(data, null, 2));

            if (data.recommendation && data.reasoning && typeof data.confidence === 'number') {
                console.log('✅ API Response Valid');
            } else {
                console.error('❌ Invalid Response Structure');
            }
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            console.error('Raw Response:', text);
        }

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testAIAnalysis();
