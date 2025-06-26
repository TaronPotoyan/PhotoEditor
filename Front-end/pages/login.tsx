import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ email: '', password: '' });

  const togglePassword = () => setShowPassword(prev => !prev);

  const handleReset = useCallback(() => {
    navigate('/forgot-password');
  }, [navigate]);

  const handleCreate = useCallback(async () => {
    if (!user.email || !user.password) {
      alert('Please enter both email and password to create an account.');
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_APP + '/users',
        { email: user.email, password: user.password }
      );
      alert(response.data.message || 'Account created successfully');
    } catch (error: any) {
      console.error('Create error:', error);
      alert(error.response?.data?.message || error.message || 'Account creation failed');
    }
  }, [user]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      alert('Please enter both email and password to log in.');
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_APP + '/users/spec',
        { email: user.email, password: user.password }
      );

      if (!response.data.bool) {
        alert(response.data.message || 'Invalid login');
        return;
      }

      localStorage.setItem('Picture_editor', JSON.stringify({ email: user.email }));
      navigate('/home');
    } catch (e: any) {
      alert(e.response?.data?.message || e.message || 'Login failed');
    }
  }, [user, navigate]);

  return (
    <div className="container">
      <form className="Login" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />

        <label htmlFor="password">Password:</label>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={user.password}
            style={{ width: '100%', paddingRight: '2.5em' }}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
          <span
            onClick={togglePassword}
            style={{
              position: 'absolute',
              right: '0.7em',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              userSelect: 'none',
              fontSize: '1.3em',
              color: '#888'
            }}
            tabIndex={0}
            role="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>Login</button>

        <button type="button" onClick={handleReset} style={{ marginTop: '0.5rem' }}>
          Reset Password
        </button>

        <button type="button" onClick={handleCreate} style={{ marginTop: '0.5rem' }}>
          Create Account
        </button>
      </form>
    </div>
  );
}
