# 🔒 Security Implementation Guide

## Overview

Panduan lengkap implementasi keamanan untuk AI Trading Agent backend.

---

## 🛡️ Security Layers

### Layer 1: Network Security

#### 1.1 HTTPS Enforcement
```nginx
# Nginx configuration
server {
    listen 443 ssl http2;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

#### 1.2 Firewall Rules
```bash
# Allow only necessary ports
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 22/tcp   # SSH
sudo ufw enable
```

### Layer 2: Application Security

#### 2.1 Security Headers (Helmet.js)
```typescript
// Sudah diimplementasi di middleware/security.ts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

#### 2.2 CORS Configuration
```typescript
// Sudah diimplementasi di middleware/security.ts
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

#### 2.3 Rate Limiting
```typescript
// Sudah diimplementasi di middleware/security.ts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

### Layer 3: Authentication & Authorization

#### 3.1 JWT Authentication
```typescript
// Sudah diimplementasi di utils/auth.ts
const token = jwt.sign(payload, secret, { expiresIn: '7d' });
```

**Best Practices:**
- ✅ Use strong secret (min 32 characters)
- ✅ Set reasonable expiration (7-30 days)
- ✅ Implement refresh token mechanism
- ✅ Store tokens securely (httpOnly cookies for production)
- ✅ Validate token on every request

#### 3.2 Password Hashing
```typescript
// Sudah diimplementasi di utils/auth.ts
const hashedPassword = await bcrypt.hash(password, 12);
```

**Best Practices:**
- ✅ Use bcrypt with min 12 rounds
- ✅ Never store plain text passwords
- ✅ Enforce strong password policy
- ✅ Implement account lockout after failed attempts

#### 3.3 Role-Based Access Control
```typescript
// Sudah diimplementasi di middleware/security.ts
export const authorize = (...roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

### Layer 4: Data Security

#### 4.1 Encryption at Rest
```typescript
// Sudah diimplementasi di utils/encryption.ts
const encrypted = CryptoJS.AES.encrypt(data, encryptionKey).toString();
```

**What to Encrypt:**
- ✅ API keys
- ✅ Passwords
- ✅ MT5 credentials
- ✅ Exchange API secrets
- ✅ Personal information

#### 4.2 Encryption in Transit
```typescript
// Use HTTPS for all API calls
const api = axios.create({
  baseURL: 'https://api.yourdomain.com',
});
```

#### 4.3 Input Validation
```typescript
// Sudah diimplementasi di middleware/security.ts
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
```

**Validation Rules:**
- ✅ Validate all inputs
- ✅ Use allowlists over blocklists
- ✅ Sanitize user inputs
- ✅ Limit input sizes

### Layer 5: Database Security

#### 5.1 Parameterized Queries
```typescript
// Menggunakan Sequelize (sudah aman dari SQL injection)
const user = await User.findOne({ where: { email } });
```

**Never Do:**
```typescript
// ❌ VULNERABLE TO SQL INJECTION
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

#### 5.2 Database Access Control
```sql
-- Create separate user for application
CREATE USER pjbot_app WITH PASSWORD 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pjbot_app;

-- Revoke unnecessary privileges
REVOKE CREATE ON SCHEMA public FROM pjbot_app;
```

#### 5.3 Database Encryption
```sql
-- Enable encryption at rest (PostgreSQL)
-- In postgresql.conf
encryption_method = 'aes-256-cbc'
```

### Layer 6: API Security

#### 6.1 API Key Management
```typescript
// Sudah diimplementasi di routes/apiKeys.ts
const apiKey = authService.generateAPIKey();
```

**Best Practices:**
- ✅ Generate cryptographically secure keys
- ✅ Set expiration dates
- ✅ Implement key rotation
- ✅ Track key usage
- ✅ Allow key revocation

#### 6.2 Request Signing
```typescript
// Example: HMAC signature
const signature = crypto
  .createHmac('sha256', secret)
  .update(requestBody)
  .digest('hex');
```

### Layer 7: Monitoring & Auditing

#### 7.1 Audit Logging
```typescript
// Sudah diimplementasi di utils/logger.ts
auditLogger.info('User logged in', { userId, ip });
```

**What to Log:**
- ✅ Authentication events (login, logout, failed attempts)
- ✅ API key operations (generate, validate, revoke)
- ✅ Credential access
- ✅ Security incidents
- ✅ Administrative actions

#### 7.2 Security Monitoring
```typescript
// Monitor for suspicious activities
if (failedAttempts > 5) {
  auditLogger.warn('Multiple failed login attempts', { email, ip });
  // Send alert
}
```

---

## 🔐 Security Checklist

### Pre-Deployment

- [ ] Change all default secrets
  - [ ] JWT_SECRET
  - [ ] ENCRYPTION_KEY
  - [ ] DB_PASSWORD
  - [ ] REDIS_PASSWORD
  - [ ] SESSION_SECRET

- [ ] Enable HTTPS
  - [ ] SSL/TLS certificates
  - [ ] HSTS headers
  - [ ] Redirect HTTP to HTTPS

- [ ] Configure firewall
  - [ ] Allow only necessary ports
  - [ ] Block suspicious IPs

- [ ] Database security
  - [ ] Strong passwords
  - [ ] Limited privileges
  - [ ] Encrypted connections
  - [ ] Regular backups

- [ ] Application security
  - [ ] Security headers (Helmet)
  - [ ] CORS configuration
  - [ ] Rate limiting
  - [ ] Input validation

- [ ] Authentication
  - [ ] JWT implementation
  - [ ] Password hashing (bcrypt)
  - [ ] Token refresh mechanism
  - [ ] Account lockout

- [ ] Encryption
  - [ ] Encrypt sensitive data at rest
  - [ ] Use HTTPS for all communications
  - [ ] Secure key management

- [ ] Monitoring
  - [ ] Audit logging
  - [ ] Error tracking (Sentry)
  - [ ] Performance monitoring
  - [ ] Security alerts

### Post-Deployment

- [ ] Regular security updates
- [ ] Penetration testing
- [ ] Security audits
- [ ] Backup testing
- [ ] Incident response plan

---

## 🚨 Common Vulnerabilities & Prevention

### 1. SQL Injection
**Vulnerable:**
```typescript
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

**Secure:**
```typescript
const user = await User.findByPk(userId);
```

### 2. XSS (Cross-Site Scripting)
**Vulnerable:**
```typescript
res.send(`<div>${userInput}</div>`);
```

**Secure:**
```typescript
// React auto-escapes
<div>{userInput}</div>
```

### 3. CSRF (Cross-Site Request Forgery)
**Prevention:**
- ✅ Use CSRF tokens
- ✅ Validate Origin header
- ✅ Use SameSite cookies

### 4. Broken Authentication
**Prevention:**
- ✅ Implement proper session management
- ✅ Use strong passwords
- ✅ Multi-factor authentication
- ✅ Account lockout

### 5. Sensitive Data Exposure
**Prevention:**
- ✅ Encrypt sensitive data
- ✅ Never log sensitive data
- ✅ Use HTTPS
- ✅ Secure key storage

### 6. Security Misconfiguration
**Prevention:**
- ✅ Remove default credentials
- ✅ Disable unnecessary features
- ✅ Keep software updated
- ✅ Regular security audits

---

## 🔑 Key Management

### Encryption Keys
```bash
# Generate secure encryption key (32 characters)
openssl rand -base64 32

# Output: your_32_character_encryption_key_here
```

### JWT Secrets
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Output: your_super_secret_jwt_key_change_this_in_production
```

### API Keys
```typescript
// Generated by backend
const apiKey = `PJBOT-${generateRandomString(5)}-${generateRandomString(5)}-...`;
```

---

## 📊 Security Metrics

### Monitoring Dashboard

Track these metrics:
- Failed login attempts
- API key validation failures
- Rate limit violations
- Suspicious IP addresses
- Unusual access patterns

### Alerts

Setup alerts for:
- Multiple failed login attempts (>5 in 5 minutes)
- API key abuse
- Unusual traffic patterns
- Security incidents

---

## 🛠️ Security Tools

### Development
- **ESLint** - Code quality
- **Snyk** - Dependency vulnerabilities
- **npm audit** - Package security

### Production
- **Snyk** - Continuous monitoring
- **OWASP ZAP** - Penetration testing
- **Nessus** - Vulnerability scanning
- **Sentry** - Error tracking

---

## 📚 Resources

### Standards
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Tools
- [Have I Been Pwned](https://haveibeenpwned.com/) - Check breached passwords
- [SSL Labs](https://www.ssllabs.com/ssltest/) - SSL configuration test
- [Security Headers](https://securityheaders.com/) - Check security headers

---

## 🆘 Incident Response

### If Security Breach Occurs

1. **Contain**
   - Isolate affected systems
   - Revoke compromised credentials
   - Block suspicious IPs

2. **Investigate**
   - Review audit logs
   - Identify attack vector
   - Determine scope

3. **Eradicate**
   - Remove malicious code
   - Patch vulnerabilities
   - Update credentials

4. **Recover**
   - Restore from backups
   - Monitor for suspicious activity
   - Verify system integrity

5. **Learn**
   - Document incident
   - Update security policies
   - Train team

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: ✅ Security Implementation Complete
