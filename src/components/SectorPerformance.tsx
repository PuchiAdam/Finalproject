'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectorData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

export function SectorPerformance() {
    const [sectors, setSectors] = useState<SectorData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const res = await fetch('/api/sectors');
                if (res.ok) {
                    const data = await res.json();
                    // Sort by performance (best to worst)
                    data.sort((a: SectorData, b: SectorData) => b.changePercent - a.changePercent);
                    setSectors(data);
                }
            } catch (error) {
                console.error('Failed to fetch sector data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSectors();
    }, []);

    if (loading) return null;

    return (
        <div className="w-full bg-card/30 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Sector Performance</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sectors.map((sector) => {
                    const isPositive = sector.change >= 0;
                    return (
                        <div key={sector.symbol} className="p-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-colors">
                            <div className="text-xs text-muted-foreground mb-1">{sector.name}</div>
                            <div className="flex justify-between items-end">
                                <div className="font-semibold text-foreground">
                                    {sector.changePercent.toFixed(2)}%
                                </div>
                                <div className={cn("flex items-center text-xs", isPositive ? "text-emerald-500" : "text-red-500")}>
                                    {isPositive ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                                    {Math.abs(sector.change).toFixed(2)}
                                </div>
                            </div>
                            {/* Mini Bar Chart Representation */}
                            <div className="mt-2 h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full", isPositive ? "bg-emerald-500" : "bg-red-500")}
                                    style={{ width: `${Math.min(Math.abs(sector.changePercent) * 20, 100)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
