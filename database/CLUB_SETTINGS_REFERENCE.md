# Club Settings Reference

## Overview
The club settings system allows club managers to configure their club's booking rules, operating hours, and notification preferences.

## Database Schema

### Table: `club_settings`
Located in `database/club_settings_schema.sql`

**Key Fields:**
- `club_id` - Foreign key to clubs table (one-to-one relationship)
- `logo_url` - URL for club logo
- `booking_slot_interval` - Time intervals for booking slots (30, 60, or 90 minutes)
- `session_duration_options` - CSV list of available booking durations (e.g., "30,60,90,120")
- `allow_consecutive_bookings` - Boolean flag for consecutive bookings
- `show_day_view` - Boolean flag for day view display
- `days_ahead_booking` - How many days in advance members can book (3-30 days)
- `next_day_opens_at` - When next day bookings become available (00:00:00 or 12:00:00)
- `spring_summer_open/close` - Operating hours for spring/summer season
- `autumn_winter_open/close` - Operating hours for autumn/winter season
- `admin_booking_notification_email` - Email for booking notifications
- `admin_guest_booking_email` - Email for guest booking requests

## API Endpoints

### GET `/api/club-settings/:clubId`
Retrieves club settings for the specified club.

**Authorization:** Club manager or system admin

**Response:**
```json
{
  "settings": {
    "id": 1,
    "club_id": 1,
    "logo_url": "https://example.com/logo.png",
    "booking_slot_interval": 30,
    "session_duration_options": "30,60,90,120",
    "allow_consecutive_bookings": true,
    "show_day_view": true,
    "days_ahead_booking": 7,
    "next_day_opens_at": "00:00:00",
    "spring_summer_open": "06:00:00",
    "spring_summer_close": "22:00:00",
    "autumn_winter_open": "07:00:00",
    "autumn_winter_close": "20:00:00",
    "admin_booking_notification_email": "admin@example.com",
    "admin_guest_booking_email": "guest@example.com",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### PUT `/api/club-settings/:clubId`
Updates club settings.

**Authorization:** Club manager or system admin

**Request Body:** (all fields optional)
```json
{
  "logo_url": "https://example.com/new-logo.png",
  "booking_slot_interval": 60,
  "session_duration_options": "60,90",
  "allow_consecutive_bookings": false,
  "show_day_view": true,
  "days_ahead_booking": 14,
  "next_day_opens_at": "12:00:00",
  "spring_summer_open": "07:00:00",
  "spring_summer_close": "21:00:00",
  "autumn_winter_open": "08:00:00",
  "autumn_winter_close": "19:00:00",
  "admin_booking_notification_email": "newadmin@example.com",
  "admin_guest_booking_email": "newguest@example.com"
}
```

**Response:**
```json
{
  "message": "Settings updated successfully",
  "settings": { /* updated settings object */ }
}
```

## Frontend Integration

### Component: `SettingsTab` (in `ClubAdmin.jsx`)
The settings interface is organized into sections:

1. **Club Branding**
   - Logo URL input

2. **Booking Configuration**
   - Booking slot interval dropdown (30/60/90 min)
   - Session duration checkboxes (30/60/90/120 min)
   - Consecutive bookings radio (Yes/No)
   - Show day view radio (Yes/No)

3. **Booking Rules**
   - Days ahead booking dropdown (3-30 days)
   - Next day opens at dropdown (12am/12pm)

4. **Operating Hours**
   - Spring/Summer opening/closing time inputs
   - Autumn/Winter opening/closing time inputs

5. **Notification Settings**
   - Admin booking notification email
   - Admin guest booking email

### API Service Methods
Located in `src/services/api.js`:

```javascript
// Get club settings
const settings = await apiService.getClubSettings(clubId)

// Update club settings
await apiService.updateClubSettings(clubId, {
  booking_slot_interval: 60,
  days_ahead_booking: 14
})
```

## Default Values
When a club is created, default settings are:
- Booking slot interval: 30 minutes
- Session durations: 30, 60, 90, 120 minutes
- Allow consecutive bookings: Yes
- Show day view: Yes
- Days ahead booking: 7 days
- Next day opens at: 12:00 AM (midnight)
- Spring/Summer hours: 6:00 AM - 10:00 PM
- Autumn/Winter hours: 7:00 AM - 8:00 PM
- Notification emails: null (must be configured)

## Usage Notes
- Settings are club-specific (one settings record per club)
- Club managers can only edit their own club's settings
- System admins (openactive_user role) can edit any club's settings
- Logo URL is stored as a string (actual file upload functionality separate)
- Time fields use MySQL TIME format (HH:MM:SS)
- Boolean fields stored as TINYINT(1) in MySQL (0/1)

