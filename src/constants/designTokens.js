export const G = {
  bg:        "#060D08",
  panel:     "#0B160D",
  card:      "#0F1E12",
  cardHover: "#142018",
  border:     "#1C3020",
  borderGold: "#8B6914",
  gold:       "#D4A017",
  goldBright: "#F5C84A",
  goldDim:    "#2A1F00",
  silver:    "#B8C0BC",
  silverDim: "#3A4A3E",
  green:     "#0D4A1A",
  text:      "#E8F0E9",
  textMuted: "#5A7A5E",
  textDim:   "#2A3A2C",
  accent400: "#F5C84A",
  accentLak: "#4AE0B0",
  accentBid: "#C084FC",
  red:       "#FF4D6D",
  blue:      "#4A9EFF",
  green2:    "#06D6A0"
};

export const BRANCHES = [
  { id: "400",     name: "400",     color: G.accent400, glow: "#D4A01740", dim: "#2A1F00", icon: "♛" },
  { id: "laknab",  name: "لاكناب", color: G.accentLak, glow: "#4AE0B040", dim: "#002A20", icon: "◈" },
  { id: "bidando", name: "بيداندو", color: G.accentBid, glow: "#C084FC40", dim: "#1A0030", icon: "❋" },
];

export const DAYS = [
  { ar: "السبت",    en: "SAT", short: "سبت"    },
  { ar: "الأحد",    en: "SUN", short: "أحد"    },
  { ar: "الاثنين",  en: "MON", short: "اثنين"  },
  { ar: "الثلاثاء", en: "TUE", short: "ثلاثاء" },
  { ar: "الأربعاء", en: "WED", short: "أربعاء" },
  { ar: "الخميس",   en: "THU", short: "خميس"   },
  { ar: "الجمعة",   en: "FRI", short: "جمعة"   },
];

export const SM_TASKS_BY_TYPE = {
  carousel: [
    { id: "research", label: "بحث الموضوع",  icon: "🔍", cat: "تحضير"  },
    { id: "script",   label: "السكريبت",      icon: "✍️", cat: "تحضير"  },
    { id: "design",   label: "التصميم",        icon: "🎨", cat: "إنتاج"  },
    { id: "caption",  label: "الكابشن",        icon: "📝", cat: "إنتاج"  },
    { id: "hashtags", label: "الهاشتاقات",    icon: "#️⃣", cat: "إنتاج"  },
    { id: "review",   label: "المراجعة",       icon: "✅", cat: "مراجعة" },
    { id: "publish",  label: "النشر",          icon: "📤", cat: "نشر"    },
    { id: "engage",   label: "التفاعل",        icon: "💬", cat: "تفاعل"  },
  ],
  video: [
    { id: "concept", label: "الفكرة",    icon: "💡", cat: "تحضير"  },
    { id: "script",  label: "السكريبت", icon: "✍️", cat: "تحضير"  },
    { id: "filming", label: "التصوير",   icon: "🎬", cat: "إنتاج"  },
    { id: "edit",    label: "المونتاج",  icon: "✂️", cat: "إنتاج"  },
    { id: "caption", label: "الكابشن",  icon: "📝", cat: "إنتاج"  },
    { id: "review",  label: "المراجعة", icon: "✅", cat: "مراجعة" },
    { id: "publish", label: "النشر",     icon: "📤", cat: "نشر"    },
    { id: "engage",  label: "التفاعل",  icon: "💬", cat: "تفاعل"  },
  ],
  photo: [
    { id: "concept",  label: "الاختيار",   icon: "🎯", cat: "تحضير"  },
    { id: "design",   label: "التصميم",    icon: "🎨", cat: "إنتاج"  },
    { id: "caption",  label: "الكابشن",    icon: "📝", cat: "إنتاج"  },
    { id: "hashtags", label: "الهاشتاقات", icon: "#️⃣", cat: "إنتاج"  },
    { id: "review",   label: "المراجعة",   icon: "✅", cat: "مراجعة" },
    { id: "publish",  label: "النشر",      icon: "📤", cat: "نشر"    },
  ],
};

export const DAY_CONTENT_TYPES = {
  SAT: ["carousel"],
  SUN: ["video"],
  MON: ["photo", "carousel"],
  TUE: ["video"],
  WED: ["carousel"],
  THU: ["video"],
  FRI: ["video", "video"],
};

export const VISUAL_CHECKS = [
  { id: "logo",      label: "اللوغو صحيح",   icon: "♛" },
  { id: "colors",    label: "الألوان الرسمية", icon: "◉" },
  { id: "font",      label: "الخط الرسمي",   icon: "Aa" },
  { id: "watermark", label: "الووترمارك",   icon: "◈" },
  { id: "template",  label: "القالب الرسمي", icon: "▣" },
  { id: "tone",      label: "أسلوب الكتابة", icon: "✦" },
];

export const B2B_TASKS_DEFAULT = [
  { id: "b1",  label: "تحديد المدارس المستهدفة", done: false, cat: "توقعات" },
  { id: "b2",  label: "إعداد قائمة العملاء",       done: false, cat: "توقعات" },
  { id: "b3",  label: "إنشاء محتوى B2B",           done: false, cat: "محتوى"  },
  { id: "b4",  label: "إرسال عروض الأسعار",        done: false, cat: "تواصل"  },
  { id: "b5",  label: "المتابعة مع العملاء",        done: false, cat: "تواصل"  },
  { id: "b6",  label: "عرض تقديمي للمؤسسات",       done: false, cat: "إنتاج"  },
  { id: "b7",  label: "حساب LinkedIn",              done: false, cat: "حضور"   },
  { id: "b8",  label: "محتوى B2B على LinkedIn",     done: false, cat: "حضور"   },
  { id: "b9",  label: "التفاوض على العقود",         done: false, cat: "مبيعات" },
  { id: "b10", label: "متابعة الطلبات",             done: false, cat: "مبيعات" },
];

export const MONTHS_PLAN_DEFAULT = {
  goals: {
    followers:  "",
    reach:      "",
    sales:      "",
    engagement: "",
  },
  segments: [
    { id: "g1", label: "طلاب BEM",        active: true  },
    { id: "g2", label: "طلاب BAC",        active: true  },
    { id: "g3", label: "خريجو الجامعات", active: true  },
    { id: "g4", label: "الأهل والأولياء", active: false },
    { id: "g5", label: "B2B — مدارس",     active: false },
    { id: "g6", label: "B2B — شركات",     active: false },
  ],
  weeks: [
    { label: "الأسبوع 1", period: "1-7 ماي",   offer: "", campaign: "",            targeting: "",              contentTypes: [],                b2b: [], focus: ""    },
    { label: "الأسبوع 2", period: "8-14 ماي",  offer: "", campaign: "",            targeting: "",              contentTypes: [],                b2b: [], focus: ""    },
    { label: "الأسبوع 3", period: "15-21 ماي", offer: "", campaign: "يوم BEM",    targeting: "طلاب المتوسط", contentTypes: ["فيديو","كراوسل"], b2b: [], focus: "BEM" },
    { label: "الأسبوع 4", period: "22-31 ماي", offer: "", campaign: "تحضير BAC",  targeting: "طلاب الثانوي", contentTypes: ["فيديو","ريل"],    b2b: [], focus: "BAC" },
  ],
  funnel: {
    awareness: "",
    interest:  "",
    desire:    "",
    action:    "",
  },
};

export const STORIES_COUNT = 6;
export const CONTENT_TYPES_MONTH = ["فيديو","كراوسل","صورة","ريل","ستوري","بث مباشر","UGC","B2B"];
