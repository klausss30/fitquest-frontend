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

export interface CurrentUserResponse {
  user: {
    id: number
    name: string
    email: string
  }
  profile: UserProfile | null
}
