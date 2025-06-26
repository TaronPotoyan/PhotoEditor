import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ email: '', password: '' });

  const handleReset = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/forgot-password');
  }, [navigate]);

  const handleCreate = useCallback( async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try{
            const response = await axios.post(import.meta.env.VITE_APP + '/users',{email : user.email , password : user.password});
            console.log('Response' , response);
            alert(response.data.message);
        }catch (error: any) {
          console.error('Create error:', error);
          alert(error.response?.data?.message || error.message || 'Account creation failed');
        }

        return
  }, [navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await axios.post(import.meta.env.VITE_APP + '/users/spec', {
            email: user.email,
            password: user.password
        });
        if (!response.data.bool) {
            alert (response.data.message)
            navigate('/');
        }        
        localStorage.setItem('Picture_editor', JSON.stringify({email : user.email}));
        navigate('/home')
    } catch (e: any) {
        alert(e.response?.data?.message || e.message || 'Login failed');
    }
  }, [user]);

  const togglePassword = () => setShowPassword(prev => !prev);

  return (
    <div className="container">
      <form className="Login" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <label htmlFor="password">Password:</label>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            style={{ width: '100%', paddingRight: '2.5em' }}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
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

        <button type="submit">Login</button>

        <button type="button" onClick={handleReset} style={{ marginTop: '1rem' }}>
          Reset Password
        </button>

        <button type="button" onClick={handleCreate} style={{ marginTop: '0.5rem' }}>
          Create Account
        </button>
      </form>
    </div>
  );
}
