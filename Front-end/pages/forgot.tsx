import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const APP = import.meta.env.VITE_APP;

console.log(APP);

export default function Forgot() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message , setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            alert('If this email exists, a reset link will be sent.');
            try {
                const response = await axios.patch(APP + '/users', { email });
                setMessage(response.data.message);
                console.log('response' ,response);
                
            } catch (error) {
                console.error(error);
                setMessage('An error occurred. Please try again.');
            }
    };


    return (
        <>
        
        {message && (
            <>
                <span className='reset-message'>
                    <big>{message}</big>
                </span>
            </>)
        }
        <div className="container">
            <form className="Login" onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="reset-email">Email</label>
                    <input
                        type="email"
                        id="reset-email"
                        name="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit">Send Reset Link</button>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    style={{ marginTop: '0.5rem' }}
                >
                    Back to Login
                </button>
            </form>
        </div>
        </>
    );
}