'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Newspaper } from 'lucide-react';

interface NewsItem {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: number;
    type: string;
}

interface NewsFeedProps {
    symbol: string;
}

export function NewsFeed({ symbol }: NewsFeedProps) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            if (!symbol) return;

            setLoading(true);
            try {
                const res = await fetch(`/api/news?symbol=${symbol}`);
                if (res.ok) {
                    const data = await res.json();
                    setNews(data);
                }
            } catch (error) {
                console.error('Failed to fetch news', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [symbol]);

    if (!symbol) return null;

    return (
        <div className="w-full bg-card/30 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Latest News for {symbol}</h2>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : news.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    No news found for this stock.
                </div>
            ) : (
                <div className="space-y-3">
                    {news.map((item) => (
                        <a
                            key={item.uuid}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 rounded-lg bg-card/50 hover:bg-card/80 border border-border/50 transition-all group"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        <span className="font-semibold">{item.publisher}</span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(item.providerPublishTime * 1000), { addSuffix: true })}</span>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
