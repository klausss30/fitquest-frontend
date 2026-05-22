import { motion } from 'framer-motion'

type StickCoachVariant = 'login' | 'onboarding'

interface StickCoachProps {
  variant?: StickCoachVariant
  label?: string
  size?: 'sm' | 'md'
}

const shellSize = {
  sm: 'h-28 w-28',
  md: 'h-36 w-36',
}

function DumbbellArm() {
  const transition = { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const }

  return (
    <>
      <motion.path
        d="M52 51C39 48 29 41 24 32"
        stroke="#1A1814"
        strokeWidth="5"
        strokeLinecap="round"
        animate={{
          d: [
            'M52 51C39 48 29 41 24 32',
            'M52 51C40 42 35 28 29 17',
            'M52 51C39 48 29 41 24 32',
          ],
        }}
        transition={transition}
      />
      <motion.path
        d="M17 25L31 39"
        stroke="#57C878"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{
          d: ['M17 25L31 39', 'M22 10L36 24', 'M17 25L31 39'],
        }}
        transition={transition}
      />
      <motion.path
        d="M13 29L21 21"
        stroke="#57C878"
        strokeWidth="5"
        strokeLinecap="round"
        animate={{
          d: ['M13 29L21 21', 'M18 14L26 6', 'M13 29L21 21'],
        }}
        transition={transition}
      />
      <motion.path
        d="M27 43L35 35"
        stroke="#57C878"
        strokeWidth="5"
        strokeLinecap="round"
        animate={{
          d: ['M27 43L35 35', 'M32 28L40 20', 'M27 43L35 35'],
        }}
        transition={transition}
      />
    </>
  )
}

function OnboardingArm() {
  return (
    <>
      <motion.path
        d="M52 51C41 51 34 47 29 40"
        stroke="#1A1814"
        strokeWidth="5"
        strokeLinecap="round"
        animate={{
          d: [
            'M52 51C41 51 34 47 29 40',
            'M52 51C41 45 36 37 32 29',
            'M52 51C41 51 34 47 29 40',
          ],
        }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.g
        animate={{ y: [0, -5, 0], rotate: [-2, 5, -2] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        <rect x="17" y="29" width="20" height="18" rx="4" fill="#FFF2C7" stroke="#1A1814" strokeWidth="3" />
        <path d="M22 36H32" stroke="#57C878" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 41H30" stroke="#57C878" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
    </>
  )
}

export default function StickCoach({ variant = 'login', label, size = 'md' }: StickCoachProps) {
  const isOnboarding = variant === 'onboarding'

  return (
    <motion.div
      className={`relative flex ${shellSize[size]} items-center justify-center`}
      animate={{ y: [0, isOnboarding ? -5 : -7, 0] }}
      transition={{ duration: isOnboarding ? 4.8 : 4.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: '#FFFFFF',
          border: '2px solid rgba(87,200,120,0.38)',
          boxShadow: '0 0 0 9px rgba(87,200,120,0.08), 0 20px 42px rgba(61,104,72,0.13)',
        }}
      />
      {label && (
        <motion.div
          className="absolute -right-1 top-8 rounded-full px-3 py-1 text-[11px] font-semibold"
          style={{ background: '#FFF2C7', color: '#8A6428', boxShadow: '0 8px 18px rgba(138,100,40,0.12)' }}
          animate={{ rotate: [2, -3, 2], y: [0, -3, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {label}
        </motion.div>
      )}
      <svg width="108" height="118" viewBox="0 0 108 118" fill="none" aria-hidden="true" className="relative z-10">
        <motion.g
          animate={{ rotate: isOnboarding ? [-1, 1.5, -1] : [-2, 2, -2] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '54px', originY: '60px' }}
        >
          <circle cx="54" cy="24" r="17" fill="#F8FCF5" stroke="#1A1814" strokeWidth="4" />
          <path d="M41 19C47 13 59 12 67 19" stroke="#57C878" strokeWidth="5" strokeLinecap="round" />
          <path d="M48 25H48.5" stroke="#1A1814" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 25H60.5" stroke="#1A1814" strokeWidth="4" strokeLinecap="round" />
          <path d={isOnboarding ? 'M48 32C52 35 58 35 62 31' : 'M49 32C52 35 57 35 60 32'} stroke="#1A1814" strokeWidth="3" strokeLinecap="round" />
          <path d="M54 42V72" stroke="#1A1814" strokeWidth="5" strokeLinecap="round" />
          {isOnboarding ? <OnboardingArm /> : <DumbbellArm />}
          <path d="M56 51C69 50 77 57 82 67" stroke="#1A1814" strokeWidth="5" strokeLinecap="round" />
          <path d="M54 72L39 101" stroke="#1A1814" strokeWidth="5" strokeLinecap="round" />
          <path d="M55 72L74 99" stroke="#1A1814" strokeWidth="5" strokeLinecap="round" />
          <path d="M34 104H45" stroke="#1A1814" strokeWidth="5" strokeLinecap="round" />
          <path d="M70 103H83" stroke="#1A1814" strokeWidth="5" strokeLinecap="round" />
        </motion.g>
      </svg>
      <div
        className="absolute bottom-4 h-3 w-20 rounded-full"
        style={{ background: 'rgba(61,104,72,0.10)', filter: 'blur(1px)' }}
      />
    </motion.div>
  )
}
