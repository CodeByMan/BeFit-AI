import { useState } from 'react';
import API from '../../api/Api';
import { useNavigate } from 'react-router-dom';
import useDynamicCSS from "../../hooks/useDynamicCSS";

export default function Login() {
  useDynamicCSS("/src/assets/vendor/css/core.css");
  useDynamicCSS("/src/assets/vendor/css/theme-default.css");
  useDynamicCSS("/src/assets/css/demo.css");
  useDynamicCSS("/src/assets/vendor/css/pages/page-auth.css");
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: 2 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/register', form);
      alert("You'll receive an OTP if your email is valid. Please verify.");
      navigate('/verify-otp', { state: { userId: res.data.userId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl"  style={{ backgroundColor: "hsla(12, 80%, 52%, 1.00)" }}>
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          {/* Register Card */}
          <div className="card">
            <div className="card-body">
              {/* Logo */}
              <div className="app-brand justify-content-center">
                <a href="/" className="app-brand-link gap-2">
                  <span className="app-brand-logo demo">
                    {/* You can embed your SVG here */}
                  </span>
                  <span className="app-brand-text demo text-body fw-bolder">Befit</span>
                </a>
              </div>
              {/* /Logo */}
              {/* <h4 className="mb-2">Adventure starts here 🚀</h4> */}
              <p className="mb-4">Make your app management easy and fun!</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form className="mb-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 form-password-toggle">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group input-group-merge">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
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
                    <input className="form-check-input" type="checkbox" id="terms-conditions" required />
                    <label className="form-check-label" htmlFor="terms-conditions">
                      I agree to <a href="#" className="text-danger">privacy policy & terms</a>
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-danger d-grid w-100">
                  {loading ? 'Registering...' : 'Sign up'}
                </button>
              </form>

              <p className="text-center">
                <span>Already have an account?</span>
                <a href="/login"><span className="text-danger"> Sign in</span></a>
              </p>
            </div>
          </div>
          {/* Register Card */}
        </div>
      </div>
    </div>
  );
}
