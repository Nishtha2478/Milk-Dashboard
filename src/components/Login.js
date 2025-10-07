import { useState } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles';

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

    if (error) setError(error.message);
    else onLogin(data.user);
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <h2>Milk Dashboard</h2>
        <form onSubmit={handleLogin}>
          <div className="formGroup">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              className="formInput"
            />
          </div>

          <div className="formGroup">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              className="formInput"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.loginButton,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.backgroundColor = styles.loginButtonHover.backgroundColor)}
            onMouseOut={e => !loading && (e.currentTarget.style.backgroundColor = styles.loginButton.backgroundColor)}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p className="errorMessage">{error}</p>}
      </div>
    </div>
  );
}
