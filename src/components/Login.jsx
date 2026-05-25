import { useState } from "react";
import { G } from "../constants/designTokens";

export default function Login({ onLogin, apiUrl }) {
  const [user, setU] = useState("");
  const [pass, setP] = useState("");
  const [err, setE]  = useState("");
  const [loading, setL] = useState(false);

  const handle = async () => {
    if (!user || !pass) { setE("يرجى إدخال البيانات"); return; }
    setL(true); setE("");
    try {
      const r = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.trim(), password: pass })
      });
      const d = await r.json();
      if (d.success && d.token) {
        localStorage.setItem("token", d.token);
        onLogin(d.user);
      } else {
        setE(d.error || "خطأ في تسجيل الدخول");
      }
    } catch { setE("تعذر الاتصال بالخادم"); }
    setL(false);
  };

  return (
    <div style={{ 
      background: `radial-gradient(circle at top right, ${G.green}33, ${G.bg}), radial-gradient(circle at bottom left, ${G.goldDim}, ${G.bg})`,
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      position: "relative", overflow: "hidden"
    }}>
      {/* Decorative Orbs */}
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 300, height: 300, background: G.gold, filter: "blur(120px)", opacity: 0.1, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 250, height: 250, background: G.green, filter: "blur(100px)", opacity: 0.08, borderRadius: "50%" }} />

      <div className="fade-up" style={{ 
        width: "100%", maxWidth: 440, 
        background: "rgba(15, 30, 18, 0.6)", 
        backdropFilter: "blur(24px)",
        borderRadius: 32, padding: "48px 40px", 
        border: `1px solid rgba(139, 105, 20, 0.2)`, 
        textAlign: "center", 
        boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
        zIndex: 10
      }}>
        <div style={{ 
          width: 90, height: 90, borderRadius: 24, 
          background: `linear-gradient(135deg, ${G.gold}, ${G.goldBright})`, 
          margin: "0 auto 28px", display: "flex", alignItems: "center", justifyContent: "center", 
          boxShadow: `0 12px 32px ${G.gold}44`,
          overflow: "hidden"
        }}>
          <img src="/src/assets/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        <div className="h1" style={{ marginBottom: 12, fontSize: 38, background: `linear-gradient(90deg, #fff, ${G.goldBright})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>مرحباً بك</div>
        <div className="body" style={{ color: G.textMuted, marginBottom: 36, fontSize: 16 }}>نظام إدارة محتوى مكتبة السلطان</div>

        {err && (
          <div className="fade-up" style={{ 
            background: "rgba(255, 77, 109, 0.1)", color: G.red, 
            padding: "14px", borderRadius: 16, marginBottom: 24, 
            fontSize: 14, border: `1px solid rgba(255, 77, 109, 0.2)`,
            fontWeight: 700
          }}>
            ⚠️ {err}
          </div>
        )}

        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <label className="label" style={{ marginRight: 8, marginBottom: 8, display: "block" }}>اسم المستخدم</label>
          <input 
            placeholder="أدخل اسم المستخدم" 
            value={user} 
            onChange={e => setU(e.target.value)} 
            style={{ 
              width: "100%", background: "rgba(255,255,255,0.03)", 
              border: `1px solid ${G.border}`, borderRadius: 16, 
              padding: "16px 24px", outline: "none", fontSize: 16,
              color: "#fff", transition: "all 0.3s",
              textAlign: "right",
              boxSizing: "border-box"
            }} 
            onFocus={e => e.target.style.borderColor = G.gold}
            onBlur={e => e.target.style.borderColor = G.border}
          />
        </div>

        <div style={{ textAlign: "right", marginBottom: 36 }}>
          <label className="label" style={{ marginRight: 8, marginBottom: 8, display: "block" }}>كلمة المرور</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={pass} 
            onChange={e => setP(e.target.value)} 
            style={{ 
              width: "100%", background: "rgba(255,255,255,0.03)", 
              border: `1px solid ${G.border}`, borderRadius: 16, 
              padding: "16px 24px", outline: "none", fontSize: 16,
              color: "#fff", transition: "all 0.3s",
              textAlign: "right",
              boxSizing: "border-box"
            }} 
            onFocus={e => e.target.style.borderColor = G.gold}
            onBlur={e => e.target.style.borderColor = G.border}
            onKeyDown={e => e.key === "Enter" && handle()}
          />
        </div>

        <button 
          onClick={handle} 
          disabled={loading} 
          className="row-hover"
          style={{ 
            width: "100%", 
            background: `linear-gradient(90deg, ${G.gold}, ${G.goldBright})`, 
            color: "#000", border: "none", borderRadius: 18, 
            padding: "18px", fontSize: 18, fontWeight: 900, 
            cursor: "pointer", transition: "all 0.3s",
            boxShadow: `0 8px 24px ${G.gold}33`,
            fontFamily: "'ThmanyahDisplay', serif"
          }}
        >
          {loading ? "جاري التحقق..." : "دخول لوحة التحكم"}
        </button>

        <div style={{ marginTop: 32, borderTop: `1px solid ${G.border}`, paddingTop: 24 }}>
          <div className="caption" style={{ fontSize: 11, letterSpacing: 1 }}>
            © 2026 SOULTAN STATIONERY · مجمع السلطان
          </div>
        </div>
      </div>
    </div>
  );
}
