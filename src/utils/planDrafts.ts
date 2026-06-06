import { LEGACY_PLAN_DRAFT_PREFIX, PLAN_DRAFT_PREFIX } from './storageKeys'
import { TemporaryPlanResponse } from '../types'

const PLAN_DRAFT_VERSION = 2

export function formatLocalDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function clearPlanDrafts() {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index)
    if (key?.startsWith(PLAN_DRAFT_PREFIX) || key?.startsWith(LEGACY_PLAN_DRAFT_PREFIX)) {
      localStorage.removeItem(key)
    }
  }
}

export function readPlanDraft(date: string): TemporaryPlanResponse | null {
  try {
    const key = `${PLAN_DRAFT_PREFIX}${date}`
    const legacyKey = `${LEGACY_PLAN_DRAFT_PREFIX}${date}`
    const raw = localStorage.getItem(key) ?? localStorage.getItem(legacyKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { version?: number; data?: TemporaryPlanResponse }
    if (parsed.version !== PLAN_DRAFT_VERSION || !parsed.data) return null
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, raw)
      localStorage.removeItem(legacyKey)
    }
    return parsed.data
  } catch {
    return null
  }
}
