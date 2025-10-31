// symbolmap.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('symbol-map');
  if (!container) return;

  const map = L.map(container).setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // === RANDOM VISITOR GENERATOR ===
  // List of ~50 major cities worldwide (lat, lng, country) for realistic random data
  const cities = [
    // Asia
    { lat: 22.3193, lng: 114.1694, country: 'Hong Kong' },
    { lat: 35.6895, lng: 139.6917, country: 'Tokyo' },
    { lat: 39.9042, lng: 116.4074, country: 'Beijing' },
    { lat: 1.3521, lng: 103.8198, country: 'Singapore' },
    { lat: 28.6139, lng: 77.2090, country: 'New Delhi' },
    { lat: 35.6762, lng: 139.6503, country: 'Yokohama' },
    { lat: 31.2304, lng: 121.4737, country: 'Shanghai' },
    { lat: 22.5431, lng: 114.0578, country: 'Shenzhen' },
    { lat: 13.7563, lng: 100.5018, country: 'Bangkok' },
    { lat: 3.1390, lng: 101.6869, country: 'Kuala Lumpur' },
    // Europe
    { lat: 51.5074, lng: -0.1278, country: 'London' },
    { lat: 48.8566, lng: 2.3522, country: 'Paris' },
    { lat: 52.5200, lng: 13.4050, country: 'Berlin' },
    { lat: 41.9028, lng: 12.4964, country: 'Rome' },
    { lat: 55.7558, lng: 37.6173, country: 'Moscow' },
    { lat: 59.3293, lng: 18.0686, country: 'Stockholm' },
    { lat: 50.8503, lng: 4.3517, country: 'Brussels' },
    { lat: 45.4642, lng: 9.1900, country: 'Milan' },
    { lat: 40.4168, lng: -3.7038, country: 'Madrid' },
    { lat: 38.7223, lng: -9.1393, country: 'Lisbon' },
    // North America
    { lat: 40.7128, lng: -74.0060, country: 'New York' },
    { lat: 34.0522, lng: -118.2437, country: 'Los Angeles' },
    { lat: 41.8781, lng: -87.6298, country: 'Chicago' },
    { lat: 29.7604, lng: -95.3698, country: 'Houston' },
    { lat: 43.6532, lng: -79.3832, country: 'Toronto' },
    { lat: 45.4215, lng: -75.6972, country: 'Ottawa' },
    { lat: 51.0447, lng: -114.0719, country: 'Calgary' },
    { lat: 39.7392, lng: -104.9903, country: 'Denver' },
    { lat: 32.7767, lng: -96.7970, country: 'Dallas' },
    { lat: 35.2271, lng: -80.8431, country: 'Charlotte' },
    // South America
    { lat: -23.5505, lng: -46.6333, country: 'São Paulo' },
    { lat: -22.9068, lng: -43.1729, country: 'Rio de Janeiro' },
    { lat: -12.0464, lng: -77.0428, country: 'Lima' },
    { lat: 4.7109, lng: -74.0721, country: 'Bogotá' },
    { lat: -34.6037, lng: -58.3816, country: 'Buenos Aires' },
    { lat: -33.4489, lng: -70.6693, country: 'Santiago' },
    { lat: 6.2442, lng: -75.5812, country: 'Medellín' },
    { lat: -16.4897, lng: -68.1193, country: 'La Paz' },
    { lat: 10.4806, lng: -66.9036, country: 'Caracas' },
    { lat: -0.1807, lng: -78.4678, country: 'Quito' },
    // Africa
    { lat: 30.0444, lng: 31.2357, country: 'Cairo' },
    { lat: 6.9271, lng: 79.8612, country: 'Colombo' }, // Note: Sri Lanka, but for Africa-like
    { lat: 51.1657, lng: 71.4278, country: 'Nur-Sultan' }, // Adjust for Africa: Lagos
    { lat: 6.5244, lng: 3.3792, country: 'Lagos' },
    { lat: -33.9249, lng: 18.4241, country: 'Cape Town' },
    { lat: 9.0579, lng: 40.4897, country: 'Addis Ababa' },
    { lat: 5.6037, lng: -0.1870, country: 'Accra' },
    { lat: 33.5731, lng: -7.5898, country: 'Casablanca' },
    { lat: 29.3759, lng: 47.9774, country: 'Kuwait City' }, // Middle East
    { lat: 24.7136, lng: 46.6753, country: 'Riyadh' },
    // Oceania
    { lat: -33.8688, lng: 151.2093, country: 'Sydney' },
    { lat: -37.8136, lng: 144.9631, country: 'Melbourne' },
    { lat: -41.2865, lng: 174.7762, country: 'Wellington' },
    { lat: -21.1151, lng: 55.5364, country: 'Saint-Denis' },
    { lat: -9.4372, lng: 147.6031, country: 'Port Moresby' },
    // Add more for diversity...
    { lat: 49.2827, lng: -123.1207, country: 'Vancouver' },
    { lat: 55.6761, lng: 12.5683, country: 'Copenhagen' },
    { lat: 64.1463, lng: -21.9426, country: 'Reykjavik' },
    { lat: 42.6977, lng: 23.3219, country: 'Sofia' },
    { lat: 7.0926, lng: -73.1104, country: 'Bucaramanga' },
  ];

  // Layer group for visitor symbols
  const visitorLayer = L.layerGroup().addTo(map);

  // === DYNAMIC "REAL-TIME" UPDATE FUNCTION ===
  function addRandomVisitor() {
    // Pick random city
    const city = cities[Math.floor(Math.random() * cities.length)];
    const { lat, lng, country } = city;

    // Simulate "timestamp" for size (recent = larger)
    const now = Date.now();
    const ageMinutes = Math.random() * 30; // Up to 30 min old
    const ageMs = ageMinutes * 60 * 1000;
    const timestamp = now - ageMs;

    // Symbol: Circle marker (orange for recent, gray for older)
    const opacity = 0.8 + (0.2 * (ageMs / (30 * 60 * 1000))); // Fade slightly for older
    const fillOpacity = 0.6 + (0.4 * (ageMs / (30 * 60 * 1000))); // Larger fill for recent
    const radius = 8 + (Math.random() * 12); // 8-20px size variation

    const marker = L.circleMarker([lat, lng], {
      radius: radius,
      fillColor: ageMs < 5 * 60 * 1000 ? '#ff9800' : '#9e9e9e', // Orange if <5min, gray otherwise
      color: '#333',
      weight: 1,
      opacity: opacity,
      fillOpacity: fillOpacity,
    }).addTo(visitorLayer);

    // Tooltip with "visitor" info (random data)
    marker.bindTooltip(`
      <strong>New Visitor</strong><br>
      Location: ${country}<br>
      Time: ${new Date(timestamp).toLocaleTimeString()}<br>
      Device: ${['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)]}<br>
      Pages Viewed: ${Math.floor(Math.random() * 5) + 1}
    `, {
      direction: 'top',
      className: 'visitor-tooltip',
    });

    // Optional: Add subtle pulse animation for newest visitors
    if (ageMs < 2 * 60 * 1000) { // <2 min
      marker.pulse = setInterval(() => {
        marker.setStyle({ radius: radius * 1.2 });
        setTimeout(() => marker.setStyle({ radius: radius }), 500);
      }, 1000);
    }
  }

  // === START REAL-TIME SIMULATION ===
  addRandomVisitor(); // Initial visitor
  const interval = setInterval(addRandomVisitor, 3000); // Add new visitor every 3 seconds

  // Clean up old visitors (keep last 50 for performance)
  setInterval(() => {
    const children = visitorLayer.getLayers();
    if (children.length > 50) {
      // Remove oldest (smallest radius as proxy)
      children.sort((a, b) => a.options.radius - b.options.radius);
      visitorLayer.removeLayer(children[0]);
      // Clear pulse if any
      if (children[0].pulse) clearInterval(children[0].pulse);
    }
  }, 10000); // Check every 10s

  // === LEGEND ===
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend');
    div.style.background = 'rgba(255,255,255,0.95)';
    div.style.padding = '12px 16px';
    div.style.borderRadius = '8px';
    div.style.fontSize = '14px';
    div.style.fontWeight = 'bold';
    div.style.boxShadow = '0 0 10px rgba(0,0,0,0.25)';
    div.innerHTML = `
      <strong>Live Visitors</strong><br>
      <i style="background:#ff9800; width:12px; height:12px; border-radius:50%; display:inline-block; margin-right:6px;"></i> Recent (<5min)<br>
      <i style="background:#9e9e9e; width:8px; height:8px; border-radius:50%; display:inline-block; margin-right:6px;"></i> Older<br>
      <small>Random simulation – ${new Date().toLocaleString()}</small>
    `;
    return div;
  };
  legend.addTo(map);

  // Add CSS for tooltips
  const style = document.createElement('style');
  style.innerHTML = `
    .visitor-tooltip { font-size: 12px; max-width: 200px; }
  `;
  document.head.appendChild(style);
});