import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCoachCopy } from '../copy/coachCopy'
import { getStats, getTodayCheckIn } from '../services/api'
import { RecoveryStatus, StatsResponse } from '../types'
import { CHECKIN_CACHE_KEY, STATS_CACHE_KEY } from '../utils/storageKeys'

// ── Cache helpers ─────────────────────────────────────────────────────────────

function readCache<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T } catch { return null }
}
function writeCache<T>(key: string, v: T) {
  try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* ignore */ }
}

// ── Recovery colour map ───────────────────────────────────────────────────────

const RECOVERY_COLOR: Record<RecoveryStatus, string> = {
  excellent: '#57C878',
  good:      '#7AB8A0',
  moderate:  '#C8A96E',
  low:       '#B8935A',
  poor:      '#C07878',
}

// ── Shared floating bubble ────────────────────────────────────────────────────

interface MiniBubbleProps {
  label: string
  sublabel?: string
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: number
  delay: number
  onClick?: () => void
  accentColor?: string
}

function MiniBubble({ label, sublabel, top, bottom, left, right, size, delay, onClick, accentColor }: MiniBubbleProps) {
  return (
    <div className="absolute" style={{ top, bottom, left, right }}>
      <motion.button
        className="rounded-full flex flex-col items-center justify-center cursor-pointer gap-0.5"
        style={{
          width: size,
          height: size,
          background: '#FFFFFF',
          border: `1px solid ${accentColor ? `${accentColor}44` : 'rgba(87,200,120,0.2)'}`,
          boxShadow: accentColor
            ? `0 8px 24px ${accentColor}22`
            : '0 8px 24px rgba(61,104,72,0.08)',
          color: accentColor ?? 'rgba(26,24,20,0.48)',
        }}
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
        transition={{
          opacity: { delay, duration: 0.35 },
          scale: { delay, duration: 0.5, type: 'spring', stiffness: 170, damping: 16 },
          y: { delay, duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
      >
        <span className="text-[12px] font-light tracking-wide leading-none">{label}</span>
        {sublabel && (
          <span className="text-[8px] font-light leading-none mt-0.5" style={{ color: 'rgba(26,24,20,0.32)' }}>
            {sublabel}
          </span>
        )}
      </motion.button>
    </div>
  )
}

// ── Check-In bubble ───────────────────────────────────────────────────────────

interface CheckInCache { score: number; status: RecoveryStatus }

function CheckInBubble({ delay }: { delay: number }) {
  const navigate = useNavigate()

  // Render cached value immediately — no delay on repeat visits
  const [score, setScore] = useState<number | null>(() => readCache<CheckInCache>(CHECKIN_CACHE_KEY)?.score ?? null)
  const [status, setStatus] = useState<RecoveryStatus | null>(() => readCache<CheckInCache>(CHECKIN_CACHE_KEY)?.status ?? null)

  useEffect(() => {
    getTodayCheckIn()
      .then((res) => {
        if (res.exists && res.checkin) {
          const s = res.checkin.recovery_score
          const st = res.checkin.recovery_status as RecoveryStatus
          setScore(s)
          setStatus(st)
          writeCache<CheckInCache>(CHECKIN_CACHE_KEY, { score: s, status: st })
        } else {
          // Not checked in today — clear stale cache from yesterday
          setScore(null)
          setStatus(null)
          writeCache(CHECKIN_CACHE_KEY, null)
        }
      })
      .catch(() => {/* silent — keep showing cached value */})
  }, [])

  const accentColor = status ? RECOVERY_COLOR[status] : undefined
  const label = score !== null ? `${score}` : 'Check'

  return (
    <div className="absolute" style={{ top: '22px', left: '12px' }}>
      <motion.button
        className="rounded-full flex flex-col items-center justify-center cursor-pointer gap-0.5"
        style={{
          width: 58,
          height: 58,
          background: '#FFFFFF',
          border: `1px solid ${accentColor ? `${accentColor}44` : 'rgba(87,200,120,0.2)'}`,
          boxShadow: accentColor
            ? `0 8px 24px ${accentColor}22`
            : '0 8px 24px rgba(61,104,72,0.08)',
          color: accentColor ?? 'rgba(26,24,20,0.48)',
        }}
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
        transition={{
          opacity: { delay, duration: 0.35 },
          scale: { delay, duration: 0.5, type: 'spring', stiffness: 170, damping: 16 },
          y: { delay, duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate('/checkin')}
      >
        {score !== null ? (
          <>
            <span className="text-[14px] font-light leading-none">{score}</span>
            <span className="text-[8px] font-light leading-none" style={{ color: 'rgba(26,24,20,0.32)' }}>
              status
            </span>
          </>
        ) : (
          <span className="text-[11px] font-light tracking-wide">{label}</span>
        )}
      </motion.button>
    </div>
  )
}

// ── Stats strip ───────────────────────────────────────────────────────────────

const COPY = {
  streak: (n: number) => `🔥 ${n}d`,
  streakLabel: 'streak',
  week: (n: number) => `${n}`,
  weekLabel: 'this wk',
}

function StatsStrip() {
  // Render cached stats immediately — API refresh happens silently in background
  const [stats, setStats] = useState<StatsResponse | null>(() => readCache<StatsResponse>(STATS_CACHE_KEY))
  const copy = COPY

  useEffect(() => {
    getStats()
      .then((data) => {
        setStats(data)
        writeCache(STATS_CACHE_KEY, data)
      })
      .catch(() => {/* silent — keep showing cached value */})
  }, [])

  if (!stats) return null

  return (
    <motion.div
      className="flex items-center justify-center gap-6 mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
    >
      {/* Streak */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[15px] font-light" style={{ color: '#C8A96E' }}>
          {copy.streak(stats.streak)}
        </span>
        <span className="text-[9px] font-light tracking-widest uppercase" style={{ color: 'rgba(26,24,20,0.28)' }}>
          {copy.streakLabel}
        </span>
      </div>

      <div style={{ width: 1, height: 24, background: 'rgba(26,24,20,0.08)' }} />

      {/* This week */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[15px] font-light" style={{ color: '#57C878' }}>
          {copy.week(stats.sessions_this_week)}
        </span>
        <span className="text-[9px] font-light tracking-widest uppercase" style={{ color: 'rgba(26,24,20,0.28)' }}>
          {copy.weekLabel}
        </span>
      </div>

    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate  = useNavigate()
  const coachCopy = useCoachCopy()

  return (
    <div className="relative min-h-screen overflow-hidden px-6 select-none" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{ background: 'linear-gradient(180deg, rgba(129,214,154,0.16) 0%, rgba(247,251,244,0) 100%)' }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">

        {/* App identity */}
        <motion.div
          className="flex flex-col items-center mb-10"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-[26px] font-semibold tracking-tight" style={{ color: '#1A1814' }}>
            FitQuest
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#57C878' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-[11px] font-light tracking-[0.16em] uppercase" style={{ color: 'rgba(26,24,20,0.38)' }}>
              Reasoning Agent
            </span>
          </div>
        </motion.div>

        <div className="relative" style={{ width: 300, height: 300 }}>

          {/* Check-In bubble — top left, shows recovery score instantly from cache */}
          <CheckInBubble delay={0.12} />

          {/* Records — top right */}
          <MiniBubble
            label={coachCopy.home.records}
            size={58}
            top="22px" right="12px"
            delay={0.2}
            onClick={() => navigate('/records')}
          />

          {/* Nutrition — bottom left */}
          <MiniBubble
            label="Nutrition"
            sublabel="Meal Plan"
            size={62}
            bottom="18px" left="8px"
            delay={0.28}
            accentColor="#C8A96E"
            onClick={() => navigate('/nutrition')}
          />

          {/* Settings — bottom right */}
          <MiniBubble
            label="Settings"
            size={62}
            bottom="18px" right="8px"
            delay={0.34}
            onClick={() => navigate('/settings')}
          />

          {/* Centre button */}
          <div
            className="absolute"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 150, height: 150 }}
          >
            <motion.button
              className="h-full w-full rounded-full flex flex-col items-center justify-center outline-none"
              style={{
                background: '#FFFFFF',
                border: '2px solid rgba(87,200,120,0.5)',
                boxShadow: '0 0 0 8px rgba(87,200,120,0.08), 0 18px 36px rgba(61,104,72,0.14)',
              }}
              initial={{ opacity: 0, scale: 0.45 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.35 },
                scale: { duration: 0.65, type: 'spring', stiffness: 150, damping: 14 },
                y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => navigate('/week')}
            >
              <span className="text-[28px] leading-none" style={{ color: '#57C878' }}>▶</span>
              <span className="mt-3 text-[14px] font-semibold tracking-wide">{coachCopy.home.start}</span>
              <span className="mt-1 text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
                {coachCopy.home.startSub}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Stats strip — instant on repeat visits (localStorage cache) */}
        <StatsStrip />

      </div>
    </div>
  )
}
