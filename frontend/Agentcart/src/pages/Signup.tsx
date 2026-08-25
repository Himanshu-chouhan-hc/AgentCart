import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { registerUser } from "../services/authApi";

const AgentCartLogo = () => (
  <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 29.5L17.5 7.5C18.2 5.9 20.5 5.7 21.5 7.1L25 12.2" stroke="#F4D000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 32L20.2 10.2L29.5 32" stroke="#111111" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 23.5H26" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
    <path d="M25 12.2L29.5 18" stroke="#F4D000" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(name, email, password);
      navigate("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create your account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-layout">
        <section className="login-showcase">
          <div className="login-glow" />
          <div className="login-brand"><AgentCartLogo /><span>Agent<span>Cart</span></span></div>
          <div className="login-showcase-content">
            <div className="login-kicker"><span /><span>AI-powered commerce</span></div>
            <h1>Find more.<br /><span>Shop with your</span> <span className="accent">own agent.</span></h1>
            <p className="login-description">Create your AgentCart account and get thoughtful recommendations made around the way you shop.</p>
            <div className="login-features">
              <Feature title="Personalized picks" description="Recommendations that fit you" />
              <Feature title="Smart search" description="Ask naturally, find faster" />
              <Feature title="Better prices" description="Compare before you buy" />
              <Feature title="Secure account" description="Your details stay protected" />
            </div>
          </div>
          <div className="login-security">
            <div className="login-security-icon"><ShieldCheck size={19} /></div>
            <div><p>Secure shopping</p><p>Your account and payments are protected.</p></div>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-wrap">
            <div className="login-mobile-brand"><AgentCartLogo /><span>AgentCart</span></div>
            <div className="login-heading">
              <div className="login-form-logo"><AgentCartLogo /></div>
              <h2>Create your account</h2>
              <p>Join AgentCart and start shopping smarter</p>
            </div>
            <div className="login-form-content">
              <button type="button" className="google-button"><span className="google-mark">G</span>Continue with Google</button>
              <div className="login-divider"><div /><span>OR</span><div /></div>
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="signup-name">Full name</label>
                  <div className="input-wrap"><User size={18} className="field-icon" /><input id="signup-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="login-input" autoComplete="name" required /></div>
                </div>
                <div className="field">
                  <label htmlFor="signup-email">Email address</label>
                  <div className="input-wrap"><Mail size={18} className="field-icon" /><input id="signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="login-input" autoComplete="email" required /></div>
                </div>
                <div className="field">
                  <label htmlFor="signup-password">Password</label>
                  <div className="input-wrap"><LockKeyhole size={18} className="field-icon" /><input id="signup-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" className="login-input login-input-password" autoComplete="new-password" minLength={6} required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="password-toggle" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
                </div>
                <div className="field">
                  <label htmlFor="signup-confirm-password">Confirm password</label>
                  <div className="input-wrap"><LockKeyhole size={18} className="field-icon" /><input id="signup-confirm-password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" className="login-input login-input-password" autoComplete="new-password" minLength={6} required /><button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="password-toggle" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
                </div>
                <button type="submit" className="signin-button" disabled={isLoading}>{isLoading ? "Creating account..." : "Create account"}</button>
              </form>
              {error && <p className="form-error" role="alert">{error}</p>}
              <p className="signup-prompt">Already have an account? <Link to="/login" className="signup-link">Sign in</Link></p>
              <p className="terms-text">By creating an account, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span></p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const Feature = ({ title, description }: { title: string; description: string }) => (
  <div className="feature-card"><div className="feature-line" /><p className="feature-title">{title}</p><p className="feature-description">{description}</p></div>
);

export default Signup;
