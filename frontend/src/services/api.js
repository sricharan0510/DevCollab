const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async preRegister(userData) {
    return this.request('/auth/pre-register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyRegistration(verificationData) {
    return this.request('/auth/verify-registration', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401 && token) {
          // Try to refresh token
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry the original request
            config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
            const retryResponse = await fetch(url, config);
            if (retryResponse.ok) {
              return retryResponse.json();
            }
          }
          // If refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          window.location.href = '/signin';
          return;
        }

        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  // async register(userData) {
  //   return this.request('/auth/register', {
  //     method: 'POST',
  //     body: JSON.stringify(userData),
  //   });
  // }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      localStorage.removeItem('accessToken');
    }
  }

  async refreshToken() {
    try {
      const response = await this.request('/auth/refresh-token', {
        method: 'POST',
      });

      if (response.success && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Email verification methods
  async sendVerificationEmail(email) {
    return this.request('/email/send-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyEmail(verificationData) {
    return this.request('/email/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  async sendPasswordReset(email) {
    return this.request('/email/send-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(resetData) {
    return this.request('/email/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  }

  // GitHub verification method
  async verifyGithub() {
    return this.request('/auth/verify-github', {
      method: 'POST',
    });
  }
}

export default new ApiService();

