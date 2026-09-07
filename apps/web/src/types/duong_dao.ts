export type DuongDaoCategory =
  | 'SLEEP_HYGIENE'
  | 'DAILY_RHYTHMS'
  | 'SEASONAL_WELLNESS'
  | 'TRADITIONAL_HERITAGE';

export interface DuongDaoArticle {
  id: string;
  category: DuongDaoCategory;
  title_vi: string;
  summary_vi: string;
  content_vi: string;
  historical_context_vi?: string | null;
  educational_disclaimer_vi: string;
  tags: string[];
  created_at: string;
}

export interface SleepHygieneGuideInput {
  target_sleep_hours: number;
  bedtime_hour: number;
  blue_light_exposure: boolean;
  caffeine_after_3pm: boolean;
  evening_stress_level: 'low' | 'medium' | 'high';
}

export interface SleepHygieneGuideResponse {
  sleep_score: number;
  habit_recommendations_vi: string[];
  daily_rhythm_tips_vi: string[];
  educational_disclaimer_vi: string;
}
