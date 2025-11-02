import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "./Home.css"; // reuse animations, cta-btn, theme classes

const AdminLogin = React.memo(function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;
      setLoading(true);
      setErrorMsg("");

      try {
        await login("admin", email.trim(), password);
        navigate("/dashboard-admin");
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
            <i className="bi bi-shield-lock me-2"></i> Admin Login
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
                className="form-control"
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
                className="form-control"
                placeholder="Password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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

















































// import React, { useState, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { Spinner } from "react-bootstrap";
// import { useAuth } from "../context/AuthContext";

// const AdminLogin = React.memo(function AdminLogin() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   // Optimized login handler
//   const handleLogin = useCallback(
//     async (e) => {
//       e.preventDefault();
//       if (loading) return;
//       setLoading(true);
//       setErrorMsg("");

//       try {
//         const admin = await login("admin", email.trim(), password);
//         if (admin) {
        
//           navigate("/admin");
//         }
//       } catch (err) {
//         console.error("Admin login error:", err);
//         const message =
//           err.response?.data?.message || "Invalid admin credentials.";
//         setErrorMsg(message);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [email, password, login, navigate, loading]
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
//           <div
//             className="collapse navbar-collapse justify-content-end"
//             id="navbarNav"
//           >
//             <ul className="navbar-nav">
//               <li className="nav-item">
//                 <Link className="nav-link" to="/">
//                   Home
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link active" to="/login-admin">
//                   Admin Login
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Login Form */}
//       <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
//         <div
//           className="card shadow-lg border-0 p-4"
//           style={{ width: "350px", borderRadius: "16px" }}
//         >
//           <h4 className="text-center mb-4 fw-bold text-danger">Admin Login</h4>

//           {errorMsg && (
//             <div className="alert alert-danger py-2" role="alert">
//               {errorMsg}
//             </div>
//           )}

//           <form onSubmit={handleLogin}>
//             <div className="mb-3">
//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="Admin Email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//               />
//             </div>
//             <div className="mb-3">
//               <input
//                 type="password"
//                 className="form-control"
//                 placeholder="Password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//               />
//             </div>
//             <button
//               type="submit"
//               className="btn btn-danger w-100 mb-3 fw-semibold"
//               disabled={loading || !email.trim() || !password.trim()}
//             >
//               {loading ? (
//                 <>
//                   <Spinner animation="border" size="sm" className="me-2" />
//                   Logging in...
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </button>
//           </form>

//           <div className="text-center mt-2">
//             <small>
//               Want to become an admin?{" "}
//               <Link
//                 to="/request-admin"
//                 className="fw-semibold text-decoration-none text-primary"
//               >
//                 Request Access
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

// export default AdminLogin;
