import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCoachCopy } from '../copy/coachCopy'
import StickCoach from '../components/coach/StickCoach'

function Field({
  type,
  value,
  placeholder,
  autoComplete,
  onChange,
}: {
  type: string
  value: string
  placeholder: string
  autoComplete: string
  onChange: (value: string) => void
}) {
  return (
    <input
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full rounded-[22px] px-5 py-4 text-[14px] font-light outline-none"
      style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.08)', color: '#1A1814', boxShadow: '0 5px 16px rgba(61,104,72,0.05)' }}
      onFocus={(e) => (e.target.style.borderColor = 'rgba(87,200,120,0.45)')}
      onBlur={(e) => (e.target.style.borderColor = 'rgba(26,24,20,0.08)')}
    />
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const coachCopy = useCoachCopy()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user, token } = await loginApi(email.trim(), password)
      login(user, token)
      navigate('/', { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ paddingLeft: 40, paddingRight: 40, background: '#F7FBF4', color: '#1A1814' }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{ background: 'linear-gradient(180deg, rgba(129,214,154,0.18) 0%, rgba(247,251,244,0) 100%)' }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <StickCoach label="GO" />

          <h1 className="mt-6 text-[24px] font-semibold">{coachCopy.auth.loginTitle}</h1>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-9 flex flex-col gap-3"
          style={{ width: '100%', maxWidth: 300 }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
        >
          <Field
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            placeholder={coachCopy.auth.email}
          />
          <Field
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            placeholder={coachCopy.auth.password}
          />

          {error && (
            <motion.p className="text-[12px] font-light px-1" style={{ color: '#C0614A' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-[22px] py-4 text-[15px] font-semibold"
            style={{
              background: loading ? 'rgba(87,200,120,0.16)' : '#57C878',
              border: '1px solid rgba(47,143,88,0.28)',
              color: '#FFFFFF',
              boxShadow: loading ? 'none' : '0 10px 24px rgba(74,174,106,0.24)',
            }}
            whileTap={loading ? {} : { scale: 0.97 }}
          >
            {loading ? coachCopy.auth.loginLoading : coachCopy.auth.loginAction}
          </motion.button>
        </motion.form>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.45 }}
        >
          <Link to="/register" className="text-[13px] font-semibold" style={{ color: '#2F8F58' }}>
            {coachCopy.auth.registerLink}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
