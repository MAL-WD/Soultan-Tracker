import { useState } from "react";
import { G, CONTENT_TYPES_MONTH, TARGET_AUDIENCES, PRODUCTS, DAYS, BRANCHES } from "../constants/designTokens";

export default function MonthPanel({
  monthPlan,
  activeBranch,
  updMP,
  toggleSegment,
  toggleWeekCT,
  setMonthPlan,
  sv,
  currentUser,
  days,
  data,
  branch,
  followersHistory = {},
  updateFollowers,
  syncSocialFollowers
}) {
  const isAdmin = currentUser?.role === "admin";

  const [syncing, setSyncing] = useState(false);
  const handleSync = async () => {
    setSyncing(true);
    if (syncSocialFollowers) {
      await syncSocialFollowers(true);
    }
    setSyncing(false);
  };

  const currentYear = new Date().getFullYear();
  const ALGERIAN_MONTHS = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  
  // Create a 24-month list of previous year and current year
  const MONTHS_LIST = [];
  const years = [currentYear - 1, currentYear];
  years.forEach(yr => {
    ALGERIAN_MONTHS.forEach((m, idx) => {
      const monthNum = String(idx + 1).padStart(2, "0");
      MONTHS_LIST.push({
        id: `${yr}-${monthNum}`,
        label: `${m} ${yr}`
      });
    });
  });

  const defaultMonthId = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonthId);

  const getPrevMonthId = (monthId) => {
    const [year, month] = monthId.split("-").map(Number);
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = year - 1;
    }
    return `${prevYear}-${String(prevMonth).padStart(2, "0")}`;
  };

  // ── helpers ──
  const updateSalesTarget = (productId, field, value) => {
    const u = JSON.parse(JSON.stringify(monthPlan));
    if (!u.salesTargets) u.salesTargets = {};
    if (!u.salesTargets[productId]) u.salesTargets[productId] = { target: "", actual: "" };
    u.salesTargets[productId][field] = value;
    setMonthPlan(u); sv(undefined, u);
  };

  const updateAudiencePriority = (audId, value) => {
    const u = JSON.parse(JSON.stringify(monthPlan));
    if (!u.audiencePriority) u.audiencePriority = {};
    u.audiencePriority[audId] = value;
    setMonthPlan(u); sv(undefined, u);
  };

  const updateAudienceNote = (audId, value) => {
    const u = JSON.parse(JSON.stringify(monthPlan));
    if (!u.audienceNotes) u.audienceNotes = {};
    u.audienceNotes[audId] = value;
    setMonthPlan(u); sv(undefined, u);
  };

  const togglePostAudience = (dayEn, audId) => {
    const u = JSON.parse(JSON.stringify(monthPlan));
    if (!u.postAudienceMap) u.postAudienceMap = {};
    if (!u.postAudienceMap[dayEn]) u.postAudienceMap[dayEn] = [];
    const arr = u.postAudienceMap[dayEn];
    if (arr.includes(audId)) {
      u.postAudienceMap[dayEn] = arr.filter(x => x !== audId);
    } else {
      u.postAudienceMap[dayEn] = [...arr, audId];
    }
    setMonthPlan(u); sv(undefined, u);
  };

  // ── computed: audience post counts ──
  const audiencePostCounts = {};
  TARGET_AUDIENCES.forEach(a => { audiencePostCounts[a.id] = 0; });
  const pam = monthPlan.postAudienceMap || {};
  Object.values(pam).forEach(auds => {
    (auds || []).forEach(aid => {
      if (audiencePostCounts[aid] !== undefined) audiencePostCounts[aid]++;
    });
  });
  const totalMappedPosts = Object.values(audiencePostCounts).reduce((a, b) => a + b, 0);

  // ── computed: total sales summary ──
  const salesSummary = PRODUCTS.reduce((acc, p) => {
    const st = monthPlan.salesTargets?.[p.id];
    const target = parseInt(st?.target) || 0;
    const actual = parseInt(st?.actual) || 0;
    acc.totalTarget += target;
    acc.totalActual += actual;
    acc.completed += (target > 0 && actual >= target) ? 1 : 0;
    return acc;
  }, { totalTarget: 0, totalActual: 0, completed: 0 });

  const pctColor = (pct) => {
    if (pct >= 80) return "#27AE60";
    if (pct >= 50) return "#E67E22";
    return "#C0392B";
  };

  return (
    <div className="fade-up" style={{ padding: "0 18px 30px" }}>

      {/* ══════════════════════════════════════════════════════════
          SECTION 1: EXISTING — Monthly Marketing Goals
         ══════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════
          SECTION: Followers Growth Tracking
         ══════════════════════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(135deg, ${G.card}, ${G.panel})`,
        border: `1.5px solid ${G.borderGold}33`,
        borderRadius: 20, padding: "22px", marginBottom: 18,
        boxShadow: `0 8px 32px ${G.gold}08`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="h3" style={{ color: G.gold, display: "flex", alignItems: "center", gap: 10, margin: 0 }}>
              📈 تتبع نمو المتابعين
            </div>
            <div className="caption" style={{ color: G.textMuted, marginTop: 4 }}>
              تتبع ومقارنة أعداد المتابعين لفرعك على مختلف المنصات
            </div>
          </div>
          
          {/* Month Selector & Sync Button */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={handleSync}
              disabled={syncing}
              style={{
                background: syncing ? `${G.gold}11` : `${G.gold}22`,
                border: `1px solid ${G.gold}44`,
                borderRadius: 8,
                padding: "8px 14px",
                color: G.goldBright,
                fontSize: 12,
                fontWeight: 700,
                cursor: syncing ? "not-allowed" : "pointer",
                fontFamily: "'ThmanyahText', 'Cairo', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span style={{ display: "inline-block", animation: syncing ? "spin 1s linear infinite" : "none" }}>🔄</span>
              {syncing ? "جاري التحديث..." : "تحديث الآن"}
            </button>

            <span className="caption" style={{ fontWeight: 700, color: G.text }}>اختر الشهر:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              style={{
                background: G.panel,
                border: `1px solid ${G.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                color: G.text,
                fontSize: 13,
                fontWeight: 700,
                outline: "none",
                cursor: "pointer",
                fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
              }}
            >
              {MONTHS_LIST.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Platform Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginBottom: 20 }}>
          {[
            { id: "fb", label: "فيسبوك Facebook", icon: "🔵", color: "#1877F2" },
            { id: "insta", label: "إنستغرام Instagram", icon: "📸", color: "#E1306C" },
            { id: "tiktok", label: "تيك توك TikTok", icon: "🖤", color: "#010101" }
          ].map(platform => {
            const currentVal = followersHistory[selectedMonth]?.[activeBranch.id]?.[platform.id] || "";
            const prevMonthId = getPrevMonthId(selectedMonth);
            const prevVal = followersHistory[prevMonthId]?.[activeBranch.id]?.[platform.id] || "";

            const curNum = parseFloat(currentVal) || 0;
            const prevNum = parseFloat(prevVal) || 0;
            const isManagerOrAdmin = isAdmin || currentUser?.branchId === activeBranch.id;

            // Calculations
            let diff = 0;
            let pct = 0;
            let progressText = "";
            let progressColor = G.textMuted;

            if (curNum && prevNum) {
              diff = curNum - prevNum;
              pct = Math.round((diff / prevNum) * 100);
              if (diff > 0) {
                progressText = `▲ +${diff.toLocaleString()} (+${pct}%)`;
                progressColor = "#27AE60"; // Green
              } else if (diff < 0) {
                progressText = `▼ ${diff.toLocaleString()} (${pct}%)`;
                progressColor = G.red; // Red
              } else {
                progressText = `● لا تغيير (0%)`;
                progressColor = G.textMuted;
              }
            } else if (curNum && !prevNum) {
              progressText = "أول تسجيل (البداية)";
              progressColor = G.gold;
            } else {
              progressText = "في انتظار التسجيل";
              progressColor = G.textMuted;
            }

            return (
              <div key={platform.id} style={{
                background: G.card,
                border: `1px solid ${platform.color}33`,
                borderRadius: 16,
                padding: "16px",
                position: "relative",
                overflow: "hidden"
              }}>
                {/* Platform color strip */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: platform.color }} />
                
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{platform.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: G.text }}>{platform.label}</span>
                </div>

                {/* Input current */}
                <div style={{ marginBottom: 10 }}>
                  <div className="label" style={{ marginBottom: 4, fontSize: 8 }}>المتابعون للشهر الحالي</div>
                  <input
                    type="number"
                    value={currentVal}
                    onChange={e => isManagerOrAdmin && updateFollowers(selectedMonth, activeBranch.id, platform.id, e.target.value)}
                    disabled={!isManagerOrAdmin}
                    placeholder="أدخل العدد..."
                    style={{
                      width: "100%",
                      background: G.panel,
                      border: `1.5px solid ${G.border}`,
                      borderRadius: 8,
                      padding: "8px 10px",
                      color: G.text,
                      fontSize: 16,
                      fontWeight: 900,
                      outline: "none",
                      textAlign: "center",
                      opacity: isManagerOrAdmin ? 1 : 0.7
                    }}
                  />
                </div>

                {/* Previous month display */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: G.textMuted }}>الشهر السابق:</span>
                  <span style={{ fontWeight: 700, color: G.silver }}>
                    {prevVal ? parseFloat(prevVal).toLocaleString() : "—"}
                  </span>
                </div>

                {/* Progress display */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                  <span style={{ color: G.textMuted }}>معدل النمو:</span>
                  <span style={{ fontWeight: 800, color: progressColor }}>
                    {progressText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Caching/Scraping warning note */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: `${G.panel}80`, border: `1px solid ${G.border}`,
          borderRadius: 12, padding: "10px 14px", marginBottom: 18,
          fontSize: 12, color: G.textMuted, direction: "rtl"
        }}>
          <span>ℹ️</span>
          <span>
            يتم تحديث المتابعين تلقائياً عند فتح الموقع (بحد أقصى مرة كل ساعة). 
            إذا تم حظر المزامنة التلقائية لفيسبوك أو إنستغرام، يرجى كتابة الأعداد يدوياً في الخانات أعلاه.
          </span>
        </div>

        {/* Comparative Summary Table of All Branches */}
        <div style={{ background: G.panel, borderRadius: 16, border: `1px solid ${G.border}`, padding: "16px", overflowX: "auto" }}>
          <div className="label" style={{ color: G.gold, marginBottom: 10, fontSize: 11, fontWeight: "bold" }}>
            📊 مقارنة الفروع لشهر {MONTHS_LIST.find(m => m.id === selectedMonth)?.label || selectedMonth}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl", textAlign: "right" }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${G.border}` }}>
                <th style={{ padding: "8px 10px", color: G.textMuted, fontSize: 11 }}>الفرع</th>
                <th style={{ padding: "8px 10px", color: G.textMuted, fontSize: 11, textAlign: "center" }}>🔵 فيسبوك</th>
                <th style={{ padding: "8px 10px", color: G.textMuted, fontSize: 11, textAlign: "center" }}>📸 إنستغرام</th>
                <th style={{ padding: "8px 10px", color: G.textMuted, fontSize: 11, textAlign: "center" }}>🖤 تيك توك</th>
                <th style={{ padding: "8px 10px", color: G.textMuted, fontSize: 11, textAlign: "center" }}>📈 المجموع الكلي</th>
              </tr>
            </thead>
            <tbody>
              {BRANCHES.map(b => {
                const prevMonthId = getPrevMonthId(selectedMonth);
                
                const platforms = ["fb", "insta", "tiktok"];
                const counts = {};
                const prevCounts = {};
                
                platforms.forEach(p => {
                  counts[p] = parseFloat(followersHistory[selectedMonth]?.[b.id]?.[p]) || 0;
                  prevCounts[p] = parseFloat(followersHistory[prevMonthId]?.[b.id]?.[p]) || 0;
                });

                const curTotal = Object.values(counts).reduce((x, y) => x + y, 0);
                const prevTotal = Object.values(prevCounts).reduce((x, y) => x + y, 0);
                
                const isSelectedBranch = b.id === activeBranch.id;

                return (
                  <tr key={b.id} style={{
                    borderBottom: `1px solid ${G.border}`,
                    background: isSelectedBranch ? `${b.dim}33` : "transparent",
                    transition: "all 0.2s"
                  }}>
                    <td style={{ padding: "10px", fontWeight: "bold", color: b.color, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{b.icon}</span>
                      <span>{b.name}</span>
                      {isSelectedBranch && <span style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, background: `${b.color}22`, color: b.color }}>نشط</span>}
                    </td>
                    
                    {platforms.map(p => {
                      const curVal = counts[p];
                      const preVal = prevCounts[p];
                      
                      let cellDiff = 0;
                      let cellPct = 0;
                      let badgeColor = G.textMuted;
                      let badgeText = "";
                      
                      if (curVal && preVal) {
                        cellDiff = curVal - preVal;
                        cellPct = Math.round((cellDiff / preVal) * 100);
                        if (cellDiff > 0) {
                          badgeText = `+${cellPct}%`;
                          badgeColor = "#27AE60";
                        } else if (cellDiff < 0) {
                          badgeText = `${cellPct}%`;
                          badgeColor = G.red;
                        } else {
                          badgeText = "0%";
                          badgeColor = G.textMuted;
                        }
                      } else if (curVal && !preVal) {
                        badgeText = "جديد";
                        badgeColor = G.gold;
                      }

                      return (
                        <td key={p} style={{ padding: "10px", textAlign: "center" }}>
                          <div style={{ fontWeight: "bold", fontSize: 13, color: curVal ? G.text : G.textMuted }}>
                            {curVal ? curVal.toLocaleString() : "—"}
                          </div>
                          {preVal > 0 && (
                            <div className="caption" style={{ fontSize: 9, opacity: 0.6 }}>
                              السابق: {preVal.toLocaleString()}
                            </div>
                          )}
                          {badgeText && (
                            <span style={{
                              display: "inline-block", fontSize: 8, fontWeight: 900,
                              padding: "1px 5px", borderRadius: 4,
                              background: `${badgeColor}15`, color: badgeColor,
                              marginTop: 2
                            }}>
                              {badgeText}
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Cell */}
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <div style={{ fontWeight: 900, fontSize: 14, color: curTotal ? G.goldBright : G.textMuted }}>
                        {curTotal ? curTotal.toLocaleString() : "—"}
                      </div>
                      {prevTotal > 0 && (
                        <div className="caption" style={{ fontSize: 9, color: G.textMuted }}>
                          السابق: {prevTotal.toLocaleString()}
                        </div>
                      )}
                      {curTotal > 0 && prevTotal > 0 && (
                        <span style={{
                          display: "inline-block", fontSize: 8, fontWeight: 900,
                          padding: "1px 5px", borderRadius: 4,
                          background: curTotal >= prevTotal ? "#27AE6015" : `${G.red}15`,
                          color: curTotal >= prevTotal ? "#27AE60" : G.red,
                          marginTop: 2
                        }}>
                          {curTotal >= prevTotal ? "+" : ""}{Math.round(((curTotal - prevTotal) / prevTotal) * 100)}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2: NEW — Target Audiences & Priorities
         ══════════════════════════════════════════════════════════ */}
      <div style={{ 
        background: `linear-gradient(135deg, ${G.card}, ${G.panel})`, 
        border: `1px solid ${G.borderGold}33`, 
        borderRadius: 20, padding: "22px", marginBottom: 18,
        boxShadow: `0 8px 32px ${G.gold}08`
      }}>
        <div className="h3" style={{ color: G.gold, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
          👨‍👩‍👧‍👦 الجمهور المستهدف والأولويات
        </div>
        <div className="caption" style={{ marginBottom: 18, color: G.textMuted }}>
          حدد نسبة تركيز المحتوى لكل فئة جمهور هذا الشهر
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {TARGET_AUDIENCES.map(aud => {
            const priority = monthPlan.audiencePriority?.[aud.id] || "";
            const note = monthPlan.audienceNotes?.[aud.id] || "";
            const relatedProducts = PRODUCTS.filter(p => p.audiences.includes(aud.id));
            const postCount = audiencePostCounts[aud.id] || 0;
            const priorityNum = parseInt(priority) || 0;

            return (
              <div key={aud.id} style={{
                background: G.card,
                border: `1.5px solid ${aud.color}33`,
                borderRadius: 16,
                padding: "16px",
                transition: "all .25s ease",
                position: "relative",
                overflow: "hidden"
              }}>
                {/* Glow accent */}
                <div style={{
                  position: "absolute", top: 0, right: 0, width: 80, height: 80,
                  background: `radial-gradient(circle, ${aud.color}15, transparent)`,
                  borderRadius: "0 16px 0 80px"
                }} />

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, position: "relative" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${aud.color}18`,
                    border: `1px solid ${aud.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22
                  }}>{aud.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: G.text }}>{aud.label}</div>
                    <div className="caption">{postCount} منشور مخصص</div>
                  </div>
                </div>

                {/* Priority % */}
                <div style={{ marginBottom: 10 }}>
                  <div className="label" style={{ marginBottom: 4 }}>نسبة التركيز %</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      value={priority}
                      onChange={e => isAdmin && updateAudiencePriority(aud.id, e.target.value)}
                      readOnly={!isAdmin}
                      placeholder="0"
                      style={{
                        width: 60, background: `${aud.color}12`, border: `1px solid ${aud.color}33`,
                        borderRadius: 8, padding: "6px 8px", color: aud.color,
                        fontSize: 18, fontWeight: 900, outline: "none", textAlign: "center",
                        opacity: isAdmin ? 1 : 0.7
                      }}
                    />
                    <div style={{ flex: 1, height: 6, background: `${G.border}`, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        width: `${Math.min(priorityNum, 100)}%`, height: "100%",
                        background: `linear-gradient(90deg, ${aud.color}88, ${aud.color})`,
                        borderRadius: 3, transition: "width .4s ease"
                      }} />
                    </div>
                  </div>
                </div>

                {/* Related products */}
                <div style={{ marginBottom: 10 }}>
                  <div className="label" style={{ marginBottom: 6 }}>المنتجات المرتبطة</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {relatedProducts.map(p => (
                      <span key={p.id} style={{
                        padding: "3px 8px", borderRadius: 6, fontSize: 10,
                        background: `${aud.color}12`, border: `1px solid ${aud.color}22`,
                        color: aud.color, fontWeight: 600
                      }}>{p.icon} {p.label}</span>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>📝 ملاحظات</div>
                  <textarea
                    value={note}
                    onChange={e => updateAudienceNote(aud.id, e.target.value)}
                    placeholder="ملاحظات حول هذا الجمهور..."
                    rows={2}
                    style={{
                      width: "100%", background: G.panel, border: `1px solid ${G.border}`,
                      borderRadius: 8, padding: "8px 10px", color: G.text,
                      fontSize: 12, outline: "none", resize: "vertical",
                      fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3: NEW — Sales Targets & Tracking
         ══════════════════════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(135deg, ${G.card}, #0D1F10)`,
        border: `1px solid ${G.borderGold}33`,
        borderRadius: 20, padding: "22px", marginBottom: 18,
        boxShadow: `0 8px 32px ${G.gold}08`
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
          <div className="h3" style={{ color: G.gold, display: "flex", alignItems: "center", gap: 10 }}>
            💰 أهداف المبيعات الشهرية
          </div>
          {/* Summary badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{
              padding: "6px 14px", borderRadius: 10,
              background: `${G.gold}15`, border: `1px solid ${G.gold}33`,
              fontSize: 12, fontWeight: 700, color: G.gold
            }}>
              🎯 الهدف: {salesSummary.totalTarget}
            </div>
            <div style={{
              padding: "6px 14px", borderRadius: 10,
              background: salesSummary.totalActual >= salesSummary.totalTarget && salesSummary.totalTarget > 0 ? "#27AE6015" : "#E67E2215",
              border: `1px solid ${salesSummary.totalActual >= salesSummary.totalTarget && salesSummary.totalTarget > 0 ? "#27AE60" : "#E67E22"}33`,
              fontSize: 12, fontWeight: 700,
              color: salesSummary.totalActual >= salesSummary.totalTarget && salesSummary.totalTarget > 0 ? "#27AE60" : "#E67E22"
            }}>
              📦 الفعلي: {salesSummary.totalActual}
            </div>
            <div style={{
              padding: "6px 14px", borderRadius: 10,
              background: "#27AE6015", border: "1px solid #27AE6033",
              fontSize: 12, fontWeight: 700, color: "#27AE60"
            }}>
              ✅ {salesSummary.completed}/{PRODUCTS.length} محقق
            </div>
          </div>
        </div>
        <div className="caption" style={{ marginBottom: 18, color: G.textMuted }}>
          {isAdmin ? "حدد أهداف المبيعات لكل منتج وتتبع التقدم الفعلي" : "أهداف المبيعات المحددة من المدير"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PRODUCTS.map(product => {
            const st = monthPlan.salesTargets?.[product.id] || {};
            const target = parseInt(st.target) || 0;
            const actual = parseInt(st.actual) || 0;
            const pct = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
            const achieved = target > 0 && actual >= target;
            const relAudiences = TARGET_AUDIENCES.filter(a => product.audiences.includes(a.id));

            return (
              <div key={product.id} style={{
                background: G.card,
                border: `1px solid ${achieved ? "#27AE60" : G.border}44`,
                borderRadius: 14,
                padding: "14px 16px",
                transition: "all .25s ease",
                borderRight: `3px solid ${achieved ? "#27AE60" : target > 0 ? pctColor(pct) : G.border}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                  {/* Product info */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: G.panel, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0
                  }}>{product.icon}</div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: G.text }}>{product.label}</div>
                    <div style={{ display: "flex", gap: 4, marginTop: 3, flexWrap: "wrap" }}>
                      {relAudiences.map(a => (
                        <span key={a.id} style={{
                          fontSize: 9, padding: "2px 6px", borderRadius: 4,
                          background: `${a.color}15`, color: a.color, fontWeight: 600
                        }}>{a.icon} {a.label}</span>
                      ))}
                    </div>
                  </div>

                  {/* Target input */}
                  <div style={{ textAlign: "center" }}>
                    <div className="label" style={{ marginBottom: 3, fontSize: 8 }}>🎯 الهدف</div>
                    <input
                      value={st.target || ""}
                      onChange={e => isAdmin && updateSalesTarget(product.id, "target", e.target.value)}
                      readOnly={!isAdmin}
                      placeholder="—"
                      style={{
                        width: 60, background: `${G.gold}10`, border: `1px solid ${G.gold}22`,
                        borderRadius: 8, padding: "5px", color: G.gold,
                        fontSize: 16, fontWeight: 900, outline: "none", textAlign: "center",
                        opacity: isAdmin ? 1 : 0.7
                      }}
                    />
                  </div>

                  {/* Actual input */}
                  <div style={{ textAlign: "center" }}>
                    <div className="label" style={{ marginBottom: 3, fontSize: 8 }}>📦 الفعلي</div>
                    <input
                      value={st.actual || ""}
                      onChange={e => updateSalesTarget(product.id, "actual", e.target.value)}
                      placeholder="—"
                      style={{
                        width: 60,
                        background: achieved ? "#27AE6010" : `${activeBranch.color}10`,
                        border: `1px solid ${achieved ? "#27AE60" : activeBranch.color}22`,
                        borderRadius: 8, padding: "5px",
                        color: achieved ? "#27AE60" : activeBranch.color,
                        fontSize: 16, fontWeight: 900, outline: "none", textAlign: "center"
                      }}
                    />
                  </div>

                  {/* Status badge */}
                  <div style={{
                    padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800,
                    background: achieved ? "#27AE6018" : target > 0 ? `${pctColor(pct)}18` : `${G.border}44`,
                    color: achieved ? "#27AE60" : target > 0 ? pctColor(pct) : G.textMuted,
                    border: `1px solid ${achieved ? "#27AE60" : target > 0 ? pctColor(pct) : G.border}33`,
                    minWidth: 50, textAlign: "center"
                  }}>
                    {achieved ? "✓" : target > 0 ? `${pct}%` : "—"}
                  </div>
                </div>

                {/* Progress bar */}
                {target > 0 && (
                  <div style={{ height: 5, background: G.panel, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: achieved
                        ? "linear-gradient(90deg, #27AE60, #2ECC71)"
                        : `linear-gradient(90deg, ${pctColor(pct)}88, ${pctColor(pct)})`,
                      borderRadius: 3,
                      transition: "width .5s cubic-bezier(.4,0,.2,1)"
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4: NEW — Content Distribution per Audience
         ══════════════════════════════════════════════════════════ */}
      <div style={{
        background: G.card,
        border: `1px solid ${G.borderGold}22`,
        borderRadius: 20, padding: "22px", marginBottom: 18,
        boxShadow: `0 8px 32px ${G.gold}06`
      }}>
        <div className="h3" style={{ color: G.gold, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
          📊 توزيع المحتوى على الجمهور
        </div>
        <div className="caption" style={{ marginBottom: 18, color: G.textMuted }}>
          مقارنة بين النسبة المخططة والمنشورات الفعلية المخصصة لكل جمهور
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TARGET_AUDIENCES.map(aud => {
            const planned = parseInt(monthPlan.audiencePriority?.[aud.id]) || 0;
            const postCount = audiencePostCounts[aud.id] || 0;
            const actualPct = totalMappedPosts > 0 ? Math.round((postCount / totalMappedPosts) * 100) : 0;

            return (
              <div key={aud.id} style={{
                background: G.panel, borderRadius: 12, padding: "12px 14px",
                border: `1px solid ${G.border}`
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{aud.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: G.text }}>{aud.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, fontWeight: 700 }}>
                    <span style={{ color: G.gold }}>مخطط: {planned}%</span>
                    <span style={{ color: aud.color }}>فعلي: {actualPct}% ({postCount})</span>
                  </div>
                </div>

                {/* Double bar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Planned bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="label" style={{ width: 40, fontSize: 8, textAlign: "center" }}>مخطط</div>
                    <div style={{ flex: 1, height: 5, background: `${G.border}`, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        width: `${Math.min(planned, 100)}%`, height: "100%",
                        background: `linear-gradient(90deg, ${G.gold}88, ${G.gold})`,
                        borderRadius: 3, transition: "width .4s ease"
                      }} />
                    </div>
                  </div>
                  {/* Actual bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="label" style={{ width: 40, fontSize: 8, textAlign: "center" }}>فعلي</div>
                    <div style={{ flex: 1, height: 5, background: `${G.border}`, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        width: `${Math.min(actualPct, 100)}%`, height: "100%",
                        background: `linear-gradient(90deg, ${aud.color}88, ${aud.color})`,
                        borderRadius: 3, transition: "width .4s ease"
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: NEW — Post-Audience Mapping per Day
         ══════════════════════════════════════════════════════════ */}
      <div style={{
        background: G.card,
        border: `1px solid ${activeBranch.color}22`,
        borderRadius: 20, padding: "22px", marginBottom: 18,
        boxShadow: `0 8px 32px ${activeBranch.color}06`
      }}>
        <div className="h3" style={{ color: G.gold, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
          📝 خريطة ربط المنشورات بالجمهور
        </div>
        <div className="caption" style={{ marginBottom: 18, color: G.textMuted }}>
          لكل يوم، حدد الجمهور المستهدف للمحتوى المنشور
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(days || DAYS).map(d => {
            const selectedAuds = monthPlan.postAudienceMap?.[d.en] || [];

            return (
              <div key={d.en} style={{
                background: G.panel, borderRadius: 14, padding: "14px 16px",
                border: `1px solid ${G.border}`,
                borderRight: `3px solid ${selectedAuds.length > 0 ? activeBranch.color : G.border}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: selectedAuds.length > 0 ? `${activeBranch.color}18` : G.card,
                    border: `1px solid ${selectedAuds.length > 0 ? activeBranch.color : G.border}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 900, color: selectedAuds.length > 0 ? activeBranch.color : G.textMuted
                  }}>{d.short}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: G.text }}>{d.ar}</div>
                    <div className="caption">{selectedAuds.length} جمهور مستهدف</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TARGET_AUDIENCES.map(aud => {
                    const on = selectedAuds.includes(aud.id);
                    return (
                      <div
                        key={aud.id}
                        onClick={() => togglePostAudience(d.en, aud.id)}
                        style={{
                          padding: "5px 10px", borderRadius: 8, cursor: "pointer",
                          background: on ? `${aud.color}18` : G.card,
                          border: `1px solid ${on ? aud.color : G.border}44`,
                          color: on ? aud.color : G.textMuted,
                          fontSize: 11, fontWeight: 700,
                          transition: "all .15s ease",
                          display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <span>{aud.icon}</span>
                        <span>{aud.label}</span>
                        {on && <span style={{ marginRight: 2 }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          EXISTING SECTIONS BELOW (preserved)
         ══════════════════════════════════════════════════════════ */}

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
