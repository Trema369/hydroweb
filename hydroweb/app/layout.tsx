import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/web/navbar';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Droplets, Github, Globe } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});
const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'HydroPulse — Water Quality Monitor',
    description: 'Smart borehole water quality monitoring with AI analysis',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* Global background blobs */}
                    <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl pointer-events-none z-0" />
                    <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-500/5 dark:bg-orange-500/8 blur-3xl pointer-events-none z-0" />

                    <div className="relative z-10 min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 w-full">{children}</main>

                        {/* Global footer */}
                        <footer className="w-full border-t border-border bg-background/80 backdrop-blur-sm mt-auto">
                            <div className="w-full px-6 md:px-12 lg:px-20 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Droplets className="h-4 w-4 text-blue-500" />
                                    <span className="font-extrabold text-sm">
                                        <span className="text-blue-500">
                                            Hydro
                                        </span>
                                        <span className="text-orange-500">
                                            Pulse
                                        </span>
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-1">
                                        Water Quality Monitor
                                    </span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <Link
                                        href="/wateranalysis"
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/"
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Github className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Globe className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                            <Separator />
                            <div className="px-6 md:px-12 lg:px-20 py-3">
                                <p className="text-xs text-muted-foreground">
                                    © {new Date().getFullYear()} HydroPulse.
                                    Built for science fair.
                                </p>
                            </div>
                        </footer>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
