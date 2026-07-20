import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const API =
    "https://pharmacy-pos-backend-some.onrender.com";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/login`, {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("userId", res.data.user.id);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT PANEL */}
      <div className="login-left">
        <span className="badge">
          💊 Prescription Ready
        </span>

        <div className="doctor-illustration">
          👨‍⚕️
        </div>

        <h1>Mdawa</h1>

        <p>
          Modern Pharmacy Management System for
          dispensing, inventory management,
          sales tracking and reporting.
        </p>

        <span className="verify-badge">
          📋 NHIF Verified
        </span>

        <div className="floating-badge left-badge">
          💉 Stock Updated
        </div>

        <div className="floating-badge right-badge">
          ✅ Sale Complete
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-card">
          <div className="logo-area">
            <h2>💊 Mdawa</h2>
            <span>PHARMACY MANAGEMENT SYSTEM</span>
          </div>

          {/* <div className="tabs">
            <button className="active-tab">
              Sign In
            </button>

            <button disabled>
              Register
            </button>
          </div> */}

          <h1 className="welcome">
            Welcome back 👋
          </h1>

          <p>
            Sign in to your Mdawa account to
            continue
          </p>

          <div className="roles">
            <div className="role active">
              👨‍⚕️
              <h4>Admin</h4>
              <small>Full access</small>
            </div>

            <div className="role">
              💊
              <h4>Pharmacist</h4>
              <small>Dispensing</small>
            </div>

            <div className="role">
              🧾
              <h4>Cashier</h4>
              <small>POS only</small>
            </div>

            <div className="role">
              📊
              <h4>Manager</h4>
              <small>Reports</small>
            </div>
          </div>

          <label className="login-label">
            Email Address
          </label>

          <input
            className="login-input"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />

          <label className="login-label">
            Password
          </label>

          <input
            className="login-input"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />

          <button
            className={`login-button ${
              loading ? "loading" : ""
            }`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;