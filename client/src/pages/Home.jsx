import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Needed for navbar toggler (collapse) to work:
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// Needed for the <i className="bi ..."> icons to render:
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";

function AnimatedCounter({ target, suffix = "", duration = 1600, className }) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const elementRef = React.useRef(null);
  const frameRef = React.useRef(null);
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    const node = elementRef.current;
    if (!node) {
      return undefined;
    }

    const startCounting = () => {
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        if (progress >= 1) {
          setDisplayValue(target);
          return;
        }

        setDisplayValue(Math.floor(target * eased));
        frameRef.current = requestAnimationFrame(step);
      };

      frameRef.current = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            startCounting();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
      {suffix}
    </span>
  );
}

const Home = React.memo(function Home() {
  const currentYear = new Date().getFullYear();
  const contactSectionRef = React.useRef(null);
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

  const heroSectionStyle = React.useMemo(
    () => ({
      backgroundImage: `url('${isDarkMode ? "/images/DarkThemeNitc.png" : "/images/NitGib2.png"}')`,
      backgroundSize: "cover",
      backgroundPosition: "center 13%",
      backgroundRepeat: "no-repeat",
      backgroundColor: isDarkMode ? "#020817" : "#001b4d",
      minHeight: "520px",
      paddingTop: "120px",
      transition: "background-image 0.6s ease, background-color 0.6s ease",
    }),
    [isDarkMode]
  );

  return (
    
    <div className={`d-flex flex-column min-vh-100 ${isDarkMode ? "home-dark" : "home-light"}`}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark py-3 px-3 position-absolute top-0 start-0 w-100" style={navbarStyle}>
        <div className="container">
          <Link className="navbar-brand fw-semibold text-white" to="/" style={navLinkStyle}>
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
          <div className="collapse navbar-collapse justify-content-end align-items-lg-center" id="navbarNav">
            <ul className="navbar-nav me-lg-3">
              <li className="nav-item">
                <Link className="nav-link text-white fw-semibold px-3" aria-current="page" to="/" style={navLinkStyle}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white  px-3" to="/select-login" style={navLinkStyle}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="#contact" onClick={handleContactClick} style={navLinkStyle}>
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
        {!isDarkMode && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background: "linear-gradient(180deg, rgba(4, 24, 68, 0.15) 0%, rgba(4, 24, 68, 0.38) 46%, rgba(2, 16, 52, 0.68) 100%)",
              transition: "background 0.6s ease",
            }}
            aria-hidden="true"
          ></div>
        )}
        <div className="container py-5 position-relative">
          <h1 className="display-4 fw-bold mb-3">Welcome to NITC Job Portal</h1>
          <div className="lead position-relative mb-2 mx-auto" style={{ maxWidth: "720px" }}>
            <span className="phrase-glow" aria-hidden="true"></span>
            <span className="phrase-shimmer" aria-hidden="true"></span>
            <p className="hero-lead-text mb-0">
              A centralized recruitment platform for posting jobs, applying online,
              and managing the hiring process seamlessly at NIT Calicut.
            </p>
          </div>
          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center pt-4 mt-5">
            <Link className="cta-btn" to="/select-login">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className={`py-5 position-relative ${isDarkMode ? "section-dark" : "bg-light"}`}>
        <div
          className="position-absolute start-50 translate-middle-x"
          style={{
            top: "-140px",
            width: "520px",
            height: "520px",
            background: isDarkMode
              ? "radial-gradient(circle, rgba(58, 104, 207, 0.42) 0%, rgba(58, 104, 207, 0) 70%)"
              : "radial-gradient(circle, rgba(126, 174, 255, 0.32) 0%, rgba(126, 174, 255, 0) 70%)",
            filter: "blur(40px)",
            opacity: isDarkMode ? 0.55 : 0.65,
            pointerEvents: "none",
          }}
        ></div>
        <div className="container position-relative">
          <div className="text-center mb-5">
            <span className="stat-badge">
              <i className="bi bi-stars"></i> Highlights
            </span>
            <h2
              className="fw-semibold mb-3"
              style={{ letterSpacing: "0.05em", color: isDarkMode ? "#dbe6ff" : "#123c7a" }}
            >
              Built for NITC&apos;s Ambitious Growth
            </h2>
            <p
              className={`mx-auto ${isDarkMode ? "text-muted-dark" : "text-muted"}`}
              style={{ maxWidth: "720px" }}
            >
              Real-time insights that celebrate both the people and the possibilities that power the campus.
            </p>
          </div>
          <div className="row text-center g-4 g-xl-5 align-items-stretch justify-content-center">
            <div className="col-11 col-md-4 col-lg-3">
              <div className="feature-card highlight-card highlight-card--orbit h-100 text-center">
                <div className="feature-card__icon mx-auto">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h2 className="highlight-number mb-0">
                  <AnimatedCounter target={500} suffix="+" />
                </h2>
                <div className="feature-card__divider"></div>
                <p className={`mb-0 ${isDarkMode ? "text-muted-dark" : "text-muted"}`}>
                  Successful placements facilitated through the portal.
                </p>
              </div>
            </div>
            <div className="col-11 col-md-4 col-lg-3">
              <div className="feature-card highlight-card highlight-card--sway h-100 text-center">
                <div className="feature-card__icon mx-auto">
                  <i className="bi bi-building"></i>
                </div>
                <h2 className="highlight-number mb-0">
                  <AnimatedCounter target={50} suffix="+" duration={1400} />
                </h2>
                <div className="feature-card__divider"></div>
                <p className={`mb-0 ${isDarkMode ? "text-muted-dark" : "text-muted"}`}>
                  Departments and centres recruiting talented staff.
                </p>
              </div>
            </div>
            <div className="col-11 col-md-4 col-lg-3">
              <div className="feature-card highlight-card highlight-card--pulse h-100 text-center">
                <div className="feature-card__icon mx-auto">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h2 className="highlight-number highlight-number--accent mb-0">24x7</h2>
                <div className="feature-card__divider"></div>
                <p className={`mb-0 ${isDarkMode ? "text-muted-dark" : "text-muted"}`}>
                  Access applications anytime with an interface tuned for clarity and calm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-5 position-relative"
        style={
          isDarkMode
            ? { background: "linear-gradient(180deg, #0c162c 0%, #0a1224 100%)" }
            : { background: "linear-gradient(180deg, #f7faff 0%, #eef3ff 100%)" }
        }
      >
        <div className="container position-relative">
          <div className="text-center mb-5">
            <span className="stat-badge">
              <i className="bi bi-magic"></i> Experiences
            </span>
            <h2
              className="fw-semibold mb-3"
              style={{ letterSpacing: "0.05em", color: isDarkMode ? "#dbe6ff" : "#123c7a" }}
            >
              Crafted for Every Role at NITC
            </h2>
            <p
              className={`mx-auto ${isDarkMode ? "text-muted-dark" : "text-muted"}`}
              style={{ maxWidth: "720px" }}
            >
              Purpose-built tools that stay intuitive across the journey—from discovering openings to closing positions.
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
                <p className={`${isDarkMode ? "text-muted-dark" : "text-muted"} mb-0`}>
                  Browse curated openings, apply with confidence, and monitor progress in a calm, organized dashboard.
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
                <p className={`${isDarkMode ? "text-muted-dark" : "text-muted"} mb-0`}>
                  Publish roles instantly, shortlist with precision, and collaborate seamlessly with department leads.
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
                <p className={`${isDarkMode ? "text-muted-dark" : "text-muted"} mb-0`}>
                  Stay in sync with instant alerts for new matches, interview updates, and hiring milestones.
                </p>
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
        style={{ background: isDarkMode ? "#0d1529" : "#ffffff" }}
      >
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7 text-center text-lg-start">
              <p className={`contact-highlight mb-2 text-uppercase ${isDarkMode ? "text-muted-dark" : ""}`}>We&apos;re here to help</p>
              <h2 className="fw-semibold mb-2" style={{ color: isDarkMode ? "#f1f5ff" : "#123c7a" }}>
                Connect with NITC Recruitment
              </h2>
              <p
                className={isDarkMode ? "text-muted-dark" : ""}
                style={{ color: isDarkMode ? "rgba(214, 226, 255, 0.78)" : "rgba(18, 52, 112, 0.7)", maxWidth: "540px" }}
              >
                Our team is ready to assist with portal onboarding, job postings, or application tracking. Reach out using your preferred channel and we&apos;ll respond soon.
              </p>
              <div className="contact-divider"></div>
              <div className="d-flex flex-column flex-md-row justify-content-center justify-content-lg-start gap-3">
                <a href="mailto:recruitment@nitc.ac.in" className="contact-info-item text-decoration-none">
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
            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <img
                src={isDarkMode ? "/images/contactUsDarktheme.gif" : "/images/ContactUsAnimate.gif"}
                className="img-fluid"
                alt="Animated contact icons"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small>© {currentYear} NIT Calicut — Job Portal | Designed by Team 6</small>
      </footer>
    </div>
  );
});

export default Home;
