import { useAppLanguage } from '../copy/coachCopy'
import ReasoningChainLoader, { ChainStep } from './ReasoningChainLoader'

export interface AgentSignals {
  recoveryScore?: number
  sleepHours?: number
  energyLevel?: number
  sessionsCount?: number
  lastMuscleGroup?: string
}

const PHASE_LABELS = {
  zh: { INPUT: '数据读取', ANALYSIS: '推理分析', DECISION: '决策输出' },
  en: { INPUT: 'DATA INPUT', ANALYSIS: 'ANALYSIS', DECISION: 'DECISION' },
} as const

function buildChain(lang: 'zh' | 'en', s: AgentSignals): ChainStep[] {
  if (lang === 'zh') {
    return [
      {
        phase: 'INPUT', icon: '📊',
        text: s.recoveryScore != null ? `恢复指数 ${s.recoveryScore}/100` : '读取今日恢复评分',
      },
      {
        phase: 'INPUT', icon: '🏋️',
        text: s.sessionsCount != null
          ? `近 7 天 ${s.sessionsCount} 次${s.lastMuscleGroup ? ` · 上次 ${s.lastMuscleGroup}` : ''}`
          : '扫描近期训练记录',
      },
      {
        phase: 'INPUT', icon: '🛌',
        text: (s.sleepHours != null && s.energyLevel != null)
          ? `睡眠 ${s.sleepHours}h · 能量 ${s.energyLevel}/10`
          : '分析睡眠与能量状态',
      },
      { phase: 'ANALYSIS', icon: '⚖️', text: '评估训练负荷与疲劳风险' },
      { phase: 'ANALYSIS', icon: '🎯', text: '匹配最优肌群与强度' },
      { phase: 'DECISION', icon: '✅', text: '生成个性化训练计划' },
    ]
  }
  return [
    {
      phase: 'INPUT', icon: '📊',
      text: s.recoveryScore != null ? `Recovery ${s.recoveryScore}/100` : 'Reading recovery score',
    },
    {
      phase: 'INPUT', icon: '🏋️',
      text: s.sessionsCount != null
        ? `${s.sessionsCount} sessions in 7 days${s.lastMuscleGroup ? ` · last: ${s.lastMuscleGroup}` : ''}`
        : 'Scanning training history',
    },
    {
      phase: 'INPUT', icon: '🛌',
      text: (s.sleepHours != null && s.energyLevel != null)
        ? `Sleep ${s.sleepHours}h · Energy ${s.energyLevel}/10`
        : 'Analyzing sleep & energy',
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
  const rawLang = useAppLanguage()
  const lang: 'zh' | 'en' = rawLang === 'zh-CN' ? 'zh' : 'en'

  return (
    <ReasoningChainLoader
      chain={buildChain(lang, signals)}
      phaseLabels={PHASE_LABELS[lang]}
      headerText={lang === 'zh' ? 'Agent 正在思考…' : 'Agent is thinking…'}
      footerText={lang === 'zh' ? '由 FitQuest Reasoning Agent 驱动' : 'Powered by FitQuest Reasoning Agent'}
      stepMs={1100}
      isDataReady={isDataReady}
      onComplete={onComplete}
    />
  )
}
