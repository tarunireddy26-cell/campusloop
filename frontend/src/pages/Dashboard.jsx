import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Award,
  Users,
  Clock3,
  MapPin,
  BookOpen,
  PackageSearch,
  ChevronRight,
  ArrowRight,
  Loader2,
  Tag
} from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { student, isAuthenticated } = useAuth();

  const [events, setEvents] = useState([]);
  const [activitiesCount, setActivitiesCount] = useState(null);
  const [certificatesCount, setCertificatesCount] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      setError("");

      try {
        const eventsRes = await api.events.getAll();
        if (isMounted) setEvents(eventsRes.data || []);

        if (isAuthenticated && student?.id) {
          try {
            const [actsRes, certsRes] = await Promise.all([
              api.registrations.getByStudent(student.id),
              api.certificates.getByStudent(student.id)
            ]);
            if (isMounted) {
              setActivitiesCount(actsRes.data?.length ?? 0);
              setCertificatesCount(certsRes.data?.length ?? 0);
            }
          } catch (err) {
            console.warn("Could not load user stats", err);
          }
        }

        try {
          const lostRes = await api.lostFound.getAll();
          if (isMounted) setLostItems((lostRes.data || []).slice(0, 4));
        } catch (err) {
          console.warn("Could not load lost items", err);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        if (isMounted) setError("Unable to load campus events. Please make sure the server is running.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, student?.id]);

  const upcomingEvents = events.slice(0, 3);

  const formatEventDate = (dateString) => {
    if (!dateString) return { day: "—", month: "" };
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return { day: dateString, month: "" };
      return {
        day: d.getDate(),
        month: d.toLocaleString("en", { month: "short" }).toUpperCase()
      };
    } catch {
      return { day: dateString, month: "" };
    }
  };

  return (
    <div className="dashboard">
      <section className="welcome-card">
        <div className="welcome-content">
          <span className="welcome-label">
            {isAuthenticated ? `WELCOME BACK, ${student?.name?.toUpperCase()}` : "WELCOME TO CAMPUSLOOP"}
          </span>
          <h1>
            Make the most of
            <br />
            your campus life.
          </h1>
          <p>
            Discover what's happening around you and keep track of everything you take part in.
          </p>
          <Link to="/discover" className="welcome-button">
            Explore events
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="welcome-shapes">
          <div />
          <div />
          <div />
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <CalendarDays size={18} />
          </div>
          <div>
            <span>Activities joined</span>
            <strong>{activitiesCount !== null ? activitiesCount : (isAuthenticated ? "0" : "—")}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Award size={18} />
          </div>
          <div>
            <span>Certificates</span>
            <strong>{certificatesCount !== null ? certificatesCount : (isAuthenticated ? "0" : "—")}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Users size={18} />
          </div>
          <div>
            <span>Events available</span>
            <strong>{events.length}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span>STAY INVOLVED</span>
            <h2>Upcoming events</h2>
          </div>
          <Link to="/discover">
            View all
            <ChevronRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader2 size={24} className="spin" />
            <p>Loading events from database...</p>
          </div>
        ) : error ? (
          <div className="error-card">
            <p>{error}</p>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="empty-card">
            <p>No upcoming events available right now.</p>
          </div>
        ) : (
          <div className="events-grid">
            {upcomingEvents.map((event, idx) => {
              const { day, month } = formatEventDate(event.date);
              const colorClass = idx % 3 === 0 ? "purple" : idx % 3 === 1 ? "blue" : "orange";

              return (
                <Link
                  to={`/events/${event.id}`}
                  className="event-card"
                  key={event.id}
                >
                  <div className={`event-date ${colorClass}`}>
                    <strong>{day}</strong>
                    <span>{month}</span>
                  </div>

                  <div className="event-info">
                    <span className="event-category">
                      {event.category || "Campus Event"}
                    </span>
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <span>
                        <Clock3 size={13} />
                        {event.time || "TBA"}
                      </span>
                      <span>
                        <MapPin size={13} />
                        {event.venue || "Campus"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="dashboard-bottom">
        <div className="quick-card">
          <div className="section-heading">
            <div>
              <span>QUICK ACCESS</span>
              <h2>What do you need?</h2>
            </div>
          </div>

          <div className="quick-grid">
            <Link to="/library" className="quick-item">
              <div className="quick-icon blue">
                <BookOpen size={18} />
              </div>
              <div>
                <strong>Library</strong>
                <span>Find and reserve books</span>
              </div>
              <ChevronRight size={15} />
            </Link>

            <Link to="/lost-found" className="quick-item">
              <div className="quick-icon orange">
                <PackageSearch size={18} />
              </div>
              <div>
                <strong>Lost &amp; Found</strong>
                <span>Browse found items</span>
              </div>
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        <div className="certificate-preview">
          <div className="certificate-top">
            <div>
              <span>YOUR ACHIEVEMENTS</span>
              <h2>Certificate wallet</h2>
            </div>
            <Award size={21} />
          </div>

          <div className="certificate-count">
            <strong>{certificatesCount !== null ? certificatesCount : "—"}</strong>
            <span>certificates earned</span>
          </div>

          <Link to="/certificates">
            View certificates
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="lost-preview">
        <div className="section-heading">
          <div>
            <span>CAMPUS</span>
            <h2>Lost &amp; Found</h2>
          </div>
          <Link to="/lost-found">
            View all
            <ChevronRight size={15} />
          </Link>
        </div>

        {lostItems.length === 0 ? (
          <div className="lost-items-empty">
            <p>No items reported lost or found recently.</p>
            <Link to="/lost-found" className="text-link">Report a found item</Link>
          </div>
        ) : (
          <div className="lost-items">
            {lostItems.map((item) => (
              <div className="lost-item" key={item.id}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.itemName} className="lost-thumb" />
                ) : (
                  <div className="lost-placeholder">
                    <PackageSearch size={20} />
                  </div>
                )}
                <div>
                  <strong>{item.itemName}</strong>
                  <span>
                    <MapPin size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />
                    {item.locationFound || "Campus"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
