'use client';
import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Menu, X, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <>
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
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <h1 className="text-2xl font-extrabold">
                            <span className="text-blue-500">Hydro</span>
                            <span className="text-orange-500">Pulse</span>
                        </h1>
                    </Link>
                </div>

                {/* Center links — desktop only */}
                <div className="flex-1 hidden justify-center gap-4 lg:flex xl:gap-8">
                    <Link
                        className={buttonVariants({ variant: 'ghost' })}
                        href="/"
                    >
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
                        className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'hidden sm:inline-flex'
                        )}
                        href="/wateranalysis"
                    >
                        Live Readings
                    </Link>
                    <ThemeToggle />
                    {/* Hamburger — mobile only */}
                    <button
                        className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {open && (
                <div className="fixed top-[57px] left-0 right-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-300 dark:border-[#262626] lg:hidden">
                    <div className="flex flex-col px-6 py-4 gap-2">
                        <Link
                            href="/"
                            className={buttonVariants({ variant: 'ghost' })}
                            onClick={() => setOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/wateranalysis"
                            className={buttonVariants({ variant: 'ghost' })}
                            onClick={() => setOpen(false)}
                        >
                            Water Analysis
                        </Link>
                        <Link
                            href="/about"
                            className={buttonVariants({ variant: 'ghost' })}
                            onClick={() => setOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/wateranalysis"
                            className={cn(
                                buttonVariants({ variant: 'default' }),
                                'bg-blue-600 hover:bg-blue-500 text-white mt-2'
                            )}
                            onClick={() => setOpen(false)}
                        >
                            Live Readings
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
