import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
    return (
        <nav
            className="mx-6 lg:mx-12 my-4 px-6 py-5 flex items-center justify-between
                    bg-white/20 dark:bg-gray-900/50
                    backdrop-blur-md
                    rounded-xl
                    shadow-lg
                    border border-white/10 dark:border-gray-700"
        >
            <div className="flex items-center gap-8 relative w-full">
                <Link href="/">
                    <h1 className="text-3xl font-bold">
                        <span className="text-blue-500">Hydro</span>
                        <span className="text-orange-500">Pulse</span>
                    </h1>
                </Link>

                {/* Centered links */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
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
                        href="/plantanalysis"
                    >
                        Plant Analysis
                    </Link>
                </div>
            </div>

            {/* Right-side actions */}
            <div className="flex items-center gap-2">
                <Link
                    className={buttonVariants({ variant: 'outline' })}
                    href="/calculate"
                >
                    Results
                </Link>
                <ThemeToggle />
            </div>
        </nav>
    );
}
