# 🎛️ Two-Level Dashboard System Guide

## 📊 **Dashboard Structure**

Your Open Farm Tennis Booking System now has **two separate dashboards** with different access levels:

### 1. **🔧 Open Farm Admin Dashboard** (System-wide)
- **URL**: `/admin`
- **Who can access?** OpenActive admins only (`openactive_user` role)
- **What can they see?** Everything in the system
- **Features**:
  - View ALL users across all clubs
  - View ALL clubs in the system
  - Manage any club
  - System-wide analytics (coming soon)

### 2. **⚙️ Club Manager Dashboard** (Per-club)
- **URL**: `/club/{clubId}/admin`
- **Who can access?** Club managers (`manager` relationship to that specific club)
- **What can they see?** Only their club's data
- **Features**:
  - View users in THEIR club
  - Manage courts (coming soon)
  - View bookings (coming soon)
  - Club settings (coming soon)

---

## 🔐 **Access Control**

### **System Admin (You)**
```
Login with: admin@example.com / password123
Global Role: openactive_user
```

**What you can access:**
- ✅ **System Admin Dashboard** - See all clubs and all users
- ✅ **Any Club's Manager Dashboard** - Full access to any club
- ✅ All system features

**Navigation:**
1. Login
2. Open menu (☰)
3. Click "🔧 System Admin"

---

### **Club Manager**
```
Login with: admin@example.com / password123
(Already set up as manager of "Demo Tennis Club")
```

**What they can access:**
- ✅ **Their Club's Manager Dashboard** - See only their club's users
- ❌ **Cannot access System Admin Dashboard**
- ❌ **Cannot see other clubs' data**

**Navigation:**
1. Login
2. Open menu (☰)
3. Click "🎾 Demo Tennis Club"
4. Click "⚙️ Manage Demo Tennis Club"

---

## 🎯 **Dashboard Features**

### **Open Farm Admin Dashboard**

#### **Tab 1: All Users**
Shows complete user directory with:
- User name, email, phone
- Global role (openactive_user, club_manager, member, visitor)
- Club memberships with roles
- Registration date

**Use Cases:**
- See who's using the system
- Check which clubs a user belongs to
- Monitor user growth
- Identify system admins

#### **Tab 2: All Clubs**
Shows all registered clubs with:
- Club name and description
- Contact information (address, phone, email)
- Active/Inactive status
- Creation date
- "Manage Club" button (goes to that club's admin dashboard)

**Use Cases:**
- See all clubs in the system
- Quick access to any club's management
- Monitor club registrations
- Check club details

#### **Tab 3: Analytics** (Coming Soon)
- System-wide statistics
- Usage metrics
- Growth charts

#### **Tab 4: Settings** (Coming Soon)
- System configuration
- Global settings

---

### **Club Manager Dashboard**

#### **Tab 1: Users**
Shows registered users for THIS club only:
- User name, email, phone
- Club role (manager, member, visitor)
- Global role
- Join date
- Active status

**Use Cases:**
- See who's in your club
- Check member roles
- Manage club access

#### **Tab 2: Courts** (Coming Soon)
- List of tennis courts
- Court availability
- Pricing

#### **Tab 3: Bookings** (Coming Soon)
- Court bookings
- Schedule management

#### **Tab 4: Settings** (Coming Soon)
- Club-specific settings
- Operating hours
- Policies

---

## 🚀 **How to Test**

### **Test 1: System Admin Dashboard**
1. **Login** as admin: `admin@example.com` / `password123`
2. **Open menu** (☰)
3. **Click** "🔧 System Admin"
4. **You should see**:
   - "All Users" tab showing 2 users (test@example.com, admin@example.com)
   - "All Clubs" tab showing 2 clubs (Demo Tennis Club, Elite Sports Center)
5. **Click** "Manage Club" on Demo Tennis Club
6. **You should be redirected** to that club's manager dashboard

### **Test 2: Club Manager Dashboard**
1. **Stay logged in** as admin (who is also a manager)
2. **Open menu** (☰)
3. **Click** "⚙️ Manage Demo Tennis Club"
4. **You should see**:
   - "Users" tab showing users in Demo Tennis Club only
   - User #1 (test@example.com) - member
   - User #2 (admin@example.com) - manager

### **Test 3: Access Control (Non-admin)**
1. **Logout** (if logged in)
2. **Login** as test user: `test@example.com` / `password123`
3. **Open menu** (☰)
4. **You should NOT see**:
   - "🔧 System Admin" option (because you're not an openactive_user)
5. **You should only see**:
   - "🎾 Demo Tennis Club" (because you're a member)
   - NO "⚙️ Manage" option (because you're not a manager)

---

## 📁 **Files Created**

### **Backend**
- `backend/routes/users.js` - Updated to return all users with club relationships
- `backend/routes/clubs.js` - Added `/clubs/:clubId/users` endpoint

### **Frontend - System Admin**
- `src/components/OpenActiveAdmin.jsx` - System-wide admin dashboard
- `src/components/OpenActiveAdmin.css` - Styling

### **Frontend - Club Manager**
- `src/components/ClubAdmin.jsx` - Per-club manager dashboard
- `src/components/ClubAdmin.css` - Styling

### **API Updates**
- `src/services/api.js` - Added `getAllUsers()` and `getClubUsers(clubId)`

---

## 🔄 **API Endpoints**

### **System Admin Endpoints**
```javascript
GET /api/users
Authorization: Bearer {token}
Role Required: openactive_user

Response: {
  users: [
    {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      role: "member",
      clubs: [
        { clubId: 1, clubName: "Demo Tennis Club", role: "member" }
      ]
    }
  ],
  totalUsers: 2
}
```

### **Club Manager Endpoints**
```javascript
GET /api/clubs/:clubId/users
Authorization: Bearer {token}
Role Required: manager of this club OR openactive_user

Response: {
  clubId: 1,
  users: [
    {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      relationship_type: "member",
      global_role: "member",
      joined_at: "2024-10-28T10:00:00.000Z"
    }
  ]
}
```

---

## 🎨 **Design Features**

- **Modern dark theme** (#052333 background)
- **Gradient title** for System Admin
- **Tabbed interface** for easy navigation
- **Responsive tables** with hover effects
- **Color-coded badges** for roles and status
- **Clean cards** for club display
- **Mobile-friendly** design

---

## 🔮 **Future Enhancements**

- [ ] Add user management (edit, delete, change roles)
- [ ] Add club management (edit club details)
- [ ] Implement courts management
- [ ] Add bookings calendar
- [ ] Analytics dashboards
- [ ] Export data functionality
- [ ] Search and filter features
- [ ] Bulk actions

---

## 📝 **Notes**

- **Role hierarchy**: openactive_user > club manager > member > visitor
- **Data isolation**: Club managers can ONLY see their club's data
- **Admin override**: System admins can access any club's dashboard
- **Security**: All endpoints check authentication and authorization

**Everything is ready to test!** 🚀

Login and explore both dashboards to see the full system in action!




