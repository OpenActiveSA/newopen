// Custom API service for our backend
const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? import.meta.env.VITE_API_BASE
    : 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
      console.log('💾 Token saved to instance and localStorage');
    } else {
      localStorage.removeItem('auth_token');
      console.log('🗑️ Token removed from instance and localStorage');
    }
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Always get the latest token from localStorage first, then fall back to instance
    let currentToken = localStorage.getItem('auth_token');
    if (!currentToken && this.token) {
      currentToken = this.token;
      // Sync localStorage if instance has it but localStorage doesn't
      localStorage.setItem('auth_token', this.token);
    }
    
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
      console.log('🔑 Token being sent:', currentToken.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No token available for request');
      console.warn('   localStorage.getItem("auth_token"):', localStorage.getItem('auth_token'));
      console.warn('   this.token:', this.token);
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Check for authentication errors
        if (response.status === 401 || response.status === 403) {
          const errorMsg = data.error || 'Authentication failed'
          // Only clear token for explicit token-related errors, not generic auth failures
          // Don't clear immediately - let the component handle it
          if (errorMsg.includes('token') || errorMsg.includes('expired') || errorMsg.includes('Invalid') || errorMsg.includes('Access token required')) {
            console.warn('🔒 Authentication error detected:', errorMsg);
            // Note: We'll let components decide whether to clear, but log it
            window.dispatchEvent(new CustomEvent('auth:token-expired', { detail: { error: errorMsg } }))
          }
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      console.log('✅ Login successful, saving token:', response.token.substring(0, 20) + '...');
      this.setToken(response.token);
      // Verify it was saved
      const saved = localStorage.getItem('auth_token');
      console.log('✅ Token saved to localStorage:', saved ? saved.substring(0, 20) + '...' : 'NOT SAVED!');
    } else {
      console.error('❌ Login response missing token:', response);
    }
    
    return response;
  }

  async register(email, password, userData = {}) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        name: userData.name,
        phone: userData.phone 
      }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  // User methods
  async getCurrentUser() {
    return await this.request('/users/me');
  }

  async updateProfile(updates) {
    return await this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getAllUsers() {
    return await this.request('/users');
  }

  async assignUserRole(userId, roleName) {
    return await this.request(`/users/${userId}/roles`, {
      method: 'POST',
      body: JSON.stringify({ roleName }),
    });
  }

  async removeUserRole(userId, roleName) {
    return await this.request(`/users/${userId}/roles/${roleName}`, {
      method: 'DELETE',
    });
  }

  // Farm methods (renamed from clubs)
  async getClubs() {
    return await this.request('/farms');
  }

  async getClubById(clubId) {
    return await this.request(`/farms/${clubId}`);
  }

  async getClubBySlug(slug) {
    return await this.request(`/farms/${slug}`);
  }

  async createClub(clubData) {
    return await this.request('/farms', {
      method: 'POST',
      body: JSON.stringify(clubData),
    });
  }

  async getClubUsers(clubId) {
    return await this.request(`/farms/${clubId}/users`);
  }

  // Farm settings methods (renamed from club-settings)
  async getClubSettings(clubId) {
    return await this.request(`/farm-settings/${clubId}`);
  }

  async updateClubSettings(clubId, settings) {
    return await this.request(`/farm-settings/${clubId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Club relationship methods
  async getUserClubRelationships() {
    return await this.request('/users/me/farms');
  }

  async addClubRelationship(clubId, relationshipType) {
    return await this.request('/users/me/farms', {
      method: 'POST',
      body: JSON.stringify({ 
        club_id: clubId, 
        relationship_type: relationshipType 
      }),
    });
  }

  async removeClubRelationship(clubId) {
    return await this.request(`/users/me/farms/${clubId}`, {
      method: 'DELETE',
    });
  }

  // Camp methods (renamed from courts)
  async getCourts(clubId) {
    return await this.request(`/camps/club/${clubId}`);
  }

  async createCourt(clubId, courtData) {
    return await this.request(`/camps/club/${clubId}`, {
      method: 'POST',
      body: JSON.stringify(courtData),
    });
  }

  async updateCourt(courtId, courtData) {
    return await this.request(`/camps/${courtId}`, {
      method: 'PUT',
      body: JSON.stringify(courtData),
    });
  }

  async deleteCourt(courtId) {
    return await this.request(`/camps/${courtId}`, {
      method: 'DELETE',
    });
  }

  async getCourtById(courtId) {
    return await this.request(`/camps/${courtId}`);
  }

  // Booking methods
  async getBookings(filters = {}) {
    const params = new URLSearchParams(filters);
    const endpoint = params.toString() ? `/bookings?${params}` : '/bookings';
    return await this.request(endpoint);
  }

  async createBooking(bookingData) {
    return await this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(bookingId, updates) {
    return await this.request(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async cancelBooking(bookingId) {
    return await this.request(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  // Event methods
  async getEvents(clubId = null) {
    const endpoint = clubId ? `/events?club_id=${clubId}` : '/events';
    return await this.request(endpoint);
  }

  // Rainfall methods
  async getRainfallForFarm(farmId) {
    return await this.request(`/farms/${farmId}/rainfall`);
  }

  async saveRainfallForFarm(farmId, { date, amount_mm, notes }) {
    return await this.request(`/farms/${farmId}/rainfall`, {
      method: 'POST',
      body: JSON.stringify({ date, amount_mm, notes })
    });
  }

  async deleteRainfall(recordId) {
    return await this.request(`/rainfall/${recordId}`, { method: 'DELETE' });
  }

  async getRainfallSummary(farmId) {
    return await this.request(`/farms/${farmId}/rainfall/summary`);
  }

  async createEvent(eventData) {
    return await this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;





