// Custom API service for our backend
const API_BASE_URL = 'http://localhost:5000/api';

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
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
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
      this.setToken(response.token);
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

  // Club methods
  async getClubs() {
    return await this.request('/clubs');
  }

  async getClubById(clubId) {
    return await this.request(`/clubs/${clubId}`);
  }

  async createClub(clubData) {
    return await this.request('/clubs', {
      method: 'POST',
      body: JSON.stringify(clubData),
    });
  }

  // Club relationship methods
  async getUserClubRelationships() {
    return await this.request('/users/me/clubs');
  }

  async addClubRelationship(clubId, relationshipType) {
    return await this.request('/users/me/clubs', {
      method: 'POST',
      body: JSON.stringify({ 
        club_id: clubId, 
        relationship_type: relationshipType 
      }),
    });
  }

  async removeClubRelationship(clubId) {
    return await this.request(`/users/me/clubs/${clubId}`, {
      method: 'DELETE',
    });
  }

  // Court methods
  async getCourts(clubId = null) {
    const endpoint = clubId ? `/courts?club_id=${clubId}` : '/courts';
    return await this.request(endpoint);
  }

  async getCourtById(courtId) {
    return await this.request(`/courts/${courtId}`);
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
