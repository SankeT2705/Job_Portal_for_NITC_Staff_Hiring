import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import "./Home.css"; // for theme styles and cta button

const UserRegister = React.memo(function UserRegister() {
  const navigate = useNavigate();
  const apiBase = useMemo(
    () => process.env.REACT_APP_API_URL || "http://localhost:5000",
    []
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // theme handling
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
        const res = await axios.post(`${apiBase}/api/auth/register`, formData);
        if (res.data) {
          navigate("/login-user");
        }
      } catch (err) {
        console.error("Registration failed:", err);
        const msg =
          err.response?.data?.message || "❌ Registration failed. Try again.";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    },
    [apiBase, formData, navigate, loading]
  );

  const heroSectionStyle = useMemo(
    () => ({
      backgroundImage: `url('${
        isDarkMode
          ? "/images/UserLoginDark.png"
          : "/images/UserLoginDark.png"
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
                  to="/register-user"
                >
                  Register
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
        {/* Overlays */}
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

        {/* Register Card */}
        <div
          className="card shadow-lg border-0 p-4 text-start position-relative"
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
            zIndex: 5,
          }}
        >
          <h4
            className={`text-center mb-4 fw-bold ${
              isDarkMode ? "text-light" : "text-primary"
            }`}
          >
            <i className="bi bi-person-plus me-2"></i> User Registration
          </h4>

          {errorMsg && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} noValidate>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="cta-btn w-100 fw-semibold py-2"
              disabled={
                loading ||
                !formData.name.trim() ||
                !formData.email.trim() ||
                !formData.password.trim()
              }
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <small className={isDarkMode ? "text-muted-dark" : "text-muted"}>
              Already have an account?{" "}
              <Link to="/login-user" className="fw-semibold text-decoration-none">
                Login
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

export default UserRegister;

















































// import React, { useState, useCallback, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { Spinner } from "react-bootstrap";
// import axios from "axios";


// const UserRegister = React.memo(function UserRegister() {
//   const navigate = useNavigate();
//   const apiBase = useMemo(
//     () => process.env.REACT_APP_API_URL || "http://localhost:5000",
//     []
//   );

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   }, []);

//   const handleRegister = useCallback(
//     async (e) => {
//       e.preventDefault();
//       if (loading) return;

//       setLoading(true);
//       setErrorMsg("");

//       try {
//         const res = await axios.post(`${apiBase}/api/auth/register`, formData);

//         if (res.data) {
          
//           navigate("/login-user");
//         }
//       } catch (err) {
//         console.error("Registration failed:", err);
//         const msg =
//           err.response?.data?.message || "❌ Registration failed. Try again.";
//         setErrorMsg(msg);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [apiBase, formData, navigate, loading]
//   );

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
//                 <Link className="nav-link active" to="/register-user">
//                   Register
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Register Card */}
//       <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
//         <div className="card shadow-lg border-0 p-4" style={{ width: "360px", borderRadius: "16px" }}>
//           <h4 className="text-center mb-4 fw-bold text-success">
//             User Registration
//           </h4>

//           {errorMsg && (
//             <div className="alert alert-danger py-2" role="alert">
//               {errorMsg}
//             </div>
//           )}

//           <form onSubmit={handleRegister} noValidate>
//             <div className="mb-3">
//               <input
//                 type="text"
//                 name="name"
//                 className="form-control"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <input
//                 type="email"
//                 name="email"
//                 className="form-control"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <input
//                 type="password"
//                 name="password"
//                 className="form-control"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 minLength={6}
//               />
//             </div>
//             <button
//               type="submit"
//               className="btn btn-success w-100 mb-3 fw-semibold"
//               disabled={
//                 loading ||
//                 !formData.name.trim() ||
//                 !formData.email.trim() ||
//                 !formData.password.trim()
//               }
//             >
//               {loading ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Registering...
//                 </>
//               ) : (
//                 "Register"
//               )}
//             </button>
//           </form>

//           <div className="text-center">
//             <small>
//               Already have an account?{" "}
//               <Link to="/login-user" className="fw-semibold text-decoration-none">
//                 Login
//               </Link>
//             </small>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-dark text-white text-center py-3 mt-auto">
//         <small>
//           © {new Date().getFullYear()} NITC Job Portal | Designed by Team 6
//         </small>
//       </footer>
//     </div>
//   );
// });

// export default UserRegister;
