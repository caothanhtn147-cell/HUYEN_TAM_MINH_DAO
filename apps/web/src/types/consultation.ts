export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TenPointCompassionateCandor {
  user_emotional_state: string;
  honest_reality: string;
  factually_known: string;
  uncertainty_and_unknowns: string;
  inaction_consequence: string;
  perspective_and_wisdom: string;
  resolution_path: string;
  immediate_action_24h: string;
  short_term_action_7d: string;
  professional_referral_boundary: string;
}

export interface HotlineContact {
  name: string;
  number: string;
  description: string;
}

export interface MinhKienConsultationResponse {
  session_id: string;
  content: string;
  structured_candor?: TenPointCompassionateCandor;
  model: string;
  provider: string;
  credits_deducted: number;
  safety_action: string;
  hotline_contacts?: HotlineContact[];
}

export type StreamStatus =
  | 'idle'
  | 'connecting'
  | 'streaming'
  | 'completed'
  | 'error'
  | 'crisis_alert';
