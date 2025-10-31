import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { useUser } from '../context/UserContext'
import './OpenActiveAdmin.css'

export function OpenActiveAdmin() {
  const navigate = useNavigate()
  const { globalRole, user, isLoading: authLoading } = useUser()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [clubs, setClubs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  // Only OpenActive users can access
  useEffect(() => {
    // Wait for auth to load before checking permissions
    if (authLoading) {
      return
    }

    // If not authenticated, redirect to login
    if (!user) {
      navigate('/login')
      return
    }

    // Only OpenFarm users can access the admin panel
    const userRoles = user?.roles || [];
    if (!userRoles.includes('openfarm_user')) {
      navigate('/')
      return
    }

    loadDashboardData()
  }, [globalRole, authLoading, user])

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Load farms and users separately so one failure doesn't block the other
      let usersError = null;
      let farmsError = null;
      
      const promises = [
        apiService.getClubs().catch(err => {
          console.error('Failed to load farms:', err)
          farmsError = err;
          return { farms: [], clubs: [] }
        }),
        apiService.getAllUsers().catch(err => {
          console.error('Failed to load users:', err.message || err)
          usersError = err;
          return { users: [] }
        })
      ]
      
      const [clubsResponse, usersResponse] = await Promise.all(promises)
      
      setUsers(usersResponse.users || [])
      setClubs(clubsResponse.farms || clubsResponse.clubs || [])
      
      // Show error message if there was an issue
      if (usersError) {
        setError(`Failed to load users: ${usersError.message || 'Check console for details'}`)
      } else if (farmsError) {
        setError(`Failed to load farms: ${farmsError.message || 'Check console for details'}`)
      } else {
        setError('') // Clear any previous errors
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="admin-layout">
        <div className="loading-container" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Only OpenFarm users can access the admin panel
  const userRoles = user?.roles || [];
  if (!userRoles.includes('openfarm_user')) {
    return null
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isSidebarCollapsed && (
            <div className="sidebar-brand">
              <h2>Open Farm</h2>
              <span className="sidebar-subtitle">System Admin</span>
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
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            title="All Users"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {!isSidebarCollapsed && <span>All Users</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === 'clubs' ? 'active' : ''}`}
            onClick={() => setActiveTab('clubs')}
            title="All Farms"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            {!isSidebarCollapsed && <span>All Farms</span>}
          </button>

          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            title="Analytics"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            {!isSidebarCollapsed && <span>Analytics</span>}
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
            <div className="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
            {!isSidebarCollapsed && (
              <div className="user-details">
                <div className="user-name">{user?.name || 'Admin'}</div>
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
              {activeTab === 'users' && <AllUsersTab users={users} onRefresh={loadDashboardData} />}
              {activeTab === 'clubs' && <AllClubsTab clubs={clubs} onRefresh={loadDashboardData} navigate={navigate} />}
              {activeTab === 'analytics' && <AnalyticsTab users={users} clubs={clubs} />}
              {activeTab === 'settings' && <SettingsTab />}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function AllUsersTab({ users, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUserId, setEditingUserId] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'openfarm_user': return 'role-badge role-admin'
      case 'owner': return 'role-badge role-owner'
      case 'manager': return 'role-badge role-manager'
      case 'member': return 'role-badge role-member'
      default: return 'role-badge'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleRoleChange = async (userId, newRole) => {
    setIsUpdating(true)
    try {
      await apiService.assignUserRole(userId, newRole)
      await onRefresh()
      setEditingUserId(null)
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Failed to update user role: ' + error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h1>Users</h1>
          <p className="section-subtitle">{users.length} total users registered</p>
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
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Global Role</th>
                <th>Farms</th>
                <th>Registered</th>
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
                  <td className="user-phone">N/A</td>
                  <td>
                    {editingUserId === user.id ? (
                      <select 
                        className="role-select"
                        defaultValue={user.role || user.roles?.[0] || 'member'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={isUpdating}
                      >
                        <option value="openfarm_user">OpenFarm User</option>
                        <option value="owner">Owner</option>
                        <option value="manager">Manager</option>
                      </select>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={getRoleBadgeClass(user.role || 'member')}>
                          {(user.role || 'member').replace('_', ' ')}
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
                  <td className="user-clubs">
                    {user.farms && user.farms.length > 0 ? (
                      <div className="clubs-list">
                        {user.farms.map((farm, idx) => (
                          <span key={idx} className="club-tag">
                            {farm.farmName} <span className="club-role">({farm.role})</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-clubs">—</span>
                    )}
                  </td>
                  <td className="date-cell">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AllClubsTab({ clubs, onRefresh, navigate }) {
  const [searchTerm, setSearchTerm] = useState('')

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredClubs = clubs.filter(farm => 
    farm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h1>Farms</h1>
          <p className="section-subtitle">{clubs.length} farms registered</p>
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
            placeholder="Search farms..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredClubs.length === 0 ? (
        <div className="empty-state">
          <p>No farms found.</p>
        </div>
      ) : (
        <div className="clubs-grid">
          {filteredClubs.map((farm) => {
            // Generate slug from farm name for navigation
            const slug = (farm.name || '')
              .toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '') || farm.id;
            
            return (
            <div key={farm.id} className="club-card">
              <div className="club-card-header">
                <h3>{farm.name}</h3>
              </div>
              <div className="club-details">
                <div className="detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{farm.location || 'N/A'}</span>
                </div>
                {farm.hectares && (
                  <div className="detail-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                    <span>{farm.hectares} hectares</span>
                  </div>
                )}
                {farm.financial_year_start && (
                  <div className="detail-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>FY Start: {new Date(farm.financial_year_start).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Created {formatDate(farm.created_at)}</span>
                </div>
              </div>
              <button 
                className="btn-secondary btn-block"
                onClick={() => navigate(`/club/${slug}/admin`)}
              >
                Manage Farm →
              </button>
            </div>
          )})}
        </div>
      )}
    </div>
  )
}

function AnalyticsTab({ users, clubs }) {
  const stats = {
    totalUsers: users.length,
    totalFarms: clubs.length,
    activeFarms: clubs.filter(c => c.is_active).length,
    openFarmUsers: users.filter(u => u.roles?.includes('openfarm_user')).length,
    owners: users.filter(u => u.roles?.includes('owner')).length,
    managers: users.filter(u => u.roles?.includes('manager')).length,
    members: users.filter(u => u.role === 'member').length,
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h1>Analytics</h1>
          <p className="section-subtitle">System-wide statistics and insights</p>
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
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalFarms}</h3>
            <p>Total Farms</p>
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
            <h3>{stats.openFarmUsers}</h3>
            <p>OpenFarm Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.owners}</h3>
            <p>Owners</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.managers}</h3>
            <p>Managers</p>
          </div>
        </div>
      </div>

      <div className="chart-placeholder">
        <p>📊 Charts and detailed analytics coming soon...</p>
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h1>Settings</h1>
          <p className="section-subtitle">System configuration and preferences</p>
        </div>
      </div>

      <div className="settings-placeholder">
        <p>⚙️ System settings coming soon...</p>
      </div>
    </div>
  )
}
