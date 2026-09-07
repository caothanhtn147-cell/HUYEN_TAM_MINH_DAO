export interface IChingHexagramItem {
  id: string;
  hexagram_number: number;
  binary_code: string;
  name_vi: string;
  name_en: string;
  pinyin_name: string;
  upper_trigram: string;
  lower_trigram: string;
  judgement_vi: string;
  image_vi: string;
  lines_interpretation_vi: Record<string, string>;
  wisdom_reflection_vi: string;
  image_url?: string | null;
}

export type LineType = 'old_yin' | 'young_yang' | 'young_yin' | 'old_yang';

export interface CoinTossLine {
  line_number: number;
  coin1: number;
  coin2: number;
  coin3: number;
  total_sum: number;
  line_value: number;
  line_type: LineType;
  is_changing: boolean;
}

export interface IChingTossResponse {
  toss_id: string;
  toss_at: string;
  intention?: string | null;
  tosses: CoinTossLine[];
  primary_hexagram: IChingHexagramItem;
  transformed_hexagram?: IChingHexagramItem | null;
  changing_line_numbers: number[];
}
