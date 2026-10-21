import React, { useState, useEffect } from "react";
import { api, asList } from "../api";
import MapView from "./MapView";

// Public. GET /api/listings?wasteType=&location=&minQty=
function Search({ openListing }) {
  const [filters, setFilters] = useState({ wasteType: "", location: "", minQty: "" });
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const load = (f) => {
    const params = new URLSearchParams();
    if (f.wasteType) params.append("wasteType", f.wasteType);
    if (f.location) params.append("location", f.location);
    if (f.minQty) params.append("minQty", f.minQty);
    const qs = params.toString();
    setError("");
    api("/api/listings" + (qs ? "?" + qs : ""))
      .then((d) => setResults(asList(d)))
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load(filters);
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    load(filters);
  };

  return (
    <div className="page">
      <h2>Find agricultural waste</h2>

      <form className="filters" onSubmit={handleSearch}>
        <input name="wasteType" placeholder="Waste type (e.g. paddy)" value={filters.wasteType} onChange={handleChange} />
        <input name="location" placeholder="Location" value={filters.location} onChange={handleChange} />
        <input type="number" name="minQty" placeholder="Min kg" value={filters.minQty} onChange={handleChange} />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}
      {results.length === 0 && !error && <p>No matching listings found.</p>}

      {/* Map of the listings that have latitude + longitude (Diya's component) */}
      <MapView listings={results} onSelect={openListing} />

      <div className="listing-grid">
        {results.map((item) => (
          <div key={item._id} className="listing-card" onClick={() => openListing(item)}>
            <h3>{item.wasteType}</h3>
            <p>
              {item.quantity} kg · {item.location} · {item.price > 0 ? "₹" + item.price : "Free"}
            </p>
            {item.farmer && item.farmer.name && (
              <p className="listing-farmer">Posted by {item.farmer.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
