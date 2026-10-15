import React, { useState } from "react";
import { api } from "../api";

// Farmer only. Calls POST /api/listings with the token.
function AddListing({ goTo }) {
  const [form, setForm] = useState({
    wasteType: "",
    quantity: "",
    price: "0",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Fills latitude/longitude from the phone/laptop location (needed for Diya's map).
  const useMyLocation = () => {
    if (!navigator.geolocation) return setError("Location is not supported in this browser");
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        })),
      () => setError("Could not get your location. You can type it manually.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const body = {
      ...form,
      quantity: Number(form.quantity),
      price: Number(form.price),
    };
    if (form.latitude === "") delete body.latitude; else body.latitude = Number(form.latitude);
    if (form.longitude === "") delete body.longitude; else body.longitude = Number(form.longitude);

    try {
      await api("/api/listings", { method: "POST", body, auth: true });
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (done) {
    return (
      <div className="page">
        <h2>✅ Listing posted</h2>
        <p>Buyers can now see it.</p>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={() => goTo("mine")}>View my listings</button>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>Add another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>List your agricultural waste</h2>
      <form className="waste-form" onSubmit={handleSubmit}>
        <label>
          Waste type
          <select name="wasteType" value={form.wasteType} onChange={handleChange} required>
            <option value="">Select type</option>
            <option>Paddy Straw</option>
            <option>Coconut Husk</option>
            <option>Banana Stems</option>
            <option>Sugarcane Residue</option>
          </select>
        </label>
        <label>
          Quantity (kg)
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
        </label>
        <label>
          Price (0 = free)
          <input type="number" name="price" value={form.price} onChange={handleChange} />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Kottayam" required />
        </label>
        <div className="row">
          <label>
            Latitude
            <input name="latitude" value={form.latitude} onChange={handleChange} />
          </label>
          <label>
            Longitude
            <input name="longitude" value={form.longitude} onChange={handleChange} />
          </label>
        </div>
        <button type="button" className="btn btn-secondary" onClick={useMyLocation}>
          📍 Use my current location
        </button>
        <label>
          Description
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary">Post listing</button>
      </form>
    </div>
  );
}

export default AddListing;
