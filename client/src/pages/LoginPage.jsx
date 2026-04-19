import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div className="auth-copy">
          <span className="pill">AI Smart Waste Segregation</span>
          <h1>Access the waste intelligence dashboard securely.</h1>
          <p>
            Sign in with your email and password. The Node.js API validates your
            account in MongoDB, verifies the password with bcrypt, and keeps
            your session active using JWT.
          </p>
          <div className="auth-feature-list">
            <div>
              <strong>Secure auth</strong>
              <span>Bcrypt password verification and JWT session flow</span>
            </div>
            <div>
              <strong>Protected access</strong>
              <span>Your dashboard only opens after valid credentials</span>
            </div>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="card-heading">
            <h2>Welcome back</h2>
            <p>Login to continue to AI Smart Waste Segregation with Blockchain & Sensor Fusion.</p>
          </div>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="authority@smartwaste.ai"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <div className="error-text">{error}</div> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          <span className="form-switch">
            New member? <Link to="/register">Create an account</Link>
          </span>
        </form>
      </section>
    </div>
  );
}
