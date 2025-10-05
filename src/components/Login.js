import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    onLogin(data.user);
  };

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <form 
        onSubmit={handleLogin} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 40,
          borderRadius: 8,
          backgroundColor: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minWidth: 300,
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: 30 }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 10,
            marginBottom: 15,
            borderRadius: 4,
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: 10,
            marginBottom: 20,
            borderRadius: 4,
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 4,
            border: 'none',
            backgroundColor: '#1976d2',
            color: '#fff',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 10,
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && (
          <p style={{ color: 'red', marginTop: 10, fontWeight: 'bold' }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
