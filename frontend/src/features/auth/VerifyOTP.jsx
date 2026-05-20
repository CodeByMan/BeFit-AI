import { useState } from 'react';
import API from '../../api/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import useDynamicCSS from "../../hooks/useDynamicCSS";

export default function VerifyOTP() {
  useDynamicCSS("/src/assets/vendor/css/core.css");
  useDynamicCSS("/src/assets/vendor/css/theme-default.css");
  useDynamicCSS("/src/assets/css/demo.css");
  useDynamicCSS("/src/assets/vendor/css/pages/page-auth.css");
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/verify-otp', { userId, otp });
      setMessage('Account verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
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

              <h4 className="mb-2">Verify OTP 🔑</h4>
              <p className="mb-3">Enter the OTP sent to your email to verify your account.</p>

              {message && <p className="text-success">{message}</p>}
              {error && <p className="text-danger">{error}</p>}

              <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                  <label className="form-label">OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-danger d-grid w-100" type="submit">
                  {loading ? 'Verifying...' : 'Verify OTP'}
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
