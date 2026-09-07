export interface SystemHealthMetrics {
  api_status: string;
  uptime_seconds: number;
  active_users_count: number;
  total_consultations_count: number;
  total_tarot_draws_count: number;
  total_iching_tosses_count: number;
  total_astrology_charts_count: number;
  safety_alerts_count: number;
  ai_providers_status: Record<string, string>;
  database_connected: boolean;
  redis_connected: boolean;
}

export interface SystemAuditLog {
  id: string;
  actor_id?: string | null;
  action: string;
  module: string;
  severity: 'info' | 'warning' | 'critical' | 'safety_alert' | string;
  details: Record<string, unknown>;
  created_at: string;
}
