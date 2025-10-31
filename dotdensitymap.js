// dotdensitymap.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('map');
  if (!container) return;

  // Initialise map
  const map = L.map(container).setView([22.3193, 114.1694], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  // Your places
  const places = [
    { name: 'Shau Kei Wan',  coord: [22.2799, 114.2292], level: 'most' },
    { name: 'Siu Sai Wan',   coord: [22.2650, 114.2480], level: 'frequent' },
    { name: 'Tiu Keng Leng', coord: [22.3040, 114.2530], level: 'frequent' },
    { name: 'Kowloon Tong',  coord: [22.3370, 114.1760], level: 'frequent' },
    { name: 'Mong Kok',      coord: [22.3178, 114.1695], level: 'sometimes' },
    { name: 'Wan Chai',      coord: [22.2790, 114.1730], level: 'sometimes' },
    { name: 'Sham Shui Po',  coord: [22.3300, 114.1620], level: 'sometimes' },
    { name: 'Causeway Bay',  coord: [22.2800, 114.1850], level: 'sometimes' },
  ];

  // INCREASED DOT COUNT & SIZE
  const settings = {
    most:      { dotsPerVisit: 120, radius: 4.0, color: '#d32f2f' }, // 4× more, 1.8× bigger
    frequent:  { dotsPerVisit: 50,  radius: 3.2, color: '#f57c00' }, // 4× more, 1.8× bigger
    sometimes: { dotsPerVisit: 20,  radius: 2.6, color: '#388e3c' }, // 5× more, 1.9× bigger
  };

  // Jitter function (slightly larger spread to avoid overlap)
  const jitter = (center, max = 0.009) => {
    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * max;
    return [
      center[0] + dist * Math.cos(angle),
      center[1] + dist * Math.sin(angle)
    ];
  };

  // Draw dots
  places.forEach(p => {
    const cfg = settings[p.level];
    for (let i = 0; i < cfg.dotsPerVisit; i++) {
      const latlng = jitter(p.coord, 0.009);
      L.circleMarker(latlng, {
        radius: cfg.radius,
        fillColor: cfg.color,
        color: '#000',
        weight: 0.6,
        opacity: 1,
        fillOpacity: 0.9,
      })
      .bindTooltip(`${p.name}<br><strong>${p.level.toUpperCase()}</strong>`, {
        permanent: false,
        direction: 'top',
        offset: [0, -cfg.radius]
      })
      .addTo(map);
    }
  });

  // Updated legend with bigger swatches
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend');
    div.style.background = 'rgba(255,255,255,0.95)';
    div.style.padding = '10px 14px';
    div.style.borderRadius = '6px';
    div.style.fontSize = '14px';
    div.style.fontWeight = 'bold';
    div.style.boxShadow = '0 0 8px rgba(0,0,0,0.2)';

    const levels = [
      { label: 'Most Frequent',   color: settings.most.color,      size: 14 },
      { label: 'Frequent',        color: settings.frequent.color,  size: 12 },
      { label: 'Sometimes',       color: settings.sometimes.color, size: 10 },
    ];

    div.innerHTML = '<strong>My Visit Frequency</strong><br>' +
      levels.map(l => `
        <i style="
          background:${l.color};
          width:${l.size}px; height:${l.size}px;
          border-radius:50%; display:inline-block;
          margin-right:6px; vertical-align:middle;
        "></i>
        ${l.label}<br>
      `).join('');
    return div;
  };
  legend.addTo(map);
});