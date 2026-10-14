import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link
} from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import EventDetails from "./pages/EventDetails";
import Activities from "./pages/Activities";
import Certificates from "./pages/Certificates";
import Library from "./pages/Library";
import LostFound from "./pages/LostFound";
import Profile from "./pages/Profile";

import Login from "./Login";
import Register from "./Register";

function NotFoundPage() {
  return (
    <div className="state-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="welcome-button">
        Return to Home
      </Link>
    </div>
  );
}

function MainApp() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/library" element={<Library />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </AuthProvider>
  );
}
