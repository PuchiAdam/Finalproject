'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketIndex {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
}

export function MarketOverview() {
    const [indices, setIndices] = useState<MarketIndex[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarket = async () => {
            try {
                const res = await fetch('/api/market');
                if (res.ok) {
                    const data = await res.json();
                    setIndices(data);
                }
            } catch (error) {
                console.error('Failed to fetch market data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMarket();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (indices.length === 0) return null;

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {indices.map((index) => {
                const isPositive = index.regularMarketChange >= 0;
                return (
                    <div key={index.symbol} className="bg-card/30 border border-border/50 rounded-xl p-4 backdrop-blur-sm hover:bg-card/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-foreground">{index.shortName}</h3>
                            <div className={cn("flex items-center text-xs font-medium px-2 py-0.5 rounded-full", isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                                {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                {Math.abs(index.regularMarketChangePercent).toFixed(2)}%
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {index.regularMarketPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={cn("text-xs", isPositive ? "text-emerald-500" : "text-red-500")}>
                            {isPositive ? '+' : ''}{index.regularMarketChange.toFixed(2)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
