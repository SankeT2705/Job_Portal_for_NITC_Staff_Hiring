import React, { useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Spinner, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";

const ResetPassword = React.memo(function ResetPassword() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Theme management
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

  // Background style
  const heroSectionStyle = useMemo(
    () => ({
      backgroundImage: `url('${
        isDarkMode
          ? "/images/UserLoginDark.png"
          : "/images/UserLoginLight.png"
      }')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
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

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/reset-password`,
        {
          email,
          newPassword,
        }
      );

      const { role } = response.data;

      setMessage("✅ Password reset successful! Redirecting to login...");

      // ✅ Redirect based on actual role from backend
      const redirectPath =
        role === "admin" ? "/login-admin" : "/login-user";

      setTimeout(() => navigate(redirectPath), 2500);
    } catch (err) {
      console.error("Reset password error:", err);
      const msg =
        err.response?.data?.message ||
        "Error resetting password. Please try again later.";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);

      // Auto clear message
      setTimeout(() => setMessage(""), 4000);
    }
  };

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
                <Link className="nav-link px-3" to="/login-user">
                  Login
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

        {/* Reset Password Card */}
        <div
          className="surface-card surface-card--glass border-0 p-4 text-start position-relative"
          style={{ width: "380px", zIndex: 5 }}
        >
          <h4
            className={`text-center mb-4 fw-bold ${
              isDarkMode ? "text-light" : "text-primary"
            }`}
          >
            <i className="bi bi-shield-lock me-2"></i> Reset Password
          </h4>

          <Form onSubmit={handleResetPassword}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                className="themed-form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                className="themed-form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            {message && (
              <div
                className={`alert mt-2 ${
                  message.startsWith("✅")
                    ? "alert-success"
                    : "alert-danger"
                } py-2 text-center`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="cta-btn w-100 fw-semibold py-2 mt-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />{" "}
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </Form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small>
          © {new Date().getFullYear()} NITC Job Portal | Designed by Team 6
        </small>
      </footer>
    </div>
  );
});

export default ResetPassword;
