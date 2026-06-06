import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SessionDetailResponse } from '../types'
import { getTrainingSession } from '../services/api'
import { CoachCopy, useCoachCopy } from '../copy/coachCopy'
import BackButton from '../components/BackButton'

function exerciseDetail(sets: number, reps: number, weight: number | null, unit: string | null, coachCopy: CoachCopy) {
  const load = weight != null && weight > 0 ? `${weight} ${unit ?? ''}` : coachCopy.common.bodyweight
  return `${sets} ${coachCopy.common.sets} × ${reps} ${coachCopy.common.reps} · ${load}`
}

export default function RecordDetailPage() {
  const coachCopy = useCoachCopy()
  const { id } = useParams()
  const [record, setRecord] = useState<SessionDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const sessionId = Number(id)
    if (!sessionId) {
      setError(coachCopy.records.missing)
      setLoading(false)
      return
    }

    getTrainingSession(sessionId)
      .then(setRecord)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [id])

  const exercises = [...(record?.exercises ?? [])].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="min-h-screen flex flex-col px-5 pt-14 pb-8" style={{ background: '#F7FBF4', color: '#1A1814' }}>
      <div className="flex items-center gap-3">
        <BackButton to="/records" />
        <div className="min-w-0">
          <h1 className="text-[21px] font-semibold leading-tight">{coachCopy.records.detailTitle}</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-[13px] font-light" style={{ color: 'rgba(26,24,20,0.45)' }}>
          {coachCopy.records.detailLoading}
        </div>
      ) : error || !record ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-[14px] font-semibold">{coachCopy.records.detailErrorTitle}</p>
          <p className="mt-2 text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.45)' }}>{error || coachCopy.records.missing}</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
          <div
            className="rounded-[24px] p-4"
            style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)', boxShadow: '0 8px 24px rgba(61,104,72,0.07)' }}
          >
            <p className="text-[18px] font-semibold">{record.session.day_type}</p>
            <p className="mt-2 text-[12px] font-light" style={{ color: 'rgba(26,24,20,0.45)' }}>
              {coachCopy.records.summary(record.session.session_date, record.session.duration_minutes, exercises.length)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="rounded-2xl p-4"
                style={{ background: '#FFFFFF', border: '1px solid rgba(26,24,20,0.07)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold">{exercise.exercise_name}</p>
                    <p className="mt-1 text-[11px] font-light" style={{ color: 'rgba(26,24,20,0.42)' }}>
                      {exerciseDetail(exercise.sets, exercise.reps, exercise.weight, exercise.unit, coachCopy)}
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0 rounded-lg px-2 py-1 text-[10px] font-light"
                    style={{ background: 'rgba(87,200,120,0.10)', color: '#2F8F58' }}
                  >
                    {coachCopy.options.categories[exercise.category] ?? exercise.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
