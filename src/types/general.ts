export interface ChangedUser {
    new_rank: number;
    old_rank: number;
    rank_difference: number;
    rank_up: boolean;
    pp_change: number;
    username: string;
    flag_url: string;
}