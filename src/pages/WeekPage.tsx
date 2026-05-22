import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { DayData, DayStatus, TrainingSession, WeekPlanDay } from '../types'
import { getWeekPlan, getWeekSessions } from '../services/api'
import { CoachCopy, useAppLanguage, useCoachCopy } from '../copy/coachCopy'

interface LevelStyle {
  bg: string
  border: string
  color: string
  shadow: string
  icon: string
  label: string
}

const mapOffsets = ['ml-5', 'ml-28', 'ml-12', 'ml-36', 'ml-16', 'ml-28', 'ml-8']

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getMonthLabel(date: Date, coachCopy: CoachCopy) {
  return coachCopy.week.month(date.getMonth() + 1)
}

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function getWeekStart(date: Date) {
  const weekStart = new Date(date)
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  weekStart.setDate(date.getDate() + diffToMonday)
  return weekStart
}

function getCurrentWeekDays(coachCopy: CoachCopy): Array<DayData & { dateKey: string }> {
  const today = new Date()
  const weekStart = getWeekStart(today)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)

    const isToday = formatDateKey(date) === formatDateKey(today)
    const isPast = startOfDay(date) < startOfDay(today)

    return {
      dayName: coachCopy.week.dayNames[date.getDay()],
      date: date.getDate(),
      dateKey: formatDateKey(date),
      status: isToday ? 'today' : isPast ? 'rest' : 'future',
      workoutType: isToday ? coachCopy.week.todayWorkout : isPast ? undefined : coachCopy.week.pending,
    }
  })
}

function pickMessage(options: string[]) {
  return options[Math.floor(Math.random() * options.length)]
}

function getCoachMessage(todayWorkout: string | undefined, sessions: TrainingSession[], coachCopy: CoachCopy) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const yesterdaySession = sessions.find((session) => session.session_date === formatDateKey(yesterday))
  const completedThisWeek = sessions.length
  const workout = todayWorkout ?? coachCopy.week.fallbackWorkout

  if (yesterdaySession) {
    return pickMessage(coachCopy.week.coachMessages.yesterday(workout, yesterdaySession.day_type))
  }

  if (completedThisWeek >= 2) {
    return pickMessage(coachCopy.week.coachMessages.many(workout, completedThisWeek))
  }

  if (completedThisWeek === 1) {
    return pickMessage(coachCopy.week.coachMessages.one(workout))
  }

  return pickMessage(coachCopy.week.coachMessages.none(workout))
}

function getLevelStyle(status: DayStatus, coachCopy: CoachCopy): LevelStyle {
  switch (status) {
    case 'done':
      return {
        bg: '#EAF7EF',
        border: 'rgba(91, 181, 122, 0.55)',
        color: '#2F8F58',
        shadow: '0 8px 18px rgba(91,181,122,0.18)',
        icon: '✓',
        label: coachCopy.week.done,
      }
    case 'today':
      return {
        bg: '#FFFFFF',
        border: 'rgba(255, 181, 72, 0.85)',
        color: '#D88416',
        shadow: '0 10px 28px rgba(255,181,72,0.28)',
        icon: '▶',
        label: coachCopy.week.todayWorkout,
      }
    case 'rest':
      return {
        bg: '#EEF4F8',
        border: 'rgba(111, 151, 176, 0.28)',
        color: '#6C8798',
        shadow: '0 6px 14px rgba(111,151,176,0.12)',
        icon: '·',
        label: coachCopy.week.rest,
      }
    case 'future':
      return {
        bg: '#F1F1EE',
        border: 'rgba(26,24,20,0.08)',
        color: 'rgba(26,24,20,0.24)',
        shadow: '0 4px 10px rgba(0,0,0,0.04)',
        icon: '·',
        label: coachCopy.week.future,
      }
  }
}

function LevelNode({ day, index, coachCopy, onClick }: { day: DayData; index: number; coachCopy: CoachCopy; onClick?: () => void }) {
  const style = getLevelStyle(day.status, coachCopy)
  const isClickable = day.status === 'today'
  const isToday = day.status === 'today'

  return (
    <motion.button
      type="button"
      className={`relative flex items-center gap-3 ${mapOffsets[index % mapOffsets.length]} text-left`}
      aria-disabled={!isClickable}
      onClick={isClickable ? onClick : undefined}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: day.status === 'future' ? 0.78 : 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.35, type: 'spring', stiffness: 170, damping: 18 }}
      whileTap={isClickable ? { scale: 0.96 } : {}}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      {isToday && (
        <motion.div
          className="absolute -inset-2 rounded-full"
          style={{ background: 'rgba(255,181,72,0.12)' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 0.35, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div
        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full text-[22px] font-semibold"
        style={{
          background: style.bg,
          border: `2px solid ${style.border}`,
          color: style.color,
          boxShadow: style.shadow,
        }}
      >
        {style.icon}
      </div>

      <div className="relative z-10 min-w-0">
        <p className="text-[13px] font-medium leading-tight" style={{ color: '#1A1814' }}>
          {day.status === 'rest' ? coachCopy.week.rest : day.workoutType ?? coachCopy.week.pending}
        </p>
        <p className="mt-1 text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
          {day.dayName} · {coachCopy.week.day(day.date)}
        </p>
      </div>
    </motion.button>
  )
}

export default function WeekPage() {
  const navigate = useNavigate()
  const coachCopy = useCoachCopy()
  const appLanguage = useAppLanguage()
  const todayRef = useRef<HTMLDivElement | null>(null)
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [weekPlanDays, setWeekPlanDays] = useState<WeekPlanDay[]>([])
  const [error, setError] = useState('')
  const [coachMessage, setCoachMessage] = useState('')

  useEffect(() => {
    const weekStart = formatDateKey(getWeekStart(new Date()))

    getWeekSessions(weekStart)
      .then((data) => setSessions(data.sessions))
      .catch((err) => setError((err as Error).message))

    getWeekPlan(weekStart)
      .then((data) => setWeekPlanDays(data.days))
      .catch(() => setWeekPlanDays([]))
  }, [appLanguage])

  const todayKey = formatDateKey(new Date())
  const sessionByDate = new Map(sessions.map((session) => [session.session_date, session]))
  const planByDate = new Map(weekPlanDays.map((day) => [day.session_date, day]))
  const displayWeek = getCurrentWeekDays(coachCopy).map((day) => {
    const session = sessionByDate.get(day.dateKey)
    const plannedDay = planByDate.get(day.dateKey)

    if (session) {
      return {
        ...day,
        workoutType: session.day_type,
        status: day.dateKey === todayKey ? 'today' : 'done' as DayStatus,
      }
    }

    if (plannedDay) {
      return {
        ...day,
        workoutType: plannedDay.muscle_group === 'rest' ? undefined : plannedDay.day_type,
        status: plannedDay.muscle_group === 'rest' ? 'rest' : day.dateKey === todayKey ? 'today' : 'future' as DayStatus,
      }
    }

    return day
  })

  const today = displayWeek.find((d) => d.status === 'today')
  const todayPlan = weekPlanDays.find((day) => day.session_date === todayKey && day.muscle_group !== 'rest')
  const planPath = todayPlan ? `/plan?muscle_group=${todayPlan.muscle_group}` : '/plan'

  useEffect(() => {
    setCoachMessage(getCoachMessage(today?.workoutType, sessions, coachCopy))
  }, [sessions, today?.workoutType, coachCopy])

  useEffect(() => {
    window.setTimeout(() => {
      todayRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 180)
  }, [sessions, weekPlanDays])

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-56"
        style={{ background: 'linear-gradient(180deg, rgba(129,214,154,0.22) 0%, rgba(247,251,244,0) 100%)' }}
      />

      <div className="relative flex min-h-screen flex-col px-5 pb-6">
        <div
          className="fixed inset-x-0 top-0 z-30 mx-auto max-w-[390px] px-5 pb-5 pt-12"
          style={{ background: 'linear-gradient(180deg, #F7FBF4 76%, rgba(247,251,244,0))' }}
        >
          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm"
              style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.08)', color: 'rgba(26,24,20,0.48)' }}
              onClick={() => navigate('/')}
            >
              ←
            </button>

            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-[21px] font-semibold leading-tight">{coachCopy.week.title}</h1>
              </div>
              <div
                className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
                style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', color: 'rgba(26,24,20,0.62)', boxShadow: '0 6px 16px rgba(61,104,72,0.06)' }}
              >
                {getMonthLabel(new Date(), coachCopy)}
              </div>
            </div>
          </div>

          <motion.div
            className="mt-5 flex items-start gap-3 rounded-[22px] p-4"
            style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 8px 24px rgba(69,118,78,0.08)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.35 }}
          >
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-xl"
              style={{ background: '#E8F7EC', border: '1px solid rgba(74,174,106,0.22)' }}
            >
              ✦
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold">{coachCopy.week.todayTitle}</p>
              <p className="mt-1 text-[12px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.55)' }}>
                {error ? coachCopy.week.syncError(error) : coachMessage}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative h-screen overflow-y-auto pb-32 pt-[250px] scrollbar-hide">
          <div className="relative z-10 flex flex-col gap-5">
            {displayWeek.map((day, index) => (
              <div key={`${day.dayName}-${day.date}`} ref={day.status === 'today' ? todayRef : undefined}>
                <LevelNode
                  day={day}
                  index={index}
                  coachCopy={coachCopy}
                  onClick={day.status === 'today' ? () => navigate(planPath) : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[390px] px-5 pb-6 pt-10" style={{ background: 'linear-gradient(180deg, rgba(247,251,244,0), #F7FBF4 42%)' }}>
          <motion.button
            className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-[22px] py-4 text-[15px] font-semibold"
            style={{
              background: '#57C878',
              border: '1px solid rgba(47,143,88,0.28)',
              color: '#FFFFFF',
              boxShadow: '0 10px 24px rgba(74,174,106,0.28)',
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.36 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(planPath)}
          >
            {coachCopy.week.cta}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
