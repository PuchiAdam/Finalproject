'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WatchlistButtonProps {
    symbol: string;
    className?: string;
}

export function WatchlistButton({ symbol, className }: WatchlistButtonProps) {
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => {
        const checkWatchlist = () => {
            const saved = localStorage.getItem('stock-track-watchlist');
            if (saved) {
                const list = JSON.parse(saved);
                setIsInWatchlist(list.includes(symbol));
            }
        };

        checkWatchlist();
        window.addEventListener('watchlist-update', checkWatchlist);
        return () => window.removeEventListener('watchlist-update', checkWatchlist);
    }, [symbol]);

    const toggleWatchlist = () => {
        const saved = localStorage.getItem('stock-track-watchlist');
        let list: string[] = saved ? JSON.parse(saved) : [];

        if (isInWatchlist) {
            list = list.filter(s => s !== symbol);
        } else {
            if (!list.includes(symbol)) {
                list.push(symbol);
            }
        }

        localStorage.setItem('stock-track-watchlist', JSON.stringify(list));
        window.dispatchEvent(new Event('watchlist-update'));
        setIsInWatchlist(!isInWatchlist);
    };

    return (
        <button
            onClick={toggleWatchlist}
            className={cn(
                "p-2 rounded-full transition-all duration-200 border",
                isInWatchlist
                    ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
                    : "bg-muted/50 border-border hover:bg-muted hover:text-primary",
                className
            )}
            title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
            <Star className={cn("w-5 h-5", isInWatchlist && "fill-current")} />
        </button>
    );
}
