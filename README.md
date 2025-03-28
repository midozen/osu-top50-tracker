# osu! Top 50 Leaderboard Rank Tracker

A bot that actively tracks and reports osu!standard rankings amongst the osu! top 50.

## Prerequisites

- Node.js (version v20 or higher)
- osu! API credentials (Client ID and Secret)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/midozen/top50bot.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure the following:

    ### Environment Variables
    Example configuration:
    ```env
    LOG_LEVEL=INFO # DEBUG, INFO, NONE
    DUMMY_DATA=false # Used for testing purposes

    # OPTIONAL: Configure the path to chromium
    # CHROMIUM_PATH=/usr/bin/chromium-browser

    OSU_CLIENT_ID={YOURCLIENTIDHERE}
    OSU_CLIENT_SECRET={YOURCLIENTSECRETHERE}

    # Configure Discord integration
    # DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

    # Configure Bluesky integration
    # BLUESKY_USERNAME={USERNAME}.bsky.app
    # BLUESKY_PASSWORD={PASSWORD}

    # Configure Twitter intergration
    # TWITTER_APP_KEY=74L2AP4iqs7...
    # TWITTER_APP_SECRET=y0qAFPdprkT...
    # TWITTER_ACCESS_TOKEN=IIGD8BAR81P...
    # TWITTER_ACCESS_SECRET=hLBAgqJxoxQ...
    ```

4. Start the bot

   ```bash
   npm start
   ```

### Features
- Tracks changes in the osu! Top 50 Leaderboard every 30 seconds.
- Optional integration with Discord and Bluesky for updates.

### Notes
- Set `DUMMY_DATA=true` in the `.env` file for testing with mock data.
- If you are having troubles with the bot rendering the rankings as an image, try manually setting the path to chrome in your .env
- This code is still pending a rewrite, and everything needs to be stabalized still.

### Todo List

- [ ] Fix that one weird issue where the output reports that there are changes, but dosen't do anything.
- [ ] Detect when a new player enters the top 50
- [ ] Docker version so I don't have to do any weird systemctl stuff in production.
- [x] Add support for posting to Twitter/X