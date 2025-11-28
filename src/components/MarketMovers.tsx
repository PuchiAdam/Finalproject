'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Activity, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Mover {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
}

interface MoversData {
    gainers: Mover[];
    losers: Mover[];
    active: Mover[];
}

export function MarketMovers() {
    const [data, setData] = useState<MoversData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'active'>('gainers');

    useEffect(() => {
        const fetchMovers = async () => {
            try {
                const res = await fetch('/api/market/movers');
                if (res.ok) {
                    const jsonData = await res.json();
                    setData(jsonData);
                }
            } catch (error) {
                console.error('Failed to fetch market movers', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovers();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center bg-card/30 border border-border/50 rounded-xl backdrop-blur-sm">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!data) return null;

    const tabs = [
        { id: 'gainers', label: 'Top Gainers', icon: TrendingUp, color: 'text-emerald-500' },
        { id: 'losers', label: 'Top Losers', icon: TrendingDown, color: 'text-rose-500' },
        { id: 'active', label: 'Most Active', icon: Activity, color: 'text-blue-500' },
    ] as const;

    const currentData = data[activeTab];

    return (
        <div className="w-full bg-card/30 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Market Movers</h2>
                <div className="flex bg-muted/30 rounded-lg p-1 border border-border/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                activeTab === tab.id
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4", tab.color)} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {currentData.map((item) => {
                    const isPositive = item.regularMarketChange >= 0;
                    return (
                        <Link
                            key={item.symbol}
                            href={`/stock/${item.symbol}`}
                            className="flex items-center justify-between p-3 rounded-lg bg-card/50 hover:bg-card/80 border border-transparent hover:border-border/50 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("w-1 h-8 rounded-full", isPositive ? "bg-emerald-500" : "bg-rose-500")} />
                                <div>
                                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">{item.symbol}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[200px]">{item.shortName}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium text-foreground">
                                    ${item.regularMarketPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className={cn("flex items-center justify-end text-xs font-medium", isPositive ? "text-emerald-500" : "text-rose-500")}>
                                    {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                    {Math.abs(item.regularMarketChangePercent).toFixed(2)}%
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
