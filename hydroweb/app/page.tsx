'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
    Droplets,
    Activity,
    Wifi,
    FlaskConical,
    Thermometer,
    Waves,
    ArrowRight,
    Github,
    Globe,
    CheckCircle2,
} from 'lucide-react';
function FeatureCard({
    icon,
    title,
    desc,
    accent,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    accent: string;
}) {
    return (
        <Card className="bg-white dark:bg-[#111111] border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333] transition-all duration-300 hover:-translate-y-0.5 group">
            <CardHeader className="pb-2">
                <div
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg border mb-2 transition-colors duration-300',
                        accent
                    )}
                >
                    {icon}
                </div>
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-xs leading-relaxed">
                    {desc}
                </CardDescription>
            </CardContent>
        </Card>
    );
}

function StepCard({
    step,
    title,
    desc,
    accent,
    iconColor,
}: {
    step: string;
    title: string;
    desc: string;
    accent: string;
    iconColor: string;
}) {
    return (
        <div className="relative flex flex-col gap-3 p-6 rounded-xl border border-gray-200 dark:border-[#1e1e1e] bg-gray-50 dark:bg-[#0d0d0d]">
            <span
                className={cn(
                    'text-6xl font-black leading-none select-none opacity-10',
                    iconColor
                )}
            >
                {step}
            </span>
            <div className="absolute top-6 left-6">
                <span
                    className={cn(
                        'text-xs font-bold tracking-widest uppercase',
                        accent
                    )}
                >
                    {step}
                </span>
            </div>
            <h3 className="text-sm font-semibold mt-2">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
                {desc}
            </p>
        </div>
    );
}

export default function Home() {
    const features = [
        {
            icon: <FlaskConical className="h-4 w-4" />,
            title: 'pH Monitoring',
            desc: 'Continuous pH sensing to determine acidity and alkalinity. Safe drinking water falls between 6.5 and 8.5.',
            accent: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400',
        },
        {
            icon: <Waves className="h-4 w-4" />,
            title: 'Turbidity Sensing',
            desc: 'Measures water clarity in NTU. High turbidity may indicate sediment, bacteria, or chemical contamination.',
            accent: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400',
        },
        {
            icon: <Thermometer className="h-4 w-4" />,
            title: 'Temperature Tracking',
            desc: 'Temperature affects chemical reactions and pathogen growth. Monitored continuously for safe thresholds.',
            accent: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400',
        },
        {
            icon: <Activity className="h-4 w-4" />,
            title: 'TDS / Conductivity',
            desc: 'Total dissolved solids indicate the concentration of minerals and salts present in the water sample.',
            accent: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400',
        },
        {
            icon: <Wifi className="h-4 w-4" />,
            title: 'Real-time Web Access',
            desc: 'Live sensor readings streamed via WebSocket to any device — no app install required.',
            accent: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400',
        },
        {
            icon: <Droplets className="h-4 w-4" />,
            title: 'AI Safety Analysis',
            desc: 'Mistral AI evaluates all readings and returns a safety score, status, and actionable recommendations.',
            accent: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400',
        },
    ];

    return (
        <main className="min-h-screen w-full bg-background text-foreground flex flex-col relative">
            {/* Global background blobs */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl pointer-events-none z-0" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-500/5 dark:bg-orange-500/8 blur-3xl pointer-events-none z-0" />
            <section className="w-full px-6 md:px-12 lg:px-20 pt-32 pb-24 relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-8">
                    <div className="space-y-5 max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                            Know if your water{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600">
                                is safe
                            </span>
                            .
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            HydroPulse is a smart borehole water quality
                            monitoring system. Sensors on a Raspberry Pi measure
                            pH, turbidity, temperature, and conductivity — then
                            AI evaluates whether the water is safe to drink.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/wateranalysis"
                            className={cn(
                                buttonVariants({ size: 'lg' }),
                                'bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-2'
                            )}
                        >
                            View Live Readings
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/wateranalysis"
                            className={cn(
                                buttonVariants({
                                    variant: 'outline',
                                    size: 'lg',
                                }),
                                'gap-2'
                            )}
                        >
                            Run Analysis
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-6 border-t border-border">
                        {[
                            { label: 'Sensors Active', value: '4' },
                            { label: 'Update Interval', value: '5s' },
                            { label: 'AI Model', value: 'Mistral' },
                            { label: 'Deployment', value: 'Live' },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex flex-col gap-0.5">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {value}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="w-full border-y border-border bg-background py-20">
                <div className="w-full px-6 md:px-12 lg:px-20 space-y-10">
                    <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                            How it works
                        </Badge>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Three steps to safe water.
                        </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <StepCard
                            step="01"
                            title="Collect a sample"
                            desc="Submerge the sensor array into the borehole water. The Raspberry Pi begins reading immediately."
                            accent="text-blue-600 dark:text-blue-400"
                            iconColor="text-blue-600"
                        />
                        <StepCard
                            step="02"
                            title="Read the sensors"
                            desc="pH, turbidity, temperature, and TDS are sampled every 5 seconds and pushed to the cloud."
                            accent="text-slate-500"
                            iconColor="text-slate-500"
                        />
                        <StepCard
                            step="03"
                            title="Get AI results"
                            desc="Hit Analyse. Mistral evaluates all readings and returns a safety score with recommended actions."
                            accent="text-orange-600 dark:text-orange-400"
                            iconColor="text-orange-600"
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="w-full px-6 md:px-12 lg:px-20 py-20 space-y-10">
                <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                        Capabilities
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        What we measure.
                    </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f) => (
                        <FeatureCard key={f.title} {...f} />
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="w-full px-6 md:px-12 lg:px-20 pb-20">
                <div className="relative overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-[#0d0d0d] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{
                            background:
                                'radial-gradient(ellipse at 0% 50%, #3b82f615 0%, transparent 60%)',
                        }}
                    />
                    <div className="relative z-10 space-y-4 max-w-md">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Ready to test your water?
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Open the live dashboard, wait for the gauges to
                            stabilise, then run an AI analysis in one click.
                        </p>
                        <ul className="space-y-1.5 pt-1">
                            {[
                                'No account required',
                                'Results in under 10 seconds',
                                'Actionable recommendations',
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative z-10 flex-shrink-0">
                        <Link
                            href="/wateranalysis"
                            className={cn(
                                buttonVariants({ size: 'lg' }),
                                'bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-2'
                            )}
                        >
                            Open Dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-border bg-background mt-auto">
                <div className="w-full px-6 md:px-12 lg:px-20 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <span className="font-extrabold text-base">
                            <span className="text-blue-500">Hydro</span>
                            <span className="text-orange-500">Pulse</span>
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
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
                            href="/wateranalysis"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Water Analysis
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
                <div className="w-full px-6 md:px-12 lg:px-20 py-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} HydroPulse. Built for
                        science fair.
                    </p>
                </div>
            </footer>
        </main>
    );
}
