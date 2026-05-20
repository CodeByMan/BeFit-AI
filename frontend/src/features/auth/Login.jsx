import { useState } from 'react';
import API from '../../api/Api';
import { useNavigate } from 'react-router-dom';
import useDynamicCSS from "../../hooks/useDynamicCSS";

export default function Login() {
  useDynamicCSS("/src/assets/vendor/css/core.css");
  useDynamicCSS("/src/assets/vendor/css/theme-default.css");
  useDynamicCSS("/src/assets/css/demo.css");
  useDynamicCSS("/src/assets/vendor/css/pages/page-auth.css");

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/login', form);

      // Save token and roleId
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('roleId', res.data.roleId);

      // ---------------------------
      // CHECK PROFILE ONLY FOR USERS (roleId = 2)
      // ---------------------------
      if (res.data.roleId === 2) {
        const profileRes = await API.get('/profile');

        if (!profileRes.data.exists || !profileRes.data.profile.setup_complete) {
          navigate('/profile-setup');
          return;
        }

        // Fetch previous feedback (if exists)
        try {
          const feedbackRes = await API.get('/testimonials'); // { id, message, rating }
          const feedbackData = feedbackRes.data || {};
          localStorage.setItem('userFeedback', JSON.stringify(feedbackData));
          if (feedbackData.id) {
            localStorage.setItem('userFeedbackId', feedbackData.id);
          } else {
            localStorage.removeItem('userFeedbackId');
          }
        } catch (err) {
          console.log('No previous feedback found');
          localStorage.setItem('userFeedback', JSON.stringify({}));
          localStorage.removeItem('userFeedbackId');
        }

        // Reset session flag to show feedback only once per login
        sessionStorage.removeItem('feedbackShown');
      }

      // ---------------------------------------
      // 🔥 IF PROFILE COMPLETED → REDIRECT BY ROLE
      // ---------------------------------------
      if (res.data.roleId === 1) navigate('/admin-dashboard');
      else navigate('/user-dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
              <div className="app-brand justify-content-center">
                <a href="/" className="app-brand-link gap-2">
                  <span className="app-brand-logo demo">{/* Logo */}</span>
                  <span className="app-brand-text demo text-body fw-bolder">BeFit</span>
                </a>
              </div>
              <p className="mb-4">
                Please sign-in to your account and start the adventure
              </p>
              {error && <p className="text-danger">{error}</p>}
              <form className="mb-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email or Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email or username"
                    value={form.email}
                    onChange={handleChange}
                    autoFocus
                    required
                  />
                </div>
                <div className="mb-3 form-password-toggle">
                  <div className="d-flex justify-content-between">
                    <label className="form-label" htmlFor="password">Password</label>
                    <a onClick={() => navigate('/forgot-password')} style={{ cursor: "pointer" }}>
                      <small className="text-danger">Forgot Password?</small>
                    </a>
                  </div>
                  <div className="input-group input-group-merge">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="••••••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="input-group-text cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={showPassword ? "bx bx-show" : "bx bx-hide"}></i>
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember-me" />
                    <label className="form-check-label" htmlFor="remember-me">Remember Me</label>
                  </div>
                </div>
                <div className="mb-3">
                  <button className="btn btn-danger d-grid w-100" type="submit">
                    {loading ? 'Logging in...' : 'Sign in'}
                  </button>
                </div>
              </form>
              <p className="text-center">
                <span>New on our platform?</span>
                <a href="/register"><span className="text-danger"> Create an account</span></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
