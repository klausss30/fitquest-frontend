import ReasoningChainLoader, { ChainStep } from './ReasoningChainLoader'

export interface AgentSignals {
  recoveryScore?: number
  sleepHours?: number
  energyLevel?: number
  sessionsCount?: number
  lastMuscleGroup?: string
}

const PHASE_LABELS = {
  INPUT: 'DATA INPUT',
  ANALYSIS: 'ANALYSIS',
  DECISION: 'DECISION',
} as const

function buildChain(s: AgentSignals): ChainStep[] {
  return [
    {
      phase: 'INPUT',
      icon: '📊',
      text: s.recoveryScore != null ? `Recovery ${s.recoveryScore}/100` : 'Reading recovery score',
    },
    {
      phase: 'INPUT',
      icon: '🏋️',
      text: s.sessionsCount != null
        ? `${s.sessionsCount} sessions in 7 days${s.lastMuscleGroup ? ` · last: ${s.lastMuscleGroup}` : ''}`
        : 'Scanning training history',
    },
    {
      phase: 'INPUT',
      icon: '🛌',
      text: (s.sleepHours != null && s.energyLevel != null)
        ? `Sleep ${s.sleepHours}h · Energy ${s.energyLevel}/10`
        : 'Analyzing sleep and energy',
    },
    { phase: 'ANALYSIS', icon: '⚖️', text: 'Evaluating load vs fatigue risk' },
    { phase: 'ANALYSIS', icon: '🎯', text: 'Matching optimal muscle group' },
    { phase: 'DECISION', icon: '✅', text: 'Generating personalized plan' },
  ]
}

interface Props {
  isDataReady?: boolean
  onComplete?: () => void
  signals?: AgentSignals
}

export default function AgentThinkingLoader({ isDataReady, onComplete, signals = {} }: Props) {
  return (
    <ReasoningChainLoader
      chain={buildChain(signals)}
      phaseLabels={PHASE_LABELS}
      headerText="Agent is thinking..."
      footerText="Powered by FitQuest Reasoning Agent"
      stepMs={1100}
      isDataReady={isDataReady}
      onComplete={onComplete}
    />
  )
}
