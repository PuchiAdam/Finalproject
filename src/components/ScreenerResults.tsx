'use client';

import Link from 'next/link';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stock {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    marketCap: number;
    regularMarketVolume: number;
}

interface ScreenerResultsProps {
    data: Stock[];
}

export function ScreenerResults({ data }: ScreenerResultsProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No stocks found matching your criteria.
            </div>
        );
    }

    return (
        <div className="bg-card/30 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-muted/30 border-b border-border/50">
                            <th className="p-4 font-medium text-muted-foreground">Symbol</th>
                            <th className="p-4 font-medium text-muted-foreground">Name</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Price</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Change</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Volume</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Mkt Cap</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {data.map((stock) => {
                            const isPositive = stock.regularMarketChange >= 0;
                            return (
                                <tr key={stock.symbol} className="hover:bg-muted/20 transition-colors group">
                                    <td className="p-4">
                                        <Link href={`/stock/${stock.symbol}`} className="font-bold text-foreground group-hover:text-primary transition-colors">
                                            {stock.symbol}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-muted-foreground max-w-[200px] truncate">
                                        {stock.shortName}
                                    </td>
                                    <td className="p-4 text-right font-mono">
                                        ${stock.regularMarketPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className={cn("flex items-center justify-end gap-1", isPositive ? "text-emerald-500" : "text-rose-500")}>
                                            {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                            <span className="font-medium">{Math.abs(stock.regularMarketChangePercent).toFixed(2)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-muted-foreground">
                                        {(stock.regularMarketVolume / 1000000).toFixed(2)}M
                                    </td>
                                    <td className="p-4 text-right text-muted-foreground">
                                        {(stock.marketCap / 1000000000).toFixed(2)}B
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
