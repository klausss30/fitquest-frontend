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

function LegsPose() {
  return (
    <>
      <path d="M32 28v13" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.path
        d="M32 41l-11 10"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M32 41l-11 10', 'M32 41l-13 5', 'M32 41l-11 10'] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M33 41l13 8"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M33 41l13 8', 'M33 41l10 12', 'M33 41l13 8'] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path d="M19 52h10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M43 54h10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

function ChestPose() {
  return (
    <>
      <path d="M32 28v16" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.path
        d="M30 34H16"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M30 34H16', 'M30 34H12', 'M30 34H16'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M34 34h14"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M34 34h14', 'M34 34h18', 'M34 34h14'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path d="M32 44l-8 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 44l9 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

function BackPose() {
  return (
    <>
      <path d="M32 28v17" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.path
        d="M30 34c-7 2-12 6-15 11"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{
          d: ['M30 34c-7 2-12 6-15 11', 'M30 34c-8-1-14 1-19 5', 'M30 34c-7 2-12 6-15 11'],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M34 34c7 2 12 6 15 11"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{
          d: ['M34 34c7 2 12 6 15 11', 'M34 34c8-1 14 1 19 5', 'M34 34c7 2 12 6 15 11'],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path d="M19 38h26" stroke={green} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 45l-8 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 45l9 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

function ShouldersPose() {
  return (
    <>
      <path d="M32 29v16" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.path
        d="M30 34l-10-12"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M30 34l-10-12', 'M30 34l-8-17', 'M30 34l-10-12'] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M34 34l10-12"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M34 34l10-12', 'M34 34l8-17', 'M34 34l10-12'] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path d="M16 19h9" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M39 19h9" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 45l-8 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 45l9 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

function ArmsPose() {
  return (
    <>
      <path d="M32 28v17" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.path
        d="M30 34c-8 3-10 9-8 14"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{
          d: ['M30 34c-8 3-10 9-8 14', 'M30 34c-7 1-10 4-11 9', 'M30 34c-8 3-10 9-8 14'],
        }}
        transition={{ duration: 1.45, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M34 34c8 3 10 9 8 14"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{
          d: ['M34 34c8 3 10 9 8 14', 'M34 34c7 1 10 4 11 9', 'M34 34c8 3 10 9 8 14'],
        }}
        transition={{ duration: 1.45, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path d="M17 46h9" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M38 46h9" stroke={green} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 45l-8 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 45l9 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

function FullBodyPose() {
  return (
    <>
      <motion.path
        d="M32 28v16"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M32 28v16', 'M32 26v16', 'M32 28v16'] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M30 35l-13-8"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M30 35l-13-8', 'M30 33l-15-13', 'M30 35l-13-8'] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M34 35l13-8"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M34 35l13-8', 'M34 33l15-13', 'M34 35l13-8'] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M32 44l-11 11"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M32 44l-11 11', 'M32 42l-15 8', 'M32 44l-11 11'] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M33 44l11 11"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M33 44l11 11', 'M33 42l15 8', 'M33 44l11 11'] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

function RestPose() {
  return (
    <>
      <path d="M32 29v14" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M30 36l-11 5" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M34 36l11 5" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M31 43l-8 8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 43l9 8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.path
        d="M44 18h8"
        stroke={green}
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

function CoachPose() {
  return (
    <>
      <path d="M32 29v15" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.path
        d="M30 35l-13-8"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M30 35l-13-8', 'M30 34l-12-14', 'M30 35l-13-8'] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <path d="M34 35l13 8" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 44l-9 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M33 44l10 10" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <motion.path
        d="M13 20h8"
        stroke={gold}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
    </>
  )
}

function CelebratePose() {
  return (
    <>
      <motion.path
        d="M32 28v16"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M32 28v16', 'M32 27v16', 'M32 28v16'] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M30 34L17 18"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M30 34L17 18', 'M30 33L14 15', 'M30 34L17 18'] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M34 34l13-16"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M34 34l13-16', 'M34 33l16-18', 'M34 34l13-16'] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M32 44l-10 11"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M32 44l-10 11', 'M32 43l-13 8', 'M32 44l-10 11'] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M33 44l10 11"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ d: ['M33 44l10 11', 'M33 43l13 8', 'M33 44l10 11'] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M12 24l3 3 5-8"
        stroke={gold}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M46 24l3 3 5-8"
        stroke={gold}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ opacity: [1, 0.35, 1], y: [-3, 0, -3] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
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
