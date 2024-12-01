import cron from 'node-cron';
import nodeHtmlToImage from 'node-html-to-image';

import { LogLevel } from './types/logger';
import { UserStatistics } from './types/osu';

import { getRankings, getToken } from './utils/osu';
import { log } from './utils/logger';
import { ChangedUser } from './types/general';
import { flagUrl, renderLeaderboard } from './utils/renderer';


async function main() {
    log('Exchanging client credentials for access token', LogLevel.DEBUG);

    // Get token and set expiry time
    let token = await getToken();
    let token_expiry = Date.now() + token.expires_in * 1000;

    log('Fetching inital leaderboard data', LogLevel.DEBUG);
    let rankings: UserStatistics[] = (await getRankings(token.access_token)).ranking;

    // Main loop to detect changes in the top 50 scores, runs every 30 seconds
    // cron.schedule('*/3 * * * * *', async () => {
        // Check if token has expired
        if (Date.now() >= token_expiry) {
            log('Token has expired, exchanging for new one', LogLevel.INFO);

            token = await getToken();
            token_expiry = Date.now() + token.expires_in * 1000;
        }

        // Fetch new rankings
        const new_rankings: UserStatistics[] = (await getRankings(token.access_token)).ranking;

        // Compare rankings to detect
        const changes = new_rankings.filter((user, index) => {
            return user.user.id !== rankings[index].user.id;
        });

        // Handle changes
        if (changes.length > 0) {
            log('Changes detected!', LogLevel.INFO);

            // changes.forEach((user, index) => {
            //     const old_rank = rankings.findIndex((ranking) => ranking.user.id === user.user.id) + 1;
            //     const new_rank = index + 1;

            //     if (old_rank > new_rank) {
            //         log(`#${new_rank} ${user.user.username} gained ${old_rank - new_rank} rank(s) gain of ${Math.round(user.pp - rankings[index].pp)} PP`, LogLevel.INFO);
            //     } else {
            //         log(`#${new_rank} ${user.user.username} lost ${new_rank - old_rank} rank(s)`, LogLevel.INFO);
            //     }
            // });

            const changedUsers: ChangedUser[] = changes.map((user, index) => {
                const old_rank = rankings.findIndex((ranking) => ranking.user.id === user.user.id) + 1;
                const new_rank = index + 1;

                return {
                    new_rank,
                    old_rank,
                    rank_difference: Math.abs(old_rank - new_rank),
                    rank_up: old_rank > new_rank,
                    pp_change: Math.round(user.pp - rankings[index].pp),
                    username: user.user.username,
                    flag_url: flagUrl(user.user.country_code),
                };
            });

            await renderLeaderboard(changedUsers);
        }

        rankings = new_rankings;

        log(`Token expires in ${Math.floor((token_expiry - Date.now()) / 1000 / 60)} minutes`, LogLevel.DEBUG);
    // });
}

main();
