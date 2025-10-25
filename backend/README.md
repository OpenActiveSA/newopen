# Open Active Backend

A complete Node.js backend for the Open Active tennis booking system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Database

1. **Install PostgreSQL** (if not already installed)
2. **Create database:**
   ```sql
   CREATE DATABASE openactive;
   ```

3. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Run migrations:**
   ```bash
   npm run migrate
   ```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🏗️ Architecture

### **Tech Stack:**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### **Project Structure:**
```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management
│   ├── clubs.js             # Club management
│   ├── courts.js            # Court management
│   └── bookings.js          # Booking system
├── scripts/
│   └── migrate.js           # Database migrations
├── server.js                # Main server file
└── package.json
```

## 🔐 Authentication

### **User Roles:**
- **openactive_user** - Super admin (can manage everything)
- **club_manager** - Club administrator
- **member** - Club member
- **visitor** - Club visitor

### **JWT Token:**
- **Expires:** 7 days
- **Header:** `Authorization: Bearer <token>`
- **Secret:** Configured in `.env`

## 📊 API Endpoints

### **Authentication**
```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update profile
PUT  /api/auth/password    # Change password
POST /api/auth/logout      # Logout
```

### **Clubs**
```
GET    /api/clubs                    # Get all clubs
GET    /api/clubs/:slug              # Get club by slug
POST   /api/clubs                    # Create club
PUT    /api/clubs/:clubId            # Update club
GET    /api/clubs/:clubId/members    # Get club members
POST   /api/clubs/:clubId/members    # Add member
DELETE /api/clubs/:clubId/members/:userId  # Remove member
GET    /api/clubs/:clubId/stats      # Get club statistics
```

### **Courts**
```
GET    /api/courts/club/:clubId      # Get club courts
POST   /api/courts/club/:clubId      # Create court
PUT    /api/courts/:courtId          # Update court
DELETE /api/courts/:courtId          # Delete court
```

### **Bookings**
```
GET    /api/bookings/my-bookings     # Get user bookings
GET    /api/bookings/club/:clubId    # Get club bookings
POST   /api/bookings                 # Create booking
PUT    /api/bookings/:bookingId/status  # Update booking status
PUT    /api/bookings/:bookingId/cancel  # Cancel booking
GET    /api/bookings/:bookingId      # Get booking details
```

### **Users**
```
GET    /api/users                    # Get all users (admin only)
GET    /api/users/:userId            # Get user by ID
PUT    /api/users/:userId/role       # Update user role (admin only)
```

## 🗄️ Database Schema

### **Tables:**
- **users** - User accounts and profiles
- **clubs** - Club information
- **club_relationships** - User-club memberships
- **courts** - Court/venue management
- **bookings** - Booking system
- **events** - Club events (future feature)

### **Key Features:**
- **UUID primary keys** for all tables
- **Automatic timestamps** (created_at, updated_at)
- **Soft deletes** (is_active flags)
- **JSONB settings** for flexible configuration
- **Foreign key constraints** for data integrity

## 🔒 Security Features

### **Authentication:**
- JWT tokens with expiration
- Password hashing with bcrypt
- Role-based access control

### **Authorization:**
- Club-level permissions
- User role validation
- Resource ownership checks

### **Input Validation:**
- Express-validator for all inputs
- SQL injection prevention
- XSS protection

### **Rate Limiting:**
- 100 requests per 15 minutes per IP
- Configurable limits

## 🚀 Deployment

### **Environment Variables:**
```env
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=openactive
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### **Production Setup:**
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Start server with PM2 or similar
5. Set up reverse proxy (nginx)
6. Configure SSL certificates

## 🧪 Testing

### **Health Check:**
```bash
curl http://localhost:5000/health
```

### **Sample API Calls:**
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get clubs
curl http://localhost:5000/api/clubs
```

## 🔧 Development

### **Scripts:**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run migrate    # Run database migrations
```

### **Database Management:**
```bash
# Connect to database
psql -h localhost -U postgres -d openactive

# View tables
\dt

# View data
SELECT * FROM users;
SELECT * FROM clubs;
```

## 🎾 Features

### **Core Functionality:**
- ✅ User registration and authentication
- ✅ Club creation and management
- ✅ Court management
- ✅ Booking system
- ✅ Role-based permissions
- ✅ Real-time data validation

### **Security:**
- ✅ Password hashing
- ✅ JWT authentication
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS protection

### **Scalability:**
- ✅ Connection pooling
- ✅ Indexed database queries
- ✅ Efficient API design
- ✅ Error handling

## 🆘 Troubleshooting

### **Common Issues:**

**Database Connection Error:**
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database exists

**JWT Token Error:**
- Check JWT_SECRET is set
- Verify token format in requests
- Check token expiration

**CORS Error:**
- Update FRONTEND_URL in `.env`
- Check CORS configuration in server.js

### **Logs:**
- Check console output for errors
- Database queries are logged
- Authentication attempts are logged

## 📞 Support

For issues or questions:
1. Check the logs for error messages
2. Verify environment configuration
3. Test database connectivity
4. Check API endpoint documentation

Your custom backend is now ready for the Open Active tennis booking system! 🎾


