// dotdensitymap.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('density-map');
  if (!container) return;

  const map = L.map(container).setView([22.3193, 114.1694], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  // === PRECISE ANCHOR POINTS (ORANGE) ===
  const anchorPoints = [
    { coord: [22.3375, 114.1725], name: 'CityU Main Campus' },     // Anchor 1
    { coord: [22.3360, 114.1738], name: 'Run Run Shaw CMC' },      // Anchor 2
  ];

  // === HIGH-DENSITY HOTSPOTS (no names shown) ===
  const hotspots = [
    // MOST FREQUENT – TUNG YUK COURT
    { coord: [22.2798, 114.2275], level: 'most' },

    // FREQUENT – ORBIT AROUND CITYU + CMC (Kowloon Tong)
    { coord: [22.3375, 114.1725], level: 'frequent' }, // CityU
    { coord: [22.3360, 114.1738], level: 'frequent' }, // CMC
    // Extra tight clusters near anchors
    { coord: [22.3373, 114.1728], level: 'frequent' },
    { coord: [22.3362, 114.1740], level: 'frequent' },

    // FREQUENT – TIU KENG LENG (HKDI) – very near CMC-style cluster
    { coord: [22.3045, 114.2600], level: 'frequent' },
    { coord: [22.3043, 114.2602], level: 'frequent' },
    { coord: [22.3047, 114.2598], level: 'frequent' },

    // FREQUENT – SIU SAI WAN (CFSS)
    { coord: [22.2670, 114.2495], level: 'frequent' },

    // SOMETIMES
    { coord: [22.3178, 114.1695], level: 'sometimes' }, // Mong Kok
    { coord: [22.2790, 114.1730], level: 'sometimes' }, // Wan Chai
    { coord: [22.3300, 114.1620], level: 'sometimes' }, // Sham Shui Po
    { coord: [22.2800, 114.1850], level: 'sometimes' }, // Causeway Bay
  ];

  // === DOT SETTINGS ===
  const settings = {
    most:      { dots: 500, radius: 4.2, color: '#d32f2f', jitter: 0.0022 },
    frequent:  { dots:  70, radius: 3.4, color: '#f57c00', jitter: 0.0018 }, // TIGHT
    sometimes: { dots:  80, radius: 2.8, color: '#388e3c', jitter: 0.0095 },
  };

  const jitter = (center, max) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * max;
    return [center[0] + dist * Math.cos(angle), center[1] + dist * Math.sin(angle)];
  };

  // === 1. DRAW PRECISE ORANGE ANCHOR DOTS (NO JITTER) ===
  anchorPoints.forEach(p => {
    L.circleMarker(p.coord, {
      radius: 6.0,
      fillColor: '#f57c00',
      color: '#000',
      weight: 1.2,
      opacity: 1,
      fillOpacity: 1.0,
    }).addTo(map);
  });

  // === 2. DRAW HIGH-DENSITY CLOUDS (with tight jitter) ===
  hotspots.forEach(h => {
    const cfg = settings[h.level];
    // Skip anchor points to avoid double-drawing
    const isAnchor = anchorPoints.some(a => 
      Math.abs(a.coord[0] - h.coord[0]) < 0.0001 && 
      Math.abs(a.coord[1] - h.coord[1]) < 0.0001
    );
    if (isAnchor) return;

    for (let i = 0; i < cfg.dots; i++) {
      const latlng = jitter(h.coord, cfg.jitter);
      L.circleMarker(latlng, {
        radius: cfg.radius,
        fillColor: cfg.color,
        color: '#000',
        weight: 0.7,
        opacity: 1,
        fillOpacity: 0.92,
      }).addTo(map);
    }
  });

  // === LEGEND ===
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend');
    div.style.background = 'rgba(255,255,255,0.96)';
    div.style.padding = '12px 16px';
    div.style.borderRadius = '8px';
    div.style.fontSize = '15px';
    div.style.fontWeight = 'bold';
    div.style.boxShadow = '0 0 10px rgba(0,0,0,0.25)';

    div.innerHTML = `
      <strong>Visit Frequency</strong><br>
      <i style="background:#d32f2f; width:16px; height:16px; border-radius:50%; display:inline-block; margin-right:8px;"></i> Most<br>
      <i style="background:#f57c00; width:14px; height:14px; border-radius:50%; display:inline-block; margin-right:8px;"></i> Frequent<br>
      <i style="background:#388e3c; width:12px; height:12px; border-radius:50%; display:inline-block; margin-right:8px;"></i> Sometimes
    `;
    return div;
  };
  legend.addTo(map);
});