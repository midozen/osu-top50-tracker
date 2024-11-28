import { TokenResponse, TokenError } from '../types/osu';
import 'dotenv/config';


export async function getToken(): Promise<TokenResponse> {
    // curl --request POST \
    // "https://osu.ppy.sh/oauth/token" \
    // --header "Accept: application/json" \
    // --header "Content-Type: application/x-www-form-urlencoded" \
    // --data "client_id=1&client_secret=clientsecret&grant_type=client_credential

    const client_id = process.env.OSU_CLIENT_ID;
    const client_secret = process.env.OSU_CLIENT_SECRET;

    if (!client_id || !client_secret) {
        throw new Error('Missing client_id or client_secret in environment variables');
    }

    const response = await fetch('https://osu.ppy.sh/oauth/token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'client_credentials',
            'scope': 'public'
        })
    });

    if (!response.ok) {
        const error: TokenError = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}
