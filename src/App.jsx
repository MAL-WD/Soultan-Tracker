import { useState, useEffect } from "react";
import { G, BRANCHES, DAYS, SM_TASKS_BY_TYPE, DAY_CONTENT_TYPES, B2B_TASKS_DEFAULT, MONTHS_PLAN_DEFAULT, STORIES_COUNT, CONTENT_TYPES_MONTH } from "./constants/designTokens";
import PremiumDashboard from "./Dashboard";
import Login from "./components/Login";
import TasksPanel from "./components/TasksPanel";
import VisualPanel from "./components/VisualPanel";
import MonthPanel from "./components/MonthPanel";
import B2BPanel from "./components/B2BPanel";
import AdminPanel from "./components/AdminPanel";
import {
  generateTasksReport,
  generateVisualReport,
  generateMonthReport,
  generateB2BReport,
  generateDashboardReport,
  generateFullReport,
} from "./utils/reportGenerator";
import logoImg from './assets/logo.png';

// ============================================
// UTILITIES
// ============================================

function Ring({ pct, color, size = 44, stroke = 3 }) {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={G.border} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

// generatePDF replaced by reportGenerator.js utility

const getWk = () => {
  const d = new Date();
  const j = new Date(d.getFullYear(), 0, 1);
  return `skv5-${d.getFullYear()}-${Math.ceil(((d - j) / 86400000 + j.getDay() + 1) / 7)}`;
};

const getTodayEn = () => {
  const m = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return m[new Date().getDay()];
};

const buildDefault = () => {
  const s = {};
  BRANCHES.forEach(b => {
    s[b.id] = {};
    DAYS.forEach(d => {
      const types = DAY_CONTENT_TYPES[d.en] || [];
      const tasks = {};
      types.forEach(type => {
        (SM_TASKS_BY_TYPE[type] || []).forEach(t => {
          tasks[`${type}_${t.id}`] = false;
        });
      });
      s[b.id][d.en] = {
        tasks,
        subject:   "",
        stories:   Array(STORIES_COUNT).fill(false),
        visual:    {},
        note:      "",
        published: false,
      };
    });
  });
  return s;
};

const mergeDefault = (loadedData) => {
  const defaults = buildDefault();
  if (!loadedData) return defaults;
  
  const merged = { ...defaults };
  Object.keys(defaults).forEach(branchId => {
    if (!loadedData[branchId]) {
      loadedData[branchId] = {};
    }
    merged[branchId] = { ...defaults[branchId] };
    Object.keys(defaults[branchId]).forEach(dayEn => {
      const defaultDay = defaults[branchId][dayEn];
      const loadedDay = loadedData[branchId][dayEn] || {};
      
      merged[branchId][dayEn] = {
        ...defaultDay,
        ...loadedDay,
        tasks: {
          ...defaultDay.tasks,
          ...(loadedDay.tasks || {})
        },
        stories: loadedDay.stories || defaultDay.stories,
        visual: {
          ...defaultDay.visual,
          ...(loadedDay.visual || {})
        }
      };
    });
  });
  return merged;
};

const mergeMonthPlan = (loaded) => {
  if (!loaded) return MONTHS_PLAN_DEFAULT;
  return {
    ...MONTHS_PLAN_DEFAULT,
    ...loaded,
    goals: {
      ...MONTHS_PLAN_DEFAULT.goals,
      ...(loaded.goals || {})
    },
    segments: loaded.segments || MONTHS_PLAN_DEFAULT.segments,
    weeks: (loaded.weeks || MONTHS_PLAN_DEFAULT.weeks).map((w, i) => ({
      ...(MONTHS_PLAN_DEFAULT.weeks[i] || {}),
      ...w,
      contentTypes: w.contentTypes || []
    })),
    funnel: {
      ...MONTHS_PLAN_DEFAULT.funnel,
      ...(loaded.funnel || {})
    }
  };
};

// ============================================
// CLOUD STORAGE
// ============================================

const API_URL = import.meta.env.VITE_API_URL || "https://soultan-tracker-1.onrender.com/api";

const cloudStorage = {
  get: async (key) => {
    const token = localStorage.getItem("token");
    try {
      const r = await fetch(`${API_URL}/storage/${key}`, {
        headers: { "x-auth-token": token }
      });
      const d = await r.json();
      return d.data ? { value: d.data.value } : { value: null };
    } catch {
      const v = localStorage.getItem(key);
      return v ? { value: v } : { value: null };
    }
  },
  set: async (key, value) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/storage`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ key, value })
      });
    } catch {
      localStorage.setItem(key, value);
    }
  }
};

// ============================================
// MAIN APPLICATION
// ============================================

export default function SoultanProV5() {
  const [currentUser, setCurrentUser] = useState(null);
  const [data,        setData]        = useState(buildDefault);
  const [branch,      setBranch]      = useState("400");
  const [day,         setDay]         = useState(getTodayEn());
  const [panel,       setPanel]       = useState("tasks");
  const [loaded,      setLoaded]      = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [branchNames, setBranchNames] = useState({ 400: "400", laknab: "لاكناب", bidando: "بيداندو" });
  const [editMode,    setEditMode]    = useState(false);
  const [animate,     setAnimate]     = useState(false);
  const [catFilter,   setCatFilter]   = useState("all");
  const [monthPlan,   setMonthPlan]   = useState(MONTHS_PLAN_DEFAULT);
  const [b2bTasks,    setB2bTasks]    = useState(B2B_TASKS_DEFAULT);
  const [newB2b,      setNewB2b]      = useState("");
  const [activities,  setActivities]  = useState([]);
  const [comments,    setComments]    = useState({});
  const [notifications, setNotifications] = useState([]);
  const [dayContentTypes, setDayContentTypes] = useState(DAY_CONTENT_TYPES);
  const [smTasksByType,    setSmTasksByType]    = useState(SM_TASKS_BY_TYPE);
  const [contentTypeMetadata, setContentTypeMetadata] = useState({
    carousel: { name: "كراوسل", icon: "🎠", color: G.gold },
    video: { name: "فيديو", icon: "🎬", color: G.accentLak },
    photo: { name: "صورة", icon: "🖼️", color: G.accentBid }
  });
  const wk = getWk();

  // ============================================
  // DATA PERSISTENCE
  // ============================================

  const sv = async (d, m, b, bn, act, com) => {
    setSaving(true);
    try {
      if (d   !== undefined) await cloudStorage.set(wk,          JSON.stringify(d));
      if (m   !== undefined) await cloudStorage.set(`${wk}-mp`,  JSON.stringify(m));
      if (b   !== undefined) await cloudStorage.set(`${wk}-b2b`, JSON.stringify(b));
      if (bn  !== undefined) await cloudStorage.set("bn5",        JSON.stringify(bn));
      if (act !== undefined) await cloudStorage.set(`${wk}-act`, JSON.stringify(act));
      if (com !== undefined) await cloudStorage.set(`${wk}-com`, JSON.stringify(com));
    } catch {}
    setTimeout(() => setSaving(false), 300);
  };

  // Activity Logger
  const logActivity = (action, branchId, dayEn, details) => {
    const newAct = {
      id: Date.now(),
      time: new Date().toLocaleTimeString("ar-DZ", { hour: '2-digit', minute: '2-digit' }),
      action,
      branch: branchNames[branchId],
      day: DAYS.find(d => d.en === dayEn)?.ar,
      details,
    };
    const updated = [newAct, ...activities].slice(0, 50);
    setActivities(updated);
    sv(undefined, undefined, undefined, undefined, updated);
  };

  // Auto-login on mount
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { "x-auth-token": token }
          });
          const d = await res.json();
          if (d.success && d.user) {
            setCurrentUser(d.user);
            if (d.user.branchId) setBranch(d.user.branchId);
            return;
          } else {
            localStorage.removeItem("token");
          }
        } catch {}
      }
      setLoaded(true);
    })();
  }, []);

  // Load data when user logs in
  useEffect(() => {
    if (!currentUser) return;

    setLoaded(false);
    (async () => {
      try {
        const r  = await cloudStorage.get(wk);          if (r?.value)  setData(mergeDefault(JSON.parse(r.value)));
        const m  = await cloudStorage.get(`${wk}-mp`);  if (m?.value)  setMonthPlan(mergeMonthPlan(JSON.parse(m.value)));
        const b  = await cloudStorage.get(`${wk}-b2b`); if (b?.value)  setB2bTasks(JSON.parse(b.value));
        const bn = await cloudStorage.get("bn5");        if (bn?.value) setBranchNames(JSON.parse(bn.value));
        const ac = await cloudStorage.get(`${wk}-act`); if (ac?.value) setActivities(JSON.parse(ac.value));
        const cm = await cloudStorage.get(`${wk}-com`); if (cm?.value) setComments(JSON.parse(cm.value));
      } catch {}

      // Load dynamic global constants with fallback
      try {
        const token = localStorage.getItem("token");
        const gcRes = await fetch(`${API_URL}/global-constants`, {
          headers: { "x-auth-token": token }
        });
        if (gcRes.status === 404) {
          throw new Error("404");
        }
        const gcData = await gcRes.json();
        if (gcData.success && gcData.data) {
          if (gcData.data.DAY_CONTENT_TYPES) setDayContentTypes(gcData.data.DAY_CONTENT_TYPES);
          if (gcData.data.SM_TASKS_BY_TYPE)  setSmTasksByType(gcData.data.SM_TASKS_BY_TYPE);
        } else {
          throw new Error("Not success");
        }
      } catch (e) {
        // Fallback to cloudStorage
        try {
          const fallbackDCT = await cloudStorage.get("DAY_CONTENT_TYPES");
          if (fallbackDCT?.value) setDayContentTypes(JSON.parse(fallbackDCT.value));
          
          const fallbackSMT = await cloudStorage.get("SM_TASKS_BY_TYPE");
          if (fallbackSMT?.value) setSmTasksByType(JSON.parse(fallbackSMT.value));
        } catch {}
      }

      setLoaded(true);
      setTimeout(() => setAnimate(true), 80);
    })();
  }, [currentUser]);

  // ============================================
  // STATE HANDLERS (passed to child components)
  // ============================================

  const types    = dayContentTypes[day] || [];
  const allTasks = types.flatMap(type => (smTasksByType[type] || []).map(t => ({ ...t, key: `${type}_${t.id}`, type })));

  const toggleTask = (key) => {
    const dd = data[branch][day];
    const isDone = !dd.tasks[key];
    const taskLabel = allTasks.find(t => t.key === key)?.label || "مهمة";
    const u = { ...data, [branch]: { ...data[branch], [day]: { ...dd, tasks: { ...dd.tasks, [key]: isDone } } } };
    setData(u); sv(u);
    logActivity(isDone ? "إكمال مهمة" : "إلغاء مهمة", branch, day, taskLabel);
  };

  const toggleStory = (i) => {
    const s = [...(data[branch][day].stories || [])];
    s[i] = !s[i];
    const u = { ...data, [branch]: { ...data[branch], [day]: { ...data[branch][day], stories: s } } };
    setData(u); sv(u);
  };

  const toggleVisual = (vid) => {
    const dd = data[branch][day];
    const u = { ...data, [branch]: { ...data[branch], [day]: { ...dd, visual: { ...dd.visual, [vid]: !dd.visual[vid] } } } };
    setData(u); sv(u);
  };

  const togglePublished = () => {
    const dd = data[branch][day];
    const u = { ...data, [branch]: { ...data[branch], [day]: { ...dd, published: !dd.published } } };
    setData(u); sv(u);
  };

  const setNote = (v) => {
    const u = { ...data, [branch]: { ...data[branch], [day]: { ...data[branch][day], note: v } } };
    setData(u); sv(u);
  };

  const setSubject = (v) => {
    const u = { ...data, [branch]: { ...data[branch], [day]: { ...data[branch][day], subject: v } } };
    setData(u); sv(u);
  };

  const updMP = (path, val) => {
    const keys = path.split(".");
    const u    = JSON.parse(JSON.stringify(monthPlan));
    let ref    = u;
    for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]];
    ref[keys[keys.length - 1]] = val;
    setMonthPlan(u); sv(undefined, u);
  };

  const toggleSegment = (id) => {
    const u = { ...monthPlan, segments: monthPlan.segments.map(s => s.id === id ? { ...s, active: !s.active } : s) };
    setMonthPlan(u); sv(undefined, u);
  };

  const toggleWeekCT = (wi, ct) => {
    const w   = [...monthPlan.weeks];
    const cts = w[wi].contentTypes || [];
    w[wi] = { ...w[wi], contentTypes: cts.includes(ct) ? cts.filter(x => x !== ct) : [...cts, ct] };
    const u = { ...monthPlan, weeks: w };
    setMonthPlan(u); sv(undefined, u);
  };

  const toggleB2b = (id) => {
    const u = b2bTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setB2bTasks(u); sv(undefined, undefined, u);
  };

  const addB2b = () => {
    if (!newB2b.trim()) return;
    const u = [...b2bTasks, { id: `b${Date.now()}`, label: newB2b, done: false, cat: "عام" }];
    setB2bTasks(u); sv(undefined, undefined, u); setNewB2b("");
  };

  const addComment = (text) => {
    if (!text.trim()) return;
    const dayKey = `${branch}_${day}`;
    const newCom = {
      id: Date.now(),
      user: currentUser?.username || "مدير",
      text,
      time: new Date().toLocaleTimeString("ar-DZ", { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = { ...comments, [dayKey]: [...(comments[dayKey] || []), newCom] };
    setComments(updated);
    sv(undefined, undefined, undefined, undefined, undefined, updated);
    logActivity("إضافة تعليق", branch, day, text.substring(0, 20) + "...");
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const getDayPct = (bid, den) => {
    const dd    = data[bid]?.[den] || {};
    const dTypes = dayContentTypes[den] || [];
    const all   = dTypes.flatMap(t => (smTasksByType[t] || []).map(x => ({ key: `${t}_${x.id}` })));
    const hasStories = den !== "FRI";
    const done  = all.filter(t => dd.tasks?.[t.key]).length + (hasStories ? (dd.stories || []).filter(Boolean).length : 0);
    const total = all.length + (hasStories ? STORIES_COUNT : 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const getWeekPct = (bid) =>
    Math.round(DAYS.map(d => getDayPct(bid, d.en)).reduce((a, b) => a + b, 0) / DAYS.length);

  const activeBranch = BRANCHES.find(b => b.id === branch);

  // ============================================
  // NOTIFICATIONS
  // ============================================

  const generateNotifications = () => {
    const today = getTodayEn();
    const alerts = [];
    BRANCHES.forEach(b => {
      const dd = data[b.id]?.[today] || {};
      const sc = (dd.stories || []).filter(Boolean).length;
      if (today !== "FRI" && sc < STORIES_COUNT) {
        alerts.push({ id: `s-${b.id}`, text: `فرع ${branchNames[b.id]}: لم يكتمل الستوريز (${sc}/${STORIES_COUNT})`, type: "warn" });
      }
      if (!dd.published) {
        alerts.push({ id: `p-${b.id}`, text: `فرع ${branchNames[b.id]}: لم يتم تأكيد النشر اليوم`, type: "info" });
      }
    });
    setNotifications(alerts);
  };

  useEffect(() => {
    if (loaded) generateNotifications();
  }, [data, day, loaded]);

  // ============================================
  // PANELS CONFIG
  // ============================================

  const PANELS = [
    { id: "tasks",     label: "📋 المهام" },
    { id: "visual",    label: "🎨 الهوية" },
    { id: "month",     label: "📆 الشهر" },
    { id: "b2b",       label: "🏢 B2B" },
    { id: "activity",  label: "📜 النشاط" },
    { id: "dashboard", label: "📊 التحليلات" },
    ...(currentUser?.role === "admin" ? [{ id: "admin", label: "🛡️ الإدارة" }] : []),
  ];

  // ============================================
  // RENDER
  // ============================================

  if (!loaded) return (
    <div style={{ 
      background: `radial-gradient(circle at center, ${G.panel}, ${G.bg})`, 
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24,
      position: "relative", overflow: "hidden"
    }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: .4 } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
      
      {/* Decorative Orbs */}
      <div style={{ position: "absolute", top: "20%", right: "20%", width: 200, height: 200, background: G.gold, filter: "blur(100px)", opacity: 0.1, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "20%", width: 200, height: 200, background: G.green, filter: "blur(100px)", opacity: 0.08, borderRadius: "50%" }} />
      
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: `linear-gradient(135deg, ${G.goldDim}, ${G.card})`,
        border: `1px solid ${G.borderGold}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 30px ${G.gold}22`,
        animation: "pulse 2s infinite ease-in-out"
      }}>
        <div style={{ fontSize: 40, color: G.goldBright, animation: "spin 3s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}>♛</div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div className="h3" style={{ 
          background: `linear-gradient(90deg, #fff, ${G.goldBright})`, 
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: 1
        }}>مكتبة السلطان</div>
        <div className="label" style={{ color: G.gold, letterSpacing: 3, animation: "pulse 1.5s infinite" }}>
          جاري التحميل...
        </div>
        
        {/* Loading Bar */}
        <div style={{
          width: 140, height: 3, background: `${G.gold}22`, borderRadius: 4, marginTop: 12, overflow: "hidden", position: "relative"
        }}>
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: 0, width: "100%",
            background: `linear-gradient(90deg, transparent, ${G.goldBright}, transparent)`,
            animation: "sweep 1.5s infinite linear"
          }} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'ThmanyahText', 'Cairo', sans-serif; background: ${G.bg}; }

        .h1, .h2, .h3 { font-family: 'ThmanyahDisplay', serif; color: ${G.text}; }
        .h1 { font-size: 36px; line-height: 1.2; letter-spacing: -0.5px; }
        .h2 { font-size: 28px; line-height: 1.3; letter-spacing: -0.3px; }
        .h3 { font-size: 22px; line-height: 1.4; }
        .body-lg { font-size: 18px; line-height: 1.6; }
        .body { font-size: 16px; line-height: 1.5; }
        .body-sm { font-size: 14px; color: ${G.textMuted}; }
        .caption { font-size: 12px; color: ${G.textMuted}; }
        .label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${G.textMuted}; }

        input, textarea { font-family: 'ThmanyahText', 'Cairo', sans-serif; color: ${G.text}; }
        select { font-family: 'ThmanyahText', 'Cairo', sans-serif; color: ${G.text}; }

        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-thumb { background: ${G.borderGold}; border-radius: 2px }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: .4 } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .fade-up { animation: fadeUp .35s ease forwards }
        .row-hover { transition: all 0.25s ease; }
        .row-hover:hover { background: ${G.cardHover} !important; transform: translateX(-4px); }
      `}</style>

      {!currentUser ? (
        <Login apiUrl={API_URL} onLogin={(u) => { setCurrentUser(u); if (u.branchId) setBranch(u.branchId); }} />
      ) : (
        <div style={{ background: G.bg, minHeight: "100vh", color: G.text, direction: "rtl", overflowX: "hidden" }}>
          {/* ═══════════════ HEADER ═══════════════ */}
          <div style={{
            background: `linear-gradient(180deg,#0C1A0E,${G.bg})`,
            borderBottom: `1px solid ${G.borderGold}44`,
            padding: "16px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 99,
            backdropFilter: "blur(16px)",
            flexWrap: "wrap", gap: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: "1 1 auto", minWidth: "250px" }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 12,
                  background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  <img src={logoImg} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                {saving && (
                  <div style={{
                    position: "absolute", top: -3, right: -3, width: 10, height: 10,
                    borderRadius: "50%", background: G.goldBright, boxShadow: `0 0 8px ${G.goldBright}`,
                    animation: "pulse 1s infinite"
                  }} />
                )}
              </div>
              <div>
                <div className="h1" style={{
                  background: `linear-gradient(90deg,#F5C84A,#B8C0BC)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  margin: 0,
                }}>مكتبة السلطان</div>
                <div className="label" style={{ fontSize: 10, color: G.textMuted, letterSpacing: 2 }}>SOULTAN STATIONERY</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", flex: "1 1 auto", justifyContent: "flex-end" }}>
              <div style={{ textAlign: "left", marginRight: 10 }}>
                <div className="body" style={{ fontWeight: 700, fontSize: 13, color: G.gold }}>{currentUser.username}</div>
                <div className="caption" style={{ fontSize: 9 }}>{currentUser.role === 'admin' ? "مدير النظام" : "مسؤول فرع"}</div>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  fontFamily: "'ThmanyahText', sans-serif", fontWeight: 700,
                  border: `1px solid ${editMode ? G.gold : G.borderGold}44`,
                  background: editMode ? `${G.gold}22` : "transparent",
                  color: editMode ? G.gold : G.textMuted,
                }}
              >{editMode ? "✓ حفظ" : "✎ تعديل"}</button>
              <button
                onClick={() => generateFullReport(data, branchNames, monthPlan, b2bTasks, activities)}
                style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  fontFamily: "'ThmanyahText', sans-serif", fontWeight: 700,
                  border: `1px solid ${G.blue}44`,
                  background: `${G.blue}11`, color: G.blue,
                }}
              >📊 تقرير</button>
              <button
                onClick={() => { localStorage.removeItem("token"); setCurrentUser(null); }}
                style={{
                  padding: "8px 10px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  border: `1px solid ${G.red}44`, background: `${G.red}11`, color: G.red,
                }}
              >🚪</button>
            </div>
          </div>

          {/* ═══════════════ NOTIFICATIONS ═══════════════ */}
          {notifications.length > 0 && (
            <div style={{ padding: "10px 16px 0" }}>
              {notifications.map(n => (
                <div key={n.id} style={{
                  background: n.type === "warn" ? `${G.red}15` : `${G.blue}15`,
                  border: `1px solid ${n.type === "warn" ? G.red : G.blue}44`,
                  borderRadius: 12, padding: "10px 14px", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 10,
                  fontSize: 12, color: n.type === "warn" ? G.red : G.blue,
                }}>
                  <span>{n.type === "warn" ? "⚠️" : "ℹ️"}</span>
                  <span className="body" style={{ fontWeight: 700 }}>{n.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* ═══════════════ BRANCHES ═══════════════ */}
          <div style={{ padding: "16px 16px 0", display: "flex", gap: 12, flexWrap: "wrap" }}>
            {BRANCHES.filter(b => currentUser.role === 'admin' || b.id === currentUser.branchId).map((b, bi) => {
              const wp  = getWeekPct(b.id);
              const isA = b.id === branch;
              return (
                <button
                  key={b.id}
                  onClick={() => { setBranch(b.id); if (!["month","b2b","admin"].includes(panel)) setPanel("tasks"); }}
                  style={{
                    flex: "1 1 100px", minWidth: 120, padding: "14px 10px", borderRadius: 16, cursor: "pointer",
                    border: `1px solid ${isA ? b.color : G.border}`,
                    background: isA ? `linear-gradient(135deg,${b.dim},${G.card})` : G.card,
                    boxShadow: isA ? `0 4px 20px ${b.glow}` : "none",
                    opacity: animate ? 1 : 0,
                    transform: animate ? "translateY(0)" : "translateY(8px)",
                    transition: `all .4s ease ${bi * .08}s`,
                    fontFamily: "'ThmanyahText', sans-serif",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6, color: isA ? b.color : G.textMuted }}>{b.icon}</div>
                  {editMode
                    ? <input
                        value={branchNames[b.id]}
                        onChange={e => { const u = { ...branchNames, [b.id]: e.target.value }; setBranchNames(u); sv(undefined, undefined, undefined, u); }}
                        onClick={e => e.stopPropagation()}
                        style={{
                          width: "100%", background: "transparent", outline: "none", textAlign: "center",
                          border: `1px solid ${b.color}44`, borderRadius: 6,
                          color: b.color, fontSize: 14, fontWeight: 700, padding: "2px 4px",
                          fontFamily: "'ThmanyahText', sans-serif",
                        }}
                      />
                    : <div className="h3" style={{ fontSize: 15, color: isA ? b.color : G.silver }}>{branchNames[b.id]}</div>
                  }
                  <div style={{ height: 4, background: G.textDim, borderRadius: 2, margin: "8px 0 4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${wp}%`, background: b.color, borderRadius: 2, transition: "width .8s" }} />
                  </div>
                  <div className="label" style={{ fontSize: 10, color: isA ? b.color : G.textMuted }}>{wp}% مكتمل</div>
                </button>
              );
            })}
          </div>

          {/* ═══════════════ DAY STRIP ═══════════════ */}
          {!["month", "b2b", "admin"].includes(panel) && (
            <div style={{ padding: "14px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
              {DAYS.map(d => {
                const isA = d.en === day;
                const pct = getDayPct(branch, d.en);
                return (
                  <div
                    key={d.en}
                    onClick={() => setDay(d.en)}
                    style={{
                      flexShrink: 0, padding: "10px 14px", borderRadius: 14, textAlign: "center", minWidth: 70,
                      background: isA ? `linear-gradient(135deg,${activeBranch.dim},${G.card})` : G.card,
                      border: `1px solid ${isA ? activeBranch.color : G.border}`,
                      boxShadow: isA ? `0 4px 16px ${activeBranch.glow}` : "none",
                      cursor: "pointer",
                    }}
                  >
                    <div className="h3" style={{ fontSize: 13, color: isA ? activeBranch.color : G.silver }}>{d.short}</div>
                    <div style={{ margin: "6px auto", width: 32, height: 32, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ring pct={pct} color={isA ? activeBranch.color : G.textMuted} size={32} stroke={3} />
                      <div className="caption" style={{ position: "absolute", fontSize: 9, fontWeight: 700, color: isA ? activeBranch.color : G.textMuted }}>{pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══════════════ TABS ═══════════════ */}
          <div style={{ display: "flex", margin: "0 16px 16px", background: G.card, borderRadius: 14, padding: 4, border: `1px solid ${G.border}`, gap: 4, overflowX: "auto" }}>
            {PANELS.map(p => {
              const isA = panel === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPanel(p.id)}
                  style={{
                    flex: 1, padding: "10px 6px", borderRadius: 10, border: "none", cursor: "pointer",
                    fontFamily: "'ThmanyahText', sans-serif", fontSize: 13, whiteSpace: "nowrap",
                    fontWeight: isA ? 700 : 400,
                    background: isA ? `linear-gradient(135deg,${activeBranch.dim},${activeBranch.color}18)` : G.card,
                    color: isA ? activeBranch.color : G.textMuted,
                    boxShadow: isA ? `0 2px 10px ${activeBranch.glow}` : "none",
                    transition: "all .2s",
                  }}
                >{p.label}</button>
              );
            })}
          </div>

          {/* ═══════════════ PANEL CONTENT ═══════════════ */}

          {panel === "dashboard" && (
            <>
              <div style={{ padding: "0 16px 12px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => generateDashboardReport(data, branchNames, activities)}
                  style={{
                    padding: "10px 20px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                    fontFamily: "'ThmanyahText', sans-serif", fontWeight: 700,
                    border: `1px solid ${G.gold}55`, background: `${G.gold}15`, color: G.gold,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >📊 تصدير تقرير التحليلات</button>
              </div>
              <PremiumDashboard data={data} branchNames={branchNames} activities={activities} />
            </>
          )}

          {panel === "tasks" && (
            <>
              <div style={{ padding: "0 16px 12px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => generateTasksReport(data, branch, day, branchNames, activeBranch)}
                  style={{
                    padding: "10px 20px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                    fontFamily: "'ThmanyahText', sans-serif", fontWeight: 700,
                    border: `1px solid ${activeBranch.color}55`, background: `${activeBranch.color}15`, color: activeBranch.color,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >📋 تصدير تقرير المهام</button>
              </div>
              <TasksPanel
                branch={branch}
                day={day}
                data={data}
                branchNames={branchNames}
                activeBranch={activeBranch}
                types={types}
                smTasksByType={smTasksByType}
                catFilter={catFilter}
                setCatFilter={setCatFilter}
                toggleTask={toggleTask}
                toggleStory={toggleStory}
                togglePublished={togglePublished}
                setSubject={setSubject}
                setNote={setNote}
                comments={comments}
                addComment={addComment}
                contentTypeMetadata={contentTypeMetadata}
              />
            </>
          )}

          {panel === "visual" && (
            <>
              <div style={{ padding: "0 16px 12px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => generateVisualReport(data, branch, day, branchNames)}
                  style={{
                    padding: "10px 20px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                    fontFamily: "'ThmanyahText', sans-serif", fontWeight: 700,
                    border: `1px solid ${G.gold}55`, background: `${G.gold}15`, color: G.gold,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >🎨 تصدير تقرير الهوية البصرية</button>
              </div>
              <VisualPanel
                branch={branch}
                day={day}
                data={data}
                branchNames={branchNames}
                toggleVisual={toggleVisual}
              />
            </>
          )}

          {panel === "month" && (
            <>
              <div style={{ padding: "0 16px 12px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => generateMonthReport(monthPlan, branchNames)}
                  style={{
                    padding: "10px 20px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                    fontFamily: "'ThmanyahText', sans-serif", fontWeight: 700,
                    border: `1px solid ${G.accentLak}55`, background: `${G.accentLak}15`, color: G.accentLak,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >📆 تصدير التقرير الشهري</button>
              </div>
              <MonthPanel
                monthPlan={monthPlan}
                activeBranch={activeBranch}
                updMP={updMP}
                toggleSegment={toggleSegment}
                toggleWeekCT={toggleWeekCT}
                setMonthPlan={setMonthPlan}
                sv={sv}
              />
            </>
          )}

          {panel === "b2b" && (
            <>
              <div style={{ padding: "0 16px 12px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => generateB2BReport(b2bTasks)}
                  style={{
                    padding: "10px 20px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                    fontFamily: "'ThmanyahText', sans-serif", fontWeight: 700,
                    border: `1px solid ${G.accentBid}55`, background: `${G.accentBid}15`, color: G.accentBid,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >🏢 تصدير تقرير B2B</button>
              </div>
              <B2BPanel
                b2bTasks={b2bTasks}
                activeBranch={activeBranch}
                toggleB2b={toggleB2b}
                addB2b={addB2b}
                newB2b={newB2b}
                setNewB2b={setNewB2b}
              />
            </>
          )}

          {panel === "activity" && (
            <div className="fade-up" style={{ padding: "0 18px 30px" }}>
              <div className="h3" style={{ marginBottom: 16 }}>📜 سجل النشاط الأخير</div>
              {activities.length === 0 ? (
                <div className="body-sm" style={{ textAlign: "center", padding: 40 }}>لا يوجد نشاط مسجل بعد</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {activities.map(act => (
                    <div key={act.id} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "14px 16px", display: "flex", gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: G.panel, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {act.action.includes("إكمال") ? "✅" : act.action.includes("تعليق") ? "💬" : "❌"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="body" style={{ fontWeight: 700, margin: 0 }}>{act.action}: {act.details}</div>
                        <div className="caption" style={{ marginTop: 2 }}>{act.branch} · {act.day} · {act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {panel === "admin" && (
            <AdminPanel
              apiUrl={API_URL}
              currentUser={currentUser}
              dayContentTypes={dayContentTypes}
              setDayContentTypes={setDayContentTypes}
              smTasksByType={smTasksByType}
              setSmTasksByType={setSmTasksByType}
              cloudStorage={cloudStorage}
              contentTypeMetadata={contentTypeMetadata}
              setContentTypeMetadata={setContentTypeMetadata}
            />
          )}

          <div style={{ height: 24 }} />
        </div>
      )}
    </>
  );
}