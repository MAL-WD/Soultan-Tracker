import { useState, useEffect } from "react";
import { G, BRANCHES, DAYS, STORIES_COUNT, SM_TASKS_BY_TYPE, DAY_CONTENT_TYPES } from "./constants/designTokens";

function Ring({ pct, color, size = 60, stroke = 5 }) {
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
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, padding: "10px 0" }}>
      {data.map((v, i) => {
        const h = (v / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: "100%", height: `${h}%`, background: `linear-gradient(0deg, ${color}44, ${color})`, borderRadius: "4px 4px 0 0", minHeight: 2 }} />
            <span style={{ fontSize: 9, color: G.textMuted }}>{DAYS[i].short}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function PremiumDashboard({ data, branchNames, activities }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setAnimate(true); }, []);

  const calculateAnalytics = () => {
    const byBranch = {};
    BRANCHES.forEach(b => {
      const scores = DAYS.map(d => {
        const dd = data[b.id]?.[d.en] || {};
        
        // Dynamic total tasks calculation for this specific day
        const dTypes = DAY_CONTENT_TYPES[d.en] || [];
        const dTasks = dTypes.flatMap(t => (SM_TASKS_BY_TYPE[t] || []).map(x => ({ key: `${t}_${x.id}` })));
        
        const dDone = dTasks.filter(t => dd.tasks?.[t.key]).length + (dd.stories || []).filter(Boolean).length;
        const dTotal = dTasks.length + (d.en === "FRI" ? 0 : STORIES_COUNT);
        
        return dTotal > 0 ? Math.round((dDone / dTotal) * 100) : 0;
      });
      byBranch[b.id] = { score: Math.round(scores.reduce((a, b) => a + b, 0) / 7), days: scores };
    });
    const avg = Math.round(Object.values(byBranch).reduce((a, b) => a + b.score, 0) / BRANCHES.length);
    const sorted = Object.entries(byBranch).sort((a,b) => b[1].score - a[1].score);
    return { byBranch, overall: avg, best: sorted[0][0], worst: sorted[sorted.length-1][0] };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="fade-up" style={{ padding: "0 18px 30px", color: G.text, direction: "rtl" }}>
      <style>{`
        .h1, .h2, .h3 { font-family: 'ThmanyahDisplay', serif; }
        .body { font-family: 'ThmanyahText', sans-serif; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .activity-row { animation: slideIn 0.4s ease forwards; }
      `}</style>

      {/* OVERALL STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <div style={{ background: `linear-gradient(135deg,${G.green},${G.green}22)`, border: `1px solid ${G.green}44`, borderRadius: 20, padding: "24px", textAlign: "center", boxShadow: `0 8px 32px ${G.green}22` }}>
          <div className="label" style={{ marginBottom: 10 }}>الأداء العام</div>
          <div className="h1" style={{ color: G.green2, margin: 0, fontSize: 48 }}>{analytics.overall}%</div>
        </div>
        <div style={{ background: `linear-gradient(135deg,${G.goldDim},${G.card})`, border: `1px solid ${G.borderGold}44`, borderRadius: 20, padding: "24px", textAlign: "center" }}>
          <div className="label" style={{ marginBottom: 10 }}>أفضل فرع</div>
          <div className="h2" style={{ color: G.goldBright, margin: 0 }}>{branchNames[analytics.best]}</div>
          <div className="caption" style={{ marginTop: 4 }}>بنسبة {analytics.byBranch[analytics.best].score}%</div>
        </div>
      </div>

      {/* BRANCH COMPARISON */}
      <div className="h3" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>📊 مقارنة الفروع</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 30 }}>
        {BRANCHES.map((b, i) => (
          <div key={b.id} style={{ 
            background: G.card, borderRadius: 20, padding: "20px", border: `1px solid ${G.border}`,
            transform: animate ? "scale(1)" : "scale(0.95)", opacity: animate ? 1 : 0, transition: `all 0.5s ease ${i * 0.1}s`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${b.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{b.icon}</div>
                <div>
                  <div className="h3" style={{ color: b.color, margin: 0, fontSize: 18 }}>{branchNames[b.id]}</div>
                  <div className="caption">{b.id === analytics.best ? "🏆 المتصدر حالياً" : "📈 في تقدم مستمر"}</div>
                </div>
              </div>
              <div style={{ textAlign: "left" }}>
                <div className="h2" style={{ color: b.color, margin: 0 }}>{analytics.byBranch[b.id].score}%</div>
              </div>
            </div>
            <div style={{ height: 10, background: G.textDim, borderRadius: 5, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: "100%", width: `${analytics.byBranch[b.id].score}%`, background: b.color, borderRadius: 5, transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
            </div>
            <BarChart data={analytics.byBranch[b.id].days} color={b.color} />
          </div>
        ))}
      </div>

      {/* ACTIVITY LOG */}
      <div className="h3" style={{ marginBottom: 16 }}>📜 سجل النشاط الذكي</div>
      <div style={{ background: G.card, borderRadius: 20, border: `1px solid ${G.border}`, padding: "10px", maxHeight: 400, overflowY: "auto" }}>
        {activities.length === 0 ? (
          <div className="body-sm" style={{ textAlign: "center", padding: 40 }}>لا توجد أنشطة مسجلة لهذا الأسبوع</div>
        ) : (
          activities.map((act, i) => (
            <div key={act.id} className="activity-row" style={{ 
              display: "flex", gap: 16, padding: "16px", borderBottom: i === activities.length - 1 ? "none" : `1px solid ${G.border}`,
              animationDelay: `${i * 0.05}s`
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: act.action?.includes("إكمال") ? G.green2 : G.red, marginTop: 6, boxShadow: `0 0 8px ${act.action?.includes("إكمال") ? G.green2 : G.red}` }} />
              <div style={{ flex: 1 }}>
                <div className="body" style={{ fontWeight: 700, fontSize: 15 }}>
                  <span style={{ color: G.gold }}>{act.branch}</span>: {act.action} <span style={{ color: G.silver }}>({act.details})</span>
                </div>
                <div className="caption" style={{ marginTop: 4 }}>{act.day} · {act.time}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INSIGHTS */}
      <div style={{ marginTop: 30, background: `linear-gradient(135deg, ${G.blue}11, ${G.blue}05)`, border: `1px solid ${G.blue}33`, borderRadius: 20, padding: "20px" }}>
        <div className="h3" style={{ color: G.blue, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>💡 رؤى الذكاء الاصطناعي</div>
        <div className="body" style={{ color: G.silver, lineHeight: 1.6 }}>
          • فرع <strong style={{ color: G.goldBright }}>{branchNames[analytics.best]}</strong> يحقق أداءً استثنائياً هذا الأسبوع بنسبة {analytics.byBranch[analytics.best].score}%.<br/>
          • يلاحظ تحسن كبير في نشر الستوريز خلال فترة المساء.<br/>
          • ينصح بتكثيف محتوى الفيديو في فرع <strong style={{ color: G.red }}>{branchNames[analytics.worst]}</strong> لرفع معدل التفاعل.
        </div>
      </div>
    </div>
  );
}