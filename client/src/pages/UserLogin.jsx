import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Spinner, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Home.css"; // reuse Home page styles (animations, cta-btn, theme)

const UserLogin = React.memo(function UserLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Forgot Password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // theme toggle
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

  // Forgot Password Handler
  const handleForgotPassword = async () => {
    if (!resetEmail) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setResetLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
        email: resetEmail,
      });
      alert("✅ Password reset link sent to your email!");
      setShowForgotModal(false);
      setResetEmail("");
    } catch (err) {
      console.error(err);
      alert("❌ Unable to send reset link. Please check your email or try again later.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;
      setLoading(true);
      setErrorMsg("");

      try {
        await login("user", email.trim(), password);
        navigate("/dashboard-user");
      } catch (err) {
        console.error("Login failed:", err);
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

  const heroSectionStyle = React.useMemo(
    () => ({
      backgroundImage: `url('${
        isDarkMode
          ? "/images/UserLoginDark.png"
          : "/images/UserLoginLight.png"
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
            className="navbar-brand fw-semibold text-white"
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
                  to="/login-user"
                >
                 User Login
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
        {!isDarkMode && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(180deg, rgba(4, 24, 68, 0.25) 0%, rgba(4, 24, 68, 0.45) 46%, rgba(2, 16, 52, 0.75) 100%)",
              transition: "background 0.6s ease",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          ></div>
        )}
        {isDarkMode && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 100%)",
              transition: "background 0.6s ease",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          ></div>
        )}

        {/* Login Card */}
        <div
          className="surface-card surface-card--glass border-0 p-4 text-start position-relative"
          style={{
            width: "380px",
            zIndex: 5,
          }}
        >
          <h4
            className={`text-center mb-4 fw-bold ${
              isDarkMode ? "text-light" : "text-primary"
            }`}
          >
            <i className="bi bi-person-circle me-2"></i> User Login
          </h4>

          {errorMsg && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <input
                type="email"
                className="form-control themed-form-control"
                placeholder="Email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
              disabled={loading || !email || !password}
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
              Don’t have an account?{" "}
              <Link
                to="/register-user"
                className="fw-semibold text-decoration-none"
              >
                Register
              </Link>
            </small>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      <Modal
        show={showForgotModal}
        onHide={() => setShowForgotModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Enter your registered email</Form.Label>
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

export default UserLogin;
