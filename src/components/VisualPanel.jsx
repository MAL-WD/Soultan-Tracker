import { G, VISUAL_CHECKS, DAYS } from "../constants/designTokens";

function Check({ done, color, onToggle, size = "normal" }) {
  const s = size === "small" ? 17 : 21;
  return (
    <div
      onClick={e => { e.stopPropagation(); onToggle(); }}
      style={{
        width: s, height: s,
        borderRadius: 5,
        border: `1.5px solid ${done ? color : G.silverDim}`,
        background: done ? color : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
        transition: "all 0.2s cubic-bezier(.34,1.56,.64,1)",
        transform: done ? "scale(1.1)" : "scale(1)",
        boxShadow: done ? `0 0 8px ${color}60` : "none",
      }}
    >
      {done && (
        <svg width={s - 6} height={s - 6} viewBox="0 0 12 12">
          <path d="M2 6L5 9.5L10 2.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )}
    </div>
  );
}

export default function VisualPanel({
  branch,
  day,
  data,
  branchNames,
  toggleVisual
}) {
  const curData = data[branch]?.[day] || {};
  const checkedCount = VISUAL_CHECKS.filter(item => curData.visual?.[item.id]).length;
  const pct = Math.round((checkedCount / VISUAL_CHECKS.length) * 100);

  return (
    <div className="fade-up" style={{ padding: "0 18px 30px" }}>
      <div style={{ 
        background: `${G.goldDim}50`, 
        border: `1px solid ${G.borderGold}`, 
        borderRadius: 14, 
        padding: "14px 18px", 
        marginBottom: 18, 
        display: "flex", 
        gap: 14, 
        alignItems: "flex-start",
        textAlign: "right"
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
        <div>
          <div className="h3" style={{ color: G.gold, margin: 0 }}>التحقق من الهوية البصرية قبل النشر</div>
          <div className="body-sm" style={{ marginTop: 4 }}>فرع {branchNames[branch]} · {DAYS.find(d => d.en === day)?.ar}</div>
        </div>
      </div>

      {/* Color Palette Display */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "16px", marginBottom: 18 }}>
        <div className="label" style={{ marginBottom: 12, fontWeight: "bold" }}>لوحة الألوان الرسمية للمنشورات</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ c: "#0D3320", n: "الأخضر الأساسي" }, { c: G.gold, n: "الذهبي الملكي" }, { c: G.silver, n: "الفضي المعدني" }, { c: "#E8F0E9", n: "اللون النصي" }].map(col => (
            <div key={col.c} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 36, borderRadius: 8, background: col.c, border: "1px solid #ffffff18", marginBottom: 6, boxShadow: `0 4px 12px ${col.c}44` }} />
              <div className="caption" style={{ fontWeight: 700 }}>{col.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Identity Checks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {VISUAL_CHECKS.map((item) => {
          const done = curData.visual?.[item.id];
          return (
            <div
              key={item.id}
              className="row-hover"
              onClick={() => toggleVisual(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px", borderRadius: 14,
                background:  done ? `${G.gold}10` : G.card,
                border:      `1px solid ${done ? G.gold + "70" : G.border}`,
                cursor:      "pointer",
                transition:  "all 0.2s"
              }}
            >
              <Check done={done} color={G.gold} onToggle={() => toggleVisual(item.id)} />
              <div style={{ 
                width: 32, height: 32, borderRadius: 8, 
                background: done ? `${G.gold}22` : G.textDim, 
                display: "flex", alignItems: "center", justifyContent: "center", 
                fontSize: 16, color: done ? G.gold : G.textMuted, fontWeight: 700, flexShrink: 0 
              }}>
                {item.icon}
              </div>
              <div className="body" style={{ flex: 1, fontWeight: 700, color: done ? G.gold : G.text, textDecoration: done ? "line-through" : "none", textAlign: "right" }}>
                {item.label}
              </div>
              {done && <span style={{ fontSize: 14, color: G.accentLak }}>✓ مطابِق</span>}
            </div>
          );
        })}
      </div>

      {/* Bottom Ring Summary */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{
          width: 50, height: 50, borderRadius: "50%", border: `3px solid ${pct === 100 ? G.accentLak : G.gold}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: "900", color: pct === 100 ? G.accentLak : G.gold
        }}>
          {pct}%
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="h3" style={{ color: pct === 100 ? G.accentLak : G.gold, margin: 0 }}>مستوى التدقيق البصري</div>
          <div className="caption" style={{ marginTop: 2 }}>مكتمل {checkedCount} من {VISUAL_CHECKS.length} معايير الهوية</div>
          {pct === 100 && <div className="caption" style={{ color: G.accentLak, fontWeight: "bold", marginTop: 4 }}>✓ جاهز للنشر والمشاركة</div>}
        </div>
      </div>
    </div>
  );
}
