import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PlanExercise, TemporaryPlanResponse } from '../types'
import { saveTrainingSession } from '../services/api'
import { CoachCopy, useCoachCopy } from '../copy/coachCopy'
import { LEGACY_PLAN_DRAFT_PREFIX, PLAN_DRAFT_PREFIX } from '../utils/storageKeys'
import WorkoutCoachIcon from '../components/coach/WorkoutCoachIcon'
import BackButton from '../components/BackButton'

function exerciseId(exercise: PlanExercise) {
  return `${exercise.sort_order}-${exercise.exercise_name}`
}

function exerciseDetail(exercise: PlanExercise, coachCopy: CoachCopy) {
  const load = exercise.weight != null && exercise.weight > 0
    ? `${exercise.weight} ${exercise.unit ?? ''} × ${exercise.reps} ${coachCopy.common.reps}`
    : `${coachCopy.common.bodyweight} × ${exercise.reps} ${coachCopy.common.reps}`
  return load
}

function getRestDuration(exercise: PlanExercise) {
  if (exercise.category === 'warmup' || exercise.category === 'cooldown') return 30
  if (exercise.category === 'main') return 90
  if (exercise.category === 'accessory') return 60
  return 45
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

export default function WorkoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const coachCopy = useCoachCopy()
  const routeState = location.state as { plan?: TemporaryPlanResponse } | null
  const statePlan = routeState?.plan

  const [plan] = useState<TemporaryPlanResponse | null>(statePlan ?? null)
  const [loading, setLoading] = useState(!statePlan)
  const [error, setError] = useState('')
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([])
  const [skippedExerciseIds, setSkippedExerciseIds] = useState<string[]>([])
  const [tooHeavyIds, setTooHeavyIds] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [mode, setMode] = useState<'exercise' | 'rest'>('exercise')
  const [restSeconds, setRestSeconds] = useState(0)
  const [restTotal, setRestTotal] = useState(0)
  const [restTarget, setRestTarget] = useState<'next_set' | 'next_exercise' | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [startedAt] = useState(() => Date.now())
  const saveStartedRef = useRef(false)

  useEffect(() => {
    if (!statePlan) {
      setError(coachCopy.workout.missingPlan)
      setLoading(false)
    }
  }, [statePlan])

  const exercises = useMemo(
    () => [...(plan?.exercises ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    [plan],
  )

  const currentExercise = exercises[exerciseIndex]
  const nextExercise = restTarget === 'next_exercise' ? exercises[exerciseIndex + 1] : currentExercise
  const nextSet = restTarget === 'next_set' ? currentSet + 1 : 1
  const completedCount = completedExerciseIds.length + skippedExerciseIds.length
  const elapsedMinutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000))
  const progress = exercises.length ? Math.round((completedCount / exercises.length) * 100) : 0
  const restProgress = restTotal ? Math.max(0, Math.min(100, (restSeconds / restTotal) * 100)) : 0

  const finishRest = () => {
    if (restTarget === 'next_set') {
      setCurrentSet((prev) => prev + 1)
    }

    if (restTarget === 'next_exercise') {
      setExerciseIndex((prev) => prev + 1)
      setCurrentSet(1)
    }

    setMode('exercise')
    setRestTarget(null)
    setRestSeconds(0)
    setRestTotal(0)
  }

  const startRest = (target: 'next_set' | 'next_exercise') => {
    if (!currentExercise) return
    const seconds = getRestDuration(currentExercise)
    setRestTarget(target)
    setRestSeconds(seconds)
    setRestTotal(seconds)
    setMode('rest')
  }

  useEffect(() => {
    if (mode !== 'rest') return
    if (restSeconds <= 0) {
      finishRest()
      return
    }

    const timer = window.setTimeout(() => {
      setRestSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [mode, restSeconds])

  const goNextExercise = (markCompleted: boolean) => {
    if (!currentExercise) return
    const currentId = exerciseId(currentExercise)
    if (markCompleted) {
      setCompletedExerciseIds((prev) => prev.includes(currentId) ? prev : [...prev, currentId])
    } else {
      setSkippedExerciseIds((prev) => prev.includes(currentId) ? prev : [...prev, currentId])
    }

    if (exerciseIndex >= exercises.length - 1) {
      setFinished(true)
      return
    }

    setExerciseIndex((prev) => prev + 1)
    setCurrentSet(1)
  }

  const completeSet = () => {
    if (!currentExercise) return
    if (currentSet < currentExercise.sets) {
      startRest('next_set')
      return
    }

    const currentId = exerciseId(currentExercise)
    setCompletedExerciseIds((prev) => prev.includes(currentId) ? prev : [...prev, currentId])

    if (exerciseIndex < exercises.length - 1) {
      startRest('next_exercise')
      return
    }

    goNextExercise(true)
  }

  const markTooHeavy = () => {
    if (!currentExercise) return
    const currentId = exerciseId(currentExercise)
    setTooHeavyIds((prev) => prev.includes(currentId) ? prev : [...prev, currentId])
  }

  const adjustRest = (amount: number) => {
    setRestSeconds((prev) => Math.max(5, prev + amount))
    setRestTotal((prev) => Math.max(5, prev + Math.max(amount, 0)))
  }

  const handleSaveWorkout = async () => {
    if (!plan || saving || saved) return
    const completedExercises = exercises.filter((exercise) => completedExerciseIds.includes(exerciseId(exercise)))
    if (!completedExercises.length) {
      setSaveError(coachCopy.workout.minSaveError)
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      await saveTrainingSession({
        ...plan.plan,
        duration_minutes: elapsedMinutes,
        exercises: completedExercises.map((exercise) => ({
          exercise_name: exercise.exercise_name,
          category: exercise.category,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          unit: exercise.unit,
          rationale: exercise.rationale,
        })),
      })
      localStorage.removeItem(`${PLAN_DRAFT_PREFIX}${plan.plan.session_date}`)
      localStorage.removeItem(`${LEGACY_PLAN_DRAFT_PREFIX}${plan.plan.session_date}`)
      setSaved(true)
    } catch (err) {
      setSaveError((err as Error).message || coachCopy.workout.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!finished || saveStartedRef.current) return
    saveStartedRef.current = true
    void handleSaveWorkout()
  }, [finished, completedExerciseIds])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7FBF4', color: 'rgba(26,24,20,0.5)' }}>
        {coachCopy.workout.entering}
      </div>
    )
  }

  if (error || !plan || !currentExercise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center" style={{ background: '#F7FBF4', color: '#1A1814' }}>
        <p className="text-[15px] font-semibold">{coachCopy.workout.unavailable}</p>
        <p className="mt-2 text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.48)' }}>{error || coachCopy.workout.noExercises}</p>
        <button
          className="mt-6 rounded-2xl px-6 py-3 text-[13px] font-semibold"
          style={{ background: '#57C878', color: '#FFFFFF' }}
          onClick={() => navigate('/plan')}
        >
          {coachCopy.workout.backToPlan}
        </button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col px-5 pt-14 pb-8" style={{ background: '#F7FBF4', color: '#1A1814' }}>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.div
            className="flex h-32 w-32 items-center justify-center rounded-full overflow-hidden"
            style={{ background: '#FFFFFF', border: '2px solid rgba(87,200,120,0.46)', boxShadow: '0 18px 36px rgba(61,104,72,0.14)' }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <WorkoutCoachIcon muscleGroup="celebrate" size={108} />
          </motion.div>
          <h1 className="mt-7 text-[24px] font-semibold">{coachCopy.workout.finishedTitle}</h1>
          <p className="mt-2 text-[13px] font-light" style={{ color: 'rgba(26,24,20,0.48)' }}>
            {coachCopy.workout.summary(completedExerciseIds.length, skippedExerciseIds.length, elapsedMinutes)}
          </p>

          <p className="mt-4 rounded-2xl px-4 py-3 text-[12px] font-light" style={{ background: saved ? '#EAF7EF' : '#FFF7E8', color: saved ? '#2F8F58' : '#9D6414' }}>
            {saved ? coachCopy.workout.saved : saving ? coachCopy.workout.saving : coachCopy.workout.saving}
          </p>

          {tooHeavyIds.length > 0 && (
            <p className="mt-4 rounded-2xl px-4 py-3 text-[12px] font-light" style={{ background: '#FFF7E8', color: '#9D6414' }}>
              {coachCopy.workout.tooHeavyNote(tooHeavyIds.length)}
            </p>
          )}
          {saveError && (
            <p className="mt-4 rounded-2xl px-4 py-3 text-[12px] font-light" style={{ background: '#FDEDEC', color: '#B94A3A' }}>
              {saveError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="w-full rounded-2xl py-4 text-[14px] font-semibold"
            style={{ background: saved ? '#57C878' : 'rgba(26,24,20,0.08)', color: saved ? '#FFFFFF' : 'rgba(26,24,20,0.35)', boxShadow: saved ? '0 10px 24px rgba(74,174,106,0.24)' : 'none' }}
            onClick={() => navigate('/')}
            disabled={!saved && !saveError}
          >
            {coachCopy.workout.home}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col px-5 pt-14 pb-7" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <div className="flex items-center gap-3">
        <BackButton onClick={() => navigate('/plan', { state: { plan } })} />
        <div className="min-w-0 flex-1">
          <h1 className="text-[18px] font-semibold">{coachCopy.workout.inProgress}</h1>
        </div>
        <span className="text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
          {exerciseIndex + 1}/{exercises.length}
        </span>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full" style={{ background: 'rgba(26,24,20,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: '#57C878' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {mode === 'rest' ? (
            <motion.div
              key="rest"
              className="rounded-[34px] px-5 py-8 text-center"
              style={{ background: '#FFFFFF', border: '1px solid rgba(255,181,72,0.28)', boxShadow: '0 18px 42px rgba(157,100,20,0.10)' }}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-[12px] font-semibold" style={{ color: '#D88416' }}>
                {coachCopy.workout.restTitle}
              </p>
              <div className="mx-auto mt-5 flex h-40 w-40 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#FFB548 ${restProgress * 3.6}deg, rgba(255,181,72,0.14) 0deg)`,
                  boxShadow: '0 16px 34px rgba(255,181,72,0.18)',
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full" style={{ background: '#FFFFFF' }}>
                  <span className="text-[34px] font-semibold tabular-nums" style={{ color: '#1A1814' }}>
                    {formatTimer(restSeconds)}
                  </span>
                  <span className="mt-1 text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
                    {coachCopy.workout.restSubtitle}
                  </span>
                </div>
              </div>
              <p className="mt-6 text-[13px] font-semibold">
                {coachCopy.workout.nextSet}
              </p>
              <p className="mt-2 text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.5)' }}>
                {nextExercise?.exercise_name ?? coachCopy.workout.nextExerciseFallback} · {coachCopy.workout.nextSetLabel(nextSet)}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={exerciseId(currentExercise)}
              className="rounded-[34px] px-5 py-8 text-center"
              style={{ background: '#FFFFFF', border: '1px solid rgba(87,200,120,0.18)', boxShadow: '0 18px 42px rgba(61,104,72,0.12)' }}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-[12px] font-semibold" style={{ color: '#57C878' }}>
                {coachCopy.workout.setLabel(currentSet, currentExercise.sets)}
              </p>
              <h2 className="mt-4 text-[30px] font-semibold">{currentExercise.exercise_name}</h2>
              <p className="mt-4 text-[18px] font-light" style={{ color: 'rgba(26,24,20,0.62)' }}>
                {exerciseDetail(currentExercise, coachCopy)}
              </p>
              {currentExercise.rationale && (
                <p className="mt-5 text-[12px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.45)' }}>
                  {currentExercise.rationale}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-2">
        {mode === 'rest' ? (
          <>
            <motion.button
              className="w-full rounded-[24px] py-4 text-[15px] font-semibold"
              style={{ background: '#FFB548', color: '#FFFFFF', boxShadow: '0 10px 24px rgba(255,181,72,0.24)' }}
              whileTap={{ scale: 0.97 }}
              onClick={finishRest}
            >
              {coachCopy.workout.skipRest}
            </motion.button>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="rounded-2xl py-3 text-[12px] font-semibold"
                style={{ background: '#FFFFFF', color: 'rgba(26,24,20,0.52)', border: '1px solid rgba(26,24,20,0.08)' }}
                onClick={() => adjustRest(-15)}
              >
                -15 {coachCopy.common.secondsShort}
              </button>
              <button
                className="rounded-2xl py-3 text-[12px] font-semibold"
                style={{ background: '#FFFFFF', color: 'rgba(26,24,20,0.52)', border: '1px solid rgba(26,24,20,0.08)' }}
                onClick={() => adjustRest(15)}
              >
                +15 {coachCopy.common.secondsShort}
              </button>
            </div>
          </>
        ) : (
          <>
            <motion.button
              className="w-full rounded-[24px] py-4 text-[15px] font-semibold"
              style={{ background: '#57C878', color: '#FFFFFF', boxShadow: '0 10px 24px rgba(74,174,106,0.24)' }}
              whileTap={{ scale: 0.97 }}
              onClick={completeSet}
            >
              {coachCopy.workout.completeSet}
            </motion.button>

            <div className="grid grid-cols-3 gap-2">
              <button
                className="rounded-2xl py-3 text-[12px] font-semibold"
                style={{ background: tooHeavyIds.includes(exerciseId(currentExercise)) ? '#FFF2D6' : '#FFFFFF', color: '#9D6414', border: '1px solid rgba(255,181,72,0.32)' }}
                onClick={markTooHeavy}
              >
                {coachCopy.workout.tooHeavy}
              </button>
              <button
                className="rounded-2xl py-3 text-[12px] font-semibold"
                style={{ background: '#FFFFFF', color: 'rgba(26,24,20,0.52)', border: '1px solid rgba(26,24,20,0.08)' }}
                onClick={() => goNextExercise(false)}
              >
                {coachCopy.workout.skipExercise}
              </button>
              <button
                className="rounded-2xl py-3 text-[12px] font-semibold"
                style={{ background: '#FFFFFF', color: '#C0614A', border: '1px solid rgba(192,97,74,0.22)' }}
                onClick={() => setFinished(true)}
              >
                {coachCopy.workout.endWorkout}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
