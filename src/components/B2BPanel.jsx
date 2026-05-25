import { G } from "../constants/designTokens";

function Check({ done, color, onToggle }) {
  const s = 21;
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
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

export default function B2BPanel({
  b2bTasks,
  activeBranch,
  toggleB2b,
  addB2b,
  newB2b,
  setNewB2b
}) {
  const doneCount = b2bTasks.filter(t => t.done).length;
  const pct = b2bTasks.length > 0 ? Math.round((doneCount / b2bTasks.length) * 100) : 0;
  const cats = [...new Set(b2bTasks.map(t => t.cat))];

  return (
    <div className="fade-up" style={{ padding: "0 18px 30px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <div className="h2" style={{ color: activeBranch.color, margin: 0 }}>🏢 مهام قطاع B2B</div>
          <div className="body-sm" style={{ marginTop: 4 }}>{doneCount} من {b2bTasks.length} مهمة مكتملة</div>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ring pct={pct} color={activeBranch.color} size={60} stroke={5} />
          <div className="h3" style={{ position: "absolute", color: activeBranch.color, margin: 0 }}>{pct}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 8, background: G.textDim, borderRadius: 4, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ 
          height: "100%", 
          width: `${pct}%`, 
          background: `linear-gradient(90deg, ${activeBranch.color}88, ${activeBranch.color})`, 
          borderRadius: 4, 
          transition: "width 0.8s cubic-bezier(.34,1.56,.64,1)" 
        }} />
      </div>

      {/* Tasks by Category */}
      {cats.map(cat => (
        <div key={cat} style={{ marginBottom: 18 }}>
          <div className="label" style={{ marginBottom: 10, letterSpacing: 2, fontWeight: "bold" }}>{cat}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {b2bTasks.filter(t => t.cat === cat).map(task => (
              <div
                key={task.id}
                onClick={() => toggleB2b(task.id)}
                className="row-hover"
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 18px", borderRadius: 14,
                  background: task.done ? `${activeBranch.color}10` : G.card,
                  border:     `1px solid ${task.done ? activeBranch.color + "60" : G.border}`,
                  cursor:     "pointer",
                  transition: "all .2s ease"
                }}
              >
                <Check done={task.done} color={activeBranch.color} onToggle={() => toggleB2b(task.id)} />
                <span className="body" style={{ 
                  flex: 1, fontWeight: 700, 
                  color: task.done ? activeBranch.color : G.text, 
                  textDecoration: task.done ? "line-through" : "none",
                  textAlign: "right"
                }}>
                  {task.label}
                </span>
                {task.done && <span style={{ fontSize: 14, color: G.accentLak }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add new B2B task */}
      <div style={{ 
        display: "flex", gap: 10, marginTop: 16, 
        background: G.card, border: `1px dashed ${activeBranch.color}44`, 
        borderRadius: 16, padding: "12px 16px", alignItems: "center" 
      }}>
        <input
          value={newB2b}
          onChange={e => setNewB2b(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addB2b()}
          placeholder="+ إضافة مهمة B2B جديدة..."
          style={{
            flex: 1, background: "transparent", border: "none",
            fontSize: 14, outline: "none", color: G.text,
            fontFamily: "'ThmanyahText', sans-serif",
            textAlign: "right"
          }}
        />
        <button
          onClick={addB2b}
          style={{
            background: `linear-gradient(135deg, ${activeBranch.color}33, ${activeBranch.color}22)`, 
            border: `1px solid ${activeBranch.color}55`,
            borderRadius: 12, color: activeBranch.color, padding: "10px 24px",
            cursor: "pointer", fontSize: 14, fontWeight: 700,
            fontFamily: "'ThmanyahText', sans-serif",
            transition: "all 0.2s"
          }}
        >إضافة</button>
      </div>
    </div>
  );
}
