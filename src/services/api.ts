/**
 * Backend API Service
 * Handles all communication with the Next.js backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  role: string;
  email?: string;
  id?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Login user with email and password
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    throw new Error(errorMessage);
  }
}

/**
 * Get backend health status
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/../health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
