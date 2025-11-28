async function testNetwork() {
    try {
        console.log('Fetching google.com...');
        const res = await fetch('https://www.google.com');
        console.log('Status:', res.status);
    } catch (e) {
        console.error('Network error:', e);
    }
}

testNetwork();
