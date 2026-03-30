'use client';

import { useEffect, useRef } from 'react';

interface GaugeProps {
    value: number;
    minValue?: number;
    maxValue?: number;
    label?: string;
    unit?: string;
    size?: number;
    // Safe range — values inside this range are green
    safeMin?: number;
    safeMax?: number;
    // Caution range edges — outside safe but within caution = yellow
    cautionMin?: number;
    cautionMax?: number;
}

function getSeverityColor(
    value: number,
    safeMin?: number,
    safeMax?: number,
    cautionMin?: number,
    cautionMax?: number
): { color: string; label: string } {
    if (safeMin !== undefined && safeMax !== undefined) {
        if (value >= safeMin && value <= safeMax) {
            return { color: '#22c55e', label: 'Safe' };
        }
        if (cautionMin !== undefined && cautionMax !== undefined) {
            if (value >= cautionMin && value <= cautionMax) {
                return { color: '#facc15', label: 'Caution' };
            }
        }
        return { color: '#ef4444', label: 'Critical' };
    }
    return { color: '#22c55e', label: 'Safe' };
}

export default function Gauge({
    value,
    minValue = 0,
    maxValue = 100,
    label = 'Sensor',
    unit = '',
    size = 220,
    safeMin,
    safeMax,
    cautionMin,
    cautionMax,
}: GaugeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const clampedValue = Math.min(Math.max(value, minValue), maxValue);
    const percentage = (clampedValue - minValue) / (maxValue - minValue);

    const { color: gaugeColor, label: severityLabel } = getSeverityColor(
        value,
        safeMin,
        safeMax,
        cautionMin,
        cautionMax
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = size;
        const h = size * 0.65;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);

        const isDark = document.documentElement.classList.contains('dark');

        const cx = w / 2;
        const cy = h * 0.92;
        const radius = w * 0.38;
        const strokeWidth = w * 0.09;

        ctx.clearRect(0, 0, w, h);

        const startAngle = Math.PI;
        const endAngle = 0;

        // Background track
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = isDark
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(0,0,0,0.08)';
        ctx.stroke();

        // Draw safe zone as a subtle arc on the track if safeMin/safeMax provided
        if (safeMin !== undefined && safeMax !== undefined) {
            const safeStartPct = (safeMin - minValue) / (maxValue - minValue);
            const safeEndPct = (safeMax - minValue) / (maxValue - minValue);
            const safeStartAngle = Math.PI + safeStartPct * Math.PI;
            const safeEndAngle = Math.PI + safeEndPct * Math.PI;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, safeStartAngle, safeEndAngle);
            ctx.lineWidth = strokeWidth;
            ctx.lineCap = 'butt';
            ctx.strokeStyle = isDark
                ? 'rgba(34,197,94,0.12)'
                : 'rgba(34,197,94,0.15)';
            ctx.stroke();
        }

        // Value arc
        const valueAngle = startAngle + percentage * Math.PI;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, valueAngle);
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = gaugeColor;
        ctx.shadowBlur = w * 0.05;
        ctx.shadowColor = gaugeColor;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Tick marks
        [0, 0.25, 0.5, 0.75, 1].forEach((t) => {
            const angle = Math.PI + t * Math.PI;
            const innerR = radius - strokeWidth / 2 - 3;
            const outerR = radius + strokeWidth / 2 + 3;
            ctx.beginPath();
            ctx.moveTo(
                cx + Math.cos(angle) * innerR,
                cy + Math.sin(angle) * innerR
            );
            ctx.lineTo(
                cx + Math.cos(angle) * outerR,
                cy + Math.sin(angle) * outerR
            );
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = isDark
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(0,0,0,0.12)';
            ctx.stroke();
        });

        // Center dot
        ctx.beginPath();
        ctx.arc(cx, cy, strokeWidth * 0.35, 0, 2 * Math.PI);
        ctx.fillStyle = gaugeColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = gaugeColor;
        ctx.fill();
        ctx.shadowBlur = 0;
    }, [
        value,
        percentage,
        gaugeColor,
        size,
        safeMin,
        safeMax,
        minValue,
        maxValue,
    ]);

    const displayValue = Number.isFinite(value)
        ? value % 1 === 0
            ? value.toString()
            : value.toFixed(1)
        : '—';

    return (
        <div
            className="flex flex-col items-center gap-1"
            style={{ width: size }}
        >
            <canvas ref={canvasRef} />
            <div className="flex flex-col items-center -mt-2">
                <span
                    className="font-black tabular-nums leading-none"
                    style={{ fontSize: size * 0.13, color: gaugeColor }}
                >
                    {displayValue}
                    {unit && (
                        <span
                            className="font-normal text-muted-foreground"
                            style={{ fontSize: size * 0.065 }}
                        >
                            {' '}
                            {unit}
                        </span>
                    )}
                </span>
                <span
                    className="text-muted-foreground font-medium tracking-wide uppercase mt-1"
                    style={{ fontSize: size * 0.055 }}
                >
                    {label}
                </span>
                <span
                    className="mt-1.5 px-2 py-0.5 rounded-full text-white font-semibold"
                    style={{
                        fontSize: size * 0.048,
                        backgroundColor: gaugeColor,
                    }}
                >
                    {severityLabel}
                </span>
            </div>
        </div>
    );
}
