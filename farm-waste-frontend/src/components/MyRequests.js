import React, { useState, useEffect } from "react";
import { api, asList } from "../api";

// Buyer only. GET /api/contacts/sent
function MyRequests() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/contacts/sent", { auth: true })
      .then((d) => setItems(asList(d)))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="page">
      <h2>My requests</h2>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && !error && <p>You have not contacted any farmer yet.</p>}

      <div className="listing-grid">
        {items.map((c) => (
          <div key={c._id} className="listing-card static">
            <h3>{(c.listing && c.listing.wasteType) || "Listing"}</h3>
            <p>To: {(c.farmer && c.farmer.name) || "Farmer"}</p>
            <p>"{c.message}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRequests;
