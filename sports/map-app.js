// Ops Center map-app.js — data-separated layers
// Sports stay in index.html / soc-data.json. Field + Entertainment load from data/field-sites.json
// Architecture lock: Sports default open; Field + Entertainment collapsed, sublayers default OFF

(function () {
  const loadingEl = document.getElementById('loading');

  function clearLoading() {
    if (loadingEl) loadingEl.remove();
  }

  function popupHtml(item) {
    const title = item.title || item.name || 'Event';
    const note = item.note || '';
    const tag = item.tag || item.sublayer || '';
    const url = item.url || item.official || '#';
    const city = item.city ? '<div style="font-size:0.75rem;color:#94a3b8;margin-bottom:4px">' + item.city + '</div>' : '';
    const dates = item.dates ? '<div style="font-size:0.72rem;color:#64748b;margin-bottom:6px">' + item.dates + '</div>' : '';
    return '<div style="min-width:180px;font-family:system-ui,sans-serif"><div style="font-size:0.7rem;font-weight:700;color:#f59e0b;text-transform:uppercase;margin-bottom:2px">' + tag + '</div><div style="font-weight:700;font-size:0.95rem;margin-bottom:4px">' + title + '</div>' + city + dates + '<div style="font-size:0.8rem;color:#64748b;margin-bottom:8px">' + note + '</div>' + (url && url !== '#' ? '<a href="' + url + '" target="_blank" rel="noopener" style="font-size:0.75rem;color:#0284c7;font-weight:600">Open →</a>' : '') + '</div>';
  }

  const fallbacks = {
    'State Fair of WV': [37.8, -80.45],
    'Montgomery County Ag Fair': [39.14, -77.20],
    'Commanders Open Practice': [39.05, -77.48],
    'Quiet nature windows this week': [39.3, -76.6],
    'Harbor Park Tides stretch': [36.84, -76.28],
    'Camp / quiet campus windows': [38.9, -77.0]
  };

  function getLatLng(item) {
    if (item.lat != null && item.lng != null) return [item.lat, item.lng];
    if (item.lat != null && item.lon != null) return [item.lat, item.lon];
    const key = item.title || item.name || '';
    if (fallbacks[key]) return fallbacks[key];
    return [39.0, -77.5];
  }

  function addMarkers(items, color) {
    if (!Array.isArray(items)) return;
    const m = window.map || (typeof map !== 'undefined' ? map : null);
    if (!m) return;
    items.forEach(function(item) {
      const latlng = getLatLng(item);
      const marker = L.circleMarker(latlng, {
        radius: 9,
        fillColor: color,
        color: '#0b1220',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(m);
      marker.bindPopup(popupHtml(item));
    });
  }

  // Field / Entertainment layer groups
  const fieldLayerGroups = {};
  const fieldColor = {
    Camping: '#16a34a', Trails: '#0d9488', 'Public land': '#65a30d',
    'Fishing/Boating': '#0284c7', Paddling: '#06b6d4', Lakes: '#2563eb',
    Hunting: '#a16207', Motorized: '#ca8a04', Winter: '#e0f2fe',
    History: '#a78bfa', 'Scenic Lookouts': '#f472b6',
    Concerts: '#e11d48', Festivals: '#f59e0b', Breweries: '#b45309'
  };

  function ensureFieldGroup(name) {
    if (!fieldLayerGroups[name]) {
      fieldLayerGroups[name] = L.layerGroup();
    }
    return fieldLayerGroups[name];
  }

  function loadFieldSites() {
    fetch('./data/field-sites.json', { cache: 'no-store' })
      .then(function(r) { if (!r.ok) throw new Error('field-sites ' + r.status); return r.json(); })
      .then(function(data) {
        const sites = (data && data.sites) || [];
        const m = window.map || (typeof map !== 'undefined' ? map : null);
        if (!m) { console.warn('[map-app] no map for field sites'); return; }

        sites.forEach(function(site) {
          const layer = site.layer || 'Field';
          const sub = site.sublayer || site.category || 'General';
          const group = ensureFieldGroup(layer + '|' + sub);
          const color = fieldColor[sub] || fieldColor[layer] || '#38bdf8';
          const latlng = getLatLng(site);
          const marker = L.circleMarker(latlng, {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0.85
          });
          marker.bindPopup(popupHtml(site));
          group.addLayer(marker);
        });

        // Inject collapsible UI into #layers
        const box = document.getElementById('layers');
        if (box && data.layer_groups) {
          Object.keys(data.layer_groups || {}).forEach(function(groupName) {
            const subs = data.layer_groups[groupName] || [];
            const div = document.createElement('div');
            div.className = 'ops-group';
            div.innerHTML = '<div class="ops-group-header"><span>' + groupName + '</span><span class="ops-chevron">▶</span></div><div class="ops-group-body"></div>';
            const body = div.querySelector('.ops-group-body');
            const header = div.querySelector('.ops-group-header');
            header.addEventListener('click', function(){ div.classList.toggle('open'); });

            subs.forEach(function(sub) {
              const key = groupName + '|' + sub;
              const g = ensureFieldGroup(key);
              const label = document.createElement('label');
              label.className = 'layer-item';
              const cb = document.createElement('input');
              cb.type = 'checkbox';
              cb.addEventListener('change', function() {
                if (cb.checked) g.addTo(m); else m.removeLayer(g);
              });
              const swatch = document.createElement('span');
              swatch.className = 'ops-swatch';
              swatch.style.background = fieldColor[sub] || '#38bdf8';
              label.appendChild(cb);
              label.appendChild(swatch);
              label.appendChild(document.createTextNode(' ' + sub));
              body.appendChild(label);
            });
            box.appendChild(div);
          });
        } else if (box) {
          // fallback simple groups
          ['Field', 'Entertainment'].forEach(function(groupName) {
            const div = document.createElement('div');
            div.className = 'ops-group';
            div.innerHTML = '<div class="ops-group-header"><span>' + groupName + '</span><span class="ops-chevron">▶</span></div><div class="ops-group-body"></div>';
            div.querySelector('.ops-group-header').addEventListener('click', function(){ div.classList.toggle('open'); });
            box.appendChild(div);
          });
        }
        console.log('[map-app] loaded', sites.length, 'Field/Entertainment sites');
        clearLoading();
      })
      .catch(function(err) {
        console.warn('[map-app] field-sites load failed', err);
        clearLoading();
      });
  }

  // Kick off after a short delay so window.map exists
  function start() {
    if (!window.map && typeof map === 'undefined') {
      setTimeout(start, 200);
      return;
    }
    loadFieldSites();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
