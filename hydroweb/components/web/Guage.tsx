'use client';

import { useEffect, useRef } from 'react';

interface GaugeProps {
    value: number;
    minValue?: number;
    maxValue?: number;
    label?: string;
    size?: number;
}

export default function Gauge({
    value,
    minValue = 0,
    maxValue = 100,
    label = 'Sensor',
    size = 200,
}: GaugeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const percentage = (value - minValue) / (maxValue - minValue);

    const gaugeColor =
        percentage < 0.6
            ? '#22c55e'
            : percentage < 0.85
                ? '#facc15'
                : '#ef4444';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = size;
        const height = size;
        canvas.width = width;
        canvas.height = height;

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width / 2 - width * 0.12;
        const innerRadius = radius * 0.6; // inner circle radius

        ctx.clearRect(0, 0, width, height);

        // Background ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.lineWidth = width * 0.14;
        ctx.shadowBlur = width * 0.08;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Value arc
        ctx.beginPath();
        ctx.arc(
            centerX,
            centerY,
            radius,
            -Math.PI / 2,
            -Math.PI / 2 + 2 * Math.PI * percentage
        );
        ctx.lineWidth = width * 0.07;
        ctx.lineCap = 'round';
        ctx.strokeStyle = gaugeColor;
        ctx.shadowBlur = width * 0.06;
        ctx.shadowColor = gaugeColor;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fill();
    }, [value, percentage, gaugeColor, size]);

    return (
        <div
            style={{
                width: size,
                height: size,
                position: 'relative',
            }}
        >
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            {/* Centered label & value */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    width: '80%', // leave padding inside inner circle
                }}
            >
                <div
                    style={{
                        fontSize: size * 0.6 * 0.15, // 15% of inner circle radius
                        fontWeight: 'bold',
                        color: '#969997',
                        lineHeight: 1.1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {label}
                </div>
                <div
                    style={{
                        fontSize: size * 0.6 * 0.3, // 30% of inner circle radius
                        fontWeight: 'bold',
                        color: 'white',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {Math.round(value)}
                </div>
            </div>
        </div>
    );
}
