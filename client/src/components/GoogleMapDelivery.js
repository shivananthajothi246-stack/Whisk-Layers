import React, { useEffect, useRef } from "react";

// IMPORTANT: You must add your own Google Maps API key below.
// Get a free API key at https://console.cloud.google.com/apis/credentials (enable Maps JavaScript API and Directions API)
// Replace the string below with your actual API key.
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// Default bakery and customer locations (can be replaced with real data)
const DEFAULT_BAKERY = { lat: 13.0827, lng: 80.2707 }; // Chennai
const DEFAULT_CUSTOMER = { lat: 13.0358, lng: 80.2083 }; // Random Chennai location

export default function GoogleMapDelivery({ bakery = DEFAULT_BAKERY, customer = DEFAULT_CUSTOMER }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const routeRef = useRef([]);
  const [mapError, setMapError] = React.useState(false);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
      setMapError(true);
      return;
    }
    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onerror = () => setMapError(true);
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
    function initMap() {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: bakery,
          zoom: 13,
          mapTypeId: "roadmap",
        });
        // Directions
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({ suppressMarkers: true });
        directionsRenderer.setMap(map);
        directionsService.route(
          {
            origin: bakery,
            destination: customer,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") {
              directionsRenderer.setDirections(result);
              // Extract path for animation
              const route = result.routes[0].overview_path;
              routeRef.current = route;
              // Place bakery marker
              new window.google.maps.Marker({
                position: bakery,
                map,
                label: { text: "Bakery", color: "#8b1533", fontWeight: "bold" },
                icon: {
                  url: "https://maps.google.com/mapfiles/ms/icons/pink-dot.png",
                },
              });
              // Place customer marker
              new window.google.maps.Marker({
                position: customer,
                map,
                label: { text: "You", color: "#388e3c", fontWeight: "bold" },
                icon: {
                  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                },
              });
              // Place moving delivery marker
              markerRef.current = new window.google.maps.Marker({
                position: route[0],
                map,
                icon: {
                  url: "https://maps.google.com/mapfiles/ms/icons/cabs.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                },
              });
              animateMarker(route, markerRef.current);
            } else {
              setMapError(true);
            }
          }
        );
      } catch (e) {
        setMapError(true);
      }
    }
    function animateMarker(route, marker) {
      let i = 0;
      function move() {
        if (i < route.length) {
          marker.setPosition(route[i]);
          i++;
          setTimeout(move, 60); // speed of animation
        }
      }
      move();
    }
    // Cleanup
    return () => {
      if (mapRef.current) mapRef.current.innerHTML = "";
    };
  }, [bakery, customer]);

  if (mapError) {
    return (
      <div style={{ width: "100%", height: 220, borderRadius: 16, overflow: "hidden", border: "1px solid #f1e6e9", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ color: "#8b1533", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Google Maps not loaded</div>
        <div style={{ color: "#6b6b6b", fontSize: 14, textAlign: "center" }}>
          Please add your Google Maps API key in <code>src/components/GoogleMapDelivery.js</code>.<br />
          <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Get a free API key</a> and enable Maps JavaScript API and Directions API.
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 220, borderRadius: 16, overflow: "hidden", border: "1px solid #f1e6e9", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: 8, left: 8, background: "#fff", padding: "4px 12px", borderRadius: 8, fontWeight: 600, color: "#8b1533", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
        Delivery in progress...
      </div>
    </div>
  );
}
