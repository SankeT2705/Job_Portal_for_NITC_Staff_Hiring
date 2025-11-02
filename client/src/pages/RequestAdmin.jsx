import React, { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css"; // theme + cta button styles

const RequestAdmin = React.memo(function RequestAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", department: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/request-admin`,
        form,
        { timeout: 8000 }
      );

      setMessage("✅ Request submitted successfully!");
      setTimeout(() => navigate("/login-admin"), 1500);
    } catch (err) {
      console.error("Admin request error:", err);
      setMessage("❌ Failed to submit request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Theme Handling
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("nitc-theme") === "dark";
    }
    return false;
  });

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("nitc-theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  const heroSectionStyle = useMemo(
    () => ({
      backgroundImage: `url('${
        isDarkMode
          ? "/images/admin-bg-dark.png"
          : "/images/admin-bg-light.png"
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
      className={`d-flex flex-column min-vh-100 ${
        isDarkMode ? "home-dark" : "home-light"
      }`}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark py-3 px-3 position-absolute top-0 start-0 w-100"
        style={{ background: "transparent", zIndex: 10 }}
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
                  to="/request-admin"
                >
                  Request Admin
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
        {!isDarkMode ? (
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
        ) : (
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

        {/* Request Form Card */}
        <div
          className="card shadow-lg border-0 p-4 text-start position-relative"
          style={{
            width: "400px",
            borderRadius: "18px",
            background: isDarkMode
              ? "linear-gradient(160deg, rgba(20,28,52,0.95), rgba(13,21,40,0.95))"
              : "linear-gradient(160deg, rgba(255,255,255,0.96), rgba(234,242,255,0.94))",
            boxShadow: isDarkMode
              ? "0 24px 44px rgba(5,10,24,0.75)"
              : "0 18px 34px rgba(18,54,112,0.16)",
            backdropFilter: "blur(6px)",
            zIndex: 5,
          }}
        >
          <h4
            className={`text-center mb-4 fw-bold ${
              isDarkMode ? "text-light" : "text-primary"
            }`}
          >
            <i className="bi bi-envelope-plus me-2"></i> Request Admin Access
          </h4>
          <p
            className={`text-center small mb-4 ${
              isDarkMode ? "text-light opacity-75" : "text-muted"
            }`}
          >
            Fill out the form below to request administrative privileges.
          </p>

          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Institutional Email"
                className="form-control"
                required
              />
            </div>
            <div className="mb-4">
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Department (e.g., CSE)"
                className="form-control"
                required
              />
            </div>

            <button
              type="submit"
              className="cta-btn w-100 fw-semibold py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </Form>

          {message && (
            <p
              className={`mt-3 text-center fw-semibold ${
                message.startsWith("✅") ? "text-success" : "text-danger"
              }`}
            >
              {message}
            </p>
          )}

          <div className="text-center mt-3">
            <small className={isDarkMode ? "text-light opacity-75" : "text-muted"}>
              Already an admin?{" "}
              <Link
                to="/login-admin"
                className="fw-semibold text-decoration-none"
              >
                Go to Admin Login
              </Link>
            </small>
          </div>
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

export default RequestAdmin;

















































// import React, { useState } from "react";
// import axios from "axios";
// import { Form, Button, Container, Spinner, Card } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// const RequestAdmin = React.memo(function RequestAdmin() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", email: "", department: "" });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const { data } = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/auth/request-admin`,
//         form,
//         { timeout: 8000 } // prevent hanging
//       );

//       setMessage("✅ Request submitted successfully!");
//       setTimeout(() => navigate("/login-admin"), 1500);
//     } catch (err) {
//       console.error("Admin request error:", err);
//       setMessage("❌ Failed to submit request. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex flex-column min-vh-100 bg-light">
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
//         <div className="container">
//           <Link className="navbar-brand fw-semibold" to="/">
//             NITC Job Portal
//           </Link>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//             aria-controls="navbarNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//             <ul className="navbar-nav">
//               <li className="nav-item">
//                 <Link className="nav-link" to="/">
//                   Home
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link active" to="/request-admin">
//                   Request Admin
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Form Section */}
//       <Container className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
//         <Card className="shadow-lg border-0 p-4" style={{ maxWidth: "450px", width: "100%", borderRadius: "16px" }}>
//           <h4 className="fw-bold text-center text-primary mb-3">
//             Request for Admin Access
//           </h4>
//           <p className="text-muted text-center mb-4 small">
//             Fill out the form below to request administrative privileges.
//           </p>

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3" controlId="name">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your full name"
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="email">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your institutional email"
//               />
//             </Form.Group>

//             <Form.Group className="mb-4" controlId="department">
//               <Form.Label>Department</Form.Label>
//               <Form.Control
//                 name="department"
//                 value={form.department}
//                 onChange={handleChange}
//                 required
//                 placeholder="Department name (e.g., CSE)"
//               />
//             </Form.Group>

//             <div className="d-grid">
//               <Button
//                 variant="primary"
//                 type="submit"
//                 className="fw-semibold py-2"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Spinner animation="border" size="sm" className="me-2" />
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit Request"
//                 )}
//               </Button>
//             </div>
//           </Form>

//           {message && (
//             <p
//               className={`mt-3 text-center fw-semibold ${
//                 message.startsWith("✅") ? "text-success" : "text-danger"
//               }`}
//             >
//               {message}
//             </p>
//           )}

//           <div className="text-center mt-3">
//             <small>
//               Already an admin?{" "}
//               <Link to="/login-admin" className="text-decoration-none fw-semibold">
//                 Go to Admin Login
//               </Link>
//             </small>
//           </div>
//         </Card>
//       </Container>

//       {/* Footer */}
//       <footer className="bg-dark text-white text-center py-3 mt-auto">
//         <small>© {new Date().getFullYear()} NIT Calicut — Job Portal | Designed by Team 6</small>
//       </footer>
//     </div>
//   );
// });

// export default RequestAdmin;
