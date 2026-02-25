'use client';

import { useEffect, useRef } from 'react';

interface ScoreGaugeProps {
    value: number; // between 1.0 and 10.0
    size?: number;
}

export default function ScoreChart({ value, size = 200 }: ScoreGaugeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Clamp value between 1 and 10
    const clampedValue = Math.min(Math.max(value, 1), 10);
    const minValue = 1;
    const maxValue = 10;
    const percentage = (clampedValue - minValue) / (maxValue - minValue);

    // Determine gauge color based on score
    const gaugeColor =
        clampedValue < 4
            ? '#ef4444' // red
            : clampedValue < 7
                ? '#facc15' // yellow
                : '#22c55e'; // green

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
        const innerRadius = radius * 0.6;

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

        // Inner circle colored same as gauge
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = gaugeColor + '33'; // semi-transparent
        ctx.fill();
    }, [clampedValue, percentage, gaugeColor, size]);

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
                    width: '80%',
                }}
            >
                <div
                    style={{
                        fontSize: size * 0.6 * 0.15,
                        fontWeight: 'bold',
                        color: '#969997',
                        lineHeight: 1.1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    Score
                </div>
                <div
                    style={{
                        fontSize: size * 0.6 * 0.3,
                        fontWeight: 'bold',
                        color: 'white',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {clampedValue.toFixed(1)}
                </div>
            </div>
        </div>
    );
}
