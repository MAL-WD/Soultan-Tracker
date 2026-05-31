import { BRANCHES, DAYS, SM_TASKS_BY_TYPE, DAY_CONTENT_TYPES, STORIES_COUNT, VISUAL_CHECKS } from "../constants/designTokens";

// ============================================================
// LOGO PATH
// ============================================================
import logoImg from '../assets/logo.png';
const LOGO_PATH = logoImg;

// ============================================================
// SHARED STYLES
// ============================================================
function getSharedStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');

    :root {
      --green-dark: #0A1F0C;
      --green-mid:  #0D3320;
      --green-card: #0F2012;
      --gold:       #D4A017;
      --gold-bright:#F5C84A;
      --gold-dim:   #2A1F00;
      --silver:     #B8C0BC;
      --text:       #1A2E1C;
      --text-light: #3D5C42;
      --border:     #C9B87020;
      --red:        #C0392B;
      --blue:       #2980B9;
      --green-ok:   #27AE60;
      --page-bg:    #F7F5F0;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page {
      size: A4;
      margin: 15mm 12mm;
    }

    body {
      font-family: 'Cairo', sans-serif;
      background: var(--page-bg);
      color: var(--text);
      direction: rtl;
      font-size: 13px;
      line-height: 1.6;
    }

    /* ───── LAYOUT ───── */
    .page { max-width: 800px; margin: 0 auto; padding: 0 16px 40px; }

    /* ───── HEADER ───── */
    .report-header {
      background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 60%, #1A3A20 100%);
      color: #fff;
      padding: 28px 36px 24px;
      border-radius: 0 0 24px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .header-right { display: flex; align-items: center; gap: 20px; }
    .header-logo {
      width: 72px; height: 72px;
      border-radius: 16px;
      background: #fff;
      padding: 4px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      overflow: hidden;
      flex-shrink: 0;
    }
    .header-logo img { width: 100%; height: 100%; object-fit: contain; }
    .header-logo-placeholder {
      font-size: 36px;
      font-weight: 900;
      color: var(--gold);
      font-family: serif;
    }
    .header-title { font-size: 28px; font-weight: 900; color: var(--gold-bright); margin-bottom: 4px; letter-spacing: -0.5px; }
    .header-subtitle { font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 2px; text-transform: uppercase; }
    .header-meta { text-align: left; }
    .header-meta .report-type {
      background: rgba(212,160,23,0.2);
      border: 1px solid rgba(212,160,23,0.5);
      color: var(--gold-bright);
      padding: 6px 16px; border-radius: 20px;
      font-size: 12px; font-weight: 700; margin-bottom: 8px;
      display: inline-block;
    }
    .header-meta .report-date { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 6px; }

    /* ───── SECTION ───── */
    .section {
      background: #fff;
      border-radius: 16px;
      padding: 22px 24px;
      margin-bottom: 20px;
      border: 1px solid #E5E0D0;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 16px; font-weight: 900; color: var(--green-mid);
      margin-bottom: 16px; padding-bottom: 10px;
      border-bottom: 2px solid var(--gold);
      display: flex; align-items: center; gap: 8px;
    }
    .section-title .icon { font-size: 18px; }

    /* ───── STATS GRID ───── */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 0; }
    .stats-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .stat-card {
      background: linear-gradient(135deg, var(--green-mid), #0D3320CC);
      border-radius: 12px; padding: 14px 12px; text-align: center;
      print-color-adjust: exact; -webkit-print-color-adjust: exact;
    }
    .stat-val { font-size: 22px; font-weight: 900; color: var(--gold-bright); }
    .stat-label { font-size: 9px; color: rgba(255,255,255,0.6); margin-top: 4px; letter-spacing: 1px; }

    /* ───── TABLE ───── */
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: var(--green-mid); print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    th { color: var(--gold); padding: 10px 12px; font-size: 11px; font-weight: 700; text-align: right; }
    td { padding: 9px 12px; font-size: 12px; border-bottom: 1px solid #F0EBE0; }
    tr:nth-child(even) td { background: #FAF8F3; }
    tr:last-child td { border-bottom: none; }
    td:first-child { font-weight: 700; }

    /* ───── BADGE ───── */
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; }
    .badge-done  { background: #E8F5E9; color: #1B5E20; }
    .badge-miss  { background: #FFEBEE; color: #B71C1C; }
    .badge-warn  { background: #FFF8E1; color: #E65100; }
    .badge-info  { background: #E3F2FD; color: #0D47A1; }

    /* ───── PROGRESS ───── */
    .progress-bar { height: 8px; background: #E8E4DC; border-radius: 4px; overflow: hidden; margin-top: 6px; }
    .progress-fill {
      height: 100%; border-radius: 4px;
      print-color-adjust: exact; -webkit-print-color-adjust: exact;
    }

    /* ───── BRANCH CARD ───── */
    .branch-card {
      border-radius: 12px; padding: 16px; margin-bottom: 12px;
      border-left: 4px solid;
      display: flex; align-items: center; justify-content: space-between;
    }
    .branch-name { font-size: 16px; font-weight: 900; }
    .branch-score { font-size: 28px; font-weight: 900; }

    /* ───── WEEK CARD ───── */
    .week-card { border: 1px solid #E5E0D0; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; }
    .week-title { font-size: 14px; font-weight: 700; color: var(--green-mid); margin-bottom: 10px; }
    .week-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .week-field { font-size: 11px; }
    .week-field .field-label { color: var(--text-light); font-size: 10px; margin-bottom: 2px; }
    .week-field .field-val { font-weight: 700; }

    /* ───── FUNNEL ───── */
    .funnel { display: flex; gap: 4px; margin-top: 8px; }
    .funnel-step {
      flex: 1; padding: 10px 6px; text-align: center;
      background: var(--green-mid); color: var(--gold);
      font-size: 11px; font-weight: 700;
      print-color-adjust: exact; -webkit-print-color-adjust: exact;
    }
    .funnel-step:first-child { border-radius: 8px 0 0 8px; }
    .funnel-step:last-child  { border-radius: 0 8px 8px 0; }
    .funnel-step .fs-label { font-size: 9px; color: rgba(255,255,255,0.5); font-weight: 400; margin-bottom: 4px; }

    /* ───── VISUAL CHECK ───── */
    .check-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #F0EBE0; }
    .check-row:last-child { border-bottom: none; }
    .check-icon { width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
    .check-done .check-icon { background: #E8F5E9; color: #1B5E20; }
    .check-miss .check-icon { background: #FFEBEE; color: #B71C1C; }
    .check-label { flex: 1; font-size: 12px; font-weight: 600; }
    .check-done .check-label { color: var(--text); }
    .check-miss .check-label { color: #999; text-decoration: line-through; }

    /* ───── B2B TASK ───── */
    .b2b-task { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #F0EBE0; }
    .b2b-task:last-child { border-bottom: none; }
    .b2b-check { width: 18px; height: 18px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; }
    .b2b-done .b2b-check { background: #E8F5E9; color: #1B5E20; }
    .b2b-miss .b2b-check { background: #F5F5F5; color: #ccc; border: 1.5px solid #DDD; }
    .b2b-task-label { flex: 1; font-size: 12px; font-weight: 600; }
    .b2b-done .b2b-task-label { color: var(--text); }
    .b2b-miss .b2b-task-label { color: #999; }
    .b2b-cat { font-size: 9px; padding: 2px 8px; border-radius: 10px; background: #F0EBE0; color: var(--green-mid); font-weight: 700; }

    /* ───── FOOTER ───── */
    .report-footer {
      margin-top: 30px; text-align: center;
      padding: 20px; border-top: 1px solid #E5E0D0;
      color: #999; font-size: 10px;
    }
    .footer-logo { font-size: 20px; margin-bottom: 6px; }
    .footer-line { color: var(--gold); font-weight: 700; font-size: 12px; margin-bottom: 4px; }

    /* ───── PRINT ───── */
    @media print {
      .section { box-shadow: none; }
      .report-header { border-radius: 0 0 0 0; }
    }

    /* ───── SEGMENTS ───── */
    .segment-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .segment-chip {
      padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 700;
      print-color-adjust: exact; -webkit-print-color-adjust: exact;
    }
    .chip-active   { background: var(--green-mid); color: var(--gold); }
    .chip-inactive { background: #F0EBE0; color: #999; }

    /* ───── INSIGHTS ───── */
    .insight-box {
      background: linear-gradient(135deg, #EBF5FB, #D6EAF8);
      border: 1px solid #AED6F1; border-radius: 12px;
      padding: 16px 20px;
      print-color-adjust: exact; -webkit-print-color-adjust: exact;
    }
    .insight-box .insight-title { font-size: 13px; font-weight: 700; color: var(--blue); margin-bottom: 8px; }
    .insight-item { font-size: 12px; color: var(--text); margin-bottom: 4px; line-height: 1.7; }
    .insight-item strong { color: var(--green-mid); }

    /* ───── COLOR SWATCHES ───── */
    .color-swatches { display: flex; gap: 10px; }
    .color-swatch { flex: 1; text-align: center; }
    .color-box { height: 40px; border-radius: 8px; margin-bottom: 6px; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .color-name { font-size: 10px; font-weight: 700; color: var(--text-light); }

    /* ───── TWO COLUMNS ───── */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  `;
}

// ============================================================
// HEADER HTML
// ============================================================
function headerHTML(reportTypeLabel) {
  const date = new Date().toLocaleDateString("ar-DZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const time = new Date().toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" });

  const logoEl = `<div class="header-logo"><img src="${LOGO_PATH}" onerror="this.onerror=null; this.src='/logo.png';" alt="Soultan Logo" /></div>`;

  return `
    <div class="report-header">
      <div class="header-right">
        ${logoEl}
        <div>
          <div class="header-title">مكتبة السلطان</div>
          <div class="header-subtitle">SOULTAN STATIONERY · نظام تتبع التسويق الرقمي</div>
        </div>
      </div>
      <div class="header-meta">
        <div class="report-type">${reportTypeLabel}</div>
        <div class="report-date">${date}</div>
        <div class="report-date">${time}</div>
      </div>
    </div>
  `;
}

// ============================================================
// FOOTER HTML
// ============================================================
function footerHTML() {
  const year = new Date().getFullYear();
  return `
    <div class="report-footer">
      <div class="footer-logo">♛</div>
      <div class="footer-line">مكتبة السلطان — SOULTAN STATIONERY</div>
      <div>تقرير مُنشأ تلقائياً بواسطة نظام تتبع الأداء التسويقي © ${year}</div>
    </div>
  `;
}

// ============================================================
// OPEN & RENDER REPORT WINDOW (FULLY SYNCHRONOUS & POPUP SAFE)
// ============================================================
function renderReport(title, htmlBody) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("يرجى السماح بفتح النوافذ المنبثقة (Pop-ups) لتوليد التقرير");
    return;
  }
  
  const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    ${getSharedStyles()}
  </style>
</head>
<body>
  <div class="page">
    ${htmlBody}
    ${footerHTML()}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

  w.document.open();
  w.document.write(fullHtml);
  w.document.close();
}

// ============================================================
// HELPERS
// ============================================================
function getDayPct(data, branchId, dayEn) {
  const dd    = data[branchId]?.[dayEn] || {};
  const types = DAY_CONTENT_TYPES[dayEn] || [];
  const all   = types.flatMap(t => (SM_TASKS_BY_TYPE[t] || []).map(x => ({ key: `${t}_${x.id}` })));
  const hasStories = dayEn !== "FRI";
  const done  = all.filter(t => dd.tasks?.[t.key]).length + (hasStories ? (dd.stories || []).filter(Boolean).length : 0);
  const total = all.length + (hasStories ? STORIES_COUNT : 0);
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function getWeekPct(data, branchId) {
  return Math.round(DAYS.map(d => getDayPct(data, branchId, d.en)).reduce((a, b) => a + b, 0) / DAYS.length);
}

function pctColor(pct) {
  if (pct >= 80) return "#27AE60";
  if (pct >= 50) return "#E67E22";
  return "#C0392B";
}

function barStyle(pct) {
  const color = pctColor(pct);
  return `background:${color};width:${pct}%`;
}

// ============================================================
// ① TASKS REPORT
// ============================================================
export function generateTasksReport(data, branchId, dayEn, branchNames, activeBranch) {
  const dayName     = DAYS.find(d => d.en === dayEn)?.ar || dayEn;
  const branchName  = branchNames[branchId] || branchId;

  const dd      = data[branchId]?.[dayEn] || {};
  const types   = DAY_CONTENT_TYPES[dayEn] || [];
  const allTasks = types.flatMap(type =>
    (SM_TASKS_BY_TYPE[type] || []).map(t => ({ ...t, key: `${type}_${t.id}`, type }))
  );
  const hasStories = dayEn !== "FRI";
  const storiesDone = (dd.stories || []).filter(Boolean).length;
  const tasksDone   = allTasks.filter(t => dd.tasks?.[t.key]).length;
  const total       = allTasks.length + (hasStories ? STORIES_COUNT : 0);
  const done        = tasksDone + (hasStories ? storiesDone : 0);
  const pct         = total > 0 ? Math.round((done / total) * 100) : 0;

  const cats = [...new Set(allTasks.map(t => t.cat))];

  const tasksTableRows = allTasks.map(task => {
    const isDone = dd.tasks?.[task.key];
    return `
      <tr>
        <td>${task.icon} ${task.label}</td>
        <td>${task.cat}</td>
        <td>${task.type === "carousel" ? "كراوسل" : task.type === "video" ? "فيديو" : "صورة"}</td>
        <td><span class="badge ${isDone ? "badge-done" : "badge-miss"}">${isDone ? "✓ مكتمل" : "✗ لم يكتمل"}</span></td>
      </tr>
    `;
  }).join("");

  const storiesHTML = hasStories ? `
    <div class="section">
      <div class="section-title"><span class="icon">📱</span> الستوريز اليومية</div>
      <div style="margin-bottom:12px">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px">
          <span style="font-weight:700; font-size:14px; color:${pctColor(Math.round((storiesDone/STORIES_COUNT)*100))}">${storiesDone} / ${STORIES_COUNT} ستوري</span>
          <span class="badge ${storiesDone === STORIES_COUNT ? "badge-done" : "badge-warn"}">${storiesDone === STORIES_COUNT ? "✓ مكتمل" : "جزئي"}</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="${barStyle(Math.round((storiesDone/STORIES_COUNT)*100))}"></div></div>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap">
        ${Array.from({length: STORIES_COUNT}).map((_, i) => {
          const done = dd.stories?.[i];
          return `<div style="width:40px; text-align:center; font-size:11px">
            <div style="width:40px; height:64px; border-radius:6px; background:${done ? "#27AE60" : "#F5F5F5"}; border:2px solid ${done ? "#1B5E20" : "#DDD"}; display:flex; align-items:center; justify-content:center; color:${done ? "#fff" : "#ccc"}; font-size:18px; margin-bottom:4px; print-color-adjust:exact; -webkit-print-color-adjust:exact">${done ? "✓" : ""}</div>
            <span style="color:${done ? "#27AE60" : "#999"}">${i+1}</span>
          </div>`;
        }).join("")}
      </div>
    </div>
  ` : "";

  const noteHTML = dd.note ? `
    <div class="section">
      <div class="section-title"><span class="icon">📝</span> ملاحظات الفريق</div>
      <div style="background:#FAF8F3; border-radius:10px; padding:14px; font-size:13px; line-height:1.8; color:#3D3D3D; border-right:3px solid var(--gold)">${dd.note}</div>
    </div>
  ` : "";

  const body = `
    ${headerHTML(`📋 تقرير مهام اليوم`)}

    <!-- KPI CARDS -->
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-val">${pct}%</div>
        <div class="stat-label">نسبة الإنجاز</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${tasksDone}/${allTasks.length}</div>
        <div class="stat-label">المهام المكتملة</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${hasStories ? `${storiesDone}/${STORIES_COUNT}` : "—"}</div>
        <div class="stat-label">الستوريز</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${dd.published ? "✓" : "✗"}</div>
        <div class="stat-label">تم النشر</div>
      </div>
    </div>

    <!-- BRANCH + DAY INFO -->
    <div class="section">
      <div class="section-title"><span class="icon">📊</span> معلومات التقرير</div>
      <div class="two-col">
        <div>
          <div style="font-size:11px; color:#999; margin-bottom:4px">الفرع</div>
          <div style="font-size:18px; font-weight:900; color:var(--green-mid)">${branchName}</div>
        </div>
        <div>
          <div style="font-size:11px; color:#999; margin-bottom:4px">اليوم</div>
          <div style="font-size:18px; font-weight:900; color:var(--green-mid)">${dayName}</div>
        </div>
        <div>
          <div style="font-size:11px; color:#999; margin-bottom:4px">نوع المحتوى</div>
          <div style="font-size:14px; font-weight:700">${types.map(t => t === "carousel" ? "كراوسل" : t === "video" ? "فيديو" : "صورة").join(" + ")}</div>
        </div>
        <div>
          <div style="font-size:11px; color:#999; margin-bottom:4px">حالة النشر</div>
          <div><span class="badge ${dd.published ? "badge-done" : "badge-miss"}">${dd.published ? "✓ تم النشر" : "✗ لم يُنشر"}</span></div>
        </div>
      </div>

      <!-- Overall progress -->
      <div style="margin-top:16px">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px">
          <span style="font-size:12px; font-weight:700">الإنجاز الإجمالي لليوم</span>
          <span style="font-size:18px; font-weight:900; color:${pctColor(pct)}">${pct}%</span>
        </div>
        <div class="progress-bar" style="height:12px"><div class="progress-fill" style="${barStyle(pct)}"></div></div>
      </div>
    </div>

    <!-- TASKS TABLE -->
    <div class="section">
      <div class="section-title"><span class="icon">✅</span> قائمة المهام التفصيلية</div>
      <table>
        <thead>
          <tr>
            <th>المهمة</th>
            <th>الفئة</th>
            <th>نوع المحتوى</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>${tasksTableRows}</tbody>
      </table>
    </div>

    ${storiesHTML}
    ${noteHTML}
  `;

  renderReport(`تقرير مهام ${dayName} — ${branchName}`, body);
}

// ============================================================
// ② VISUAL IDENTITY REPORT
// ============================================================
export function generateVisualReport(data, branchId, dayEn, branchNames) {
  const dayName  = DAYS.find(d => d.en === dayEn)?.ar || dayEn;
  const branchName = branchNames[branchId] || branchId;

  const dd       = data[branchId]?.[dayEn] || {};
  const doneCount  = VISUAL_CHECKS.filter(item => dd.visual?.[item.id]).length;
  const pct        = Math.round((doneCount / VISUAL_CHECKS.length) * 100);

  const checksHTML = VISUAL_CHECKS.map(item => {
    const done = dd.visual?.[item.id];
    return `
      <div class="check-row ${done ? "check-done" : "check-miss"}">
        <div class="check-icon">${done ? "✓" : "✗"}</div>
        <div style="width:32px; height:32px; border-radius:8px; background:${done ? "#E8F5E9" : "#F5F5F5"}; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0">${item.icon}</div>
        <div class="check-label">${item.label}</div>
        <span class="badge ${done ? "badge-done" : "badge-miss"}">${done ? "✓ مطابق" : "✗ لم يُتحقق"}</span>
      </div>
    `;
  }).join("");

  const brand_colors = [
    { hex: "#0D3320", name: "الأخضر الملكي" },
    { hex: "#D4A017", name: "الذهبي الرسمي" },
    { hex: "#B8C0BC", name: "الفضي المعدني" },
    { hex: "#F7F5F0", name: "اللون النصي" },
  ];

  const body = `
    ${headerHTML("🎨 تقرير الهوية البصرية")}

    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-val">${pct}%</div>
        <div class="stat-label">نسبة التوافق</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${doneCount}/${VISUAL_CHECKS.length}</div>
        <div class="stat-label">المعايير المطابقة</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${branchName}</div>
        <div class="stat-label">الفرع</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${dayName}</div>
        <div class="stat-label">اليوم</div>
      </div>
    </div>

    <!-- OVERALL PROGRESS -->
    <div class="section">
      <div class="section-title"><span class="icon">📊</span> ملخص التدقيق البصري</div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px">
        <span style="font-size:14px; font-weight:700">${pct === 100 ? "✓ جاهز للنشر والمشاركة" : pct >= 60 ? "⚠️ يحتاج مراجعة" : "✗ غير مطابق"}</span>
        <span style="font-size:26px; font-weight:900; color:${pctColor(pct)}">${pct}%</span>
      </div>
      <div class="progress-bar" style="height:14px; margin-bottom:16px"><div class="progress-fill" style="${barStyle(pct)}"></div></div>
      <span class="badge ${pct === 100 ? "badge-done" : pct >= 60 ? "badge-warn" : "badge-miss"}">
        ${pct === 100 ? "✓ مكتمل — الهوية البصرية محترمة" : pct >= 60 ? "⚠️ جزئي — تحتاج مراجعة" : "✗ ناقص — يرجى المراجعة قبل النشر"}
      </span>
    </div>

    <!-- IDENTITY CHECKS -->
    <div class="section">
      <div class="section-title"><span class="icon">✅</span> معايير التدقيق التفصيلية</div>
      ${checksHTML}
    </div>

    <!-- BRAND COLORS -->
    <div class="section">
      <div class="section-title"><span class="icon">🎨</span> لوحة الألوان الرسمية للعلامة التجارية</div>
      <div class="color-swatches">
        ${brand_colors.map(c => `
          <div class="color-swatch">
            <div class="color-box" style="background:${c.hex}; box-shadow: 0 4px 12px ${c.hex}44"></div>
            <div class="color-name">${c.name}</div>
            <div style="font-size:9px; color:#999; margin-top:2px">${c.hex}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  renderReport(`تقرير الهوية البصرية — ${branchName} · ${dayName}`, body);
}

// ============================================================
// ③ MONTHLY PLAN REPORT
// ============================================================
export function generateMonthReport(monthPlan, branchNames) {
  const activeSegs = (monthPlan.segments || []).filter(s => s.active);
  const inactiveSegs = (monthPlan.segments || []).filter(s => !s.active);

  const weekCards = monthPlan.weeks.map(w => `
    <div class="week-card">
      <div class="week-title">${w.label} · <span style="color:#999; font-size:12px">${w.period}</span></div>
      <div class="week-grid">
        <div class="week-field"><div class="field-label">تركيز الأسبوع</div><div class="field-val">${w.focus || "—"}</div></div>
        <div class="week-field"><div class="field-label">اسم الحملة</div><div class="field-val">${w.campaign || "—"}</div></div>
        <div class="week-field"><div class="field-label">العرض الترويجي</div><div class="field-val">${w.offer || "—"}</div></div>
        <div class="week-field"><div class="field-label">الجمهور المستهدف</div><div class="field-val">${w.targeting || "—"}</div></div>
      </div>
      ${w.contentTypes?.length ? `
        <div style="margin-top:10px">
          <div style="font-size:10px; color:#999; margin-bottom:6px">أنواع المحتوى</div>
          <div style="display:flex; flex-wrap:wrap; gap:6px">
            ${w.contentTypes.map(ct => `<span style="background:#E8F5E9; color:#1B5E20; padding:3px 10px; border-radius:10px; font-size:10px; font-weight:700">${ct}</span>`).join("")}
          </div>
        </div>
      ` : ""}
    </div>
  `).join("");

  const funnelSteps = [
    { k: "awareness", l: "الوعي" },
    { k: "interest",  l: "الاهتمام" },
    { k: "desire",    l: "الرغبة" },
    { k: "action",    l: "الشراء" },
  ];

  const body = `
    ${headerHTML("📆 التقرير الشهري التسويقي")}

    <!-- GOALS -->
    <div class="section">
      <div class="section-title"><span class="icon">🎯</span> الأهداف التسويقية للشهر</div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val">${monthPlan.goals.followers || "—"}</div>
          <div class="stat-label">👥 المتابعون الجدد</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${monthPlan.goals.reach || "—"}</div>
          <div class="stat-label">📡 معدل الوصول</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${monthPlan.goals.sales || "—"}</div>
          <div class="stat-label">💰 المبيعات المتوقعة</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${monthPlan.goals.engagement ? monthPlan.goals.engagement + "%" : "—"}</div>
          <div class="stat-label">❤️ نسبة التفاعل</div>
        </div>
      </div>
    </div>

    <!-- FUNNEL -->
    <div class="section">
      <div class="section-title"><span class="icon">🔄</span> مسار البيع التسويقي (Conversion Funnel)</div>
      <div class="funnel">
        ${funnelSteps.map((s, i) => `
          <div class="funnel-step" style="${i === 0 ? "border-radius:8px 0 0 8px" : i === funnelSteps.length-1 ? "border-radius:0 8px 8px 0" : ""}">
            <div class="fs-label">${s.l}</div>
            ${monthPlan.funnel[s.k] || "—"}
          </div>
        `).join("")}
      </div>
    </div>

    <!-- SEGMENTS -->
    <div class="section">
      <div class="section-title"><span class="icon">👥</span> الفئات المستهدفة للمحتوى</div>
      <div style="margin-bottom:12px">
        <div style="font-size:11px; color:#999; margin-bottom:8px; font-weight:700">الفئات النشطة (${activeSegs.length})</div>
        <div class="segment-chips">
          ${activeSegs.map(s => `<span class="segment-chip chip-active">✓ ${s.label}</span>`).join("")}
          ${activeSegs.length === 0 ? "<span style='color:#999; font-size:12px'>لم يتم تحديد فئات نشطة</span>" : ""}
        </div>
      </div>
      ${inactiveSegs.length ? `
        <div>
          <div style="font-size:11px; color:#999; margin-bottom:8px; font-weight:700">الفئات غير المستهدفة حالياً</div>
          <div class="segment-chips">
            ${inactiveSegs.map(s => `<span class="segment-chip chip-inactive">${s.label}</span>`).join("")}
          </div>
        </div>
      ` : ""}
    </div>

    <!-- WEEKLY PLAN -->
    <div class="section">
      <div class="section-title"><span class="icon">📅</span> الخطة التفصيلية الأسبوعية</div>
      ${weekCards}
    </div>
  `;

  renderReport("التقرير الشهري التسويقي — مكتبة السلطان", body);
}

// ============================================================
// ④ B2B REPORT
// ============================================================
export function generateB2BReport(b2bTasks) {
  const doneCount = b2bTasks.filter(t => t.done).length;
  const pct       = b2bTasks.length > 0 ? Math.round((doneCount / b2bTasks.length) * 100) : 0;
  const cats      = [...new Set(b2bTasks.map(t => t.cat))];

  const tasksByCategory = cats.map(cat => {
    const catTasks = b2bTasks.filter(t => t.cat === cat);
    const catDone  = catTasks.filter(t => t.done).length;
    const catPct   = Math.round((catDone / catTasks.length) * 100);

    return `
      <div style="margin-bottom:18px">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px">
          <div style="font-size:13px; font-weight:900; color:var(--green-mid); letter-spacing:0.5px">${cat}</div>
          <div style="display:flex; align-items:center; gap:10px">
            <span style="font-size:11px; color:#999">${catDone}/${catTasks.length}</span>
            <span class="badge ${catPct === 100 ? "badge-done" : catPct >= 50 ? "badge-warn" : "badge-miss"}">${catPct}%</span>
          </div>
        </div>
        <div class="progress-bar" style="margin-bottom:10px"><div class="progress-fill" style="${barStyle(catPct)}"></div></div>
        ${catTasks.map(task => `
          <div class="b2b-task ${task.done ? "b2b-done" : "b2b-miss"}">
            <div class="b2b-check">${task.done ? "✓" : "○"}</div>
            <div class="b2b-task-label">${task.label}</div>
            <span class="b2b-cat">${task.cat}</span>
          </div>
        `).join("")}
      </div>
    `;
  }).join("");

  const body = `
    ${headerHTML("🏢 تقرير مهام B2B")}

    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-val">${pct}%</div>
        <div class="stat-label">نسبة الإنجاز</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${doneCount}</div>
        <div class="stat-label">مهام مكتملة</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${b2bTasks.length - doneCount}</div>
        <div class="stat-label">مهام متبقية</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${cats.length}</div>
        <div class="stat-label">فئات العمل</div>
      </div>
    </div>

    <!-- OVERALL PROGRESS -->
    <div class="section">
      <div class="section-title"><span class="icon">📈</span> الإنجاز الإجمالي</div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px">
        <span style="font-size:14px; font-weight:700">التقدم في مهام B2B</span>
        <span style="font-size:26px; font-weight:900; color:${pctColor(pct)}">${pct}%</span>
      </div>
      <div class="progress-bar" style="height:14px"><div class="progress-fill" style="${barStyle(pct)}"></div></div>
    </div>

    <!-- TASKS BY CATEGORY -->
    <div class="section">
      <div class="section-title"><span class="icon">📋</span> المهام حسب الفئة</div>
      ${tasksByCategory}
    </div>

    <!-- INSIGHTS -->
    <div class="insight-box">
      <div class="insight-title">💡 توصيات B2B</div>
      <div class="insight-item">• تأكد من إكمال مهام <strong>التواصل</strong> أولاً لضمان سير المفاوضات.</div>
      <div class="insight-item">• احرص على تحديث قائمة العملاء المحتملين بشكل أسبوعي.</div>
      <div class="insight-item">• الهدف: الوصول إلى نسبة إنجاز لا تقل عن <strong>80%</strong> في نهاية الشهر.</div>
    </div>
  `;

  renderReport("تقرير مهام B2B — مكتبة السلطان", body);
}

// ============================================================
// ⑤ ANALYTICS / DASHBOARD REPORT
// ============================================================
export function generateDashboardReport(data, branchNames, activities) {
  const byBranch = {};
  BRANCHES.forEach(b => {
    const scores = DAYS.map(d => getDayPct(data, b.id, d.en));
    byBranch[b.id] = {
      score: Math.round(scores.reduce((a, c) => a + c, 0) / DAYS.length),
      days:  scores,
    };
  });
  const overall = Math.round(Object.values(byBranch).reduce((a, b) => a + b.score, 0) / BRANCHES.length);
  const sorted  = Object.entries(byBranch).sort((a, b) => b[1].score - a[1].score);
  const bestId  = sorted[0][0];
  const worstId = sorted[sorted.length - 1][0];

  const branchRows = BRANCHES.map(b => {
    const s   = byBranch[b.id];
    const pct = s.score;
    return `
      <tr>
        <td>${b.icon} ${branchNames[b.id]}</td>
        <td>
          <div style="display:flex; align-items:center; gap:10px">
            <div style="flex:1; min-width:100px">
              <div class="progress-bar"><div class="progress-fill" style="${barStyle(pct)}"></div></div>
            </div>
            <span style="font-weight:900; color:${pctColor(pct)}; min-width:36px; text-align:right">${pct}%</span>
          </div>
        </td>
        <td>${s.days.map(d => `<span style="font-size:10px; color:${pctColor(d)}">${d}%</span>`).join(" · ")}</td>
        <td>
          <span class="badge ${b.id === bestId ? "badge-done" : b.id === worstId ? "badge-miss" : "badge-info"}">
            ${b.id === bestId ? "🏆 الأفضل" : b.id === worstId ? "⚠️ يحتاج تحسين" : "📈 جيد"}
          </span>
        </td>
      </tr>
    `;
  }).join("");

  const dayLabels = DAYS.map(d => d.short);

  const branchDayTable = `
    <table>
      <thead>
        <tr>
          <th>الفرع</th>
          ${DAYS.map(d => `<th>${d.short}</th>`).join("")}
          <th>المعدل</th>
        </tr>
      </thead>
      <tbody>
        ${BRANCHES.map(b => {
          const s = byBranch[b.id];
          return `<tr>
            <td>${b.icon} ${branchNames[b.id]}</td>
            ${s.days.map(d => `<td style="color:${pctColor(d)}; font-weight:700">${d}%</td>`).join("")}
            <td style="color:${pctColor(s.score)}; font-weight:900; font-size:14px">${s.score}%</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
  `;

  const recentActivities = (activities || []).slice(0, 15).map((act, i) => `
    <tr>
      <td>${act.time || "—"}</td>
      <td>${act.branch || "—"}</td>
      <td>${act.day || "—"}</td>
      <td>${act.action || "—"}</td>
      <td style="color:#999">${act.details || "—"}</td>
    </tr>
  `).join("");

  const body = `
    ${headerHTML("📊 تقرير التحليلات والأداء")}

    <!-- OVERVIEW STATS -->
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-val">${overall}%</div>
        <div class="stat-label">الأداء العام</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${branchNames[bestId]}</div>
        <div class="stat-label">🏆 أفضل فرع</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${byBranch[bestId].score}%</div>
        <div class="stat-label">أعلى نسبة إنجاز</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${BRANCHES.length}</div>
        <div class="stat-label">عدد الفروع</div>
      </div>
    </div>

    <!-- OVERALL PROGRESS -->
    <div class="section">
      <div class="section-title"><span class="icon">🎯</span> الأداء العام للمنظومة</div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px">
        <span style="font-size:14px; font-weight:700">معدل الأداء الأسبوعي — جميع الفروع</span>
        <span style="font-size:32px; font-weight:900; color:${pctColor(overall)}">${overall}%</span>
      </div>
      <div class="progress-bar" style="height:16px"><div class="progress-fill" style="${barStyle(overall)}"></div></div>
    </div>

    <!-- BRANCH COMPARISON -->
    <div class="section">
      <div class="section-title"><span class="icon">🏆</span> مقارنة أداء الفروع</div>
      <table>
        <thead>
          <tr>
            <th>الفرع</th>
            <th>نسبة الإنجاز</th>
            <th>التقدم اليومي</th>
            <th>التقييم</th>
          </tr>
        </thead>
        <tbody>${branchRows}</tbody>
      </table>
    </div>

    <!-- DETAILED DAY TABLE -->
    <div class="section">
      <div class="section-title"><span class="icon">📅</span> الأداء التفصيلي حسب اليوم والفرع</div>
      ${branchDayTable}
    </div>

    <!-- ACTIVITY LOG -->
    ${activities && activities.length > 0 ? `
    <div class="section">
      <div class="section-title"><span class="icon">📜</span> سجل النشاط الأخير (آخر 15 نشاط)</div>
      <table>
        <thead>
          <tr>
            <th>الوقت</th>
            <th>الفرع</th>
            <th>اليوم</th>
            <th>الحدث</th>
            <th>التفاصيل</th>
          </tr>
        </thead>
        <tbody>${recentActivities}</tbody>
      </table>
    </div>
    ` : ""}

    <!-- INSIGHTS -->
    <div class="insight-box">
      <div class="insight-title">💡 رؤى وتوصيات الأسبوع</div>
      <div class="insight-item">• فرع <strong>${branchNames[bestId]}</strong> يحقق أداءً استثنائياً هذا الأسبوع بنسبة ${byBranch[bestId].score}%.</div>
      <div class="insight-item">• يُنصح بتكثيف محتوى الفيديو في فرع <strong>${branchNames[worstId]}</strong> لرفع معدل التفاعل (حالياً ${byBranch[worstId].score}%).</div>
      <div class="insight-item">• المعدل العام ${overall >= 70 ? "مقبول — يجب الوصول إلى 80% أو أكثر" : overall >= 50 ? "متوسط — يحتاج إلى جهد إضافي" : "ضعيف — يستوجب تدخلاً عاجلاً"}.</div>
    </div>
  `;

  renderReport("تقرير التحليلات والأداء — مكتبة السلطان", body);
}

// ============================================================
// ⑥ FULL COMPREHENSIVE REPORT (all sections)
// ============================================================
export function generateFullReport(data, branchNames, monthPlan, b2bTasks, activities) {
  // ── Analytics ──
  const byBranch = {};
  BRANCHES.forEach(b => {
    const scores = DAYS.map(d => getDayPct(data, b.id, d.en));
    byBranch[b.id] = { score: Math.round(scores.reduce((a, c) => a + c, 0) / DAYS.length), days: scores };
  });
  const overall = Math.round(Object.values(byBranch).reduce((a, b) => a + b.score, 0) / BRANCHES.length);
  const sorted  = Object.entries(byBranch).sort((a, b) => b[1].score - a[1].score);
  const bestId  = sorted[0][0];
  const worstId = sorted[sorted.length - 1][0];

  // ── Content table ──
  const rows = DAYS.flatMap(d =>
    BRANCHES.map(b => {
      const dd    = data[b.id]?.[d.en] || {};
      const types = DAY_CONTENT_TYPES[d.en] || [];
      const all   = types.flatMap(type => (SM_TASKS_BY_TYPE[type] || []).map(t => ({ key: `${type}_${t.id}` })));
      const done  = all.filter(t => dd.tasks?.[t.key]).length;
      const sDone = (dd.stories || []).filter(Boolean).length;
      const hasS  = d.en !== "FRI";
      const tot   = all.length + (hasS ? STORIES_COUNT : 0);
      const pct   = tot > 0 ? Math.round(((done + (hasS ? sDone : 0)) / tot) * 100) : 0;
      return { branch: branchNames[b.id], day: d.ar, done, total: all.length, stories: `${sDone}/${hasS ? STORIES_COUNT : "—"}`, pct, published: dd.published };
    })
  );

  // ── B2B ──
  const b2bDone = b2bTasks.filter(t => t.done).length;
  const b2bPct  = b2bTasks.length > 0 ? Math.round((b2bDone / b2bTasks.length) * 100) : 0;

  const body = `
    ${headerHTML("📊 التقرير الشامل الأسبوعي")}

    <!-- TOP KPIs -->
    <div class="stats-grid" style="margin-bottom:24px">
      <div class="stat-card">
        <div class="stat-val">${overall}%</div>
        <div class="stat-label">الأداء العام</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${branchNames[bestId]}</div>
        <div class="stat-label">🏆 أفضل فرع</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${b2bPct}%</div>
        <div class="stat-label">إنجاز B2B</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${monthPlan.goals.followers || "—"}</div>
        <div class="stat-label">هدف المتابعين</div>
      </div>
    </div>

    <!-- BRANCH PERFORMANCE -->
    <div class="section">
      <div class="section-title"><span class="icon">🏆</span> أداء الفروع هذا الأسبوع</div>
      ${BRANCHES.map(b => {
        const s = byBranch[b.id];
        return `
          <div style="display:flex; align-items:center; gap:16px; margin-bottom:14px">
            <div style="width:42px; height:42px; border-radius:10px; background:#E8F5E9; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0">${b.icon}</div>
            <div style="flex:1">
              <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                <span style="font-weight:900; font-size:14px">${branchNames[b.id]}</span>
                <span style="font-weight:900; font-size:16px; color:${pctColor(s.score)}">${s.score}%</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="${barStyle(s.score)}"></div></div>
            </div>
          </div>
        `;
      }).join("")}
    </div>

    <!-- MONTHLY GOALS -->
    <div class="section">
      <div class="section-title"><span class="icon">🎯</span> الأهداف الشهرية</div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-val">${monthPlan.goals.followers || "—"}</div><div class="stat-label">المتابعون</div></div>
        <div class="stat-card"><div class="stat-val">${monthPlan.goals.reach || "—"}</div><div class="stat-label">الوصول</div></div>
        <div class="stat-card"><div class="stat-val">${monthPlan.goals.sales || "—"}</div><div class="stat-label">المبيعات</div></div>
        <div class="stat-card"><div class="stat-val">${monthPlan.goals.engagement ? monthPlan.goals.engagement+"%" : "—"}</div><div class="stat-label">التفاعل</div></div>
      </div>
      <div style="margin-top:16px">
        <div style="font-size:12px; color:#999; margin-bottom:8px; font-weight:700">مسار البيع</div>
        <div class="funnel">
          ${[{k:"awareness",l:"الوعي"},{k:"interest",l:"الاهتمام"},{k:"desire",l:"الرغبة"},{k:"action",l:"الشراء"}].map((s,i,arr) => `
            <div class="funnel-step" style="${i===0?"border-radius:8px 0 0 8px":i===arr.length-1?"border-radius:0 8px 8px 0":""}">
              <div class="fs-label">${s.l}</div>${monthPlan.funnel[s.k]||"—"}
            </div>`).join("")}
        </div>
      </div>
    </div>

    <!-- WEEKLY CONTENT TABLE -->
    <div class="section">
      <div class="section-title"><span class="icon">📅</span> جدول المحتوى الأسبوعي التفصيلي</div>
      <table>
        <thead>
          <tr><th>الفرع</th><th>اليوم</th><th>المهام</th><th>الستوريز</th><th>النسبة</th><th>النشر</th></tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.branch}</td>
              <td>${r.day}</td>
              <td>${r.done}/${r.total}</td>
              <td>${r.stories}</td>
              <td>
                <div style="display:flex; align-items:center; gap:6px">
                  <div style="width:50px; height:6px; background:#E8E4DC; border-radius:3px; overflow:hidden">
                    <div style="height:100%; width:${r.pct}%; background:${pctColor(r.pct)}; border-radius:3px; print-color-adjust:exact; -webkit-print-color-adjust:exact"></div>
                  </div>
                  <span style="font-weight:700; color:${pctColor(r.pct)}">${r.pct}%</span>
                </div>
              </td>
              <td><span class="badge ${r.published ? "badge-done" : "badge-miss"}">${r.published ? "✓ نعم" : "✗ لا"}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- B2B SUMMARY -->
    <div class="section">
      <div class="section-title"><span class="icon">🏢</span> ملخص مهام B2B</div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px">
        <span style="font-size:14px; font-weight:700">${b2bDone} من ${b2bTasks.length} مهمة مكتملة</span>
        <span style="font-size:24px; font-weight:900; color:${pctColor(b2bPct)}">${b2bPct}%</span>
      </div>
      <div class="progress-bar" style="height:12px; margin-bottom:16px"><div class="progress-fill" style="${barStyle(b2bPct)}"></div></div>
      <table>
        <thead><tr><th>المهمة</th><th>الفئة</th><th>الحالة</th></tr></thead>
        <tbody>
          ${b2bTasks.map(t => `
            <tr>
              <td>${t.label}</td>
              <td>${t.cat}</td>
              <td><span class="badge ${t.done ? "badge-done" : "badge-miss"}">${t.done ? "✓ مكتمل" : "○ معلق"}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- INSIGHTS -->
    <div class="insight-box">
      <div class="insight-title">💡 رؤى الأداء الذكية</div>
      <div class="insight-item">• فرع <strong>${branchNames[bestId]}</strong> يتصدر الأداء بنسبة ${byBranch[bestId].score}% — نموذج يُحتذى به.</div>
      <div class="insight-item">• يُنصح بمراجعة استراتيجية المحتوى في فرع <strong>${branchNames[worstId]}</strong> (${byBranch[worstId].score}%).</div>
      <div class="insight-item">• التركيز على إنجاز مهام B2B المتبقية (${b2bTasks.length - b2bDone} مهمة) لتعزيز قنوات البيع المؤسسي.</div>
      <div class="insight-item">• الهدف الأسبوعي الموصى به: <strong>80%</strong> لكل الفروع — المعدل الحالي: <strong>${overall}%</strong>.</div>
    </div>
  `;

  renderReport("التقرير الشامل الأسبوعي — مكتبة السلطان", body);
}
