'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
    symbol: string;
    shortname?: string;
    longname?: string;
    exchange?: string;
    quoteType?: string;
}

export function SearchBar({ className }: { className?: string }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchStocks = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/stock/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (data.quotes) {
                    setResults(data.quotes.filter((q: any) => q.isYahooFinance)); // Filter mostly for valid stocks
                } else {
                    // yahoo-finance2 search returns array directly sometimes or object with quotes
                    // Let's handle array if it returns array
                    if (Array.isArray(data)) {
                        setResults(data);
                    } else {
                        setResults([]);
                    }
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchStocks, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSelect = (symbol: string) => {
        router.push(`/stock/${symbol}`);
        setShowResults(false);
        setQuery('');
    };

    return (
        <div ref={wrapperRef} className={cn("relative w-full max-w-2xl", className)}>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    placeholder="Search for a stock (e.g., AAPL, TSLA)..."
                    className="w-full h-14 pl-12 pr-4 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg transition-all text-lg"
                />
                {loading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 animate-spin" />
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    {results.map((result) => (
                        <button
                            key={result.symbol}
                            onClick={() => handleSelect(result.symbol)}
                            className="w-full px-6 py-4 text-left hover:bg-muted/50 transition-colors flex items-center justify-between group"
                        >
                            <div>
                                <div className="font-bold text-foreground group-hover:text-primary transition-colors">{result.symbol}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[300px]">{result.shortname || result.longname}</div>
                            </div>
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                {result.exchange}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
