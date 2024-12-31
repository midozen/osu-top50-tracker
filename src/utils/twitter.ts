import { TwitterApi } from "twitter-api-v2";
import { log } from "./logger";
import { LogLevel } from "../types/logger";
import { fitSquareImage } from "./general";

export async function postTwitterUpdate(message: string, image: Buffer | undefined) {

    // check if any of the required environment variables are missing
    if (!(process.env.TWITTER_APP_KEY && process.env.TWITTER_APP_SECRET && process.env.TWITTER_ACCESS_TOKEN && process.env.TWITTER_ACCESS_SECRET)) {
        log('Twitter details not set, ignoring update there.', LogLevel.INFO);
        return;
    }

    const client = new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY,
        appSecret: process.env.TWITTER_APP_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET
    });
    
    if (image) {
        image = await fitSquareImage(image);

        const uploadedBlob = await client.v1.uploadMedia(image, { mimeType: 'image/png' });

        // Post the update with the image
        await client.v2.tweet({
            text: message,
            media: { media_ids: [ uploadedBlob ] }
        });

        log('Posted update to Twitter!', LogLevel.INFO);
        return;
    }

    // Post the update without an image
    await client.v2.tweet({
        text: message
    });

    log('Posted update to Twitter!', LogLevel.INFO);
}