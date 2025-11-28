import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AdviceCardProps {
    advice: {
        action: string;
        reason: string;
        score: number;
    };
}

export function AdviceCard({ advice }: AdviceCardProps) {
    const { action, reason, score } = advice;

    let colorClass = 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
    let Icon = Minus;

    if (action === 'BUY') {
        colorClass = 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
        Icon = TrendingUp;
    } else if (action === 'SELL') {
        colorClass = 'text-red-500 border-red-500/20 bg-red-500/10';
        Icon = TrendingDown;
    }

    return (
        <div className={cn("p-6 rounded-2xl border backdrop-blur-sm flex flex-col items-center text-center space-y-4", colorClass)}>
            <div className="w-16 h-16 rounded-full bg-background/50 flex items-center justify-center shadow-lg">
                <Icon className="w-8 h-8" />
            </div>

            <div>
                <h2 className="text-3xl font-bold tracking-tight">{action}</h2>
                <div className="text-sm font-medium opacity-80">Recommendation</div>
            </div>

            <div className="w-full bg-background/30 h-2 rounded-full overflow-hidden">
                <div
                    className="h-full bg-current transition-all duration-1000 ease-out"
                    style={{ width: `${score}%` }}
                />
            </div>

            <p className="text-sm opacity-90 max-w-xs">
                {reason}
            </p>
        </div>
    );
}
