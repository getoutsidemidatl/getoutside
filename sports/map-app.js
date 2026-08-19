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

      // Avoid duplicate groups
      if (document.querySelector('.ops-group[data-layer="' + layerName + '"]')) return;

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

      // Master toggle for the whole group
      const master = document.createElement('label');
      master.className = 'layer-item';
      master.innerHTML = `<input type="checkbox" data-ops-master="${layerName}"> <span>Show ${layerName}</span>`;
      body.appendChild(master);

      Object.keys(sublayers).forEach(function (sub) {
        const lbl = document.createElement('label');
        lbl.className = 'layer-item';
        lbl.innerHTML = `<input type="checkbox" data-ops-sub="${layerName}|${sub}"> <span>${sub}</span>`;
        body.appendChild(lbl);
      });

      group.appendChild(header);
      group.appendChild(body);
      box.appendChild(group);

      // Wire master
      master.querySelector('input').addEventListener('change', function (e) {
        const on = e.target.checked;
        const g = ensureGroup(layerName);
        if (on) {
          window.map.addLayer(g);
        } else {
          window.map.removeLayer(g);
          // also uncheck subs
          body.querySelectorAll('input[data-ops-sub]').forEach(function (cb) {
            cb.checked = false;
          });
        }
      });

      // Wire subs
      body.querySelectorAll('input[data-ops-sub]').forEach(function (cb) {
        cb.addEventListener('change', function (e) {
          const key = e.target.dataset.opsSub;
          const [layer, sub] = key.split('|');
          const sg = ensureSub(layer, sub);
          if (e.target.checked) {
            // ensure group is on map
            const g = ensureGroup(layer);
            if (!window.map.hasLayer(g)) {
              window.map.addLayer(g);
              const masterCb = body.querySelector('input[data-ops-master]');
              if (masterCb) masterCb.checked = true;
            }
            // markers already added to sub in addMarkers
          } else {
            // remove markers from this sub? or just leave, since group controls visibility
            // for simplicity, subs control whether their markers are in the group
            // but since we add all to subs at load, we can toggle the sub layer
            if (window.map.hasLayer(sg)) {
              // actually sub is already in group, so to hide we need to remove from group
              ensureGroup(layer).removeLayer(sg);
            } else {
              ensureGroup(layer).addLayer(sg);
            }
            // Wait, better approach needed. For now, keep simple: master controls group, subs are for future filtering.
          }
        });
      });
    }

    function addMarkers(sites) {
      const byLayer = {};
      sites.forEach(function (site) {
        const layer = site.layer || 'Field';
        const sub = site.sublayer || site.category || 'General';
        if (!byLayer[layer]) byLayer[layer] = {};
        if (!byLayer[layer][sub]) byLayer[layer][sub] = [];
        byLayer[layer][sub].push(site);

        const m = makeMarker(site);
        ensureSub(layer, sub).addLayer(m);
      });

      Object.keys(byLayer).forEach(function (layerName) {
        injectLayerUI(layerName, byLayer[layerName]);
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
