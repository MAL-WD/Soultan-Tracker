import { useState, useEffect } from "react";

const G = {
  bg:"#060D08",panel:"#0B160D",card:"#0F1E12",cardHover:"#142018",
  border:"#1C3020",borderGold:"#8B6914",gold:"#D4A017",goldBright:"#F5C84A",
  goldDim:"#2A1F00",silver:"#B8C0BC",silverDim:"#3A4A3E",green:"#0D4A1A",
  text:"#E8F0E9",textMuted:"#5A7A5E",textDim:"#2A3A2C",
  accent400:"#F5C84A",accentLak:"#4AE0B0",accentBid:"#C084FC",
};

const BRANCHES=[
  {id:"400",name:"400",color:G.accent400,glow:"#D4A01740",dim:"#2A1F00",icon:"♛"},
  {id:"laknab",name:"لاكناب",color:G.accentLak,glow:"#4AE0B040",dim:"#002A20",icon:"◈"},
  {id:"bidando",name:"بيداندو",color:G.accentBid,glow:"#C084FC40",dim:"#1A0030",icon:"❋"},
];

const DAYS=[
  {ar:"السبت",en:"SAT",short:"سبت"},
  {ar:"الأحد",en:"SUN",short:"أحد"},
  {ar:"الاثنين",en:"MON",short:"اثنين"},
  {ar:"الثلاثاء",en:"TUE",short:"ثلاثاء"},
  {ar:"الأربعاء",en:"WED",short:"أربعاء"},
  {ar:"الخميس",en:"THU",short:"خميس"},
  {ar:"الجمعة",en:"FRI",short:"جمعة"},
];

const SM_TASKS_BY_TYPE = {
  carousel:[
    {id:"research",label:"بحث الموضوع والمعلومات",icon:"🔍",cat:"تحضير"},
    {id:"script",label:"كتابة السكريبت / النص",icon:"✍️",cat:"تحضير"},
    {id:"design",label:"تصميم الشرائح",icon:"🎨",cat:"إنتاج"},
    {id:"caption",label:"كتابة الكابشن",icon:"📝",cat:"إنتاج"},
    {id:"hashtags",label:"بحث الهاشتاقات",icon:"#️⃣",cat:"إنتاج"},
    {id:"review",label:"مراجعة المحتوى",icon:"✅",cat:"مراجعة"},
    {id:"publish",label:"النشر",icon:"📤",cat:"نشر"},
    {id:"engage",label:"الرد على التعليقات",icon:"💬",cat:"تفاعل"},
  ],
  video:[
    {id:"concept",label:"تحضير فكرة الفيديو",icon:"💡",cat:"تحضير"},
    {id:"script",label:"كتابة السكريبت",icon:"✍️",cat:"تحضير"},
    {id:"filming",label:"التصوير",icon:"🎬",cat:"إنتاج"},
    {id:"edit",label:"المونتاج والتعديل",icon:"✂️",cat:"إنتاج"},
    {id:"caption",label:"كتابة الكابشن",icon:"📝",cat:"إنتاج"},
    {id:"review",label:"المراجعة",icon:"✅",cat:"مراجعة"},
    {id:"publish",label:"النشر",icon:"📤",cat:"نشر"},
    {id:"engage",label:"الرد على التعليقات",icon:"💬",cat:"تفاعل"},
  ],
  photo:[
    {id:"concept",label:"اختيار الصورة",icon:"🎯",cat:"تحضير"},
    {id:"design",label:"التصميم والتعديل",icon:"🎨",cat:"إنتاج"},
    {id:"caption",label:"كتابة الكابشن",icon:"✍️",cat:"إنتاج"},
    {id:"hashtags",label:"بحث الهاشتاقات",icon:"#️⃣",cat:"إنتاج"},
    {id:"review",label:"المراجعة",icon:"✅",cat:"مراجعة"},
    {id:"publish",label:"النشر",icon:"📤",cat:"نشر"},
  ],
};

const DAY_CONTENT_TYPES = {
  SAT:["carousel"],SUN:["video"],MON:["photo","carousel"],
  TUE:["video"],WED:["carousel"],THU:["video"],FRI:["video","video"],
};

const VISUAL_CHECKS=[
  {id:"logo",label:"اللوغو صحيح",icon:"♛"},
  {id:"colors",label:"الألوان الرسمية",icon:"◉"},
  {id:"font",label:"الخط الرسمي",icon:"Aa"},
  {id:"watermark",label:"الووترمارك",icon:"◈"},
  {id:"template",label:"القالب الرسمي",icon:"▣"},
  {id:"tone",label:"أسلوب الكتابة",icon:"✦"},
];

const STORIES_COUNT = 6;

function Ring({pct,color,size=44,stroke=3}){
  const r=(size-stroke*2)/2,circ=2*Math.PI*r,dash=(pct/100)*circ;
  return(
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={G.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{transition:"stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)"}}/>
    </svg>
  );
}

function Check({done,color,onToggle,size="normal"}){
  const s=size==="small"?17:21;
  return(
    <div onClick={e=>{e.stopPropagation();onToggle();}} style={{width:s,height:s,borderRadius:5,border:`1.5px solid ${done?color:G.silverDim}`,background:done?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all 0.2s cubic-bezier(.34,1.56,.64,1)",transform:done?"scale(1.1)":"scale(1)",boxShadow:done?`0 0 8px ${color}60`:"none"}}>
      {done&&<svg width={s-6} height={s-6} viewBox="0 0 12 12"><path d="M2 6L5 9.5L10 2.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
    </div>
  );
}

const getWk=()=>{const d=new Date(),j=new Date(d.getFullYear(),0,1);return `sk4-${d.getFullYear()}-${Math.ceil(((d-j)/86400000+j.getDay()+1)/7)}`;};
const getTodayEn=()=>{const m=["SUN","MON","TUE","WED","THU","FRI","SAT"];return m[new Date().getDay()];};

const buildDefault=()=>{
  const s={};
  BRANCHES.forEach(b=>{
    s[b.id]={};
    DAYS.forEach(d=>{
      const types=DAY_CONTENT_TYPES[d.en]||[];
      const tasks={};
      types.forEach(type=>{
        (SM_TASKS_BY_TYPE[type]||[]).forEach(t=>{tasks[`${type}_${t.id}`]=false;});
      });
      s[b.id][d.en]={tasks,stories:Array(STORIES_COUNT).fill(false),visual:{},note:"",published:false};
    });
  });
  return s;
};

export default function SoultanProV4(){
  const [data,setData]=useState(buildDefault);
  const [branch,setBranch]=useState("400");
  const [day,setDay]=useState(getTodayEn());
  const [panel,setPanel]=useState("tasks");
  const [loaded,setLoaded]=useState(false);
  const [saving,setSaving]=useState(false);
  const [branchNames,setBranchNames]=useState({400:"400",laknab:"لاكناب",bidando:"بيداندو"});
  const [editMode,setEditMode]=useState(false);
  const [animate,setAnimate]=useState(false);
  const [catFilter,setCatFilter]=useState("all");
  const wk=getWk();

  useEffect(()=>{
    (async()=>{
      try{
        const r=await window.storage.get(wk);if(r?.value)setData(JSON.parse(r.value));
        const bn=await window.storage.get("bn4");if(bn?.value)setBranchNames(JSON.parse(bn.value));
      }catch{}
      setLoaded(true);setTimeout(()=>setAnimate(true),80);
    })();
  },[]);

  const sv=async(d,bn)=>{setSaving(true);try{if(d!==undefined)await window.storage.set(wk,JSON.stringify(d));if(bn!==undefined)await window.storage.set("bn4",JSON.stringify(bn));}catch{}setTimeout(()=>setSaving(false),300);};

  const toggleTask=(key)=>{const dd=data[branch][day];const u={...data,[branch]:{...data[branch],[day]:{...dd,tasks:{...dd.tasks,[key]:!dd.tasks[key]}}}};setData(u);sv(u);};
  const toggleStory=(i)=>{const s=[...(data[branch][day].stories||[])];s[i]=!s[i];const u={...data,[branch]:{...data[branch],[day]:{...data[branch][day],stories:s}}};setData(u);sv(u);};
  const toggleVisual=(vid)=>{const dd=data[branch][day];const u={...data,[branch]:{...data[branch],[day]:{...dd,visual:{...dd.visual,[vid]:!dd.visual[vid]}}}};setData(u);sv(u);};
  const togglePublished=()=>{const dd=data[branch][day];const u={...data,[branch]:{...data[branch],[day]:{...dd,published:!dd.published}}};setData(u);sv(u);};
  const setNote=(v)=>{const u={...data,[branch]:{...data[branch],[day]:{...data[branch][day],note:v}}};setData(u);sv(u);};

  const getDayPct=(bid,den)=>{
    const dd=data[bid]?.[den]||{tasks:{},stories:[]};
    const types=DAY_CONTENT_TYPES[den]||[];
    const all=types.flatMap(t=>(SM_TASKS_BY_TYPE[t]||[]).map(x=>({key:`${t}_${x.id}`})));
    const done=all.filter(t=>dd.tasks?.[t.key]).length+(dd.stories||[]).filter(Boolean).length;
    const total=all.length+STORIES_COUNT;
    return total>0?Math.round((done/total)*100):0;
  };
  const getWeekPct=(bid)=>Math.round(DAYS.map(d=>getDayPct(bid,d.en)).reduce((a,b)=>a+b,0)/DAYS.length);

  const activeBranch=BRANCHES.find(b=>b.id===branch);
  const curData=data[branch]?.[day]||{tasks:{},stories:[],visual:{},note:"",published:false};
  const types=DAY_CONTENT_TYPES[day]||[];
  const allTasks=types.flatMap(type=>(SM_TASKS_BY_TYPE[type]||[]).map(t=>({...t,key:`${type}_${t.id}`,type})));
  const cats=[...new Set(allTasks.map(t=>t.cat))];
  const filteredTasks=catFilter==="all"?allTasks:allTasks.filter(t=>t.cat===catFilter);
  const dayDone=allTasks.filter(t=>curData.tasks?.[t.key]).length;
  const dayTotal=allTasks.length+STORIES_COUNT;
  const dayPct=dayTotal>0?Math.round(((dayDone+(curData.stories||[]).filter(Boolean).length)/dayTotal)*100):0;

  if(!loaded)return(<div style={{background:G.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}><div style={{fontSize:40,animation:"spin 2s linear infinite"}}>♛</div><div style={{color:G.gold,fontSize:11,letterSpacing:4,fontWeight:700}}>SOULTAN</div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>);

  return(
    <div style={{background:G.bg,minHeight:"100vh",color:G.text,direction:"rtl",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;900&family=Playfair+Display:wght@700;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          background: ${G.bg};
        }

        /* Typography Classes */
        .h1 {
          font-family: 'Playfair Display', 'Cairo', serif;
          font-size: 28px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.5px;
          color: ${G.text};
        }

        .h2 {
          font-family: 'Playfair Display', 'Cairo', serif;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.3px;
          color: ${G.text};
        }

        .h3 {
          font-family: 'Playfair Display', 'Cairo', serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.4;
          letter-spacing: 0px;
          color: ${G.text};
        }

        .h4 {
          font-family: 'Cairo', sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.4;
          color: ${G.text};
        }

        .body-lg {
          font-family: 'Cairo', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
          color: ${G.text};
        }

        .body {
          font-family: 'Cairo', sans-serif;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.5;
          color: ${G.text};
        }

        .body-sm {
          font-family: 'Cairo', sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.5;
          color: ${G.textMuted};
        }

        .label {
          font-family: 'Cairo', sans-serif;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: ${G.textMuted};
        }

        .caption {
          font-family: 'Cairo', sans-serif;
          font-size: 11px;
          font-weight: 400;
          line-height: 1.4;
          color: ${G.textMuted};
        }

        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        ::-webkit-scrollbar-track {
          background: ${G.bg};
        }

        ::-webkit-scrollbar-thumb {
          background: ${G.borderGold};
          border-radius: 2px;
        }

        .row-hover {
          transition: all 0.18s ease;
          cursor: pointer;
        }

        .row-hover:hover {
          background: ${G.cardHover} !important;
          transform: translateX(-2px);
        }

        .chip {
          transition: all 0.15s;
        }

        .chip:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .day-chip {
          transition: all 0.2s;
          cursor: pointer;
        }

        .day-chip:hover {
          transform: translateY(-1px);
        }

        .branch-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .branch-btn:hover {
          transform: translateY(-2px);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }

        .fade-up {
          animation: fadeUp 0.35s ease forwards;
        }

        .saving {
          animation: pulse 0.8s ease infinite;
        }

        input, textarea {
          font-family: 'Cairo', sans-serif;
          color: ${G.text};
        }

        input::placeholder, textarea::placeholder {
          color: ${G.textMuted};
        }
      `}</style>

      {/* HEADER */}
      <div style={{background:`linear-gradient(180deg,#0C1A0E,${G.bg})`,borderBottom:`1px solid ${G.borderGold}44`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:99,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{position:"relative"}}>
            <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${G.gold},${G.silver})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:`0 0 20px ${G.gold}50`}}>♛</div>
            {saving&&<div className="saving" style={{position:"absolute",top:-2,left:-2,width:8,height:8,borderRadius:"50%",background:G.gold}}/>}
          </div>
          <div>
            <div className="h2" style={{background:`linear-gradient(90deg,${G.goldBright},${G.silver})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:0}}>مكتبة السلطان</div>
            <div className="label" style={{marginTop:2}}>SOULTAN STATIONERY</div>
          </div>
        </div>
        <button onClick={()=>setEditMode(!editMode)} style={{padding:"6px 12px",borderRadius:7,border:`1px solid ${editMode?G.gold:G.borderGold}44`,background:editMode?`${G.gold}22`:"transparent",color:editMode?G.gold:G.textMuted,fontSize:12,cursor:"pointer",fontFamily:"'Cairo',sans-serif",fontWeight:600,transition:"all .2s"}}>
          {editMode?"✓ حفظ":"✎ تعديل"}
        </button>
      </div>

      {/* BRANCHES */}
      <div style={{padding:"14px 14px 0",display:"flex",gap:9}}>
        {BRANCHES.map((b,bi)=>{
          const isA=b.id===branch,wp=getWeekPct(b.id);
          return(
            <button key={b.id} className="branch-btn" onClick={()=>setBranch(b.id)} style={{flex:1,padding:"12px 8px",borderRadius:13,border:`1px solid ${isA?b.color:G.border}`,background:isA?`linear-gradient(135deg,${b.dim},${G.card})`:G.card,cursor:"pointer",boxShadow:isA?`0 0 20px ${b.glow}`:"none",opacity:animate?1:0,transform:animate?"translateY(0)":"translateY(8px)",transition:`all .4s ease ${bi*.08}s`}}>
              <div style={{fontSize:20,marginBottom:4,color:isA?b.color:G.textMuted}}>{b.icon}</div>
              {editMode?(
                <input value={branchNames[b.id]} onChange={e=>{const u={...branchNames,[b.id]:e.target.value};setBranchNames(u);sv(undefined,u);}} onClick={e=>e.stopPropagation()} style={{width:"100%",background:"transparent",border:`1px solid ${b.color}44`,borderRadius:5,color:b.color,fontSize:13,fontWeight:700,textAlign:"center",outline:"none",padding:"2px 4px",fontFamily:"'Cairo',sans-serif"}}/>
              ):(
                <div className="h4" style={{color:isA?b.color:G.silver,margin:0,fontSize:13}}>{branchNames[b.id]}</div>
              )}
              <div style={{height:3,background:G.textDim,borderRadius:2,margin:"6px 0 3px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${wp}%`,background:`linear-gradient(90deg,${b.color}88,${b.color})`,borderRadius:2,transition:"width .8s ease"}}/>
              </div>
              <div className="caption" style={{margin:0,color:isA?b.color:G.textMuted}}>{wp}%</div>
            </button>
          );
        })}
      </div>

      {/* DAYS */}
      <div style={{padding:"12px 14px",display:"flex",gap:6,overflowX:"auto"}}>
        {DAYS.map((d,i)=>{
          const isA=d.en===day,isToday=d.en===getTodayEn(),pct=getDayPct(branch,d.en),pub=data[branch]?.[d.en]?.published;
          return(
            <div key={d.en} className="day-chip" onClick={()=>setDay(d.en)} style={{flexShrink:0,padding:"8px 11px",borderRadius:10,textAlign:"center",background:isA?`linear-gradient(135deg,${activeBranch.dim},${G.card})`:G.card,border:`1px solid ${isA?activeBranch.color:isToday?G.borderGold:G.border}`,boxShadow:isA?`0 0 14px ${activeBranch.glow}`:"none",minWidth:60}}>
              {isToday&&<div className="label" style={{margin:"0 0 3px"}}>اليوم</div>}
              <div className="h4" style={{color:isA?activeBranch.color:G.silver,margin:0,fontSize:12}}>{d.short}</div>
              <div style={{margin:"5px auto",width:28,height:28,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Ring pct={pct} color={isA?activeBranch.color:G.textMuted} size={28} stroke={2.5}/>
                <div className="caption" style={{position:"absolute",margin:0,color:isA?activeBranch.color:G.textMuted}}>{pct}</div>
              </div>
              {pub&&<div className="caption" style={{color:G.accentLak,margin:0}}>✓</div>}
            </div>
          );
        })}
      </div>

      {/* PANEL TABS */}
      <div style={{display:"flex",margin:"10px 14px 12px",background:G.card,borderRadius:11,padding:4,border:`1px solid ${G.border}`,gap:3}}>
        {[{id:"tasks",label:"📋 المهام"},{id:"visual",label:"🎨 الهوية"}].map(p=>{
          const isA=panel===p.id;
          return(
            <button key={p.id} onClick={()=>setPanel(p.id)} style={{flex:1,padding:"8px 6px",borderRadius:8,border:"none",background:isA?`linear-gradient(135deg,${activeBranch.dim},${activeBranch.color}18)`:G.card,color:isA?activeBranch.color:G.textMuted,fontSize:12,fontWeight:isA?700:400,cursor:"pointer",fontFamily:"'Cairo',sans-serif",boxShadow:isA?`0 0 8px ${activeBranch.glow}`:"none",transition:"all .2s"}}>
              {p.label}
            </button>
          );
        })}
      </div>

      {/* TASKS PANEL */}
      {panel==="tasks"&&(
        <div className="fade-up" style={{padding:"0 14px 24px"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div className="h2" style={{color:activeBranch.color,margin:0}}>{DAYS.find(d=>d.en===day)?.ar} — {branchNames[branch]}</div>
              <div className="body-sm" style={{margin:"4px 0 0"}}>{dayDone} من {allTasks.length} مهمة · {(curData.stories||[]).filter(Boolean).length} من {STORIES_COUNT} ستوري</div>
            </div>
            <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ring pct={dayPct} color={activeBranch.color} size={52} stroke={4}/>
              <div className="h3" style={{position:"absolute",margin:0,color:activeBranch.color}}>{dayPct}%</div>
            </div>
          </div>

          {/* Content types */}
          <div style={{display:"flex",gap:7,marginBottom:11,flexWrap:"wrap"}}>
            {types.map(t=>(<span key={t} className="caption" style={{padding:"4px 11px",borderRadius:10,background:`${activeBranch.color}22`,border:`1px solid ${activeBranch.color}44`,color:activeBranch.color}}>{t==="carousel"?"🎠 كراوسل":t==="video"?"🎬 فيديو":"🖼️ صورة"}</span>))}
          </div>

          {/* Category filter */}
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            <button className="chip" onClick={()=>setCatFilter("all")} style={{padding:"4px 11px",borderRadius:8,border:`1px solid ${catFilter==="all"?activeBranch.color:G.border}`,background:catFilter==="all"?`${activeBranch.color}22`:"transparent",color:catFilter==="all"?activeBranch.color:G.textMuted,fontSize:11,cursor:"pointer",fontFamily:"'Cairo',sans-serif"}}>الكل</button>
            {cats.map(c=>(<button key={c} className="chip" onClick={()=>setCatFilter(c)} style={{padding:"4px 11px",borderRadius:8,border:`1px solid ${catFilter===c?activeBranch.color:G.border}`,background:catFilter===c?`${activeBranch.color}22`:"transparent",color:catFilter===c?activeBranch.color:G.textMuted,fontSize:11,cursor:"pointer",fontFamily:"'Cairo',sans-serif"}}>{c}</button>))}
          </div>

          {/* Tasks list */}
          {filteredTasks.map((task,ti)=>{
            const done=curData.tasks?.[task.key];
            return(
              <div key={task.key} className="row-hover" onClick={()=>toggleTask(task.key)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",marginBottom:6,borderRadius:11,background:done?`${activeBranch.color}10`:G.card,border:`1px solid ${done?activeBranch.color+"60":G.border}`,opacity:animate?1:0,transition:`all .3s ease ${Math.min(ti*.04,.3)}s`}}>
                <Check done={done} color={activeBranch.color} onToggle={()=>toggleTask(task.key)}/>
                <span style={{fontSize:15}}>{task.icon}</span>
                <div style={{flex:1}}>
                  <div className="body" style={{color:done?activeBranch.color:G.text,textDecoration:done?"line-through":"none",margin:0,fontWeight:done?400:500}}>{task.label}</div>
                  <div className="caption" style={{margin:"2px 0 0"}}>{task.cat} · {task.type==="carousel"?"كراوسل":task.type==="video"?"فيديو":"صورة"}</div>
                </div>
              </div>
            );
          })}

          {/* Stories */}
          {day!=="FRI"&&(
            <div style={{marginTop:16,marginBottom:14}}>
              <div className="label" style={{margin:"0 0 10px"}}>الستوريز اليومية · {(curData.stories||[]).filter(Boolean).length}/{STORIES_COUNT}</div>
              <div style={{display:"flex",gap:8}}>
                {Array.from({length:STORIES_COUNT}).map((_,i)=>{
                  const done=curData.stories?.[i];
                  return(
                    <div key={i} onClick={()=>toggleStory(i)} style={{flex:1,maxWidth:44,aspectRatio:"9/16",borderRadius:9,background:done?`linear-gradient(180deg,${activeBranch.color},${activeBranch.color}77)`:G.card,border:`1.5px solid ${done?activeBranch.color:G.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",paddingBottom:5,cursor:"pointer",boxShadow:done?`0 0 10px ${activeBranch.glow}`:"none",transition:"all .25s cubic-bezier(.34,1.56,.64,1)"}}>
                      <span className="caption" style={{color:done?"#000":G.textMuted,fontWeight:700}}>{i+1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Published */}
          <div onClick={togglePublished} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",borderRadius:11,marginBottom:12,cursor:"pointer",background:curData.published?`${G.accentLak}15`:G.card,border:`1px solid ${curData.published?G.accentLak:G.border}`,transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <span style={{fontSize:16}}>{curData.published?"✅":"📤"}</span>
              <div className="body" style={{color:curData.published?G.accentLak:G.text,margin:0,fontWeight:600}}>{curData.published?"تم النشر":"لم يُنشر بعد"}</div>
            </div>
            <div style={{width:38,height:20,borderRadius:10,background:curData.published?G.accentLak:G.border,position:"relative",transition:"all .3s"}}>
              <div style={{position:"absolute",top:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"all .3s cubic-bezier(.34,1.56,.64,1)",left:curData.published?20:2}}/>
            </div>
          </div>

          {/* Note */}
          <div>
            <div className="label" style={{margin:"0 0 7px"}}>ملاحظة الفريق</div>
            <textarea value={curData.note||""} onChange={e=>setNote(e.target.value)} placeholder="تعليمات، أفكار، ملاحظات للفريق..." style={{width:"100%",background:G.card,border:`1px solid ${G.border}`,borderRadius:10,padding:"10px 12px",fontSize:13,resize:"vertical",minHeight:68,outline:"none",transition:"border-color .2s",fontFamily:"'Cairo',sans-serif"}} onFocus={e=>e.target.style.borderColor=activeBranch.color+"77"} onBlur={e=>e.target.style.borderColor=G.border}/>
          </div>
        </div>
      )}

      {/* VISUAL PANEL */}
      {panel==="visual"&&(
        <div className="fade-up" style={{padding:"0 14px 24px"}}>
          <div style={{background:`${G.goldDim}50`,border:`1px solid ${G.borderGold}`,borderRadius:11,padding:"11px 13px",marginBottom:14,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:17,flexShrink:0}}>⚠️</span>
            <div><div className="body" style={{color:G.gold,margin:0,fontWeight:600}}>تحقق من الهوية قبل النشر</div><div className="caption" style={{margin:"3px 0 0"}}>فرع {branchNames[branch]} · {DAYS.find(d=>d.en===day)?.ar}</div></div>
          </div>

          {/* Colors */}
          <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:11,padding:"12px",marginBottom:14}}>
            <div className="label" style={{margin:"0 0 9px"}}>الألوان الرسمية</div>
            <div style={{display:"flex",gap:8}}>
              {[{c:"#0D3320",n:"أخضر"},{c:G.gold,n:"ذهبي"},{c:G.silver,n:"فضي"},{c:"#F5F5F0",n:"أبيض"}].map(col=>(
                <div key={col.c} style={{flex:1,textAlign:"center"}}>
                  <div style={{height:30,borderRadius:7,background:col.c,border:"1px solid #ffffff18",marginBottom:4,boxShadow:`0 2px 8px ${col.c}50`}}/>
                  <div className="caption" style={{margin:0}}>{col.n}</div>
                </div>
              ))}
            </div>
          </div>

          {VISUAL_CHECKS.map((item,vi)=>{
            const done=curData.visual?.[item.id];
            return(
              <div key={item.id} className="row-hover" onClick={()=>toggleVisual(item.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",marginBottom:7,borderRadius:11,background:done?`${G.gold}10`:G.card,border:`1px solid ${done?G.gold+"70":G.border}`,opacity:animate?1:0,transition:`all .3s ease ${vi*.06}s`}}>
                <Check done={done} color={G.gold} onToggle={()=>toggleVisual(item.id)}/>
                <div style={{width:26,height:26,borderRadius:6,background:done?`${G.gold}22`:G.textDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:done?G.gold:G.textMuted,fontWeight:700,flexShrink:0}}>{item.icon}</div>
                <div className="body" style={{flex:1,color:done?G.gold:G.text,textDecoration:done?"line-through":"none",opacity:done?.7:1,margin:0,fontWeight:600}}>{item.label}</div>
                {done&&<span className="caption" style={{color:G.accentLak,margin:0}}>✓</span>}
              </div>
            );
          })}

          <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:11,padding:"13px",marginTop:14,display:"flex",alignItems:"center",gap:13}}>
            <Ring pct={Math.round((VISUAL_CHECKS.filter(v=>curData.visual?.[v.id]).length/VISUAL_CHECKS.length)*100)} color={G.gold} size={50} stroke={4}/>
            <div>
              <div className="h3" style={{color:G.gold,margin:0}}>{Math.round((VISUAL_CHECKS.filter(v=>curData.visual?.[v.id]).length/VISUAL_CHECKS.length)*100)}% مكتمل</div>
              <div className="caption" style={{margin:"2px 0"}}>{VISUAL_CHECKS.filter(v=>curData.visual?.[v.id]).length} من {VISUAL_CHECKS.length}</div>
              {VISUAL_CHECKS.filter(v=>curData.visual?.[v.id]).length===VISUAL_CHECKS.length&&<div className="caption" style={{color:G.accentLak,margin:"3px 0 0"}}>✓ جاهز للنشر</div>}
            </div>
          </div>
        </div>
      )}

      <div style={{height:24}}/>
    </div>
  );
}