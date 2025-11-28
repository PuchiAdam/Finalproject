'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ComparisonChart } from '@/components/ComparisonChart';
import { Loader2, ArrowRightLeft, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ComparisonPage() {
    const [symbol1, setSymbol1] = useState('');
    const [symbol2, setSymbol2] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!symbol1 || !symbol2) return;

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/compare?symbol1=${symbol1}&symbol2=${symbol2}&range=1y`);
            if (res.ok) {
                const jsonData = await res.json();
                setData(jsonData);
            } else {
                setError('Failed to fetch data. Please check symbols.');
            }
        } catch (err) {
            setError('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 rounded-full hover:bg-muted transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <ArrowRightLeft className="w-8 h-8 text-primary" />
                            Stock Comparison
                        </h1>
                        <p className="text-muted-foreground">Compare performance and metrics side-by-side.</p>
                    </div>
                </div>

                <div className="bg-card/30 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
                    <form onSubmit={handleCompare} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="text-sm font-medium mb-2 block">Stock 1</label>
                            <input
                                type="text"
                                value={symbol1}
                                onChange={(e) => setSymbol1(e.target.value.toUpperCase())}
                                placeholder="e.g. AAPL"
                                className="w-full bg-background border border-border rounded-lg px-4 py-2"
                                required
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="text-sm font-medium mb-2 block">Stock 2</label>
                            <input
                                type="text"
                                value={symbol2}
                                onChange={(e) => setSymbol2(e.target.value.toUpperCase())}
                                placeholder="e.g. MSFT"
                                className="w-full bg-background border border-border rounded-lg px-4 py-2"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Compare'}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                {data && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <ComparisonChart
                            data1={data.symbol1.history}
                            data2={data.symbol2.history}
                            symbol1={data.symbol1.quote.symbol}
                            symbol2={data.symbol2.quote.symbol}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <StockCard quote={data.symbol1.quote} />
                            <StockCard quote={data.symbol2.quote} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StockCard({ quote }: { quote: any }) {
    const isPositive = quote.regularMarketChange >= 0;
    return (
        <div className="bg-card/30 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold">{quote.symbol}</h2>
                    <p className="text-muted-foreground">{quote.shortName}</p>
                </div>
                <div className={cn("text-right", isPositive ? "text-emerald-500" : "text-rose-500")}>
                    <div className="text-2xl font-bold">${quote.regularMarketPrice.toFixed(2)}</div>
                    <div className="text-sm font-medium">
                        {isPositive ? '+' : ''}{quote.regularMarketChange.toFixed(2)} ({quote.regularMarketChangePercent.toFixed(2)}%)
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Metric label="Market Cap" value={`$${(quote.marketCap / 1000000000).toFixed(2)}B`} />
                <Metric label="P/E Ratio" value={quote.trailingPE?.toFixed(2) || '-'} />
                <Metric label="Volume" value={`${(quote.regularMarketVolume / 1000000).toFixed(2)}M`} />
                <Metric label="52W High" value={`$${quote.fiftyTwoWeekHigh?.toFixed(2)}`} />
                <Metric label="52W Low" value={`$${quote.fiftyTwoWeekLow?.toFixed(2)}`} />
            </div>
        </div>
    );
}

function Metric({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
