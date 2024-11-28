import cron from 'node-cron';

import { getToken } from './utils/osu';
import { log } from './utils/logger';

import { LogLevel } from './types/logger';

async function main() {
    log('Exchanging client credentials for access token', LogLevel.DEBUG);

    let token = await getToken();
    let token_expiry = Date.now() + token.expires_in * 1000;

    cron.schedule('*/1 * * * * *', async () => {
        if (Date.now() >= token_expiry) {
            log('Token has expired, exchanging for new one', LogLevel.INFO);

            token = await getToken();
            token_expiry = Date.now() + token.expires_in * 1000;
        }

        log(`Token expires in ${Math.floor((token_expiry - Date.now()) / 1000)} seconds`, LogLevel.DEBUG);
    });
}

main();