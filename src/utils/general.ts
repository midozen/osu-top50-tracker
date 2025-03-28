import nodeHtmlToImage from "node-html-to-image";
import fs from "fs";
import path from "path";
import { ChangedUser } from "../types/general";
import sharp from "sharp";

import "dotenv/config";

// Render the leaderboard as an image for social media
export async function renderLeaderboard(users: ChangedUser[]): Promise<Buffer | undefined> {
  // todo add chromium path to options, and test on wsl
  try {
    const html = fs.readFileSync(path.resolve(__dirname, '../assets/rankings.html'), 'utf8');
    const render = await nodeHtmlToImage({
      puppeteerArgs: {
        executablePath: process.env.CHROMIUM_PATH ?? undefined,
      },
      html,
      content: { users }
    });

    return render instanceof Buffer ? render : undefined;
  } catch (error) {
    console.error('Error rendering leaderboard:', error);
    return undefined;
  }
}

// Generate a flag URL from a country code, Used claude to convert this code from the osu-web project lmao
export function flagUrl(countryCode: string) {
  const chars = Array.from(countryCode);
  const hexEmojiChars = chars.map(chr => 
      ((chr.codePointAt(0) ?? 0) + 127397).toString(16)
  );
  const baseFileName = hexEmojiChars.join('-');
  return `/assets/images/flags/${baseFileName}.svg`;
}

// Assemble the update message
export function assembleUpdate(users: ChangedUser[]): string {
  let message = [];

  const now = new Date();

  message.push(`Rank update as of ${now.toLocaleDateString('en-US', { timeZone: 'UTC' })} ${now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true })} UTC: `);

  users.forEach(user => {
    message.push(`${user.username} has now changed from rank #${user.old_rank} to #${user.new_rank}. ${user.rank_up ? `Gain of ${user.pp_change} PP` : ''}`);
  });

  return message.join('\n');
}

// Fit a square image to a square canvas, used for bluesky
export async function fitSquareImage(image: Buffer): Promise<Buffer> {
  const { width, height } = await sharp(image).metadata();
  const size = Math.max(width ?? 0, height ?? 0);

  return await sharp(image)
    .resize({
      width: width, 
      height: width, fit: 'contain', 
      background: { r: 35, g: 42, b: 34, alpha: 255 }
    })
    .toBuffer();
}