'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface StockChartProps {
    data: any[];
}

export function StockChart({ data }: StockChartProps) {
    // Calculate Indicators
    const calculateEMA = (data: any[], period: number) => {
        const k = 2 / (period + 1);
        let emaArray = [];
        let ema = data[0].close; // Start with SMA or first price

        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                emaArray.push(ema);
            } else {
                ema = (data[i].close * k) + (ema * (1 - k));
                emaArray.push(ema);
            }
        }
        return emaArray;
    };

    const calculateRSI = (data: any[], period: number = 14) => {
        let rsiArray = new Array(period).fill(null); // First 'period' values are null
        let gains = 0;
        let losses = 0;

        // Calculate initial average gain/loss
        for (let i = 1; i <= period; i++) {
            const change = data[i].close - data[i - 1].close;
            if (change > 0) gains += change;
            else losses += Math.abs(change);
        }

        let avgGain = gains / period;
        let avgLoss = losses / period;

        // First RSI
        let rs = avgGain / avgLoss;
        rsiArray.push(100 - (100 / (1 + rs)));

        // Subsequent RSI
        for (let i = period + 1; i < data.length; i++) {
            const change = data[i].close - data[i - 1].close;
            let gain = change > 0 ? change : 0;
            let loss = change < 0 ? Math.abs(change) : 0;

            avgGain = ((avgGain * (period - 1)) + gain) / period;
            avgLoss = ((avgLoss * (period - 1)) + loss) / period;

            rs = avgGain / avgLoss;
            rsiArray.push(100 - (100 / (1 + rs)));
        }
        return rsiArray;
    };

    const calculateSMA = (data: any[], period: number) => {
        let smaArray = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                smaArray.push(null);
                continue;
            }
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            smaArray.push(sum / period);
        }
        return smaArray;
    };

    const calculateStandardDeviation = (data: any[], period: number, sma: any[]) => {
        let stdDevArray = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                stdDevArray.push(null);
                continue;
            }
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += Math.pow(data[i - j].close - sma[i], 2);
            }
            stdDevArray.push(Math.sqrt(sum / period));
        }
        return stdDevArray;
    };

    const calculateBollingerBands = (data: any[], period: number = 20, multiplier: number = 2) => {
        const sma = calculateSMA(data, period);
        const stdDev = calculateStandardDeviation(data, period, sma);

        return data.map((_, i) => {
            if (sma[i] === null || stdDev[i] === null) return { upper: null, middle: null, lower: null };
            return {
                upper: sma[i] + (multiplier * stdDev[i]),
                middle: sma[i],
                lower: sma[i] - (multiplier * stdDev[i])
            };
        });
    };

    const calculateMACD = (data: any[]) => {
        const ema12 = calculateEMA(data, 12);
        const ema26 = calculateEMA(data, 26);
        const macdLine = ema12.map((v, i) => v - ema26[i]);

        // Calculate Signal Line (9-day EMA of MACD Line)
        // We need to treat macdLine as the input data for EMA calculation
        // But calculateEMA expects object with .close, so we'll adapt it or rewrite simple EMA

        const calculateSimpleEMA = (values: number[], period: number) => {
            const k = 2 / (period + 1);
            let emaArray = [];
            let ema = values[0]; // Approximation for first value

            for (let i = 0; i < values.length; i++) {
                if (i === 0) {
                    emaArray.push(ema);
                } else {
                    ema = (values[i] * k) + (ema * (1 - k));
                    emaArray.push(ema);
                }
            }
            return emaArray;
        };

        const signalLine = calculateSimpleEMA(macdLine, 9);
        const histogram = macdLine.map((v, i) => v - signalLine[i]);

        return { macdLine, signalLine, histogram };
    };


    const rsi = calculateRSI(data, 14);
    const bb = calculateBollingerBands(data, 20, 2);
    const macd = calculateMACD(data);

    const chartData = data.map((item, index) => ({
        date: format(new Date(item.date), 'MMM dd'),
        price: item.close,

        rsi: rsi[index],
        bbUpper: bb[index].upper,
        bbMiddle: bb[index].middle,
        bbLower: bb[index].lower,
        macdLine: macd.macdLine[index],
        macdSignal: macd.signalLine[index],
        macdHist: macd.histogram[index]
    }));

    const isPositive = chartData.length > 1 && chartData[chartData.length - 1].price >= chartData[0].price;
    const color = isPositive ? '#10b981' : '#ef4444';

    return (
        <div className="space-y-4">
            {/* Main Price Chart with Bollinger Bands */}
            <div className="w-full h-[400px] bg-card/50 rounded-xl border border-border/50 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Price & BB</h3>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-foreground">Price</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-400/50" />
                            <span className="text-foreground">BB</span>
                        </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                        <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={30} />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={(value) => `$${value.toFixed(2)}`}
                            width={60}
                        />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }} />

                        {/* Bollinger Bands */}


                        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" name="Price" />

                        <Area type="monotone" dataKey="bbUpper" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" fillOpacity={0} name="BB Upper" />
                        <Area type="monotone" dataKey="bbLower" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" fillOpacity={0} name="BB Lower" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* MACD Chart */}
            <div className="w-full h-[200px] bg-card/50 rounded-xl border border-border/50 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2 px-2">
                    <h3 className="text-sm font-medium text-muted-foreground">MACD (12, 26, 9)</h3>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" hide />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} />
                        <Area type="monotone" dataKey="macdLine" stroke="#60a5fa" strokeWidth={2} fillOpacity={0} name="MACD" />
                        <Area type="monotone" dataKey="macdSignal" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} name="Signal" />
                        <Area type="monotone" dataKey="macdHist" fill="#10b981" stroke="#10b981" fillOpacity={0.5} name="Histogram" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* RSI Chart */}
            <div className="w-full h-[150px] bg-card/50 rounded-xl border border-border/50 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2 px-2">
                    <h3 className="text-sm font-medium text-muted-foreground">RSI (14)</h3>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" hide />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} ticks={[30, 70]} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} />
                        <Area type="monotone" dataKey="rsi" stroke="#f59e0b" strokeWidth={2} fillOpacity={0.1} fill="#f59e0b" name="RSI" />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ef4444" y={70} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#10b981" y={30} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
