import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';

export function getAccessToken(): string | undefined {
    return Cookies.get(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
    Cookies.set(ACCESS_TOKEN_KEY, token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
    });
}

export function clearTokens(): void {
    Cookies.remove(ACCESS_TOKEN_KEY);
}
