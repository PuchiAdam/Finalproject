'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StockChart } from '@/components/StockChart';
import { AdviceCard } from '@/components/AdviceCard';
import { AIAnalysis } from '@/components/AIAnalysis';
import { SearchBar } from '@/components/SearchBar';
import { ArrowLeft, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WatchlistButton } from '@/components/WatchlistButton';
import { NewsFeed } from '@/components/NewsFeed';

export default function StockPage() {
    const params = useParams();
    const symbol = params.symbol as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeframe, setTimeframe] = useState('1M');

    const timeframes = [
        { label: '1D', range: '1d', interval: '5m' },
        { label: '1W', range: '5d', interval: '15m' },
        { label: '1M', range: '1mo', interval: '1d' },
        { label: '6M', range: '6mo', interval: '1d' },
        { label: '1Y', range: '1y', interval: '1wk' },
        { label: '5Y', range: '5y', interval: '1wk' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const selected = timeframes.find(t => t.label === timeframe) || timeframes[2];
                const res = await fetch(`/api/stock/${symbol}?range=${selected.range}&interval=${selected.interval}`);
                if (!res.ok) throw new Error('Failed to fetch data');
                const jsonData = await res.json();
                setData(jsonData);
            } catch (err) {
                setError('Could not load stock data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (symbol) fetchData();
    }, [symbol, timeframe]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
                <p className="text-red-500 text-xl">{error}</p>
                <Link href="/" className="text-primary hover:underline">Return Home</Link>
            </div>
        );
    }

    const { quote, historical, advice } = data;
    const isPositive = quote.regularMarketChange >= 0;

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-bold tracking-tight">{quote.symbol}</h1>
                                <WatchlistButton symbol={quote.symbol} />
                            </div>
                            <p className="text-muted-foreground">{quote.shortName || quote.longName}</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <SearchBar className="w-full md:w-[400px]" />
                    </div>
                </div>

                {/* Price Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-bold">${quote.regularMarketPrice?.toFixed(2)}</span>
                            <div className={cn("flex items-center px-3 py-1 rounded-full text-sm font-medium", isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                                {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                                {Math.abs(quote.regularMarketChange)?.toFixed(2)} ({quote.regularMarketChangePercent?.toFixed(2)}%)
                            </div>
                        </div>

                        {/* Chart Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center bg-muted/30 rounded-lg p-1 border border-border/50">
                                {timeframes.map((t) => (
                                    <button
                                        key={t.label}
                                        onClick={() => setTimeframe(t.label)}
                                        className={cn(
                                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                            timeframe === t.label
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <div className={cn("w-2 h-2 rounded-full", quote.regularMarketVolume > 0 ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
                                <span className="text-muted-foreground">
                                    {quote.regularMarketVolume > 0 ? "Market Open" : "Market Closed"}
                                </span>
                            </div>
                        </div>

                        {/* Chart */}
                        <StockChart data={historical} />

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatBox label="Open" value={quote.regularMarketOpen} />
                            <StatBox label="High" value={quote.regularMarketDayHigh} />
                            <StatBox label="Low" value={quote.regularMarketDayLow} />
                            <StatBox label="Vol" value={quote.regularMarketVolume} formatter={(v) => (v / 1000000).toFixed(2) + 'M'} />
                            <StatBox label="Mkt Cap" value={quote.marketCap} formatter={(v) => (v / 1000000000).toFixed(2) + 'B'} />
                            <StatBox label="P/E (Trailing)" value={quote.trailingPE} />
                            <StatBox label="P/E (Forward)" value={quote.forwardPE} />
                            <StatBox label="EPS" value={quote.eps} />
                            <StatBox label="Div Yield" value={quote.dividendYield} formatter={(v) => v.toFixed(2) + '%'} />
                            <StatBox label="Beta" value={quote.beta} />
                            <StatBox label="52W High" value={quote.fiftyTwoWeekHigh} />
                            <StatBox label="52W Low" value={quote.fiftyTwoWeekLow} />
                        </div>

                        {/* News Feed */}
                        <NewsFeed symbol={quote.symbol} />
                    </div>

                    {/* Sidebar / Advice */}
                    <div className="space-y-6">
                        <AdviceCard advice={advice} />

                        <AIAnalysis
                            symbol={quote.symbol}
                            price={quote.regularMarketPrice}
                            indicators={{
                                technicalAdvice: advice,
                                pe: quote.trailingPE,
                                marketCap: quote.marketCap,
                                volume: quote.regularMarketVolume,
                                changePercent: quote.regularMarketChangePercent
                            }}
                        />

                        {/* Company Profile */}
                        <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm space-y-4">
                            <h3 className="font-semibold text-lg">Company Profile</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                {quote.sector && (
                                    <div className="flex justify-between">
                                        <span>Sector</span>
                                        <span className="font-medium text-foreground">{quote.sector}</span>
                                    </div>
                                )}
                                {quote.industry && (
                                    <div className="flex justify-between">
                                        <span>Industry</span>
                                        <span className="font-medium text-foreground">{quote.industry}</span>
                                    </div>
                                )}
                                {quote.website && (
                                    <div className="flex justify-between">
                                        <span>Website</span>
                                        <a href={quote.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate max-w-[200px]">
                                            {quote.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 border-t border-border/50">
                                <h4 className="font-medium mb-2 text-foreground">About</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6 hover:line-clamp-none transition-all">
                                    {quote.longBusinessSummary || "No summary available for this stock."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, formatter }: { label: string, value: number, formatter?: (v: number) => string }) {
    return (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div className="font-semibold">
                {value ? (formatter ? formatter(value) : value.toFixed(2)) : '-'}
            </div>
        </div>
    );
}
