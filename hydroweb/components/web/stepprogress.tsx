'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';

export function ProgressWithLabel({
    currentStep,
    totalSteps,
}: {
    currentStep: number;
    totalSteps: number;
}) {
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <Field className="w-full">
            <FieldLabel className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                    {percentage}%
                </span>
            </FieldLabel>

            <Progress
                value={percentage}
                className="w-full h-3 rounded-full transition-all duration-500"
            />
        </Field>
    );
}
