import React, { useState, useEffect } from "react";
import { api, asList } from "../api";

// Farmer only. GET /api/contacts/received  (the farmer's "inbox")
function Received() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/contacts/received", { auth: true })
      .then((d) => setItems(asList(d)))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="page">
      <h2>Requests received</h2>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && !error && <p>No buyer has contacted you yet.</p>}

      <div className="listing-grid">
        {items.map((c) => (
          <div key={c._id} className="listing-card static">
            <h3>{(c.listing && c.listing.wasteType) || "Your listing"}</h3>
            <p>
              <strong>From:</strong> {(c.buyer && c.buyer.name) || "A buyer"}
            </p>
            <p>"{c.message}"</p>
            <p><strong>Call:</strong> {c.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Received;
