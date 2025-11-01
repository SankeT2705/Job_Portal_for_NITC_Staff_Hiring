import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Needed for navbar toggler (collapse) to work:
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// Needed for the <i className="bi ..."> icons to render:
import "bootstrap-icons/font/bootstrap-icons.css";

const Home = React.memo(function Home() {
  const currentYear = new Date().getFullYear();
    const contactSectionRef = React.useRef(null);

  const handleContactClick = React.useCallback((event) => {
    event.preventDefault();
    contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">
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
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/select-login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                                <a
                  className="nav-link"
                  href="#contact"
                  onClick={handleContactClick}
                >
                  Contact
                  </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary text-white text-center d-flex flex-column justify-content-center align-items-center flex-grow-1 py-5 px-3">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Welcome to NITC Job Portal</h1>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: "700px" }}>
            A centralized recruitment platform for posting jobs, applying online,
            and managing the hiring process seamlessly at NIT Calicut.
          </p>
          <p className="lead mb-4 mx-auto">
            <Link className="nav-link" to="/select-login">
              Lets Start..
            </Link>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <i className="bi bi-person-badge fs-1 text-primary mb-3"></i>
                <h5 className="card-title">For Job Seekers</h5>
                <p className="card-text text-muted">
                  Browse job openings, apply online, and track your application status all in one place.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <i className="bi bi-briefcase fs-1 text-primary mb-3"></i>
                <h5 className="card-title">For Admins</h5>
                <p className="card-text text-muted">
                  Post jobs, manage applications, and find the best candidates through an organized dashboard.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <i className="bi bi-envelope-check fs-1 text-primary mb-3"></i>
                <h5 className="card-title">Smart Notifications</h5>
                <p className="card-text text-muted">
                  Get instant email updates for job matches, status changes, and new opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Contact Section */}
      <section id="contact" ref={contactSectionRef} className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="fw-semibold mb-4">Contact Us</h2>
              <p className="text-muted mb-4">
                Have questions about the hiring process or need support using the
                portal? Reach out to the NIT Calicut recruitment team and we&apos;ll
                get back to you shortly.
              </p>
              <div className="d-flex flex-column gap-2">
                <div>
                  <i className="bi bi-envelope-fill text-primary me-2"></i>
                  <a href="mailto:recruitment@nitc.ac.in" className="text-decoration-none">
                    recruitment@nitc.ac.in
                  </a>
                </div>
                <div>
                  <i className="bi bi-telephone-fill text-primary me-2"></i>
                  +91 495 228 6100
                </div>
                <div>
                  <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                  NIT Calicut, Kozhikode, Kerala 673601
                </div>
              </div>
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
