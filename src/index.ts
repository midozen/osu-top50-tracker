import cron from 'node-cron';

import { LogLevel } from './types/logger';
import { UserStatistics } from './types/osu';
import { ChangedUser } from './types/general';

import { assembleUpdate, flagUrl, renderLeaderboard } from './utils/general';
import { postDiscordUpdate } from './utils/providers/discord';
import { postBlueskyUpdate } from './utils/providers/at';
import { postTwitterUpdate } from './utils/providers/twitter';
import { getRankings, getToken } from './utils/osu';
import { log } from './utils/logger';

async function main() {
    log('Exchanging client credentials for access token', LogLevel.DEBUG);

    // Get token and set expiry time
    let token = await getToken();
    let token_expiry = Date.now() + token.expires_in * 1000;

    log('Fetching inital leaderboard data', LogLevel.DEBUG);
    let rankings: UserStatistics[] = (await getRankings(token.access_token)).ranking;

    // Main loop to detect changes in the top 50 scores, runs every 30 seconds
    cron.schedule('*/30 * * * * *', async () => {
        // Check if token has expired
        if (Date.now() >= token_expiry) {
            log('Token has expired, exchanging for new one', LogLevel.INFO);

            token = await getToken();
            token_expiry = Date.now() + token.expires_in * 1000;
        }

        log('Checking for changes in rankings', LogLevel.INFO);

        // Fetch new rankings
        const new_rankings: UserStatistics[] = (await getRankings(token.access_token)).ranking;

        // Compare rankings to detect
        const changes = new_rankings.filter((user, index) => {
            return user.user.id !== rankings[index].user.id;
        });

        // Handle changes
        if (changes.length > 0) {
            log('Changes detected!', LogLevel.INFO);

            // Put all of the changes into a nice format, really shitty but it's whatever
            const changedUsers: ChangedUser[] = changes.map((user, index) => {
                const old_rank = rankings.findIndex((ranking) => ranking.user.id === user.user.id) + 1;
                const new_rank = new_rankings.findIndex((ranking) => ranking.user.id === user.user.id) + 1;
            
                return {
                    new_rank,
                    old_rank,
                    rank_difference: old_rank > 0 ? Math.abs(old_rank - new_rank) : 0,
                    rank_up: old_rank > 0 ? old_rank > new_rank : true,
                    pp_change: old_rank > 0 ? Math.round(user.pp - rankings[old_rank - 1]?.pp || 0) : 0,
                    username: user.user.username,
                    flag_url: flagUrl(user.user.country_code),
                };
            });            

            log('Assembling update message', LogLevel.DEBUG);

            const message = assembleUpdate(changedUsers);

            log(`${message}`, LogLevel.INFO);

            log('Rendering leaderboard image', LogLevel.DEBUG);

            try {
                const image = await renderLeaderboard(changedUsers);
                await Promise.all([
                    postDiscordUpdate(message, image),
                    postBlueskyUpdate(message, image),
                    postTwitterUpdate(message, image),
                ]);
            } catch (error: any) {
                log(`Error posting updates or rendering leaderboard: ${error.message}`, LogLevel.INFO);
            }
        }
        else  {
            log('No changes detected', LogLevel.INFO);
        }

        rankings = new_rankings;
    });
}

main();
