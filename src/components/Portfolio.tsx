'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Holding {
    symbol: string;
    quantity: number;
    avgPrice: number;
}

interface PortfolioItem extends Holding {
    currentPrice: number;
    totalValue: number;
    gainLoss: number;
    gainLossPercent: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function Portfolio() {
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSymbol, setNewSymbol] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newAvgPrice, setNewAvgPrice] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Load holdings from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('stock-track-portfolio');
        if (saved) {
            setHoldings(JSON.parse(saved));
        }
        setLoading(false);
    }, []);

    // Save holdings to local storage whenever they change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('stock-track-portfolio', JSON.stringify(holdings));
        }
    }, [holdings, loading]);

    // Fetch current prices and calculate portfolio stats
    useEffect(() => {
        const fetchPrices = async () => {
            if (holdings.length === 0) {
                setPortfolioItems([]);
                return;
            }

            const symbols = holdings.map(h => h.symbol).join(',');
            try {
                const res = await fetch(`/api/quotes?symbols=${symbols}`);
                if (res.ok) {
                    const quotes = await res.json();
                    const items = holdings.map(holding => {
                        const quote = quotes.find((q: any) => q.symbol === holding.symbol);
                        const currentPrice = quote ? quote.regularMarketPrice : 0;
                        const totalValue = currentPrice * holding.quantity;
                        const costBasis = holding.avgPrice * holding.quantity;
                        const gainLoss = totalValue - costBasis;
                        const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

                        return {
                            ...holding,
                            currentPrice,
                            totalValue,
                            gainLoss,
                            gainLossPercent
                        };
                    });
                    setPortfolioItems(items);
                }
            } catch (error) {
                console.error('Failed to fetch portfolio prices', error);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [holdings]);

    const addHolding = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSymbol || !newQuantity || !newAvgPrice) return;

        const symbol = newSymbol.toUpperCase();
        const quantity = parseFloat(newQuantity);
        const avgPrice = parseFloat(newAvgPrice);

        if (isNaN(quantity) || isNaN(avgPrice)) return;

        setHoldings(prev => {
            const existing = prev.find(h => h.symbol === symbol);
            if (existing) {
                // Update existing holding (weighted average)
                const totalQty = existing.quantity + quantity;
                const totalCost = (existing.quantity * existing.avgPrice) + (quantity * avgPrice);
                const newAvg = totalCost / totalQty;
                return prev.map(h => h.symbol === symbol ? { ...h, quantity: totalQty, avgPrice: newAvg } : h);
            }
            return [...prev, { symbol, quantity, avgPrice }];
        });

        setNewSymbol('');
        setNewQuantity('');
        setNewAvgPrice('');
        setIsAdding(false);
    };

    const removeHolding = (symbol: string) => {
        setHoldings(prev => prev.filter(h => h.symbol !== symbol));
    };

    const totalValue = portfolioItems.reduce((sum, item) => sum + item.totalValue, 0);
    const totalCost = holdings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    // Prepare data for Pie Chart
    const pieData = portfolioItems.map(item => ({
        name: item.symbol,
        value: item.totalValue
    })).filter(item => item.value > 0);

    return (
        <div className="w-full bg-card/30 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Your Portfolio</h2>
                    <div className="flex items-baseline gap-3 mt-1">
                        <span className="text-2xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className={cn("text-sm font-medium flex items-center", totalGainLoss >= 0 ? "text-emerald-500" : "text-red-500")}>
                            {totalGainLoss >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                            ${Math.abs(totalGainLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalGainLossPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {isAdding && (
                <form onSubmit={addHolding} className="mb-6 p-4 bg-muted/30 rounded-lg space-y-4 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Symbol (e.g. AAPL)"
                            value={newSymbol}
                            onChange={e => setNewSymbol(e.target.value)}
                            className="bg-background border border-border rounded-md px-3 py-2 text-sm"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={newQuantity}
                            onChange={e => setNewQuantity(e.target.value)}
                            className="bg-background border border-border rounded-md px-3 py-2 text-sm"
                            step="any"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Avg Price"
                            value={newAvgPrice}
                            onChange={e => setNewAvgPrice(e.target.value)}
                            className="bg-background border border-border rounded-md px-3 py-2 text-sm"
                            step="any"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            Add Holding
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-3">
                    {portfolioItems.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No holdings yet. Add stocks to track your portfolio.</p>
                        </div>
                    ) : (
                        portfolioItems.map((item) => (
                            <div key={item.symbol} className="flex items-center justify-between p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors group">
                                <div>
                                    <div className="font-bold text-foreground">{item.symbol}</div>
                                    <div className="text-xs text-muted-foreground">{item.quantity} shares @ ${item.avgPrice.toFixed(2)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">${item.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <div className={cn("text-xs font-medium", item.gainLoss >= 0 ? "text-emerald-500" : "text-red-500")}>
                                        {item.gainLoss >= 0 ? '+' : ''}{item.gainLoss.toFixed(2)} ({item.gainLossPercent.toFixed(2)}%)
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeHolding(item.symbol)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Allocation Chart */}
                {portfolioItems.length > 0 && (
                    <div className="flex flex-col items-center justify-center p-4 bg-card/50 rounded-xl border border-border/50">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4" />
                            Allocation
                        </h3>
                        <div className="w-full h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

