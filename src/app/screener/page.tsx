'use client';

import { useState, useEffect } from 'react';
import { ScreenerFilters } from '@/components/ScreenerFilters';
import { ScreenerResults } from '@/components/ScreenerResults';
import { SearchBar } from '@/components/SearchBar';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ScreenerPage() {
    const [filter, setFilter] = useState('day_gainers');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/screener?sector=${filter}`);
                if (res.ok) {
                    const jsonData = await res.json();
                    setData(jsonData);
                }
            } catch (error) {
                console.error('Failed to fetch screener data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filter]);

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Stock Screener</h1>
                            <p className="text-muted-foreground">Discover stocks based on market trends and sectors.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <SearchBar className="w-full md:w-[300px]" />
                    </div>
                </div>

                <ScreenerFilters activeFilter={filter} onFilterChange={setFilter} />

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ScreenerResults data={data} />
                )}
            </div>
        </div>
    );
}
