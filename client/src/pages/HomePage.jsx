import { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { WasteDataContext } from "../context/WasteDataContext";

const cardMeta = [
  { title: "Hard Plastic", growth: "+76%", icon: "P" },
  { title: "Glass", growth: "+76%", icon: "G" },
  { title: "Biodegradable", growth: "+26%", icon: "B" },
  { title: "Wood & Metals", growth: "+76%", icon: "M" },
];

const areaNames = ["Malviya Nagar", "Rohini", "Civil Lines"];

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);
  const { submissions, metrics } = useContext(WasteDataContext);
  const navigate = useNavigate();

  const summaryCards = cardMeta.map((item) => ({
    ...item,
    tons: `${Math.round(metrics.totals[item.title])} tons`,
  }));

  const areaCards = useMemo(
    () =>
      areaNames.map((area) => {
        const areaData = submissions.filter((item) => item.area === area);
        const total = areaData.reduce((sum, item) => sum + item.weight, 0) || 1;
        const byType = (type) =>
          Math.round(
            (areaData
              .filter((item) => item.wasteType === type)
              .reduce((sum, item) => sum + item.weight, 0) /
              total) *
              100
          ) || 0;

        return {
          area,
          plastic: byType("Hard Plastic"),
          glass: byType("Glass"),
          bio: byType("Biodegradable"),
          metal: byType("Wood & Metals"),
        };
      }),
    [submissions]
  );

  const performanceRows = submissions.slice(0, 6).map((item, index) => [
    item.area,
    `Team ${index + 1}`,
    420 + index * 4,
    item.timestamp,
  ]);

  const exportCsv = () => {
    const rows = [
      ["Submission ID", "User ID", "Waste Type", "Weight", "Area", "Image", "Timestamp"],
      ...submissions.map((item) => [
        item.id,
        item.userId,
        item.wasteType,
        item.weight,
        item.area,
        item.imageName,
        item.timestamp,
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smart-waste-dashboard-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="dashboard-page waste-theme">
      <aside className="waste-sidebar">
        <div className="sidebar-top">
          <button
            className="sidebar-menu"
            type="button"
            aria-label="Go to dashboard top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="sidebar-brand">♻</div>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          <Link className="nav-badge active" to="/" aria-label="Home">
            ⌂
          </Link>
          <Link className="nav-badge" to="/interaction" aria-label="Interaction">
            ＋
          </Link>
          <button
            className="nav-badge"
            type="button"
            aria-label="Analytics"
            onClick={() =>
              document
                .getElementById("area-distribution")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            ◔
          </button>
          <button
            className="nav-badge"
            type="button"
            aria-label="Live feed"
            onClick={() =>
              document
                .getElementById("live-intake-feed")
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
            aria-label="Settings"
            onClick={() => navigate("/interaction")}
          >
            ⚙
          </button>
          <button
            className="nav-badge"
            type="button"
            onClick={logout}
            aria-label="Logout"
          >
            ↪
          </button>
        </div>
      </aside>

      <section className="waste-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow waste-eyebrow">
              Manage and track your dispose
            </p>
            <h1>Garbage Dashboard</h1>
            <p className="dashboard-subcopy">
              Smart Waste Management Dashboard designed for real-time
              monitoring, analytics, and control over waste collection,
              classification, and recycling activities.
            </p>
          </div>

          <div className="header-actions">
            <div className="user-chip">
              <span>Signed in</span>
              <strong>{user?.name || "Authority User"}</strong>
            </div>
            <Link className="export-button secondary" to="/interaction">
              Add Waste Entry
            </Link>
            <button className="export-button" onClick={exportCsv} type="button">
              Export CSV
            </button>
          </div>
        </header>

        <section className="waste-stats-grid">
          {summaryCards.map((card) => (
            <article key={card.title} className="waste-stat-card">
              <div className="stat-topline">
                <div className="stat-icon">{card.icon}</div>
                <span>{card.title}</span>
              </div>
              <div className="stat-bottomline">
                <strong>{card.tons}</strong>
                <p>
                  <span>{card.growth}</span>
                  last period
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="waste-panels-grid">
          <article className="waste-panel">
            <div className="panel-heading">
              <div>
                <h3>Pie Distribution</h3>
                <p>Percentage wise Distribution of waste</p>
              </div>
            </div>

            <div className="pie-chart-shell">
              <div className="pie-chart-ring" />
            </div>

            <div className="legend-grid">
              <div className="legend-item">
                <span className="legend-dot legend-dark" />
                <div>
                  <strong>Woods and Metals</strong>
                  <small>26%</small>
                </div>
              </div>
              <div className="legend-item">
                <span className="legend-dot legend-mid" />
                <div>
                  <strong>Biograde</strong>
                  <small>8%</small>
                </div>
              </div>
              <div className="legend-item">
                <span className="legend-dot legend-light" />
                <div>
                  <strong>Hard Plastic</strong>
                  <small>60%</small>
                </div>
              </div>
              <div className="legend-item">
                <span className="legend-dot legend-soft" />
                <div>
                  <strong>Glass</strong>
                  <small>6%</small>
                </div>
              </div>
            </div>
          </article>

          <article className="waste-panel">
            <div className="panel-heading">
              <div>
                <h3>Recycled material</h3>
                <p>Live updates after every submission and validation cycle</p>
              </div>
            </div>

            <div className="radial-progress-shell">
              <div className="radial-progress">
                <div className="radial-progress-inner">
                  <strong>48%</strong>
                  <span>from yesterday</span>
                  <button type="button">Detail</button>
                </div>
              </div>
            </div>

            <div className="mini-legend">
              <span>
                <i className="legend-dot legend-dark" />
                Today
              </span>
              <span>
                <i className="legend-dot legend-soft" />
                Yesterday
              </span>
            </div>
          </article>

          <article className="waste-panel wide-panel" id="area-distribution">
            <div className="panel-heading">
              <div>
                <h3>Area Distribution</h3>
                <p>Scrollable locality performance with dynamic waste shares</p>
              </div>
              <button className="text-button" type="button">
                View all
              </button>
            </div>

            <div className="area-card-list scroll-list">
              {areaCards.map((area) => (
                <article key={area.area} className="area-card">
                  <h4>{area.area}</h4>
                  <p>
                    Real-time locality performance based on the latest bin
                    submissions and verified collection updates.
                  </p>
                  <div className="area-metrics">
                    <div>
                      <span>Wood & Metals</span>
                      <strong>{area.metal}%</strong>
                    </div>
                    <div>
                      <span>Biograde</span>
                      <strong>{area.bio}%</strong>
                    </div>
                    <div>
                      <span>Hard Plastic</span>
                      <strong>{area.plastic}%</strong>
                    </div>
                    <div>
                      <span>Glass</span>
                      <strong>{area.glass}%</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="waste-panels-grid bottom-row">
          <article className="waste-panel wide-panel">
            <div className="panel-heading">
              <div>
                <h3>Performance List</h3>
                <p>Tracks team performance, audit history, and activity logs</p>
              </div>
              <button className="text-button" type="button">
                View all
              </button>
            </div>

            <div className="table-shell">
              <table>
                <thead>
                  <tr>
                    <th>Area Name</th>
                    <th>Team</th>
                    <th>Score</th>
                    <th>Audited Date</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceRows.map((row) => (
                    <tr key={row.join("-")}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="waste-panel" id="live-intake-feed">
            <div className="panel-heading">
              <div>
                <h3>Live Intake Feed</h3>
                <p>
                  {metrics.totalSubmissions} total submissions and {metrics.totalWeightKg.toFixed(1)} kg captured
                </p>
              </div>
            </div>

            <div className="scroll-list">
              {submissions.map((item) => (
                <article key={item.id} className="queue-item">
                  <strong>{item.userId}</strong>
                  <span>{item.wasteType}</span>
                  <small>
                    {item.weight} kg · {item.area}
                  </small>
                </article>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
