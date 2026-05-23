import { serviceClient } from '../http/serviceClient';

class AuthService {
  async login(credentials) {
    const response = await serviceClient('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    this.setToken(response.token);
    return response;
  }

  async logout() {
    await serviceClient('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService();