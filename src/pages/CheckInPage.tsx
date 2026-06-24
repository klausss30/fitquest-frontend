import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getTodayCheckIn, submitCheckIn } from '../services/api'
import { CheckInResponse, RecoveryStatus } from '../types'
import BackButton from '../components/BackButton'
import { CHECKIN_FULL_CACHE_KEY } from '../utils/storageKeys'
import { formatLocalDate } from '../utils/planDrafts'

interface FullCheckinCache { date: string; checkin: CheckInResponse }

function readCheckinCache(): CheckInResponse | null {
  try {
    const raw = localStorage.getItem(CHECKIN_FULL_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as FullCheckinCache
    const today = formatLocalDate(new Date())
    return parsed.date === today ? parsed.checkin : null
  } catch { return null }
}

function writeCheckinCache(checkin: CheckInResponse) {
  try {
    const payload: FullCheckinCache = { date: formatLocalDate(new Date()), checkin }
    localStorage.setItem(CHECKIN_FULL_CACHE_KEY, JSON.stringify(payload))
  } catch { /* ignore */ }
}

function clearCheckinCache() {
  try { localStorage.removeItem(CHECKIN_FULL_CACHE_KEY) } catch { /* ignore */ }
}

const COPY = {
  title: 'Daily Check-In',
  subtitle: 'Help the AI tailor your training for today',
  sleep: 'Sleep Duration',
  sleepUnit: 'hours',
  energy: 'Energy Level',
  stress: 'Stress Level',
  weight: 'Weight (optional)',
  weightPlaceholder: "Today's weight in kg",
  notes: 'Notes (optional)',
  notesPlaceholder: 'How you feel, anything unusual...',
  submit: 'Submit',
  submitting: 'Analyzing...',
  alreadyDone: 'Already checked in today',
  resubmit: 'Update',
  low: 'Low',
  high: 'High',
  recoveryLabel: 'Recovery Score',
  status: {
    excellent: { label: 'Peak Condition', color: '#57C878', bg: 'rgba(87,200,120,0.08)', border: 'rgba(87,200,120,0.25)' },
    good:      { label: 'Good Recovery', color: '#7AB8A0', bg: 'rgba(122,184,160,0.08)', border: 'rgba(122,184,160,0.25)' },
    moderate:  { label: 'Moderate', color: '#C8A96E', bg: 'rgba(200,169,110,0.08)', border: 'rgba(200,169,110,0.25)' },
    low:       { label: 'Low Recovery', color: '#B8935A', bg: 'rgba(184,147,90,0.08)', border: 'rgba(184,147,90,0.25)' },
    poor:      { label: 'Rest Needed', color: '#C07878', bg: 'rgba(192,120,120,0.08)', border: 'rgba(192,120,120,0.25)' },
  },
  hint: {
    excellent: 'Great day to push hard and hit your goals.',
    good: "You're ready. Train as planned.",
    moderate: 'Consider moderating intensity to avoid fatigue.',
    low: 'Reduce volume. Prioritize recovery today.',
    poor: 'Rest or light activity recommended.',
  },
}

function SliderInput({
  value,
  onChange,
  min = 1,
  max = 10,
  lowLabel,
  highLabel,
  activeColor = '#C8A96E',
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  lowLabel: string
  highLabel: string
  activeColor?: string
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="relative h-8 flex items-center">
        <div
          className="absolute inset-x-0 h-1.5 rounded-full"
          style={{ background: 'rgba(26,24,20,0.08)' }}
        />
        <div
          className="absolute left-0 h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%`, background: activeColor }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-x-0 w-full opacity-0 h-8 cursor-pointer"
        />
        <div
          className="absolute w-5 h-5 rounded-full shadow-sm transition-all"
          style={{
            left: `calc(${pct}% - 10px)`,
            background: '#FFFFFF',
            border: `2px solid ${activeColor}`,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-light" style={{ color: 'rgba(26,24,20,0.32)' }}>
        <span>{lowLabel}</span>
        <span className="text-[13px] font-light" style={{ color: activeColor }}>{value}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}

function RecoveryCard({ result }: { result: CheckInResponse }) {
  const copy = COPY
  const style = copy.status[result.recovery_status as RecoveryStatus]
  const hint = copy.hint[result.recovery_status as RecoveryStatus]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, type: 'spring', stiffness: 200, damping: 20 }}
      className="rounded-2xl p-5 space-y-4"
      style={{ background: style.bg, border: `1px solid ${style.border}` }}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
            <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(26,24,20,0.06)" strokeWidth="4" />
            <circle
              cx="28" cy="28" r="22" fill="none"
              stroke={style.color} strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - result.recovery_score / 100)}`}
              className="transition-all duration-700"
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-[14px] font-light"
            style={{ color: style.color }}
          >
            {result.recovery_score}
          </span>
        </div>
        <div>
          <p className="text-[16px] font-light" style={{ color: style.color }}>{style.label}</p>
          <p className="text-[11px] font-light mt-0.5" style={{ color: 'rgba(26,24,20,0.38)' }}>
            {copy.recoveryLabel} · {result.recovery_score}/100
          </p>
        </div>
      </div>

      <p className="text-[12px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.55)' }}>
        <span style={{ color: style.color, marginRight: 6 }}>✦</span>
        {hint}
      </p>

      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { label: 'Sleep', value: `${result.sleep_hours}h` },
          { label: 'Energy', value: `${result.energy_level}/10` },
          { label: 'Stress', value: `${result.stress_level}/10` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl px-2 py-2.5 text-center"
            style={{ background: 'rgba(26,24,20,0.04)', border: '1px solid rgba(26,24,20,0.06)' }}
          >
            <p className="text-[10px] font-light" style={{ color: 'rgba(26,24,20,0.38)' }}>{label}</p>
            <p className="text-[13px] font-light mt-0.5" style={{ color: '#1A1814' }}>{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function CheckInPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/plan'
  const copy = COPY

  const cached = readCheckinCache()

  const [sleepHours, setSleepHours] = useState(cached?.sleep_hours ?? 7)
  const [energyLevel, setEnergyLevel] = useState(cached?.energy_level ?? 7)
  const [stressLevel, setStressLevel] = useState(cached?.stress_level ?? 4)
  const [weightKg, setWeightKg] = useState(cached?.weight_kg?.toString() ?? '')
  const [notes, setNotes] = useState(cached?.notes ?? '')

  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>(cached ? 'done' : 'idle')
  const [result, setResult] = useState<CheckInResponse | null>(cached)
  const [alreadyDone, setAlreadyDone] = useState(Boolean(cached))

  useEffect(() => {
    getTodayCheckIn().then((res) => {
      if (res.exists && res.checkin) {
        const c = res.checkin
        setAlreadyDone(true)
        setResult(c)
        setSleepHours(c.sleep_hours)
        setEnergyLevel(c.energy_level)
        setStressLevel(c.stress_level)
        setWeightKg(c.weight_kg?.toString() ?? '')
        setNotes(c.notes ?? '')
        setStatus((s) => s === 'idle' ? 'done' : s)
        writeCheckinCache(c)
      } else {
        clearCheckinCache()
      }
    }).catch(() => {/* ignore */})
  }, [])

  const handleSubmit = async () => {
    if (status === 'loading') return
    setStatus('loading')
    try {
      const res = await submitCheckIn({
        sleep_hours: sleepHours,
        energy_level: energyLevel,
        stress_level: stressLevel,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        notes: notes.trim() || null,
      })
      writeCheckinCache(res)
      setResult(res)
      setAlreadyDone(true)
      setStatus('done')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8', color: '#1A1814' }}>
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 flex-shrink-0">
        <BackButton />
        <div>
          <h1 className="text-[17px] font-light tracking-wide">{copy.title}</h1>
          <p className="text-[11px] font-light mt-0.5" style={{ color: 'rgba(26,24,20,0.38)' }}>
            {copy.subtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-5">
        <AnimatePresence>
          {alreadyDone && status === 'done' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: 'rgba(87,200,120,0.07)', border: '1px solid rgba(87,200,120,0.2)' }}
            >
              <span className="text-[12px] font-light" style={{ color: '#57C878' }}>
                ✓ {copy.alreadyDone}
              </span>
              <button
                className="text-[11px] font-light px-3 py-1 rounded-lg"
                style={{ background: 'rgba(26,24,20,0.05)', color: 'rgba(26,24,20,0.45)' }}
                onClick={() => setStatus('idle')}
              >
                {copy.resubmit}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {status === 'done' && result && (
            <RecoveryCard result={result} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {status !== 'done' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div
                className="rounded-2xl p-4 space-y-3"
                style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="flex justify-between items-center">
                  <p className="text-[13px] font-light">{copy.sleep}</p>
                  <span className="text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.38)' }}>
                    {sleepHours} {copy.sleepUnit}
                  </span>
                </div>
                <SliderInput
                  value={sleepHours}
                  onChange={setSleepHours}
                  min={1}
                  max={12}
                  lowLabel="1h"
                  highLabel="12h"
                  activeColor="#8FA8C8"
                />
              </div>

              <div
                className="rounded-2xl p-4 space-y-3"
                style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <p className="text-[13px] font-light">{copy.energy}</p>
                <SliderInput
                  value={energyLevel}
                  onChange={setEnergyLevel}
                  min={1}
                  max={10}
                  lowLabel={copy.low}
                  highLabel={copy.high}
                  activeColor="#57C878"
                />
              </div>

              <div
                className="rounded-2xl p-4 space-y-3"
                style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <p className="text-[13px] font-light">{copy.stress}</p>
                <SliderInput
                  value={stressLevel}
                  onChange={setStressLevel}
                  min={1}
                  max={10}
                  lowLabel={copy.low}
                  highLabel={copy.high}
                  activeColor="#C07878"
                />
              </div>

              <div
                className="rounded-2xl p-4 space-y-2"
                style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <p className="text-[13px] font-light">{copy.weight}</p>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder={copy.weightPlaceholder}
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] font-light outline-none"
                  style={{ background: '#F7FBF4', border: '1px solid rgba(26,24,20,0.08)', color: '#1A1814' }}
                />
              </div>

              <div
                className="rounded-2xl p-4 space-y-2"
                style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <p className="text-[13px] font-light">{copy.notes}</p>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={copy.notesPlaceholder}
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] font-light outline-none resize-none"
                  style={{ background: '#F7FBF4', border: '1px solid rgba(26,24,20,0.08)', color: '#1A1814' }}
                />
              </div>

              <motion.button
                className="w-full rounded-2xl py-4 text-[14px] font-light tracking-wider"
                style={{
                  background: status === 'loading' ? 'rgba(87,200,120,0.5)' : '#57C878',
                  border: '1px solid rgba(47,143,88,0.28)',
                  color: '#FFFFFF',
                }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? copy.submitting : copy.submit}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {status === 'done' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full rounded-2xl py-4 text-[14px] font-light tracking-wider"
              style={{
                background: '#57C878',
                border: '1px solid rgba(47,143,88,0.28)',
                color: '#FFFFFF',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(redirectTo)}
            >
              Generate Today's Plan →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
