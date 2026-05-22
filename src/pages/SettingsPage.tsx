import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getMe, updateProfile } from '../services/api'
import { ExperienceLevel, TrainingGoal } from '../types'
import { LanguageMode, useCoachCopy, useLanguageMode, writeLanguageMode } from '../copy/coachCopy'
import { clearPlanDrafts } from '../utils/planDrafts'
import { clearWeekPlanCache } from '../utils/weekPlanCache'

const levelOptions: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced']
const goalOptions: TrainingGoal[] = ['muscle_gain', 'fat_loss', 'strength']

type SettingsView = 'menu' | 'profile' | 'language'
type PickerType = 'level' | 'goal' | 'language' | null

function MenuItem({ title, subtitle, onClick, danger = false }: { title: string; subtitle?: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left"
      style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', color: danger ? '#C0614A' : '#1A1814', boxShadow: '0 5px 16px rgba(61,104,72,0.05)' }}
      onClick={onClick}
    >
      <span>
        <span className="block text-[14px] font-semibold">{title}</span>
        {subtitle && <span className="mt-1 block text-[11px] font-light" style={{ color: danger ? 'rgba(192,97,74,0.62)' : 'rgba(26,24,20,0.42)' }}>{subtitle}</span>}
      </span>
      <span className="text-[18px] font-light" style={{ color: danger ? 'rgba(192,97,74,0.52)' : 'rgba(26,24,20,0.32)' }}>›</span>
    </button>
  )
}

function SelectionSheet({
  title,
  options,
  value,
  cancelLabel,
  onSelect,
  onClose,
}: {
  title: string
  options: Array<{ value: string; label: string; subtitle?: string }>
  value: string
  cancelLabel: string
  onSelect: (value: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4" style={{ background: 'rgba(26,24,20,0.18)' }} onClick={onClose}>
      <motion.div
        className="w-full max-w-[360px] rounded-[28px] p-4"
        style={{ background: '#F7FBF4', boxShadow: '0 18px 44px rgba(26,24,20,0.18)' }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="px-1 pb-3 text-[15px] font-semibold">{title}</p>
        <div className="flex flex-col gap-2">
          {options.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-left"
                style={{ background: selected ? '#EAF7EF' : '#FFFFFF', color: selected ? '#2F8F58' : '#1A1814', border: `1px solid ${selected ? 'rgba(87,200,120,0.36)' : 'rgba(26,24,20,0.07)'}` }}
                onClick={() => onSelect(option.value)}
              >
                <span>
                  <span className="block text-[14px] font-semibold">{option.label}</span>
                  {option.subtitle && <span className="mt-1 block text-[11px] font-light" style={{ color: selected ? 'rgba(47,143,88,0.68)' : 'rgba(26,24,20,0.42)' }}>{option.subtitle}</span>}
                </span>
                {selected && <span className="text-[16px]">✓</span>}
              </button>
            )
          })}
        </div>
        <button className="mt-3 w-full rounded-2xl py-3 text-[13px] font-semibold" style={{ background: '#FFFFFF', color: 'rgba(26,24,20,0.52)' }} onClick={onClose}>
          {cancelLabel}
        </button>
      </motion.div>
    </div>
  )
}

function ConfirmDialog({
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string
  message: string
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(26,24,20,0.18)' }}>
      <motion.div
        className="w-full max-w-[330px] rounded-[28px] p-5 text-center"
        style={{ background: '#FFFFFF', boxShadow: '0 18px 44px rgba(26,24,20,0.18)' }}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <p className="text-[17px] font-semibold">{title}</p>
        <p className="mt-2 text-[12px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.52)' }}>{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button className="rounded-2xl py-3 text-[13px] font-semibold" style={{ background: '#F7FBF4', color: 'rgba(26,24,20,0.52)' }} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="rounded-2xl py-3 text-[13px] font-semibold" style={{ background: '#57C878', color: '#FFFFFF' }} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const coachCopy = useCoachCopy()
  const storedLanguageMode = useLanguageMode()
  const [view, setView] = useState<SettingsView>('menu')
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('beginner')
  const [goal, setGoal] = useState<TrainingGoal>('muscle_gain')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [languageMode, setLanguageMode] = useState<LanguageMode>(storedLanguageMode)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [picker, setPicker] = useState<PickerType>(null)
  const [pendingLanguage, setPendingLanguage] = useState<LanguageMode | null>(null)

  useEffect(() => {
    getMe()
      .then((data) => {
        if (!data.profile) return
        setExperienceLevel(data.profile.experience_level)
        setGoal(data.profile.goal)
        setHeightCm(data.profile.height_cm ? `${data.profile.height_cm}` : '')
        setWeightKg(data.profile.weight_kg ? `${data.profile.weight_kg}` : '')
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    setLanguageMode(storedLanguageMode)
  }, [storedLanguageMode])

  const saveProfile = async () => {
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await updateProfile({
        experience_level: experienceLevel,
        goal,
        height_cm: heightCm ? Number(heightCm) : null,
        weight_kg: weightKg ? Number(weightKg) : null,
      })
      clearPlanDrafts()
      clearWeekPlanCache()
      setMessage(coachCopy.settings.saved)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const saveLanguage = (mode: LanguageMode) => {
    setLanguageMode(mode)
    writeLanguageMode(mode)
    clearPlanDrafts()
    clearWeekPlanCache()
  }

  const languageLabel = coachCopy.options.languageModes[languageMode].label
  const pendingLanguageIsEnglish = pendingLanguage === 'en-US'
  const levelLabel = coachCopy.options.levels[experienceLevel]?.label ?? coachCopy.common.notSet
  const goalLabel = coachCopy.options.goals[goal]?.label ?? coachCopy.common.notSet
  const headerTitle = view === 'profile' ? coachCopy.settings.profileTitle : view === 'language' ? coachCopy.settings.languageTitle : coachCopy.settings.title
  const handleBack = () => {
    if (view === 'menu') {
      navigate('/profile')
      return
    }
    setMessage('')
    setError('')
    setView('menu')
  }

  return (
    <div className="min-h-screen overflow-y-auto px-5 pt-14 pb-8" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm"
          style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.08)', color: 'rgba(26,24,20,0.48)' }}
          onClick={handleBack}
        >
          ←
        </button>
        <div>
          <h1 className="text-[21px] font-semibold leading-tight">{headerTitle}</h1>
        </div>
      </div>

      {view === 'menu' && (
        <motion.div className="mt-8 flex flex-col gap-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <MenuItem title={coachCopy.settings.editProfile} subtitle={coachCopy.settings.editProfileSub} onClick={() => setView('profile')} />
          <MenuItem title={coachCopy.settings.language} subtitle={languageLabel} onClick={() => setView('language')} />
          <MenuItem title={coachCopy.settings.logout} subtitle={coachCopy.settings.logoutSub} danger onClick={handleLogout} />
        </motion.div>
      )}

      {view === 'profile' && (
        <motion.div
          className="mt-8 rounded-[28px] p-5"
          style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 10px 28px rgba(61,104,72,0.08)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex flex-col gap-2">
            <MenuItem title={coachCopy.settings.level} subtitle={levelLabel} onClick={() => setPicker('level')} />
            <MenuItem title={coachCopy.settings.goal} subtitle={goalLabel} onClick={() => setPicker('goal')} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder={coachCopy.settings.heightPlaceholder} className="rounded-2xl px-4 py-3 text-[13px] outline-none" style={{ background: '#F7FBF4', border: '1px solid rgba(26,24,20,0.08)' }} />
            <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder={coachCopy.settings.weightPlaceholder} className="rounded-2xl px-4 py-3 text-[13px] outline-none" style={{ background: '#F7FBF4', border: '1px solid rgba(26,24,20,0.08)' }} />
          </div>

          {message && <p className="mt-4 text-[12px] font-light" style={{ color: '#2F8F58' }}>{message}</p>}
          {error && <p className="mt-4 text-[12px] font-light" style={{ color: '#C0614A' }}>{error}</p>}

          <button className="mt-5 w-full rounded-2xl py-4 text-[14px] font-semibold" style={{ background: loading ? 'rgba(87,200,120,0.16)' : '#57C878', color: '#FFFFFF' }} disabled={loading} onClick={saveProfile}>
            {loading ? coachCopy.settings.saveLoading : coachCopy.settings.save}
          </button>
        </motion.div>
      )}

      {view === 'language' && (
        <motion.div className="mt-8 flex flex-col gap-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <MenuItem title={coachCopy.settings.language} subtitle={languageLabel} onClick={() => setPicker('language')} />
          <p className="px-1 text-[12px] font-light leading-relaxed" style={{ color: 'rgba(26,24,20,0.46)' }}>
            {coachCopy.settings.languageNote(languageLabel)}
          </p>
        </motion.div>
      )}

      {picker === 'level' && (
        <SelectionSheet
          title={coachCopy.settings.chooseLevel}
          value={experienceLevel}
          cancelLabel={coachCopy.common.cancel}
          options={levelOptions.map((value) => ({ value, label: coachCopy.options.levels[value].label }))}
          onClose={() => setPicker(null)}
          onSelect={(value) => {
            setExperienceLevel(value as ExperienceLevel)
            setPicker(null)
          }}
        />
      )}

      {picker === 'goal' && (
        <SelectionSheet
          title={coachCopy.settings.chooseGoal}
          value={goal}
          cancelLabel={coachCopy.common.cancel}
          options={goalOptions.map((value) => ({ value, label: coachCopy.options.goals[value].label }))}
          onClose={() => setPicker(null)}
          onSelect={(value) => {
            setGoal(value as TrainingGoal)
            setPicker(null)
          }}
        />
      )}

      {picker === 'language' && (
        <SelectionSheet
          title={coachCopy.settings.chooseLanguage}
          value={languageMode}
          cancelLabel={coachCopy.common.cancel}
          options={[
            { value: 'system', ...coachCopy.options.languageModes.system },
            { value: 'zh-CN', ...coachCopy.options.languageModes['zh-CN'] },
            { value: 'en-US', ...coachCopy.options.languageModes['en-US'] },
          ]}
          onClose={() => setPicker(null)}
          onSelect={(value) => {
            setPicker(null)
            if (value === languageMode) return
            setPendingLanguage(value as LanguageMode)
          }}
        />
      )}

      {pendingLanguage && (
        <ConfirmDialog
          title={pendingLanguageIsEnglish ? 'Change language?' : coachCopy.settings.changeLanguageTitle}
          message={pendingLanguageIsEnglish ? 'New workout plans and AI content will use English. Existing training records will not be translated or changed.' : coachCopy.settings.changeLanguageMessage}
          cancelLabel={pendingLanguageIsEnglish ? 'Cancel' : coachCopy.common.cancel}
          confirmLabel={pendingLanguageIsEnglish ? 'Confirm' : coachCopy.common.confirm}
          onCancel={() => setPendingLanguage(null)}
          onConfirm={() => {
            saveLanguage(pendingLanguage)
            setPendingLanguage(null)
          }}
        />
      )}
    </div>
  )
}
