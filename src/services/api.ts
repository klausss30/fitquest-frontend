import {
  AdjustType,
  CurrentUserResponse,
  PlanGenerateParams,
  ProfileResponse,
  SaveTrainingSessionPayload,
  SessionDetailResponse,
  TemporaryPlanResponse,
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

export async function generatePlan(params: PlanGenerateParams = {}): Promise<TemporaryPlanResponse> {
  return apiFetch<TemporaryPlanResponse>('/plan/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export async function adjustPlan(params: {
  current_plan: TemporaryPlanResponse['plan']
  exercises: TemporaryPlanResponse['exercises']
  adjust_type: AdjustType
  custom_message?: string
}): Promise<TemporaryPlanResponse> {
  return apiFetch<TemporaryPlanResponse>('/plan/adjust', {
    method: 'POST',
    body: JSON.stringify(params),
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
