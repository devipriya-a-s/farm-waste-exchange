import React, { useState } from "react";
import { api, saveAuth } from "../api";

// Calls POST /api/auth/login, then saves the token (the "ID card").
function Login({ onLogin, goTo }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await api("/api/auth/login", { method: "POST", body: form });
      saveAuth(data);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h2>Login</h2>
      <form className="waste-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary">Login</button>
        <p>
          New here?{" "}
          <a href="#register" onClick={(e) => { e.preventDefault(); goTo("register"); }}>
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
