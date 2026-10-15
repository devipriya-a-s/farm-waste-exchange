import React, { useState } from "react";
import { api } from "../api";

// One listing + (for buyers) a contact form.
// Calls POST /api/contacts  { listingId, message, phone }
function ListingDetail({ listing, user, goTo }) {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (!listing) {
    return (
      <div className="page">
        <p>No listing selected.</p>
        <button className="btn btn-primary" onClick={() => goTo("search")}>Back to search</button>
      </div>
    );
  }

  const role = user && user.role;

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/api/contacts", {
        method: "POST",
        body: { listingId: listing._id, message, phone },
        auth: true,
      });
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h2>{listing.wasteType}</h2>
      <p><strong>Quantity:</strong> {listing.quantity} kg</p>
      <p><strong>Price:</strong> {listing.price > 0 ? "₹" + listing.price : "Free"}</p>
      <p><strong>Location:</strong> {listing.location}</p>
      {listing.description && <p><strong>Details:</strong> {listing.description}</p>}
      {listing.farmer && listing.farmer.name && <p><strong>Farmer:</strong> {listing.farmer.name}</p>}
      <p><strong>Status:</strong> {listing.status || "available"}</p>

      <hr />

      {!user && (
        <p>
          Please{" "}
          <a href="#login" onClick={(e) => { e.preventDefault(); goTo("login"); }}>login</a>{" "}
          as a buyer to contact the farmer.
        </p>
      )}

      {role === "farmer" && <p>You are logged in as a farmer. Only buyers can send requests.</p>}

      {role === "buyer" && !sent && (
        <form className="waste-form" onSubmit={handleSend}>
          <h3>Contact the farmer</h3>
          <label>
            Message
            <textarea rows="3" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Need 300 kg" required />
          </label>
          <label>
            Your phone
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" type="submit">Send request</button>
        </form>
      )}

      {sent && <p className="success">✅ Request sent to the farmer.</p>}

      <button className="btn btn-secondary" onClick={() => goTo("search")}>Back to search</button>
    </div>
  );
}

export default ListingDetail;
