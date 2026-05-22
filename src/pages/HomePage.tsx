import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCoachCopy } from '../copy/coachCopy'

interface MiniBubbleProps {
  label: string
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: number
  delay: number
  onClick?: () => void
}

function MiniBubble({ label, top, bottom, left, right, size, delay, onClick }: MiniBubbleProps) {
  return (
    <div className="absolute" style={{ top, bottom, left, right }}>
      <motion.button
        className="rounded-full flex items-center justify-center cursor-pointer"
        style={{
          width: size,
          height: size,
          background: '#FFFFFF',
          border: '1px solid rgba(87,200,120,0.2)',
          boxShadow: '0 8px 24px rgba(61,104,72,0.08)',
          color: 'rgba(26,24,20,0.48)',
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
        <span className="text-[12px] font-light tracking-wide">{label}</span>
      </motion.button>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const coachCopy = useCoachCopy()

  return (
    <div className="relative min-h-screen overflow-hidden px-6 select-none" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{ background: 'linear-gradient(180deg, rgba(129,214,154,0.16) 0%, rgba(247,251,244,0) 100%)' }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <div className="relative" style={{ width: 300, height: 300 }}>
          <MiniBubble label={coachCopy.home.records} size={58} top="22px" right="12px" delay={0.2} onClick={() => navigate('/records')} />
          <MiniBubble label={coachCopy.home.profile} size={62} bottom="18px" right="8px" delay={0.34} onClick={() => navigate('/profile')} />

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

        <motion.p
          className="mt-10 text-[12px] font-light"
          style={{ color: 'rgba(26,24,20,0.34)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.45 }}
        >
          {coachCopy.home.hint}
        </motion.p>
      </div>
    </div>
  )
}
