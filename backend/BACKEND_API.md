# 🔒 Backend API Documentation - PJ.BOT AI Trading Agent

## Overview

Backend API yang aman dan scalable untuk AI Trading Agent dengan fitur keamanan enterprise-grade.

**Base URL**: `http://localhost:3001/api/v1`

---

## 🛡️ Security Features

### Implemented Security Measures

1. **Helmet.js** - Security headers
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security

2. **CORS Protection**
   - Whitelist allowed origins
   - Credentials support
   - Method restrictions

3. **Rate Limiting**
   - General: 100 requests / 15 minutes
   - Auth endpoints: 5 requests / 15 minutes
   - API key validation: 1000 requests / hour

4. **Authentication**
   - JWT-based authentication
   - Access tokens (7 days)
   - Refresh tokens (30 days)
   - Role-based authorization

5. **Encryption**
   - AES-256-CBC for sensitive data
   - bcrypt for password hashing
   - Secure token generation

6. **Input Validation**
   - Joi schema validation
   - SQL injection prevention
   - XSS protection

7. **Audit Logging**
   - All authentication events
   - API key operations
   - Credential access
   - Security incidents

---

## 📚 API Endpoints

### Authentication

#### POST /api/v1/auth/register
Register new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "expiresIn": "7d"
}
```

#### POST /api/v1/auth/login
Login user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "expiresIn": "7d"
}
```

#### POST /api/v1/auth/refresh
Refresh access token

**Request:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": "7d"
}
```

#### POST /api/v1/auth/logout
Logout user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

#### GET /api/v1/auth/me
Get current user info

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user",
    "isActive": true,
    "lastLogin": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### API Key Management

#### POST /api/v1/keys/generate
Generate new API key

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "name": "My Trading Bot",
  "platform": "windows",
  "durationDays": 30
}
```

**Response:**
```json
{
  "message": "API key generated successfully",
  "apiKey": {
    "id": "uuid",
    "key": "PJBOT-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    "name": "My Trading Bot",
    "platform": "windows",
    "expiresAt": "2024-02-15T10:30:00Z"
  }
}
```

#### GET /api/v1/keys
Get all API keys

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "apiKeys": [
    {
      "id": "uuid",
      "key": "PJBOT-XXXX...XXXX",
      "name": "My Trading Bot",
      "platform": "windows",
      "expiresAt": "2024-02-15T10:30:00Z",
      "isActive": true,
      "lastUsed": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /api/v1/keys/:id
Get specific API key

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "apiKey": {
    "id": "uuid",
    "key": "PJBOT-XXXX...XXXX",
    "name": "My Trading Bot",
    "platform": "windows",
    "expiresAt": "2024-02-15T10:30:00Z",
    "isActive": true,
    "lastUsed": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### DELETE /api/v1/keys/:id
Revoke API key

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "API key revoked successfully"
}
```

#### POST /api/v1/keys/validate
Validate API key

**Request:**
```json
{
  "apiKey": "PJBOT-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
}
```

**Response:**
```json
{
  "valid": true,
  "platform": "windows",
  "expiresAt": "2024-02-15T10:30:00Z"
}
```

---

### Credential Management

#### POST /api/v1/keys/credentials/store
Store encrypted credentials

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "type": "mt5",
  "name": "My MT5 Account",
  "data": {
    "server": "MetaQuotes-Demo",
    "login": "12345678",
    "password": "secret_password",
    "accountType": "demo"
  }
}
```

**Response:**
```json
{
  "message": "Credential stored successfully",
  "credential": {
    "id": "uuid",
    "type": "mt5",
    "name": "My MT5 Account"
  }
}
```

#### GET /api/v1/keys/credentials
Get all credentials

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "credentials": [
    {
      "id": "uuid",
      "type": "mt5",
      "name": "My MT5 Account",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /api/v1/keys/credentials/:id
Get and decrypt credential

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "credential": {
    "id": "uuid",
    "type": "mt5",
    "name": "My MT5 Account",
    "data": {
      "server": "MetaQuotes-Demo",
      "login": "12345678",
      "password": "secret_password",
      "accountType": "demo"
    }
  }
}
```

---

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Types

1. **Access Token**
   - Short-lived (7 days)
   - Used for API requests
   - Contains user info

2. **Refresh Token**
   - Long-lived (30 days)
   - Used to get new access token
   - Stored securely

### Roles

- **admin**: Full access to all endpoints
- **user**: Standard user access
- **trader**: Trading-specific access

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'trader') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Keys Table
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  key VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id VARCHAR(255),
  details JSONB DEFAULT {},
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT NOT NULL,
  status ENUM('success', 'failure') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Encrypted Credentials Table
```sql
CREATE TABLE encrypted_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type ENUM('mt5', 'exchange', 'api') NOT NULL,
  name VARCHAR(100) NOT NULL,
  encrypted_data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (optional, for caching)

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Create database
createdb pjbot_trading

# Build TypeScript
npm run build

# Start server
npm start
```

### Development

```bash
# Start development server with hot reload
npm run dev
```

### Production

```bash
# Build
npm run build

# Start
npm start
```

---

## 🔧 Configuration

### Environment Variables

See `.env.example` for all configuration options.

**Critical Variables:**
- `JWT_SECRET` - Change in production!
- `ENCRYPTION_KEY` - 32 character key
- `DB_PASSWORD` - Database password
- `REDIS_PASSWORD` - Redis password

### Database Setup

```bash
# Create database
createdb pjbot_trading

# Run migrations (auto on first start)
# Tables will be created automatically
```

---

## 📊 Monitoring & Logging

### Log Files

- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/audit.log` - Security audit logs
- `logs/trading.log` - Trading activity logs

### Log Levels

- `error` - Critical errors
- `warn` - Warnings
- `info` - General info
- `debug` - Debug info (development only)

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 📝 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## 🔒 Security Best Practices

### For Production

1. **Change all default secrets**
   - JWT_SECRET
   - ENCRYPTION_KEY
   - DB_PASSWORD
   - SESSION_SECRET

2. **Enable HTTPS**
   - Use reverse proxy (Nginx)
   - SSL/TLS certificates
   - HSTS headers

3. **Database Security**
   - Use strong passwords
   - Limit database access
   - Regular backups
   - Enable SSL connections

4. **Rate Limiting**
   - Adjust limits based on traffic
   - Monitor for abuse
   - Implement IP whitelisting

5. **Monitoring**
   - Setup error tracking (Sentry)
   - Monitor audit logs
   - Setup alerts for security events

6. **Updates**
   - Keep dependencies updated
   - Regular security audits
   - Patch vulnerabilities

---

## 🆘 Support

For issues or questions:
- Check logs in `logs/` directory
- Review audit logs for security events
- Contact: support@pjbot.ai

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready
