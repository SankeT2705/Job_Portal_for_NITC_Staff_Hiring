import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Spinner, Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Home.css"; // reuse animations, cta-btn, theme classes

const AdminLogin = React.memo(function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [emailValid, setEmailValid] = useState(true);

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState({ type: "", message: "" });

  // Theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("nitc-theme") === "dark";
    }
    return false;
  });

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("nitc-theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  // ✅ Email validation regex
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Admin Login Handler
  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      if (!validateEmail(email)) {
        setErrorMsg("⚠️ Please enter a valid email address.");
        setLoading(false);
        return;
      }

      try {
        await login("admin", email.trim(), password);
        setSuccessMsg("✅ Login successful! Redirecting to admin dashboard...");
        setTimeout(() => navigate("/admin"), 1500);
      } catch (err) {
        console.error("Admin login failed:", err);
        const msg =
          err.response?.data?.message ||
          "❌ Invalid credentials. Please check your email or password.";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, navigate, loading]
  );

  // Forgot Password Handler
  const handleForgotPassword = async () => {
    setResetStatus({ type: "", message: "" });

    if (!validateEmail(resetEmail)) {
      setResetStatus({
        type: "danger",
        message: "Please enter a valid admin email address.",
      });
      return;
    }

    try {
      setResetLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
        { email: resetEmail }
      );
      setResetStatus({
        type: "success",
        message: "✅ Password reset link sent successfully!",
      });
      setResetEmail("");
    } catch (err) {
      console.error("Forgot password (admin) error:", err);
      setResetStatus({
        type: "danger",
        message: "❌ Unable to send reset link. Please try again later.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  // Background Styling
  const heroSectionStyle = React.useMemo(
    () => ({
      backgroundImage: `url('${
        isDarkMode
          ? "/images/AdminLoginDark.png"
          : "/images/AdminLoginLight.png"
      }')`,
      backgroundSize: "cover",
      backgroundPosition: "center 25%",
      backgroundRepeat: "no-repeat",
      backgroundColor: isDarkMode ? "#020817" : "#001b4d",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      transition: "background-image 0.6s ease, background-color 0.6s ease",
    }),
    [isDarkMode]
  );

  return (
    <div
      className={`app-shell d-flex flex-column min-vh-100 ${
        isDarkMode ? "home-dark" : "home-light"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg px-3 nav-overlay ${
          isDarkMode ? "navbar-dark" : "navbar-light"
        } position-absolute top-0 start-0 w-100`}
        style={{ zIndex: 10 }}
      >
        <div className="container">
          <Link
            className="navbar-brand fw-semibold"
            to="/"
            style={{ textShadow: "0 6px 18px rgba(0,0,0,0.45)" }}
          >
            NITC Job Portal
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav me-lg-3 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link px-3" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active fw-semibold px-3"
                  to="/login-admin"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
            <button
              type="button"
              className="theme-toggle ms-lg-2 mt-3 mt-lg-0"
              onClick={toggleTheme}
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <section
        className="text-center d-flex flex-column justify-content-center align-items-center position-relative w-100 flex-grow-1 px-3"
        style={heroSectionStyle}
      >
        {/* Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: isDarkMode
              ? "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 100%)"
              : "linear-gradient(180deg, rgba(4,24,68,0.25) 0%, rgba(4,24,68,0.45) 46%, rgba(2,16,52,0.75) 100%)",
            transition: "background 0.6s ease",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        ></div>

        {/* Login Card */}
        <div
          className="surface-card surface-card--glass border-0 p-4 text-start position-relative"
          style={{ width: "380px", zIndex: 5 }}
        >
          <h4
            className={`text-center mb-4 fw-bold ${
              isDarkMode ? "text-light" : "text-primary"
            }`}
          >
            <i className="bi bi-shield-lock me-2"></i> Admin Login
          </h4>

          {/* Alerts */}
          {successMsg && (
            <Alert variant="success" className="text-center py-2 animate__fadeInDown">
              {successMsg}
            </Alert>
          )}
          {errorMsg && (
            <Alert variant="danger" className="text-center py-2 animate__fadeInDown">
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control themed-form-control ${
                  !emailValid ? "is-invalid" : ""
                }`}
                placeholder="Email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailValid(validateEmail(e.target.value) || e.target.value === "");
                }}
              />
              {!emailValid && (
                <div className="invalid-feedback">Enter a valid email address.</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control themed-form-control"
                placeholder="Password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="cta-btn w-100 fw-semibold py-2"
              disabled={loading || !email || !password || !emailValid}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <small className={isDarkMode ? "text-muted-dark" : "text-muted"}>
              Not an admin yet?{" "}
              <Link
                to="/request-admin"
                className="fw-semibold text-decoration-none"
              >
                Request Access
              </Link>
            </small>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resetStatus.message && (
            <Alert variant={resetStatus.type}>{resetStatus.message}</Alert>
          )}
          <Form>
            <Form.Group>
              <Form.Label>Enter your registered admin email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForgotModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleForgotPassword}
            disabled={resetLoading}
          >
            {resetLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small>
          © {new Date().getFullYear()} NITC Job Portal | Designed by Team 6
        </small>
      </footer>
    </div>
  );
});

export default AdminLogin;
