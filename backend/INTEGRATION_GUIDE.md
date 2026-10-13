# 🔗 Frontend-Backend Integration Guide

## Overview

Panduan lengkap untuk mengintegrasikan frontend React dengan backend API yang aman.

---

## 📦 Frontend Integration

### 1. Install Dependencies

```bash
# Di folder frontend (root project)
npm install axios socket.io-client
```

### 2. Create API Client

Buat file `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Try to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Store new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 3. Create Auth Service

Buat file `src/services/authService.ts`:

```typescript
import api from './api';

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    
    // Store tokens
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async register(email: string, password: string, role: string = 'user'): Promise<LoginResponse> {
    const response = await api.post('/auth/register', { email, password, role });
    
    // Store tokens
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
```

### 4. Create API Key Service

Buat file `src/services/apiKeyService.ts`:

```typescript
import api from './api';

export interface APIKey {
  id: string;
  key: string;
  name: string;
  platform: string;
  expiresAt: string;
  isActive: boolean;
  lastUsed: string | null;
  createdAt: string;
}

export const apiKeyService = {
  async generate(name: string, platform: string, durationDays: number = 30): Promise<APIKey> {
    const response = await api.post('/keys/generate', {
      name,
      platform,
      durationDays,
    });
    return response.data.apiKey;
  },

  async getAll(): Promise<APIKey[]> {
    const response = await api.get('/keys');
    return response.data.apiKeys;
  },

  async getById(id: string): Promise<APIKey> {
    const response = await api.get(`/keys/${id}`);
    return response.data.apiKey;
  },

  async revoke(id: string): Promise<void> {
    await api.delete(`/keys/${id}`);
  },

  async validate(apiKey: string): Promise<{ valid: boolean; platform: string; expiresAt: string }> {
    const response = await api.post('/keys/validate', { apiKey });
    return response.data;
  },
};
```

### 5. Create Credential Service

Buat file `src/services/credentialService.ts`:

```typescript
import api from './api';

export interface Credential {
  id: string;
  type: 'mt5' | 'exchange' | 'api';
  name: string;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

export const credentialService = {
  async store(type: string, name: string, data: any): Promise<Credential> {
    const response = await api.post('/keys/credentials/store', {
      type,
      name,
      data,
    });
    return response.data.credential;
  },

  async getAll(): Promise<Credential[]> {
    const response = await api.get('/keys/credentials');
    return response.data.credentials;
  },

  async getById(id: string): Promise<Credential> {
    const response = await api.get(`/keys/credentials/${id}`);
    return response.data.credential;
  },
};
```

### 6. Update DownloadClient Component

Update `src/components/DownloadClient.tsx`:

```typescript
import { apiKeyService } from '../services/apiKeyService';
import { credentialService } from '../services/credentialService';

// Replace handleGenerateApiKey with:
const handleGenerateApiKey = async () => {
  setIsGenerating(true);
  
  try {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      addLog({ type: 'warning', message: '⚠️ Please login first' });
      setIsGenerating(false);
      return;
    }

    // Generate API key via backend
    const apiKeyData = await apiKeyService.generate(
      `${selectedPlatform} License`,
      selectedPlatform,
      licenseDuration
    );

    setApiKey(apiKeyData.key);
    setApiKeyExpiry(apiKeyData.expiresAt);
    
    addLog({ 
      type: 'system', 
      message: `🔑 API Key generated via secure backend - Expires in ${licenseDuration} days` 
    });
  } catch (error) {
    addLog({ 
      type: 'error', 
      message: `❌ Failed to generate API key: ${(error as Error).message}` 
    });
  } finally {
    setIsGenerating(false);
  }
};

// Add function to store MT5 credentials securely:
const handleStoreMT5Credentials = async (credentials: any) => {
  try {
    await credentialService.store('mt5', 'MT5 Account', credentials);
    addLog({ type: 'info', message: '✅ MT5 credentials stored securely' });
  } catch (error) {
    addLog({ type: 'error', message: `❌ Failed to store credentials: ${(error as Error).message}` });
  }
};
```

### 7. Update ConnectionPanel Component

Update `src/components/ConnectionPanel.tsx`:

```typescript
import { credentialService } from '../services/credentialService';

// Replace MT5 connection with secure backend call:
const handleConnectMT5 = async () => {
  if (!mt5Settings.login || !mt5Settings.password) {
    addLog({ type: 'error', message: '❌ Please enter login and password' });
    return;
  }

  try {
    // Store credentials securely in backend
    await credentialService.store('mt5', 'MT5 Account', {
      server: mt5Settings.server,
      login: mt5Settings.login,
      password: mt5Settings.password,
      accountType: mt5Settings.accountType,
    });

    // Update UI
    updateMT5Settings({ connectionStatus: 'connected' });
    addLog({ type: 'info', message: '✅ MT5 Connected - Credentials stored securely' });
  } catch (error) {
    updateMT5Settings({ connectionStatus: 'error' });
    addLog({ type: 'error', message: `❌ MT5 Connection failed: ${(error as Error).message}` });
  }
};
```

### 8. Create WebSocket Service

Buat file `src/services/websocket.ts`:

```typescript
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3001';

class WebSocketService {
  private socket: Socket | null = null;

  connect() {
    const token = localStorage.getItem('accessToken');
    
    this.socket = io(WS_URL, {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(channel: string) {
    if (this.socket) {
      this.socket.emit('subscribe', channel);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const websocketService = new WebSocketService();
```

---

## 🔐 Security Implementation

### 1. Environment Variables

Update `.env` di frontend:

```env
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_WS_URL=http://localhost:3001
```

### 2. Token Storage

**Best Practices:**
- ✅ Store tokens in localStorage (untuk demo)
- ⚠️ Untuk production, gunakan httpOnly cookies
- ❌ JANGAN store di plain text di database

### 3. API Key Validation

Selalu validate API key di backend sebelum download:

```typescript
// Di DownloadClient.tsx
const handleDownload = async () => {
  if (!apiKey) {
    addLog({ type: 'warning', message: '⚠️ Please generate API key first' });
    return;
  }

  try {
    // Validate API key di backend
    const validation = await apiKeyService.validate(apiKey);
    
    if (!validation.valid) {
      addLog({ type: 'error', message: '❌ Invalid API key' });
      return;
    }

    // Proceed with download
    addLog({ type: 'info', message: '✅ API key validated, starting download...' });
    // ... download logic
  } catch (error) {
    addLog({ type: 'error', message: `❌ Validation failed: ${(error as Error).message}` });
  }
};
```

---

## 🧪 Testing Integration

### 1. Test Authentication Flow

```typescript
// Test login
const loginTest = async () => {
  try {
    const response = await authService.login('test@example.com', 'password123');
    console.log('Login successful:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 2. Test API Key Generation

```typescript
// Test API key generation
const apiKeyTest = async () => {
  try {
    const apiKey = await apiKeyService.generate('Test Key', 'windows', 30);
    console.log('API Key generated:', apiKey.key);
  } catch (error) {
    console.error('API key generation failed:', error);
  }
};
```

---

## 📊 Monitoring

### 1. Add Error Tracking

```typescript
// Di api.ts interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Send to error tracking service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error);
    }
    return Promise.reject(error);
  }
);
```

### 2. Add Request Logging

```typescript
// Di api.ts interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## 🚀 Deployment Checklist

### Backend
- [ ] Change all default secrets in .env
- [ ] Setup PostgreSQL database
- [ ] Setup Redis (optional)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Setup reverse proxy (Nginx)
- [ ] Configure rate limiting
- [ ] Setup monitoring (Sentry)
- [ ] Configure log rotation
- [ ] Setup automated backups

### Frontend
- [ ] Update API URLs for production
- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Setup error tracking
- [ ] Optimize bundle size
- [ ] Enable compression
- [ ] Setup CDN
- [ ] Configure caching

---

## 🆘 Troubleshooting

### CORS Errors
```
Error: Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Update `CORS_ORIGIN` di backend `.env`

### 401 Unauthorized
```
Error: Invalid or expired token
```
**Solution**: Check token expiration, refresh token, or re-login

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```
**Solution**: Ensure backend server is running

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: ✅ Integration Ready
