import { useState } from "react";
import { G, DAYS, SM_TASKS_BY_TYPE as DEFAULT_SM_TASKS, STORIES_COUNT } from "../constants/designTokens";

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

export default function TasksPanel({
  branch,
  day,
  data,
  branchNames,
  activeBranch,
  types,
  smTasksByType = DEFAULT_SM_TASKS,
  catFilter,
  setCatFilter,
  toggleTask,
  toggleStory,
  togglePublished,
  setSubject,
  setNote,
  comments,
  addComment,
  contentTypeMetadata = {}
}) {
  const curData = data[branch]?.[day] || {};
  const allTasks = types.flatMap(type => (smTasksByType[type] || []).map(t => ({ ...t, key: `${type}_${t.id}`, type })));
  const cats = [...new Set(allTasks.map(t => t.cat))];
  const filteredTasks = catFilter === "all" ? allTasks : allTasks.filter(t => t.cat === catFilter);
  const dayDone = allTasks.filter(t => curData.tasks?.[t.key]).length;
  
  // Dynamically calculate actual day denominator (Fridays do not have stories)
  const hasStories = day !== "FRI";
  const dayTotal = allTasks.length + (hasStories ? STORIES_COUNT : 0);
  const dayPct = dayTotal > 0 ? Math.round(((dayDone + (hasStories ? (curData.stories || []).filter(Boolean).length : 0)) / dayTotal) * 100) : 0;

  return (
    <div className="fade-up" style={{ padding: "0 18px 30px" }}>
      
      {/* 🚀 TASK OF THE DAY - PREMIUM GLASSMORPHISM CARD */}
      {types.length > 0 && (
        <div style={{ 
          background: `linear-gradient(135deg, ${activeBranch.dim}70, ${G.card})`, 
          border: `1.5px solid ${activeBranch.color}44`,
          borderRadius: 20, 
          padding: "20px 24px", 
          marginBottom: 22,
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          boxShadow: `0 12px 30px ${activeBranch.color}15`,
          gap: 16,
          direction: "rtl",
          flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", flex: "1 1 auto" }}>
            <div style={{ 
              width: 60, 
              height: 60, 
              borderRadius: 18, 
              background: `linear-gradient(135deg, ${activeBranch.color}22, ${activeBranch.color}44)`,
              border: `1.5px solid ${activeBranch.color}50`,
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: 32,
              boxShadow: `0 8px 24px ${activeBranch.color}33`,
              flexShrink: 0
            }}>
              {contentTypeMetadata[types[0]]?.icon || "📋"}
            </div>
            <div>
              <div className="label" style={{ color: activeBranch.color, fontSize: 11, letterSpacing: 1.5, marginBottom: 4, fontWeight: "bold" }}>نوع المحتوى المقرر لليوم</div>
              <div className="h2" style={{ margin: 0, fontSize: "clamp(16px, 4vw, 20px)", fontWeight: 900, color: G.text, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                {types.map(t => contentTypeMetadata[t]?.name || t).join(" + ")}
              </div>
            </div>
          </div>
          <div style={{
            background: `${activeBranch.color}22`,
            color: activeBranch.color,
            padding: "8px 16px",
            borderRadius: 30,
            fontSize: 12,
            fontWeight: 900,
            border: `1.5px solid ${activeBranch.color}50`,
            boxShadow: `0 0 10px ${activeBranch.color}30`,
            whiteSpace: "nowrap"
          }}>
            نشط اليوم ⚡
          </div>
        </div>
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div className="h2" style={{ color: activeBranch.color, margin: 0 }}>
            {DAYS.find(d => d.en === day)?.ar} — {branchNames[branch]}
          </div>
          <div className="body-sm" style={{ marginTop: 4 }}>
            {dayDone} من {allTasks.length} مهمة مكتملة
            {hasStories && ` · ${(curData.stories || []).filter(Boolean).length} من ${STORIES_COUNT} ستوري`}
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ring pct={dayPct} color={activeBranch.color} size={60} stroke={5} />
          <div className="h3" style={{ position: "absolute", color: activeBranch.color, margin: 0 }}>{dayPct}%</div>
        </div>
      </div>

      {/* Subject Input Card */}
      <div style={{ 
        background: G.card, 
        border: `1px solid ${G.border}`, 
        borderRadius: 16, 
        padding: "16px", 
        marginBottom: 20 
      }}>
        <div className="label" style={{ marginBottom: 8, fontWeight: "bold", color: activeBranch.color }}>📝 موضوع محتوى اليوم (Subject)</div>
        <input 
          type="text"
          value={curData.subject || ""} 
          onChange={e => setSubject(e.target.value)} 
          placeholder="اكتب فكرة أو عنوان أو موضوع محتوى اليوم بالتفصيل..." 
          style={{
            width: "100%", background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10,
            padding: "12px 14px", fontSize: 14, outline: "none",
            transition: "border-color .2s", fontFamily: "'ThmanyahText', sans-serif",
            color: G.text, textAlign: "right"
          }} 
          onFocus={e => e.target.style.borderColor = activeBranch.color + "77"}
          onBlur={e => e.target.style.borderColor = G.border}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <button
          onClick={() => setCatFilter("all")}
          style={{
            padding: "6px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer",
            fontFamily: "'ThmanyahText', sans-serif", fontWeight: 600,
            border:     `1px solid ${catFilter === "all" ? activeBranch.color : G.border}`,
            background: catFilter === "all" ? `${activeBranch.color}22` : "transparent",
            color:      catFilter === "all" ? activeBranch.color : G.textMuted,
          }}
        >الكل</button>
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            style={{
              padding: "6px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer",
              fontFamily: "'ThmanyahText', sans-serif", fontWeight: 600,
              border:     `1px solid ${catFilter === c ? activeBranch.color : G.border}`,
              background: catFilter === c ? `${activeBranch.color}22` : "transparent",
              color:      catFilter === c ? activeBranch.color : G.textMuted,
            }}
          >{c}</button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredTasks.map((task) => {
          const done = curData.tasks?.[task.key];
          return (
            <div
              key={task.key}
              onClick={() => toggleTask(task.key)}
              className="row-hover"
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px", borderRadius: 14, cursor: "pointer",
                background:  done ? `${activeBranch.color}10` : G.card,
                border:      `1px solid ${done ? activeBranch.color + "60" : G.border}`,
                transition:  "all .2s ease"
              }}
            >
              <Check done={done} color={activeBranch.color} onToggle={() => toggleTask(task.key)} />
              <span style={{ fontSize: 18 }}>{task.icon}</span>
              <div style={{ flex: 1, textAlign: "right", minWidth: 0 }}>
                <div className="body" style={{ 
                  fontWeight: 700, 
                  color: done ? activeBranch.color : G.text, 
                  textDecoration: done ? "line-through" : "none", 
                  margin: 0,
                  wordBreak: "break-word"
                }}>
                  {task.label}
                </div>
                <div className="caption" style={{ marginTop: 2 }}>
                  {task.cat} · {contentTypeMetadata[task.type]?.name || task.type}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stories */}
      {hasStories && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, color: G.textMuted, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase", fontWeight: "bold" }}>
            الستوريز اليومية · {(curData.stories || []).filter(Boolean).length}/{STORIES_COUNT}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Array.from({ length: STORIES_COUNT }).map((_, i) => {
              const done = curData.stories?.[i];
              return (
                <div
                  key={i}
                  onClick={() => toggleStory(i)}
                  style={{
                    flex: 1, maxWidth: 44, aspectRatio: "9/16", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4,
                    background: done ? `linear-gradient(180deg,${activeBranch.color},${activeBranch.color}77)` : G.card,
                    border:     `1.5px solid ${done ? activeBranch.color : G.border}`,
                    boxShadow:  done ? `0 0 10px ${activeBranch.glow}` : "none",
                    transition: "all .25s",
                  }}
                >
                  <span style={{ fontSize: 8, color: done ? "#000" : G.textMuted, fontWeight: 700 }}>{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Published Toggle */}
      <div 
        onClick={togglePublished} 
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", 
          padding: "16px 20px", borderRadius: 16, marginTop: 20, cursor: "pointer",
          background: curData.published ? `${activeBranch.color}15` : G.card,
          border: `1px solid ${curData.published ? activeBranch.color : G.border}`,
          transition: "all .2s"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>{curData.published ? "✅" : "📤"}</span>
          <div className="body" style={{ color: curData.published ? activeBranch.color : G.text, margin: 0, fontWeight: 700 }}>
            {curData.published ? "تم تأكيد النشر بنجاح" : "لم يتم تأكيد النشر بعد"}
          </div>
        </div>
        <div style={{ width: 44, height: 24, borderRadius: 12, background: curData.published ? activeBranch.color : G.border, position: "relative", transition: "all .3s" }}>
          <div style={{ position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "all .3s cubic-bezier(.34,1.56,.64,1)", left: curData.published ? 23 : 3 }} />
        </div>
      </div>

      {/* Note */}
      <div style={{ marginTop: 20 }}>
        <div className="label" style={{ marginBottom: 8, fontWeight: "bold" }}>ملاحظات الفريق والتوجيهات</div>
        <textarea 
          value={curData.note || ""} 
          onChange={e => setNote(e.target.value)} 
          placeholder="اكتب توجيهات، أفكار، أو ملاحظات بخصوص محتوى اليوم..." 
          style={{
            width: "100%", background: G.card, border: `1px solid ${G.border}`, borderRadius: 12,
            padding: "14px 16px", fontSize: 14, resize: "vertical", minHeight: 80, outline: "none",
            transition: "border-color .2s", fontFamily: "'ThmanyahText', sans-serif"
          }} 
          onFocus={e => e.target.style.borderColor = activeBranch.color + "77"}
          onBlur={e => e.target.style.borderColor = G.border}
        />
      </div>

      {/* COMMENTS SECTION */}
      <div style={{ marginTop: 30, background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "18px" }}>
        <div className="h3" style={{ marginBottom: 14 }}>💬 مناقشات الفريق والتعليقات</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {(comments[`${branch}_${day}`] || []).map(com => (
            <div key={com.id} style={{ background: G.panel, padding: "10px 14px", borderRadius: 12, textAlign: "right" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span className="body" style={{ fontWeight: 700, color: G.goldBright }}>{com.user}</span>
                <span className="caption">{com.time}</span>
              </div>
              <div className="body" style={{ color: G.text, margin: 0 }}>{com.text}</div>
            </div>
          ))}
          {(comments[`${branch}_${day}`] || []).length === 0 && (
            <div className="body-sm" style={{ textAlign: "center", opacity: 0.5, padding: "10px 0" }}>لا توجد تعليقات بعد. ابدأ النقاش!</div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            id="commentInput"
            placeholder="اكتب تعليقاً..."
            style={{ 
              flex: 1, background: G.panel, border: `1px solid ${G.border}`, 
              borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none",
              textAlign: "right", minWidth: 0
            }}
            onKeyDown={e => { if (e.key === "Enter") { addComment(e.target.value); e.target.value = ""; } }}
          />
          <button
            onClick={() => { const inp = document.getElementById("commentInput"); addComment(inp.value); inp.value = ""; }}
            style={{ 
              background: G.green, color: "#fff", border: "none", borderRadius: 10, 
              padding: "0 20px", cursor: "pointer", fontWeight: 700, 
              fontFamily: "'ThmanyahText', sans-serif", flexShrink: 0 
            }}
          >إرسال</button>
        </div>
      </div>
    </div>
  );
}
