export function isTokenValid(token: string): boolean {
    try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}
