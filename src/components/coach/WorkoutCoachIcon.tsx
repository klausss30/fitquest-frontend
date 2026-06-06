import { motion } from 'framer-motion'
import { WeekPlanMuscleGroup } from '../../types'

interface WorkoutCoachIconProps {
  muscleGroup?: WeekPlanMuscleGroup | 'coach' | 'celebrate'
  muted?: boolean
  size?: number
}

const stroke = '#1A1814'
const green = '#57C878'
const gold = '#FFC94D'
const skin = '#F8FCF5'
const loop = { repeat: Infinity, ease: 'easeInOut' as const }
const sw = 4  // limb stroke width

// Mini dumbbell — short bar with round plates
function DB({ x, y }: { x: number; y: number }) {
  return (
    <>
      <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke={stroke} strokeWidth="2.5" strokeLinecap="butt" />
      <circle cx={x - 5} cy={y} r="2.8" fill={stroke} />
      <circle cx={x + 5} cy={y} r="2.8" fill={stroke} />
    </>
  )
}

// Small chibi body torso
function Torso() {
  return <rect x="26" y="23" width="12" height="11" rx="4" fill={skin} stroke={stroke} strokeWidth="2.5" />
}

// Default standing legs
function StandLegs() {
  return (
    <>
      <line x1="29" y1="34" x2="26" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="35" y1="34" x2="38" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="22" y1="52" x2="30" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="34" y1="52" x2="42" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </>
  )
}

// Squat: arms forward for balance, wide legs with bent knees
function LegsPose() {
  return (
    <motion.g animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, ...loop }}>
      <Torso />
      {/* balance arms out front */}
      <line x1="26" y1="28" x2="12" y2="34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="38" y1="28" x2="52" y2="34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* thighs wide out */}
      <line x1="28" y1="34" x2="15" y2="46" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="36" y1="34" x2="49" y2="46" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* shins pointing back in */}
      <line x1="15" y1="46" x2="12" y2="57" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="49" y1="46" x2="52" y2="57" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* feet */}
      <line x1="8" y1="57" x2="16" y2="57" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="48" y1="57" x2="56" y2="57" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </motion.g>
  )
}

// Chest fly: arms spread wide at shoulder height with dumbbells
function ChestPose() {
  return (
    <>
      <Torso />
      <StandLegs />
      {/* left arm opening */}
      <motion.g animate={{ x: [3, 0, 3] }} transition={{ duration: 1.4, ...loop }}>
        <line x1="26" y1="27" x2="10" y2="27" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <DB x={7} y={27} />
      </motion.g>
      {/* right arm opening */}
      <motion.g animate={{ x: [-3, 0, -3] }} transition={{ duration: 1.4, ...loop }}>
        <line x1="38" y1="27" x2="54" y2="27" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <DB x={57} y={27} />
      </motion.g>
    </>
  )
}

// Lat pulldown: arms up gripping bar that pulls down
function BackPose() {
  return (
    <>
      <Torso />
      <StandLegs />
      {/* bar + arms animate down together (lat pulldown motion) */}
      <motion.g animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, ...loop }}>
        <line x1="10" y1="5" x2="54" y2="5" stroke={green} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="26" y1="26" x2="19" y2="7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="38" y1="26" x2="45" y2="7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* grips */}
        <circle cx="19" cy="6" r="3.5" fill="none" stroke={stroke} strokeWidth="2.5" />
        <circle cx="45" cy="6" r="3.5" fill="none" stroke={stroke} strokeWidth="2.5" />
      </motion.g>
    </>
  )
}

// Overhead press: dumbbells raised above head
function ShouldersPose() {
  return (
    <>
      <Torso />
      <StandLegs />
      {/* arms pressing up */}
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 1.3, ...loop }}>
        <line x1="26" y1="26" x2="17" y2="15" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <DB x={14} y={12} />
        <line x1="38" y1="26" x2="47" y2="15" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <DB x={50} y={12} />
      </motion.g>
    </>
  )
}

// Bicep curl: one arm curling dumbbell up
function ArmsPose() {
  return (
    <>
      <Torso />
      <StandLegs />
      {/* resting left arm */}
      <line x1="26" y1="28" x2="16" y2="40" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* curling right arm: upper arm + forearm */}
      <line x1="38" y1="28" x2="48" y2="36" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <motion.g animate={{ rotate: [-20, 10, -20] }} transition={{ duration: 1.2, ...loop }} style={{ transformOrigin: '48px 36px', transformBox: 'fill-box' }}>
        <line x1="48" y1="36" x2="54" y2="25" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <DB x={54} y={22} />
      </motion.g>
    </>
  )
}

// Star jump / jumping jack: arms & legs spread wide
function FullBodyPose() {
  return (
    <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.1, ...loop }}>
      <Torso />
      {/* arms up-out */}
      <line x1="26" y1="26" x2="11" y2="14" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="38" y1="26" x2="53" y2="14" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* legs spread wide */}
      <line x1="28" y1="34" x2="14" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="36" y1="34" x2="50" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* feet */}
      <line x1="10" y1="52" x2="18" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="46" y1="52" x2="54" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </motion.g>
  )
}

// Rest / seated with ZZZ
function RestPose() {
  return (
    <>
      <Torso />
      {/* arms drooping loosely */}
      <line x1="26" y1="28" x2="14" y2="38" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="38" y1="28" x2="50" y2="38" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* legs sitting: thighs forward, shins down */}
      <line x1="28" y1="34" x2="20" y2="46" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="36" y1="34" x2="44" y2="46" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="20" y1="46" x2="20" y2="56" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="44" y1="46" x2="44" y2="56" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="16" y1="56" x2="24" y2="56" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="40" y1="56" x2="48" y2="56" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* floating ZZZ */}
      <motion.g animate={{ opacity: [0.25, 1, 0.25], y: [0, -5, 0] }} transition={{ duration: 2.4, ...loop }}>
        <path d="M44 20h7l-7 7h7" stroke={green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M51 13h5l-5 5h5" stroke={green} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.g>
    </>
  )
}

// Coach pose: pointing arm + proud stance
function CoachPose() {
  return (
    <>
      <Torso />
      <StandLegs />
      {/* left arm on hip */}
      <line x1="26" y1="27" x2="18" y2="33" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="18" y1="33" x2="22" y2="29" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* right arm pointing forward — gentle wave */}
      <motion.g animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1.9, ...loop }} style={{ transformOrigin: '38px 27px', transformBox: 'fill-box' }}>
        <line x1="38" y1="27" x2="54" y2="20" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* pointing finger dot */}
        <circle cx="55" cy="18" r="3" fill={stroke} />
      </motion.g>
    </>
  )
}

// Celebrate: both arms up in V, sparkle stars
function CelebratePose() {
  return (
    <>
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.0, ...loop }}>
        <Torso />
        {/* arms raised V */}
        <line x1="26" y1="26" x2="13" y2="13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="38" y1="26" x2="51" y2="13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* legs slightly apart */}
        <line x1="29" y1="34" x2="25" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="35" y1="34" x2="39" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="21" y1="52" x2="29" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="35" y1="52" x2="43" y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </motion.g>
      {/* sparkle stars */}
      <motion.g animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }} transition={{ duration: 1.4, ...loop }} style={{ transformOrigin: '32px 20px' }}>
        <line x1="9" y1="14" x2="9" y2="22" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="18" x2="13" y2="18" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="15" x2="12" y2="21" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="15" x2="6" y2="21" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
      <motion.g animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }} transition={{ duration: 1.4, delay: 0.5, ...loop }} style={{ transformOrigin: '55px 20px' }}>
        <line x1="55" y1="14" x2="55" y2="22" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <line x1="51" y1="18" x2="59" y2="18" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <line x1="52" y1="15" x2="58" y2="21" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="58" y1="15" x2="52" y2="21" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
    </>
  )
}

function Pose({ muscleGroup }: { muscleGroup: WorkoutCoachIconProps['muscleGroup'] }) {
  switch (muscleGroup) {
    case 'legs':      return <LegsPose />
    case 'chest':     return <ChestPose />
    case 'back':      return <BackPose />
    case 'shoulders': return <ShouldersPose />
    case 'arms':      return <ArmsPose />
    case 'full_body': return <FullBodyPose />
    case 'rest':      return <RestPose />
    case 'celebrate': return <CelebratePose />
    case 'coach':
    default:          return <CoachPose />
  }
}

export default function WorkoutCoachIcon({ muscleGroup = 'coach', muted = false, size = 44 }: WorkoutCoachIconProps) {
  // Expression per pose
  const isSleep  = muscleGroup === 'rest'
  const isCheer  = muscleGroup === 'celebrate'
  const isSmile  = muscleGroup === 'coach'

  // Eyes: arcs for sleep/cheer, dots with shine for others
  const eyes = isSleep
    ? (<>
        <path d="M26.5 12c1 1.8 3.5 1.8 4.5 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M33.5 12c1 1.8 3.5 1.8 4.5 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
      </>)
    : isCheer
    ? (<>
        <path d="M26.5 11c1-2.2 3.5-2.2 4.5 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M33.5 11c1-2.2 3.5-2.2 4.5 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
      </>)
    : (<>
        <circle cx="28.5" cy="12.5" r="1.8" fill={stroke} />
        <circle cx="35.5" cy="12.5" r="1.8" fill={stroke} />
        {/* shine dots */}
        <circle cx="29.2" cy="11.6" r="0.6" fill="white" />
        <circle cx="36.2" cy="11.6" r="0.6" fill="white" />
      </>)

  // Mouth: neutral for focused, tiny smile otherwise
  const mouth = isSleep
    ? <path d="M30 17.5c1 0.8 3 0.8 4 0" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    : isCheer
    ? <path d="M28.5 16c1.5 3 7 3 7 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" fill="none" />
    : isSmile
    ? <path d="M29.5 17c1 2 5 2 5 0" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    : <path d="M30 17h4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      animate={{ y: [0, isCheer ? -4 : isSleep ? -1 : -2, 0] }}
      transition={{ duration: isCheer ? 1.0 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ opacity: muted ? 0.55 : 1 }}
    >
      {/* background circle */}
      <circle cx="32" cy="32" r="28" fill={muted ? '#F1F1EE' : '#FFFFFF'} />

      {/* ── Head ── */}
      <circle cx="32" cy="13" r="10" fill={skin} stroke={stroke} strokeWidth="2.5" />
      {/* hair tuft */}
      <path d="M25 8c2-5 12-5 14 0" stroke={green} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* cheek blush */}
      {!isSleep && (
        <>
          <circle cx="22.5" cy="16.5" r="3" fill="#FFB6B6" opacity="0.45" />
          <circle cx="41.5" cy="16.5" r="3" fill="#FFB6B6" opacity="0.45" />
        </>
      )}
      {eyes}
      {mouth}

      {/* ── Body & pose ── */}
      <Pose muscleGroup={muscleGroup} />
    </motion.svg>
  )
}
