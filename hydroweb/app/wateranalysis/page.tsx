'use client';

import useSensorWebSocket from '@/components/hooks/useSensorWebSocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Gauge from '@/components/web/Guage';
import ScoreChart from '@/components/web/ScoreChart';
import StepIndicator from '@/components/web/StepIndicator';
import { useState } from 'react';
export default function WaterAnalysis() {
    const [step, setStep] = useState(1);
    const { ph, temperature, turbidity, tds } = useSensorWebSocket();
    const totalSteps = 3;

    function nextStep() {
        if (step < totalSteps) setStep(step + 1);
    }

    function prevStep() {
        if (step > 1) setStep(step - 1);
    }
    return (
        <div className="space-y-10 py-10">
            {step < 3 && <StepIndicator currentStep={step} totalSteps={2} />}
            {step < 3 ? (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>
                            {step === 1 && 'Collect Water Sample'}
                            {step === 2 && 'Sensor Readings'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-10">
                        {step === 1 && (
                            <div className="flex flex-col lg:flex-row gap-10 items-stretch">
                                <div className="flex-1 lg:flex-1">
                                    <Card className="bg-orange-500/20 border-orange-500/40 h-full">
                                        <CardHeader>
                                            <CardTitle>
                                                <h2 className="text-lg font-semibold">
                                                    Chart Infomation
                                                </h2>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-2">
                                                <p className="text-sm text-white">
                                                    Ph measures acidity
                                                </p>
                                                <p className="text-sm text-white">
                                                    Temperature is
                                                    self-explanatory
                                                </p>
                                                <p className="text-sm text-white">
                                                    Turbidity measures the
                                                    clearness of water
                                                </p>
                                                <p className="text-sm text-white">
                                                    Conductivity measures TDS
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-full bg-green-500"></span>
                                                <span className="text-sm text-white">
                                                    Safe / Normal
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                                                <span className="text-sm text-white">
                                                    Caution / Moderate
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-full bg-red-500"></span>
                                                <span className="text-sm text-white">
                                                    Danger / Critical
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="flex-2 flex flex-col gap-4">
                                    <h3 className="text-lg text-gray-400 text-center">
                                        Please wait until the gauges complete
                                        their circle
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto">
                                        <Gauge
                                            value={ph}
                                            label="ph"
                                            size={250}
                                        />
                                        <Gauge
                                            value={temperature}
                                            label="Temp"
                                            size={250}
                                        />
                                        <Gauge
                                            value={turbidity}
                                            label="Tubidity"
                                            size={250}
                                        />
                                        <Gauge
                                            value={tds}
                                            label="Tds"
                                            size={250}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="gap-10 items-stretch">
                                <Card className="bg-orange-500/20 border-orange-500/40 h-full">
                                    <CardContent>
                                        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
                                            <div className="flex flex-1 lg:flex-row items-center gap-6">
                                                <ScoreChart
                                                    value={8.3}
                                                    size={200}
                                                />

                                                <Separator
                                                    orientation="vertical"
                                                    className="h-40"
                                                />

                                                <div className="flex-1 flex flex-col justify-start gap-4">
                                                    <h2 className="text-xl font-semibold text-gray-200">
                                                        Summary
                                                    </h2>

                                                    <p className="text-gray-400 text-sm leading-relaxed">
                                                        Please wait until the
                                                        gauges complete their
                                                        circle. Once the
                                                        readings are processed,
                                                        you will see a detailed
                                                        summary of pH,
                                                        temperature, turbidity,
                                                        and conductivity
                                                        measurements, including
                                                        overall water quality
                                                        analysis and safety
                                                        indications.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        <div className="flex justify-end mt-6">
                            <Button onClick={nextStep} variant="default">
                                Next Step
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6 overflow-y-auto max-h-[80vh] p-4">
                    <h1 className="text-2xl font-bold text-gray-200 text-center">
                        Analysis Complete
                    </h1>

                    <div className="flex justify-center gap-4">
                        <Button variant="default" onClick={() => { }}>
                            Download
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                        >
                            Print
                        </Button>
                        <Button variant="secondary" onClick={() => { }}>
                            New Analysis
                        </Button>
                    </div>

                    <Card className="mx-auto max-w-4xl bg-gray-900/50 border-gray-700/40">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-200">
                                Overall Score
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                                <div className="flex justify-center lg:justify-start flex-1">
                                    <ScoreChart value={8.3} size={200} />
                                </div>

                                <Separator
                                    orientation="vertical"
                                    className="hidden lg:block h-40"
                                />

                                <div className="flex-1 flex flex-col justify-start gap-4">
                                    <h2 className="text-xl font-semibold text-gray-200">
                                        Summary
                                    </h2>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Please wait until the gauges complete
                                        their circle. Once the readings are
                                        processed, you will see a detailed
                                        summary of pH, temperature, turbidity,
                                        and conductivity measurements, including
                                        overall water quality analysis and
                                        safety indications.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-800/30 p-4 rounded-lg">
                                <h2 className="text-md font-semibold text-gray-200 mb-2">
                                    AI Overview
                                </h2>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Based on the collected data, the water
                                    sample shows a pH level of 7.0, temperature
                                    at 35°C, turbidity at 45 NTU, and
                                    conductivity at 500 µS/cm. Overall, water
                                    quality is safe with minor adjustments
                                    recommended for optimal clarity.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
