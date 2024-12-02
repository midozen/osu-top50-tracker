# osu! Top 50 Leaderboard Rank Tracker

A bot that monitors the top 50 osu! ranked leaderboard, checking every 30 seconds for changes.

## Prerequisites

- Node.js (version X or higher)
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

    OSU_CLIENT_ID={YOURCLIENTIDHERE}
    OSU_CLIENT_SECRET={YOURCLIENTSECRETHERE}

    # Optional: Configure Discord integration
    # DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

    # Optional: Configure Bluesky integration
    # BLUESKY_USERNAME={USERNAME}.bsky.app
    # BLUESKY_PASSWORD={PASSWORD}
    ```

4. Build the code:
   ```bash
   npm run build
   ```

5. Copy the assets folder from src into the built dist folder

6. Start the bot

   ```bash
   npm start
   ```

### Features
- Tracks changes in the osu! Top 50 Leaderboard every 30 seconds.
- Optional integration with Discord and Bluesky for updates.

### Notes
- Set `DUMMY_DATA=true` in the `.env` file for testing with mock data.