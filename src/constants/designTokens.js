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

export const TARGET_AUDIENCES = [
  { id: "parents",     label: "الأولياء",                icon: "👨‍👩‍👧‍👦", color: "#4CAF50" },
  { id: "graduates",   label: "خريجو جامعات",           icon: "🎓",     color: "#9C27B0" },
  { id: "bem",         label: "طلاب BEM",               icon: "📘",     color: "#2196F3" },
  { id: "bac",         label: "طلاب BAC",               icon: "📗",     color: "#00BCD4" },
  { id: "weddings",    label: "أعراس",                   icon: "💍",     color: "#E91E63" },
  { id: "artists",     label: "الفنانين",                icon: "🎨",     color: "#FF9800" },
  { id: "readers",     label: "المطالعين",               icon: "📚",     color: "#795548" },
  { id: "businesses",  label: "إدارات ومؤسسات وشركات",  icon: "🏢",     color: "#607D8B" },
  { id: "quran",       label: "طلبة المدارس القرآنية",   icon: "🕌",     color: "#4DB6AC" },
];

export const PRODUCTS = [
  { id: "edu_toys",       label: "ألعاب تعليمية لتنمية ذكاء الأطفال",  icon: "🧩", audiences: ["parents"]                },
  { id: "fun_toys",       label: "ألعاب ترفيهية",                       icon: "🎮", audiences: ["parents"]                },
  { id: "grad_gifts",     label: "هدايا للخريجين والطلبة المتفوقين",   icon: "🎁", audiences: ["graduates", "bem", "bac"] },
  { id: "adult_gifts",    label: "هدايا للكبار",                        icon: "🎀", audiences: ["graduates", "weddings"]   },
  { id: "wedding_gifts",  label: "هدايا أعراس",                        icon: "💐", audiences: ["weddings"]               },
  { id: "religious_books", label: "كتب دينية",                          icon: "📖", audiences: ["quran"]                  },
  { id: "novels",          label: "روايات للمطالعين في الصيف",          icon: "📕", audiences: ["readers"]                },
  { id: "art_supplies",    label: "أدوات فنية للمبتدئين والمحترفين",   icon: "🖌️", audiences: ["artists"]                },
  { id: "office_supplies", label: "أدوات مكتبية احترافية",              icon: "🗂️", audiences: ["businesses"]             },
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
  // ── NEW: Sales Targets ──
  salesTargets: {},    // { [productId]: { target: "", actual: "" } }
  // ── NEW: Audience Priority (% focus this month) ──
  audiencePriority: {}, // { [audienceId]: "" }  (percentage string)
  // ── NEW: Audience Notes ──
  audienceNotes: {},    // { [audienceId]: "" }
  // ── NEW: Post-Audience Mapping per day ──
  postAudienceMap: {},  // { [dayEn]: [audienceId, ...] }
};

export const STORIES_COUNT = 6;
export const CONTENT_TYPES_MONTH = ["فيديو","كراوسل","صورة","ريل","ستوري","بث مباشر","UGC","B2B"];

