'use client';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
    return (
        <nav
            className="fixed top-0 w-full px-6 py-3
                flex items-center justify-between
                backdrop-blur-md
                bg-white/60 dark:bg-[#0a0a0a]/40
                border-b border-gray-300 dark:border-[#262626]
                shadow-lg z-50"
        >
            {/* Logo */}
            <div className="flex-1">
                <Link href="/" className="inline-flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-orange-500" />
                    <h1 className="text-2xl font-extrabold">
                        <span className="text-blue-500">Hydro</span>
                        <span className="text-orange-500">Pulse</span>
                    </h1>
                </Link>
            </div>

            {/* Center links */}
            <div className="flex-1 hidden justify-center gap-4 lg:flex xl:gap-8">
                <Link className={buttonVariants({ variant: 'ghost' })} href="/">
                    Home
                </Link>
                <Link
                    className={buttonVariants({ variant: 'ghost' })}
                    href="/wateranalysis"
                >
                    Water Analysis
                </Link>
                <Link
                    className={buttonVariants({ variant: 'ghost' })}
                    href="/about"
                >
                    About
                </Link>
            </div>

            {/* Right actions */}
            <div className="flex-1 flex justify-end items-center gap-2">
                <Link
                    className={buttonVariants({ variant: 'outline' })}
                    href="/wateranalysis"
                >
                    Live Readings
                </Link>
                <ThemeToggle />
            </div>
        </nav>
    );
}
