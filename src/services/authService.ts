
import { apiClient } from '@/lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('AuthService.login called with:', credentials.email);
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      console.log('Login API response:', response);
      
      if (response && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Login successful, stored in localStorage');
        return response;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('AuthService.register called with:', userData.email);
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      console.log('Register API response:', response);
      
      if (response && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Registration successful, stored in localStorage');
        return response;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  static async googleAuth(idToken: string): Promise<AuthResponse> {
    console.log('AuthService.googleAuth called');
    try {
      const response = await apiClient.post<AuthResponse>('/auth/google', { idToken });
      console.log('Google auth API response:', response);
      
      if (response && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Google auth successful, stored in localStorage');
        return response;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  }

  static logout(): void {
    console.log('AuthService.logout called');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Cleared localStorage');
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const isAuth = !!token;
    console.log('AuthService.isAuthenticated:', isAuth);
    return isAuth;
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    const currentUser = user ? JSON.parse(user) : null;
    console.log('AuthService.getCurrentUser:', currentUser);
    return currentUser;
  }
}
