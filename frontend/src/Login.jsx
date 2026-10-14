import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import { api } from "./api/client";
import { useAuth } from "./context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.auth.login({
        email: email.trim(),
        password: password
      });

      if (response.data && response.data.id) {
        login(response.data, response.data.token);
        navigate("/");
      } else {
        setMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Unable to sign in. Please check your credentials.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-logo">C</div>
          <span>CampusLoop</span>
        </div>

        <div className="auth-intro">
          <span>YOUR CAMPUS. ONE PLACE.</span>

          <h1>
            Everything happening
            <br />
            <em>around you.</em>
          </h1>

          <p>
            Discover events, build your activity record,
            collect certificates and stay connected with
            campus life.
          </p>
        </div>

        <div className="auth-decoration">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="mobile-auth-brand">
            <div className="brand-logo">C</div>
            <span>CampusLoop</span>
          </div>

          <span className="form-label">
            WELCOME BACK
          </span>

          <h2>Sign in to CampusLoop</h2>

          <p className="form-description">
            Your campus experience is waiting.
          </p>

          <label>
            <span>Email address</span>

            <div className="input-wrapper">
              <Mail size={17} />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </label>

          <label>
            <span>Password</span>

            <div className="input-wrapper">
              <Lock size={17} />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </label>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={17} className="spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;