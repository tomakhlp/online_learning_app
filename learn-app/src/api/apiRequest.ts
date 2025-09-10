import {API_URL} from "../config.ts";

export async function apiRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'GET',
    body?: object,
    requireAuth: boolean = false
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (requireAuth) {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('TOKEN_REQUIRED');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/${endpoint}`, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    let result;
    try {
        result = await res.json();
    } catch (error) {
        result = null;
    }

    if (!res.ok) {
        throw result;
    }

    return result?.data || null;
}
