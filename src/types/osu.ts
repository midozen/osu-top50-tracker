// OAuth2 Related
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenError {
  error: string;
  error_description: string;
  message: string;
}

// Rankings Related, gonna leave the stuff that dosen't matter to me as any because I'm lazy
export interface Rankings {
  beatmapsets: any[] | undefined;
  cursor: any | undefined;
  ranking: UserStatistics[];
  spotlight: any | undefined;
  total: number;
}

export interface UserStatistics {
  count_100: number;
  count_300: number;
  count_50: number;
  count_miss: number;
  grade_counts: GradeCounts;
  hit_accuracy: number;
  is_ranked: boolean;
  level: Level;
  maximum_combo: number;
  play_count: number;
  play_time: any;
  pp: number;
  global_rank: number;
  ranked_score: number;
  replays_watched_by_others: number;
  total_hits: number;
  total_score: number;
  user: User;
}

interface GradeCounts {
  a: number;
  s: number;
  sh: number;
  ss: number;
  ssh: number;
}

interface Level {
  current: number;
  progress: number;
}

interface User {
  avatar_url: string;
  country: Country;
  country_code: string;
  cover: Cover;
  default_group: string;
  id: number;
  is_active: boolean;
  is_bot: boolean;
  is_online: boolean;
  is_supporter: boolean;
  last_visit: string;
  pm_friends_only: boolean;
  profile_colour: string;
  username: string;
}

interface Country {
  code: string;
  name: string;
}

interface Cover {
  custom_url: any;
  id: string;
  url: string;
}
