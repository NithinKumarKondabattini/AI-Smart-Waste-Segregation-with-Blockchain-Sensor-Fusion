import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WasteDataContext } from "../context/WasteDataContext";

const wasteOptions = [
  "Hard Plastic",
  "Glass",
  "Biodegradable",
  "Wood & Metals",
];

const areaOptions = ["Malviya Nagar", "Rohini", "Civil Lines", "Dwarka"];

export default function UserInteractionPage() {
  const navigate = useNavigate();
  const { addSubmission, submissions } = useContext(WasteDataContext);
  const [formData, setFormData] = useState({
    userId: "",
    wasteType: "Hard Plastic",
    weight: "",
    area: "Malviya Nagar",
    imageName: "",
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0]?.name || "" : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    addSubmission({
      ...formData,
      imageName: formData.imageName || "No image uploaded",
    });

    navigate("/", { replace: true });
  };

  return (
    <main className="interaction-page">
      <section className="interaction-layout with-sidebar">
        <aside className="waste-sidebar">
          <div className="sidebar-top">
            <button
              className="sidebar-menu"
              type="button"
              aria-label="Go to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span />
              <span />
              <span />
            </button>
            <div className="sidebar-brand">♻</div>
          </div>

          <nav className="sidebar-nav" aria-label="Dashboard navigation">
            <Link className="nav-badge" to="/" aria-label="Home">
              ⌂
            </Link>
            <Link className="nav-badge active" to="/interaction" aria-label="Interaction">
              ＋
            </Link>
            <button
              className="nav-badge"
              type="button"
              aria-label="Recent queue"
              onClick={() =>
                document
                  .getElementById("live-intake-queue")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              ◔
            </button>
            <button
              className="nav-badge"
              type="button"
              aria-label="Form"
              onClick={() =>
                document
                  .getElementById("interaction-form")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              ◉
            </button>
          </nav>

          <div className="sidebar-footer">
            <button
              className="nav-badge"
              type="button"
              aria-label="Back to dashboard"
              onClick={() => navigate("/")}
            >
              ⚙
            </button>
            <button
              className="nav-badge"
              type="button"
              aria-label="Submit entry"
              onClick={() =>
                document
                  .getElementById("interaction-form")
                  ?.requestSubmit()
              }
            >
              ↪
            </button>
          </div>
        </aside>

        <div className="interaction-panel">
          <span className="pill">User Interaction Page</span>
          <h1>Capture waste data before dashboard processing.</h1>
          <p>
            Collect user ID or QR scan details, waste type, weight, and an
            optional image. After submission, the system redirects directly to
            the main dashboard with updated analytics.
          </p>

          <form
            className="interaction-form"
            id="interaction-form"
            onSubmit={handleSubmit}
          >
            <label>
              <span>User ID / QR Scan</span>
              <input
                type="text"
                name="userId"
                placeholder="QR-DEL-114"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-split">
              <label>
                <span>Waste Type</span>
                <select
                  name="wasteType"
                  value={formData.wasteType}
                  onChange={handleChange}
                >
                  {wasteOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Weight (kg)</span>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  name="weight"
                  placeholder="2.5"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="form-split">
              <label>
                <span>Area</span>
                <select name="area" value={formData.area} onChange={handleChange}>
                  {areaOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Optional Image</span>
                <input type="file" name="imageName" onChange={handleChange} />
              </label>
            </div>

            <div className="interaction-actions">
              <button type="submit">Submit and View Dashboard</button>
              <button type="button" className="ghost-light" onClick={() => navigate("/")}>
                Skip to Dashboard
              </button>
            </div>
          </form>
        </div>

        <aside className="interaction-preview" id="live-intake-queue">
          <div className="preview-card">
            <h2>Live intake queue</h2>
            <p>Recent submissions waiting for classification and analytics.</p>
            <div className="scroll-list">
              {submissions.slice(0, 5).map((item) => (
                <article key={item.id} className="queue-item">
                  <strong>{item.userId}</strong>
                  <span>{item.wasteType}</span>
                  <small>
                    {item.weight} kg in {item.area}
                  </small>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
