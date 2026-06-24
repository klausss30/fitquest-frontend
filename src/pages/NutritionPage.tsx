import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { classifyApiError, getNutrition } from '../services/api'
import { NutritionResponse } from '../types'
import ReasoningChainLoader, { ChainStep } from '../components/ReasoningChainLoader'
import BackButton from '../components/BackButton'
import { formatLocalDate, readPlanDraft } from '../utils/planDrafts'

const COPY = {
  title: "Today's Nutrition",
  subtitle: 'Generated based on your goals and status',
  error: 'Failed to generate nutrition advice. Please try again.',
  retry: 'Retry',
  calories: 'Daily Calorie Target',
  kcal: 'kcal',
  macros: 'Macronutrients',
  protein: 'Protein',
  carbs: 'Carbs',
  fat: 'Fat',
  grams: 'g',
  meals: 'Meal Suggestions',
  reasoning: 'Agent Reasoning',
  refresh: 'Regenerate',
}

const MACRO_COLORS = {
  protein: '#57C878',
  carbs:   '#C8A96E',
  fat:     '#A09080',
}

interface PlanSignal {
  dayType?: string
  durationMinutes?: number
  muscleGroup?: string
}

function buildNutritionChain(plan?: PlanSignal): ChainStep[] {
  return [
    { phase: 'INPUT',    icon: '👤', text: 'Loading body metrics (height/weight/goal)' },
    { phase: 'INPUT',    icon: '🏋️', text: 'Counting sessions in last 7 days' },
    { phase: 'INPUT',    icon: '🛌', text: "Reading today's check-in & recovery" },
    {
      phase: 'INPUT', icon: '🔗',
      text: plan?.muscleGroup
        ? `← Agent A: ${plan.dayType} · ${plan.durationMinutes}min`
        : "Fetching today's training plan",
    },
    { phase: 'ANALYSIS', icon: '🔥', text: 'Calculating BMR via Mifflin-St Jeor' },
    { phase: 'ANALYSIS', icon: '⚖️', text: 'Computing TDEE & calorie target' },
    { phase: 'DECISION', icon: '✅', text: 'Generating macros & meal suggestions' },
  ]
}

const NUTRITION_PHASE_LABELS = {
  INPUT: 'DATA INPUT',
  ANALYSIS: 'CALCULATION',
  DECISION: 'DECISION',
} as const

function NutritionLoader({ isDataReady, onComplete, planSignal }: {
  isDataReady?: boolean
  onComplete?: () => void
  planSignal?: PlanSignal
}) {
  return (
    <ReasoningChainLoader
      chain={buildNutritionChain(planSignal)}
      phaseLabels={NUTRITION_PHASE_LABELS}
      headerText="Nutrition Agent is thinking..."
      footerText="Powered by FitQuest Reasoning Agent"
      stepMs={1050}
      isDataReady={isDataReady}
      onComplete={onComplete}
    />
  )
}

function MacroBar({ proteinG, carbsG, fatG, copy }: {
  proteinG: number
  carbsG: number
  fatG: number
  copy: typeof COPY
}) {
  const total = proteinG * 4 + carbsG * 4 + fatG * 9
  const pct = {
    protein: total > 0 ? (proteinG * 4) / total : 0,
    carbs:   total > 0 ? (carbsG   * 4) / total : 0,
    fat:     total > 0 ? (fatG     * 9) / total : 0,
  }

  const macros = [
    { key: 'protein' as const, label: copy.protein, value: proteinG, color: MACRO_COLORS.protein, pct: pct.protein },
    { key: 'carbs'   as const, label: copy.carbs,   value: carbsG,   color: MACRO_COLORS.carbs,   pct: pct.carbs   },
    { key: 'fat'     as const, label: copy.fat,     value: fatG,     color: MACRO_COLORS.fat,     pct: pct.fat     },
  ]

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      <p className="text-[10px] font-light tracking-[0.14em] uppercase mb-3" style={{ color: 'rgba(26,24,20,0.22)' }}>
        {copy.macros}
      </p>

      <div className="flex h-2.5 w-full rounded-full overflow-hidden mb-4">
        {macros.map((m) => (
          <motion.div
            key={m.key}
            style={{ background: m.color }}
            initial={{ width: 0 }}
            animate={{ width: `${m.pct * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="flex justify-between">
        {macros.map((m) => (
          <div key={m.key} className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
              <span className="text-[10px] font-light" style={{ color: 'rgba(26,24,20,0.38)' }}>{m.label}</span>
            </div>
            <span className="text-[13px] font-light" style={{ color: '#1A1814' }}>
              {m.value}{copy.grams}
            </span>
            <span className="text-[9px] font-light" style={{ color: 'rgba(26,24,20,0.28)' }}>
              {Math.round(m.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function NutritionPage() {
  const copy = COPY

  const [status, setStatus]       = useState<'loading' | 'ready' | 'error'>('loading')
  const [data, setData]           = useState<NutritionResponse | null>(null)
  const [errorMsg, setErrorMsg]   = useState('')
  const [nutritionReady, setNutritionReady] = useState(false)
  const pendingDataRef = useRef<NutritionResponse | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const planSignal: PlanSignal | undefined = (() => {
    const draft = readPlanDraft(formatLocalDate(new Date()))
    if (!draft) return undefined
    return {
      muscleGroup: draft.plan.muscle_group,
      dayType: draft.plan.day_type,
      durationMinutes: draft.plan.duration_minutes,
    }
  })()

  const load = () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('loading')
    setErrorMsg('')
    setNutritionReady(false)
    pendingDataRef.current = null
    getNutrition(controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        pendingDataRef.current = res
        setNutritionReady(true)
      })
      .catch((err) => {
        if ((err as Error).name === 'AbortError') return
        setErrorMsg(classifyApiError(err, copy.error))
        setStatus('error')
      })
  }

  const handleChainComplete = () => {
    if (pendingDataRef.current) {
      setData(pendingDataRef.current)
      setStatus('ready')
    }
  }

  useEffect(() => { load() }, [])
  useEffect(() => () => { abortRef.current?.abort() }, [])

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: '#FAFAF8', color: '#1A1814' }}>
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 flex-shrink-0">
        <BackButton to="/" />
        <div>
          <h1 className="text-[17px] font-light tracking-wide">{copy.title}</h1>
          <p className="text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.38)' }}>{copy.subtitle}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'loading' && (
          <motion.div key="loading" className="flex flex-col flex-1 overflow-hidden"
            exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <NutritionLoader isDataReady={nutritionReady} onComplete={handleChainComplete} planSignal={planSignal} />
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            className="flex flex-col items-center justify-center flex-1 gap-5 px-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <span className="text-3xl">
              {errorMsg.includes('network') || errorMsg.includes('No network') ? '📶'
                : errorMsg.includes('Too many') ? '⏳'
                : '⚠️'}
            </span>
            <p className="text-[13px] font-light text-center" style={{ color: 'rgba(26,24,20,0.55)' }}>{errorMsg}</p>
            <button
              className="rounded-xl px-6 py-2.5 text-[13px] font-light"
              style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.4)', color: '#B8935A' }}
              onClick={load}
            >
              {copy.retry}
            </button>
          </motion.div>
        )}

        {status === 'ready' && data && (
          <motion.div
            key="content"
            className="flex flex-col flex-1 px-5 pb-8 gap-4 overflow-y-auto scrollbar-hide"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="rounded-2xl p-5 flex flex-col items-center gap-1"
              style={{
                background: 'rgba(200,169,110,0.06)',
                border: '1px solid rgba(200,169,110,0.18)',
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, duration: 0.35 }}
            >
              <p className="text-[10px] font-light tracking-[0.14em] uppercase" style={{ color: 'rgba(26,24,20,0.28)' }}>
                {copy.calories}
              </p>
              <div className="flex items-end gap-1.5">
                <span className="text-[42px] font-light leading-none" style={{ color: '#C8A96E' }}>
                  {data.daily_calories.toLocaleString()}
                </span>
                <span className="text-[14px] font-light mb-1.5" style={{ color: 'rgba(26,24,20,0.38)' }}>
                  {copy.kcal}
                </span>
              </div>
              <p className="text-[12px] font-light text-center mt-1 leading-relaxed" style={{ color: 'rgba(26,24,20,0.55)' }}>
                <span style={{ color: '#C8A96E', marginRight: 5 }}>✦</span>
                {data.goal_note}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
            >
              <MacroBar
                proteinG={data.protein_g}
                carbsG={data.carbs_g}
                fatG={data.fat_g}
                copy={copy}
              />
            </motion.div>

            <div>
              <p className="text-[10px] font-light tracking-[0.14em] uppercase mb-2.5" style={{ color: 'rgba(26,24,20,0.22)' }}>
                {copy.meals}
              </p>
              <div className="flex flex-col gap-2">
                {data.meal_suggestions.map((meal, i) => (
                  <motion.div
                    key={i}
                    className="rounded-2xl p-4"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(26,24,20,0.07)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.07, duration: 0.32 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[12px] font-light tracking-wide" style={{ color: '#1A1814' }}>
                        {meal.meal}
                      </p>
                      <span
                        className="text-[10px] font-light px-2 py-0.5 rounded-md"
                        style={{ background: 'rgba(200,169,110,0.1)', color: '#B8935A' }}
                      >
                        ~{meal.calories_approx} {copy.kcal}
                      </span>
                    </div>
                    <p className="text-[12px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.55)' }}>
                      {meal.suggestion}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {data.reasoning && (
              <motion.div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(87,200,120,0.04)',
                  border: '1px solid rgba(87,200,120,0.14)',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.32 }}
              >
                <p className="text-[10px] font-light tracking-[0.12em] uppercase mb-1.5" style={{ color: 'rgba(26,24,20,0.28)' }}>
                  {copy.reasoning}
                </p>
                <p className="text-[12px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.52)' }}>
                  <span style={{ color: '#57C878', marginRight: 5 }}>✦</span>
                  {data.reasoning}
                </p>
              </motion.div>
            )}

            <motion.button
              className="w-full rounded-2xl py-3.5 text-[13px] font-light tracking-wider"
              style={{
                background: 'rgba(200,169,110,0.08)',
                border: '1px solid rgba(200,169,110,0.22)',
                color: '#B8935A',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={load}
            >
              {copy.refresh} ↺
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
