'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X, Star, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WatchlistData {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    shortName: string;
}

export function Watchlist() {
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [marketData, setMarketData] = useState<Record<string, WatchlistData>>({});
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMarketData = useCallback(async (symbols: string[]) => {
        if (symbols.length === 0) {
            setMarketData({});
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/quotes?symbols=${symbols.join(',')}`);
            if (res.ok) {
                const data: WatchlistData[] = await res.json();
                const dataMap: Record<string, WatchlistData> = {};
                data.forEach(item => {
                    dataMap[item.symbol] = item;
                });
                setMarketData(dataMap);
            } else {
                setError('Failed to update prices');
            }
        } catch (error) {
            console.error('Failed to fetch watchlist data', error);
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('stock-track-watchlist');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setWatchlist(parsed);
                fetchMarketData(parsed);
            } catch (e) {
                console.error('Failed to parse watchlist', e);
            }
        }

        const handleStorageChange = () => {
            const saved = localStorage.getItem('stock-track-watchlist');
            if (saved) {
                const parsed = JSON.parse(saved);
                setWatchlist(parsed);
                fetchMarketData(parsed);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('watchlist-update', handleStorageChange);

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            const currentSaved = localStorage.getItem('stock-track-watchlist');
            if (currentSaved) {
                fetchMarketData(JSON.parse(currentSaved));
            }
        }, 30000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('watchlist-update', handleStorageChange);
            clearInterval(interval);
        };
    }, [fetchMarketData]);

    if (!mounted) return null;

    const removeSymbol = (symbol: string) => {
        const newWatchlist = watchlist.filter(s => s !== symbol);
        setWatchlist(newWatchlist);
        localStorage.setItem('stock-track-watchlist', JSON.stringify(newWatchlist));
        window.dispatchEvent(new Event('watchlist-update'));

        // Update local state immediately to reflect removal
        const newData = { ...marketData };
        delete newData[symbol];
        setMarketData(newData);
    };

    return (
        <div className="w-80 border-r border-white/10 bg-black/20 backdrop-blur-xl p-4 hidden lg:flex flex-col h-screen sticky top-0 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2 text-white">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    Watchlist
                </h2>
                <div className="flex items-center gap-2">
                    {error && <span className="text-xs text-rose-400" title={error}>!</span>}
                    {loading && <RefreshCw className="w-3 h-3 animate-spin text-white/50" />}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {watchlist.length === 0 ? (
                    <div className="text-center p-6 border border-dashed border-white/10 rounded-xl bg-white/5">
                        <p className="text-sm text-white/60">No stocks saved yet.</p>
                        <p className="text-xs text-white/40 mt-2">Search and click the star to add stocks to your watchlist.</p>
                    </div>
                ) : (
                    watchlist.map((symbol) => {
                        const data = marketData[symbol];
                        const isPositive = data ? data.regularMarketChange >= 0 : true;

                        return (
                            <div key={symbol} className="group relative p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-200">
                                <Link href={`/stock/${symbol}`} className="block">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-bold text-white">{symbol}</div>
                                        {data && (
                                            <div className={cn("flex items-center text-xs font-medium px-1.5 py-0.5 rounded", isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400")}>
                                                {isPositive ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                                                {Math.abs(data.regularMarketChangePercent).toFixed(2)}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-xs text-white/50">{data?.shortName || 'Loading...'}</div>
                                        {data && (
                                            <div className="text-sm font-mono font-medium text-white/90">
                                                {data.regularMarketPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeSymbol(symbol);
                                    }}
                                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-1 bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                                    title="Remove from watchlist"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
