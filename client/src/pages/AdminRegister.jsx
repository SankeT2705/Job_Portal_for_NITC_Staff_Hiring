import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import "./Home.css";

const AdminRegister = React.memo(function AdminRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const backgroundStyle = useMemo(
    () => ({
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `url('${
        isDarkMode
          ? "/images/AdminLoginDark.png"
          : "/images/AdminLoginLight.png"
      }')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      transition: "background-image 0.6s ease, background-color 0.6s ease",
      padding: "140px 16px 80px",
    }),
    [isDarkMode]
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRegister = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);
      setErrorMsg("");

      try {
        const payload = {
          ...formData,
          role: "admin",
        };
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/register`,
          payload
        );

        if (res.data) {
          navigate("/login-admin");
        }
      } catch (err) {
        console.error("Admin registration error:", err);
        const message =
          err.response?.data?.message ||
          "Registration failed. Please review the details and try again.";
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    },
    [formData, loading, navigate]
  );

  return (
    <div
      className={`d-flex flex-column min-vh-100 ${
        isDarkMode ? "home-dark" : "home-light"
      }`}
    >
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
            data-bs-target="#adminRegisterNav"
            aria-controls="adminRegisterNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="adminRegisterNav"
          >
            <ul className="navbar-nav me-lg-3 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link px-3" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/login-admin">
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

      <section className="flex-grow-1 d-flex align-items-center" style={backgroundStyle}>
        <div
          className="surface-card surface-card--glass border-0 p-4 p-md-5 position-relative"
          style={{ width: "100%", maxWidth: "420px", zIndex: 5 }}
        >
          <h4
            className={`text-center mb-4 fw-bold ${
              isDarkMode ? "text-light" : "text-primary"
            }`}
          >
            <i className="bi bi-person-badge me-2"></i> Admin Registration
          </h4>

          {errorMsg && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="admin-name">
                Full Name
              </label>
              <input
                id="admin-name"
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                name="email"
                className="form-control"
                placeholder="you@nitc.ac.in"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="admin-department">
                Department
              </label>
              <select
                id="admin-department"
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Architecture">Architecture</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Computer Science & Engineering">
                  Computer Science & Engineering
                </option>
                <option value="Electrical & Electronics Engineering">
                  Electrical & Electronics Engineering
                </option>
                <option value="Electronics & Communication Engineering">
                  Electronics & Communication Engineering
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="cta-btn w-100 fw-semibold py-2"
              disabled={
                loading ||
                !formData.name.trim() ||
                !formData.email.trim() ||
                !formData.password.trim() ||
                !formData.department
              }
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />{" "}
                  Creating Account...
                </>
              ) : (
                "Register Admin"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <small className={isDarkMode ? "text-muted-dark" : "text-muted"}>
              Already have an admin account?{" "}
              <Link to="/login-admin" className="fw-semibold text-decoration-none">
                Login
              </Link>
            </small>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small>
          © {new Date().getFullYear()} NITC Job Portal | Designed by Team 6
        </small>
      </footer>
    </div>
  );
});

export default AdminRegister;
