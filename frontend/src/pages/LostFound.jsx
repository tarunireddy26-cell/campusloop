import { useEffect, useState } from "react";
import {
  PackageSearch,
  Plus,
  X,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LostFound() {
  const { student } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    locationFound: "",
    dateFound: todayStr,
    imageUrl: "",
    contact: student?.email || ""
  });

  const fetchItems = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.lostFound.getAll();
      setItems(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load lost and found items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    try {
      const response = await api.lostFound.create(formData);
      if (response.data) {
        setItems((prev) => [response.data, ...prev]);
        setFormSuccess("Item successfully reported! Thank you for helping the campus community.");
        setFormData({
          itemName: "",
          description: "",
          locationFound: "",
          dateFound: todayStr,
          imageUrl: "",
          contact: student?.email || ""
        });
        setTimeout(() => {
          setShowForm(false);
          setFormSuccess("");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Could not report item. Please verify all fields.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lost-found-page">
      <div className="page-header-with-action">
        <div className="page-header">
          <span className="page-eyebrow">COMMUNITY NOTICEBOARD</span>
          <h1>Lost &amp; Found</h1>
          <p>A feed of items found across campus. See something that looks like yours? Contact the finder below.</p>
        </div>

        <button
          type="button"
          className="post-item-btn"
          onClick={() => {
            setShowForm(!showForm);
            setFormError("");
            setFormSuccess("");
          }}
        >
          {showForm ? (
            <>
              <X size={16} /> Close Form
            </>
          ) : (
            <>
              <Plus size={16} /> Post Found Item
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="report-item-card">
          <div className="report-item-header">
            <div>
              <h3>Report a Found Item</h3>
              <p>Help return lost belongings to their rightful owner.</p>
            </div>
            <button
              type="button"
              className="icon-close"
              onClick={() => setShowForm(false)}
            >
              <X size={18} />
            </button>
          </div>

          {formSuccess && (
            <div className="toast-notification success">
              <CheckCircle2 size={16} />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="toast-notification error">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="report-form-grid">
            <div className="form-col">
              <label>
                <span>Item Name *</span>
                <input
                  type="text"
                  name="itemName"
                  placeholder="e.g., Blue Hydro Flask Water Bottle"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                <span>Location Found *</span>
                <input
                  type="text"
                  name="locationFound"
                  placeholder="e.g., Central Library 2nd Floor"
                  value={formData.locationFound}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                <span>Date Found</span>
                <input
                  type="date"
                  name="dateFound"
                  value={formData.dateFound}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="form-col">
              <label>
                <span>Contact Email / Phone *</span>
                <input
                  type="text"
                  name="contact"
                  placeholder="finder@example.com or desk ext."
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                <span>Image URL (Optional)</span>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                <span>Description *</span>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Describe the item, distinctive marks, brand, or where it can be picked up..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="form-actions-full">
              <button
                type="submit"
                className="submit-report-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    Publishing...
                  </>
                ) : (
                  <>Publish Found Item</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="state-container">
          <Loader2 size={32} className="spin text-purple" />
          <p>Loading found items feed...</p>
        </div>
      ) : error ? (
        <div className="state-container error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button type="button" className="retry-button" onClick={fetchItems}>
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="state-container empty">
          <PackageSearch size={44} />
          <h3>No items currently reported</h3>
          <p>Items reported found by students and campus staff will appear in this feed.</p>
          <button
            type="button"
            className="welcome-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} /> Report an Item
          </button>
        </div>
      ) : (
        <div className="lost-feed">
          {items.map((item) => (
            <article className="lost-feed-card" key={item.id}>
              <div className="feed-media">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="feed-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="feed-img-placeholder"
                  style={{ display: item.imageUrl ? "none" : "flex" }}
                >
                  <PackageSearch size={32} />
                  <span>Found Item</span>
                </div>
              </div>

              <div className="feed-content">
                <div className="feed-header">
                  <h3>{item.itemName}</h3>
                  <span className="feed-date">
                    <Calendar size={13} />
                    {item.dateFound || "Recently"}
                  </span>
                </div>

                <p className="feed-description">{item.description}</p>

                <div className="feed-meta-row">
                  <span className="location-tag">
                    <MapPin size={14} />
                    Location: <strong>{item.locationFound || "Campus"}</strong>
                  </span>
                </div>

                {item.contact && (
                  <div className="feed-contact-box">
                    <span className="contact-label">Contact Finder:</span>
                    <span className="contact-value">{item.contact}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
