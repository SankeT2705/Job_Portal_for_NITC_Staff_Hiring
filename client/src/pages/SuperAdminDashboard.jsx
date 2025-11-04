import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Table, Button, Container, Spinner, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Home.css";

/** ==============================
 *   AXIOS CLIENT (Reusable)
 *  ============================== */
const useAxiosClient = () => {
  const apiBase = useMemo(
    () => process.env.REACT_APP_API_URL || "http://localhost:5000",
    []
  );
  return useMemo(
    () =>
      axios.create({
        baseURL: apiBase,
        timeout: 10000,
      }),
    [apiBase]
  );
};

const SuperAdminDashboard = React.memo(function SuperAdminDashboard() {
  const api = useAxiosClient();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("nitc-theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncTheme = () => {
      const storedTheme = window.localStorage.getItem("nitc-theme");
      setIsDarkMode(storedTheme === "dark");
    };
    syncTheme();
    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("nitc-theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  /** ====== STATE ====== */
  const [requests, setRequests] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // For controlled refresh

  /** ====== TOAST ALERTS ====== */
  const pushAlert = useCallback((message, variant = "info", timeout = 4000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setAlerts((prev) => [...prev, { id, message, variant }]);
    if (timeout)
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }, timeout);
  }, []);

  /** ====== FETCH REQUESTS + ADMINS ====== */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/superadmin/requests");

      if (data) {
        const pending = (data.requests || []).filter(
          (req) => req.status === "Pending"
        );
        setRequests(pending);
        setAdmins(data.admins || []);
      }
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
      pushAlert(
        "⚠️ Failed to load data. Please check your network or server.",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  }, [api, pushAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  /** ====== HANDLE ACCEPT / REJECT ====== */
  const handleAction = useCallback(
    async (id, action) => {
      try {
        setLoading(true);
        const { data } = await api.post(`/api/superadmin/handle/${id}`, {
          action,
        });
        pushAlert(
          data?.message || `✅ Request ${action}ed successfully.`,
          "success"
        );
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error("❌ Error handling request:", err);
        pushAlert("❌ Failed to update admin request.", "danger");
      } finally {
        setLoading(false);
      }
    },
    [api, pushAlert]
  );

  /** ====== HANDLE DELETE ADMIN ====== */
  const handleDelete = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const { data } = await api.delete(
          `/api/superadmin/delete-admin/${id}`
        );
        pushAlert(data?.message || "✅ Admin deleted successfully.", "success");
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error("❌ Error deleting admin:", err);
        pushAlert("⚠️ Failed to delete admin.", "danger");
      } finally {
        setLoading(false);
      }
    },
    [api, pushAlert]
  );

  const backgroundUrl = useMemo(
    () =>
      `${process.env.PUBLIC_URL}${
        isDarkMode
          ? "/images/superAdminDark.png"
          : "/images/superAdminLight.png"
      }`,
    [isDarkMode]
  );

  const pageStyle = useMemo(
    () => ({
      backgroundImage: `url('${backgroundUrl}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundColor: isDarkMode ? "#020817" : "#092148",
      transition: "background-image 0.6s ease, background-color 0.6s ease",
    }),
    [backgroundUrl, isDarkMode]
  );

  /** ====== RENDER ====== */
  return (
    <div
      className={`d-flex flex-column min-vh-100 ${
        isDarkMode ? "home-dark" : "home-light"
      }`}
      style={pageStyle}
    >
      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg nav-overlay ${
          isDarkMode ? "navbar-dark" : "navbar-light"
        }`}
      >
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
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav mb-2 mb-lg-0 align-items-lg-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="#">
                  Super Admin
                </Link>
              </li>
            </ul>
            <button
              type="button"
              className="theme-toggle ms-lg-3 mt-3 mt-lg-0"
              onClick={toggleTheme}
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <Container className="flex-grow-1 py-5">
        <Card className="shadow-lg border-0 p-4 surface-card surface-card--glass">
          <h3 className="fw-bold text-primary mb-4 text-center">
            Super Admin Dashboard
          </h3>

          {loading && (
            <div className="text-center my-3">
              <Spinner animation="border" role="status" />
            </div>
          )}

          {/* Pending Admin Requests */}
          <h5 className="mt-4 text-primary">Pending Admin Requests</h5>
          <Table responsive className="surface-table align-middle text-center mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-muted py-3">
                    No pending admin requests.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.name}</td>
                    <td>{req.email}</td>
                    <td>{req.department}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleAction(req._id, "accept")}
                        disabled={loading}
                        className="me-2"
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(req._id, "reject")}
                        disabled={loading}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Current Admins */}
          <h5 className="mt-5 text-primary">Current Admins</h5>
          <Table responsive className="surface-table align-middle text-center mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-muted py-3">
                    No admins found.
                  </td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm._id}>
                    <td>{adm.name}</td>
                    <td>{adm.email}</td>
                    <td>{adm.department}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(adm._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </Container>

      {/* Toast Notifications */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
        {alerts.map((t) => (
          <div
            key={t.id}
            className={`toast show align-items-center text-white bg-${
              t.variant === "danger"
                ? "danger"
                : t.variant === "success"
                ? "success"
                : "info"
            } border-0 mb-2`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() =>
                  setAlerts((a) => a.filter((x) => x.id !== t.id))
                }
                aria-label="Close"
              />
            </div>
          </div>
        ))}
      </div>

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

export default SuperAdminDashboard;
