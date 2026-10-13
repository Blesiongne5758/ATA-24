# 🚀 Quick Start - Backend API Setup

## 5-Minute Setup Guide

### Step 1: Install Dependencies (1 min)

```bash
cd backend
npm install
```

### Step 2: Configure Environment (1 min)

```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
nano .env
```

**Minimum Configuration:**
```env
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pjbot_trading
DB_USER=postgres
DB_PASSWORD=your_password

# JWT (CHANGE THIS!)
JWT_SECRET=change_this_to_random_64_character_string
JWT_EXPIRES_IN=7d

# Encryption (CHANGE THIS!)
ENCRYPTION_KEY=change_this_to_32_character_string!
```

### Step 3: Setup Database (1 min)

```bash
# Create database
createdb pjbot_trading

# Or using psql
psql -U postgres
CREATE DATABASE pjbot_trading;
\q
```

### Step 4: Start Server (1 min)

```bash
# Development mode (with hot reload)
npm run dev

# Or production mode
npm run build
npm start
```

Server will start at `http://localhost:3001`

### Step 5: Test API (1 min)

```bash
# Health check
curl http://localhost:3001/health

# Expected response:
# {"status":"healthy","timestamp":"...","version":"2.0.0"}
```

---

## 🧪 Test Full Flow

### 1. Register User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "role": "user"
  }'
```

**Save the `accessToken` from response!**

### 2. Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

### 3. Generate API Key

```bash
# Replace YOUR_TOKEN with actual token from login
curl -X POST http://localhost:3001/api/v1/keys/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Trading Bot",
    "platform": "windows",
    "durationDays": 30
  }'
```

**You'll get an API key like:** `PJBOT-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX`

### 4. Store MT5 Credentials

```bash
curl -X POST http://localhost:3001/api/v1/keys/credentials/store \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "mt5",
    "name": "My MT5 Account",
    "data": {
      "server": "MetaQuotes-Demo",
      "login": "12345678",
      "password": "secret123"
    }
  }'
```

---

## 🔗 Integrate with Frontend

### 1. Install Dependencies (Frontend)

```bash
# In root project folder
npm install axios
```

### 2. Create API Service

Create `src/services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
});

// Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 3. Update DownloadClient

In `src/components/DownloadClient.tsx`:

```typescript
import api from '../services/api';

const handleGenerateApiKey = async () => {
  setIsGenerating(true);
  
  try {
    const response = await api.post('/keys/generate', {
      name: `${selectedPlatform} License`,
      platform: selectedPlatform,
      durationDays: licenseDuration,
    });
    
    setApiKey(response.data.apiKey.key);
    setApiKeyExpiry(response.data.apiKey.expiresAt);
    
    addLog({ 
      type: 'system', 
      message: `🔑 API Key generated securely via backend` 
    });
  } catch (error) {
    addLog({ 
      type: 'error', 
      message: `❌ Failed: ${(error as Error).message}` 
    });
  } finally {
    setIsGenerating(false);
  }
};
```

---

## 📋 Checklist

### Backend Setup
- [ ] Install dependencies (`npm install`)
- [ ] Copy `.env.example` to `.env`
- [ ] Change JWT_SECRET
- [ ] Change ENCRYPTION_KEY
- [ ] Setup PostgreSQL database
- [ ] Start server (`npm run dev`)
- [ ] Test health endpoint

### Frontend Integration
- [ ] Install axios (`npm install axios`)
- [ ] Create `src/services/api.ts`
- [ ] Update DownloadClient component
- [ ] Update ConnectionPanel component
- [ ] Test API key generation
- [ ] Test credential storage

### Security
- [ ] Enable HTTPS in production
- [ ] Configure CORS for production domain
- [ ] Setup firewall rules
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Setup monitoring

---

## 🐛 Common Issues

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check credentials in .env
DB_USER=postgres
DB_PASSWORD=your_password
```

### "Port 3001 already in use"
```bash
# Find process
lsof -i :3001

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=3002
```

### "CORS error"
```bash
# Update .env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### "Invalid token"
```bash
# Make sure JWT_SECRET matches between requests
# Check token is not expired
# Try login again to get new token
```

---

## 📚 Documentation

- **API Docs**: `BACKEND_API.md`
- **Integration**: `INTEGRATION_GUIDE.md`
- **Security**: `SECURITY_GUIDE.md`
- **Full Guide**: `README.md`

---

## 🎯 Next Steps

1. ✅ Backend is running
2. ✅ Frontend is integrated
3. ⚠️ Setup production environment
4. ⚠️ Deploy to server
5. ⚠️ Configure monitoring

---

**You're all set!** 🎉

Your AI Trading Agent now has:
- ✅ Secure backend API
- ✅ Encrypted credential storage
- ✅ JWT authentication
- ✅ API key management
- ✅ Audit logging
- ✅ Rate limiting

**Production ready!** 🚀
