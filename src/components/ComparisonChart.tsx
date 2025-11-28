'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { format } from 'date-fns';

interface ComparisonChartProps {
    data1: any[];
    data2: any[];
    symbol1: string;
    symbol2: string;
}

export function ComparisonChart({ data1, data2, symbol1, symbol2 }: ComparisonChartProps) {
    // Normalize data to percentage change
    const normalizeData = () => {
        if (!data1.length || !data2.length) return [];

        const start1 = data1[0].close;
        const start2 = data2[0].close;

        // Create a map of date -> value for data2 to align dates
        const map2 = new Map(data2.map(d => [format(new Date(d.date), 'yyyy-MM-dd'), d.close]));

        return data1.map(d => {
            const dateStr = format(new Date(d.date), 'yyyy-MM-dd');
            const val2 = map2.get(dateStr);

            return {
                date: format(new Date(d.date), 'MMM dd'),
                [symbol1]: ((d.close - start1) / start1) * 100,
                [symbol2]: val2 ? ((val2 - start2) / start2) * 100 : null
            };
        });
    };

    const chartData = normalizeData();

    return (
        <div className="w-full h-[400px] bg-card/30 rounded-xl border border-border/50 p-4 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Performance Comparison (%)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value.toFixed(0)}%`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(value: number) => [`${value.toFixed(2)}%`]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey={symbol1} stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#color1)" />
                    <Area type="monotone" dataKey={symbol2} stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#color2)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
