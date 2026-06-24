import { WeekPlanResponse } from '../types'

const WEEK_PLAN_CACHE_PREFIX = 'fitquest_week_plan_'
const WEEK_PLAN_CACHE_VERSION = 1

function getWeekPlanCacheKey(userId: number, weekStart: string) {
  return `${WEEK_PLAN_CACHE_PREFIX}${userId}_${weekStart}`
}

export function readWeekPlanCache(userId: number, weekStart: string): WeekPlanResponse | null {
  try {
    const raw = localStorage.getItem(getWeekPlanCacheKey(userId, weekStart))
    if (!raw) return null

    const parsed = JSON.parse(raw) as { version?: number; data?: WeekPlanResponse }
    if (parsed.version !== WEEK_PLAN_CACHE_VERSION || !parsed.data) return null
    if (parsed.data.week_start !== weekStart || !Array.isArray(parsed.data.days)) return null

    return parsed.data
  } catch {
    return null
  }
}

export function writeWeekPlanCache(userId: number, data: WeekPlanResponse) {
  localStorage.setItem(
    getWeekPlanCacheKey(userId, data.week_start),
    JSON.stringify({ version: WEEK_PLAN_CACHE_VERSION, data }),
  )
}

export function clearWeekPlanCache(userId?: number) {
  const userPrefix = userId == null ? WEEK_PLAN_CACHE_PREFIX : `${WEEK_PLAN_CACHE_PREFIX}${userId}_`

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index)
    if (key?.startsWith(userPrefix)) {
      localStorage.removeItem(key)
    }
  }
}
