import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainingSession } from '../types'
import { getTrainingHistory } from '../services/api'
import { useCoachCopy } from '../copy/coachCopy'
import BackButton from '../components/BackButton'

export default function RecordsPage() {
  const navigate = useNavigate()
  const coachCopy = useCoachCopy()
  const [records, setRecords] = useState<TrainingSession[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrainingHistory(20)
      .then((data) => setRecords(data.sessions))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col px-5 pt-14 pb-8" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <div className="flex items-center gap-3">
        <BackButton to="/" />
        <div>
          <h1 className="text-[21px] font-semibold leading-tight">{coachCopy.records.title}</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-[13px] font-light" style={{ color: 'rgba(26,24,20,0.45)' }}>
          {coachCopy.records.loading}
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-[14px] font-semibold">{coachCopy.records.errorTitle}</p>
          <p className="mt-2 text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.45)' }}>{error}</p>
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-[14px] font-semibold">{coachCopy.records.emptyTitle}</p>
          <p className="mt-2 text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.45)' }}>
            {coachCopy.records.emptySubtitle}
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {records.map((record) => (
            <button
              key={record.id}
              type="button"
              className="rounded-2xl p-4 text-left"
              style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 5px 16px rgba(61,104,72,0.06)' }}
              onClick={() => navigate(`/records/${record.id}`)}
            >
              <p className="text-[14px] font-semibold">{record.day_type}</p>
              <p className="mt-1 text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
                {coachCopy.records.summary(record.session_date, record.duration_minutes, record.exercises_count ?? 0)}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
