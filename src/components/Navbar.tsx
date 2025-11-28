'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Filter, Newspaper, Bitcoin, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/screener', label: 'Screener', icon: Filter },
        { href: '/news', label: 'News', icon: Newspaper },
        { href: '/crypto', label: 'Crypto', icon: Bitcoin },
        { href: '/compare', label: 'Compare', icon: ArrowRightLeft },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <link.icon className="w-4 h-4" />
                        <span className={cn("transition-all duration-300", isActive ? "w-auto opacity-100 ml-1" : "w-0 opacity-0 overflow-hidden")}>
                            {link.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
