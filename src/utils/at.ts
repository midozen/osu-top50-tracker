import { AtpAgent } from '@atproto/api';

import { LogLevel } from "../types/logger";
import { log } from "./logger";
import { fitSquareImage } from './general';

export async function postBlueskyUpdate(message: string, image: Buffer | undefined) {
    const agent = new AtpAgent({
        service: 'https://bsky.social',
    })
    
    if (!(process.env.BLUESKY_USERNAME && process.env.BLUESKY_PASSWORD)) {
        log('Bluesky details not set, ignoring update there.', LogLevel.INFO);
        return;
    }

    await agent.login({
        identifier: process.env.BLUESKY_USERNAME,
        password: process.env.BLUESKY_PASSWORD,
    });

    if (image) {
        image = await fitSquareImage(image);

        const blob = new Blob([image], { type: 'image/png' });
        const uploadedBlob = await agent.uploadBlob(blob, { encoding: 'image/png' });

        await agent.post({
            text: message,
            embed: {
                images: [
                  {
                    image: uploadedBlob.data.blob,
                    alt: "An image containing a visual representation of the leaderboard changes",
                  },
                ],
                $type: 'app.bsky.embed.images',
              }
        });

        log('Posted update to Bluesky!', LogLevel.INFO);
        return;
    }

    await agent.post({
        text: message
    });

    log('Posted update to Bluesky!', LogLevel.INFO);
}