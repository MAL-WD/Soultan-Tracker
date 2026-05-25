import { useState, useEffect } from "react";
import { G, BRANCHES } from "../constants/designTokens";

export default function AdminPanel({ apiUrl, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "manager", branchId: "400" });
  const [editingId, setEditingId] = useState(null);
  const [editPassword, setEditPassword] = useState("");

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", "x-auth-token": token };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${apiUrl}/users`, { headers: { "x-auth-token": token } });
      const d = await r.json();
      if (d.success) setUsers(d.data);
      else setError(d.error || "فشل في تحميل المستخدمين");
    } catch { setError("تعذر الاتصال بالخادم"); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const showMsg = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const createUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim()) { setError("يرجى ملء جميع الحقول"); return; }
    if (newUser.password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setError("");
    try {
      const r = await fetch(`${apiUrl}/auth/register`, {
        method: "POST", headers,
        body: JSON.stringify(newUser)
      });
      const d = await r.json();
      if (d.success) {
        showMsg(`تم إنشاء المستخدم "${newUser.username}" بنجاح`);
        setNewUser({ username: "", password: "", role: "manager", branchId: "400" });
        setShowCreate(false);
        fetchUsers();
      } else { setError(d.error || "فشل في إنشاء المستخدم"); }
    } catch { setError("تعذر الاتصال بالخادم"); }
  };

  const toggleActive = async (user) => {
    setError("");
    try {
      const r = await fetch(`${apiUrl}/users/${user._id}`, {
        method: "PUT", headers,
        body: JSON.stringify({ ...user, isActive: !user.isActive })
      });
      const d = await r.json();
      if (d.success) { showMsg(`تم ${user.isActive ? "تعطيل" : "تفعيل"} حساب "${user.username}"`); fetchUsers(); }
      else setError(d.error);
    } catch { setError("تعذر الاتصال بالخادم"); }
  };

  const resetPassword = async (userId) => {
    if (!editPassword.trim() || editPassword.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setError("");
    try {
      const r = await fetch(`${apiUrl}/users/${userId}`, {
        method: "PUT", headers,
        body: JSON.stringify({ password: editPassword })
      });
      const d = await r.json();
      if (d.success) { showMsg("تم تغيير كلمة المرور بنجاح"); setEditingId(null); setEditPassword(""); }
      else setError(d.error);
    } catch { setError("تعذر الاتصال بالخادم"); }
  };

  const deleteUser = async (user) => {
    if (user._id === currentUser.id) { setError("لا يمكنك حذف حسابك الخاص"); return; }
    setError("");
    try {
      const r = await fetch(`${apiUrl}/users/${user._id}`, { method: "DELETE", headers });
      const d = await r.json();
      if (d.success) { showMsg(`تم حذف حساب "${user.username}"`); fetchUsers(); }
      else setError(d.error);
    } catch { setError("تعذر الاتصال بالخادم"); }
  };

  const getBranchName = (bid) => BRANCHES.find(b => b.id === bid)?.name || bid || "—";

  if (currentUser.role !== "admin") {
    return (
      <div className="fade-up" style={{ padding: "40px 18px", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🔒</div>
        <div className="h2" style={{ color: G.red, marginBottom: 8 }}>صلاحيات غير كافية</div>
        <div className="body-sm">هذا القسم متاح فقط لمديري النظام.</div>
      </div>
    );
  }

  return (
    <div className="fade-up" style={{ padding: "0 18px 30px" }}>
      {/* Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${G.goldDim}70, ${G.card})`, 
        border: `1.5px solid ${G.borderGold}55`,
        borderRadius: 20, padding: "20px 24px", marginBottom: 22,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: `0 12px 30px ${G.gold}10`,
        direction: "rtl"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ 
            width: 56, height: 56, borderRadius: 16, 
            background: `linear-gradient(135deg, ${G.gold}22, ${G.gold}44)`,
            border: `1.5px solid ${G.gold}50`,
            display: "flex", alignItems: "center", justifyContent: "center", 
            fontSize: 28,
            boxShadow: `0 8px 24px ${G.gold}33`,
          }}>🛡️</div>
          <div>
            <div className="label" style={{ color: G.gold, fontSize: 11, letterSpacing: 1.5, marginBottom: 4, fontWeight: "bold" }}>إدارة الحسابات والصلاحيات</div>
            <div className="h2" style={{ margin: 0, fontSize: 20, fontWeight: 900, color: G.text }}>لوحة تحكم المسؤولين</div>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            background: `linear-gradient(135deg, ${G.gold}, ${G.goldBright})`,
            color: "#000", border: "none", borderRadius: 14,
            padding: "12px 24px", fontSize: 14, fontWeight: 900,
            cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif",
            boxShadow: `0 6px 20px ${G.gold}44`,
            transition: "all 0.2s"
          }}
        >{showCreate ? "✕ إلغاء" : "+ إنشاء حساب"}</button>
      </div>

      {/* Messages */}
      {error && (
        <div className="fade-up" style={{ 
          background: `${G.red}15`, color: G.red, padding: "12px 16px", 
          borderRadius: 14, marginBottom: 14, fontSize: 13, fontWeight: 700,
          border: `1px solid ${G.red}33`, display: "flex", alignItems: "center", gap: 8
        }}>⚠️ {error}
          <button onClick={() => setError("")} style={{ marginRight: "auto", background: "none", border: "none", color: G.red, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
      )}
      {success && (
        <div className="fade-up" style={{ 
          background: `${G.accentLak}15`, color: G.accentLak, padding: "12px 16px", 
          borderRadius: 14, marginBottom: 14, fontSize: 13, fontWeight: 700,
          border: `1px solid ${G.accentLak}33`, display: "flex", alignItems: "center", gap: 8
        }}>✓ {success}</div>
      )}

      {/* Create Form */}
      {showCreate && (
        <div className="fade-up" style={{ 
          background: G.card, border: `1px solid ${G.borderGold}55`, 
          borderRadius: 20, padding: "24px", marginBottom: 22 
        }}>
          <div className="h3" style={{ color: G.gold, marginBottom: 18 }}>➕ إنشاء حساب جديد</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <div className="label" style={{ marginBottom: 6, fontWeight: "bold" }}>اسم المستخدم</div>
              <input
                value={newUser.username}
                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="أدخل اسم المستخدم..."
                style={{ 
                  width: "100%", background: G.panel, border: `1px solid ${G.border}`, 
                  borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none",
                  color: G.text, textAlign: "right", boxSizing: "border-box",
                  fontFamily: "'ThmanyahText', sans-serif"
                }}
              />
            </div>
            <div>
              <div className="label" style={{ marginBottom: 6, fontWeight: "bold" }}>كلمة المرور</div>
              <input
                type="password"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="6 أحرف على الأقل..."
                style={{ 
                  width: "100%", background: G.panel, border: `1px solid ${G.border}`, 
                  borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none",
                  color: G.text, textAlign: "right", boxSizing: "border-box",
                  fontFamily: "'ThmanyahText', sans-serif"
                }}
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div>
              <div className="label" style={{ marginBottom: 6, fontWeight: "bold" }}>الصلاحية</div>
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                style={{ 
                  width: "100%", background: G.panel, border: `1px solid ${G.border}`, 
                  borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none",
                  color: G.text, boxSizing: "border-box",
                  fontFamily: "'ThmanyahText', sans-serif", cursor: "pointer"
                }}
              >
                <option value="manager">مسؤول فرع</option>
                <option value="admin">مدير نظام</option>
              </select>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 6, fontWeight: "bold" }}>الفرع</div>
              <select
                value={newUser.branchId}
                onChange={e => setNewUser({ ...newUser, branchId: e.target.value })}
                style={{ 
                  width: "100%", background: G.panel, border: `1px solid ${G.border}`, 
                  borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none",
                  color: G.text, boxSizing: "border-box",
                  fontFamily: "'ThmanyahText', sans-serif", cursor: "pointer"
                }}
              >
                {BRANCHES.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={createUser}
            style={{
              width: "100%", background: `linear-gradient(90deg, ${G.gold}, ${G.goldBright})`,
              color: "#000", border: "none", borderRadius: 14,
              padding: "14px", fontSize: 16, fontWeight: 900,
              cursor: "pointer", fontFamily: "'ThmanyahDisplay', serif",
              boxShadow: `0 6px 20px ${G.gold}33`,
              transition: "all 0.2s"
            }}
          >إنشاء الحساب</button>
        </div>
      )}

      {/* Users List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, animation: "pulse 1.5s infinite" }}>🔄</div>
          <div className="body-sm" style={{ marginTop: 12 }}>جاري تحميل المستخدمين...</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "14px", textAlign: "center" }}>
              <div className="h2" style={{ color: G.gold, margin: 0 }}>{users.length}</div>
              <div className="caption" style={{ marginTop: 4 }}>إجمالي الحسابات</div>
            </div>
            <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "14px", textAlign: "center" }}>
              <div className="h2" style={{ color: G.accentLak, margin: 0 }}>{users.filter(u => u.isActive).length}</div>
              <div className="caption" style={{ marginTop: 4 }}>حسابات نشطة</div>
            </div>
            <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "14px", textAlign: "center" }}>
              <div className="h2" style={{ color: G.red, margin: 0 }}>{users.filter(u => !u.isActive).length}</div>
              <div className="caption" style={{ marginTop: 4 }}>حسابات معطلة</div>
            </div>
          </div>

          {/* User Cards */}
          {users.map(user => (
            <div key={user._id} style={{ 
              background: G.card, 
              border: `1px solid ${user.isActive ? G.border : G.red + "33"}`, 
              borderRadius: 18, padding: "18px 20px",
              opacity: user.isActive ? 1 : 0.7,
              transition: "all 0.2s"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ 
                    width: 44, height: 44, borderRadius: 12, 
                    background: user.role === "admin" ? `${G.gold}22` : `${G.accentLak}22`,
                    display: "flex", alignItems: "center", justifyContent: "center", 
                    fontSize: 20, flexShrink: 0,
                    border: `1px solid ${user.role === "admin" ? G.gold : G.accentLak}33`
                  }}>
                    {user.role === "admin" ? "👑" : "👤"}
                  </div>
                  <div>
                    <div className="body" style={{ fontWeight: 900, color: G.text, margin: 0 }}>{user.username}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <span className="caption" style={{ 
                        background: user.role === "admin" ? `${G.gold}22` : `${G.blue}22`,
                        color: user.role === "admin" ? G.gold : G.blue,
                        padding: "2px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700
                      }}>
                        {user.role === "admin" ? "مدير نظام" : "مسؤول فرع"}
                      </span>
                      <span className="caption" style={{ 
                        background: `${G.accentBid}22`, color: G.accentBid,
                        padding: "2px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700
                      }}>
                        {getBranchName(user.branchId)}
                      </span>
                      <span className="caption" style={{ 
                        background: user.isActive ? `${G.accentLak}22` : `${G.red}22`, 
                        color: user.isActive ? G.accentLak : G.red,
                        padding: "2px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700
                      }}>
                        {user.isActive ? "نشط" : "معطل"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="caption" style={{ textAlign: "left" }}>
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleDateString("ar-DZ", { day: "numeric", month: "short" }) 
                    : "لم يسجل دخول"
                  }
                </div>
              </div>

              {/* Password Reset Inline */}
              {editingId === user._id && (
                <div className="fade-up" style={{ display: "flex", gap: 8, marginBottom: 12, padding: "10px 14px", background: G.panel, borderRadius: 12 }}>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={e => setEditPassword(e.target.value)}
                    placeholder="كلمة المرور الجديدة (6 أحرف)..."
                    style={{ 
                      flex: 1, background: "transparent", border: `1px solid ${G.border}`, 
                      borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none",
                      color: G.text, textAlign: "right", fontFamily: "'ThmanyahText', sans-serif"
                    }}
                    onKeyDown={e => e.key === "Enter" && resetPassword(user._id)}
                  />
                  <button onClick={() => resetPassword(user._id)} style={{ 
                    background: G.gold, color: "#000", border: "none", borderRadius: 8, 
                    padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'ThmanyahText', sans-serif"
                  }}>حفظ</button>
                  <button onClick={() => { setEditingId(null); setEditPassword(""); }} style={{ 
                    background: "transparent", color: G.textMuted, border: `1px solid ${G.border}`, borderRadius: 8, 
                    padding: "8px 12px", fontSize: 12, cursor: "pointer",
                    fontFamily: "'ThmanyahText', sans-serif"
                  }}>إلغاء</button>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => toggleActive(user)}
                  style={{
                    background: user.isActive ? `${G.red}15` : `${G.accentLak}15`,
                    color: user.isActive ? G.red : G.accentLak,
                    border: `1px solid ${user.isActive ? G.red : G.accentLak}33`,
                    borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif", transition: "all 0.2s"
                  }}
                >{user.isActive ? "🚫 تعطيل" : "✓ تفعيل"}</button>
                <button
                  onClick={() => { setEditingId(editingId === user._id ? null : user._id); setEditPassword(""); }}
                  style={{
                    background: `${G.blue}15`, color: G.blue, 
                    border: `1px solid ${G.blue}33`,
                    borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif", transition: "all 0.2s"
                  }}
                >🔑 تغيير كلمة المرور</button>
                {user._id !== currentUser.id && (
                  <button
                    onClick={() => { if (confirm(`هل أنت متأكد من حذف حساب "${user.username}"؟`)) deleteUser(user); }}
                    style={{
                      background: `${G.red}15`, color: G.red,
                      border: `1px solid ${G.red}33`,
                      borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700,
                      cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif", transition: "all 0.2s"
                    }}
                  >🗑️ حذف</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
