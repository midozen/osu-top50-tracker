import { AtpAgent } from '@atproto/api';

import { LogLevel } from "../types/logger";
import { log } from "./logger";
import { fitSquareImage } from './general';

// Post an update to Bluesky
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

    // If we have an image, post it to Bluesky
    if (image) {
        // Fit the image to a square canvas
        image = await fitSquareImage(image);

        // Convert to blob and upload to Bluesky
        const blob = new Blob([image], { type: 'image/png' });
        const uploadedBlob = await agent.uploadBlob(blob, { encoding: 'image/png' });

        // Post the update with the image
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

    // Post the update without an image
    await agent.post({
        text: message
    });

    log('Posted update to Bluesky', LogLevel.INFO);
}