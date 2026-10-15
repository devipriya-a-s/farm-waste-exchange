import React, { useState } from "react";
import { api } from "../api";

// Calls POST /api/auth/register
function Register({ goTo }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "farmer",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/api/auth/register", { method: "POST", body: form });
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (done) {
    return (
      <div className="page">
        <h2>✅ Registered successfully</h2>
        <p>You can login now.</p>
        <button className="btn btn-primary" onClick={() => goTo("login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Create account</h2>
      <form className="waste-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <label>
          I am a
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="farmer">Farmer (I have waste)</option>
            <option value="buyer">Buyer (I need waste)</option>
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default Register;
