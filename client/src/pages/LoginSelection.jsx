import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css"; // reuse existing animations & styles

const LoginSelection = React.memo(function LoginSelection() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("nitc-theme") === "dark";
    }
    return false;
  });

  const toggleTheme = React.useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("nitc-theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  const heroSectionStyle = React.useMemo(
  () => ({
    backgroundImage: `url('${isDarkMode ? "/images/LoginSelectionDarkTheme.png" : "/images/LoginSelectionLightTheme.png"}')`,
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
      className={`d-flex flex-column min-vh-100 ${
        isDarkMode ? "home-dark" : "home-light"
      }`}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark py-3 px-3 position-absolute top-0 start-0 w-100"
        style={{ background: "transparent", borderBottom: "none", zIndex: 10 }}
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
            <ul className="navbar-nav me-lg-3">
              <li className="nav-item">
                <Link className="nav-link text-white px-3" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active fw-semibold text-white px-3"
                  to="/select-login"
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
              <Link
                className="nav-link text-white px-3"
                to="/#contact"
              >
                Contact
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

      {/* Hero Section (with animated background) */}
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
            }}
            aria-hidden="true"
          ></div>
        )}

        <div
          className="card shadow-lg border-0 p-4 text-center position-relative"
          style={{
            width: "380px",
            borderRadius: "18px",
            background: isDarkMode
              ? "linear-gradient(160deg, rgba(20,28,52,0.95), rgba(13,21,40,0.95))"
              : "linear-gradient(160deg, rgba(255,255,255,0.96), rgba(234,242,255,0.94))",
            boxShadow: isDarkMode
              ? "0 24px 44px rgba(5,10,24,0.75)"
              : "0 18px 34px rgba(18,54,112,0.16)",
            backdropFilter: "blur(6px)",
          }}
        >
          <h4
            className={`fw-bold mb-3 ${
              isDarkMode ? "text-light" : "text-primary"
            }`}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Choose Login Type
          </h4>
          <p
            className={`mb-4 small ${
              isDarkMode ? "text-muted-dark" : "text-muted"
            }`}
          >
            Select your account to continue
          </p>

          {/* Buttons with hover ripple & icons */}
          <div className="d-grid gap-3">
            <Link to="/login-user" className="cta-btn text-decoration-none">
              <i className="bi bi-person-circle me-2"></i>
              Login as User
            </Link>

            <Link to="/login-admin" className="cta-btn text-decoration-none">
              <i className="bi bi-shield-lock me-2"></i>
              Login as Admin
            </Link>
          </div>

          {/* Access Request & Register Links */}
          <div className="mt-4 small">
            <p className="mb-2 text-secondary">
              Want to become an admin?{" "}
              <Link
                to="/request-admin"
                className="fw-semibold text-decoration-none"
              >
                Request Access
              </Link>
            </p>
            <p className="mb-0 text-secondary">
              Don’t have an account?{" "}
              <Link
                to="/register-user"
                className="fw-semibold text-decoration-none"
              >
                Register as User
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small>
          © {new Date().getFullYear()} NIT Calicut — Job Portal | Designed by
          Team 6
        </small>
      </footer>
    </div>
  );
});

export default LoginSelection;
