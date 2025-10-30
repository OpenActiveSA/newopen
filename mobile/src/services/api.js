// Custom API service for our backend
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your computer's IP for mobile or localhost for web
const API_BASE_URL = 'http://192.168.0.104:5000/api'; // Update this to your computer's IP

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    this.initToken();
  }

  // Initialize token from AsyncStorage
  async initToken() {
    try {
      this.token = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  // Set authentication token
  async setToken(token) {
    this.token = token;
    try {
      if (token) {
        await AsyncStorage.setItem('auth_token', token);
      } else {
        await AsyncStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  // Get authentication headers
  async getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Always get the latest token from AsyncStorage
    try {
      const currentToken = await AsyncStorage.getItem('auth_token');
      if (currentToken) {
        headers['Authorization'] = `Bearer ${currentToken}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    const config = {
      headers,
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

  async getAllUsers() {
    return await this.request('/users');
  }

  async updateUserRole(userId, role) {
    return await this.request(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
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





