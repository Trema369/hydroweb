'use client';

import { useEffect, useRef } from 'react';

interface PiCameraFeedProps {
    streamUrl: string; // The URL of your FastAPI video stream
    width?: number; // optional width
    height?: number; // optional height
    className?: string; // for tailwind styling
}

export default function PiCameraFeed({
    streamUrl,
    width = 640,
    height = 480,
    className = '',
}: PiCameraFeedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        // For live streaming, we just set the src
        videoRef.current.src = streamUrl;
        videoRef.current.play().catch((err) => {
            console.error('Failed to play stream:', err);
        });
    }, [streamUrl]);

    return (
        <div
            className={`bg-black rounded-lg overflow-hidden ${className}`}
            style={{ width, height }}
        >
            <video
                ref={videoRef}
                width={width}
                height={height}
                autoPlay
                muted
                controls={false}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
