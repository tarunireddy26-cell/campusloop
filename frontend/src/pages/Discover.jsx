import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, MapPin, ArrowRight, Loader2, Calendar, AlertCircle } from "lucide-react";
import { api } from "../api/client";

export default function Discover() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.events.getAll();
      setEvents(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load events from the database. Please check your network or server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const categories = ["All", ...new Set(events.map((e) => e.category).filter(Boolean))];

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((e) => e.category?.toLowerCase() === selectedCategory.toLowerCase());

  const parseDate = (dateString) => {
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
    <div className="discover-page-container">
      <div className="page-header">
        <span className="page-eyebrow">CAMPUS EVENTS</span>
        <h1>Discover Events</h1>
        <p>Find workshops, hackathons, and cultural activities happening around campus.</p>
      </div>

      {categories.length > 1 && (
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="state-container">
          <Loader2 size={32} className="spin text-purple" />
          <p>Loading events from database...</p>
        </div>
      ) : error ? (
        <div className="state-container error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button type="button" className="retry-button" onClick={fetchEvents}>
            Try Again
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="state-container empty">
          <Calendar size={36} />
          <h3>No events found</h3>
          <p>
            {selectedCategory === "All"
              ? "There are no campus events listed in the database right now."
              : `No events found under category "${selectedCategory}".`}
          </p>
        </div>
      ) : (
        <div className="discover-grid">
          {filteredEvents.map((event) => {
            const { day, month } = parseDate(event.date);

            return (
              <Link
                to={`/events/${event.id}`}
                className="discover-card"
                key={event.id}
              >
                <div className="discover-card-top">
                  <span className="event-category">
                    {event.category || "Campus Event"}
                  </span>
                  <div className="discover-date">
                    <strong>{day}</strong>
                    <span>{month}</span>
                  </div>
                </div>

                <h2>{event.title}</h2>
                <p className="discover-description">{event.description}</p>

                <div className="discover-details">
                  <span>
                    <Clock3 size={15} />
                    {event.time || "Time TBA"}
                  </span>
                  <span>
                    <MapPin size={15} />
                    {event.venue || "Venue TBA"}
                  </span>
                </div>

                <div className="discover-footer">
                  <span className="deadline-text">
                    Deadline: <strong>{event.registrationDeadline || "Open"}</strong>
                  </span>
                  <span className="discover-link">
                    View details
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
