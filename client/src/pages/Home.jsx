import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";

const Home = React.memo(function Home() {
  const currentYear = new Date().getFullYear();
  const contactSectionRef = React.useRef(null);
  const contactLottieRef = React.useRef(null);

  const handleContactClick = React.useCallback((event) => {
    event.preventDefault();
    contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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

  React.useEffect(() => {
    if (window.location.hash === "#contact") {
      const el = document.getElementById("contact");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, []);

  React.useEffect(() => {
    const player = contactLottieRef.current;
    if (!player) return;

    // Make sure loop/autoplay are always enabled on the custom element
    player.setAttribute("loop", "true");
    player.setAttribute("autoplay", "true");

    const ensurePlaying = () => {
      try {
        if (typeof player.seek === "function" && player.state === "stopped") {
          player.seek(0);
        }
        if (typeof player.play === "function") {
          player.play();
        }
      } catch {
        // Ignore player errors – retry will be triggered via interval/listeners
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) ensurePlaying();
    };

    const keepAlive = window.setInterval(ensurePlaying, 15000);

    ["ready", "complete", "pause", "stop"].forEach((eventName) =>
      player.addEventListener(eventName, ensurePlaying)
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    ensurePlaying();

    return () => {
      ["ready", "complete", "pause", "stop"].forEach((eventName) =>
        player.removeEventListener(eventName, ensurePlaying)
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(keepAlive);
    };
  }, []);

  const navbarStyle = React.useMemo(
    () => ({
      background: "transparent",
      borderBottom: "none",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
      zIndex: 10,
    }),
    []
  );

  const navLinkStyle = React.useMemo(
    () => ({
      textShadow: "0 6px 18px rgba(0, 0, 0, 0.45)",
      letterSpacing: "0.02em",
    }),
    []
  );

  const backgroundImageUrl = isDarkMode
    ? "/images/DarkThemeNitc.png"
    : "/images/NitGib2.png";

  const pageBackgroundStyle = React.useMemo(
    () => ({
      backgroundImage: `url('${backgroundImageUrl}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundColor: isDarkMode ? "#020817" : "#001b4d",
      transition: "background-image 0.6s ease, background-color 0.6s ease",
    }),
    [backgroundImageUrl, isDarkMode]
  );

  const heroSectionStyle = React.useMemo(
    () => ({
      minHeight: "100vh",
      paddingTop: "160px",
      paddingBottom: "160px",
    }),
    []
  );

  return (
    <div
      className={`home-page d-flex flex-column min-vh-100 ${
        isDarkMode ? "home-dark" : "home-light"
      }`}
      style={pageBackgroundStyle}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark py-3 px-3 position-absolute top-0 start-0 w-100"
        style={navbarStyle}
      >
        <div className="container">
          <Link
            className="navbar-brand fw-semibold text-white"
            to="/"
            style={navLinkStyle}
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
            className="collapse navbar-collapse justify-content-end align-items-lg-center"
            id="navbarNav"
          >
            <ul className="navbar-nav me-lg-3">
              <li className="nav-item">
                <Link
                  className="nav-link text-white fw-semibold px-3"
                  aria-current="page"
                  to="/"
                  style={navLinkStyle}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white px-3"
                  to="/select-login"
                  style={navLinkStyle}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white px-3"
                  href="#contact"
                  onClick={handleContactClick}
                  style={navLinkStyle}
                >
                  Contact
                </a>
              </li>
            </ul>
            <button
              type="button"
              className="theme-toggle ms-lg-2 mt-3 mt-lg-0"
              onClick={toggleTheme}
              aria-pressed={isDarkMode}
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="text-white text-center d-flex flex-column justify-content-center align-items-center flex-grow-1 py-5 px-3 position-relative overflow-hidden"
        style={heroSectionStyle}
      >
        <div className="container py-5 position-relative">
          <h1
            className="display-3 fw-bold hero-title"
            data-text="Welcome to NITC Job Portal"
          >
            Welcome to NITC Job Portal
          </h1>
          <div
            className="lead position-relative mb-4 mx-auto"
            style={{ maxWidth: "760px" }}
          >
            <span className="phrase-glow" aria-hidden="true"></span>
            <span className="phrase-shimmer" aria-hidden="true"></span>
            <p className="hero-lead-text mb-0">
              A centralized recruitment platform for posting jobs, applying
              online, and managing the hiring process seamlessly at NIT Calicut.
            </p>
          </div>
          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center pt-5 mt-4">
            <Link className="cta-btn" to="/select-login">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-5 position-relative"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          className={`section-surface ${
            isDarkMode ? "section-surface--dark" : "section-surface--light"
          }`}
        >
          <div className="container position-relative">
            <div className="text-center mb-5">
              <span className="stat-badge">
                <i className="bi bi-magic"></i> Experiences
              </span>
              <h2
                className="fw-semibold mb-3"
                style={{
                  letterSpacing: "0.05em",
                  color: isDarkMode ? "#dbe6ff" : "#123c7a",
                }}
              >
                Crafted for Every Role at NITC
              </h2>
              <p
                className={`mx-auto ${
                  isDarkMode ? "text-muted-dark" : "text-muted"
                }`}
                style={{ maxWidth: "720px" }}
              >
                Purpose-built tools that stay intuitive across the journey—from
                discovering openings to closing positions.
              </p>
            </div>
            <div className="row g-4 g-lg-5">
              <div className="col-md-4">
                <div className="feature-card h-100 text-center">
                  <div className="feature-card__icon mx-auto">
                    <i className="bi bi-person-badge"></i>
                  </div>
                  <h5 className="fw-semibold mb-1">For Job Seekers</h5>
                  <div className="feature-card__divider"></div>
                  <p
                    className={`${
                      isDarkMode ? "text-muted-dark" : "text-muted"
                    } mb-0`}
                  >
                    Browse curated openings, apply with confidence, and monitor
                    progress in a calm, organized dashboard.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card h-100 text-center">
                  <div className="feature-card__icon mx-auto">
                    <i className="bi bi-briefcase"></i>
                  </div>
                  <h5 className="fw-semibold mb-1">For Admins</h5>
                  <div className="feature-card__divider"></div>
                  <p
                    className={`${
                      isDarkMode ? "text-muted-dark" : "text-muted"
                    } mb-0`}
                  >
                    Publish roles instantly, shortlist with precision, and
                    collaborate seamlessly with department leads.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card h-100 text-center">
                  <div className="feature-card__icon mx-auto">
                    <i className="bi bi-envelope-check"></i>
                  </div>
                  <h5 className="fw-semibold mb-1">Smart Notifications</h5>
                  <div className="feature-card__divider"></div>
                  <p
                    className={`${
                      isDarkMode ? "text-muted-dark" : "text-muted"
                    } mb-0`}
                  >
                    Stay in sync with instant alerts for new matches, interview
                    updates, and hiring milestones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        ref={contactSectionRef}
        className="py-5 position-relative"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          className={`section-surface ${
            isDarkMode ? "section-surface--dark" : "section-surface--light"
          }`}
        >
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-6 text-center text-lg-start">
                <p
                  className={`contact-highlight mb-2 text-uppercase ${
                    isDarkMode ? "text-muted-dark" : ""
                  }`}
                >
                  We&apos;re here to help
                </p>
                <h2
                  className="fw-semibold mb-2"
                  style={{
                    color: isDarkMode ? "#f1f5ff" : "#123c7a",
                  }}
                >
                  Connect with NITC Recruitment
                </h2>
                <p
                  className={isDarkMode ? "text-muted-dark" : ""}
                  style={{
                    color: isDarkMode
                      ? "rgba(214, 226, 255, 0.78)"
                      : "rgba(18, 52, 112, 0.7)",
                    maxWidth: "540px",
                  }}
                >
                  Our team is ready to assist with portal onboarding, job
                  postings, or application tracking. Reach out using your
                  preferred channel and we&apos;ll respond soon.
                </p>
                <div className="contact-divider"></div>
                <div className="d-flex flex-column flex-md-row flex-wrap justify-content-center justify-content-lg-start gap-3">
                  <a
                    href="mailto:recruitment@nitc.ac.in"
                    className="contact-info-item text-decoration-none"
                  >
                    <i className="bi bi-envelope-fill"></i>
                    recruitment@nitc.ac.in
                  </a>
                  <span className="contact-info-item">
                    <i className="bi bi-telephone-fill"></i>
                    +91 495 228 6100
                  </span>
                  <span className="contact-info-item">
                    <i className="bi bi-geo-alt-fill"></i>
                    NIT Calicut, Kerala 673601
                  </span>
                </div>
              </div>
              <div className="col-lg-6 text-center mt-4 mt-lg-0 d-flex justify-content-center">
                <dotlottie-player
                  src="/images/contact us 1.lottie"
                  background="transparent"
                  speed="1"
                  autoplay
                  loop
                  className="contact-lottie"
                  style={{ width: "100%", maxWidth: "480px" }}
                  ref={contactLottieRef}
                ></dotlottie-player>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small>
          © {currentYear} NIT Calicut — Job Portal | Designed by Team 6
        </small>
      </footer>
    </div>
  );
});

export default Home;
