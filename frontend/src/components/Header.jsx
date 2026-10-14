import { Search, Bell, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { student, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = student?.name ? student.name.charAt(0).toUpperCase() : "S";

  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={17} />
        <input placeholder="Search CampusLoop..." />
      </div>

      <div className="header-actions">
        <button className="icon-button" type="button" title="Notifications">
          <Bell size={18} />
        </button>

        <div className="header-divider" />

        {isAuthenticated ? (
          <div className="user-dropdown-container">
            <div
              className="user-mini cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              role="button"
              tabIndex={0}
            >
              <div className="user-avatar">{initial}</div>
              <div>
                <strong>{student?.name || "Student"}</strong>
                <span>{student?.email ? student.email.split("@")[0] : "Student"}</span>
              </div>
            </div>

            {menuOpen && (
              <div className="user-menu-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                <div className="dropdown-header">
                  <strong>{student?.name}</strong>
                  <p>{student?.email}</p>
                </div>
                <hr />
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={15} />
                  <span>View Profile</span>
                </Link>
                <button
                  type="button"
                  className="dropdown-item danger"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="header-login-btn">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
