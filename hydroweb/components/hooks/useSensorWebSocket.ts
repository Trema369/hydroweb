import { useEffect, useState, useRef } from 'react';

export interface SensorData {
    ph: number;
    temperature: number | null;
    turbidity: number;
    tds: number;
}

export interface AnalysisResult {
    score: number;
    status: string;
    overview: string;
    issues: string[];
    recommended_actions: string[];
}

const WS_URL = 'wss://hydro-api.tremaz.dev/ws';

export default function useSensorWebSocket() {
    const [data, setData] = useState<SensorData>({
        ph: 0,
        temperature: null,
        turbidity: 0,
        tds: 0,
    });
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        function connect() {
            wsRef.current = new WebSocket(WS_URL);

            wsRef.current.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'reading') {
                    setData({
                        ph: msg.ph,
                        temperature: msg.temperature,
                        turbidity: msg.turbidity,
                        tds: msg.tds ?? 0,
                    });
                } else if (msg.type === 'analysis') {
                    setAnalysis(msg);
                }
            };

            wsRef.current.onclose = () => {
                reconnectTimer.current = setTimeout(connect, 3000);
            };

            wsRef.current.onerror = () => {
                wsRef.current?.close();
            };
        }

        connect();
        return () => {
            reconnectTimer.current && clearTimeout(reconnectTimer.current);
            wsRef.current?.close();
        };
    }, []);

    return { data, analysis };
}
