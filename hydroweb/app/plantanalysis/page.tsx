'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StepIndicator from '@/components/web/StepIndicator';
import Gauge from '@/components/web/Guage';
import ScoreChart from '@/components/web/ScoreChart';
import { Separator } from '@/components/ui/separator';
import PiCameraFeed from '@/components/web/PiCameraFeed';

export default function PlantAnalysis() {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="space-y-10 py-10">
            {step < 3 && (
                <StepIndicator currentStep={step} totalSteps={totalSteps} />
            )}

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && 'Collect Plant Sample'}
                        {step === 2 && 'Sensor Readings'}
                        {step === 3 && 'Final Results'}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">
                    {step === 1 && (
                        <div className="space-y-4">
                            <PiCameraFeed
                                streamUrl="http://raspberrypi.local:8000/video"
                                width={800}
                                height={600}
                                className="mx-auto mt-4"
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
                            <Card className="flex-1 bg-green-500/20 border-green-500/40 h-full">
                                <CardHeader>
                                    <CardTitle>Chart Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm text-white">
                                        Soil moisture indicates hydration
                                    </p>
                                    <p className="text-sm text-white">
                                        Temperature affects growth
                                    </p>
                                    <p className="text-sm text-white">
                                        Humidity affects transpiration
                                    </p>
                                    <p className="text-sm text-white">
                                        Light intensity affects photosynthesis
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-green-500" />
                                        <span className="text-sm text-white">
                                            Optimal
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-yellow-400" />
                                        <span className="text-sm text-white">
                                            Moderate
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-red-500" />
                                        <span className="text-sm text-white">
                                            Poor
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex-2 flex flex-col gap-4">
                                <h3 className="text-lg text-gray-400 text-center">
                                    Please wait until the gauges complete
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto">
                                    <Gauge value={75} label="SM" size={200} />
                                    <Gauge value={65} label="Temp" size={200} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 overflow-y-auto max-h-[80vh] p-4">
                            <h1 className="text-2xl font-bold text-gray-200 text-center">
                                Plant Analysis Complete
                            </h1>
                            <div className="flex justify-center gap-4">
                                <Button variant="default">Download</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.print()}
                                >
                                    Print
                                </Button>
                                <Button variant="secondary">
                                    New Analysis
                                </Button>
                            </div>

                            <Card>
                                <CardContent>
                                    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                                        <ScoreChart value={7.8} size={200} />
                                        <Separator
                                            orientation="vertical"
                                            className="h-40"
                                        />
                                        <div className="flex-1 flex flex-col justify-start gap-4">
                                            <h2 className="text-xl font-semibold text-gray-200">
                                                Summary
                                            </h2>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                Based on the readings, this
                                                plants soil moisture and light
                                                intensity are optimal.
                                                Temperature is moderate, and
                                                humidity is slightly low.
                                                Overall, the plant is healthy
                                                but could benefit from more
                                                humidity.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {step < 3 && (
                        <div className="flex justify-end mt-6">
                            <Button onClick={nextStep} variant="default">
                                Next Step
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
