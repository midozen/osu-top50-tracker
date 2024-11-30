import cron from 'node-cron';
import 'dotenv/config';

import { LogLevel } from './types/logger';

import { getRankings, getToken } from './utils/osu';
import { log } from './utils/logger';


const dummy_data: boolean = process.env.DUMMY_DATA === 'true';

async function main() {
    log('Exchanging client credentials for access token', LogLevel.DEBUG);

    // Get token and set expiry time
    let token = await getToken();
    let token_expiry = Date.now() + token.expires_in * 1000;

    // Main loop to detect changes in the top 50 scores, runs every 30 seconds
    cron.schedule('*/30 * * * * *', async () => {
        // Check if token has expired
        if (Date.now() >= token_expiry) {
            log('Token has expired, exchanging for new one', LogLevel.INFO);

            token = await getToken();
            token_expiry = Date.now() + token.expires_in * 1000;
        }

        log(`Token expires in ${Math.floor((token_expiry - Date.now()) / 1000 / 60)} minutes`, LogLevel.DEBUG);
    });
}

main();