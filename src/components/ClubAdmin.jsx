import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { useUser } from '../context/UserContext'
import './ClubAdmin.css'

export function ClubAdmin() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getUserClubs, user, isLoading: authLoading } = useUser()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [club, setClub] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  // Check if user is manager of this club (will check after club is loaded)
  const userClubs = getUserClubs()
  const isManager = club ? userClubs.some(
    c => c.clubId === club.id && c.role === 'manager'
  ) : false

  const loadClubData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Load club info by slug
      const clubResponse = await apiService.getClubBySlug(slug)
      
      console.log('🎾 Club Response:', clubResponse)
      
      setClub(clubResponse.club)
      
      // Load users if we have a club ID
      if (clubResponse.club?.id) {
        const usersResponse = await apiService.getClubUsers(clubResponse.club.id)
        console.log('🎾 Users Response:', usersResponse)
        setUsers(usersResponse.users || [])
      }
    } catch (err) {
      console.error('Error loading club data:', err)
      setError(err.message || 'Failed to load club data')
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    // Wait for auth to load before checking permissions
    if (authLoading) {
      return
    }

    // If not authenticated, redirect to club login
    if (!user) {
      navigate(`/club/${slug}/login`)
      return
    }

    loadClubData()
  }, [slug, authLoading, user, navigate, loadClubData])

  // Show loading while auth is being checked OR while club data is loading
  if (authLoading || isLoading) {
    return (
      <div className="admin-layout">
        <div className="loading-container" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show error if there was a problem loading data
  if (error) {
    return (
      <div className="admin-layout">
        <div className="loading-container" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>
          <button onClick={loadClubData} className="primary-button">Retry</button>
        </div>
      </div>
    )
  }

  // Show message if club not found
  if (!club && !isLoading) {
    return (
      <div className="admin-layout">
        <div className="loading-container" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'white' }}>Club not found.</p>
        </div>
      </div>
    )
  }

  // Only check manager status after club has loaded
  if (club && !isManager) {
    return (
      <div className="admin-layout">
        <div className="loading-container" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'white' }}>Access denied. You are not a manager of this club.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isSidebarCollapsed && (
            <div className="sidebar-brand">
              <h2>{club?.name || 'Club Admin'}</h2>
              <span className="sidebar-subtitle">Club Management</span>
            </div>
          )}
          <button className="toggle-sidebar-button" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isSidebarCollapsed ? (
                <polyline points="9 18 15 12 9 6"></polyline>
              ) : (
                <polyline points="15 18 9 12 15 6"></polyline>
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className="nav-item"
            onClick={() => navigate(`/club/${club?.slug || 'demo'}`)}
            title="View Club"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            {!isSidebarCollapsed && <span>View Club</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            title="Overview"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            {!isSidebarCollapsed && <span>Overview</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            title="Members"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {!isSidebarCollapsed && <span>Members</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === 'courts' ? 'active' : ''}`}
            onClick={() => setActiveTab('courts')}
            title="Courts"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
            {!isSidebarCollapsed && <span>Courts</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
            title="Bookings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {!isSidebarCollapsed && <span>Bookings</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            title="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m-9-9h6m6 0h6"></path>
            </svg>
            {!isSidebarCollapsed && <span>Settings</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || 'M'}</div>
            {!isSidebarCollapsed && (
              <div className="user-details">
                <div className="user-name">{user?.name || 'Manager'}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          {error && <div className="error-message">{error}</div>}
          
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab club={club} users={users} />}
              {activeTab === 'users' && <UsersTab users={users} clubId={club?.id} onRefresh={loadClubData} />}
              {activeTab === 'courts' && <CourtsTab clubId={club?.id} />}
              {activeTab === 'bookings' && <BookingsTab clubId={club?.id} />}
              {activeTab === 'settings' && <SettingsTab club={club} onRefresh={loadClubData} />}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function OverviewTab({ club, users }) {
  const stats = {
    totalMembers: users.length,
    managers: users.filter(u => u.role === 'manager').length,
    members: users.filter(u => u.role === 'member').length,
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h1>Club Overview</h1>
          <p className="section-subtitle">Quick insights and statistics</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalMembers}</h3>
            <p>Total Members</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.managers}</h3>
            <p>Managers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Active Courts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Today's Bookings</p>
          </div>
        </div>
      </div>

      <div className="club-info-section">
        <h2>Club Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Club Name</label>
            <p>{club?.name || 'N/A'}</p>
          </div>
          <div className="info-item">
            <label>Description</label>
            <p>{club?.description || 'No description'}</p>
          </div>
          <div className="info-item">
            <label>Address</label>
            <p>{club?.address || 'N/A'}</p>
          </div>
          <div className="info-item">
            <label>Phone</label>
            <p>{club?.phone || 'N/A'}</p>
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>{club?.email || 'N/A'}</p>
          </div>
          <div className="info-item">
            <label>Status</label>
            <p>
              <span className={`status-badge ${club?.is_active ? 'status-active' : 'status-inactive'}`}>
                {club?.is_active ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function UsersTab({ users, clubId, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUserId, setEditingUserId] = useState(null)

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'manager': return 'role-badge role-manager'
      case 'member': return 'role-badge role-member'
      case 'visitor': return 'role-badge role-visitor'
      default: return 'role-badge'
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiService.updateUserRole(userId, newRole)
      setEditingUserId(null)
      onRefresh()
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Failed to update role: ' + error.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h1>Club Members</h1>
          <p className="section-subtitle">{users.length} members in this club</p>
        </div>
        <button className="btn-primary" onClick={onRefresh}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Refresh
        </button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>No members found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Club ID</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="user-name-cell">
                    <div className="user-avatar-small">{user.name?.charAt(0) || 'U'}</div>
                    <span>{user.name || 'N/A'}</span>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-phone">{user.phone || 'N/A'}</td>
                  <td className="user-id">{user.id}</td>
                  <td>
                    {editingUserId === user.id ? (
                      <select 
                        className="role-select"
                        defaultValue={user.role || 'member'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="visitor">Visitor</option>
                        <option value="member">Member</option>
                        <option value="manager">Manager</option>
                      </select>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={getRoleBadgeClass(user.role || 'member')}>
                          {user.role || 'member'}
                        </span>
                        <button 
                          className="edit-role-button"
                          onClick={() => setEditingUserId(user.id)}
                          title="Edit role"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="date-cell">{user.joined_at ? formatDate(user.joined_at) : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CourtsTab({ clubId }) {
  const [courts, setCourts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCourt, setEditingCourt] = useState(null)
  const [formData, setFormData] = useState({ name: '', sport: 'Tennis' })

  const sports = ['Tennis', 'Padel', 'Pickleball', 'Squash', 'Table Tennis']

  const loadCourts = useCallback(async () => {
    if (!clubId) return
    
    setIsLoading(true)
    try {
      const response = await apiService.getCourts(clubId)
      setCourts(response.courts || [])
    } catch (error) {
      console.error('Error loading courts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [clubId])

  useEffect(() => {
    loadCourts()
  }, [loadCourts])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCourt) {
        await apiService.updateCourt(editingCourt.id, formData)
      } else {
        await apiService.createCourt(clubId, formData)
      }
      setFormData({ name: '', sport: 'Tennis' })
      setShowAddForm(false)
      setEditingCourt(null)
      loadCourts()
    } catch (error) {
      console.error('Error saving court:', error)
      alert('Failed to save court: ' + error.message)
    }
  }

  const handleEdit = (court) => {
    setEditingCourt(court)
    setFormData({ name: court.name, sport: court.sport })
    setShowAddForm(true)
  }

  const handleDelete = async (courtId) => {
    if (!confirm('Are you sure you want to delete this court?')) return
    
    try {
      await apiService.deleteCourt(courtId)
      loadCourts()
    } catch (error) {
      console.error('Error deleting court:', error)
      alert('Failed to delete court: ' + error.message)
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', sport: 'Tennis' })
    setShowAddForm(false)
    setEditingCourt(null)
  }

  if (isLoading) {
    return (
      <div className="content-section">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading courts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h1>Courts</h1>
          <p className="section-subtitle">Manage your club's courts</p>
        </div>
        {!showAddForm && (
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Court
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="form-card">
          <h3>{editingCourt ? 'Edit Court' : 'Add New Court'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="setting-label">Court Name</label>
                <input
                  type="text"
                  className="setting-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Court 1, Main Court"
                  required
                />
              </div>

              <div className="form-group">
                <label className="setting-label">Sport</label>
                <select
                  className="setting-select"
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  required
                >
                  {sports.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingCourt ? 'Update Court' : 'Add Court'}
              </button>
            </div>
          </form>
        </div>
      )}

      {courts.length === 0 && !showAddForm ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.3, marginBottom: '16px'}}>
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <line x1="12" y1="4" x2="12" y2="20"></line>
          </svg>
          <p>No courts configured yet.</p>
          <p style={{fontSize: '14px', marginTop: '8px'}}>Add your first court to get started.</p>
        </div>
      ) : courts.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Court Name</th>
                <th>Sport</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courts.map(court => (
                <tr key={court.id}>
                  <td>{court.name}</td>
                  <td>
                    <span className="sport-badge">{court.sport}</span>
                  </td>
                  <td>{new Date(court.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => handleEdit(court)}
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        className="btn-icon btn-danger" 
                        onClick={() => handleDelete(court.id)}
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function BookingsTab({ clubId }) {
  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h1>Bookings</h1>
          <p className="section-subtitle">Manage court reservations</p>
        </div>
      </div>

      <div className="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.3, marginBottom: '16px'}}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <p>No bookings yet.</p>
        <p style={{fontSize: '14px', marginTop: '8px'}}>Bookings will appear here once members start reserving courts.</p>
      </div>
    </div>
  )
}

function SettingsTab({ club, onRefresh }) {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [club])

  const loadSettings = async () => {
    if (!club?.id) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await apiService.getClubSettings(club.id)
      setSettings(response.settings)
    } catch (err) {
      console.error('Error loading settings:', err)
      setError(err.message || 'Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    setSuccessMessage('')
    
    try {
      await apiService.updateClubSettings(club.id, settings)
      setSuccessMessage('Settings saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setError(err.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="content-section">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="content-section">
        <div className="error-message">Failed to load settings</div>
      </div>
    )
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h1>Club Settings</h1>
          <p className="section-subtitle">Configure your club preferences and booking rules</p>
        </div>
        <button 
          className="btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="settings-container">
        {/* Club Logo Section */}
        <div className="settings-section">
          <h3 className="settings-section-title">Club Branding</h3>
          <div className="setting-item">
            <label className="setting-label">Club Logo URL</label>
            <input
              type="text"
              className="setting-input"
              value={settings.logo_url || ''}
              onChange={(e) => handleChange('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <p className="setting-description">Enter the URL for your club logo</p>
          </div>
        </div>

        {/* Booking Configuration Section */}
        <div className="settings-section">
          <h3 className="settings-section-title">Booking Configuration</h3>
          
          <div className="setting-item">
            <label className="setting-label">Booking Slot Interval</label>
            <select
              className="setting-select"
              value={settings.booking_slot_interval}
              onChange={(e) => handleChange('booking_slot_interval', parseInt(e.target.value))}
            >
              <option value="30">30 minutes (recommended)</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
            <p className="setting-description">Time intervals for booking slots</p>
          </div>

          <div className="setting-item">
            <label className="setting-label">Session Duration Options</label>
            <div className="checkbox-group">
              {[30, 60, 90, 120].map(duration => {
                const durations = (settings.session_duration_options || '30,60,90,120').split(',').map(d => parseInt(d))
                const isChecked = durations.includes(duration)
                
                return (
                  <label key={duration} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const currentDurations = (settings.session_duration_options || '30,60,90,120').split(',').map(d => parseInt(d))
                        let newDurations
                        
                        if (e.target.checked) {
                          newDurations = [...currentDurations, duration].sort((a, b) => a - b)
                        } else {
                          newDurations = currentDurations.filter(d => d !== duration)
                        }
                        
                        handleChange('session_duration_options', newDurations.join(','))
                      }}
                    />
                    <span>{duration} minutes {[60, 90].includes(duration) ? '(recommended)' : ''}</span>
                  </label>
                )
              })}
            </div>
            <p className="setting-description">Available durations for booking sessions</p>
          </div>

          <div className="setting-item">
            <label className="setting-label">Can users book consecutive time slots?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  checked={settings.allow_consecutive_bookings === true || settings.allow_consecutive_bookings === 1}
                  onChange={() => handleChange('allow_consecutive_bookings', true)}
                />
                <span>Yes</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  checked={settings.allow_consecutive_bookings === false || settings.allow_consecutive_bookings === 0}
                  onChange={() => handleChange('allow_consecutive_bookings', false)}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">Show Day View</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  checked={settings.show_day_view === true || settings.show_day_view === 1}
                  onChange={() => handleChange('show_day_view', true)}
                />
                <span>Yes</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  checked={settings.show_day_view === false || settings.show_day_view === 0}
                  onChange={() => handleChange('show_day_view', false)}
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Booking Rules Section */}
        <div className="settings-section">
          <h3 className="settings-section-title">Booking Rules</h3>
          
          <div className="setting-item">
            <label className="setting-label">How many days ahead can members book?</label>
            <select
              className="setting-select"
              value={settings.days_ahead_booking}
              onChange={(e) => handleChange('days_ahead_booking', parseInt(e.target.value))}
            >
              <option value="3">3 Days</option>
              <option value="4">4 Days</option>
              <option value="5">5 Days</option>
              <option value="6">6 Days</option>
              <option value="7">7 Days (recommended)</option>
              <option value="14">14 Days</option>
              <option value="30">A Month</option>
            </select>
          </div>

          <div className="setting-item">
            <label className="setting-label">Open Next Day Bookings At</label>
            <select
              className="setting-select"
              value={settings.next_day_opens_at}
              onChange={(e) => handleChange('next_day_opens_at', e.target.value)}
            >
              <option value="00:00:00">12:00 AM (midnight) - recommended</option>
              <option value="12:00:00">12:00 PM (noon)</option>
            </select>
          </div>
        </div>

        {/* Operating Hours Section */}
        <div className="settings-section">
          <h3 className="settings-section-title">Operating Hours</h3>
          
          <div className="setting-row">
            <div className="setting-item">
              <label className="setting-label">Spring/Summer Opening Time</label>
              <input
                type="time"
                className="setting-input"
                value={settings.spring_summer_open?.substring(0, 5) || '06:00'}
                onChange={(e) => handleChange('spring_summer_open', e.target.value + ':00')}
              />
            </div>

            <div className="setting-item">
              <label className="setting-label">Spring/Summer Closing Time</label>
              <input
                type="time"
                className="setting-input"
                value={settings.spring_summer_close?.substring(0, 5) || '22:00'}
                onChange={(e) => handleChange('spring_summer_close', e.target.value + ':00')}
              />
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-item">
              <label className="setting-label">Autumn/Winter Opening Time</label>
              <input
                type="time"
                className="setting-input"
                value={settings.autumn_winter_open?.substring(0, 5) || '07:00'}
                onChange={(e) => handleChange('autumn_winter_open', e.target.value + ':00')}
              />
            </div>

            <div className="setting-item">
              <label className="setting-label">Autumn/Winter Closing Time</label>
              <input
                type="time"
                className="setting-input"
                value={settings.autumn_winter_close?.substring(0, 5) || '20:00'}
                onChange={(e) => handleChange('autumn_winter_close', e.target.value + ':00')}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings Section */}
        <div className="settings-section">
          <h3 className="settings-section-title">Notification Settings</h3>
          
          <div className="setting-item">
            <label className="setting-label">Send admin booking notifications to:</label>
            <input
              type="email"
              className="setting-input"
              value={settings.admin_booking_notification_email || ''}
              onChange={(e) => handleChange('admin_booking_notification_email', e.target.value)}
              placeholder="admin@example.com"
            />
            <p className="setting-description">Email address to receive booking notifications</p>
          </div>

          <div className="setting-item">
            <label className="setting-label">Send admin guest booking email to:</label>
            <input
              type="email"
              className="setting-input"
              value={settings.admin_guest_booking_email || ''}
              onChange={(e) => handleChange('admin_guest_booking_email', e.target.value)}
              placeholder="guestbookings@example.com"
            />
            <p className="setting-description">Email address to receive guest booking requests</p>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button 
          className="btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
