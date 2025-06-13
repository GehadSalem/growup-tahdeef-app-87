
// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.growupe.com/api';
const SECRET_PREFIX = 'yoursecretkey__';

// API client with authentication
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers && typeof options.headers === 'object' && !Array.isArray(options.headers)
        ? options.headers as Record<string, string>
        : {}),
    };

    if (token) {
      headers.Authorization = `${SECRET_PREFIX}${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    console.log(`API Request: ${options.method || 'GET'} ${this.baseURL}${endpoint}`);
    
    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return undefined as T;
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return undefined as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
