import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type Phase = 'INPUT' | 'ANALYSIS' | 'DECISION'

export interface ChainStep {
  phase: Phase
  icon: string
  text: string
}

export const PHASE_COLORS: Record<Phase, { dot: string; text: string; bg: string }> = {
  INPUT:    { dot: '#7AB8A0', text: '#5A9880', bg: 'rgba(122,184,160,0.1)' },
  ANALYSIS: { dot: '#C8A96E', text: '#B8935A', bg: 'rgba(200,169,110,0.1)' },
  DECISION: { dot: '#57C878', text: '#2F8F58', bg: 'rgba(87,200,120,0.1)'  },
}

const PHASES: Phase[] = ['INPUT', 'ANALYSIS', 'DECISION']

interface Props {
  chain: ChainStep[]
  phaseLabels: Record<Phase, string>
  headerText: string
  footerText: string
  stepMs?: number
  /**
   * When explicitly set to `false`, the chain pauses at the final step
   * (keeps it pulsing/active) until this becomes `true` or `undefined`.
   * Use this to synchronise completion with an in-flight API call.
   */
  isDataReady?: boolean
  /** Called once when every step has been marked complete. */
  onComplete?: () => void
}

export default function ReasoningChainLoader({
  chain,
  phaseLabels,
  headerText,
  footerText,
  stepMs = 1100,
  isDataReady,
  onComplete,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  // Advance through steps; pause on the last step until isDataReady !== false
  useEffect(() => {
    if (currentStep >= chain.length) return

    const isLastStep = currentStep === chain.length - 1
    // Pause the last step when caller signals data isn't ready yet
    if (isLastStep && isDataReady === false) return

    // Once data arrives, complete the last step quickly for a satisfying finish
    const delay = isLastStep && isDataReady === true ? 400 : stepMs
    const timer = setTimeout(() => {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      setCurrentStep((s) => s + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [currentStep, chain.length, stepMs, isDataReady])

  // Fire onComplete once the chain is fully done
  useEffect(() => {
    if (currentStep === chain.length && completedSteps.size === chain.length) {
      onCompleteRef.current?.()
    }
  }, [currentStep, chain.length, completedSteps.size])

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6 py-16 overflow-x-hidden">

      {/* Header */}
      <motion.p
        className="text-[11px] font-light tracking-[0.2em] uppercase"
        style={{ color: 'rgba(26,24,20,0.28)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {headerText}
      </motion.p>

      {/* Decision chain */}
      <div className="w-full max-w-[320px] flex flex-col gap-1">
        {PHASES.map((phase) => {
          const phaseSteps = chain
            .map((step, i) => ({ ...step, index: i }))
            .filter((s) => s.phase === phase)
          if (phaseSteps.length === 0) return null
          const color = PHASE_COLORS[phase]

          return (
            <div key={phase} className="flex flex-col gap-0">
              {/* Phase label */}
              <motion.div
                className="flex items-center gap-2 mb-1.5 mt-3 first:mt-0"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: phaseSteps[0].index * (stepMs / 1000) * 0.3, duration: 0.3 }}
              >
                <div className="h-px flex-1" style={{ background: color.dot, opacity: 0.25 }} />
                <span
                  className="text-[9px] font-semibold tracking-[0.16em] uppercase px-2"
                  style={{ color: color.text }}
                >
                  {phaseLabels[phase]}
                </span>
                <div className="h-px flex-1" style={{ background: color.dot, opacity: 0.25 }} />
              </motion.div>

              {/* Steps within this phase */}
              <div className="flex flex-col">
                {phaseSteps.map((step, phaseIdx) => {
                  const isDone    = completedSteps.has(step.index)
                  const isActive  = currentStep === step.index
                  const isPending = !isDone && !isActive

                  return (
                    <motion.div
                      key={step.index}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl"
                      style={{
                        background: isActive ? color.bg : 'transparent',
                        transition: 'background 0.3s',
                      }}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: isPending ? 0.32 : 1, x: 0 }}
                      transition={{ delay: step.index * 0.06, duration: 0.3 }}
                    >
                      {/* Status indicator + connector */}
                      <div className="flex flex-col items-center self-stretch">
                        <div className="relative flex-shrink-0">
                          {isDone ? (
                            <motion.div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                              style={{ background: color.dot, color: '#fff' }}
                              initial={{ scale: 0.6 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                            >
                              ✓
                            </motion.div>
                          ) : isActive ? (
                            <motion.div
                              className="w-5 h-5 rounded-full"
                              style={{ background: color.dot, opacity: 0.9 }}
                              animate={{ scale: [1, 1.25, 1], opacity: [0.9, 0.5, 0.9] }}
                              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          ) : (
                            <div
                              className="w-5 h-5 rounded-full border-[1.5px]"
                              style={{ borderColor: color.dot, opacity: 0.35 }}
                            />
                          )}
                        </div>
                        {/* Vertical connector (not on last step in phase) */}
                        {phaseIdx < phaseSteps.length - 1 && (
                          <div
                            className="w-px flex-1 mt-1"
                            style={{ background: color.dot, opacity: isDone ? 0.4 : 0.15, minHeight: 8 }}
                          />
                        )}
                      </div>

                      {/* Step content */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base leading-none flex-shrink-0">{step.icon}</span>
                        <p
                          className="text-[13px] font-light leading-snug"
                          style={{ color: isActive ? '#1A1814' : isDone ? 'rgba(26,24,20,0.68)' : 'rgba(26,24,20,0.38)' }}
                        >
                          {step.text}
                        </p>
                        {isActive && (
                          <AnimatePresence>
                            <motion.span
                              className="text-[11px] font-light flex-shrink-0"
                              style={{ color: color.text }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              ···
                            </motion.span>
                          </AnimatePresence>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <motion.p
        className="text-[11px] font-light tracking-wide"
        style={{ color: 'rgba(26,24,20,0.28)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        {footerText}
      </motion.p>
    </div>
  )
}
