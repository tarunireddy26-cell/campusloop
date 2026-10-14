import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock3,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Share2,
  Sparkles
} from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadEventData() {
      setLoading(true);
      setError("");

      try {
        const response = await api.events.getById(id);
        if (!isMounted) return;
        setEvent(response.data);

        // Check registration status if student is logged in
        if (isAuthenticated && student?.id) {
          try {
            const statusRes = await api.registrations.checkStatus(student.id, id);
            if (isMounted) {
              setIsRegistered(statusRes.data?.registered || false);
            }
          } catch (err) {
            console.warn("Could not check registration status", err);
          }
        }
      } catch (err) {
        console.error("Event fetch error:", err);
        if (isMounted) {
          if (err.response?.status === 404) {
            setError("Event not found with ID " + id);
          } else {
            setError("Unable to load event details. Please verify your connection.");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadEventData();

    return () => {
      isMounted = false;
    };
  }, [id, isAuthenticated, student?.id]);

  const handleRegister = async () => {
    if (!isAuthenticated || !student?.id) {
      navigate("/login");
      return;
    }

    setRegistering(true);
    setFeedback({ type: "", message: "" });

    try {
      await api.registrations.register(student.id, event.id);
      setIsRegistered(true);
      setShowConfirmationModal(true);
      setFeedback({
        type: "success",
        message: "You have successfully registered for this event!"
      });
    } catch (err) {
      console.error("Registration failed:", err);
      if (err.response?.status === 409) {
        setIsRegistered(true);
        setFeedback({
          type: "info",
          message: "You are already registered for this event."
        });
      } else {
        const errMsg = err.response?.data?.message || "Failed to register for the event. Please try again.";
        setFeedback({
          type: "error",
          message: errMsg
        });
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="state-container">
        <Loader2 size={32} className="spin text-purple" />
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="state-container error">
        <AlertCircle size={36} />
        <h2>Event Not Found</h2>
        <p>{error || "This event may no longer be available."}</p>
        <button
          type="button"
          className="welcome-button"
          onClick={() => navigate("/discover")}
        >
          <ArrowLeft size={16} /> Back to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <button
        type="button"
        className="back-nav-btn"
        onClick={() => navigate("/discover")}
      >
        <ArrowLeft size={16} />
        <span>Back to Discover</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal-backdrop" onClick={() => setShowConfirmationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrapper success">
              <CheckCircle2 size={36} />
            </div>
            <h2>Registration Confirmed!</h2>
            <p>
              You're all set for <strong>{event.title}</strong>. We've added this activity to your record.
            </p>

            <div className="modal-details-box">
              <div>
                <span>Date:</span>
                <strong>{event.date}</strong>
              </div>
              <div>
                <span>Time:</span>
                <strong>{event.time}</strong>
              </div>
              <div>
                <span>Venue:</span>
                <strong>{event.venue}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <Link to="/activities" className="modal-primary-btn">
                View My Activities
              </Link>
              <button
                type="button"
                className="modal-secondary-btn"
                onClick={() => setShowConfirmationModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="event-hero-banner">
        <div className="event-hero-info">
          <span className="event-badge">{event.category || "Campus Event"}</span>
          <h1>{event.title}</h1>
          <p className="event-lead-desc">{event.description}</p>
        </div>
      </div>

      {feedback.message && (
        <div className={`event-feedback-banner ${feedback.type}`}>
          {feedback.type === "success" && <CheckCircle2 size={18} />}
          {feedback.type === "error" && <AlertCircle size={18} />}
          {feedback.type === "info" && <Sparkles size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="event-details-grid">
        <div className="event-main-card">
          <h2>About this Event</h2>
          <p className="event-full-text">
            {event.description}
          </p>

          <div className="event-guidelines">
            <h3>Event Information &amp; Rules</h3>
            <ul>
              <li>Please bring your student ID card for on-campus venue entry.</li>
              <li>Attendance will be verified at the venue to issue participation certificates.</li>
              <li>Registered students will receive venue announcements and schedule updates.</li>
            </ul>
          </div>
        </div>

        <div className="event-sidebar-card">
          <h3>Event Overview</h3>

          <div className="meta-list">
            <div className="meta-item">
              <Calendar size={18} className="meta-icon" />
              <div>
                <span>Date</span>
                <strong>{event.date || "Date TBA"}</strong>
              </div>
            </div>

            <div className="meta-item">
              <Clock3 size={18} className="meta-icon" />
              <div>
                <span>Time</span>
                <strong>{event.time || "Time TBA"}</strong>
              </div>
            </div>

            <div className="meta-item">
              <MapPin size={18} className="meta-icon" />
              <div>
                <span>Venue</span>
                <strong>{event.venue || "Campus Venue TBA"}</strong>
              </div>
            </div>

            <div className="meta-item">
              <Sparkles size={18} className="meta-icon" />
              <div>
                <span>Registration Deadline</span>
                <strong>{event.registrationDeadline || "Open"}</strong>
              </div>
            </div>
          </div>

          <div className="registration-action-box">
            {isRegistered ? (
              <div className="already-registered-badge">
                <CheckCircle2 size={18} />
                <div>
                  <strong>You are registered!</strong>
                  <p>View this in your Activities.</p>
                </div>
              </div>
            ) : isAuthenticated ? (
              <button
                type="button"
                className="register-event-btn"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    Registering...
                  </>
                ) : (
                  <>Register for Event</>
                )}
              </button>
            ) : (
              <div className="login-prompt-box">
                <p>Sign in to register for this event.</p>
                <Link to="/login" className="register-event-btn">
                  Sign in to Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
