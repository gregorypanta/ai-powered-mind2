import React from 'react';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif',
      backgroundColor: '#0f172a',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>AI Powered Mind 🚀</h1>
      <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
        Το site σου είναι επίσημα online στη Vercel!
      </p>
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        border: '1px solid #334155', 
        borderRadius: '12px',
        backgroundColor: '#1e293b'
      }}>
        <p>Συγχαρητήρια Gregory! Η δομή του project είναι πλέον σωστή.</p>
      </div>
    </div>
  );
}

export default App;
