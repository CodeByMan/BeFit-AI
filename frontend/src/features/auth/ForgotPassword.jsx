import { useState, useEffect, useRef } from 'react';
import API from '../../api/Api';
import useDynamicCSS from "../../hooks/useDynamicCSS";

export default function ForgotPassword() {
  useDynamicCSS("/src/assets/vendor/css/core.css");
  useDynamicCSS("/src/assets/vendor/css/theme-default.css");
  useDynamicCSS("/src/assets/css/demo.css");
  useDynamicCSS("/src/assets/vendor/css/pages/page-auth.css"); 
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds until next resend
  const cooldownRef = useRef(null);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownRef.current);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message);

      // start 1-minute cooldown
      setCooldown(60);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Request failed';
      setError(errMsg);

      // if backend tells user to wait, extract time from message
      const match = errMsg.match(/Please wait (\d+) seconds/);
      if (match) setCooldown(parseInt(match[1], 10));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl" style={{ backgroundColor: "hsla(12, 80%, 52%, 1.00)" }}>
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">

              <div className="app-brand justify-content-center mb-3">
                <a href="/" className="app-brand-link gap-2">
                  <span className="app-brand-logo demo"></span>
                  <span className="app-brand-text demo text-body fw-bolder">BeFit</span>
                </a>
              </div>

              <h4 className="mb-2">Forgot Password? 🔒</h4>
              <p className="mb-3">Enter your email to receive reset instructions.</p>

              {message && <p className="text-success">{message}</p>}
              {error && <p className="text-danger">{error}</p>}

              <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-danger d-grid w-100" type="submit" disabled={cooldown > 0}>
                  {loading ? 'Sending...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Send Reset Link'}
                </button>
              </form>

              <div className="text-center">
                <a href="/login" className="text-danger fw-bold">
                  ← Back to Login
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
