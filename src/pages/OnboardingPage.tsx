import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExperienceLevel, TrainingGender, TrainingGoal } from '../types'
import { updateProfile } from '../services/api'
import { useCoachCopy } from '../copy/coachCopy'
import { clearPlanDrafts } from '../utils/planDrafts'
import StickCoach from '../components/coach/StickCoach'

const levelOptions: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced']
const goalOptions: TrainingGoal[] = ['muscle_gain', 'fat_loss', 'strength']
const genderOptions: TrainingGender[] = ['male', 'female', 'not_specified']

function OptionButton({
  label,
  desc,
  selected,
  onClick,
}: {
  label: string
  desc: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="rounded-2xl px-4 py-3 text-left"
      style={{
        background: selected ? '#EAF7EF' : '#FFFFFF',
        border: `1px solid ${selected ? 'rgba(87,200,120,0.45)' : 'rgba(26,24,20,0.08)'}`,
        boxShadow: selected ? '0 6px 18px rgba(61,104,72,0.08)' : 'none',
      }}
      onClick={onClick}
    >
      <span className="block text-[14px] font-semibold">{label}</span>
      <span className="mt-1 block text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.45)' }}>
        {desc}
      </span>
    </button>
  )
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const coachCopy = useCoachCopy()
  const [gender, setGender] = useState<TrainingGender>('not_specified')
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('beginner')
  const [goal, setGoal] = useState<TrainingGoal>('muscle_gain')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submitProfile = async () => {
    setError('')
    setLoading(true)

    try {
      await updateProfile({
        experience_level: experienceLevel,
        goal,
        gender,
        height_cm: heightCm ? Number(heightCm) : null,
        weight_kg: weightKg ? Number(weightKg) : null,
      })
      clearPlanDrafts()
      navigate('/', { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-y-auto px-5 py-10" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <motion.div
        className="mx-auto w-full max-w-[340px]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <div className="flex justify-center">
            <StickCoach variant="onboarding" size="sm" />
          </div>
          <h1 className="mt-6 text-[23px] font-semibold">{coachCopy.onboarding.title}</h1>
          <p className="mt-2 text-[12px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.48)' }}>
            {coachCopy.onboarding.subtitle}
          </p>
        </div>

        <div className="mt-8">
          <p className="mb-2 text-[12px] font-semibold">{coachCopy.onboarding.gender}</p>
          <div className="grid gap-2">
            {genderOptions.map((option) => (
              <OptionButton
                key={option}
                label={coachCopy.options.genders[option].label}
                desc={coachCopy.options.genders[option].desc}
                selected={gender === option}
                onClick={() => setGender(option)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-2 text-[12px] font-semibold">{coachCopy.onboarding.experience}</p>
          <div className="grid gap-2">
            {levelOptions.map((option) => (
              <OptionButton
                key={option}
                label={coachCopy.options.levels[option].label}
                desc={coachCopy.options.levels[option].desc}
                selected={experienceLevel === option}
                onClick={() => setExperienceLevel(option)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[12px] font-semibold">{coachCopy.onboarding.goal}</p>
          <div className="grid gap-2">
            {goalOptions.map((option) => (
              <OptionButton
                key={option}
                label={coachCopy.options.goals[option].label}
                desc={coachCopy.options.goals[option].desc}
                selected={goal === option}
                onClick={() => setGoal(option)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <label>
            <span className="mb-1.5 block text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
              {coachCopy.onboarding.height}
            </span>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none"
              style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.08)' }}
              placeholder="178"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
              {coachCopy.onboarding.weight}
            </span>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none"
              style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.08)' }}
              placeholder="75"
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 text-[12px] font-light" style={{ color: '#C0614A' }}>
            {error}
          </p>
        )}

        <motion.button
          className="mt-7 w-full rounded-[22px] py-4 text-[15px] font-semibold"
          style={{ background: loading ? 'rgba(87,200,120,0.16)' : '#57C878', color: '#FFFFFF', boxShadow: loading ? 'none' : '0 10px 24px rgba(74,174,106,0.24)' }}
          disabled={loading}
          whileTap={loading ? {} : { scale: 0.97 }}
          onClick={submitProfile}
        >
          {loading ? coachCopy.onboarding.saving : coachCopy.onboarding.action}
        </motion.button>
      </motion.div>
    </div>
  )
}
