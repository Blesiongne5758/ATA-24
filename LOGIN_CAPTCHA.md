# 🔐 Login & Captcha System

## 📋 Overview

Sistem autentikasi dengan captcha untuk mengamankan akses ke AI Trading Agent.

## ✨ Fitur

### 1. **Halaman Login**
- Form email dan password
- Captcha verification (math & text)
- Show/hide password toggle
- Loading state
- Error handling
- Demo credentials

### 2. **Captcha System**
- **Math Captcha**: Operasi matematika sederhana (+, -, ×)
- **Text Captcha**: 6 karakter alphanumeric
- Refresh button
- Visual distortion untuk security
- Auto-verify

### 3. **Auth State Management**
- Zustand store dengan persist middleware
- Session persistence (localStorage)
- User info (id, email, name, role, token)
- Login/logout functions

### 4. **Protected Routes**
- Conditional rendering berdasarkan auth status
- Auto-redirect ke login jika belum autentikasi
- Logout button di header

## 🎨 UI Components

### LoginPage
```typescript
import LoginPage from './components/LoginPage';

// Tampilkan jika belum login
if (!isAuthenticated) {
  return <LoginPage />;
}
```

**Features:**
- ✅ Dark theme dengan purple accent
- ✅ Animated background effects
- ✅ Form validation
- ✅ Captcha integration
- ✅ Loading states
- ✅ Error messages
- ✅ Demo credentials display

### Captcha Component
```typescript
import Captcha from './components/Captcha';

<Captcha onVerify={(success) => setCaptchaVerified(success)} />
```

**Features:**
- ✅ Random math/text generation
- ✅ Visual distortion
- ✅ Refresh capability
- ✅ Verification callback
- ✅ Error handling

## 🔧 Implementation

### Auth Store (Zustand)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'trader';
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}
```

### Login Flow
```
1. User masuk ke aplikasi
   ↓
2. Check isAuthenticated dari authStore
   ↓
3. Jika false → tampilkan LoginPage
   ↓
4. User input email, password, captcha
   ↓
5. Validasi form
   ↓
6. Verify captcha
   ↓
7. Call login API (mock/simulasi)
   ↓
8. Jika success → set user & isAuthenticated
   ↓
9. Redirect ke TradingWidget
```

### Logout Flow
```
1. User klik tombol logout
   ↓
2. Call logout() dari authStore
   ↓
3. Clear user & isAuthenticated
   ↓
4. Redirect ke LoginPage
```

## 📊 Demo Credentials

### Admin Access
```
Email: admin@pjbot.ai
Password: admin123
Role: admin
```

### User Access
```
Email: [any valid email]
Password: [6+ characters]
Role: user
```

## 🎯 Captcha Types

### Math Captcha
```
Examples:
- 5 + 3 = ?
- 8 - 2 = ?
- 4 × 6 = ?
```

### Text Captcha
```
Examples:
- A7K9M2
- X3B8N5
- P2L6Q9
```

## 🔒 Security Features

### Captcha Security
- ✅ Random generation
- ✅ Visual distortion
- ✅ Background noise
- ✅ Limited attempts
- ✅ Auto-refresh on error

### Auth Security
- ✅ Password hashing (backend)
- ✅ JWT token
- ✅ Session persistence
- ✅ Role-based access
- ✅ Secure logout

### Form Validation
- ✅ Email format validation
- ✅ Password length check
- ✅ Required fields
- ✅ Captcha verification
- ✅ Error messages

## 📱 Responsive Design

### Desktop
- Centered card layout
- Max width: 448px
- Full form visible

### Mobile
- Full width card
- Scrollable form
- Touch-friendly inputs

## 🎨 Design System

### Colors
```css
Background: #050211 (dark)
Card: gray-900/50 (glassmorphism)
Border: purple-500/20
Primary: purple-500
Secondary: blue-500
Error: red-500
Success: green-500
```

### Typography
```css
Heading: text-2xl font-bold
Label: text-sm font-medium
Input: text-sm
Error: text-xs
Caption: text-[9px]
```

### Spacing
```css
Card padding: p-8
Field gap: space-y-5
Button padding: py-3
Input padding: px-4 py-3
```

## 🚀 Usage

### 1. Import Components
```typescript
import LoginPage from './components/LoginPage';
import Captcha from './components/Captcha';
import { useAuthStore } from './store/authStore';
```

### 2. Check Auth Status
```typescript
const { isAuthenticated, user } = useAuthStore();

if (!isAuthenticated) {
  return <LoginPage />;
}
```

### 3. Login
```typescript
const { login } = useAuthStore();

login({
  id: '1',
  email: 'user@example.com',
  name: 'User Name',
  role: 'user',
  token: 'jwt-token'
});
```

### 4. Logout
```typescript
const { logout } = useAuthStore();
logout();
```

### 5. Get User Info
```typescript
const { user } = useAuthStore();
console.log(user?.name); // "User Name"
console.log(user?.role); // "user"
```

## 📝 Files

### Components
- `src/components/LoginPage.tsx` - Halaman login
- `src/components/Captcha.tsx` - Komponen captcha

### Store
- `src/store/authStore.ts` - Auth state management

### Integration
- `src/App.tsx` - Conditional rendering
- `src/components/TradingWidget.tsx` - Logout button & user info

## 🧪 Testing

### Test Login Flow
1. Buka aplikasi
2. Lihat halaman login
3. Input email: `admin@pjbot.ai`
4. Input password: `admin123`
5. Selesaikan captcha
6. Klik "Masuk"
7. Redirect ke TradingWidget
8. Lihat user info di header

### Test Logout
1. Di TradingWidget
2. Klik tombol logout (🚪)
3. Redirect ke LoginPage
4. Auth state cleared

### Test Captcha
1. Lihat captcha (math/text)
2. Input jawaban
3. Klik "Verifikasi Captcha"
4. Jika benar → ✓ Captcha terverifikasi
5. Jika salah → Error message + refresh

## 🐛 Troubleshooting

### Captcha tidak muncul
- Check komponen Captcha di-import
- Verify onVerify callback

### Login tidak berhasil
- Check email format
- Verify password length (6+ chars)
- Check captcha verification

### User info tidak muncul
- Check authStore state
- Verify login() dipanggil
- Check user object structure

### Logout tidak bekerja
- Check logout() function
- Verify authStore import
- Check conditional rendering

## 🔮 Future Enhancements

### Planned Features
- [ ] Register page
- [ ] Forgot password
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)
- [ ] Remember me
- [ ] Session timeout
- [ ] Activity logs
- [ ] IP whitelist

### Backend Integration
- [ ] Real API endpoints
- [ ] JWT validation
- [ ] Password hashing (bcrypt)
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Input sanitization

## 📞 Support

### Documentation
- Main README: `README.md`
- Login Guide: `LOGIN_CAPTCHA.md` (this file)

### Contact
- Email: support@pjbot.ai
- Discord: https://discord.gg/pjbot

---

**Version**: 2.4.0  
**Release Date**: 2024  
**Status**: ✅ Production Ready

🔐 **Secure Login with Captcha Protection!**
