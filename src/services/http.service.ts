/**
 * HTTP Service - Axios configuration and interceptors
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';

// Extend config to store request start time
interface RequestConfigWithMeta extends InternalAxiosRequestConfig {
  meta?: {
    startTime: number;
  };
}

class HttpService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_CONFIG.apiKey,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: RequestConfigWithMeta) => {
        // Store start time for duration calculation
        config.meta = { startTime: Date.now() };

        const fullUrl = `${config.baseURL}${config.url}`;
        console.log(
          `%c📤 REQUEST %c${config.method?.toUpperCase()} %c${config.url}`,
          'background: #2196F3; color: white; padding: 2px 6px; border-radius: 3px;',
          'color: #2196F3; font-weight: bold;',
          'color: #666;'
        );
        console.log(`   URL: ${fullUrl}`);

        if (config.params && Object.keys(config.params).length > 0) {
          console.log('   Params:', config.params);
        }
        if (config.data) {
          console.log('   Body:', config.data);
        }

        return config;
      },
      (error) => {
        console.error('%c❌ REQUEST ERROR', 'background: #f44336; color: white; padding: 2px 6px; border-radius: 3px;', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const config = response.config as RequestConfigWithMeta;
        const duration = config.meta?.startTime ? Date.now() - config.meta.startTime : 0;

        // Determine response summary
        const data = response.data;
        let summary = '';
        if (data) {
          if (Array.isArray(data)) {
            summary = `Array[${data.length}]`;
          } else if (data.items && Array.isArray(data.items)) {
            summary = `items: ${data.items.length}, total: ${data.total || 'N/A'}`;
          } else if (data.files && Array.isArray(data.files)) {
            summary = `files: ${data.files.length}, subfolders: ${data.subfolders?.length || 0}`;
          } else if (typeof data === 'object') {
            const keys = Object.keys(data);
            summary = keys.slice(0, 4).join(', ') + (keys.length > 4 ? '...' : '');
          }
        }

        console.log(
          `%c✅ RESPONSE %c${response.status} %c${response.config.url} %c${duration}ms`,
          'background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px;',
          'color: #4CAF50; font-weight: bold;',
          'color: #666;',
          'color: #999; font-style: italic;'
        );
        if (summary) {
          console.log(`   Data: ${summary}`);
        }

        return response;
      },
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  private handleError(error: AxiosError): Promise<never> {
    const config = error.config as RequestConfigWithMeta | undefined;
    const duration = config?.meta?.startTime ? Date.now() - config.meta.startTime : 0;

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = (error.response.data as any)?.error || error.message;

      console.log(
        `%c❌ ERROR %c${status} %c${error.config?.url} %c${duration}ms`,
        'background: #f44336; color: white; padding: 2px 6px; border-radius: 3px;',
        'color: #f44336; font-weight: bold;',
        'color: #666;',
        'color: #999; font-style: italic;'
      );
      console.log(`   Message: ${message}`);
      console.log('   Response:', error.response.data);

      switch (status) {
        case 401:
          console.error('   ⚠️ Unauthorized - Check API key');
          break;
        case 404:
          console.error('   ⚠️ Resource not found');
          break;
        case 500:
          console.error('   ⚠️ Server error');
          break;
      }
    } else if (error.request) {
      // Request made but no response
      console.log(
        `%c❌ NO RESPONSE %c${error.config?.url}`,
        'background: #ff9800; color: white; padding: 2px 6px; border-radius: 3px;',
        'color: #666;'
      );
      console.error('   Server may be down or unreachable');
      console.error('   URL:', `${config?.baseURL}${config?.url}`);
    } else {
      // Something else happened
      console.log(
        '%c❌ REQUEST FAILED',
        'background: #f44336; color: white; padding: 2px 6px; border-radius: 3px;'
      );
      console.error('   Error:', error.message);
    }

    return Promise.reject(error);
  }

  // HTTP methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const httpService = new HttpService();
