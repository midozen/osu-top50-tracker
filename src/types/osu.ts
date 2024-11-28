export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface TokenError {
    error: string;
    error_description: string;
    message: string;
}