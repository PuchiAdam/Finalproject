'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { Loader2, Newspaper, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface NewsItem {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: number;
    type: string;
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/news/general');
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
    }, []);

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Market News</h1>
                            <p className="text-muted-foreground">Latest updates from the global financial markets.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <SearchBar className="w-full md:w-[300px]" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((item) => (
                            <a
                                key={item.uuid}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col p-6 rounded-xl bg-card/30 border border-border/50 hover:bg-card/50 hover:border-primary/20 transition-all group h-full backdrop-blur-sm"
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Newspaper className="w-5 h-5" />
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-3">
                                    {item.title}
                                </h3>
                                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">{item.publisher}</span>
                                    <span>{formatDistanceToNow(new Date(item.providerPublishTime * 1000), { addSuffix: true })}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
