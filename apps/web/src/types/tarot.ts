export interface TarotCardCatalogItem {
  id: string;
  card_code: string;
  name_vi: string;
  name_en: string;
  arcana: 'MAJOR' | 'MINOR';
  suit?: string | null;
  card_number: number;
  upright_keywords: string[];
  reversed_keywords: string[];
  upright_meaning_vi: string;
  reversed_meaning_vi: string;
  wisdom_reflection_vi: string;
  image_url?: string | null;
}

export interface DrawnCardItem {
  card_code: string;
  name_vi: string;
  name_en: string;
  arcana: string;
  suit?: string | null;
  is_reversed: boolean;
  orientation: string;
  keywords: string[];
  meaning_vi: string;
  wisdom_reflection_vi: string;
  image_url?: string | null;
}

export interface TarotDrawResponse {
  draw_id: string;
  drawn_at: string;
  intention?: string | null;
  cards: DrawnCardItem[];
}

export type SpreadType = 'single' | 'three_card';
