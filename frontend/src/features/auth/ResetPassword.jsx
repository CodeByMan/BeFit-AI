import { useState } from 'react';
import API from '../../api/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import useDynamicCSS from "../../hooks/useDynamicCSS";


export default function ResetPassword() {
  useDynamicCSS("/src/assets/vendor/css/core.css");
  useDynamicCSS("/src/assets/vendor/css/theme-default.css");
  useDynamicCSS("/src/assets/css/demo.css");
  useDynamicCSS("/src/assets/vendor/css/pages/page-auth.css");  
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  const token = params.get('token'); // read token from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await API.post('/auth/reset-password', { userId, token, newPassword });
      setMessage(res.data.message + " Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
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

              <h4 className="mb-2">Reset Password 🔒</h4>
              <p className="mb-4">Enter your new password to reset your account.</p>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3 form-password-toggle">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <div className="input-group input-group-merge">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      id="newPassword"
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <span
                      className="input-group-text cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={showPassword ? 'bx bx-show' : 'bx bx-hide'}></i>
                    </span>
                  </div>
                </div>

                <button type="submit" className="btn btn-danger d-grid w-100">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <p className="text-center mt-3">
                <span>Remembered your password?</span>
                <a href="/login"><span className="text-danger"> Sign in</span></a>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
