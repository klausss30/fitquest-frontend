import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCoachCopy } from '../copy/coachCopy'

function Field({
  label,
  type,
  value,
  placeholder,
  autoComplete,
  onChange,
}: {
  label: string
  type: string
  value: string
  placeholder: string
  autoComplete: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-light tracking-wider mb-1.5" style={{ color: 'rgba(26,24,20,0.38)' }}>
        {label}
      </span>
      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-2xl px-4 py-3.5 text-[14px] font-light outline-none"
        style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.08)', color: '#1A1814' }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(87,200,120,0.45)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(26,24,20,0.08)')}
      />
    </label>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const coachCopy = useCoachCopy()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError(coachCopy.auth.passwordMismatch)
      return
    }

    setLoading(true)
    try {
      const { user, token } = await register(name.trim(), email.trim(), password)
      login(user, token)
      navigate('/onboarding', { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-8" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{ background: 'linear-gradient(180deg, rgba(129,214,154,0.16) 0%, rgba(247,251,244,0) 100%)' }}
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-center">
        <motion.div
          className="mx-auto w-full max-w-[340px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="mb-7 text-center">
            <h1 className="text-[24px] font-semibold">{coachCopy.auth.registerTitle}</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Field label={coachCopy.auth.name} type="text" autoComplete="name" value={name} onChange={setName} placeholder={coachCopy.auth.namePlaceholder} />
            <Field label={coachCopy.auth.email} type="email" autoComplete="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label={coachCopy.auth.password} type="password" autoComplete="new-password" value={password} onChange={setPassword} placeholder={coachCopy.auth.passwordPlaceholder} />
            <Field label={coachCopy.auth.confirmPassword} type="password" autoComplete="new-password" value={confirm} onChange={setConfirm} placeholder={coachCopy.auth.confirmPasswordPlaceholder} />

            {error && (
              <motion.p className="text-[12px] font-light px-1" style={{ color: '#C0614A' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl py-4 text-[14px] font-semibold"
              style={{
                background: loading ? 'rgba(87,200,120,0.16)' : '#57C878',
                border: '1px solid rgba(47,143,88,0.28)',
                color: '#FFFFFF',
                boxShadow: loading ? 'none' : '0 10px 24px rgba(74,174,106,0.24)',
              }}
              whileTap={loading ? {} : { scale: 0.97 }}
            >
              {loading ? coachCopy.auth.registerLoading : coachCopy.auth.registerAction}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
            {coachCopy.auth.existingAccount}{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#2F8F58' }}>
              {coachCopy.auth.goLogin}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
