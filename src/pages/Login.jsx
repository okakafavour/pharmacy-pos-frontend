import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://pharmacy-pos-backend-some.onrender.com/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login Failed");
      console.log(err);
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

          <div className="tabs">
            <button className="active-tab">
              Sign In
            </button>

            <button>
              Register
            </button>
          </div>

          <h1 className="welcome">
            Welcome back 👋
          </h1>

          <p>
            Sign in to your Mdawa account to continue
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label">
            Password
          </label>

          <input
            className="login-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="login-button"
            onClick={handleLogin}
          >
            Sign In
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;