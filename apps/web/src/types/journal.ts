export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood_tag: string;
  source_module: string;
  source_reference_id?: string | null;
  insights: string[];
  created_at: string;
  updated_at: string;
}

export interface JournalEntryCreate {
  title: string;
  content: string;
  mood_tag?: string;
  source_module?: string;
  source_reference_id?: string;
  insights?: string[];
}

export interface ConsultationHistoryItem {
  id: string;
  module_type: string;
  title_vi: string;
  summary_vi: string;
  timestamp: string;
  reference_id: string;
}
