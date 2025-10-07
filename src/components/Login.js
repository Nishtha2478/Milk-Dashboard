import { useState } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles'; // import the JS styles object

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h2>Milk Dashboard</h2>
        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', marginTop: '0.25rem' }}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc', marginTop: '0.25rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.loginButton,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = styles.loginButtonHover.backgroundColor)}
            onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = styles.loginButton.backgroundColor)}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  );
}
