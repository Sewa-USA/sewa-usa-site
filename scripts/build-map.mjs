// Generates public/africa-map.svg: Africa outline with Central African Republic
// highlighted, plus a circular zoom on the country with Bangui marked.
// Data: Natural Earth via the world-atlas package (public domain).
// Run (one-off, deps are NOT kept in the project):
//   npm i --no-save world-atlas topojson-client d3-geo && node scripts/build-map.mjs
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoBounds, geoMercator, geoPath } from 'd3-geo';

const require = createRequire(import.meta.url);
const w110 = require('world-atlas/countries-110m.json');
const w50 = require('world-atlas/countries-50m.json');
const out = process.argv[2] || 'public/africa-map.svg';

const AFRICA = new Set([
  'Algeria','Angola','Benin','Botswana','Burkina Faso','Burundi','Cameroon','Central African Rep.','Chad',
  'Congo','Dem. Rep. Congo',"Côte d'Ivoire",'Djibouti','Egypt','Eq. Guinea','Eritrea','eSwatini','Ethiopia',
  'Gabon','Gambia','Ghana','Guinea','Guinea-Bissau','Kenya','Lesotho','Liberia','Libya','Madagascar','Malawi',
  'Mali','Mauritania','Morocco','Mozambique','Namibia','Niger','Nigeria','Rwanda','S. Sudan','Senegal',
  'Sierra Leone','Somalia','Somaliland','South Africa','Sudan','Tanzania','Togo','Tunisia','Uganda','W. Sahara',
  'Zambia','Zimbabwe',
]);
const CAR = 'Central African Rep.';
const NEIGHBORS = new Set(['Cameroon','Chad','Sudan','S. Sudan','Dem. Rep. Congo','Congo']);
const BANGUI = [18.5582, 4.3947];

const feats = (w) => feature(w, w.objects.countries).features;
const africa = feats(w110).filter((f) => AFRICA.has(f.properties.name));
const carBig = africa.find((f) => f.properties.name === CAR);
const f50 = feats(w50);
const car50 = f50.find((f) => f.properties.name === CAR);
const near50 = f50.filter((f) => NEIGHBORS.has(f.properties.name));

const round = (s) => s.replace(/(\d+\.\d{1})\d+/g, '$1');
const W = 620, H = 380;

// Left: Africa
const pa = geoMercator().fitExtent([[8, 8], [290, H - 8]], { type: 'FeatureCollection', features: africa });
const ga = geoPath(pa).digits(0);
const africaPaths = africa
  .filter((f) => f.properties.name !== CAR)
  .map((f) => `<path d="${round(ga(f))}"/>`)
  .join('');
const carAfrica = round(ga(carBig));
const [ax, ay] = pa(BANGUI);

// Right: circular zoom on CAR
const cx = 444, cy = 190, r = 165;
const fit = geoMercator().fitExtent(
  [[cx - r + 18, cy - r + 18], [cx + r - 18, cy + r - 18]],
  { type: 'FeatureCollection', features: [car50] },
);
const [[w0, s0], [e0, n0]] = geoBounds(car50);
const pz = geoMercator()
  .center([(w0 + e0) / 2, (s0 + n0) / 2])
  .scale(fit.scale() * 0.78)
  .translate([cx, cy])
  .clipExtent([[cx - r - 4, cy - r - 4], [cx + r + 4, cy + r + 4]]);
const gz = geoPath(pz).digits(1);
const nearPaths = near50
  .map((f) => gz(f))
  .filter(Boolean)
  .map((d) => `<path d="${round(d)}"/>`)
  .join('');
const carZoom = round(gz(car50));
const [bx, by] = pz(BANGUI);

// Connector from the small CAR marker to the circle edge
const ang = Math.atan2(cy - ay, cx - r - ax);
const ex = cx + r * Math.cos(Math.PI), ey = cy;

const svg = `<svg class="africa-map" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="map-t" xmlns="http://www.w3.org/2000/svg">
<title id="map-t">Carte de l'Afrique centrée sur la République centrafricaine, avec Bangui</title>
<style>
text{font-family:Inter,system-ui,-apple-system,'Segoe UI',sans-serif}
.map-land path{fill:#fff;fill-opacity:.15;stroke:#06173a;stroke-width:.7;stroke-linejoin:round}
.map-car{fill:#4f8ef7;stroke:#fff;stroke-width:.9;stroke-linejoin:round}
.map-disc{fill:#0b2a66}
.map-edge{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:1.5}
.map-link{stroke:#fff;stroke-opacity:.45;stroke-width:1.2;stroke-dasharray:4 5}
.map-ring{fill:none;stroke:#9ec0ff;stroke-width:1.6}
.map-dot{fill:#ffce00;stroke:#fff;stroke-width:2}
.map-pulse{fill:#ffce00;fill-opacity:.35;transform-box:fill-box;transform-origin:center;animation:p 2.4s ease-out infinite}
@keyframes p{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.2);opacity:0}}
.map-label{fill:#fff;font-size:15px;font-weight:700}
.map-country{fill:#9ec0ff;font-size:12px;font-weight:700;letter-spacing:.22em}
@media (prefers-reduced-motion:reduce){.map-pulse{animation:none}}
</style>
<defs><clipPath id="zoom"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
<g class="map-land">${africaPaths}</g>
<path class="map-car" d="${carAfrica}"/>
<circle class="map-ring" cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="13"/>
<line class="map-link" x1="${(ax + 13).toFixed(1)}" y1="${ay.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"/>
<circle class="map-disc" cx="${cx}" cy="${cy}" r="${r}"/>
<g clip-path="url(#zoom)">
<g class="map-land">${nearPaths}</g>
<path class="map-car" d="${carZoom}"/>
</g>
<circle class="map-edge" cx="${cx}" cy="${cy}" r="${r}"/>
<circle class="map-pulse" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="14"/>
<circle class="map-dot" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="6"/>
<text class="map-label" x="${(bx + 14).toFixed(1)}" y="${(by + 5).toFixed(1)}">Bangui</text>
<text class="map-country" x="${cx}" y="${(cy - r + 46).toFixed(1)}" text-anchor="middle">CENTRAFRIQUE</text>
</svg>
`;
fs.mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(out, svg);
console.log('wrote', out, svg.length, 'bytes');
