/*
  Get Outside Mid Atlantic — scene banner generator
  Construction-paper / deadpan character style (Sam + Ops Center crew)
  Pure SVG, automatic, respects data separation.
  cache-bust: 2026-08-17T21:10Z
*/

(function () {
  // Simple construction-paper character silhouettes (Sam-style)
  var CHAR = {
    // Round head + body silhouette helper
    figure: function (x, y, color, prop) {
      // head
      var s = '<circle cx="' + x + '" cy="' + (y - 18) + '" r="11" fill="' + color + '" stroke="#111" stroke-width="2.5"/>' +
        // body
        '<rect x="' + (x - 8) + '" y="' + (y - 7) + '" width="16" height="22" rx="3" fill="' + color + '" stroke="#111" stroke-width="2"/>' +
        // eyes (tiny)
        '<circle cx="' + (x - 3.5) + '" cy="' + (y - 20) + '" r="1.6" fill="#111"/>' +
        '<circle cx="' + (x + 3.5) + '" cy="' + (y - 20) + '" r="1.6" fill="#111"/>';
      if (prop === 'paddle') {
        s += '<rect x="' + (x + 10) + '" y="' + (y - 35) + '" width="3" height="42" fill="#78350f" stroke="#111" stroke-width="1.5"/>' +
             '<ellipse cx="' + (x + 11.5) + '" cy="' + (y - 38) + '" rx="7" ry="4" fill="#0ea5e9" stroke="#111" stroke-width="1.5"/>';
      }
      if (prop === 'stick') {
        s += '<line x1="' + (x + 9) + '" y1="' + (y - 5) + '" x2="' + (x + 22) + '" y2="' + (y - 28) + '" stroke="#78350f" stroke-width="2.5"/>' +
             '<circle cx="' + (x + 22) + '" cy="' + (y - 30) + '" r="3.5" fill="#fef3c7" stroke="#111" stroke-width="1.5"/>';
      }
      if (prop === 'map') {
        s += '<rect x="' + (x + 9) + '" y="' + (y - 2) + '" width="12" height="9" fill="#fef3c7" stroke="#111" stroke-width="1.5"/>';
      }
      return s;
    }
  };

  var TEMPLATES = {
    fair: function () {
      return '<rect width="300" height="170" fill="#1e3a5f"/>' +
        // tents / booths
        '<polygon points="30,110 70,55 110,110" fill="#f59e0b" stroke="#111" stroke-width="2.5"/>' +
        '<polygon points="100,110 145,45 190,110" fill="#ef4444" stroke="#111" stroke-width="2.5"/>' +
        '<polygon points="180,110 230,60 280,110" fill="#22c55e" stroke="#111" stroke-width="2.5"/>' +
        // ground
        '<rect x="0" y="110" width="300" height="60" fill="#166534"/>' +
        // string lights
        '<path d="M20 50 Q80 30 150 55 T280 40" stroke="#fbbf24" stroke-width="2.5" fill="none"/>' +
        '<circle cx="40" cy="48" r="3.5" fill="#fbbf24"/><circle cx="90" cy="38" r="3.5" fill="#fbbf24"/>' +
        '<circle cx="150" cy="53" r="3.5" fill="#fbbf24"/><circle cx="210" cy="42" r="3.5" fill="#fbbf24"/>' +
        '<circle cx="260" cy="45" r="3.5" fill="#fbbf24"/>' +
        // characters
        CHAR.figure(55, 135, '#f97316', 'map') +   // Sam-ish
        CHAR.figure(160, 138, '#0ea5e9', null) +
        CHAR.figure(250, 136, '#a3e635', 'stick');
    },
    peach: function () {
      return '<rect width="300" height="170" fill="#3b1d0a"/>' +
        '<rect x="0" y="115" width="300" height="55" fill="#166534"/>' +
        // big peach
        '<circle cx="150" cy="85" r="38" fill="#fb923c" stroke="#111" stroke-width="3"/>' +
        '<circle cx="138" cy="78" r="18" fill="#fdba74"/>' +
        '<path d="M150 48 q12 -18 28 -8" stroke="#4ade80" stroke-width="4" fill="none"/>' +
        // characters around
        CHAR.figure(55, 140, '#f97316', 'stick') +
        CHAR.figure(240, 138, '#0ea5e9', null);
    },
    water: function () {
      return '<rect width="300" height="170" fill="#0c2d48"/>' +
        '<rect x="0" y="105" width="300" height="65" fill="#0369a1"/>' +
        '<path d="M0 112 Q60 100 120 115 T240 108 T300 118" stroke="#bae6fd" stroke-width="3" fill="none"/>' +
        // dock
        '<rect x="40" y="95" width="220" height="12" fill="#57534e" stroke="#111" stroke-width="2"/>' +
        // characters on dock
        CHAR.figure(90, 130, '#0ea5e9', 'paddle') +
        CHAR.figure(160, 128, '#f97316', null) +
        CHAR.figure(230, 132, '#a3e635', 'paddle');
    },
    stage: function () {
      return '<rect width="300" height="170" fill="#3b0a1e"/>' +
        '<polygon points="70,15 230,15 255,55 45,55" fill="#7c2d4a" stroke="#111" stroke-width="2.5"/>' +
        '<rect x="55" y="55" width="190" height="55" fill="#5b1f38" stroke="#111" stroke-width="2"/>' +
        // lights
        '<circle cx="100" cy="32" r="6" fill="#fbbf24"/><circle cx="150" cy="25" r="6" fill="#fbbf24"/><circle cx="200" cy="32" r="6" fill="#fbbf24"/>' +
        // crowd silhouettes
        '<circle cx="50" cy="145" r="12" fill="#1e1b4b"/><circle cx="90" cy="148" r="11" fill="#1e1b4b"/>' +
        '<circle cx="130" cy="142" r="13" fill="#1e1b4b"/><circle cx="175" cy="147" r="12" fill="#1e1b4b"/>' +
        '<circle cx="220" cy="144" r="11" fill="#1e1b4b"/><circle cx="260" cy="146" r="12" fill="#1e1b4b"/>' +
        // one character up front
        CHAR.figure(150, 155, '#f97316', null);
    },
    mountain: function () {
      return '<rect width="300" height="170" fill="#0f172a"/>' +
        '<polygon points="0,130 80,40 160,130" fill="#1e293b" stroke="#111" stroke-width="2"/>' +
        '<polygon points="100,130 190,25 280,130" fill="#334155" stroke="#111" stroke-width="2"/>' +
        '<rect x="0" y="125" width="300" height="45" fill="#166534"/>' +
        // sun
        '<circle cx="240" cy="45" r="22" fill="#fbbf24" stroke="#111" stroke-width="2.5"/>' +
        CHAR.figure(70, 145, '#f97316', 'map') +
        CHAR.figure(200, 148, '#0ea5e9', 'stick');
    },
    fallback: function () {
      return '<rect width="300" height="170" fill="#1c1917"/>' +
        '<polygon points="20,140 90,50 160,140" fill="#44403c" stroke="#111" stroke-width="2"/>' +
        '<polygon points="120,140 200,35 280,140" fill="#57534e" stroke="#111" stroke-width="2"/>' +
        '<circle cx="230" cy="40" r="20" fill="#fbbf24" stroke="#111" stroke-width="2.5"/>' +
        '<rect x="0" y="140" width="300" height="30" fill="#292524"/>' +
        CHAR.figure(80, 155, '#f97316', null) +
        CHAR.figure(180, 158, '#0ea5e9', 'stick');
    }
  };

  var TEMPLATE_RULES = [
    { test: /peach|carnival|fair|ag fair|made in/i, id: 'fair' },
    { test: /peach/i, id: 'peach' },
    { test: /dock|marina|paddl|kayak|river|water|boat|harbor/i, id: 'water' },
    { test: /music|fest|concert|stage|folk|jazz|steelers/i, id: 'stage' },
    { test: /mountain|trail|hike|park|state fair|west virginia|trace/i, id: 'mountain' }
  ];

  function pickTemplate(text) {
    for (var i = 0; i < TEMPLATE_RULES.length; i++) {
      if (TEMPLATE_RULES[i].test.test(text)) return TEMPLATE_RULES[i].id;
    }
    return 'fallback';
  }

  function renderScene(text) {
    text = text || '';
    var templateId = pickTemplate(text);
    var templateFn = TEMPLATES[templateId] || TEMPLATES.fallback;
    var label = text.replace(/"/g, '&quot;');
    return '<svg viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '" style="width:100%;height:100%;display:block;">' +
      templateFn() + '</svg>';
  }

  function fixBranding() {
    // Surgical DOM rewrite so we never touch the giant index.html
    var walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while (node = walk.nextNode()) {
      if (node.nodeValue && node.nodeValue.indexOf('Sports Operation Center') !== -1) {
        node.nodeValue = node.nodeValue
          .replace(/Sports Operation Center \(SOC\)/g, 'Ops Center')
          .replace(/Sports Operation Center/g, 'Ops Center');
      }
    }
    // Also fix any remaining button/link text that might be split
    document.querySelectorAll('a, button, span, p').forEach(function (el) {
      if (el.childNodes.length === 1 && el.textContent && el.textContent.indexOf('Sports Operation Center') !== -1) {
        el.textContent = el.textContent
          .replace(/Sports Operation Center \(SOC\)/g, 'Ops Center')
          .replace(/Sports Operation Center/g, 'Ops Center');
      }
    });
  }

  function init() {
    // Upgrade the five Top Picks banners
    var nodes = document.querySelectorAll('[data-scene]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var text = el.getAttribute('data-scene') || el.textContent || '';
      el.innerHTML = renderScene(text);
    }
    // Fix branding without touching the baked HTML
    fixBranding();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.GetOutsideSceneGenerator = {
    renderScene: renderScene,
    pickTemplate: pickTemplate
  };
})();
