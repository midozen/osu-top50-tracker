import { LogLevel } from "../types/logger";
import { log } from "./logger";

export async function postDiscordUpdate(message: string, image: Buffer | undefined) {
    const webhook_url = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook_url) {
        log('Discord webhook not setup, ignoring update there.', LogLevel.INFO);
        return;
    }

    const form = new FormData();

    if (image) {
        const blob = new Blob([image], { type: 'image/png' });
        form.append('file1', blob, 'output.png');
    }

    form.append('content', message);

    const response = await fetch(webhook_url, {
        method: 'POST',
        body: form,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    log('Posted update to Discord', LogLevel.DEBUG);
}