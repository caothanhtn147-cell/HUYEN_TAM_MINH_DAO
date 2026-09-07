export interface BirthDataInput {
  name?: string | null;
  gender: 'male' | 'female' | 'other';
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number;
  birth_minute: number;
  time_zone: number;
  is_lunar: boolean;
}

export interface PillarDetail {
  stem: string;
  branch: string;
  stem_element: string;
  branch_element: string;
  combined_name: string;
  polarity: string;
}

export interface FiveElementsBalance {
  wood_percentage: number;
  fire_percentage: number;
  earth_percentage: number;
  metal_percentage: number;
  water_percentage: number;
  dominant_element: string;
  lacking_element: string;
  balance_analysis_vi: string;
}

export interface BaTuChartResponse {
  birth_data: BirthDataInput;
  lunar_date_str: string;
  year_pillar: PillarDetail;
  month_pillar: PillarDetail;
  day_pillar: PillarDetail;
  hour_pillar: PillarDetail;
  day_master: string;
  five_elements_balance: FiveElementsBalance;
  philosophical_reflections: string[];
}

export interface TuViPalace {
  palace_name: string;
  earthly_branch: string;
  main_stars: string[];
  symbolic_meaning_vi: string;
}

export interface TuViChartResponse {
  birth_data: BirthDataInput;
  lunar_date_str: string;
  menh_palace_branch: string;
  than_palace_branch: string;
  cuc_name: string;
  palaces: TuViPalace[];
  core_archetype_vi: string;
  wisdom_reflections: string[];
}

export interface FullAstrologyAnalysisResponse {
  batu_chart: BaTuChartResponse;
  tuvi_chart: TuViChartResponse;
  overall_synthesis_vi: string;
}
