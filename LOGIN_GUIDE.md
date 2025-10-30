# 🔐 Login Guide - Open Farm Tennis Booking System

## ✅ System Status

- ✅ **Database**: MySQL database `openactive` created with test users
- ✅ **Backend API**: Running on `http://localhost:5000`
- ✅ **Web App**: Running on `http://localhost:3000`
- ✅ **Mobile App**: Ready to start with Expo Go

## 🎯 Test Credentials

### Regular User (Member)
- **Email**: `test@example.com`
- **Password**: `password123`
- **Role**: member

### Admin User (OpenActive User)
- **Email**: `admin@example.com`
- **Password**: `password123`
- **Role**: openactive_user

## 🌐 Web App Login

1. **Open your browser**: Navigate to `http://localhost:3000`
2. **Click Login**: Click the menu (☰) and select "Login"
3. **Enter credentials**: Use one of the test accounts above
4. **Login**: Click the "Login" button

### What Should Happen:
- ✅ Form validates email and password
- ✅ API request sent to `http://localhost:5000/api/auth/login`
- ✅ JWT token received and stored in localStorage
- ✅ User profile loaded from `/api/users/me`
- ✅ Club relationships loaded from `/api/users/me/clubs`
- ✅ Redirected to home page
- ✅ User profile visible in header

## 📱 Mobile App Login

1. **Start Expo**: 
   ```powershell
   cd mobile
   npx expo start
   ```

2. **Open Expo Go**: Scan QR code with Expo Go app

3. **Login**:
   - Tap the "Login to Continue" button
   - Enter credentials
   - Tap "Login"

### What Should Happen:
- ✅ Form validates email and password
- ✅ API request sent to backend
- ✅ JWT token stored
- ✅ Success alert displayed
- ✅ Navigated to home screen
- ✅ User profile visible

## 🔍 How Login Works

### 1. **Frontend Flow** (Web & Mobile)
```javascript
// User enters credentials
email: "test@example.com"
password: "password123"

// LoginForm calls UserContext.login()
await login(email, password)

// UserContext.login() calls apiService.login()
const response = await apiService.login(email, password)
```

### 2. **API Request**
```javascript
POST http://localhost:5000/api/auth/login
Headers: { "Content-Type": "application/json" }
Body: {
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. **Backend Validation** (`backend/routes/auth.js`)
- ✅ Validates email format
- ✅ Checks if user exists in database
- ✅ Compares password with bcrypt hash
- ✅ Generates JWT token
- ✅ Returns user data + token + club relationships

### 4. **Backend Response**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "role": "member"
  },
  "clubRelationships": [
    {
      "club_id": 1,
      "relationship_type": "member",
      "club_name": "Demo Tennis Club",
      "joined_at": "2024-10-28T10:00:00.000Z"
    }
  ],
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. **Frontend Token Storage**
- **Web**: `localStorage.setItem('auth_token', token)`
- **Mobile**: Token stored in memory (can be upgraded to AsyncStorage)

### 6. **Load User Data**
```javascript
// UserContext loads user profile
const profile = await apiService.getCurrentUser()

// UserContext loads club relationships
const relationships = await apiService.getUserClubRelationships()

// UserContext updates state
dispatch({
  type: 'LOGIN',
  payload: {
    user: profile,
    globalRole: profile.role,
    clubRelationships: {...}
  }
})
```

## 🐛 Troubleshooting

### Issue: "Login failed" or Network Error

**Check Backend:**
```powershell
# Is backend running?
netstat -ano | findstr :5000

# Check backend logs in the terminal window
```

**Check Database:**
```powershell
cd backend
npm run setup-db
```

### Issue: "Invalid credentials"

**Verify Test Users:**
- Email must be exact: `test@example.com` (not Test@Example.com)
- Password must be exact: `password123`

**Re-create Test Users:**
```powershell
cd backend
npm run setup-db
```

### Issue: Token not persisting

**Web**: Check browser console for localStorage errors
**Mobile**: Token storage is in-memory only (refresh will lose session)

### Issue: CORS Error

**Check backend/.env:**
```env
FRONTEND_URL=http://localhost:3000
```

**Restart backend after changing .env**

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/password` - Change password (requires token)

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/me/clubs` - Get user's club relationships

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club by ID
- `POST /api/clubs` - Create club (requires auth)

## 🧪 Testing the Login

### Test 1: Valid Login
1. Navigate to login page
2. Enter: `test@example.com` / `password123`
3. Click Login
4. ✅ Should redirect to home with user profile visible

### Test 2: Invalid Email
1. Navigate to login page
2. Enter: `wrong@example.com` / `password123`
3. Click Login
4. ✅ Should show "Invalid credentials" error

### Test 3: Invalid Password
1. Navigate to login page
2. Enter: `test@example.com` / `wrongpassword`
3. Click Login
4. ✅ Should show "Invalid credentials" error

### Test 4: Empty Fields
1. Navigate to login page
2. Leave fields empty
3. Click Login
4. ✅ Should show "Please enter email and password" error

### Test 5: Admin Login
1. Navigate to login page
2. Enter: `admin@example.com` / `password123`
3. Click Login
4. ✅ Should redirect to home
5. ✅ Menu should show "Open Farm Admin" option

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    role ENUM('openactive_user', 'club_manager', 'member', 'visitor'),
    ...
)
```

### Password Hashing
- Algorithm: bcrypt
- Salt rounds: 12
- Test password: `password123`
- Hash: `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lk7YqVzNmXNm`

## 🚀 Quick Start

### Start Everything:
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Web App
cd ..
npm run dev

# Terminal 3: Mobile App (optional)
cd mobile
npx expo start
```

### Test Login:
1. Open `http://localhost:3000`
2. Click menu → Login
3. Use `test@example.com` / `password123`
4. ✅ You're in!

## 📝 Notes

- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt (salt rounds: 12)
- API uses Bearer token authentication
- CORS is configured for `http://localhost:3000`

---

**Need Help?** Check the backend terminal for API request logs!





