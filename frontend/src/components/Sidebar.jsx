import {
  Home,
  Compass,
  CalendarDays,
  Award,
  Library,
  PackageSearch,
  Users,
  LogOut
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">C</div>
        <span>CampusLoop</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MAIN</p>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Home size={18} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/discover"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Compass size={18} />
          <span>Discover</span>
        </NavLink>

        <NavLink
          to="/activities"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <CalendarDays size={18} />
          <span>My Activities</span>
        </NavLink>

        <NavLink
          to="/certificates"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Award size={18} />
          <span>Certificates</span>
        </NavLink>

        <p className="nav-label second">CAMPUS</p>

        <NavLink
          to="/library"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Library size={18} />
          <span>Library</span>
        </NavLink>

        <NavLink
          to="/lost-found"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <PackageSearch size={18} />
          <span>Lost &amp; Found</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Users size={18} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        {isAuthenticated ? (
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign out of CampusLoop"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        ) : (
          <div className="sidebar-help">
            <span>Welcome!</span>
            <p>Sign in to access all features.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
