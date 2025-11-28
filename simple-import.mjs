try {
    console.log('Importing...');
    const yf = await import('yahoo-finance2');
    console.log('Imported successfully');
    console.log('Default:', yf.default);
} catch (e) {
    console.error('Import failed:', e);
}
