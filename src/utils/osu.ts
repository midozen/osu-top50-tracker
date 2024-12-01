import { TokenResponse, TokenError, Rankings } from "../types/osu";
import "dotenv/config";

export async function getToken(): Promise<TokenResponse> {
  // curl --request POST \
  // "https://osu.ppy.sh/oauth/token" \
  // --header "Accept: application/json" \
  // --header "Content-Type: application/x-www-form-urlencoded" \
  // --data "client_id=1&client_secret=clientsecret&grant_type=client_credential

  const client_id = process.env.OSU_CLIENT_ID;
  const client_secret = process.env.OSU_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    throw new Error(
      "Missing client_id or client_secret in environment variables"
    );
  }

  const response = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: client_id,
      client_secret: client_secret,
      grant_type: "client_credentials",
      scope: "public",
    }),
  });

  if (!response.ok) {
    const error: TokenError = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function getRankings(token: string): Promise<Rankings> {
  // curl --request GET \
  // --get "https://osu.ppy.sh/api/v2/rankings/osu/performance" \
  // --header "Content-Type: application/json" \
  // --header "Accept: application/json"

  const dummy_data: boolean = process.env.DUMMY_DATA === "true";

  if (dummy_data) {
    const data: Rankings = JSON.parse(JSON.stringify(require("../assets/rankings.json")));

    // shuffle around the top 50 players
    data.ranking = data.ranking.sort(() => Math.random() - 0.5);
    return data;
  }

  const response = await fetch(
    "https://osu.ppy.sh/api/v2/rankings/osu/performance",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data: Rankings = await response.json();
  data.ranking.slice(0, 50); // We are monitoring the top 50 players, not the top 10,000
  data.total = 50;

  return data;
}
