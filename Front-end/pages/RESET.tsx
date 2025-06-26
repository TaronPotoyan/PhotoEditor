import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const APP = import.meta.env.VITE_APP;

export default function Reset() {
  const { key } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage('Passwords do not match.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await axios.patch(`${APP}/users/${key}`, { password });

      setMessage(response.data.message || 'Password reset response received.');
      setIsSuccess(response.data.bool ?? false);
      navigate('/')
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Server error. Try again later.');
      setIsSuccess(false);
    }
  };

  return (
    <>
      {message && (
        <span className="reset-message">
          <big style={{ color: isSuccess ? 'green' : 'red' }}>{message}</big>
        </span>
      )}

      <div className="container">
        <form className="Login" onSubmit={handleSubmit}>
          <h2>Set New Password</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage('');
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="confirm">Confirm Password</label>
            <input
              type="password"
              id="confirm"
              name="confirm"
              required
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button type="submit" style={{ marginTop: "1rem" }}>
            Reset Password
          </button>
        </form>
      </div>
    </>
  );
}
