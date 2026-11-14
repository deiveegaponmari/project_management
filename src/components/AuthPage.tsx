import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/taskApi';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const result = isLogin
        ? await loginUser({ email, password })
        : await registerUser({ name, email, password });

      localStorage.setItem('taskflow_token', result.token);
      localStorage.setItem('taskflow_user', JSON.stringify(result.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{isLogin ? 'Welcome back' : 'Create account'}</h1>
        <p>{isLogin ? 'Sign in to continue to TaskFlow' : 'Register to manage projects and tasks'}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <label>
              Full name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </label>
          )}

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="primary-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button type="button" className="toggle-link" onClick={() => setIsLogin((prev) => !prev)}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
