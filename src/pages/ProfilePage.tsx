import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCoachCopy } from '../copy/coachCopy'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const coachCopy = useCoachCopy()

  return (
    <div className="relative min-h-screen overflow-hidden px-5 pt-14 pb-8" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{ background: 'linear-gradient(180deg, rgba(129,214,154,0.16) 0%, rgba(247,251,244,0) 100%)' }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm"
            style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.08)', color: 'rgba(26,24,20,0.48)' }}
            onClick={() => navigate('/')}
          >
            ←
          </button>
          <div>
            <h1 className="text-[21px] font-semibold leading-tight">{coachCopy.profile.title}</h1>
          </div>
          <button
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-[17px]"
            style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.08)', color: 'rgba(26,24,20,0.52)' }}
            onClick={() => navigate('/settings')}
          >
            ⚙
          </button>
        </div>

        <motion.div
          className="mt-8 flex flex-col items-center rounded-[30px] p-6 text-center"
          style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 10px 28px rgba(61,104,72,0.08)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full text-[34px] font-semibold"
            style={{ background: '#EAF7EF', color: '#2F8F58', border: '2px solid rgba(87,200,120,0.28)' }}
          >
            {user?.name?.slice(0, 1).toUpperCase() ?? 'F'}
          </div>
          <p className="mt-4 text-[20px] font-semibold">{user?.name ?? coachCopy.profile.guestName}</p>
          <p className="mt-1 text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.45)' }}>
            ID: {user?.id ?? '-'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
