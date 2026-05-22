import { motion } from 'framer-motion'
import { WeekPlanMuscleGroup } from '../../types'

interface WorkoutCoachIconProps {
  muscleGroup?: WeekPlanMuscleGroup | 'coach' | 'celebrate'
  muted?: boolean
  size?: number
}

const stroke = '#1A1814'
const green = '#57C878'
const gold = '#FFF2C7'
const loop = { repeat: Infinity, ease: 'easeInOut' as const }

function LegsPose() {
  return (
    <motion.g animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, ...loop }}>
      <path d="M32 28v12" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M28 34l-13 3" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M36 34l13 3" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 40l-13 7" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 40l14 7" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M15 49h12" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M41 49h12" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </motion.g>
  )
}

function ChestPose() {
  return (
    <motion.g animate={{ y: [0, 4, 0] }} transition={{ duration: 1.25, ...loop }}>
      <path d="M18 42l28 4" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M25 43l-9 9" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M38 45l9 9" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M12 55h40" stroke={green} strokeWidth="3" strokeLinecap="round" />
    </motion.g>
  )
}

function BackPose() {
  return (
    <>
      <path d="M15 10h34" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.45, ...loop }}>
        <path d="M32 28v17" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M30 29L20 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 29l10-19" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M32 45l-8 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M33 45l9 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
    </>
  )
}

function ShouldersPose() {
  return (
    <>
      <path d="M32 29v16" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.g animate={{ rotate: [-5, 8, -5] }} transition={{ duration: 1.5, ...loop }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d="M30 35L13 30" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 35l17-5" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M7 30h8" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M49 30h8" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
      <path d="M32 45l-8 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 45l9 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

function ArmsPose() {
  return (
    <>
      <path d="M32 28v17" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.45, ...loop }}>
        <path d="M30 34c-8 3-10 9-8 14" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 34c8 3 10 9 8 14" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M17 46h9" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M38 46h9" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
      <path d="M32 45l-8 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 45l9 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

function FullBodyPose() {
  return (
    <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.35, ...loop }}>
      <path d="M32 28v16" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M30 35l-15-13" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M34 35l15-13" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 44l-15 8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 44l15 8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </motion.g>
  )
}

function RestPose() {
  return (
    <>
      <path d="M13 45h38" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M16 39h30" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M17 35h10" stroke={gold} strokeWidth="5" strokeLinecap="round" />
      <path d="M28 39l-8 8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M39 39l8 7" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.g animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 2.4, ...loop }}>
        <path d="M45 17h7l-7 7h7" stroke={green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M52 10h5l-5 5h5" stroke={green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </>
  )
}

function CoachPose() {
  return (
    <>
      <path d="M32 29v15" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.g animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1.9, ...loop }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d="M30 35l-13-8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M13 20h8" stroke={gold} strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
      <path d="M34 35l13 8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 44l-9 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 44l10 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

function CelebratePose() {
  return (
    <>
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 1, ...loop }}>
        <path d="M32 28v16" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M30 34L14 15" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 34l16-18" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M32 44l-13 8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M33 44l13 8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
      <motion.g animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.6, ...loop }}>
        <path d="M12 24l3 3 5-8" stroke={gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M46 24l3 3 5-8" stroke={gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </>
  )
}

function Pose({ muscleGroup }: { muscleGroup: WorkoutCoachIconProps['muscleGroup'] }) {
  switch (muscleGroup) {
    case 'legs':
      return <LegsPose />
    case 'chest':
      return <ChestPose />
    case 'back':
      return <BackPose />
    case 'shoulders':
      return <ShouldersPose />
    case 'arms':
      return <ArmsPose />
    case 'full_body':
      return <FullBodyPose />
    case 'rest':
      return <RestPose />
    case 'celebrate':
      return <CelebratePose />
    case 'coach':
    default:
      return <CoachPose />
  }
}

export default function WorkoutCoachIcon({ muscleGroup = 'coach', muted = false, size = 44 }: WorkoutCoachIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      animate={{ y: [0, muscleGroup === 'rest' ? -1 : muscleGroup === 'celebrate' ? -4 : -2, 0] }}
      transition={{ duration: muscleGroup === 'celebrate' ? 1.2 : 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ opacity: muted ? 0.58 : 1 }}
    >
      <circle cx="32" cy="32" r="28" fill={muted ? '#F1F1EE' : '#FFFFFF'} />
      <circle cx="32" cy="19" r="8" fill="#F8FCF5" stroke={stroke} strokeWidth="3" />
      <path d="M26 17c3-4 9-4 13 0" stroke={green} strokeWidth="3" strokeLinecap="round" />
      <path d="M29 21h.2" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M35 21h.2" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M29 25c2 2 5 2 7 0" stroke={stroke} strokeWidth="2.3" strokeLinecap="round" />
      <Pose muscleGroup={muscleGroup} />
    </motion.svg>
  )
}
