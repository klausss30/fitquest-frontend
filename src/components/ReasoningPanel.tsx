import { motion } from 'framer-motion'
import { PlanReasoning, RiskLevel } from '../types'
import { useAppLanguage } from '../copy/coachCopy'

// ── Config ────────────────────────────────────────────────────────────────────

const RISK_COLOR: Record<RiskLevel, string> = {
  low:      '#57C878',
  moderate: '#C8A96E',
  high:     '#C07878',
}

const COPY = {
  zh: {
    title: 'AI 推理过程',
    subtitle: '基于你的状态和历史，Agent 完成了以下分析',
    steps: ['目标分析', '恢复状态', '风险评估', '训练历史', '今日决策'],
    icons: ['🎯', '🛌', '⚠️', '📊', '✅'],
    noCheckIn: '未记录今日状态，使用通用默认方案',
    sessions: (n: number) => `近 7 天完成 ${n} 次训练`,
    lastGroup: (g: string) => `上次训练：${g}`,
    riskLabel: { low: '低风险', moderate: '中等风险', high: '需注意' },
    recoveryScore: (s: number) => `恢复指数 ${s}/100`,
    sleep: (h: number) => `睡眠 ${h}h`,
    cta: '生成我的计划',
  },
  en: {
    title: 'Agent Reasoning',
    subtitle: 'Based on your status and history, the agent completed this analysis',
    steps: ['Goal Analysis', 'Recovery', 'Risk Assessment', 'History', 'Decision'],
    icons: ['🎯', '🛌', '⚠️', '📊', '✅'],
    noCheckIn: 'No check-in recorded — using default parameters',
    sessions: (n: number) => `${n} sessions completed in the last 7 days`,
    lastGroup: (g: string) => `Last trained: ${g}`,
    riskLabel: { low: 'Low Risk', moderate: 'Moderate', high: 'High Risk' },
    recoveryScore: (s: number) => `Recovery ${s}/100`,
    sleep: (h: number) => `Sleep ${h}h`,
    cta: 'Generate My Plan',
  },
}

// ── Step content renderers ────────────────────────────────────────────────────

function GoalContent({ r }: { r: PlanReasoning }) {
  return (
    <div className="space-y-1">
      <p className="text-[13px] font-light" style={{ color: '#1A1814' }}>
        {r.goal_analysis.primary_goal}
        {r.goal_analysis.secondary_goal && (
          <span style={{ color: 'rgba(26,24,20,0.42)' }}> · {r.goal_analysis.secondary_goal}</span>
        )}
      </p>
      <p className="text-[11px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.5)' }}>
        {r.goal_analysis.note}
      </p>
    </div>
  )
}

function RecoveryContent({ r, copy }: { r: PlanReasoning; copy: typeof COPY['zh'] }) {
  if (!r.recovery_analysis) {
    return <p className="text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.38)' }}>{copy.noCheckIn}</p>
  }
  const ra = r.recovery_analysis
  const scoreColor = ra.recovery_score >= 70 ? '#57C878' : ra.recovery_score >= 40 ? '#C8A96E' : '#C07878'
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-light" style={{ color: scoreColor }}>
          {copy.recoveryScore(ra.recovery_score)}
        </span>
        <span className="text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.35)' }}>
          {copy.sleep(ra.sleep_hours)} · ⚡ {ra.energy_level}/10 · 😤 {ra.stress_level}/10
        </span>
      </div>
      <p className="text-[11px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.5)' }}>
        {ra.summary}
      </p>
    </div>
  )
}

function RiskContent({ r, copy }: { r: PlanReasoning; copy: typeof COPY['zh'] }) {
  const color = RISK_COLOR[r.risk_assessment.level]
  return (
    <div className="space-y-2">
      <span
        className="inline-block text-[11px] font-light px-2.5 py-1 rounded-lg"
        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
      >
        {copy.riskLabel[r.risk_assessment.level]}
      </span>
      <ul className="space-y-1">
        {r.risk_assessment.factors.map((f, i) => (
          <li key={i} className="text-[11px] font-light flex items-start gap-1.5" style={{ color: 'rgba(26,24,20,0.5)' }}>
            <span style={{ color, flexShrink: 0, marginTop: 1 }}>·</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function HistoryContent({ r, copy }: { r: PlanReasoning; copy: typeof COPY['zh'] }) {
  const ha = r.history_analysis
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2 text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
        <span>{copy.sessions(ha.sessions_last_7_days)}</span>
        {ha.last_muscle_group && <span>· {copy.lastGroup(ha.last_muscle_group)}</span>}
      </div>
      <p className="text-[11px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.5)' }}>
        {ha.summary}
      </p>
    </div>
  )
}

function DecisionContent({ r }: { r: PlanReasoning }) {
  return (
    <div className="space-y-1">
      <p className="text-[13px] font-light" style={{ color: '#57C878' }}>{r.decision.action}</p>
      <p className="text-[11px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.5)' }}>
        {r.decision.rationale}
      </p>
    </div>
  )
}

// ── ReasoningPanel ────────────────────────────────────────────────────────────

interface Props {
  reasoning: PlanReasoning   // always fully populated when this component is shown
  onComplete: () => void     // called when user clicks the CTA button
}

export default function ReasoningPanel({ reasoning, onComplete }: Props) {
  const rawLang = useAppLanguage()
  const lang: 'zh' | 'en' = rawLang === 'zh-CN' ? 'zh' : 'en'
  const copy = COPY[lang]

  const renderContent = (index: number) => {
    switch (index) {
      case 0: return <GoalContent r={reasoning} />
      case 1: return <RecoveryContent r={reasoning} copy={copy} />
      case 2: return <RiskContent r={reasoning} copy={copy} />
      case 3: return <HistoryContent r={reasoning} copy={copy} />
      case 4: return <DecisionContent r={reasoning} />
      default: return null
    }
  }

  // Container stagger: each child gets progressively longer delay
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 14 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } },
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide pb-32">
      {/* Header */}
      <motion.div
        className="px-5 pt-2 pb-3"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-[11px] font-light tracking-[0.14em] uppercase" style={{ color: 'rgba(26,24,20,0.32)' }}>
          {copy.title}
        </p>
        <p className="text-[12px] font-light mt-1" style={{ color: 'rgba(26,24,20,0.45)' }}>
          {copy.subtitle}
        </p>
      </motion.div>

      {/* Step cards — stagger on mount */}
      <motion.div
        className="px-5 flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {copy.steps.map((label, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="rounded-2xl p-4"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(26,24,20,0.07)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            {/* Step header */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-base leading-none">{copy.icons[i]}</span>
              <p className="text-[11px] font-light tracking-[0.1em] uppercase" style={{ color: 'rgba(26,24,20,0.32)' }}>
                {label}
              </p>
            </div>
            {/* Step content */}
            {renderContent(i)}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA — fades in after cards */}
      <motion.div
        className="px-5 mt-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 * 5 + 0.4, duration: 0.35 }}
      >
        <motion.button
          className="w-full rounded-2xl py-4 text-[14px] font-light tracking-wider"
          style={{
            background: '#57C878',
            border: '1px solid rgba(47,143,88,0.28)',
            color: '#FFFFFF',
            boxShadow: '0 8px 20px rgba(74,174,106,0.22)',
          }}
          whileTap={{ scale: 0.97 }}
          onClick={onComplete}
        >
          {copy.cta} →
        </motion.button>
      </motion.div>
    </div>
  )
}
