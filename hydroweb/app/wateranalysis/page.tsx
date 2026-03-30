'use client';

import useSensorWebSocket from '@/components/hooks/useSensorWebSocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Gauge from '@/components/web/Guage';
import ScoreChart from '@/components/web/ScoreChart';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    FlaskConical,
    Waves,
    Thermometer,
    Activity,
    ArrowRight,
    RotateCcw,
    Printer,
    AlertTriangle,
    CheckCircle2,
    Info,
    Loader2,
    ChevronDown,
    HelpCircle,
} from 'lucide-react';

const VPS_ANALYZE_URL = 'https://hydro-api.tremaz.dev/analyze';

// Per-sensor WHO/standard safe ranges
const SENSOR_CONFIG = {
    ph: {
        min: 0,
        max: 14,
        safeMin: 6.5,
        safeMax: 8.5,
        cautionMin: 5.5,
        cautionMax: 9.5,
    },
    temp: {
        min: 0,
        max: 50,
        safeMin: 10,
        safeMax: 25,
        cautionMin: 5,
        cautionMax: 35,
    },
    turbidity: {
        min: 0,
        max: 500,
        safeMin: 0,
        safeMax: 4,
        cautionMin: 0,
        cautionMax: 25,
    },
    tds: {
        min: 0,
        max: 1000,
        safeMin: 0,
        safeMax: 300,
        cautionMin: 0,
        cautionMax: 600,
    },
};

const QA_ITEMS = [
    {
        q: 'What is pH and why does it matter?',
        a: 'pH measures how acidic or alkaline water is on a scale of 0–14. Safe drinking water should be between 6.5 and 8.5. Values outside this range can indicate contamination and may cause health issues or corrode pipes.',
    },
    {
        q: 'What is turbidity?',
        a: 'Turbidity measures how clear the water is in NTU (Nephelometric Turbidity Units). High turbidity means the water is cloudy, which can indicate sediment, bacteria, or chemical contamination. WHO recommends less than 4 NTU for drinking water.',
    },
    {
        q: 'What does TDS mean?',
        a: 'TDS stands for Total Dissolved Solids — the concentration of dissolved minerals, salts, and metals in the water. Below 300 ppm is excellent. Above 600 ppm may affect taste and safety.',
    },
    {
        q: 'Why is temperature monitored?',
        a: 'Water temperature affects the growth of bacteria and the effectiveness of disinfection. Warmer water can promote pathogen growth. Ideal drinking water temperature is between 10–25°C.',
    },
    {
        q: 'How does the AI analysis work?',
        a: 'When you click Run Analysis, the readings are sent to a Mistral AI model which evaluates all parameters together. It returns a safety score (0–10), a status, an overview, detected issues, and recommended actions.',
    },
];

function StepBar({ step }: { step: number }) {
    const steps = ['Live Readings', 'Analysing', 'Results'];
    return (
        <div className="flex items-center gap-2 w-full">
            {steps.map((label, i) => {
                const idx = i + 1;
                const active = idx === step;
                const done = idx < step;
                return (
                    <div key={label} className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                            <div
                                className={cn(
                                    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                                    done
                                        ? 'bg-blue-600 text-white'
                                        : active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-muted text-muted-foreground'
                                )}
                            >
                                {done ? '✓' : idx}
                            </div>
                            <span
                                className={cn(
                                    'text-xs font-medium hidden sm:block truncate',
                                    active
                                        ? 'text-foreground'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    'flex-1 h-px',
                                    done ? 'bg-blue-600' : 'bg-border'
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function SensorRow({
    label,
    value,
    unit,
    icon,
}: {
    label: string;
    value: number | null;
    unit: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
            </div>
            <span className="text-sm font-semibold tabular-nums">
                {value !== null ? `${value.toFixed(2)} ${unit}` : '—'}
            </span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        Good: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
        Moderate:
            'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800',
        Warning:
            'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800',
        Critical:
            'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
    };
    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
                map[status] ?? map['Warning']
            )}
        >
            {status}
        </span>
    );
}

function QACard() {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500" />
                    Water Quality FAQ
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-3">
                {QA_ITEMS.map((item, i) => (
                    <div
                        key={i}
                        className="rounded-lg border border-border overflow-hidden"
                    >
                        <button
                            onClick={() => setOpen(open === i ? null : i)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
                        >
                            <span>{item.q}</span>
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 text-muted-foreground flex-shrink-0 ml-2 transition-transform duration-200',
                                    open === i ? 'rotate-180' : ''
                                )}
                            />
                        </button>
                        {open === i && (
                            <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3 bg-muted/20">
                                {item.a}
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function WaterAnalysis() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { data, analysis } = useSensorWebSocket();
    const { ph, temperature, turbidity, tds } = data;

    async function handleAnalyse() {
        setLoading(true);
        setStep(2);
        try {
            await fetch(VPS_ANALYZE_URL, { method: 'POST' });
            const wait = () =>
                new Promise<void>((resolve) => {
                    const check = setInterval(() => {
                        if (analysis) {
                            clearInterval(check);
                            resolve();
                        }
                    }, 500);
                    setTimeout(() => {
                        clearInterval(check);
                        resolve();
                    }, 15000);
                });
            await wait();
        } catch (e) {
            console.error('Analyse error:', e);
        } finally {
            setLoading(false);
            setStep(3);
        }
    }

    return (
        <div className="min-h-screen w-full px-4 md:px-8 lg:px-16 pt-24 pb-6 flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Step bar */}
            <div className="flex justify-center">
                <div className="w-full max-w-md">
                    <StepBar step={step} />
                </div>
            </div>

            {/* Step 1 — Live Readings */}
            {step === 1 && (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Live Sensor Readings
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Wait for the gauges to stabilise before running
                                the analysis.
                            </p>
                        </div>
                        <Button
                            onClick={handleAnalyse}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-2 flex-shrink-0"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />{' '}
                                    Analysing...
                                </>
                            ) : (
                                <>
                                    Run Analysis{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column — info + FAQ */}
                        <div className="flex flex-col gap-4">
                            {/* Sensor Guide */}
                            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Info className="h-4 w-4 text-blue-500" />
                                        Current Readings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <SensorRow
                                            label="pH"
                                            value={ph}
                                            unit=""
                                            icon={
                                                <FlaskConical className="h-3.5 w-3.5" />
                                            }
                                        />
                                        <SensorRow
                                            label="Temperature"
                                            value={temperature}
                                            unit="°C"
                                            icon={
                                                <Thermometer className="h-3.5 w-3.5" />
                                            }
                                        />
                                        <SensorRow
                                            label="Turbidity"
                                            value={turbidity}
                                            unit="NTU"
                                            icon={
                                                <Waves className="h-3.5 w-3.5" />
                                            }
                                        />
                                        <SensorRow
                                            label="TDS"
                                            value={tds}
                                            unit="ppm"
                                            icon={
                                                <Activity className="h-3.5 w-3.5" />
                                            }
                                        />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        {[
                                            {
                                                color: 'bg-emerald-500',
                                                label: 'Safe / Normal',
                                            },
                                            {
                                                color: 'bg-yellow-400',
                                                label: 'Caution / Moderate',
                                            },
                                            {
                                                color: 'bg-red-500',
                                                label: 'Danger / Critical',
                                            },
                                        ].map(({ color, label }) => (
                                            <div
                                                key={label}
                                                className="flex items-center gap-2"
                                            >
                                                <span
                                                    className={cn(
                                                        'w-3 h-3 rounded-full flex-shrink-0',
                                                        color
                                                    )}
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* FAQ */}
                        </div>

                        {/* Gauges */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">
                                        Sensor Gauges
                                    </CardTitle>
                                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Live
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 place-items-center py-2">
                                    <Gauge
                                        value={ph}
                                        label="pH"
                                        size={200}
                                        minValue={SENSOR_CONFIG.ph.min}
                                        maxValue={SENSOR_CONFIG.ph.max}
                                        safeMin={SENSOR_CONFIG.ph.safeMin}
                                        safeMax={SENSOR_CONFIG.ph.safeMax}
                                        cautionMin={SENSOR_CONFIG.ph.cautionMin}
                                        cautionMax={SENSOR_CONFIG.ph.cautionMax}
                                    />
                                    <Gauge
                                        value={temperature ?? 0}
                                        label="Temp"
                                        unit="°C"
                                        size={200}
                                        minValue={SENSOR_CONFIG.temp.min}
                                        maxValue={SENSOR_CONFIG.temp.max}
                                        safeMin={SENSOR_CONFIG.temp.safeMin}
                                        safeMax={SENSOR_CONFIG.temp.safeMax}
                                        cautionMin={
                                            SENSOR_CONFIG.temp.cautionMin
                                        }
                                        cautionMax={
                                            SENSOR_CONFIG.temp.cautionMax
                                        }
                                    />
                                    <Gauge
                                        value={turbidity}
                                        label="Turbidity"
                                        unit="NTU"
                                        size={200}
                                        minValue={SENSOR_CONFIG.turbidity.min}
                                        maxValue={SENSOR_CONFIG.turbidity.max}
                                        safeMin={
                                            SENSOR_CONFIG.turbidity.safeMin
                                        }
                                        safeMax={
                                            SENSOR_CONFIG.turbidity.safeMax
                                        }
                                        cautionMin={
                                            SENSOR_CONFIG.turbidity.cautionMin
                                        }
                                        cautionMax={
                                            SENSOR_CONFIG.turbidity.cautionMax
                                        }
                                    />
                                    <Gauge
                                        value={tds}
                                        label="TDS"
                                        unit="ppm"
                                        size={200}
                                        minValue={SENSOR_CONFIG.tds.min}
                                        maxValue={SENSOR_CONFIG.tds.max}
                                        safeMin={SENSOR_CONFIG.tds.safeMin}
                                        safeMax={SENSOR_CONFIG.tds.safeMax}
                                        cautionMin={
                                            SENSOR_CONFIG.tds.cautionMin
                                        }
                                        cautionMax={
                                            SENSOR_CONFIG.tds.cautionMax
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <QACard />
                </div>
            )}

            {/* Step 2 — Loading */}
            {step === 2 && (
                <Card className="flex flex-col items-center justify-center p-16 gap-6 text-center">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900/40" />
                        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold">
                            Analysing water quality...
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Mistral AI is evaluating your sensor readings. This
                            takes a few seconds.
                        </p>
                    </div>
                </Card>
            )}

            {/* Step 3 — Results */}
            {step === 3 && (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Analysis Results
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                AI-evaluated water quality report.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.print()}
                                className="gap-2"
                            >
                                <Printer className="h-4 w-4" /> Print
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStep(1)}
                                className="gap-2"
                            >
                                <RotateCcw className="h-4 w-4" /> New Analysis
                            </Button>
                        </div>
                    </div>

                    {analysis ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Score */}
                            <Card className="flex flex-col items-center justify-center p-6 gap-4">
                                <ScoreChart value={analysis.score} size={180} />
                                <div className="text-center space-y-2">
                                    <StatusBadge status={analysis.status} />
                                    <p className="text-xs text-muted-foreground">
                                        Overall Safety Score
                                    </p>
                                </div>
                            </Card>

                            <div className="lg:col-span-2 flex flex-col gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-semibold">
                                            AI Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {analysis.overview}
                                        </p>
                                    </CardContent>
                                </Card>

                                {analysis.issues.length > 0 && (
                                    <Card className="border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                                <AlertTriangle className="h-4 w-4" />{' '}
                                                Detected Issues
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {analysis.issues.map(
                                                    (issue, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                                        >
                                                            <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                            {issue}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}

                                {analysis.recommended_actions.length > 0 && (
                                    <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                                <CheckCircle2 className="h-4 w-4" />{' '}
                                                Recommended Actions
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {analysis.recommended_actions.map(
                                                    (action, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                                        >
                                                            <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            {action}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-semibold">
                                            Readings at Time of Analysis
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {[
                                                {
                                                    label: 'pH',
                                                    value: ph.toFixed(2),
                                                    unit: '',
                                                },
                                                {
                                                    label: 'Temperature',
                                                    value:
                                                        temperature?.toFixed(
                                                            1
                                                        ) ?? '—',
                                                    unit: '°C',
                                                },
                                                {
                                                    label: 'Turbidity',
                                                    value: turbidity.toFixed(1),
                                                    unit: 'NTU',
                                                },
                                                {
                                                    label: 'TDS',
                                                    value: tds.toFixed(0),
                                                    unit: 'ppm',
                                                },
                                            ].map(({ label, value, unit }) => (
                                                <div
                                                    key={label}
                                                    className="flex flex-col gap-0.5"
                                                >
                                                    <span className="text-xs text-muted-foreground">
                                                        {label}
                                                    </span>
                                                    <span className="text-lg font-bold tabular-nums">
                                                        {value}
                                                        <span className="text-xs font-normal text-muted-foreground ml-0.5">
                                                            {unit}
                                                        </span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <Card className="flex flex-col items-center justify-center p-12 gap-4 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <div>
                                <p className="font-semibold">
                                    Waiting for results...
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    The Pi is still processing. This may take a
                                    few more seconds.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStep(1)}
                            >
                                Go back
                            </Button>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
