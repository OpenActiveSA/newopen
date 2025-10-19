import React from 'react'

export function SetupMessage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#052333',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>
          🎾 Open Active
        </h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.9)' }}>
          Database Setup Required
        </h2>
        
        <div style={{ 
          background: 'rgba(255, 193, 7, 0.2)', 
          border: '1px solid rgba(255, 193, 7, 0.5)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#ffc107', marginBottom: '1rem' }}>⚠️ Supabase Not Configured</h3>
          <p style={{ marginBottom: '1rem' }}>
            To use the full functionality of Open Active, you need to set up a Supabase database.
          </p>
          <p style={{ marginBottom: '0' }}>
            The app is currently running in demo mode with limited functionality.
          </p>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ color: '#4CAF50', marginBottom: '1rem' }}>🚀 Quick Setup:</h3>
          <ol style={{ lineHeight: '1.6' }}>
            <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF50' }}>supabase.com</a> and create a new project</li>
            <li>Get your project URL and API key from Settings → API</li>
            <li>Create a <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>.env</code> file in your project root</li>
            <li>Add your Supabase credentials to the <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>.env</code> file</li>
            <li>Run the database schema from <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>database/schema.sql</code></li>
            <li>Restart your development server</li>
          </ol>
        </div>

        <div style={{ 
          background: 'rgba(33, 150, 243, 0.2)', 
          border: '1px solid rgba(33, 150, 243, 0.5)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#2196F3', marginBottom: '1rem' }}>📖 Need Help?</h3>
          <p style={{ marginBottom: '0' }}>
            Check the <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>database/README.md</code> file for detailed setup instructions.
          </p>
        </div>

        <div style={{ 
          background: 'rgba(76, 175, 80, 0.2)', 
          border: '1px solid rgba(76, 175, 80, 0.5)',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <h3 style={{ color: '#4CAF50', marginBottom: '1rem' }}>✨ What You'll Get:</h3>
          <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
            <li>Real user authentication and registration</li>
            <li>Club management and membership system</li>
            <li>Court booking functionality</li>
            <li>Role-based permissions</li>
            <li>Real-time data synchronization</li>
            <li>Cross-platform support (web + mobile)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
