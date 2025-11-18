import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // Aumentado a 60 segundos
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add tenant ID if available
        const tenantId = this.getTenantId();
        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle network errors
        if (!error.response) {
          if (error.code === 'ECONNABORTED') {
            console.error('Request timeout:', error.message);
            return Promise.reject({
              message: 'La solicitud tardó demasiado. Por favor, intenta de nuevo.',
              originalError: error,
            });
          }
          console.error('Network error:', error.message);
          return Promise.reject({
            message: 'Error de conexión con el servidor. Verifica que el backend esté corriendo.',
            originalError: error,
          });
        }

        // Handle HTTP errors
        const status = error.response?.status;
        const data = error.response?.data;

        switch (status) {
          case 401:
            // Handle unauthorized - redirect to login
            this.clearToken();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            break;
          case 403:
            console.error('Forbidden:', data);
            break;
          case 404:
            console.error('Not found:', data);
            break;
          case 500:
            console.error('Server error:', data?.message || 'Error interno del servidor');
            break;
          default:
            console.error('API error:', status, data);
        }

        // Return a formatted error
        return Promise.reject({
          status,
          message: data?.message || error.message || 'Error desconocido',
          data,
          originalError: error,
        });
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private getTenantId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tenant_id');
    }
    return null;
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('tenant_id');
    }
  }

  public setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  public setTenantId(tenantId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tenant_id', tenantId);
    }
  }

  /**
   * Retry logic for failed requests
   */
  private async retryRequest<T>(
    fn: () => Promise<AxiosResponse<T>>,
    retries: number = 2
  ): Promise<T> {
    try {
      const response = await fn();
      return response.data;
    } catch (error: any) {
      if (retries > 0 && (!error.response || error.response.status >= 500)) {
        console.log(`Retrying request... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.retryRequest(fn, retries - 1);
      }
      throw error;
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(() => this.client.get(url, config));
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

const apiInstance = new ApiClient();

export const apiService = apiInstance;
export const apiClient = apiInstance;
