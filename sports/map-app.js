/**
 * Ops Center — Field + Entertainment layer loader
 * Expects window.map (Leaflet) already created by index.html
 * and a #layers container with sport checkboxes already present.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (!window.map || typeof L === 'undefined') {
      console.warn('[map-app] window.map or Leaflet missing — Field layers skipped');
      return;
    }

    const groups = {};
    const subGroups = {};

    function ensureGroup(name) {
      if (!groups[name]) {
        groups[name] = L.layerGroup();
      }
      return groups[name];
    }

    function ensureSub(layer, sub) {
      const key = layer + '|' + (sub || 'General');
      if (!subGroups[key]) {
        subGroups[key] = L.layerGroup();
        ensureGroup(layer).addLayer(subGroups[key]);
      }
      return subGroups[key];
    }

    const colorFor = {
      Field: '#16a34a',
      Entertainment: '#c026d3',
      Festivals: '#db2777',
      History: '#ca8a04',
      Camping: '#0d9488',
      Trails: '#65a30d'
    };

    function markerColor(site) {
      return colorFor[site.sublayer] || colorFor[site.layer] || '#38bdf8';
    }

    function makeMarker(site) {
      const c = markerColor(site);
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${c};border:2px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.5)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10]
      });
      const m = L.marker([site.lat, site.lon], { icon });
      const dates = site.dates ? `<div style="font-size:.72rem;color:#94a3b8;margin-top:2px">${site.dates}</div>` : '';
      const note = site.note ? `<div style="font-size:.75rem;color:#c5d4e8;margin-top:6px;line-height:1.35">${site.note}</div>` : '';
      const link = site.official
        ? `<a href="${site.official}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;font-size:.72rem;color:#7dd3fc">Official →</a>`
        : '';
      m.bindPopup(
        `<div style="min-width:180px">
          <div style="font-weight:700;color:#7dd3fc;font-size:.9rem">${site.name}</div>
          <div style="font-size:.75rem;color:#a8b8d0">${site.city || ''} · ${site.layer}${site.sublayer ? ' / ' + site.sublayer : ''}</div>
          ${dates}${note}${link}
        </div>`
      );
      return m;
    }

    function injectLayerUI(layerName, sublayers) {
      const box = document.getElementById('layers');
      if (!box) return;

      const dividers = box.querySelectorAll('.layers-divider');
      const anchor = dividers.length ? dividers[0] : null;

      const group = document.createElement('div');
      group.className = 'ops-group';
      group.dataset.layer = layerName;

      const header = document.createElement('div');
      header.className = 'ops-group-header';
      header.innerHTML = `<span class="ops-swatch ${layerName.toLowerCase()}"></span><span>${layerName}</span><span class="ops-chevron">▶</span>`;
      header.addEventListener('click', function () {
        group.classList.toggle('open');
      });

      const body = document.createElement('div');
      body.className = 'ops-group-body';

      const masterId = 'ops-ly-' + layerName.toLowerCase();
      const masterLabel = document.createElement('label');
      masterLabel.className = 'layer-item';
      masterLabel.innerHTML = `<input type="checkbox" id="${masterId}" data-ops-layer="${layerName}"/> <span>All ${layerName}</span>`;
      body.appendChild(masterLabel);

      const masterCb = masterLabel.querySelector('input');
      masterCb.addEventListener('change', function () {
        const on = masterCb.checked;
        if (on) window.map.addLayer(groups[layerName]);
        else window.map.removeLayer(groups[layerName]);
        body.querySelectorAll('input[data-ops-sub]').forEach(function (cb) {
          cb.checked = on;
        });
      });

      Object.keys(sublayers).forEach(function (sub) {
        const subId = 'ops-sub-' + layerName.toLowerCase() + '-' + sub.toLowerCase().replace(/\s+/g, '-');
        const lab = document.createElement('label');
        lab.className = 'layer-item';
        const swatchClass = (sub || '').toLowerCase().replace(/\s+/g, '') || layerName.toLowerCase();
        lab.innerHTML = `<input type="checkbox" id="${subId}" data-ops-sub="${layerName}|${sub}"/> <span class="ops-swatch ${swatchClass}"></span> ${sub}`;
        body.appendChild(lab);
        const cb = lab.querySelector('input');
        cb.addEventListener('change', function () {
          const key = layerName + '|' + sub;
          const lg = subGroups[key];
          if (!lg) return;
          if (cb.checked) {
            groups[layerName].addLayer(lg);
            if (!window.map.hasLayer(groups[layerName])) {
              window.map.addLayer(groups[layerName]);
              masterCb.checked = true;
            }
          } else {
            groups[layerName].removeLayer(lg);
          }
        });
      });

      group.appendChild(header);
      group.appendChild(body);

      if (anchor) box.insertBefore(group, anchor);
      else box.appendChild(group);
    }

    function addMarkers(sites) {
      const byLayer = {};
      sites.forEach(function (s) {
        if (s.lat == null || s.lon == null) return;
        const layer = s.layer || 'Field';
        const sub = s.sublayer || 'General';
        if (!byLayer[layer]) byLayer[layer] = {};
        if (!byLayer[layer][sub]) byLayer[layer][sub] = [];
        byLayer[layer][sub].push(s);
      });

      Object.keys(byLayer).forEach(function (layerName) {
        ensureGroup(layerName);
        const subs = byLayer[layerName];
        Object.keys(subs).forEach(function (sub) {
          const lg = ensureSub(layerName, sub);
          subs[sub].forEach(function (site) {
            lg.addLayer(makeMarker(site));
          });
        });
        injectLayerUI(layerName, subs);
      });
    }

    fetch('./data/field-sites.json', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('field-sites ' + r.status);
        return r.json();
      })
      .then(function (data) {
        const sites = (data && data.sites) || [];
        addMarkers(sites);
        console.log('[map-app] loaded', sites.length, 'Field/Entertainment sites');
      })
      .catch(function (err) {
        console.warn('[map-app] field-sites load failed', err);
      });
  });
})();
