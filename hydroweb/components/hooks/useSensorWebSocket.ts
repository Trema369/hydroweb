import { useEffect, useState, useRef } from 'react';

interface SensorData {
    ph: number;
    temperature: number;
    turbidity: number;
}

export default function useSensorWebSocket(url: string) {
    const [data, setData] = useState<SensorData>({
        ph: 0,
        temperature: 0,
        turbidity: 0,
    });
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        wsRef.current = new WebSocket(url);

        wsRef.current.onmessage = (event) => {
            const reading = JSON.parse(event.data);
            setData({
                ph: reading.ph,
                temperature: reading.temperature,
                turbidity: reading.turbidity,
            });
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket closed, attempting reconnect...');
            // Optional: implement reconnect logic here
        };

        return () => wsRef.current?.close();
    }, [url]);

    return data;
}
