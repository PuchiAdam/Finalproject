'use client';

import { useState } from 'react';
import { Loader2, Brain, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAnalysisProps {
    symbol: string;
    price: number;
    indicators: any;
}

interface AnalysisResult {
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    reasoning: string;
    confidence: number;
}

export function AIAnalysis({ symbol, price, indicators }: AIAnalysisProps) {
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchAnalysis = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/ai-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, price, indicators }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.details || 'Failed to fetch analysis');
            }

            setAnalysis(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRecommendationColor = (rec: string) => {
        switch (rec) {
            case 'BUY': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'SELL': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        }
    };

    const getRecommendationIcon = (rec: string) => {
        switch (rec) {
            case 'BUY': return <TrendingUp className="w-5 h-5" />;
            case 'SELL': return <TrendingDown className="w-5 h-5" />;
            default: return <Minus className="w-5 h-5" />;
        }
    };

    return (
        <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Brain className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">AI Market Analysis</h3>
                        <p className="text-xs text-muted-foreground">Powered by OpenAI GPT-4o</p>
                    </div>
                </div>
                {!analysis && !loading && (
                    <button
                        onClick={fetchAnalysis}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                    >
                        Generate Analysis
                    </button>
                )}
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in">
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                        <Loader2 className="w-10 h-10 animate-spin text-purple-500 relative z-10" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        Analyzing market patterns & indicators...
                    </p>
                </div>
            )}

            {error && (
                <div className="flex items-start gap-3 text-red-500 bg-red-500/5 border border-red-500/10 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-medium">Analysis Failed</p>
                        <p className="text-red-500/80">{error}</p>
                        <button
                            onClick={fetchAnalysis}
                            className="text-xs font-medium hover:underline mt-2"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {analysis && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg border", getRecommendationColor(analysis.recommendation))}>
                                {getRecommendationIcon(analysis.recommendation)}
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Recommendation</div>
                                <div className={cn("text-xl font-bold", getRecommendationColor(analysis.recommendation).split(' ')[0])}>
                                    {analysis.recommendation}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Confidence</div>
                            <div className="text-xl font-bold flex items-center justify-end gap-1">
                                {analysis.confidence}%
                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden ml-2">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 ease-out"
                                        style={{ width: `${analysis.confidence}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            Analysis Summary
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/50">
                            {analysis.reasoning}
                        </p>
                    </div>

                    <div className="pt-2 flex justify-end border-t border-border/50">
                        <button
                            onClick={fetchAnalysis}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                            <Brain className="w-3 h-3" />
                            Regenerate Analysis
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
