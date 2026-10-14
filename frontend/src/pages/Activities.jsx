import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
  Compass,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Activities() {
  const { student, isAuthenticated } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    if (!isAuthenticated || !student?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.registrations.getByStudent(student.id);
      setRegistrations(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load your registered activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [isAuthenticated, student?.id]);

  if (!isAuthenticated) {
    return (
      <div className="state-container">
        <CalendarCheck size={40} className="text-purple" />
        <h2>Sign in to view your activities</h2>
        <p>Your registered events and campus activity records are saved to your student profile.</p>
        <Link to="/login" className="welcome-button">
          Sign in
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <div className="page-header">
        <span className="page-eyebrow">STUDENT PORTAL</span>
        <h1>My Activities</h1>
        <p>Track all campus events, workshops, and competitions you are registered for.</p>
      </div>

      {loading ? (
        <div className="state-container">
          <Loader2 size={32} className="spin text-purple" />
          <p>Loading your registrations...</p>
        </div>
      ) : error ? (
        <div className="state-container error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button type="button" className="retry-button" onClick={fetchActivities}>
            Try Again
          </button>
        </div>
      ) : registrations.length === 0 ? (
        <div className="state-container empty">
          <CalendarDays size={40} />
          <h3>No registered activities yet</h3>
          <p>You haven't signed up for any events yet. Explore upcoming campus events to get started!</p>
          <Link to="/discover" className="welcome-button">
            <Compass size={16} /> Explore Events
          </Link>
        </div>
      ) : (
        <div className="activities-list">
          <div className="activities-count-badge">
            <CheckCircle2 size={16} />
            <span>{registrations.length} Registered {registrations.length === 1 ? "Activity" : "Activities"}</span>
          </div>

          <div className="activities-grid">
            {registrations.map((reg) => {
              const event = reg.event || {};

              return (
                <div className="activity-card" key={reg.id}>
                  <div className="activity-card-header">
                    <span className="event-category">{event.category || "Event"}</span>
                    <span className="registration-status-pill">
                      <CheckCircle2 size={12} />
                      Registered
                    </span>
                  </div>

                  <h3>{event.title || "Campus Event"}</h3>
                  <p className="activity-desc">{event.description}</p>

                  <div className="activity-meta">
                    <span>
                      <CalendarDays size={14} />
                      Event Date: <strong>{event.date || "TBA"}</strong>
                    </span>
                    <span>
                      <Clock3 size={14} />
                      Time: <strong>{event.time || "TBA"}</strong>
                    </span>
                    <span>
                      <MapPin size={14} />
                      Venue: <strong>{event.venue || "Campus"}</strong>
                    </span>
                  </div>

                  <div className="activity-footer">
                    <span className="registered-on-label">
                      Registered on: {reg.registrationDate || "Recently"}
                    </span>
                    {event.id && (
                      <Link to={`/events/${event.id}`} className="view-event-link">
                        View details
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
