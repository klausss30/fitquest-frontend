import { DayData, AdjustOption } from '../types';

export const weekData: DayData[] = [
  { dayName: 'Mon', date: 19, status: 'done', workoutType: 'Push Day' },
  { dayName: 'Tue', date: 20, status: 'done', workoutType: 'Back Day' },
  { dayName: 'Wed', date: 21, status: 'today', workoutType: 'Leg Day' },
  { dayName: 'Thu', date: 22, status: 'rest' },
  { dayName: 'Fri', date: 23, status: 'future', workoutType: 'Shoulder Day' },
  { dayName: 'Sat', date: 24, status: 'future', workoutType: 'Arm Day' },
  { dayName: 'Sun', date: 25, status: 'rest' },
];

export const adjustOptions: AdjustOption[] = [
  { id: 'low_energy', icon: '📉', label: 'Lower intensity' },
  { id: 'high_intensity', icon: '📈', label: 'Push harder' },
  { id: 'short_time', icon: '⏱', label: 'Only 30 minutes' },
  { id: 'swap', icon: '🔄', label: 'Swap selected moves' },
];
