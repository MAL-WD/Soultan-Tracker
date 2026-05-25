import { G, CONTENT_TYPES_MONTH } from "../constants/designTokens";

export default function MonthPanel({
  monthPlan,
  activeBranch,
  updMP,
  toggleSegment,
  toggleWeekCT,
  setMonthPlan,
  sv
}) {
  return (
    <div className="fade-up" style={{ padding: "0 18px 30px" }}>
      {/* Monthly Goals */}
      <div style={{ background: G.card, border: `1px solid ${G.borderGold}44`, borderRadius: 16, padding: "18px", marginBottom: 18 }}>
        <div className="h3" style={{ color: G.gold, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>🎯 أهداف هذا الشهر التسويقية</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { k: "followers", l: "المستهدفون (المتابعون الجديد)", icon: "👥" }, 
            { k: "reach", l: "معدل الوصول للجمهور", icon: "📡" }, 
            { k: "sales", l: "المبيعات المتوقعة", icon: "💰" }, 
            { k: "engagement", l: "نسبة التفاعل المستهدفة %", icon: "❤️" }
          ].map(f => (
            <div key={f.k} style={{ background: G.panel, borderRadius: 12, padding: "12px 14px", textAlign: "right" }}>
              <div className="label" style={{ marginBottom: 6 }}>{f.icon} {f.l}</div>
              <input
                value={monthPlan.goals[f.k] || ""}
                onChange={e => updMP(`goals.${f.k}`, e.target.value)}
                style={{ width: "100%", background: "transparent", border: "none", color: G.gold, fontSize: 18, fontWeight: 900, outline: "none", textAlign: "center" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Segments/Targeting */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "18px", marginBottom: 18 }}>
        <div className="h3" style={{ color: G.gold, marginBottom: 14 }}>🎯 الفئات المستهدفة للمحتوى</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(monthPlan.segments || []).map(seg => (
            <div
              key={seg.id}
              onClick={() => toggleSegment(seg.id)}
              style={{
                padding: "8px 16px", borderRadius: 12, cursor: "pointer",
                background: seg.active ? `${activeBranch.color}22` : G.panel,
                border: `1px solid ${seg.active ? activeBranch.color : G.border}`,
                color: seg.active ? activeBranch.color : G.textMuted,
                fontSize: 13, fontWeight: "bold", transition: "all .15s"
              }}
            >
              {seg.label} {seg.active ? "✓" : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "18px", marginBottom: 18 }}>
        <div className="h3" style={{ color: G.gold, marginBottom: 14 }}>🔄 مسار البيع التسويقي (Conversion Funnel)</div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { k: "awareness", l: "الوعي (Awareness)" }, 
            { k: "interest", l: "الاهتمام (Interest)" }, 
            { k: "desire", l: "الرغبة (Desire)" }, 
            { k: "action", l: "الشراء (Action)" }
          ].map((s, si) => (
            <div 
              key={s.k} 
              style={{ 
                flex: 1, 
                background: `${G.gold}12`, 
                border: `1px solid ${G.gold}22`, 
                borderRadius: si === 0 ? "12px 0 0 12px" : si === 3 ? "0 12px 12px 0" : "0", 
                padding: "12px 6px", 
                textAlign: "center" 
              }}
            >
              <div className="label" style={{ color: G.gold, marginBottom: 6, fontSize: 9 }}>{s.l}</div>
              <input
                value={monthPlan.funnel[s.k] || ""}
                onChange={e => updMP(`funnel.${s.k}`, e.target.value)}
                style={{ width: "100%", background: "transparent", border: "none", color: G.gold, fontSize: 14, fontWeight: 900, outline: "none", textAlign: "center" }}
                placeholder="أرقام / نسب..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Plan */}
      <div className="h3" style={{ color: G.gold, marginBottom: 14, textAlign: "right" }}>📅 الخطة التفصيلية الأسبوعية</div>
      {monthPlan.weeks.map((w, wi) => (
        <div key={wi} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "16px", marginBottom: 14, textAlign: "right" }}>
          <div className="h3" style={{ color: activeBranch.color, marginBottom: 12 }}>
            {w.label} · <span style={{ opacity: 0.7, fontSize: 14 }}>{w.period}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { k: "focus", l: "تركيز الأسبوع" }, 
              { k: "campaign", l: "اسم الحملة" }, 
              { k: "offer", l: "العرض الترويجي" }, 
              { k: "targeting", l: "الجمهور المستهدف" }
            ].map(f => (
              <div key={f.k} style={{ background: G.panel, borderRadius: 10, padding: "10px 12px" }}>
                <div className="label" style={{ marginBottom: 4 }}>{f.l}</div>
                <input
                  value={w[f.k] || ""}
                  onChange={e => {
                    const ws = [...monthPlan.weeks];
                    ws[wi] = { ...ws[wi], [f.k]: e.target.value };
                    const u = { ...monthPlan, weeks: ws };
                    setMonthPlan(u);
                    sv(undefined, u);
                  }}
                  style={{ width: "100%", background: "transparent", border: "none", color: G.text, fontSize: 14, fontWeight: 700, outline: "none" }}
                />
              </div>
            ))}
          </div>
          <div className="label" style={{ marginBottom: 8, fontWeight: "bold" }}>أنواع المحتوى المختارة لهذا الأسبوع</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CONTENT_TYPES_MONTH.map(ct => {
              const on = (w.contentTypes || []).includes(ct);
              return (
                <div
                  key={ct}
                  onClick={() => toggleWeekCT(wi, ct)}
                  style={{
                    padding: "6px 14px", borderRadius: 10, cursor: "pointer",
                    border:     `1px solid ${on ? activeBranch.color : G.border}`,
                    background: on ? `${activeBranch.color}22` : G.panel,
                    color:      on ? activeBranch.color : G.textMuted,
                    fontSize:   12, fontWeight: 700, transition: "all .15s"
                  }}
                >{ct}</div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
