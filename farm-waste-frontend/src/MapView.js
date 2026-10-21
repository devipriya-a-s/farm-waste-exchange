import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// DIYA'S PART: shows every listing that has latitude + longitude as a pin on a map.
// Uses Leaflet + OpenStreetMap: free, no API key, no credit card.
//
// Props:
//   listings  - array of listings (from GET /api/listings)
//   onSelect  - function called when someone clicks "View details" in a pin's popup
function MapView({ listings, onSelect }) {
  const boxRef = useRef(null);   // the <div> the map is drawn into
  const mapRef = useRef(null);   // the Leaflet map object
  const layerRef = useRef(null); // a group that holds all the pins

  // 1) Create the map once.
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map(boxRef.current).setView([10.5, 76.5], 7); // centre on Kerala
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // 2) Redraw the pins whenever the list of listings changes.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const points = [];

    (listings || []).forEach((item) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      if (!lat || !lng) return; // skip listings without coordinates

      points.push([lat, lng]);

      const pin = L.circleMarker([lat, lng], {
        radius: 10,
        color: "#2c5f2d",
        fillColor: "#6b9b37",
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(layer);

      // Popup is built with textContent (not HTML strings) so typed text can't inject code.
      const box = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.wasteType || "Listing";
      const info = document.createElement("div");
      info.textContent =
        item.quantity + " kg · " + (item.location || "") +
        " · " + (item.price > 0 ? "₹" + item.price : "Free");
      box.appendChild(title);
      box.appendChild(info);

      if (onSelect) {
        const btn = document.createElement("button");
        btn.textContent = "View details";
        btn.style.marginTop = "6px";
        btn.onclick = () => onSelect(item);
        box.appendChild(btn);
      }
      pin.bindPopup(box);
    });

    if (points.length > 0) {
      map.fitBounds(points, { padding: [30, 30], maxZoom: 12 });
    }
  }, [listings, onSelect]);

  return <div ref={boxRef} className="map-box" />;
}

export default MapView;
