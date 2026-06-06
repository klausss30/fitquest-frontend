export type DayStatus = 'done' | 'today' | 'rest' | 'future'

export type ExerciseCategory = 'warmup' | 'main' | 'accessory' | 'finisher' | 'cooldown'

export type AdjustType = 'low_energy' | 'short_time' | 'swap' | 'high_intensity' | 'custom'

export type MuscleGroup = 'legs' | 'chest' | 'back' | 'shoulders' | 'arms' | 'full_body'

export type WeekPlanMuscleGroup = MuscleGroup | 'rest'

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

export type TrainingGoal = 'muscle_gain' | 'fat_loss' | 'strength'

export type TrainingGender = 'male' | 'female' | 'not_specified'

export interface DayData {
  dayName: string
  date: number
  status: DayStatus
  workoutType?: string
  muscleGroup?: WeekPlanMuscleGroup
}

export interface TrainingSession {
  id: number
  user_id: number
  session_date: string
  muscle_group: MuscleGroup
  day_type: string
  duration_minutes: number
  ai_note: string
  exercises_count?: number
}

export interface TrainingPlan {
  session_date: string
  muscle_group: MuscleGroup
  day_type: string
  duration_minutes: number
  ai_note: string
}

export interface PlanExercise {
  exercise_name: string
  category: ExerciseCategory
  sets: number
  reps: number
  weight: number | null
  unit: 'kg' | 'lb' | null
  rationale: string | null
  sort_order: number
}

export interface SessionExercise {
  id: number
  session_id: number
  exercise_name: string
  category: ExerciseCategory
  sets: number
  reps: number
  weight: number | null
  unit: 'kg' | 'lb' | null
  rationale: string | null
  sort_order: number
}

export interface SessionDetailResponse {
  session: TrainingSession
  exercises: SessionExercise[]
}

export interface TemporaryPlanResponse {
  plan: TrainingPlan
  exercises: PlanExercise[]
  reasoning?: PlanReasoning
}

export interface SaveTrainingSessionPayload extends TrainingPlan {
  exercises: Array<Omit<PlanExercise, 'sort_order'>>
}

export interface WeekSessionsResponse {
  week_start: string
  sessions: TrainingSession[]
}

export interface WeekPlanDay {
  session_date: string
  muscle_group: WeekPlanMuscleGroup
  day_type: string
  reason?: string
}

export interface WeekPlanResponse {
  week_start: string
  days: WeekPlanDay[]
}

export interface TrainingHistoryResponse {
  sessions: TrainingSession[]
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  unit?: string
  category: ExerciseCategory
  rationale?: string | null
  dotColor: string
  tagBg: string
  tagText: string
  tagLabel: string
}

export interface AdjustOption {
  id: AdjustType
  icon: string
  label: string
}

export interface PlanGenerateParams {
  session_date?: string
  muscle_group?: MuscleGroup
  duration_minutes?: number
}

export interface UserProfilePayload {
  experience_level: ExperienceLevel
  goal: TrainingGoal
  gender?: TrainingGender | null
  height_cm?: number | null
  weight_kg?: number | null
}

export interface UserProfile extends UserProfilePayload {
  id: number
  user_id: number
}

export interface ProfileResponse {
  profile: UserProfile
}

// ── Reasoning ────────────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'moderate' | 'high'

export interface ReasoningGoalAnalysis {
  primary_goal: string
  secondary_goal: string | null
  note: string
}

export interface ReasoningRecoveryAnalysis {
  sleep_hours: number
  energy_level: number
  stress_level: number
  recovery_score: number
  summary: string
}

export interface ReasoningRiskAssessment {
  level: RiskLevel
  factors: string[]
}

export interface ReasoningHistoryAnalysis {
  sessions_last_7_days: number
  last_muscle_group: string | null
  summary: string
}

export interface ReasoningDecision {
  muscle_group: string
  action: string
  rationale: string
}

export interface PlanReasoning {
  goal_analysis: ReasoningGoalAnalysis
  recovery_analysis: ReasoningRecoveryAnalysis | null
  risk_assessment: ReasoningRiskAssessment
  history_analysis: ReasoningHistoryAnalysis
  decision: ReasoningDecision
}

// ── Daily Check-In ────────────────────────────────────────────────────────────

export type RecoveryStatus = 'excellent' | 'good' | 'moderate' | 'low' | 'poor'

export interface CheckInPayload {
  date?: string          // YYYY-MM-DD, defaults to today on backend
  sleep_hours: number
  energy_level: number   // 1–10
  stress_level: number   // 1–10
  weight_kg?: number | null
  notes?: string | null
}

export interface CheckInResponse {
  date: string
  sleep_hours: number
  energy_level: number
  stress_level: number
  weight_kg: number | null
  notes: string | null
  recovery_score: number
  recovery_status: RecoveryStatus
}

export interface TodayCheckInResponse {
  exists: boolean
  checkin?: CheckInResponse
}

export interface CheckInHistoryResponse {
  checkins: CheckInResponse[]
}

export interface CurrentUserResponse {
  user: {
    id: number
    name: string
    email: string
  }
  profile: UserProfile | null
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface StatsResponse {
  streak: number
  sessions_this_week: number
  recovery_score: number | null
  recovery_status: RecoveryStatus | null
}

// ── Nutrition ─────────────────────────────────────────────────────────────────

export interface NutritionMealSuggestion {
  meal: string
  suggestion: string
  calories_approx: number
}

export interface NutritionResponse {
  daily_calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  goal_note: string
  meal_suggestions: NutritionMealSuggestion[]
  reasoning: string
}
