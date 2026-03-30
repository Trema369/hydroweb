'use client';

import { useEffect, useRef } from 'react';

interface GaugeProps {
    value: number;
    minValue?: number;
    maxValue?: number;
    label?: string;
    unit?: string;
    size?: number;
}

export default function Gauge({
    value,
    minValue = 0,
    maxValue = 100,
    label = 'Sensor',
    unit = '',
    size = 220,
}: GaugeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const clampedValue = Math.min(Math.max(value, minValue), maxValue);
    const percentage = (clampedValue - minValue) / (maxValue - minValue);

    // Color based on severity
    const gaugeColor =
        percentage < 0.5
            ? '#22c55e' // safe - green
            : percentage < 0.75
                ? '#facc15' // caution - yellow
                : '#ef4444'; // danger - red

    const gaugeColorDim = gaugeColor + '30';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = size;
        const h = size * 0.65; // shorter height since it's a half gauge

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);

        const isDark = document.documentElement.classList.contains('dark');

        const cx = w / 2;
        const cy = h * 0.92; // push center down so arc sits near bottom
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

        // Tick marks at 0%, 50%, 100%
        const ticks = [0, 0.25, 0.5, 0.75, 1];
        ticks.forEach((t) => {
            const angle = Math.PI + t * Math.PI;
            const innerR = radius - strokeWidth / 2 - 4;
            const outerR = radius + strokeWidth / 2 + 4;
            const x1 = cx + Math.cos(angle) * innerR;
            const y1 = cy + Math.sin(angle) * innerR;
            const x2 = cx + Math.cos(angle) * outerR;
            const y2 = cy + Math.sin(angle) * outerR;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
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
    }, [value, percentage, gaugeColor, size]);

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

            {/* Value + label below the arc */}
            <div className="flex flex-col items-center -mt-2">
                <span
                    className="font-black tabular-nums leading-none"
                    style={{
                        fontSize: size * 0.13,
                        color: gaugeColor,
                    }}
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
                {/* Severity pill */}
                <span
                    className="mt-1.5 px-2 py-0.5 rounded-full text-white font-semibold"
                    style={{
                        fontSize: size * 0.048,
                        backgroundColor: gaugeColor,
                    }}
                >
                    {percentage < 0.5
                        ? 'Safe'
                        : percentage < 0.75
                            ? 'Caution'
                            : 'Critical'}
                </span>
            </div>
        </div>
    );
}
