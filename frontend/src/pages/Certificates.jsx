import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Calendar,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileCheck,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Certificates() {
  const { student, isAuthenticated } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePreview, setActivePreview] = useState(null);

  const fetchCertificates = async () => {
    if (!isAuthenticated || !student?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.certificates.getByStudent(student.id);
      setCertificates(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load your certificates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [isAuthenticated, student?.id]);

  if (!isAuthenticated) {
    return (
      <div className="state-container">
        <Award size={44} className="text-purple" />
        <h2>Sign in to view your Certificate Wallet</h2>
        <p>Certificates earned from campus activities and competitions are linked to your student account.</p>
        <Link to="/login" className="welcome-button">
          Sign in
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="certificates-page">
      <div className="page-header">
        <span className="page-eyebrow">CREDENTIALS &amp; ACHIEVEMENTS</span>
        <h1>Certificate Wallet</h1>
        <p>View and download verified participation and achievement certificates earned across campus events.</p>
      </div>

      {/* Certificate Preview Modal */}
      {activePreview && (
        <div className="modal-backdrop" onClick={() => setActivePreview(null)}>
          <div className="certificate-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cert-preview-frame">
              <div className="cert-header">
                <div className="brand-logo">C</div>
                <span>CampusLoop Verified Certificate</span>
              </div>
              <Award size={48} className="cert-seal" />
              <h3>Certificate of Participation</h3>
              <p className="cert-awarded-to">This is proudly presented to</p>
              <h2 className="cert-student-name">{student?.name || "Student"}</h2>
              <p className="cert-for">for successful participation in</p>
              <h4 className="cert-event-title">{activePreview.certificateName}</h4>
              <div className="cert-footer-meta">
                <span>Issued on: {activePreview.issueDate}</span>
                <span>Verified by CampusLoop Authority</span>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: "20px" }}>
              {activePreview.certificateUrl && (
                <a
                  href={activePreview.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-primary-btn"
                >
                  <ExternalLink size={15} /> Open Source Link
                </a>
              )}
              <button
                type="button"
                className="modal-secondary-btn"
                onClick={() => setActivePreview(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="state-container">
          <Loader2 size={32} className="spin text-purple" />
          <p>Loading your certificates...</p>
        </div>
      ) : error ? (
        <div className="state-container error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button type="button" className="retry-button" onClick={fetchCertificates}>
            Try Again
          </button>
        </div>
      ) : certificates.length === 0 ? (
        <div className="state-container empty">
          <FileCheck size={40} />
          <h3>No certificates earned yet</h3>
          <p>Attend campus workshops, hackathons, and activities to earn verified certificates.</p>
          <Link to="/discover" className="welcome-button">
            Browse Events
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="certificates-grid">
          {certificates.map((cert) => {
            const event = cert.event || {};

            return (
              <div className="certificate-card" key={cert.id}>
                <div className="cert-card-top">
                  <div className="cert-icon-badge">
                    <Award size={24} />
                  </div>
                  <span className="cert-verified-pill">
                    <ShieldCheck size={13} /> Verified
                  </span>
                </div>

                <h3>{cert.certificateName}</h3>
                {event.title && (
                  <p className="cert-event-tag">
                    Event: <strong>{event.title}</strong>
                  </p>
                )}

                <div className="cert-meta-row">
                  <span>
                    <Calendar size={13} />
                    Issued: {cert.issueDate || "Recent"}
                  </span>
                </div>

                <div className="cert-card-footer">
                  <button
                    type="button"
                    className="view-cert-btn"
                    onClick={() => setActivePreview(cert)}
                  >
                    View Certificate
                  </button>
                  {cert.certificateUrl && (
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-external-link"
                      title="Open external certificate link"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
