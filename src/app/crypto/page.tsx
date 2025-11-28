'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Loader2, Bitcoin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchBar } from '@/components/SearchBar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Crypto {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    marketCap: number;
    regularMarketVolume: number;
}

export default function CryptoPage() {
    const [data, setData] = useState<Crypto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/crypto');
                if (res.ok) {
                    const jsonData = await res.json();
                    setData(jsonData);
                }
            } catch (error) {
                console.error('Failed to fetch crypto data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                <Bitcoin className="w-8 h-8 text-yellow-500" />
                                Crypto Tracker
                            </h1>
                            <p className="text-muted-foreground">Real-time prices for top cryptocurrencies.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <SearchBar className="w-full md:w-[300px]" />
                    </div>
                </div>

                {loading && data.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.map((coin) => {
                            const isPositive = coin.regularMarketChange >= 0;
                            return (
                                <div key={coin.symbol} className="bg-card/30 border border-border/50 rounded-xl p-6 backdrop-blur-sm hover:bg-card/50 transition-all hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground">{coin.shortName}</h3>
                                            <span className="text-xs text-muted-foreground">{coin.symbol}</span>
                                        </div>
                                        <div className={cn("flex items-center px-2 py-1 rounded-full text-xs font-medium", isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                                            {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                            {Math.abs(coin.regularMarketChangePercent).toFixed(2)}%
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold text-foreground">
                                            ${coin.regularMarketPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className={cn("text-sm font-medium", isPositive ? "text-emerald-500" : "text-rose-500")}>
                                            {isPositive ? '+' : ''}{coin.regularMarketChange.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
                                        <div>
                                            <div className="mb-1">Market Cap</div>
                                            <div className="font-medium text-foreground">${(coin.marketCap / 1000000000).toFixed(2)}B</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="mb-1">Volume (24h)</div>
                                            <div className="font-medium text-foreground">${(coin.regularMarketVolume / 1000000).toFixed(2)}M</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
