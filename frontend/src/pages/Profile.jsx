import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Award,
  CalendarDays,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Loader2,
  CheckCircle2,
  IdCard
} from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { student, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activitiesCount, setActivitiesCount] = useState(0);
  const [certificatesCount, setCertificatesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStudentStats() {
      if (!isAuthenticated || !student?.id) {
        setLoading(false);
        return;
      }

      try {
        const [actsRes, certsRes] = await Promise.all([
          api.registrations.getByStudent(student.id),
          api.certificates.getByStudent(student.id)
        ]);

        if (isMounted) {
          setActivitiesCount(actsRes.data?.length || 0);
          setCertificatesCount(certsRes.data?.length || 0);
        }
      } catch (err) {
        console.warn("Could not load profile stats", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStudentStats();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, student?.id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="state-container">
        <User size={44} className="text-purple" />
        <h2>Sign in to view your profile</h2>
        <p>Access your CampusLoop student credentials and activity history.</p>
        <Link to="/login" className="welcome-button">
          Sign in
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const initial = student?.name ? student.name.charAt(0).toUpperCase() : "S";

  return (
    <div className="profile-page">
      <div className="page-header">
        <span className="page-eyebrow">STUDENT ACCOUNT</span>
        <h1>My Profile</h1>
        <p>Manage your account settings, credentials, and view your campus engagement overview.</p>
      </div>

      <div className="profile-layout-grid">
        <div className="profile-card-primary">
          <div className="profile-banner-bg" />

          <div className="profile-avatar-large">
            <span>{initial}</span>
          </div>

          <div className="profile-info-block">
            <h2>{student?.name || "Student"}</h2>
            <p className="profile-email">
              <Mail size={14} />
              {student?.email}
            </p>

            <div className="profile-badges">
              <span className="profile-badge verified">
                <CheckCircle2 size={13} /> Active Student
              </span>
              <span className="profile-badge id-pill">
                <IdCard size={13} /> Student ID: #{student?.id}
              </span>
            </div>
          </div>

          <div className="profile-action-rows">
            <button
              type="button"
              className="profile-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Sign out of CampusLoop</span>
            </button>
          </div>
        </div>

        <div className="profile-overview-col">
          <div className="profile-stats-card">
            <h3>Campus Engagement</h3>

            {loading ? (
              <div className="loading-state-small">
                <Loader2 size={18} className="spin text-purple" />
                <span>Loading statistics...</span>
              </div>
            ) : (
              <div className="profile-stats-grid">
                <div className="stat-box">
                  <div className="stat-box-icon purple">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <strong>{activitiesCount}</strong>
                    <span>Activities Joined</span>
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-box-icon blue">
                    <Award size={20} />
                  </div>
                  <div>
                    <strong>{certificatesCount}</strong>
                    <span>Certificates Earned</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-quicklinks-card">
            <h3>Quick Links</h3>

            <div className="quicklinks-list">
              <Link to="/activities" className="quicklink-row">
                <div className="quicklink-icon purple">
                  <CalendarDays size={16} />
                </div>
                <div className="quicklink-text">
                  <strong>My Activities</strong>
                  <span>View your registered events and schedules</span>
                </div>
                <ArrowRight size={15} />
              </Link>

              <Link to="/certificates" className="quicklink-row">
                <div className="quicklink-icon blue">
                  <Award size={16} />
                </div>
                <div className="quicklink-text">
                  <strong>Certificate Wallet</strong>
                  <span>Access and view your earned certificates</span>
                </div>
                <ArrowRight size={15} />
              </Link>

              <Link to="/discover" className="quicklink-row">
                <div className="quicklink-icon orange">
                  <ShieldCheck size={16} />
                </div>
                <div className="quicklink-text">
                  <strong>Discover Events</strong>
                  <span>Explore upcoming workshops and hackathons</span>
                </div>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
