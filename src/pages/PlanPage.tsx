import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Exercise, AdjustType, MuscleGroup, PlanExercise, SessionDetailResponse, TemporaryPlanResponse } from '../types'
import { adjustPlan, generatePlan, getTrainingSession } from '../services/api'
import { CoachCopy, useCoachCopy } from '../copy/coachCopy'
import { LEGACY_PLAN_DRAFT_PREFIX, PLAN_DRAFT_PREFIX } from '../utils/storageKeys'

// Exercise card colors rotate through this palette.
const EXERCISE_COLORS = [
  { dot: '#C8A96E', tagBg: 'rgba(200,169,110,0.1)',  tagText: '#B8935A' },
  { dot: '#7AB8A0', tagBg: 'rgba(122,184,160,0.1)',  tagText: '#5A9880' },
  { dot: '#A09080', tagBg: 'rgba(160,144,128,0.1)',  tagText: '#807060' },
  { dot: '#8FA8C8', tagBg: 'rgba(143,168,200,0.1)',  tagText: '#5A7898' },
  { dot: '#B8A0C0', tagBg: 'rgba(184,160,192,0.1)',  tagText: '#887098' },
]

const MUSCLE_GROUP_OPTIONS: Array<MuscleGroup | 'auto'> = ['auto', 'legs', 'chest', 'back', 'shoulders', 'arms', 'full_body']
const ADJUST_OPTIONS: Array<{ id: AdjustType; icon: string }> = [
  { id: 'low_energy', icon: '📉' },
  { id: 'high_intensity', icon: '📈' },
  { id: 'short_time', icon: '⏱' },
  { id: 'swap', icon: '🔄' },
]
const PLAN_DRAFT_VERSION = 2

function isMuscleGroup(value: string | null): value is MuscleGroup {
  return value === 'legs' || value === 'chest' || value === 'back' || value === 'shoulders' || value === 'arms' || value === 'full_body'
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDraftKey(date: string) {
  return `${PLAN_DRAFT_PREFIX}${date}`
}

function getLegacyDraftKey(date: string) {
  return `${LEGACY_PLAN_DRAFT_PREFIX}${date}`
}

function readPlanDraft(date: string): TemporaryPlanResponse | null {
  try {
    const key = getDraftKey(date)
    const legacyKey = getLegacyDraftKey(date)
    const raw = localStorage.getItem(key) ?? localStorage.getItem(legacyKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { version?: number; data?: TemporaryPlanResponse }
    if (parsed.version !== PLAN_DRAFT_VERSION || !parsed.data) return null
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, raw)
      localStorage.removeItem(legacyKey)
    }
    return parsed.data
  } catch {
    return null
  }
}

function writePlanDraft(plan: TemporaryPlanResponse) {
  localStorage.setItem(getDraftKey(plan.plan.session_date), JSON.stringify({ version: PLAN_DRAFT_VERSION, data: plan }))
  localStorage.removeItem(getLegacyDraftKey(plan.plan.session_date))
}

function normalizeSavedSession(saved: SessionDetailResponse): TemporaryPlanResponse {
  return {
    plan: {
      session_date: saved.session.session_date,
      muscle_group: saved.session.muscle_group,
      day_type: saved.session.day_type,
      duration_minutes: saved.session.duration_minutes,
      ai_note: saved.session.ai_note,
    },
    exercises: saved.exercises.map((exercise) => ({
      exercise_name: exercise.exercise_name,
      category: exercise.category,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      unit: exercise.unit,
      rationale: exercise.rationale,
      sort_order: exercise.sort_order,
    })),
  }
}

function exerciseKey(exercise: Pick<PlanExercise, 'exercise_name' | 'category' | 'rationale'>) {
  return `${exercise.exercise_name}-${exercise.category}-${exercise.rationale ?? ''}`
}

function coloredExercises(exercises: PlanExercise[], coachCopy: CoachCopy): Exercise[] {
  return [...exercises].sort((a, b) => a.sort_order - b.sort_order).map((ex, i) => {
    const c = EXERCISE_COLORS[i % EXERCISE_COLORS.length]
    return {
      id: exerciseKey(ex),
      name: ex.exercise_name,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight ?? undefined,
      unit: ex.unit ?? undefined,
      category: ex.category,
      rationale: ex.rationale,
      dotColor: c.dot,
      tagBg: c.tagBg,
      tagText: c.tagText,
      tagLabel: coachCopy.options.categories[ex.category] ?? ex.category,
    }
  })
}

// Exercise item.

function ExerciseItem({
  ex,
  index,
  completed,
  onToggle,
  onUpdate,
  coachCopy,
}: {
  ex: Exercise
  index: number
  completed: boolean
  onToggle: () => void
  onUpdate: (patch: Partial<Pick<PlanExercise, 'sets' | 'reps' | 'weight'>>) => void
  coachCopy: CoachCopy
}) {
  const detail =
    ex.weight != null && ex.weight > 0
      ? `${ex.sets} ${coachCopy.common.sets} × ${ex.reps} ${coachCopy.common.reps} · ${ex.weight} ${ex.unit}`
      : `${ex.sets} ${coachCopy.common.sets} × ${ex.reps} ${coachCopy.common.reps} · ${coachCopy.common.bodyweight}`

  return (
    <motion.div
      className="rounded-xl px-3.5 py-3"
      style={{
        background: completed ? '#EAF7EF' : '#FFFFFF',
        border: `1px solid ${completed ? 'rgba(74,174,106,0.28)' : 'rgba(26,24,20,0.07)'}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.07 * index, duration: 0.35 }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center text-[12px]"
          style={{
            background: completed ? '#57C878' : '#FFFFFF',
            border: `1px solid ${completed ? '#57C878' : ex.dotColor}`,
            color: '#FFFFFF',
          }}
          onClick={onToggle}
        >
          {completed ? '✓' : ''}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-light truncate text-left" style={{ color: '#1A1814' }}>{ex.name}</p>
          <p className="text-[11px] font-light mt-0.5" style={{ color: 'rgba(26,24,20,0.38)' }}>{detail}</p>
        </div>
        <span
          className="text-[10px] font-light px-2 py-1 rounded-md flex-shrink-0"
          style={{ background: ex.tagBg, color: ex.tagText }}
        >
          {ex.tagLabel}
        </span>
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-[17px]" style={{ background: 'rgba(26,24,20,0.04)', color: 'rgba(26,24,20,0.34)' }}>
          ≡
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-light" style={{ color: 'rgba(26,24,20,0.38)' }}>{coachCopy.common.sets}</span>
          <input type="number" min={1} value={ex.sets} className="w-full rounded-xl px-2 py-2 text-center text-[12px] outline-none" style={{ background: '#F7FBF4', border: '1px solid rgba(26,24,20,0.08)' }} onChange={(e) => onUpdate({ sets: Math.max(1, Number(e.target.value) || 1) })} />
        </label>
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-light" style={{ color: 'rgba(26,24,20,0.38)' }}>{coachCopy.common.reps}</span>
          <input type="number" min={1} value={ex.reps} className="w-full rounded-xl px-2 py-2 text-center text-[12px] outline-none" style={{ background: '#F7FBF4', border: '1px solid rgba(26,24,20,0.08)' }} onChange={(e) => onUpdate({ reps: Math.max(1, Number(e.target.value) || 1) })} />
        </label>
        <label className="min-w-0">
          <span className="mb-1 block text-[10px] font-light" style={{ color: 'rgba(26,24,20,0.38)' }}>{ex.unit ?? coachCopy.common.weight}</span>
          <input type="number" min={0} value={ex.weight ?? ''} placeholder={coachCopy.common.bodyweight} disabled={ex.weight == null} className="w-full rounded-xl px-2 py-2 text-center text-[12px] outline-none" style={{ background: ex.weight == null ? 'rgba(26,24,20,0.04)' : '#F7FBF4', border: '1px solid rgba(26,24,20,0.08)', color: ex.weight == null ? 'rgba(26,24,20,0.32)' : '#1A1814' }} onChange={(e) => onUpdate({ weight: Math.max(0, Number(e.target.value) || 0) })} />
        </label>
      </div>
    </motion.div>
  )
}

// Loading state.

function LoadingState({ message }: { message: string }) {
  const [dots, setDots] = useState(1)
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d % 3) + 1), 480)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-7 py-20">
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-[1.5px] border-transparent animate-spin-ring"
          style={{ borderTopColor: '#C8A96E', borderRightColor: 'rgba(200,169,110,0.3)' }}
        />
        <div className="absolute inset-3 rounded-full" style={{ border: '1px solid rgba(200,169,110,0.15)' }} />
        <span className="absolute inset-0 flex items-center justify-center text-xl" style={{ color: 'rgba(200,169,110,0.7)' }}>✦</span>
      </div>
      <div className="text-center space-y-1.5">
        <p className="text-[14px] font-light" style={{ color: 'rgba(26,24,20,0.65)' }}>{message}</p>
        <p className="text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.25)' }}>
          {'·'.repeat(dots)}
        </p>
      </div>
    </div>
  )
}

// Error state.

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const coachCopy = useCoachCopy()

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-5 py-20 px-8">
      <span className="text-3xl">⚠️</span>
      <p className="text-[13px] font-light text-center" style={{ color: 'rgba(26,24,20,0.55)' }}>{message}</p>
      <button
        className="rounded-xl px-6 py-2.5 text-[13px] font-light"
        style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.4)', color: '#B8935A' }}
        onClick={onRetry}
      >
        {coachCopy.plan.retry}
      </button>
    </div>
  )
}

// Plan page.

export default function PlanPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const coachCopy = useCoachCopy()
  const sessionId = searchParams.get('session_id')
  const routeMuscleGroup = searchParams.get('muscle_group')

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [plan, setPlan] = useState<TemporaryPlanResponse | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const [adjustText, setAdjustText] = useState('')
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'auto'>(isMuscleGroup(routeMuscleGroup) ? routeMuscleGroup : 'auto')

  const loadPlan = async (muscleGroup: MuscleGroup | 'auto' = selectedMuscleGroup) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const today = formatLocalDate(new Date())
      const draft = !sessionId ? readPlanDraft(today) : null
      const usingDraft = Boolean(draft)
      const generated = sessionId
        ? normalizeSavedSession(await getTrainingSession(Number(sessionId)))
        : draft
          ? draft
        : await generatePlan({
          session_date: today,
          ...(muscleGroup !== 'auto' ? { muscle_group: muscleGroup } : {}),
          duration_minutes: 55,
        })
      setSelectedMuscleGroup(sessionId || usingDraft ? generated.plan.muscle_group : muscleGroup)
      if (!sessionId) writePlanDraft(generated)
      setPlan(generated)
      const displayExercises = coloredExercises(generated.exercises, coachCopy)
      setExercises(displayExercises)
      setSelectedExerciseIds(displayExercises.map((ex) => ex.id))
      setStatus('ready')
    } catch (err) {
      setErrorMsg((err as Error).message ?? coachCopy.plan.generationFailed)
      setStatus('error')
    }
  }

  useEffect(() => { loadPlan(isMuscleGroup(routeMuscleGroup) ? routeMuscleGroup : selectedMuscleGroup) }, [sessionId, routeMuscleGroup])

  const regenerateWithMuscleGroup = (muscleGroup: MuscleGroup | 'auto') => {
    if (isAdjusting) return
    setSelectedMuscleGroup(muscleGroup)
    setAdjustText('')
    localStorage.removeItem(getDraftKey(formatLocalDate(new Date())))
    localStorage.removeItem(getLegacyDraftKey(formatLocalDate(new Date())))
    loadPlan(muscleGroup)
  }

  const handleAdjust = (adjustType: AdjustType) => {
    if (!plan || isAdjusting) return
    if (adjustType === 'swap' && selectedExerciseIds.length === 0) {
      setAdjustText(coachCopy.plan.selectSwapFirst)
      return
    }
    setAdjustText('')
    setIsAdjusting(true)

    const sorted = [...plan.exercises].sort((a, b) => a.sort_order - b.sort_order)
    const selectedNames = sorted
      .filter((exercise) => selectedExerciseIds.includes(exerciseKey(exercise)))
      .map((exercise) => exercise.exercise_name)

    adjustPlan({
      current_plan: plan.plan,
      exercises: plan.exercises,
      adjust_type: adjustType,
      ...(adjustType === 'swap' ? { custom_message: coachCopy.plan.swapMessage(selectedNames) } : {}),
    })
      .then((adjusted) => {
        writePlanDraft(adjusted)
        setPlan(adjusted)
        const displayExercises = coloredExercises(adjusted.exercises, coachCopy)
        setExercises(displayExercises)
        setSelectedExerciseIds(displayExercises.map((ex) => ex.id))
        setAdjustText(adjusted.plan.ai_note)
      })
      .catch((err) => setAdjustText((err as Error).message))
      .finally(() => setIsAdjusting(false))
  }

  const syncExercises = (nextExercises: PlanExercise[]) => {
    const normalized = nextExercises.map((exercise, index) => ({ ...exercise, sort_order: index + 1 }))
    setPlan((current) => {
      if (!current) return current
      const next = { ...current, exercises: normalized }
      writePlanDraft(next)
      return next
    })
    const displayExercises = coloredExercises(normalized, coachCopy)
    setExercises(displayExercises)
    setSelectedExerciseIds((current) => current.filter((id) => displayExercises.some((exercise) => exercise.id === id)))
  }

  const updateExercise = (index: number, patch: Partial<Pick<PlanExercise, 'sets' | 'reps' | 'weight'>>) => {
    if (!plan) return
    const sorted = [...plan.exercises].sort((a, b) => a.sort_order - b.sort_order)
    sorted[index] = { ...sorted[index], ...patch }
    syncExercises(sorted)
  }

  const reorderExercises = (nextDisplayExercises: Exercise[]) => {
    if (!plan) return
    const sorted = [...plan.exercises].sort((a, b) => a.sort_order - b.sort_order)
    const nextExercises = nextDisplayExercises
      .map((displayExercise) => sorted.find((exercise) => exerciseKey(exercise) === displayExercise.id))
      .filter((exercise): exercise is PlanExercise => Boolean(exercise))
    if (nextExercises.length === sorted.length) {
      syncExercises(nextExercises)
    }
  }

  const startWorkout = () => {
    if (!plan) return
    const sorted = [...plan.exercises].sort((a, b) => a.sort_order - b.sort_order)
    navigate('/workout', {
      state: { plan: { ...plan, exercises: sorted } },
    })
  }

  const toggleExercise = (id: string) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const coachNote = plan ? (isAdjusting ? coachCopy.plan.thinking : adjustText || plan.plan.ai_note) : ''

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8', color: '#1A1814' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 flex-shrink-0">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-light"
          style={{ background: 'rgba(26,24,20,0.05)', border: '1px solid rgba(26,24,20,0.08)', color: 'rgba(26,24,20,0.45)' }}
          onClick={() => navigate('/week')}
        >
          ←
        </button>
        <div>
          <h1 className="text-[17px] font-light tracking-wide">{coachCopy.plan.title}</h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'loading' && (
          <motion.div key="loading" className="flex flex-col flex-1"
            exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <LoadingState message={coachCopy.plan.loading} />
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div key="error" className="flex flex-col flex-1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ErrorState message={errorMsg} onRetry={loadPlan} />
          </motion.div>
        )}

        {status === 'ready' && plan && (
          <motion.div
            key="content"
            className="flex flex-col flex-1 px-5 pb-8 gap-4 overflow-y-auto scrollbar-hide"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Overview */}
            <div
              className="sticky top-0 z-20 rounded-2xl p-4"
              style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.18)' }}
            >
              <div className="flex gap-5 text-[11px] font-light mb-3" style={{ color: 'rgba(26,24,20,0.38)' }}>
                <span>{coachCopy.plan.duration(plan.plan.duration_minutes)}</span>
                <span>{coachCopy.plan.exercisesCount(exercises.length)}</span>
              </div>
              <p className="text-[12px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.55)' }}>
                <span style={{ color: '#C8A96E', marginRight: 6 }}>✦</span>
                {coachNote}
                {isAdjusting && (
                  <span className="inline-block w-0.5 h-3.5 bg-current ml-1 animate-pulse align-middle" />
                )}
              </p>
            </div>

            {/* Muscle group */}
            <div>
              <p className="text-[10px] font-light tracking-[0.14em] uppercase mb-2.5"
                style={{ color: 'rgba(26,24,20,0.22)' }}>
                {coachCopy.plan.muscleGroup}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {MUSCLE_GROUP_OPTIONS.map((option) => {
                  const active = selectedMuscleGroup === option
                  return (
                    <button
                      key={option}
                      type="button"
                      className="flex-shrink-0 rounded-xl px-3.5 py-2 text-[12px] font-light"
                      style={{
                        background: active ? '#57C878' : '#FFFFFF',
                        border: `1px solid ${active ? 'rgba(47,143,88,0.28)' : 'rgba(26,24,20,0.08)'}`,
                        color: active ? '#FFFFFF' : 'rgba(26,24,20,0.52)',
                      }}
                      onClick={() => regenerateWithMuscleGroup(option)}
                    >
                      {coachCopy.options.muscleGroups[option]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Exercises */}
            <Reorder.Group axis="y" values={exercises} onReorder={reorderExercises} className="flex flex-col gap-2">
              {exercises.map((ex, i) => (
                <Reorder.Item key={ex.id} value={ex} dragListener>
                  <ExerciseItem
                    ex={ex}
                    index={i}
                    completed={selectedExerciseIds.includes(ex.id)}
                    onToggle={() => toggleExercise(ex.id)}
                    onUpdate={(patch) => updateExercise(i, patch)}
                    coachCopy={coachCopy}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {/* Quick adjust */}
            <div>
              <p className="text-[10px] font-light tracking-[0.14em] uppercase mb-2.5"
                style={{ color: 'rgba(26,24,20,0.22)' }}>
                {coachCopy.plan.quickAdjust}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ADJUST_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.id}
                    className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-[12px] font-light"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(26,24,20,0.08)',
                      color: isAdjusting ? 'rgba(26,24,20,0.25)' : 'rgba(26,24,20,0.5)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    whileTap={isAdjusting ? {} : { scale: 0.96 }}
                    onClick={() => !isAdjusting && handleAdjust(opt.id)}
                  >
                    <span className="text-sm">{opt.icon}</span>
                    {coachCopy.options.adjust[opt.id]}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <motion.button
              className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 text-[14px] font-light tracking-wider mt-1"
              style={{
                background: '#57C878',
                border: '1px solid rgba(47,143,88,0.28)',
                color: '#FFFFFF',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={startWorkout}
            >
              {coachCopy.plan.start}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
