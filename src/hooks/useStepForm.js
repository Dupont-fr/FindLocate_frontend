// src/hooks/useStepForm.js
import { useState } from 'react'

export const useStepForm = (totalSteps) => {
  const [step, setStep] = useState(1)

  const next = () => setStep((prev) => Math.min(prev + 1, totalSteps))
  const prev = () => setStep((prev) => Math.max(prev - 1, 1))
  const resetSteps = () => setStep(1)

  return { step, next, prev, resetSteps, isLast: step === totalSteps }
}
