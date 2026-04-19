import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await register(formData.name, formData.email, formData.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div className="auth-copy">
          <span className="pill">Start strong</span>
          <h1>Create your Smart Waste Management account.</h1>
          <p>
            Register with your name, email, and password. Passwords are hashed
            before they are stored in MongoDB.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="card-heading">
            <h2>Create account</h2>
            <p>Set up your secure AI Smart Waste Segregation login in a few seconds.</p>
          </div>

          <label>
            <span>Name</span>
            <input
              type="text"
              name="name"
              placeholder="Alex Johnson"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

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
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <div className="error-text">{error}</div> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Register"}
          </button>

          <span className="form-switch">
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </section>
    </div>
  );
}
