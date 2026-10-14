import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Mail,
  UserRound,
  Loader2
} from "lucide-react";
import { api } from "./api/client";
import { useAuth } from "./context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.auth.register({
        name: name.trim(),
        email: email.trim(),
        password: password
      });

      if (response.data && response.data.id) {
        if (response.data.token) {
          login(response.data, response.data.token);
          navigate("/");
        } else {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) {
        setMessage("This email is already registered. Please sign in instead.");
      } else {
        const errMsg = error.response?.data?.message || "Unable to create account. Please check your details.";
        setMessage(errMsg);
      }
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
          <span>START YOUR CAMPUS JOURNEY.</span>

          <h1>
            Don't just attend
            <br />
            <em>college. Experience it.</em>
          </h1>

          <p>
            Find events, join activities, save certificates
            and keep your campus experiences together.
          </p>
        </div>

        <div className="auth-decoration">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="mobile-auth-brand">
            <div className="brand-logo">C</div>
            <span>CampusLoop</span>
          </div>

          <span className="form-label">GET STARTED</span>

          <h2>Create your account</h2>

          <p className="form-description">
            Join your campus community in one place.
          </p>

          <label>
            <span>Full name</span>

            <div className="input-wrapper">
              <UserRound size={17} />

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </label>

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
                placeholder="Create a password (min 4 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                autoComplete="new-password"
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
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
