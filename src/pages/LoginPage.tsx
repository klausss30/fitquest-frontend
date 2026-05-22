import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCoachCopy } from '../copy/coachCopy'

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

function StickCoach() {
  return (
    <motion.div
      className="relative flex h-36 w-36 items-center justify-center"
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: '#FFFFFF',
          border: '2px solid rgba(87,200,120,0.38)',
          boxShadow: '0 0 0 9px rgba(87,200,120,0.08), 0 20px 42px rgba(61,104,72,0.13)',
        }}
      />
      <motion.div
        className="absolute -right-1 top-8 rounded-full px-3 py-1 text-[11px] font-semibold"
        style={{ background: '#FFF2C7', color: '#8A6428', boxShadow: '0 8px 18px rgba(138,100,40,0.12)' }}
        animate={{ rotate: [2, -3, 2], y: [0, -3, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        GO
      </motion.div>
      <svg
        width="108"
        height="118"
        viewBox="0 0 108 118"
        fill="none"
        aria-hidden="true"
        className="relative z-10"
      >
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '54px', originY: '60px' }}
        >
          <circle cx="54" cy="24" r="17" fill="#F8FCF5" stroke="#1A1814" strokeWidth="4" />
          <path d="M41 19C47 13 59 12 67 19" stroke="#57C878" strokeWidth="5" strokeLinecap="round" />
          <path d="M48 25H48.5" stroke="#1A1814" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 25H60.5" stroke="#1A1814" strokeWidth="4" strokeLinecap="round" />
          <path d="M49 32C52 35 57 35 60 32" stroke="#1A1814" strokeWidth="3" strokeLinecap="round" />
          <path d="M54 42V72" stroke="#1A1814" strokeWidth="5" strokeLinecap="round" />
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
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M17 25L31 39"
            stroke="#57C878"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{
              d: [
                'M17 25L31 39',
                'M22 10L36 24',
                'M17 25L31 39',
              ],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M13 29L21 21"
            stroke="#57C878"
            strokeWidth="5"
            strokeLinecap="round"
            animate={{
              d: [
                'M13 29L21 21',
                'M18 14L26 6',
                'M13 29L21 21',
              ],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M27 43L35 35"
            stroke="#57C878"
            strokeWidth="5"
            strokeLinecap="round"
            animate={{
              d: [
                'M27 43L35 35',
                'M32 28L40 20',
                'M27 43L35 35',
              ],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
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
          <StickCoach />

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
