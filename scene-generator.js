/*
  Get Outside Mid Atlantic — upgraded scene banner generator
  Closer to the South Park / construction-paper character style
  while remaining pure SVG and fully automatic.
  cache-bust: 2026-08-16T15:00Z
*/

(function () {
  var TEMPLATES = {
    nightlife: function () {
      return '<rect width="300" height="170" fill="#1e1b4b"/>' +
        '<rect x="0" y="100" width="70" height="70" fill="#312e81"/>' +
        '<rect x="60" y="80" width="65" height="90" fill="#1e1b4b"/>' +
        '<rect x="115" y="110" width="80" height="60" fill="#312e81"/>' +
        '<rect x="185" y="90" width="55" height="80" fill="#1e1b4b"/>' +
        '<rect x="230" y="120" width="70" height="50" fill="#312e81"/>' +
        '<path d="M0 88 Q75 120 150 88 T300 88" stroke="#fbbf24" stroke-width="3.5" fill="none"/>' +
        '<circle cx="40" cy="92" r="4" fill="#fbbf24"/>' +
        '<circle cx="100" cy="105" r="4" fill="#fbbf24"/>' +
        '<circle cx="160" cy="93" r="4" fill="#fbbf24"/>' +
        '<circle cx="220" cy="105" r="4" fill="#fbbf24"/>' +
        '<circle cx="270" cy="92" r="4" fill="#fbbf24"/>';
    },
    waterfront: function () {
      return '<rect width="300" height="170" fill="#0c2d48"/>' +
        '<rect x="0" y="115" width="300" height="55" fill="#1d6fa5"/>' +
        '<path d="M0 122 Q50 112 100 125 T200 120 T300 128" stroke="#bae6fd" stroke-width="3" fill="none"/>' +
        '<rect x="50" y="88" width="18" height="40" fill="#0c4a6e" stroke="#0a3a58" stroke-width="2"/>' +
        '<rect x="130" y="88" width="18" height="40" fill="#0c4a6e" stroke="#0a3a58" stroke-width="2"/>' +
        '<rect x="210" y="88" width="18" height="40" fill="#0c4a6e" stroke="#0a3a58" stroke-width="2"/>' +
        '<rect x="30" y="80" width="240" height="12" fill="#475569"/>';
    },
    sunsetKayak: function () {
      return '<rect width="300" height="170" fill="#3b1d0a"/>' +
        '<circle cx="150" cy="85" r="48" fill="#f59e0b"/>' +
        '<rect x="0" y="110" width="300" height="60" fill="#3b1d0a"/>' +
        '<path d="M0 115 Q80 102 150 115 T300 115 V125 Q220 112 150 125 T0 125 Z" fill="#78350f"/>' +
        '<path d="M95 138 q35 -14 70 0 q-6 9 -35 9 q-29 0 -35 -9 z" fill="#111827"/>' +
        '<polygon points="240,170 258,140 276,170" fill="#7f1d1d"/>' +
        '<polygon points="248,170 258,148 268,170" fill="#f59e0b"/>';
    },
    river: function () {
      return '<rect width="300" height="170" fill="#052e28"/>' +
        '<path d="M0 125 Q80 95 150 125 T300 125 V170 H0 Z" fill="#0f6e56"/>' +
        '<path d="M0 145 Q80 120 150 145 T300 145 V170 H0 Z" fill="#16a34a"/>' +
        '<circle cx="235" cy="50" r="46" fill="#064e3b"/>' +
        '<rect x="215" y="58" width="18" height="28" rx="2" fill="#34d399"/>' +
        '<rect x="238" y="52" width="18" height="34" rx="2" fill="#34d399"/>';
    },
    stage: function () {
      return '<rect width="300" height="170" fill="#3b0a1e"/>' +
        '<polygon points="85,8 215,8 245,52 55,52" fill="#7c2d4a"/>' +
        '<rect x="75" y="52" width="150" height="70" fill="#5b1f38"/>' +
        '<circle cx="105" cy="28" r="7" fill="#f9c9dc"/>' +
        '<circle cx="150" cy="20" r="7" fill="#f9c9dc"/>' +
        '<circle cx="195" cy="28" r="7" fill="#f9c9dc"/>' +
        '<circle cx="55" cy="140" r="11" fill="#1e1b4b"/>' +
        '<circle cx="95" cy="146" r="11" fill="#1e1b4b"/>' +
        '<circle cx="140" cy="138" r="11" fill="#1e1b4b"/>' +
        '<circle cx="185" cy="145" r="11" fill="#1e1b4b"/>' +
        '<circle cx="230" cy="140" r="11" fill="#1e1b4b"/>';
    },
    whitewater: function () {
      return '<rect width="300" height="170" fill="#0a1f33"/>' +
        '<polygon points="0,100 55,30 110,100" fill="#0c4a6e"/>' +
        '<polygon points="85,100 155,18 225,100" fill="#0369a1"/>' +
        '<polygon points="195,100 255,45 300,100" fill="#0c4a6e"/>' +
        '<rect x="0" y="100" width="300" height="70" fill="#0ea5e9"/>' +
        '<path d="M0 120 Q45 108 90 124 T180 118 T270 126 T300 120" stroke="#e0f2fe" stroke-width="3.5" fill="none"/>' +
        '<path d="M0 142 Q45 132 90 146 T180 140 T270 148 T300 142" stroke="#bae6fd" stroke-width="3.5" fill="none"/>';
    },
    fallback: function () {
      return '<rect width="300" height="170" fill="#1c1917"/>' +
        '<polygon points="15,155 95,55 155,155" fill="#44403c"/>' +
        '<polygon points="115,155 195,40 270,155" fill="#57534e"/>' +
        '<circle cx="245" cy="38" r="22" fill="#fbbf24"/>' +
        '<rect x="0" y="150" width="300" height="20" fill="#292524"/>';
    }
  };

  var MOTIFS = {
    peach: { x: 245, y: 8, svg:
      '<circle cx="14" cy="16" r="11" fill="#fb923c"/>' +
      '<circle cx="8" cy="14" r="7" fill="#fdba74"/>' +
      '<path d="M14 4 q4 -5 9 -2" stroke="#4ade80" stroke-width="2.5" fill="none"/>' },
    mug: { x: 245, y: 8, svg:
      '<rect x="2" y="6" width="16" height="18" rx="2" fill="#f8fafc"/>' +
      '<path d="M18 9 h6 a5 5 0 0 1 0 10 h-6" stroke="#f8fafc" stroke-width="2.5" fill="none"/>' +
      '<rect x="2" y="6" width="16" height="5" fill="#fbbf24"/>' },
    football: { x: 242, y: 10, svg:
      '<ellipse cx="14" cy="16" rx="14" ry="9" fill="#78350f" transform="rotate(-18 14 16)"/>' +
      '<line x1="6" y1="16" x2="22" y2="16" stroke="#f8fafc" stroke-width="2" transform="rotate(-18 14 16)"/>' },
    firework: { x: 242, y: 12, svg:
      '<g stroke="#fbbf24" stroke-width="2.5">' +
      '<line x1="14" y1="2" x2="14" y2="-8"/>' +
      '<line x1="4" y1="12" x2="-4" y2="4"/>' +
      '<line x1="24" y1="12" x2="32" y2="4"/>' +
      '<line x1="4" y1="22" x2="-4" y2="28"/>' +
      '<line x1="24" y1="22" x2="32" y2="28"/>' +
      '</g><circle cx="14" cy="14" r="4" fill="#fbbf24"/>' },
    note: { x: 245, y: 6, svg:
      '<circle cx="7" cy="22" r="5" fill="#f472b6"/>' +
      '<circle cx="21" cy="17" r="5" fill="#f472b6"/>' +
      '<path d="M12 22 V5 L25 2 V17" stroke="#f472b6" stroke-width="2.5" fill="none"/>' },
    tent: { x: 248, y: 8, svg:
      '<polygon points="14,3 26,24 2,24" fill="#facc15"/>' +
      '<line x1="14" y1="3" x2="14" y2="24" stroke="#78350f" stroke-width="2"/>' },
    flame: { x: 250, y: 8, svg:
      '<path d="M14 2 C7 11 7 16 10 20 C8 17 10 14 11 13 C11 18 16 19 16 22 C21 18 21 10 14 2 Z" fill="#f97316"/>' }
  };

  var TEMPLATE_RULES = [
    { test: /lantern|dusk|rooftop|nightlife|string light/i, id: 'nightlife' },
    { test: /dock|marina|boardwalk|harbor|pirate/i, id: 'waterfront' },
    { test: /sunset|bonfire/i, id: 'sunsetKayak' },
    { test: /whitewater|rapids|mountain|highland|hik|trail|parkway|lake/i, id: 'whitewater' },
    { test: /river|paddl|canoe|forest/i, id: 'river' },
    { test: /music|fest|concert|steelers|stage|camp/i, id: 'stage' }
  ];

  var MOTIF_RULES = [
    { test: /peach/i, id: 'peach' },
    { test: /brewery|beer|ale/i, id: 'mug' },
    { test: /firework|labor day|july 4th|fourth of july/i, id: 'firework' },
    { test: /steelers|football/i, id: 'football' },
    { test: /jazz|music|concert/i, id: 'note' },
    { test: /camp(?!fire)/i, id: 'tent' },
    { test: /bonfire/i, id: 'flame' }
  ];

  function pickTemplate(text) {
    for (var i = 0; i < TEMPLATE_RULES.length; i++) {
      if (TEMPLATE_RULES[i].test.test(text)) return TEMPLATE_RULES[i].id;
    }
    return 'fallback';
  }

  function pickMotifs(text, max) {
    max = max || 2;
    var found = [];
    for (var i = 0; i < MOTIF_RULES.length && found.length < max; i++) {
      if (MOTIF_RULES[i].test.test(text)) found.push(MOTIF_RULES[i].id);
    }
    return found;
  }

  function renderScene(text) {
    text = text || '';
    var templateId = pickTemplate(text);
    var templateFn = TEMPLATES[templateId] || TEMPLATES.fallback;
    var motifs = pickMotifs(text);
    var motifSvg = motifs.map(function (id) {
      var m = MOTIFS[id];
      return m ? '<g transform="translate(' + m.x + ',' + m.y + ')">' + m.svg + '</g>' : '';
    }).join('');
    var label = text.replace(/"/g, '"');
    return '<svg viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '" style="width:100%;height:100%;display:block;">' +
      templateFn() + motifSvg + '</svg>';
  }

  function init() {
    var nodes = document.querySelectorAll('[data-scene]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var text = el.getAttribute('data-scene') || el.textContent || '';
      el.innerHTML = renderScene(text);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.GetOutsideSceneGenerator = {
    renderScene: renderScene,
    pickTemplate: pickTemplate,
    pickMotifs: pickMotifs
  };
})();
