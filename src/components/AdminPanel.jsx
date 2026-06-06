import { useState, useEffect } from "react";
import { G, BRANCHES, DAYS, DAY_CONTENT_TYPES as DEFAULT_DCT, SM_TASKS_BY_TYPE as DEFAULT_SMT } from "../constants/designTokens";

export default function AdminPanel({
  apiUrl,
  currentUser,
  dayContentTypes = DEFAULT_DCT,
  setDayContentTypes,
  smTasksByType = DEFAULT_SMT,
  setSmTasksByType,
  cloudStorage,
  contentTypeMetadata = {},
  setContentTypeMetadata,
}) {
  // ======== User Management State ========
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "manager", branchId: "400" });
  const [editingId, setEditingId] = useState(null);
  const [editPassword, setEditPassword] = useState("");

  // ======== Admin Sub-Tab State ========
  const [adminTab, setAdminTab] = useState("users"); // "users" | "content"

  // ======== Content Customizer State ========
  const [savingConstants, setSavingConstants] = useState(false);
  const [newContentTypeKey, setNewContentTypeKey] = useState("");
  const [newContentTypeLabel, setNewContentTypeLabel] = useState("");
  const [showAddContentType, setShowAddContentType] = useState(false);
  const [editingTaskType, setEditingTaskType] = useState(null);
  const [newTask, setNewTask] = useState({ id: "", label: "", icon: "📌", cat: "عام" });
  const [showAddTask, setShowAddTask] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", "x-auth-token": token };

  // ======== User Management Functions ========
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

  // ======== Content Customizer Functions ========

  const saveGlobalConstant = async (key, value) => {
    setSavingConstants(true);
    let success = false;
    try {
      const r = await fetch(`${apiUrl}/global-constants`, {
        method: "POST", headers,
        body: JSON.stringify({ key, value })
      });
      if (r.status === 404) {
        if (cloudStorage) {
          await cloudStorage.set(key, JSON.stringify(value));
          success = true;
        }
      } else {
        const d = await r.json();
        if (d.success) {
          success = true;
        } else {
          setError(d.error || "فشل في حفظ البيانات");
        }
      }
    } catch {
      if (cloudStorage) {
        try {
          await cloudStorage.set(key, JSON.stringify(value));
          success = true;
        } catch {
          setError("تعذر الاتصال بالخادم");
        }
      } else {
        setError("تعذر الاتصال بالخادم");
      }
    }
    if (success) {
      showMsg("تم حفظ التغييرات بنجاح ✓");
    }
    setSavingConstants(false);
  };

  // Day schedule helpers
  const addContentTypeToDay = (dayEn, contentType) => {
    const updated = { ...dayContentTypes, [dayEn]: [...(dayContentTypes[dayEn] || []), contentType] };
    setDayContentTypes(updated);
    saveGlobalConstant("DAY_CONTENT_TYPES", updated);
  };

  const removeContentTypeFromDay = (dayEn, index) => {
    const arr = [...(dayContentTypes[dayEn] || [])];
    arr.splice(index, 1);
    const updated = { ...dayContentTypes, [dayEn]: arr };
    setDayContentTypes(updated);
    saveGlobalConstant("DAY_CONTENT_TYPES", updated);
  };

  // Task type helpers
  const addNewContentType = () => {
    if (!newContentTypeKey.trim()) { setError("يرجى إدخال مفتاح نوع المحتوى (مثال: children_day)"); return; }
    const key = newContentTypeKey.trim().toLowerCase().replace(/\s+/g, "_");
    if (smTasksByType[key]) { setError("هذا النوع موجود بالفعل"); return; }
    const updated = { ...smTasksByType, [key]: [] };
    setSmTasksByType(updated);
    saveGlobalConstant("SM_TASKS_BY_TYPE", updated);
    
    // Save metadata
    const name = newContentTypeLabel.trim() || key;
    const updatedMeta = {
      ...contentTypeMetadata,
      [key]: { name, icon: "📋", color: G.blue }
    };
    if (setContentTypeMetadata) {
      setContentTypeMetadata(updatedMeta);
      saveGlobalConstant("CONTENT_TYPE_METADATA", updatedMeta);
    }

    setNewContentTypeKey("");
    setNewContentTypeLabel("");
    setShowAddContentType(false);
    showMsg(`تم إنشاء نوع المحتوى "${name}" بنجاح`);
  };

  const deleteContentType = (typeKey) => {
    const updated = { ...smTasksByType };
    delete updated[typeKey];
    setSmTasksByType(updated);
    saveGlobalConstant("SM_TASKS_BY_TYPE", updated);
    // Also remove from day schedule
    const updatedDays = { ...dayContentTypes };
    Object.keys(updatedDays).forEach(dayEn => {
      updatedDays[dayEn] = (updatedDays[dayEn] || []).filter(ct => ct !== typeKey);
    });
    setDayContentTypes(updatedDays);
    saveGlobalConstant("DAY_CONTENT_TYPES", updatedDays);
    if (editingTaskType === typeKey) setEditingTaskType(null);
    showMsg(`تم حذف نوع المحتوى "${typeKey}"`);
  };

  const addTaskToType = (typeKey) => {
    if (!newTask.id.trim() || !newTask.label.trim()) { setError("يرجى ملء معرف ونص المهمة"); return; }
    const tasks = smTasksByType[typeKey] || [];
    if (tasks.find(t => t.id === newTask.id.trim())) { setError("هذا المعرف موجود بالفعل"); return; }
    const updated = {
      ...smTasksByType,
      [typeKey]: [...tasks, { id: newTask.id.trim(), label: newTask.label.trim(), icon: newTask.icon || "📌", cat: newTask.cat || "عام" }]
    };
    setSmTasksByType(updated);
    saveGlobalConstant("SM_TASKS_BY_TYPE", updated);
    setNewTask({ id: "", label: "", icon: "📌", cat: "عام" });
    setShowAddTask(false);
  };

  const removeTaskFromType = (typeKey, taskId) => {
    const updated = {
      ...smTasksByType,
      [typeKey]: (smTasksByType[typeKey] || []).filter(t => t.id !== taskId)
    };
    setSmTasksByType(updated);
    saveGlobalConstant("SM_TASKS_BY_TYPE", updated);
  };

  // Content type display name helper
  const getContentTypeName = (key) => {
    return contentTypeMetadata[key]?.name || key;
  };

  const getContentTypeIcon = (key) => {
    return contentTypeMetadata[key]?.icon || "📋";
  };

  const getContentTypeColor = (key) => {
    return contentTypeMetadata[key]?.color || G.blue;
  };

  // Input style helper
  const inputStyle = {
    width: "100%", background: G.panel, border: `1px solid ${G.border}`,
    borderRadius: 12, padding: "12px 16px", fontSize: 14, outline: "none",
    color: G.text, textAlign: "right", boxSizing: "border-box",
    fontFamily: "'ThmanyahText', sans-serif"
  };

  const selectStyle = {
    ...inputStyle, cursor: "pointer"
  };

  const btnSmall = (color) => ({
    background: `${color}15`, color,
    border: `1px solid ${color}33`,
    borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700,
    cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif", transition: "all 0.2s"
  });

  // ======== RENDER ========

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
      {/* ═══════════════ ADMIN HEADER ═══════════════ */}
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
            <div className="label" style={{ color: G.gold, fontSize: 11, letterSpacing: 1.5, marginBottom: 4, fontWeight: "bold" }}>إدارة الحسابات والمحتوى</div>
            <div className="h2" style={{ margin: 0, fontSize: 20, fontWeight: 900, color: G.text }}>لوحة تحكم المسؤولين</div>
          </div>
        </div>
        {savingConstants && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `${G.gold}22`, padding: "8px 16px", borderRadius: 12,
            border: `1px solid ${G.gold}44`, fontSize: 12, color: G.gold, fontWeight: 700
          }}>
            <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
            جاري الحفظ...
          </div>
        )}
      </div>

      {/* ═══════════════ ADMIN SUB-TABS ═══════════════ */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 20, background: G.card,
        borderRadius: 14, padding: 4, border: `1px solid ${G.border}`
      }}>
        {[
          { id: "users", label: "👥 إدارة الحسابات", color: G.gold },
          { id: "content", label: "⚙️ إعدادات المحتوى والمهام", color: G.accentLak },
        ].map(tab => {
          const isA = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              style={{
                flex: 1, padding: "12px 8px", borderRadius: 10, border: "none",
                cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif",
                fontSize: 14, fontWeight: isA ? 900 : 500,
                background: isA ? `linear-gradient(135deg, ${tab.color}18, ${tab.color}08)` : "transparent",
                color: isA ? tab.color : G.textMuted,
                boxShadow: isA ? `0 2px 10px ${tab.color}30` : "none",
                transition: "all .25s ease"
              }}
            >{tab.label}</button>
          );
        })}
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

      {/* ═══════════════════════════════════════════════ */}
      {/*               USERS TAB                        */}
      {/* ═══════════════════════════════════════════════ */}
      {adminTab === "users" && (
        <>
          {/* Create User Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
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
                  <input value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} placeholder="أدخل اسم المستخدم..." style={inputStyle} />
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 6, fontWeight: "bold" }}>كلمة المرور</div>
                  <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="6 أحرف على الأقل..." style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div>
                  <div className="label" style={{ marginBottom: 6, fontWeight: "bold" }}>الصلاحية</div>
                  <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={selectStyle}>
                    <option value="manager">مسؤول فرع</option>
                    <option value="admin">مدير نظام</option>
                  </select>
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 6, fontWeight: "bold" }}>الفرع</div>
                  <select value={newUser.branchId} onChange={e => setNewUser({ ...newUser, branchId: e.target.value })} style={selectStyle}>
                    {BRANCHES.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
                  </select>
                </div>
              </div>
              <button onClick={createUser} style={{
                width: "100%", background: `linear-gradient(90deg, ${G.gold}, ${G.goldBright})`,
                color: "#000", border: "none", borderRadius: 14,
                padding: "14px", fontSize: 16, fontWeight: 900,
                cursor: "pointer", fontFamily: "'ThmanyahDisplay', serif",
                boxShadow: `0 6px 20px ${G.gold}33`, transition: "all 0.2s"
              }}>إنشاء الحساب</button>
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
                        type="password" value={editPassword}
                        onChange={e => setEditPassword(e.target.value)}
                        placeholder="كلمة المرور الجديدة (6 أحرف)..."
                        style={{ flex: 1, background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", color: G.text, textAlign: "right", fontFamily: "'ThmanyahText', sans-serif" }}
                        onKeyDown={e => e.key === "Enter" && resetPassword(user._id)}
                      />
                      <button onClick={() => resetPassword(user._id)} style={{ background: G.gold, color: "#000", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif" }}>حفظ</button>
                      <button onClick={() => { setEditingId(null); setEditPassword(""); }} style={{ background: "transparent", color: G.textMuted, border: `1px solid ${G.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif" }}>إلغاء</button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => toggleActive(user)} style={btnSmall(user.isActive ? G.red : G.accentLak)}>
                      {user.isActive ? "🚫 تعطيل" : "✓ تفعيل"}
                    </button>
                    <button onClick={() => { setEditingId(editingId === user._id ? null : user._id); setEditPassword(""); }} style={btnSmall(G.blue)}>
                      🔑 تغيير كلمة المرور
                    </button>
                    {user._id !== currentUser.id && (
                      <button onClick={() => { if (confirm(`هل أنت متأكد من حذف حساب "${user.username}"؟`)) deleteUser(user); }} style={btnSmall(G.red)}>
                        🗑️ حذف
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/*            CONTENT CUSTOMIZER TAB               */}
      {/* ═══════════════════════════════════════════════ */}
      {adminTab === "content" && (
        <div className="fade-up">

          {/* ──── SECTION 1: WEEKLY SCHEDULE ──── */}
          <div style={{
            background: G.card, border: `1px solid ${G.borderGold}44`,
            borderRadius: 20, padding: "22px 24px", marginBottom: 24,
            boxShadow: `0 8px 24px ${G.gold}08`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `linear-gradient(135deg, ${G.gold}22, ${G.gold}44)`,
                border: `1px solid ${G.gold}44`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                boxShadow: `0 4px 16px ${G.gold}22`
              }}>📅</div>
              <div>
                <div className="h3" style={{ margin: 0, color: G.gold }}>الجدول الأسبوعي للمحتوى</div>
                <div className="body-sm" style={{ marginTop: 2 }}>اختر أنواع المحتوى المقررة لكل يوم في الأسبوع</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DAYS.map(d => {
                const scheduled = dayContentTypes[d.en] || [];
                return (
                  <div key={d.en} style={{
                    background: G.panel, border: `1px solid ${G.border}`,
                    borderRadius: 14, padding: "14px 18px",
                    transition: "all .2s"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: scheduled.length > 0 ? 10 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: `${G.gold}18`, border: `1px solid ${G.gold}33`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 900, color: G.gold
                        }}>{d.short}</div>
                        <div>
                          <div className="body" style={{ fontWeight: 800, color: G.text, margin: 0 }}>{d.ar}</div>
                          <div className="caption" style={{ marginTop: 1 }}>{scheduled.length} نوع محتوى</div>
                        </div>
                      </div>

                      {/* Add content type dropdown */}
                      <select
                        value=""
                        onChange={e => { if (e.target.value) addContentTypeToDay(d.en, e.target.value); }}
                        style={{
                          background: `${G.accentLak}15`, border: `1px solid ${G.accentLak}33`,
                          borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 700,
                          color: G.accentLak, cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif",
                          outline: "none"
                        }}
                      >
                        <option value="">+ إضافة</option>
                        {Object.keys(smTasksByType).map(ct => (
                          <option key={ct} value={ct}>{getContentTypeName(ct)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Scheduled content types pills */}
                    {scheduled.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {scheduled.map((ct, ci) => {
                          const color = getContentTypeColor(ct);
                          return (
                            <div key={`${ct}-${ci}`} style={{
                              display: "flex", alignItems: "center", gap: 8,
                              background: `${color}15`, border: `1px solid ${color}44`,
                              borderRadius: 10, padding: "6px 10px 6px 14px",
                              transition: "all .2s"
                            }}>
                              <span style={{ fontSize: 16 }}>{getContentTypeIcon(ct)}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color }}>{getContentTypeName(ct)}</span>
                              <button
                                onClick={() => removeContentTypeFromDay(d.en, ci)}
                                style={{
                                  background: `${G.red}22`, border: `1px solid ${G.red}33`,
                                  borderRadius: 6, width: 22, height: 22,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  cursor: "pointer", fontSize: 11, color: G.red, fontWeight: 900,
                                  transition: "all .15s"
                                }}
                              >✕</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ──── SECTION 2: TASK CHECKLISTS MANAGER ──── */}
          <div style={{
            background: G.card, border: `1px solid ${G.border}`,
            borderRadius: 20, padding: "22px 24px",
            boxShadow: `0 8px 24px ${G.accentLak}06`
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `linear-gradient(135deg, ${G.accentLak}22, ${G.accentLak}44)`,
                  border: `1px solid ${G.accentLak}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                  boxShadow: `0 4px 16px ${G.accentLak}22`
                }}>📋</div>
                <div>
                  <div className="h3" style={{ margin: 0, color: G.accentLak }}>قوائم المهام حسب نوع المحتوى</div>
                  <div className="body-sm" style={{ marginTop: 2 }}>أنشئ أو عدّل قوائم المهام لكل نوع محتوى</div>
                </div>
              </div>
              <button
                onClick={() => setShowAddContentType(!showAddContentType)}
                style={{
                  background: `linear-gradient(135deg, ${G.accentLak}, ${G.accentLak}CC)`,
                  color: "#000", border: "none", borderRadius: 12,
                  padding: "10px 20px", fontSize: 13, fontWeight: 900,
                  cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif",
                  boxShadow: `0 4px 16px ${G.accentLak}44`,
                  transition: "all 0.2s"
                }}
              >{showAddContentType ? "✕ إلغاء" : "+ نوع محتوى جديد"}</button>
            </div>

            {/* Add New Content Type Form */}
            {showAddContentType && (
              <div className="fade-up" style={{
                background: G.panel, border: `1px solid ${G.accentLak}33`,
                borderRadius: 16, padding: "18px", marginBottom: 18
              }}>
                <div className="label" style={{ marginBottom: 12, color: G.accentLak, fontWeight: 900 }}>إنشاء نوع محتوى جديد</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <div className="caption" style={{ marginBottom: 4, fontWeight: 700 }}>المفتاح (بالإنجليزية)</div>
                    <input
                      value={newContentTypeKey}
                      onChange={e => setNewContentTypeKey(e.target.value)}
                      placeholder="مثال: children_day"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <div className="caption" style={{ marginBottom: 4, fontWeight: 700 }}>الاسم بالعربية (اختياري)</div>
                    <input
                      value={newContentTypeLabel}
                      onChange={e => setNewContentTypeLabel(e.target.value)}
                      placeholder="مثال: يوم الطفولة"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <button onClick={addNewContentType} style={{
                  width: "100%", background: `linear-gradient(90deg, ${G.accentLak}, ${G.accentLak}CC)`,
                  color: "#000", border: "none", borderRadius: 12,
                  padding: "12px", fontSize: 14, fontWeight: 900,
                  cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif",
                  boxShadow: `0 4px 16px ${G.accentLak}33`
                }}>إنشاء نوع المحتوى</button>
              </div>
            )}

            {/* Existing Content Types */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(smTasksByType).map(([typeKey, tasks]) => {
                const color = getContentTypeColor(typeKey);
                const isExpanded = editingTaskType === typeKey;
                return (
                  <div key={typeKey} style={{
                    background: G.panel, border: `1px solid ${isExpanded ? color + "55" : G.border}`,
                    borderRadius: 16, overflow: "hidden",
                    transition: "all .25s ease",
                    boxShadow: isExpanded ? `0 4px 20px ${color}15` : "none"
                  }}>
                    {/* Type Header */}
                    <div
                      onClick={() => setEditingTaskType(isExpanded ? null : typeKey)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 18px", cursor: "pointer",
                        background: isExpanded ? `${color}08` : "transparent",
                        transition: "all .2s"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 12,
                          background: `${color}22`, border: `1px solid ${color}33`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 20, flexShrink: 0
                        }}>{getContentTypeIcon(typeKey)}</div>
                        <div>
                          <div className="body" style={{ fontWeight: 900, color, margin: 0 }}>{getContentTypeName(typeKey)}</div>
                          <div className="caption" style={{ marginTop: 2 }}>{tasks.length} مهمة · مفتاح: {typeKey}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          background: `${color}22`, color, padding: "4px 12px",
                          borderRadius: 8, fontSize: 11, fontWeight: 700
                        }}>{tasks.length}</span>
                        <span style={{
                          fontSize: 16, color: G.textMuted,
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform .25s ease", display: "inline-block"
                        }}>▾</span>
                      </div>
                    </div>

                    {/* Expanded: Task List */}
                    {isExpanded && (
                      <div className="fade-up" style={{ padding: "0 18px 18px" }}>
                        {/* Tasks */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                          {tasks.map((task, ti) => (
                            <div key={task.id} style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: "10px 14px", borderRadius: 10,
                              background: G.card, border: `1px solid ${G.border}`,
                              transition: "all .15s"
                            }}>
                              <span style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: `${color}18`, border: `1px solid ${color}22`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 14, flexShrink: 0
                              }}>{task.icon}</span>
                              <div style={{ flex: 1 }}>
                                <div className="body" style={{ fontWeight: 700, fontSize: 13, margin: 0, color: G.text }}>{task.label}</div>
                                <div className="caption" style={{ marginTop: 1 }}>{task.cat} · {task.id}</div>
                              </div>
                              <button
                                onClick={() => removeTaskFromType(typeKey, task.id)}
                                style={{
                                  background: `${G.red}15`, border: `1px solid ${G.red}22`,
                                  borderRadius: 8, width: 28, height: 28,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  cursor: "pointer", fontSize: 12, color: G.red,
                                  transition: "all .15s", flexShrink: 0
                                }}
                              >🗑</button>
                            </div>
                          ))}
                          {tasks.length === 0 && (
                            <div className="body-sm" style={{ textAlign: "center", padding: "16px 0", opacity: 0.6 }}>
                              لا توجد مهام بعد. أضف مهمة جديدة!
                            </div>
                          )}
                        </div>

                        {/* Add Task Form */}
                        {showAddTask && editingTaskType === typeKey ? (
                          <div className="fade-up" style={{
                            background: G.card, border: `1px solid ${color}33`,
                            borderRadius: 14, padding: "16px", marginBottom: 10
                          }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                              <div>
                                <div className="caption" style={{ marginBottom: 4, fontWeight: 700 }}>معرف المهمة</div>
                                <input value={newTask.id} onChange={e => setNewTask({ ...newTask, id: e.target.value })} placeholder="مثال: prepare" style={inputStyle} />
                              </div>
                              <div>
                                <div className="caption" style={{ marginBottom: 4, fontWeight: 700 }}>نص المهمة</div>
                                <input value={newTask.label} onChange={e => setNewTask({ ...newTask, label: e.target.value })} placeholder="مثال: تجهيز المنشور" style={inputStyle} />
                              </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                              <div>
                                <div className="caption" style={{ marginBottom: 4, fontWeight: 700 }}>الأيقونة</div>
                                <input value={newTask.icon} onChange={e => setNewTask({ ...newTask, icon: e.target.value })} placeholder="🔍" style={inputStyle} />
                              </div>
                              <div>
                                <div className="caption" style={{ marginBottom: 4, fontWeight: 700 }}>الفئة</div>
                                <select value={newTask.cat} onChange={e => setNewTask({ ...newTask, cat: e.target.value })} style={selectStyle}>
                                  <option value="تحضير">تحضير</option>
                                  <option value="إنتاج">إنتاج</option>
                                  <option value="مراجعة">مراجعة</option>
                                  <option value="نشر">نشر</option>
                                  <option value="تفاعل">تفاعل</option>
                                  <option value="عام">عام</option>
                                </select>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => addTaskToType(typeKey)} style={{
                                flex: 1, background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                                color: "#000", border: "none", borderRadius: 10,
                                padding: "10px", fontSize: 13, fontWeight: 900,
                                cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif"
                              }}>إضافة المهمة</button>
                              <button onClick={() => { setShowAddTask(false); setNewTask({ id: "", label: "", icon: "📌", cat: "عام" }); }} style={{
                                background: "transparent", border: `1px solid ${G.border}`,
                                borderRadius: 10, padding: "10px 16px", fontSize: 13,
                                color: G.textMuted, cursor: "pointer", fontFamily: "'ThmanyahText', sans-serif"
                              }}>إلغاء</button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setShowAddTask(true); setNewTask({ id: "", label: "", icon: "📌", cat: "عام" }); }}
                            style={{
                              width: "100%", background: `${color}12`,
                              border: `1.5px dashed ${color}44`, borderRadius: 12,
                              padding: "12px", fontSize: 13, fontWeight: 700,
                              color, cursor: "pointer",
                              fontFamily: "'ThmanyahText', sans-serif",
                              transition: "all .2s"
                            }}
                          >+ إضافة مهمة جديدة</button>
                        )}

                        {/* Delete this content type */}
                        {!["carousel", "video", "photo"].includes(typeKey) && (
                          <button
                            onClick={() => { if (confirm(`هل أنت متأكد من حذف نوع المحتوى "${getContentTypeName(typeKey)}"؟`)) deleteContentType(typeKey); }}
                            style={{
                              width: "100%", marginTop: 10,
                              background: `${G.red}10`, border: `1px solid ${G.red}22`,
                              borderRadius: 12, padding: "10px", fontSize: 12,
                              fontWeight: 700, color: G.red, cursor: "pointer",
                              fontFamily: "'ThmanyahText', sans-serif",
                              transition: "all .2s"
                            }}
                          >🗑️ حذف نوع المحتوى "{getContentTypeName(typeKey)}"</button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
