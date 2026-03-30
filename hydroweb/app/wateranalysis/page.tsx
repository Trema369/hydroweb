'use client';

import useSensorWebSocket from '@/components/hooks/useSensorWebSocket';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

const VPS_ANALYZE_URL = 'https://hydro-api.tremaz.dev/analyze';

function StepBar({ step }: { step: number }) {
    const steps = ['Collect Sample', 'Analyse', 'Results'];
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

export default function WaterAnalysis() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { data, analysis } = useSensorWebSocket();
    const { ph, temperature, turbidity, tds } = data;

    async function handleAnalyse() {
        setLoading(true);
        try {
            await fetch(VPS_ANALYZE_URL, { method: 'POST' });
            // Move to results once analysis arrives via WebSocket
            // Poll until analysis is available
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
        <div className="min-h-screen w-full px-4 md:px-8 lg:px-16 pt-24 pb-6 flex flex-col gap-6">
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
                        {/* Info panel */}
                        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Info className="h-4 w-4 text-blue-500" />
                                    Sensor Guide
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
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
                                        icon={<Waves className="h-3.5 w-3.5" />}
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

                        {/* Gauges */}
                        {/* Gauges */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">
                                        Live Readings
                                    </CardTitle>
                                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Live
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-6 place-items-center py-4">
                                    <Gauge
                                        value={ph}
                                        label="pH"
                                        size={220}
                                        maxValue={14}
                                    />
                                    <Gauge
                                        value={temperature ?? 0}
                                        label="Temp"
                                        unit="°C"
                                        size={220}
                                        maxValue={50}
                                    />
                                    <Gauge
                                        value={turbidity}
                                        label="Turbidity"
                                        unit="NTU"
                                        size={220}
                                        maxValue={500}
                                    />
                                    <Gauge
                                        value={tds}
                                        label="TDS"
                                        unit="ppm"
                                        size={220}
                                        maxValue={1000}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
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
                            {/* Score card */}
                            <Card className="flex flex-col items-center justify-center p-6 gap-4 bg-card">
                                <ScoreChart value={analysis.score} size={180} />
                                <div className="text-center space-y-2">
                                    <StatusBadge status={analysis.status} />
                                    <p className="text-xs text-muted-foreground">
                                        Overall Safety Score
                                    </p>
                                </div>
                            </Card>

                            {/* Overview + details */}
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                {/* Overview */}
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

                                {/* Issues */}
                                {analysis.issues.length > 0 && (
                                    <Card className="border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                                <AlertTriangle className="h-4 w-4" />
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

                                {/* Recommendations */}
                                {analysis.recommended_actions.length > 0 && (
                                    <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                                <CheckCircle2 className="h-4 w-4" />
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

                                {/* Raw readings summary */}
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
                                    Waiting for analysis results...
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    The Pi is processing your request. This may
                                    take a few seconds.
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
