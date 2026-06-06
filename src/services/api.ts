import {
  AdjustType,
  CheckInHistoryResponse,
  CheckInPayload,
  CheckInResponse,
  CurrentUserResponse,
  NutritionResponse,
  PlanGenerateParams,
  ProfileResponse,
  SaveTrainingSessionPayload,
  SessionDetailResponse,
  StatsResponse,
  TemporaryPlanResponse,
  TodayCheckInResponse,
  TrainingHistoryResponse,
  UserProfilePayload,
  WeekPlanResponse,
  WeekSessionsResponse,
} from '../types'
import { AuthUser } from '../context/AuthContext'
import { clearPlanDrafts } from '../utils/planDrafts'
import { resolveAppLanguage } from '../copy/coachCopy'
import { LEGACY_USER_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/storageKeys'

const BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const TOKEN_KEY = 'token'

/**
 * Classify a caught error into a user-facing message.
 * Keeps all error-string logic in one place so pages stay clean.
 */
export function classifyApiError(err: unknown, lang: 'zh' | 'en', fallback?: string): string {
  const e = err as Error
  if (e.name === 'AbortError') return ''   // caller should handle silently

  // Network / no connection
  if (e.name === 'TypeError' && e.message.toLowerCase().includes('failed to fetch')) {
    return lang === 'zh' ? '网络连接失败，请检查网络后重试' : 'No network connection — please check and retry'
  }

  // Server returned a structured error message (from apiFetch throw)
  if (e.message && !e.message.includes('请求失败') && !e.message.includes('Request failed')) {
    // Rate limit
    if (e.message.includes('Too many requests') || e.message.includes('太频繁') || e.message.includes('429')) {
      return lang === 'zh' ? '请求太频繁，请稍后再试' : 'Too many requests — please wait a moment'
    }
    // Auth errors
    if (e.message.includes('Email already registered')) {
      return lang === 'zh' ? '该邮箱已注册' : 'Email already registered'
    }
    if (e.message.includes('Incorrect email or password')) {
      return lang === 'zh' ? '邮箱或密码错误' : 'Incorrect email or password'
    }
    if (e.message.includes('Password must be at least')) {
      return lang === 'zh' ? '密码不能少于 6 位' : e.message
    }
    if (e.message.includes('valid email')) {
      return lang === 'zh' ? '请输入有效的邮箱地址' : e.message
    }
    // Session / auth
    if (e.message.includes('User not found') || e.message.includes('session expired')) {
      return lang === 'zh' ? '登录已失效，请重新登录' : 'Session expired — please log in again'
    }
    // AI generation failures
    if (e.message.includes('Failed to generate plan')) {
      return lang === 'zh' ? '计划生成失败，请稍后重试' : 'Failed to generate plan. Please try again.'
    }
    if (e.message.includes('Failed to adjust plan')) {
      return lang === 'zh' ? '训练计划调整失败，请稍后重试' : 'Failed to adjust plan. Please try again.'
    }
    if (e.message.includes('Failed to generate nutrition')) {
      return lang === 'zh' ? '营养建议生成失败，请稍后重试' : 'Failed to generate nutrition advice. Please try again.'
    }
    // Don't leak Chinese error text in English mode
    const hasChinese = /[一-鿿]/.test(e.message)
    if (!hasChinese || lang === 'zh') return e.message
  }

  return fallback ?? (lang === 'zh' ? '请求失败，请稍后重试' : 'Request failed — please try again')
}

function getAppLanguage() {
  return resolveAppLanguage()
}

interface AuthResponse {
  user: AuthUser
  token: string
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': getAppLanguage(),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(LEGACY_USER_STORAGE_KEY)
      clearPlanDrafts()
    }
    throw new Error(data?.error || (getAppLanguage() === 'en-US' ? 'Request failed' : '请求失败'))
  }
  return data as T
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getMe(): Promise<CurrentUserResponse> {
  return apiFetch<CurrentUserResponse>('/me')
}

export async function updateProfile(profile: UserProfilePayload): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>('/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  })
}

export async function generatePlan(params: PlanGenerateParams = {}, signal?: AbortSignal): Promise<TemporaryPlanResponse> {
  return apiFetch<TemporaryPlanResponse>('/plan/generate', {
    method: 'POST',
    body: JSON.stringify(params),
    signal,
  })
}

export async function adjustPlan(params: {
  current_plan: TemporaryPlanResponse['plan']
  exercises: TemporaryPlanResponse['exercises']
  adjust_type: AdjustType
  custom_message?: string
}, signal?: AbortSignal): Promise<TemporaryPlanResponse> {
  return apiFetch<TemporaryPlanResponse>('/plan/adjust', {
    method: 'POST',
    body: JSON.stringify(params),
    signal,
  })
}

export async function saveTrainingSession(payload: SaveTrainingSessionPayload): Promise<SessionDetailResponse> {
  return apiFetch<SessionDetailResponse>('/training-sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getWeekSessions(startDate?: string): Promise<WeekSessionsResponse> {
  const query = startDate ? `?start_date=${encodeURIComponent(startDate)}` : ''
  return apiFetch<WeekSessionsResponse>(`/training-sessions/week${query}`)
}

export async function getWeekPlan(startDate?: string): Promise<WeekPlanResponse> {
  const query = startDate ? `?start_date=${encodeURIComponent(startDate)}` : ''
  return apiFetch<WeekPlanResponse>(`/week-plan${query}`)
}

export async function getTrainingSession(id: number): Promise<SessionDetailResponse> {
  return apiFetch<SessionDetailResponse>(`/training-sessions/${id}`)
}

export async function getTrainingHistory(limit = 20): Promise<TrainingHistoryResponse> {
  return apiFetch<TrainingHistoryResponse>(`/training-sessions?limit=${limit}`)
}

// ── Daily Check-In ─────────────────────────────────────────────────────────

export async function submitCheckIn(payload: CheckInPayload): Promise<CheckInResponse> {
  return apiFetch<CheckInResponse>('/checkin', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getTodayCheckIn(): Promise<TodayCheckInResponse> {
  return apiFetch<TodayCheckInResponse>('/checkin/today')
}

export async function getCheckInHistory(days = 7): Promise<CheckInHistoryResponse> {
  return apiFetch<CheckInHistoryResponse>(`/checkin/history?days=${days}`)
}

// ── Stats ───────────────────────────────────────────────────────────────────

export async function getStats(): Promise<StatsResponse> {
  return apiFetch<StatsResponse>('/stats')
}

// ── Nutrition ───────────────────────────────────────────────────────────────

export async function getNutrition(signal?: AbortSignal): Promise<NutritionResponse> {
  return apiFetch<NutritionResponse>('/nutrition', { signal })
}
