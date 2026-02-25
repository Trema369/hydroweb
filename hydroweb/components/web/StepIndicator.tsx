'use client';

import { ProgressWithLabel } from './stepprogress.tsx';

export default function StepIndicator({
    currentStep,
    totalSteps,
}: {
    currentStep: number;
    totalSteps: number;
}) {
    return (
        <div className="space-y-6">
            {/* 🔥 Progress Bar Only */}
            <ProgressWithLabel
                currentStep={currentStep}
                totalSteps={totalSteps}
            />
        </div>
    );
}
