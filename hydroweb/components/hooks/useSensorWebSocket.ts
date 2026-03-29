import { useEffect, useState, useRef } from 'react';

interface SensorData {
    ph: number;
    temperature: number | null;
    turbidity: number;
    tds: number;
}

const WS_URL = 'wss://hydro-api.tremaz.dev/ws';

export default function useSensorWebSocket() {
    const [data, setData] = useState<SensorData>({
        ph: 0,
        temperature: null,
        turbidity: 0,
        tds: 0,
    });
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        function connect() {
            wsRef.current = new WebSocket(WS_URL);

            wsRef.current.onmessage = (event) => {
                const reading = JSON.parse(event.data);
                setData({
                    ph: reading.ph,
                    temperature: reading.temperature,
                    turbidity: reading.turbidity,
                    tds: reading.tds ?? 0,
                });
            };

            wsRef.current.onclose = () => {
                console.log('WebSocket closed, reconnecting in 3s...');
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

    return data;
}
