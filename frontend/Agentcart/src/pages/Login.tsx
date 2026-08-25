import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import "../styles/login.css";
import { loginUser } from "../services/authApi";

const AgentCartLogo = () => {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 29.5L17.5 7.5C18.2 5.9 20.5 5.7 21.5 7.1L25 12.2"
        stroke="#F4D000"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 32L20.2 10.2L29.5 32"
        stroke="#111111"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M16.5 23.5H26"
        stroke="#111111"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M25 12.2L29.5 18"
        stroke="#F4D000"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginUser(email, password);
      navigate("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-layout">

        {/* ================= LEFT ================= */}
        <section className="login-showcase">

          {/* subtle yellow glow */}
          <div className="login-glow" />

          {/* Logo */}
          <div className="login-brand">
            <AgentCartLogo />

            <span>
              Agent<span className="text-[#111111]">Cart</span>
            </span>
          </div>

          {/* Content */}
          <div className="login-showcase-content">

            <div className="login-kicker">
              <span />
              <span>
                AI-powered commerce
              </span>
            </div>

            <h1>
              Shop smarter.
              <br />
              <span>
                Let your agent
              </span>{" "}
              <span className="accent">
                handle the rest.
              </span>
            </h1>

            <p className="login-description">
              Discover products, compare prices and make better
              purchasing decisions with your AI-powered shopping
              companion.
            </p>

            {/* Feature boxes */}
            <div className="login-features">

              <Feature
                title="AI Recommendations"
                description="Personalized picks"
              />

              <Feature
                title="Smart Search"
                description="Ask AI naturally"
              />

              <Feature
                title="Price Comparison"
                description="Find better deals"
              />

              <Feature
                title="Easy Checkout"
                description="Fast & secure"
              />

            </div>
          </div>

          {/* Bottom */}
          <div className="login-security">
            <div className="login-security-icon">
              <ShieldCheck
                size={19}
                className="text-gray-800"
              />
            </div>

            <div>
              <p>
                Secure shopping
              </p>

              <p>
                Your account and payments are protected.
              </p>
            </div>
          </div>
        </section>

        {/* ================= RIGHT ================= */}
        <section className="login-form-panel">

          <div className="login-form-wrap">

            {/* Logo mobile */}
            <div className="login-mobile-brand">
              <AgentCartLogo />

              <span>
                AgentCart
              </span>
            </div>

            {/* Heading */}
            <div className="login-heading">
              <div className="login-form-logo">
                <AgentCartLogo />
              </div>

              <h2>
                Welcome back 👋
              </h2>

              <p>
                Sign in to continue shopping with AgentCart
              </p>
            </div>

            {/* Login Card */}
            <div className="login-form-content">

              {/* Google */}
              <button
                type="button"
                className="google-button"
              >
                <span className="google-mark">
                  G
                </span>

                Continue with Google
              </button>

              {/* Divider */}
              <div className="login-divider">
                <div />

                <span>
                  OR
                </span>

                <div />
              </div>

              <form className="login-form" onSubmit={handleSubmit}>

                {/* Email */}
                <div className="field">
                  <label>
                    Email address
                  </label>

                  <div className="input-wrap">
                    <Mail
                      size={18}
                      className="field-icon"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="login-input"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="field">
                  <div className="field-label-row">
                    <label>
                      Password
                    </label>

                    <button
                      type="button"
                      className="forgot-link"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="input-wrap">
                    <LockKeyhole
                      size={18}
                      className="field-icon"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="login-input login-input-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="password-toggle"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sign In */}
                <button
                  type="submit"
                  className="signin-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {error && <p className="form-error" role="alert">{error}</p>}

              {/* Signup */}
              <p className="signup-prompt">
                Don't have an account?{" "}
                <Link to="/signup" className="signup-link">
                  Sign up
                </Link>
              </p>

              {/* Terms */}
              <p className="terms-text">
                By continuing, you agree to our{" "}
                <span>
                  Terms of Service
                </span>{" "}
                and{" "}
                <span>
                  Privacy Policy
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const Feature = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="feature-card">
      <div className="feature-line" />

      <p className="feature-title">
        {title}
      </p>

      <p className="feature-description">
        {description}
      </p>
    </div>
  );
};

export default Login;