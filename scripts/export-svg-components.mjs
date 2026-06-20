import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "outputs/svg-components";
mkdirSync(outDir, { recursive: true });

const colors = {
  bg: "#FAFAFC",
  surface: "#FFFFFF",
  soft: "#F7F4FF",
  brand: "#DBD4FA",
  brandSoft: "#F6F4FE",
  character: "#C6FCE4",
  primary: "#8F7CF6",
  green: "#67D7AA",
  text: "#1E1E24",
  muted: "#6F6F7A",
  disabled: "#A8A8B3",
  border: "#E8E6F2",
  dark: "#14141C",
  warning: "#F5D780",
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const svg = (width, height, body, extra = "") => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
<title>FameFlow component</title>
<defs>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#1E1E24" flood-opacity="0.10"/>
  </filter>
  <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
    <stop stop-color="#DBD4FA"/>
    <stop offset="1" stop-color="#8F7CF6"/>
  </linearGradient>
  <linearGradient id="greenGrad" x1="0" y1="0" x2="120" y2="96" gradientUnits="userSpaceOnUse">
    <stop stop-color="#C6FCE4"/>
    <stop offset="1" stop-color="#67D7AA"/>
  </linearGradient>
  <linearGradient id="purpleGrad" x1="0" y1="0" x2="140" y2="96" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F5F1FF"/>
    <stop offset="1" stop-color="#DBD4FA"/>
  </linearGradient>
  ${extra}
</defs>
${body}
</svg>
`;

const rect = (x, y, w, h, r, fill, stroke = "none", sw = 1, attrs = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${attrs}/>`;

const text = (x, y, value, size = 14, weight = 500, fill = colors.text, anchor = "start") =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="${weight}" letter-spacing="0" text-anchor="${anchor}">${esc(value)}</text>`;

const line = (x1, y1, x2, y2, stroke = colors.text, sw = 2) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;

const icon = {
  sparkle: (x, y, c = colors.text) => `<path d="M${x + 12} ${y + 3} ${x + 14.4} ${y + 9.1} ${x + 21} ${y + 9.4}l-5.1 4.1 1.7 6.5-5.6-3.6L${x + 6.4} ${y + 20}l1.7-6.5L${x + 3} ${y + 9.4}l6.6-.3L${x + 12} ${y + 3}Z" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/>`,
  user: (x, y, c = colors.text) => `<circle cx="${x + 12}" cy="${y + 8}" r="4" stroke="${c}" stroke-width="1.8"/><path d="M${x + 5} ${y + 21}c1.4-4 4-6 7-6s5.6 2 7 6" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`,
  image: (x, y, c = colors.text) => `<rect x="${x + 4}" y="${y + 5}" width="16" height="14" rx="2" stroke="${c}" stroke-width="1.8"/><path d="m${x + 7} ${y + 16} 4-4 3 3 2-2 1 3" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  video: (x, y, c = colors.text) => `<rect x="${x + 4}" y="${y + 7}" width="12" height="10" rx="2" stroke="${c}" stroke-width="1.8"/><circle cx="${x + 10}" cy="${y + 12}" r="2" stroke="${c}" stroke-width="1.8"/><path d="m${x + 16} ${y + 10} 4-2v8l-4-2" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  audio: (x, y, c = colors.text) => `<path d="M${x + 9} ${y + 18}V${y + 5}l11-2v13" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x + 6}" cy="${y + 18}" r="3" stroke="${c}" stroke-width="1.8"/><circle cx="${x + 17}" cy="${y + 16}" r="3" stroke="${c}" stroke-width="1.8"/>`,
  chevron: (x, y, c = colors.muted) => `<path d="m${x + 8} ${y + 5} 6 7-6 7" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  check: (x, y, c = colors.primary) => `<path d="m${x + 5} ${y + 12} 4 4 10-10" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  plus: (x, y, c = colors.text) => `${line(x + 12, y + 5, x + 12, y + 19, c)}${line(x + 5, y + 12, x + 19, y + 12, c)}`,
  menu: (x, y, c = colors.text) => `${line(x + 5, y + 7, x + 19, y + 7, c, 2.4)}${line(x + 5, y + 12, x + 19, y + 12, c, 2.4)}${line(x + 5, y + 17, x + 19, y + 17, c, 2.4)}`,
};

const logoMark = (x, y) => `
  <g>
    <rect x="${x}" y="${y}" width="32" height="32" rx="9" fill="url(#logoGrad)"/>
    <path d="M${x + 9} ${y + 20}V${y + 10}h14M${x + 9} ${y + 15}h11" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  </g>`;

const roundButton = (x, y, symbol) => `${rect(x, y, 40, 40, 20, colors.surface, colors.border)}<g transform="translate(${x + 8} ${y + 8})">${symbol(0, 0)}</g>`;

const chip = (x, y, label, active = false, w = 82, accent = colors.primary) =>
  `${rect(x, y, w, 36, 18, active ? accent : colors.surface, active ? accent : colors.border)}${text(x + w / 2, y + 23, label, 13, 600, active ? "#fff" : colors.text, "middle")}`;

const components = [
  {
    name: "01-app-header",
    width: 390,
    height: 72,
    body: `
      ${rect(0, 0, 390, 72, 0, colors.bg)}
      ${logoMark(24, 20)}
      ${text(64, 42, "FameFlow", 18, 700)}
      ${roundButton(278, 16, () => `<circle cx="12" cy="12" r="5" stroke="${colors.text}" stroke-width="2"/><path d="M12 1v2M12 21v2M1 12h2M21 12h2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M19.8 4.2l-1.4 1.4M5.6 18.4l-1.4 1.4" stroke="${colors.text}" stroke-width="2" stroke-linecap="round"/>`)}
      ${roundButton(326, 16, icon.menu)}
    `,
  },
  {
    name: "02-mode-switch",
    width: 342,
    height: 64,
    body: `
      ${rect(0, 0, 342, 64, 32, colors.surface, "rgba(219,212,250,0.78)", 1, 'filter="url(#shadow)"')}
      ${rect(4, 4, 165, 56, 28, colors.brand, "rgba(45,35,95,0.18)", 2)}
      <circle cx="34" cy="22" r="2" fill="#2D235F" fill-opacity="0.16"/>
      <circle cx="134" cy="42" r="2" fill="#2D235F" fill-opacity="0.12"/>
      <g transform="translate(22 20)">${icon.sparkle(0, 0, "#2D235F")}</g>
      ${text(54, 41, "Celebrity", 24, 600, "#2D235F")}
      <g transform="translate(194 20)">${icon.user(0, 0, "#92929A")}</g>
      ${text(226, 41, "Character", 24, 600, "#92929A")}
    `,
  },
  {
    name: "03-subject-row-empty",
    width: 342,
    height: 86,
    body: `
      ${rect(0, 0, 342, 86, 8, colors.surface, colors.border, 1, 'filter="url(#shadow)"')}
      <g transform="translate(16 23)">
        <circle cx="16" cy="20" r="16" fill="url(#purpleGrad)" stroke="${colors.bg}" stroke-width="2"/>
        <circle cx="32" cy="20" r="16" fill="#F9C7B8" stroke="${colors.bg}" stroke-width="2"/>
        <circle cx="48" cy="20" r="16" fill="url(#greenGrad)" stroke="${colors.bg}" stroke-width="2"/>
        <circle cx="48" cy="17" r="8" fill="#FFFFFF" fill-opacity="0.78"/>
        <path d="M38 33c4-10 16-10 20 0" fill="#FFFFFF" fill-opacity="0.58"/>
      </g>
      ${rect(96, 10, 104, 32, 16, colors.brand, "rgba(45,35,95,0.18)")}
      <circle cx="114" cy="19" r="2" fill="#2D235F" fill-opacity="0.16"/>
      <g transform="translate(104 18)">${icon.sparkle(0, 0, "#2D235F")}</g>
      ${text(128, 31, "Star mode", 14, 400, "#2D235F")}
      ${rect(96, 50, 136, 28, 14, "transparent", "rgba(219,212,250,0.78)")}
      ${text(164, 69, "Choose celebrity", 14, 400, "#2D235F", "middle")}
      <g transform="translate(306 31)">${icon.chevron(0, 0, colors.text)}</g>
    `,
  },
  {
    name: "04-media-tabbar",
    width: 342,
    height: 58,
    body: `
      ${rect(0, 0, 342, 58, 29, colors.surface, colors.border, 1, 'filter="url(#shadow)"')}
      ${rect(5, 5, 108, 48, 24, colors.brandSoft, "rgba(219,212,250,0.58)")}
      ${rect(21, 5, 76, 4, 2, colors.brand)}
      <g transform="translate(27 21)">${icon.image(0, 0, "#2D235F")}</g>${text(51, 36, "Image", 14, 400, "#2D235F")}
      <g transform="translate(140 21)">${icon.video(0, 0, colors.muted)}</g>${text(164, 36, "Video", 14, 400, colors.muted)}
      <g transform="translate(254 21)">${icon.audio(0, 0, colors.muted)}</g>${text(278, 36, "Audio", 14, 400, colors.muted)}
    `,
  },
  {
    name: "05-prompt-composer",
    width: 342,
    height: 164,
    body: `
      ${rect(0, 0, 342, 116, 24, colors.surface, colors.border)}
      ${roundButton(16, 20, icon.plus)}
      ${text(72, 42, "Enter a text prompt", 16, 500, colors.disabled)}
      ${text(72, 68, "or reference image", 16, 500, colors.disabled)}
      ${roundButton(286, 60, (x,y,c=colors.text)=>`<path d="M12 4v7a4 4 0 0 1-8 0V4a4 4 0 0 1 8 0Z" stroke="${c}" stroke-width="1.8"/><path d="M2 11a8 8 0 0 0 16 0M10 19v3M6 22h8" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`)}
      ${rect(0, 128, 174, 36, 18, colors.soft, colors.border)}
      <g transform="translate(14 134)">${icon.sparkle(0, 0, colors.primary)}</g>
      ${text(44, 151, "Enhance prompt", 13, 700, colors.primary)}
    `,
  },
  {
    name: "06-select-controls",
    width: 342,
    height: 64,
    body: `
      ${rect(0, 0, 162, 64, 18, colors.surface, colors.border)}
      ${text(18, 24, "Model", 12, 500, colors.muted)}
      ${text(18, 48, "Fast", 17, 700)}
      <g transform="translate(132 20) rotate(90 12 12)">${icon.chevron(0, 0)}</g>
      ${rect(180, 0, 162, 64, 18, colors.surface, colors.border)}
      ${text(198, 24, "Size", 12, 500, colors.muted)}
      ${text(198, 48, "9:16", 17, 700)}
      <g transform="translate(312 20) rotate(90 12 12)">${icon.chevron(0, 0)}</g>
    `,
  },
  {
    name: "07-primary-buttons",
    width: 342,
    height: 136,
    body: `
      ${rect(0, 0, 342, 48, 16, colors.primary)}
      ${text(171, 31, "Generate", 16, 700, "#FFFFFF", "middle")}
      ${rect(0, 64, 164, 48, 16, colors.surface, colors.border)}
      ${text(82, 95, "Cancel", 15, 700, colors.text, "middle")}
      ${rect(178, 64, 164, 48, 16, colors.character)}
      ${text(260, 95, "Continue", 15, 700, "#0B5B46", "middle")}
    `,
  },
  {
    name: "08-copilot-card",
    width: 172,
    height: 132,
    body: `
      ${rect(0, 0, 172, 132, 20, colors.surface, colors.border)}
      ${rect(16, 16, 42, 42, 14, colors.brand)}
      <g transform="translate(25 25)">${icon.sparkle(0, 0, "#2D235F")}</g>
      ${text(16, 84, "Choose a mode", 16, 700)}
      ${text(16, 108, "Pick star or creator", 13, 500, colors.muted)}
    `,
  },
  {
    name: "09-quick-chips",
    width: 342,
    height: 104,
    body: `
      ${text(0, 18, "Format", 14, 700)}
      ${chip(0, 32, "Image", true, 92)}
      ${chip(100, 32, "Video", false, 92)}
      ${chip(200, 32, "Audio", false, 92)}
      ${text(0, 88, "Size", 14, 700)}
      ${chip(52, 72, "9:16", true, 74, colors.green)}
      ${chip(134, 72, "1:1", false, 64)}
      ${chip(206, 72, "16:9", false, 74)}
    `,
  },
  {
    name: "10-gallery-filters",
    width: 342,
    height: 104,
    body: `
      ${chip(0, 0, "All", true, 58)}
      ${chip(66, 0, "Celebrity", false, 96)}
      ${chip(170, 0, "Character", false, 100)}
      ${chip(278, 0, "Favs", false, 64)}
      ${rect(0, 56, 162, 48, 16, colors.surface, colors.border)}
      <g transform="translate(16 68)">${icon.user(0, 0, colors.muted)}</g>${text(50, 86, "Subject", 14, 700)}
      <g transform="translate(130 68) rotate(90 12 12)">${icon.chevron(0, 0)}</g>
      ${rect(180, 56, 162, 48, 16, colors.surface, colors.border)}
      <g transform="translate(196 68)">${icon.image(0, 0, colors.muted)}</g>${text(230, 86, "Media", 14, 700)}
      <g transform="translate(310 68) rotate(90 12 12)">${icon.chevron(0, 0)}</g>
    `,
  },
  {
    name: "11-gallery-card",
    width: 162,
    height: 236,
    body: `
      ${rect(0, 0, 162, 236, 20, colors.surface, colors.border)}
      ${rect(10, 10, 142, 142, 16, "url(#purpleGrad)")}
      <circle cx="81" cy="78" r="34" fill="#FFFFFF" fill-opacity="0.42"/>
      <path d="M66 94c8-19 22-19 30 0" stroke="#8F7CF6" stroke-width="5" stroke-linecap="round"/>
      <circle cx="81" cy="67" r="19" fill="#8F7CF6" fill-opacity="0.75"/>
      ${rect(18, 18, 34, 28, 14, "#FFFFFF", "none", 1, 'fill-opacity="0.88"')}
      <g transform="translate(23 20)">${icon.image(0, 0, colors.primary)}</g>
      ${rect(110, 18, 32, 28, 14, "#FFFFFF", "none", 1, 'fill-opacity="0.88"')}
      <path d="M126 24l2.3 5.2 5.7.4-4.4 3.6 1.3 5.6-4.9-3-4.9 3 1.3-5.6-4.4-3.6 5.7-.4L126 24Z" fill="${colors.primary}"/>
      ${text(14, 178, "Character", 12, 700, colors.primary)}
      ${text(14, 204, "Mina portrait", 15, 700)}
      <circle cx="136" cy="196" r="3" fill="${colors.muted}"/><circle cx="136" cy="204" r="3" fill="${colors.muted}"/><circle cx="136" cy="212" r="3" fill="${colors.muted}"/>
    `,
  },
  {
    name: "12-campaign-card",
    width: 342,
    height: 96,
    body: `
      ${rect(0, 0, 342, 96, 20, colors.surface, colors.border)}
      ${rect(16, 16, 64, 64, 16, "url(#greenGrad)")}
      ${text(96, 36, "Summer Launch", 17, 700)}
      ${text(96, 60, "18 assets · Instagram", 13, 500, colors.muted)}
      ${rect(252, 32, 66, 32, 16, colors.character)}
      ${text(285, 53, "Active", 12, 700, "#0B5B46", "middle")}
    `,
  },
  {
    name: "13-field-card",
    width: 342,
    height: 82,
    body: `
      ${rect(0, 0, 342, 82, 18, colors.surface, colors.border)}
      ${text(18, 27, "Campaign name", 13, 600, colors.muted)}
      ${text(18, 57, "Summer Launch", 17, 700)}
    `,
  },
  {
    name: "14-stepper",
    width: 182,
    height: 36,
    body: `
      ${line(28, 18, 154, 18, colors.border, 3)}
      <circle cx="18" cy="18" r="16" fill="${colors.primary}"/>${text(18, 23, "1", 14, 700, "#fff", "middle")}
      <circle cx="91" cy="18" r="16" fill="${colors.surface}" stroke="${colors.border}"/>${text(91, 23, "2", 14, 700, colors.muted, "middle")}
      <circle cx="164" cy="18" r="16" fill="${colors.surface}" stroke="${colors.border}"/>${text(164, 23, "3", 14, 700, colors.muted, "middle")}
    `,
  },
  {
    name: "15-influencer-row",
    width: 342,
    height: 84,
    body: `
      ${rect(0, 0, 342, 84, 20, colors.surface, colors.border)}
      <circle cx="42" cy="42" r="25" fill="url(#purpleGrad)"/>
      ${text(82, 35, "Nigel Green", 16, 700)}
      ${text(82, 58, "Fashion · 91% match", 13, 500, colors.muted)}
      ${rect(260, 26, 54, 32, 16, colors.character)}
      ${text(287, 47, "Add", 13, 700, "#0B5B46", "middle")}
    `,
  },
  {
    name: "16-bottom-nav",
    width: 390,
    height: 88,
    body: `
      ${rect(0, 0, 390, 88, 0, "rgba(250,250,252,0.96)")}
      ${rect(22, 12, 82, 56, 18, colors.brand)}
      <g transform="translate(51 19)">${icon.sparkle(0, 0, "#2D235F")}</g>${text(63, 58, "Create", 11, 700, "#2D235F", "middle")}
      <g transform="translate(137 19)">${icon.image(0, 0, colors.muted)}</g>${text(149, 58, "Gallery", 11, 600, colors.muted, "middle")}
      <g transform="translate(226 19)">${icon.user(0, 0, colors.muted)}</g>${text(238, 58, "Co-Pilot", 11, 600, colors.muted, "middle")}
      <g transform="translate(316 19)">${icon.menu(0, 0, colors.muted)}</g>${text(328, 58, "Menu", 11, 600, colors.muted, "middle")}
    `,
  },
  {
    name: "17-bottom-sheet",
    width: 390,
    height: 288,
    body: `
      ${rect(0, 0, 390, 288, 24, colors.surface, colors.border)}
      ${rect(165, 12, 60, 5, 3, colors.border)}
      ${text(24, 52, "Choose subject", 22, 700)}
      ${rect(24, 76, 342, 64, 18, colors.soft, colors.border)}
      <circle cx="56" cy="108" r="20" fill="${colors.brand}"/>${text(92, 104, "Ava Stone", 16, 700)}${text(92, 124, "Celebrity", 12, 500, colors.muted)}<g transform="translate(330 96)">${icon.check(0, 0)}</g>
      ${rect(24, 152, 342, 64, 18, colors.surface, colors.border)}
      <circle cx="56" cy="184" r="20" fill="${colors.character}"/>${text(92, 180, "Mina", 16, 700)}${text(92, 200, "Character", 12, 500, colors.muted)}
      ${rect(24, 228, 342, 48, 16, colors.primary)}
      ${text(195, 259, "Use selected subject", 15, 700, "#fff", "middle")}
    `,
  },
  {
    name: "18-side-menu",
    width: 318,
    height: 620,
    body: `
      ${rect(0, 0, 318, 620, 0, colors.surface)}
      ${logoMark(24, 24)}${text(64, 46, "FameFlow", 18, 700)}
      ${rect(24, 82, 270, 72, 20, colors.soft, colors.border)}
      ${text(44, 110, "Current project", 12, 600, colors.muted)}${text(44, 136, "TEST", 18, 700)}${text(186, 126, "Switch", 13, 700, colors.primary)}<g transform="translate(260 108)">${icon.chevron(0, 0)}</g>
      ${text(24, 190, "Create", 12, 700, colors.muted)}
      ${rect(24, 204, 270, 52, 16, colors.surface, colors.border)}${text(44, 237, "Co-Pilot", 15, 700)}<g transform="translate(260 218)">${icon.chevron(0,0)}</g>
      ${rect(24, 264, 270, 52, 16, colors.surface, colors.border)}${text(44, 297, "Generate", 15, 700)}<g transform="translate(260 278)">${icon.chevron(0,0)}</g>
      ${rect(24, 324, 270, 52, 16, colors.surface, colors.border)}${text(44, 357, "Gallery", 15, 700)}<g transform="translate(260 338)">${icon.chevron(0,0)}</g>
      ${text(24, 412, "Account", 12, 700, colors.muted)}
      ${text(44, 446, "Olivia Reed", 16, 700)}
      ${rect(24, 466, 270, 64, 18, colors.soft, colors.border)}${text(44, 500, "1,240 credits", 18, 700)}${rect(198, 482, 76, 32, 16, colors.primary)}${text(236, 503, "Add cash", 12, 700, "#fff", "middle")}
      ${rect(24, 542, 270, 52, 16, colors.surface, colors.border)}${text(44, 575, "Settings", 15, 700)}<g transform="translate(260 556)">${icon.chevron(0,0)}</g>
    `,
  },
  {
    name: "19-toast",
    width: 300,
    height: 56,
    body: `
      ${rect(0, 0, 300, 56, 18, "#1E1E24")}
      ${text(150, 35, "Generation started.", 15, 700, "#FFFFFF", "middle")}
    `,
  },
  {
    name: "20-empty-state",
    width: 342,
    height: 260,
    body: `
      ${rect(0, 0, 342, 260, 24, colors.surface, colors.border)}
      <circle cx="171" cy="74" r="42" fill="${colors.soft}"/>
      <g transform="translate(159 62)">${icon.audio(0, 0, colors.primary)}</g>
      ${text(171, 144, "No audio yet", 22, 700, colors.text, "middle")}
      ${text(171, 172, "Create your first generated audio.", 14, 500, colors.muted, "middle")}
      ${rect(54, 196, 234, 48, 16, colors.primary)}
      ${text(171, 227, "Create audio", 15, 700, "#fff", "middle")}
    `,
  },
  {
    name: "21-dialog",
    width: 342,
    height: 238,
    body: `
      ${rect(0, 0, 342, 238, 24, colors.surface, colors.border, 1, 'filter="url(#shadow)"')}
      ${text(24, 42, "Add cash", 22, 700)}
      ${text(24, 70, "Choose amount", 14, 500, colors.muted)}
      ${chip(24, 94, "$25", true, 86)}
      ${chip(128, 94, "$50", false, 86)}
      ${chip(232, 94, "$100", false, 86)}
      ${rect(24, 166, 138, 48, 16, colors.surface, colors.border)}
      ${text(93, 197, "Cancel", 15, 700, colors.text, "middle")}
      ${rect(180, 166, 138, 48, 16, colors.primary)}
      ${text(249, 197, "Continue", 15, 700, "#fff", "middle")}
    `,
  },
  {
    name: "22-offline-card",
    width: 342,
    height: 250,
    body: `
      ${rect(0, 0, 342, 250, 24, colors.surface, colors.border)}
      ${rect(132, 34, 78, 78, 22, colors.soft)}
      ${rect(150, 50, 24, 24, 6, colors.primary)}${rect(168, 68, 24, 24, 6, colors.character)}
      ${text(171, 148, "No internet connection", 21, 700, colors.text, "middle")}
      ${text(171, 176, "Check connection and try again.", 14, 500, colors.muted, "middle")}
      ${rect(54, 198, 234, 48, 16, colors.primary)}
      ${text(171, 229, "Try again", 15, 700, "#fff", "middle")}
    `,
  },
  {
    name: "23-source-menu",
    width: 342,
    height: 238,
    body: `
      ${rect(0, 0, 342, 238, 24, colors.surface, colors.border)}
      ${text(24, 44, "Add reference", 22, 700)}
      ${rect(24, 70, 294, 48, 16, colors.surface, colors.border)}<g transform="translate(42 82)">${icon.image(0, 0, colors.primary)}</g>${text(80, 101, "Media library", 15, 700)}
      ${rect(24, 126, 294, 48, 16, colors.surface, colors.border)}<g transform="translate(42 138)">${icon.video(0, 0, colors.primary)}</g>${text(80, 157, "Take photo/video", 15, 700)}
      ${rect(24, 182, 294, 48, 16, colors.surface, colors.border)}<g transform="translate(42 194)">${icon.plus(0, 0, colors.primary)}</g>${text(80, 213, "Choose file", 15, 700)}
    `,
  },
  {
    name: "24-project-option",
    width: 342,
    height: 68,
    body: `
      ${rect(0, 0, 342, 68, 18, colors.soft, colors.primary, 1.5)}
      ${text(18, 42, "TEST-A", 17, 700)}
      ${rect(198, 18, 76, 32, 16, colors.brand)}
      ${text(236, 39, "Current", 12, 700, "#2D235F", "middle")}
      <circle cx="310" cy="34" r="14" fill="${colors.primary}"/><g transform="translate(298 22)">${icon.check(0, 0, "#fff")}</g>
    `,
  },
];

for (const component of components) {
  writeFileSync(join(outDir, `${component.name}.svg`), svg(component.width, component.height, component.body));
}

const gap = 32;
const labelHeight = 28;
const columns = 3;
const colWidth = 430;
let y = 32;
let x = 32;
let rowHeight = 0;
const sheetParts = [
  rect(0, 0, 1360, 2800, 0, "#F3F1F8"),
  text(32, 58, "FameFlow SVG Component Kit", 30, 800),
  text(32, 88, "Import this file into Figma, then detach/edit each grouped component.", 15, 500, colors.muted),
];
y = 124;

components.forEach((component, index) => {
  if (index % columns === 0 && index !== 0) {
    x = 32;
    y += rowHeight + gap + labelHeight;
    rowHeight = 0;
  }
  const frameH = component.height + labelHeight + 28;
  sheetParts.push(`<g id="${component.name}" transform="translate(${x} ${y})">`);
  sheetParts.push(rect(0, 0, Math.max(component.width + 32, 382), frameH, 18, "#FFFFFF", "#DEDBE8"));
  sheetParts.push(text(16, 24, component.name, 13, 700, colors.muted));
  sheetParts.push(`<g transform="translate(16 ${labelHeight + 16})">${component.body}</g>`);
  sheetParts.push("</g>");
  rowHeight = Math.max(rowHeight, frameH);
  x += colWidth;
});

writeFileSync(join(outDir, "00-fameflow-component-kit.svg"), svg(1360, Math.max(2800, y + rowHeight + 64), sheetParts.join("\n")));

console.log(`Exported ${components.length + 1} SVG files to ${outDir}`);
