'use client';

import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScreenerFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export function ScreenerFilters({ activeFilter, onFilterChange }: ScreenerFiltersProps) {
    const filters = [
        { id: 'day_gainers', label: 'Top Gainers' },
        { id: 'day_losers', label: 'Top Losers' },
        { id: 'most_actives', label: 'Most Active' },
        { id: 'tech', label: 'Technology' },
        { id: 'finance', label: 'Financial' },
        { id: 'healthcare', label: 'Healthcare' },
        { id: 'energy', label: 'Energy' },
    ];

    return (
        <div className="bg-card/30 border border-border/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-lg transition-all border",
                            activeFilter === filter.id
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
