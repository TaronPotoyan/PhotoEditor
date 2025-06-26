import {  useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigator = useNavigate();
  const [email, setEmail] = useState<string | null>(() => {
                const data = localStorage.getItem('Picture_editor');
                try {
                    const parsed = data ? JSON.parse(data) : null;
                    return parsed?.email || null;
                } catch {
                    return null;
                }
  });

  const handlerLogout = () => {
        localStorage.removeItem('Picture_editor');
        setEmail('');
        navigator('/');
  }  

  return (
    <header className="header">
      <div className="header-content">
        <span className="header-email">{email}</span>
        <big className="welcome">👋 Welcome to our Picture Editor! 🎨 Unleash your creativity! ✨</big>
        <button className="header-logout" onClick={handlerLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}