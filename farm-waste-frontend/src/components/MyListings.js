import React, { useState, useEffect } from "react";
import { api, asList } from "../api";

// Farmer only. GET /api/listings/mine, PUT and DELETE /api/listings/:id
function MyListings({ goTo }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    api("/api/listings/mine", { auth: true })
      .then((d) => setItems(asList(d)))
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const markSold = async (id) => {
    try {
      await api("/api/listings/" + id, { method: "PUT", body: { status: "sold" }, auth: true });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api("/api/listings/" + id, { method: "DELETE", auth: true });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="page">
      <h2>My listings</h2>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && !error && <p>You have not posted anything yet.</p>}

      <div className="listing-grid">
        {items.map((item) => (
          <div key={item._id} className="listing-card static">
            <h3>
              {item.wasteType}{" "}
              <span className={"badge " + (item.status === "sold" ? "sold" : "ok")}>
                {item.status || "available"}
              </span>
            </h3>
            <p>{item.quantity} kg · {item.location} · {item.price > 0 ? "₹" + item.price : "Free"}</p>
            <div className="form-actions">
              {item.status !== "sold" && (
                <button className="btn btn-secondary" onClick={() => markSold(item._id)}>Mark as sold</button>
              )}
              <button className="btn btn-danger" onClick={() => remove(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={() => goTo("add")}>+ Add listing</button>
    </div>
  );
}

export default MyListings;
