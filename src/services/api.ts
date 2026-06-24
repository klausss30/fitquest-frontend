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
import { LEGACY_USER_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/storageKeys'

const BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const TOKEN_KEY = 'token'

export function classifyApiError(err: unknown, fallback?: string): string {
  const e = err as Error
  if (e.name === 'AbortError') return ''

  if (e.name === 'TypeError' && e.message.toLowerCase().includes('failed to fetch')) {
    return 'No network connection. Please check and retry.'
  }

  if (e.message && !e.message.includes('Request failed')) {
    if (e.message.includes('Too many requests') || e.message.includes('429')) {
      return 'Too many requests. Please wait a moment.'
    }
    if (e.message.includes('Email already registered')) {
      return 'Email already registered'
    }
    if (e.message.includes('Incorrect email or password')) {
      return 'Incorrect email or password'
    }
    if (e.message.includes('Password must be at least')) {
      return e.message
    }
    if (e.message.includes('valid email')) {
      return e.message
    }
    if (e.message.includes('User not found') || e.message.includes('session expired')) {
      return 'Session expired. Please log in again.'
    }
    if (e.message.includes('Failed to generate plan')) {
      return 'Failed to generate plan. Please try again.'
    }
    if (e.message.includes('Failed to adjust plan')) {
      return 'Failed to adjust plan. Please try again.'
    }
    if (e.message.includes('Failed to generate nutrition')) {
      return 'Failed to generate nutrition advice. Please try again.'
    }
    return e.message
  }

  return fallback ?? 'Request failed. Please try again.'
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
      'Accept-Language': 'en-US',
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
    throw new Error(data?.error || 'Request failed')
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
