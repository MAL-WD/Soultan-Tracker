import { useState, useEffect, useMemo, useCallback } from "react";
import { G } from "../constants/designTokens";
import { generateContentPlanningReport } from "../utils/reportGenerator";

// ============================================
// REFERENCE LIBRARIES (from HTML Design)
// ============================================

const CONTENT_TYPES_REF = [
  ['عرض المنتجات','عرض المنتج وخصائصه ومظهره بلقطات واضحة','إبراز المزايا وزيادة الاهتمام'],
  ['تجربة المنتجات وشرح الاستخدام','تجربة المنتج أمام الكاميرا وشرح طريقة استعماله','بناء الثقة وتسهيل قرار الشراء'],
  ['مقارنة المنتجات','مقارنة بين منتجين أو أكثر من حيث الجودة والسعر والاستعمال','مساعدة العميل على الاختيار'],
  ['محتوى تعليمي','معلومة أو مهارة مفيدة مرتبطة بمجال المنتجات','ترسيخ صورة العلامة كمرجع'],
  ['نصائح وإرشادات','نصائح عملية سريعة للتلاميذ والأولياء والمعلمين','رفع الحفظ والمشاركة'],
  ['حل مشكلات العملاء','عرض مشكلة شائعة وكيف يحلها منتج أو خدمة','تحويل الاحتياج إلى شراء'],
  ['محتوى ترويجي','ترويج مباشر لمنتج أو مجموعة دون تخفيض','دعم المبيعات'],
  ['عروض وتخفيضات','إعلان عن تخفيض أو عرض محدود المدة','تحقيق التحويلات السريعة'],
  ['فيديو إعلاني مدفوع','فيديو مُنتَج للتوزيع الإعلاني المدفوع','الوصول إلى جمهور جديد'],
  ['آراء وشهادات العملاء','تجارب حقيقية يرويها الزبائن','بناء المصداقية'],
  ['مراجعات المنتجات','مراجعة صريحة لمنتج بإيجابياته وملاحظاته','الشفافية وتعزيز الثقة'],
  ['تعريف بالععلامة التجارية','قصة السلطان وقيمها وفروعها الثلاثة','تثبيت الهوية ونشر الوعي'],
  ['الكواليس','لقطات من العمل داخل الفروع وخلف الكاميرا','تقريب العلامة من جمهورها'],
  ['ترفيه وترندات','محتوى خفيف يواكب الترندات بطابع العلامة','رفع الوصول والمشاهدات'],
  ['أسئلة شائعة','إجابات مختصرة عن أسئلة الزبائن المتكررة','تقليل الاستفسارات المكررة'],
  ['محتوى موسمي','محتوى مرتبط بالموسم الدراسي والأعياد والمناسبات','الاستفادة من ذروة الطلب'],
  ['محتوى تفاعلي','تحديات واستطلاعات وأسئلة للجمهور','رفع التفاعل والتعليقات'],
  ['إطلاق منتج جديد','تقديم منتج أو مجموعة جديدة لأول مرة','خلق الترقب والمبيعات الأولى'],
  ['محتوى المستخدمين (UGC)','إعادة نشر محتوى ينشئه الزبائن بإذنهم','الإثبات الاجتماعي'],
  ['تغطية الفعاليات','تصوير الورشات والزيارات والمبادرات وتغطيتها','إبراز الحضور المجتمعي'],
  ['ورشات وأنشطة تعليمية','محتوى من أنشطة وورشات تعليمية للأطفال','بناء علاقة مع الأسر'],
  ['محتوى مؤسسي','أخبار الشركة وشراكاتها وإنجازاتها وفريقها','دعم الشراكات ونشاط B2B']
];

const GOALS_REF = [
  ['زيادة الوعي بالعلامة التجارية','تعريف أكبر عدد ممكن من الناس بمكتبة السلطان','توسيع قاعدة العملاء المحتملين','الوصول، الظهور، المتابعون الجدد','عالية'],
  ['زيادة الوصول والمشاهدات','رفع عدد من يشاهدون الفيديوهات','تضخيم أثر كل فيديو','المشاهدات، معدل المشاهدة الكاملة','عالية'],
  ['رفع معدل التفاعل','التعليقات والمشاركات والحفظ','تحسين ظهور المحتوى في المنصات','معدل التفاعل، الحفظ، المشاركات','متوسطة'],
  ['بناء الثقة والمصداقية','إظهار الجودة والشفافية وتجارب الزبائن الحقيقية','تقليل تردد الشراء','التعليقات الإيجابية، الإحالات','عالية'],
  ['تثقيف العملاء حول المنتجات','شرح استعمال المنتجات واختلافاتها','عملاء أكثر وعيًا واقتناعًا','مدة المشاهدة، الأسئلة الواردة','متوسطة'],
  ['إبراز خصائص المنتجات ومزاياها','إظهار ما يميز المنتج عن غيره','دعم قرار الشراء','النقرات والرسائل بعد المشاهدة','متوسطة'],
  ['توليد العملاء المحتملين والاستفسارات','دفع الجمهور إلى مراسلة المكتبة','تغذية قناة المبيعات','عدد الرسائل، النقر على واتساب','عالية'],
  ['دعم المبيعات وتحقيق التحويلات','تحويل المشاهدة إلى طلب أو زيارة','زيادة الإيرادات','الطلبات، نسبة التحويل','عالية'],
  ['الترويج للعروض والحملات التجارية','إيصال العروض في وقتها لأوسع جمهور','تحريك المخزون والمواسم','الوصول للعرض، الاستفادة منه','عالية'],
  ['بناء هوية بصرية وذهنية واضحة','اتساق الألوان والتاج والنبرة في كل فيديو','تميّز العلامة','تذكّر العلامة، اتساق النشر','متوسطة'],
  ['تقوية العلاقة مع العملاء','حوار دائم ومحتوى قريب من الزبائن','ولاء عاطفي للعلامة','الرسائل الخاصة، التعليقات المتكررة','متوسطة'],
  ['دعم الشراكات وتطوير نشاط B2B','محتوى موجّه للمؤسسات والشركاء','عقود وتوريد مع المؤسسات','طلبات التعاون، الاجتماعات المحققة','متوسطة'],
  ['زيادة الولاء وتشجيع الشراء المتكرر','مكافأة العملاء الدائمين وتذكيرهم بالعودة','رفع قيمة العميل مع الوقت','نسبة العملاء العائدين','متوسطة']
];

const PRODUCT_CATEGORIES = [
  ['مستلزمات مدرسية','كل ما يحتاجه التلميذ يوميًا في القسم',['أقلام وأدوات كتابة','دفاتر وكراريس','مقالم ومبراة وممحاة','أغلفة وملصقات']],
  ['حقائب','حقائب مدرسية وملحقاتها لمختلف الأعمار',['حقائب مدرسية','محافظ وأكياس','حقائب بعجلات']],
  ['أدوات مكتبية','لوازم المكاتب والإدارة والأرشفة',['ملفات وأرشفة','آلات حاسبة','ورق وطباعة','لوازم مكتب']],
  ['ألعاب','ألعاب تعليمية وترفيهية للأطفال',['ألعاب تعليمية','ألعاب تركيب','دمى وشخصيات','ألعاب ألوان']],
  ['عطور','قسم العطور في المكتبة',['عطور رجالية','عطور نسائية','معطرات']],
  ['ملابس الأطفال','ملابس الأطفال والأزياء المدرسية',['ملابس يومية','أزياء مدرسية','ملابس المناسبات']],
  ['مجموعة Morandi Workspace','مكاتب وأثاث دراسة للأعمار من 6 إلى 25 سنة',['مكاتب دراسة','كراسي','رفوف وتنظيم']],
  ['كتب ومكتبة','كتب مدرسية وثقافية وللأطفال',['كتب مدرسية','كتب أطفال','روايات وثقافة','قواميس']],
  ['هدايا','أفكار هدايا للمعلمين والأطفال والمناسبات',['هدايا الأطفال','هدايا المعلمين','علب هدايا']],
  ['عام','محتوى لا يخص فئة محددة: العلامة والفروع والفريق',[]]
];

const AUDIENCES_REF = [
  ['الأطفال (6–12 سنة)','تلاميذ الابتدائي وصغار السن','ألوان ومرح وشخصيات، ونخاطبهم عبر الأولياء'],
  ['المراهقون والتلاميذ (13–18 سنة)','تلاميذ المتوسط والثانوي','أسلوب مباشر وعصري، ترندات وأفكار لتنظيم الدراسة'],
  ['طلبة الجامعة والشباب (19–25 سنة)','طلاب جامعيون وشباب','محتوى عملي وأنيق عن الدراسة والمكتب والهدايا'],
  ['أولياء الأمور','المشترون الرئيسيون لمستلزمات الصغار','الجودة والسعر والراحة والثقة'],
  ['المعلمون والأساتذة','معلمو الأقسام والمدارس','أدوات التدريس وهدايا المعلمين وعروض خاصة'],
  ['الموظفون والمكاتب','من يجهّزون مكاتبهم وأعمالهم','التنظيم والكفاءة والجودة المكتبية'],
  ['المدارس والمؤسسات التعليمية','إدارات المدارس والروضات (B2B)','التوريد بالجملة والانتظام والأسعار المناسبة'],
  ['الشركات والمؤسسات','مؤسسات تحتاج لوازم أو هدايا مؤسسية (B2B)','عروض مخصصة وموثوقية وفاتورة رسمية'],
  ['المتسوقون للهدايا','من يبحثون عن هدية لطفل أو معلم أو مناسبة','أفكار هدايا وتغليف وميزانيات متنوعة'],
  ['زبائن الفروع الأوفياء','الزبائن الدائمون في الفروع الثلاثة','التقدير والاعتراف: الزبون هو السلطان'],
  ['جميع المتابعين','محتوى عام لا يستهدف شريحة بعينها','الهوية والقيم والكواليس']
];

const STATUS_MAP = {
  idea:           { label: 'فكرة',            color: '#8A8578', bg: '#8A857822' },
  review:         { label: 'قيد المراجعة',    color: '#C28A1B', bg: '#C28A1B22' },
  'ready-shoot':  { label: 'جاهز للتصوير',    color: '#2F6DB5', bg: '#2F6DB522' },
  shooting:       { label: 'قيد التصوير',      color: '#7A4FC4', bg: '#7A4FC422' },
  editing:        { label: 'قيد المونتاج',     color: '#D9692B', bg: '#D9692B22' },
  'ready-publish':{ label: 'جاهز للنشر',       color: '#2E8B57', bg: '#2E8B5722' },
  published:      { label: 'منشور',           color: '#003D32', bg: '#003D3222' },
  evaluating:     { label: 'تقييم النتائج',    color: '#118A9C', bg: '#118A9C22' }
};

const MONTH_NAMES = ['يناير','فبراير','مارس','أبريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const WEEK_DAYS = ['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد'];
const WEEK_LABELS = ['الأول','الثاني','الثالث','الرابع','الخامس'];

const DEFAULT_AUDIENCE_MAP = {
  'مستلزمات مدرسية': 'أولياء الأمور',
  'حقائب': 'الأطفال (6–12 سنة)',
  'أدوات مكتبية': 'الموظفون والمكاتب',
  'ألعاب': 'أولياء الأمور',
  'عطور': 'طلبة الجامعة والشباب (19–25 سنة)',
  'هدايا': 'المتسوقون للهدايا',
  'عام': 'جميع المتابعين'
};

const EVENT_TYPES = ['موسمي','وطني أو تاريخي','ورشة','زيارة','مبادرة مجتمعية','فعالية ترويجية','شراكة','معرض','نشاط داخلي','أخرى'];
const CAMPAIGN_TYPES = ['تخفيض','عرض محدود المدة','حملة موسمية','فيديو إعلاني مدفوع','شراكة تجارية','أخرى'];

// Sample Demo Data from the user's design for initial load or testing
const SAMPLE_OCTOBER_DEMO_VIDEOS = [
  { id: 'v1', title: 'جولة سريعة داخل الفرع', contentType: 'تعريف بالعلامة التجارية', productCategory: 'عام', targetAudience: 'جميع المتابعين', assignee: 'أ', status: 'published', scheduledDate: 1, hasGoal: true },
  { id: 'v2', title: '٥ أدوات لا يستغني عنها التلميذ', contentType: 'عرض المنتجات', productCategory: 'مستلزمات مدرسية', targetAudience: 'أولياء الأمور', assignee: 'ب', status: 'published', scheduledDate: 2, hasGoal: true },
  { id: 'v3', title: 'كواليس تجهيز الرفوف', contentType: 'الكواليس', productCategory: 'عام', targetAudience: 'جميع المتابعين', assignee: 'أ', status: 'published', scheduledDate: 4, hasGoal: true },
  { id: 'v4', title: 'كيف تختار حقيبة مريحة؟', contentType: 'نصائح وإرشادات', productCategory: 'حقائب', targetAudience: 'الأطفال (6–12 سنة)', assignee: 'أ', status: 'published', scheduledDate: 5, hasGoal: true },
  { id: 'v5', title: 'أسئلة العملاء الشائعة', contentType: 'أسئلة شائعة', productCategory: 'عام', targetAudience: 'جميع المتابعين', assignee: 'ب', status: 'published', scheduledDate: 5, hasGoal: true },
  { id: 'v6', title: 'مقارنة بين نوعين من الأقلام', contentType: 'مقارنة المنتجات', productCategory: 'مستلزمات مدرسية', targetAudience: 'أولياء الأمور', assignee: 'أ', status: 'published', scheduledDate: 6, hasGoal: true },
  { id: 'v7', title: 'تحدي الألوان مع الأطفال', contentType: 'محتوى تفاعلي', productCategory: 'ألعاب', targetAudience: 'أولياء الأمور', assignee: 'ج', status: 'published', scheduledDate: 8, hasGoal: true },
  { id: 'v8', title: 'رأي زبون عن تجربة الشراء', contentType: 'آراء وشهادات العملاء', productCategory: 'عام', targetAudience: 'جميع المتابعين', assignee: 'أ', status: 'published', scheduledDate: 9, hasGoal: true },
  { id: 'v9', title: 'تنظيم مكتب الدراسة', contentType: 'نصائح وإرشادات', productCategory: 'أدوات مكتبية', targetAudience: 'الموظفون والمكاتب', assignee: 'أ', status: 'published', scheduledDate: 11, hasGoal: true },
  { id: 'v10', title: 'ترند: ماذا في حقيبتي؟', contentType: 'ترفيه وترندات', productCategory: 'حقائب', targetAudience: 'الأطفال (6–12 سنة)', assignee: 'ج', status: 'published', scheduledDate: 13, hasGoal: true },
  { id: 'v11', title: 'شرح استخدام دفتر التخطيط', contentType: 'تجربة المنتجات وشرح الاستخدام', productCategory: 'مستلزمات مدرسية', targetAudience: 'أولياء الأمور', assignee: 'أ', status: 'published', scheduledDate: 14, hasGoal: true },
  { id: 'v12', title: 'هدية بسيطة لمعلمك', contentType: 'محتوى موسمي', productCategory: 'هدايا', targetAudience: 'المتسوقون للهدايا', assignee: 'أ', status: 'published', scheduledDate: 15, hasGoal: true },
  { id: 'v13', title: 'الحقائب الجديدة وصلت', contentType: 'عرض المنتجات', productCategory: 'حقائب', targetAudience: 'الأطفال (6–12 سنة)', assignee: 'ب', status: 'published', scheduledDate: 16, hasGoal: true },
  { id: 'v14', title: 'أنواع الألوان والفروق بينها', contentType: 'محتوى تعليمي', productCategory: 'مستلزمات مدرسية', targetAudience: 'أولياء الأمور', assignee: 'أ', status: 'evaluating', scheduledDate: 19, hasGoal: true },
  { id: 'v15', title: 'مراجعة عطر جديد', contentType: 'مراجعات المنتجات', productCategory: 'عطور', targetAudience: 'طلبة الجامعة والشباب (19–25 سنة)', assignee: 'أ', status: 'published', scheduledDate: 20, hasGoal: true },
  { id: 'v16', title: 'كواليس تغليف الطلبات', contentType: 'الكواليس', productCategory: 'عام', targetAudience: 'جميع المتابعين', assignee: 'أ', status: 'ready-publish', scheduledDate: 21, hasGoal: true },
  { id: 'v17', title: 'إطلاق مجموعة دفاتر جديدة', contentType: 'إطلاق منتج جديد', productCategory: 'مستلزمات مدرسية', targetAudience: 'أولياء الأمور', assignee: 'ب', status: 'ready-publish', scheduledDate: 22, hasGoal: true },
  { id: 'v18', title: 'مقارنة بين حقيبتين', contentType: 'مقارنة المنتجات', productCategory: 'حقائب', targetAudience: 'الأطفال (6–12 سنة)', assignee: 'أ', status: 'editing', scheduledDate: 23, hasGoal: true },
  { id: 'v19', title: 'نصائح لترتيب الحقيبة', contentType: 'نصائح وإرشادات', productCategory: 'حقائب', targetAudience: 'الأطفال (6–12 سنة)', assignee: 'ج', status: 'editing', scheduledDate: 23, hasGoal: true },
  { id: 'v20', title: 'ترند صوتي مع فريق الفرع', contentType: 'ترفيه وترندات', productCategory: 'عام', targetAudience: 'جميع المتابعين', assignee: 'أ', status: 'shooting', scheduledDate: 24, hasGoal: true },
  { id: 'v21', title: 'أفكار هدايا قبل نهاية الشهر', contentType: 'محتوى موسمي', productCategory: 'هدايا', targetAudience: 'المتسوقون للهدايا', assignee: 'أ', status: 'ready-publish', scheduledDate: 25, hasGoal: true },
  { id: 'v22', title: 'ما الجديد في قسم الألعاب؟', contentType: 'عرض المنتجات', productCategory: 'ألعاب', targetAudience: 'أولياء الأمور', assignee: 'أ', status: 'ready-shoot', scheduledDate: 26, hasGoal: true },
  { id: 'v23', title: 'كيف تنظّم أدوات طفلك؟', contentType: 'نصائح وإرشادات', productCategory: 'مستلزمات مدرسية', targetAudience: 'أولياء الأمور', assignee: 'ب', status: 'review', scheduledDate: 26, hasGoal: true },
  { id: 'v24', title: 'تجربة طاولة دراسة Morandi', contentType: 'تجربة المنتجات وشرح الاستخدام', productCategory: 'مجموعة Morandi Workspace', targetAudience: 'طلبة الجامعة والشباب (19–25 سنة)', assignee: 'ج', status: 'idea', scheduledDate: 26, hasGoal: true },
  { id: 'v25', title: 'جولة في قسم الهدايا', contentType: 'عرض المنتجات', productCategory: 'هدايا', targetAudience: 'المتسوقون للهدايا', assignee: 'ب', status: 'shooting', scheduledDate: 27, hasGoal: true },
  { id: 'v26', title: 'رأي زبون عن الفرع', contentType: 'آراء وشهادات العملاء', productCategory: 'عام', targetAudience: 'جميع المتابعين', assignee: 'أ', status: 'idea', scheduledDate: 28, hasGoal: false },
  { id: 'v27', title: 'مقارنة بين لعبتين تعليميتين', contentType: 'مقارنة المنتجات', productCategory: 'ألعاب', targetAudience: 'أولياء الأمور', assignee: 'ج', status: 'review', scheduledDate: 29, hasGoal: true },
  { id: 'v28', title: 'حصاد الشهر', contentType: 'تعريف بالعلامة التجارية', productCategory: 'عام', targetAudience: 'جميع المتابعين', assignee: 'ب', status: 'idea', scheduledDate: 31, hasGoal: true },
  { id: 'v29', title: 'أسئلة الأولياء عن الدفاتر', contentType: 'أسئلة شائعة', productCategory: 'مستلزمات مدرسية', targetAudience: 'أولياء الأمور', assignee: 'أ', status: 'idea', scheduledDate: 31, hasGoal: true },
  { id: 'v30', title: 'كواليس جرد آخر الشهر', contentType: 'الكواليس', productCategory: 'عام', targetAudience: 'جميع المتابعين', assignee: 'ج', status: 'idea', scheduledDate: 31, hasGoal: true },
];

// ============================================
// SIDE PANEL COMPONENT
// ============================================

function SidePanel({ open, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', top: 0, bottom: 0, left: 0, width: 380, maxWidth: '100%',
      background: G.card, borderInlineEnd: `1px solid ${G.border}`,
      boxShadow: open ? '4px 0 24px rgba(0,0,0,0.4)' : 'none',
      padding: '24px 20px 20px', transform: open ? 'none' : 'translateX(-105%)',
      transition: 'transform 0.25s ease', zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto',
      direction: 'rtl', fontFamily: "'ThmanyahText', 'Cairo', sans-serif",
      color: G.text
    }}>
      <button onClick={onClose} style={{
        alignSelf: 'flex-start', padding: '6px 14px', borderRadius: 8,
        background: G.panel, border: `1px solid ${G.border}`,
        color: G.textMuted, fontSize: 13, cursor: 'pointer',
        fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
      }}>إغلاق ✕</button>
      {children}
    </div>
  );
}

// ============================================
// NAV ITEM FOR THE SIDEBAR OF THE PLANNING PAGE
// ============================================

function PlanNav({ view, setView, monthLabel, onExportPDF }) {
  const NAV = [
    { id: 'plan', label: 'خطة المحتوى الشهرية' },
    { type: 'group', label: 'بيانات مرجعية دائمة', tag: 'ثابت' },
    { id: 'types', label: 'أنواع المحتوى' },
    { id: 'goals', label: 'الأهداف التسويقية' },
    { id: 'cats', label: 'فئات المنتجات' },
    { id: 'aud', label: 'الفئات المستهدفة' },
    { type: 'group', label: 'تتغير كل شهر', tag: 'شهري', tagClass: 'ev' },
    { id: 'events', label: 'الأحداث والفعاليات' },
    { id: 'camps', label: '$$$ العروض والفيديوهات المدفوعة' },
    { type: 'group', label: 'التنفيذ والمتابعة', tag: 'تشغيل' },
    { id: 'pipe', label: 'مسار إنتاج الفيديوهات (Pipeline)' },
  ];

  return (
    <div style={{
      width: 250, minWidth: 250, background: G.card,
      borderInlineEnd: `1px solid ${G.border}`,
      padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 4,
      overflowY: 'auto', direction: 'rtl'
    }}>
      <div style={{ paddingBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: G.gold, letterSpacing: 1 }}>SOULTAN</div>
        <div style={{ fontSize: 11, color: G.textMuted }}>مكتبة السلطان — تخطيط المحتوى</div>
      </div>
      {NAV.map((item, i) => {
        if (item.type === 'group') {
          return (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 10px 4px', fontSize: 11, fontWeight: 600, color: G.gold
            }}>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 6,
                background: item.tagClass === 'ev' ? `${G.red}18` : `${G.gold}18`,
                color: item.tagClass === 'ev' ? G.red : G.gold
              }}>{item.tag}</span>
              <span>{item.label}</span>
            </div>
          );
        }
        const isActive = view === item.id;
        return (
          <button key={item.id} onClick={() => setView(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
            borderRadius: 8, fontSize: 13, fontWeight: isActive ? 700 : 500,
            color: isActive ? G.gold : G.silver, background: isActive ? `${G.gold}18` : 'transparent',
            border: 'none', cursor: 'pointer', textAlign: 'right', width: '100%',
            fontFamily: "'ThmanyahText', 'Cairo', sans-serif",
            transition: 'all 0.15s'
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isActive ? G.gold : G.textDim, flexShrink: 0
            }} />
            {item.label}
          </button>
        );
      })}

      <div style={{
        marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${G.border}`,
        display: 'flex', flexDirection: 'column', gap: 6
      }}>
        <div style={{
          background: G.panel, borderRadius: 8, padding: '10px 12px', fontSize: 11, color: G.textMuted
        }}>
          الشهر المحدد
          <b style={{ display: 'block', color: G.gold, fontSize: 14, marginTop: 2 }}>{monthLabel}</b>
        </div>
        <button
          onClick={onExportPDF}
          style={{
            marginTop: 4, padding: "9px 12px", borderRadius: 8,
            background: `${G.gold}18`, border: `1px solid ${G.gold}55`,
            color: G.gold, fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "'ThmanyahText', 'Cairo', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            width: "100%", transition: "all 0.15s"
          }}
        >
          <span>📄</span>
          <span>تصدير تقرير PDF</span>
        </button>
      </div>
    </div>
  );
}

// ============================================
// REFERENCE LIBRARY VIEW
// ============================================

function LibraryView({ kind, videos }) {
  const [search, setSearch] = useState('');

  const configs = {
    types: {
      title: 'أنواع المحتوى',
      data: CONTENT_TYPES_REF,
      render: (x) => {
        const count = videos.filter(v => v.contentType === x[0]).length;
        return (
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, borderTop: `3px solid ${G.gold}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: G.gold }}>{x[0]}</span>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: `${G.gold}15`, color: G.gold }}>{count} في الخطة</span>
            </div>
            <p style={{ margin: '0 0 6px 0', fontSize: 13, color: G.silver }}>{x[1]}</p>
            <span style={{ fontSize: 11, color: G.textMuted }}>الهدف: {x[2]}</span>
          </div>
        );
      }
    },
    goals: {
      title: 'الأهداف التسويقية',
      data: GOALS_REF,
      render: (x) => (
        <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, borderTop: `3px solid ${G.gold}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: G.gold }}>{x[0]}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
              background: x[4] === 'عالية' ? `${G.gold}22` : `${G.textMuted}15`,
              color: x[4] === 'عالية' ? G.gold : G.textMuted
            }}>أولوية {x[4]}</span>
          </div>
          <p style={{ margin: '0 0 6px 0', fontSize: 13, color: G.silver }}>{x[1]}</p>
          <div style={{ fontSize: 11, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span>الغاية التجارية: {x[2]}</span>
            <span>المؤشرات (KPIs): {x[3]}</span>
          </div>
        </div>
      )
    },
    cats: {
      title: 'فئات المنتجات',
      data: PRODUCT_CATEGORIES,
      render: (x) => {
        const count = videos.filter(v => v.productCategory === x[0]).length;
        const subcategories = x[2] || [];
        return (
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, borderTop: `3px solid ${G.gold}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: G.gold }}>{x[0]}</span>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: `${G.gold}15`, color: G.gold }}>{count} في الخطة</span>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: 13, color: G.silver }}>{x[1]}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {subcategories.length > 0 ? (
                subcategories.map(s => (
                  <span key={s} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 6,
                    background: G.panel, border: `1px solid ${G.border}`, color: G.textMuted
                  }}>{s}</span>
                ))
              ) : (
                <span style={{ fontSize: 10, color: G.textMuted }}>بلا فئات فرعية</span>
              )}
            </div>
          </div>
        );
      }
    },
    aud: {
      title: 'الفئات المستهدفة',
      data: AUDIENCES_REF,
      render: (x) => {
        const count = videos.filter(v => v.targetAudience === x[0]).length;
        return (
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, borderTop: `3px solid ${G.gold}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: G.gold }}>{x[0]}</span>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: `${G.gold}15`, color: G.gold }}>{count} في الخطة</span>
            </div>
            <p style={{ margin: '0 0 6px 0', fontSize: 13, color: G.silver }}>{x[1]}</p>
            <span style={{ fontSize: 11, color: G.textMuted }}>زاوية التواصل: {x[2]}</span>
          </div>
        );
      }
    }
  };

  const cfg = configs[kind];
  const filtered = cfg.data.filter(x => !search || x.join(' ').includes(search));

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 24, color: G.gold }}>{cfg.title}</h1>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: `${G.gold}18`, color: G.gold }}>بيانات ثابتة — تُستخدم كل شهر</span>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث في المكتبة…"
          style={{
            padding: '8px 14px', width: 240, background: G.panel,
            border: `1px solid ${G.border}`, borderRadius: 10,
            color: G.text, fontSize: 13, outline: 'none',
            fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
          }}
        />
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: G.panel, border: `1px solid ${G.border}`,
        borderRadius: 10, padding: '10px 16px', fontSize: 12, color: G.textMuted,
        marginBottom: 16
      }}>
        {cfg.data.length} عنصرًا جاهزًا للاختيار مباشرة عند تخطيط أي فيديو، ولا تُعاد كتابتها كل شهر.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map((x, i) => <div key={i}>{cfg.render(x)}</div>)}
      </div>
    </div>
  );
}

// ============================================
// EVENTS / CAMPAIGNS VIEW
// ============================================

function VariableView({ kind, items, onAdd, onDelete, monthLabel }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const isEvents = kind === 'events';

  const fields = isEvents
    ? [
      { key: 'name', label: 'اسم الحدث', type: 'text' },
      { key: 'eventType', label: 'نوع الحدث', type: 'select', options: EVENT_TYPES },
      { key: 'eventDate', label: 'تاريخ الحدث', type: 'date' },
      { key: 'location', label: 'الموقع', type: 'text' },
      { key: 'marketingGoal', label: 'الهدف التسويقي', type: 'select', options: GOALS_REF.map(g => g[0]) },
      { key: 'shootDate', label: 'تاريخ التصوير', type: 'date' },
      { key: 'publishDate', label: 'تاريخ النشر', type: 'date' },
      { key: 'shootRequirements', label: 'متطلبات التصوير', type: 'text' },
    ]
    : [
      { key: 'name', label: 'اسم الحملة', type: 'text' },
      { key: 'campaignType', label: 'نوع الحملة', type: 'select', options: CAMPAIGN_TYPES },
      { key: 'productCategory', label: 'فئة المنتج', type: 'select', options: PRODUCT_CATEGORIES.map(c => c[0]) },
      { key: 'details', label: 'تفاصيل العرض', type: 'text' },
      { key: 'startDate', label: 'تاريخ البداية', type: 'date' },
      { key: 'endDate', label: 'تاريخ النهاية', type: 'date' },
      { key: 'distribution', label: 'طريقة التوزيع', type: 'select', options: ['عضوي','مدفوع','عضوي ومدفوع'] },
      { key: 'adBudget', label: 'ميزانية الإعلانات (د.ج)', type: 'number' },
      { key: 'productionBudget', label: 'ميزانية الإنتاج (د.ج)', type: 'number' },
    ];

  const handleSave = () => {
    if (!formData.name?.trim()) return;
    onAdd(formData);
    setFormData({});
    setPanelOpen(false);
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 24, color: G.gold }}>
            {isEvents ? 'الأحداث والفعاليات' : '$$$ العروض والفيديوهات المدفوعة'}
          </h1>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
            background: isEvents ? `${G.red}18` : `${G.gold}22`,
            color: isEvents ? G.red : G.gold
          }}>بيانات متغيرة — لهذا الشهر ({monthLabel})</span>
        </div>
        <button onClick={() => setPanelOpen(true)} style={{
          background: G.gold, color: '#003D32', border: 'none', borderRadius: 10,
          padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
        }}>
          {isEvents ? '+ حدث جديد' : '+ عرض أو حملة'}
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{
          background: G.card, border: `2px dashed ${G.border}`, borderRadius: 16,
          padding: '56px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 10
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: isEvents ? `${G.red}18` : `${G.gold}22`,
            color: isEvents ? G.red : G.gold,
            display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 700
          }}>{isEvents ? '◷' : '$'}</div>
          <h2 style={{ margin: 0, fontSize: 20, color: G.text }}>
            {isEvents ? `لا توجد أحداث في ${monthLabel} بعد` : `لا توجد عروض أو حملات في ${monthLabel} بعد`}
          </h2>
          <p style={{ margin: 0, color: G.textMuted, maxWidth: 460, fontSize: 13 }}>
            {isEvents
              ? 'أضف عيدًا أو ورشة أو زيارة أو مبادرة. الحدث الواحد يمكن أن ينتج عدة فيديوهات، ويُميَّز فيه بين تاريخ الحدث وتاريخ التصوير وتاريخ النشر.'
              : 'أضف تخفيضًا أو حملة موسمية أو فيديو مدفوعًا. العرض التجاري وتكلفة الإنتاج وميزانية الإعلان تُسجَّل كل منها على حدة.'}
          </p>
          <button onClick={() => setPanelOpen(true)} style={{
            background: G.gold, color: '#003D32', border: 'none', borderRadius: 10,
            padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'ThmanyahText', 'Cairo', sans-serif", marginTop: 8
          }}>
            {isEvents ? '+ إضافة أول حدث' : '+ إضافة أول حملة'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, idx) => (
            <div key={item.id || idx} style={{
              background: G.card, border: `1px solid ${G.border}`, borderRadius: 10,
              padding: '12px 16px', display: 'flex', justifyContent: 'space-between', gap: 12,
              flexWrap: 'wrap', alignItems: 'center'
            }}>
              <div>
                <b style={{ color: G.text, fontSize: 15, display: 'block' }}>{item.name}</b>
                <span style={{ fontSize: 12, color: G.textMuted }}>
                  {isEvents ? `${item.location ? `📍 ${item.location} · ` : ''}${item.eventDate || '—'}` : `${item.productCategory ? `🏷️ ${item.productCategory} · ` : ''}${item.startDate || ''} → ${item.endDate || ''}`}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                  background: isEvents ? `${G.red}18` : `${G.gold}22`,
                  color: isEvents ? G.red : G.gold
                }}>{isEvents ? item.eventType : item.campaignType}</span>
                {item.distribution && (
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: G.panel, color: G.textMuted }}>
                    {item.distribution}
                  </span>
                )}
                <button onClick={() => onDelete(item.id)} style={{
                  background: `${G.red}18`, border: `1px solid ${G.red}33`, borderRadius: 6,
                  color: G.red, fontSize: 11, padding: '4px 10px', cursor: 'pointer',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)}>
        <h2 style={{ margin: 0, fontSize: 18, color: G.gold }}>{isEvents ? 'حدث جديد' : 'عرض أو حملة جديدة'}</h2>
        {fields.map(f => (
          <label key={f.key} style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {f.label}
            {f.type === 'select' ? (
              <select
                value={formData[f.key] || ''}
                onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                style={{
                  width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                  borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}
              >
                <option value="">اختر...</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                type={f.type} value={formData[f.key] || ''}
                onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                style={{
                  width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                  borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}
              />
            )}
          </label>
        ))}
        <button onClick={handleSave} style={{
          background: G.gold, color: '#003D32', border: 'none', borderRadius: 10,
          padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
        }}>حفظ</button>
      </SidePanel>
    </div>
  );
}

// ============================================
// PIPELINE KANBAN VIEW (مسار الإنتاج)
// ============================================

function PipelineView({ videos, onUpdateVideo, onOpenDetail }) {
  const columns = Object.entries(STATUS_MAP);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleCardDragStart = (e, video) => {
    e.dataTransfer.setData('text/plain', video.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(video.id);
  };

  const handleColumnDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const videoId = e.dataTransfer.getData('text/plain') || draggedId;
    if (!videoId) return;
    const video = videos.find(v => v.id === videoId);
    if (!video || (video.status || 'idea') === targetStatus) return;
    onUpdateVideo({ ...video, status: targetStatus });
    setDraggedId(null);
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, color: G.gold }}>مسار إنتاج الفيديوهات</h1>
          <div style={{ fontSize: 12, color: G.textMuted, marginTop: 4 }}>
            متابعة انتقال الأفكار عبر مختلف مراحل الإنتاج من الفكرة حتى تقييم النتائج (يمكنك سحب وإفلات الأفكار بين المراحل)
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
        alignItems: 'start',
        overflowX: 'auto',
        paddingBottom: 20
      }}>
        {columns.map(([statusKey, statusVal]) => {
          const statusVideos = videos.filter(v => (v.status || 'idea') === statusKey);
          const isOver = dragOverColumn === statusKey;

          return (
            <div
              key={statusKey}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverColumn !== statusKey) setDragOverColumn(statusKey);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOverColumn(statusKey);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget) && dragOverColumn === statusKey) {
                  setDragOverColumn(null);
                }
              }}
              onDrop={(e) => handleColumnDrop(e, statusKey)}
              style={{
                background: isOver ? `${statusVal.color}18` : G.panel,
                border: `1px solid ${isOver ? statusVal.color : G.border}`,
                borderRadius: 12,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 300,
                transition: 'all 0.15s',
                boxShadow: isOver ? `0 0 12px ${statusVal.color}33` : 'none'
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingBottom: 8, borderBottom: `2px solid ${statusVal.color}`
              }}>
                <b style={{ fontSize: 13, color: statusVal.color }}>{statusVal.label}</b>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
                  background: statusVal.bg, color: statusVal.color
                }}>{statusVideos.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {statusVideos.map(v => {
                  const isCardDragging = draggedId === v.id;
                  return (
                    <div
                      key={v.id}
                      draggable={true}
                      onDragStart={(e) => handleCardDragStart(e, v)}
                      onDragEnd={() => { setDraggedId(null); setDragOverColumn(null); }}
                      onClick={() => onOpenDetail(v)}
                      style={{
                        background: G.card,
                        border: `1px solid ${G.border}`,
                        borderRadius: 8,
                        padding: 10,
                        cursor: isCardDragging ? 'grabbing' : 'grab',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        boxShadow: isCardDragging ? '0 6px 16px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.2)',
                        opacity: isCardDragging ? 0.4 : 1,
                        transform: isCardDragging ? 'scale(0.97)' : 'none',
                        transition: 'opacity 0.15s, transform 0.15s'
                      }}
                      title="اضغط للتفاصيل أو اسحب لتغيير المرحلة"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                        <b style={{ fontSize: 12, color: G.text, lineHeight: 1.4, flex: 1 }}>{v.title}</b>
                        <span style={{ color: G.textMuted, fontSize: 12, opacity: 0.5, cursor: 'grab' }}>⋮⋮</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10 }}>
                        <span style={{ color: G.gold }}>{v.productCategory || 'بدون فئة'}</span>
                        <span style={{ color: G.textMuted }}>يوم {v.scheduledDate || '—'}</span>
                      </div>
                    </div>
                  );
                })}
                {isOver && (
                  <div style={{
                    border: `1px dashed ${statusVal.color}`,
                    borderRadius: 8,
                    padding: 8,
                    textAlign: 'center',
                    color: statusVal.color,
                    fontSize: 11,
                    fontWeight: 700,
                    background: `${statusVal.color}15`
                  }}>
                    إفلات الفكرة هنا
                  </div>
                )}
                {statusVideos.length === 0 && !isOver && (
                  <div style={{ fontSize: 11, color: G.textDim, textAlign: 'center', padding: '20px 0' }}>
                    فارغ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// VIDEO CARD
// ============================================

function VideoCard({ video, dimmed, isDragging, onDragStart, onDragEnd, onClick }) {
  const st = STATUS_MAP[video.status] || STATUS_MAP.idea;
  const isBad = !video.productCategory || !video.hasGoal;

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      title="اضغط لتعديل الفكرة، أو اسحبها لإعادة جدولتها في يوم آخر"
      style={{
        background: G.card,
        border: `1px solid ${isBad ? G.red : G.border}`,
        borderRadius: 8,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.06)',
        textAlign: 'right',
        fontFamily: "'ThmanyahText', 'Cairo', sans-serif",
        color: G.text,
        width: '100%',
        boxSizing: 'border-box',
        opacity: isDragging ? 0.35 : (dimmed ? 0.25 : 1),
        transform: isDragging ? 'scale(0.96)' : 'none',
        transition: 'opacity 0.15s, transform 0.15s, border-color 0.15s',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: 12, fontWeight: 600, lineHeight: 1.45, flex: 1 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: st.color }} />
          <span style={{ wordBreak: 'break-word' }}>{video.title}</span>
        </div>
        <span
          style={{
            color: G.textMuted,
            fontSize: 13,
            lineHeight: 1,
            opacity: 0.5,
            padding: '2px 0 0 2px',
            flexShrink: 0,
            cursor: 'grab'
          }}
          title="اسحب لنقل اليوم"
        >⋮⋮</span>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 6,
          background: `${G.gold}15`, color: G.gold
        }}>{video.contentType || '—'}</span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 6,
          background: video.productCategory ? `${G.gold}15` : `${G.red}18`,
          color: video.productCategory ? G.gold : G.red
        }}>{video.productCategory || 'بدون فئة'}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: G.textMuted, gap: 4 }}>
        <span style={{
          width: 20, height: 20, borderRadius: '50%', background: G.gold,
          color: '#003D32', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0
        }}>{video.assignee || 'أ'}</span>
        <span style={{ color: !video.hasGoal ? G.red : G.textMuted }}>
          {!video.hasGoal ? 'ناقص: بلا هدف' : st.label}
        </span>
      </div>
    </div>
  );
}

// ============================================
// MAIN CALENDAR PLAN VIEW
// ============================================

function PlanView({
  year, month, videos, onAddVideo, onUpdateVideo, onDeleteVideo,
  onPrevMonth, onNextMonth, onTodayMonth, onSeedDemo, today, onExportPDF
}) {
  const [filters, setFilters] = useState({ type: '', cat: '', aud: '', status: '', incomplete: false, search: '' });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [panelMode, setPanelMode] = useState(null); // 'view' | 'add'
  const [addDay, setAddDay] = useState(null);
  const [newVideo, setNewVideo] = useState({});
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'weekly' | 'daily'
  const [draggedVideoId, setDraggedVideoId] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  // Calculate days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // First day of month (0=Sun, 1=Mon, ...)
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  // Monday-based: convert
  const mondayOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Group videos by day
  const videosByDay = useMemo(() => {
    const map = {};
    videos.forEach(v => {
      const d = v.scheduledDate;
      if (d) {
        if (!map[d]) map[d] = [];
        map[d].push(v);
      }
    });
    return map;
  }, [videos]);

  // Drag and drop handlers
  const handleDragStart = (e, video) => {
    e.dataTransfer.setData('text/plain', video.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedVideoId(video.id);
  };

  const handleDragEnd = () => {
    setDraggedVideoId(null);
    setDragOverDay(null);
  };

  const handleDropOnDay = (videoId, targetDay) => {
    const vid = videoId || draggedVideoId;
    if (!vid || !targetDay) return;
    const video = videos.find(v => v.id === vid);
    if (!video) return;
    if (Number(video.scheduledDate) === Number(targetDay)) return;

    const oldDay = video.scheduledDate;
    const updated = { ...video, scheduledDate: Number(targetDay) };
    onUpdateVideo(updated);

    setToast({
      msg: `تم نقل "${video.title}" من يوم ${oldDay || 'غير محدد'} إلى يوم ${targetDay} ${MONTH_NAMES[month]}`,
      undo: () => onUpdateVideo({ ...video, scheduledDate: oldDay })
    });
    setDraggedVideoId(null);
    setDragOverDay(null);
  };

  // Filter matching
  const matchFilter = useCallback((v) => {
    if (filters.type && v.contentType !== filters.type) return false;
    if (filters.cat && v.productCategory !== filters.cat) return false;
    if (filters.aud && v.targetAudience !== filters.aud) return false;
    if (filters.status && v.status !== filters.status) return false;
    if (filters.incomplete && v.productCategory && v.hasGoal) return false;
    if (filters.search && !v.title.includes(filters.search)) return false;
    return true;
  }, [filters]);

  // Stats
  const stats = useMemo(() => {
    let total = 0, emptyDays = 0, busyDays = 0, incomplete = 0, upcoming = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dayVideos = videosByDay[d] || [];
      total += dayVideos.length;
      if (dayVideos.length === 0) emptyDays++;
      if (dayVideos.length >= 3) busyDays++;
      dayVideos.forEach(v => {
        if (!v.productCategory || !v.hasGoal) incomplete++;
        if (d >= daysInMonth - 4 && v.status !== 'published' && v.status !== 'evaluating') upcoming++;
      });
    }
    return [
      { n: total, l: 'أفكار مخططة هذا الشهر', c: G.gold },
      { n: emptyDays, l: 'أيام بلا محتوى', c: G.textMuted },
      { n: busyDays, l: 'أيام مزدحمة (٣ فأكثر)', c: G.red },
      { n: incomplete, l: 'أفكار غير مكتملة', c: '#FF4D6D' },
      { n: upcoming, l: 'مواعيد قريبة غير منجزة', c: '#7A4FC4' },
    ];
  }, [videosByDay, daysInMonth]);

  // Build calendar weeks
  const weeks = useMemo(() => {
    const result = [];
    const startDate = new Date(year, month, 1 - mondayOffset);
    for (let w = 0; w < 6; w++) {
      const weekDays = [];
      let weekVideoCount = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (w * 7 + d));
        const inMonth = date.getMonth() === month && date.getFullYear() === year;
        const dayNum = date.getDate();
        const dayVideos = inMonth ? (videosByDay[dayNum] || []) : [];
        if (inMonth) weekVideoCount += dayVideos.length;
        const isToday = inMonth && dayNum === today;
        weekDays.push({ date, inMonth, dayNum, dayVideos, isToday, monthNum: date.getMonth() });
      }
      const weekStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + w * 7);
      const weekEnd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (w * 7 + 6));
      result.push({ weekDays, weekVideoCount, weekStart, weekEnd });
      
      // Stop if all days in this week are past the current month
      const hasDaysInMonth = weekDays.some(d => d.inMonth);
      if (!hasDaysInMonth && w > 0) {
        result.pop();
        break;
      }
    }
    return result;
  }, [year, month, mondayOffset, videosByDay, today]);

  const openAddPanel = (day) => {
    setAddDay(day);
    setNewVideo({ title: '', contentType: '', productCategory: '', targetAudience: '', assignee: 'أ', status: 'idea', hasGoal: true });
    setPanelMode('add');
  };

  const handleAddVideo = () => {
    if (!newVideo.title?.trim()) return;
    const audience = newVideo.targetAudience || DEFAULT_AUDIENCE_MAP[newVideo.productCategory] || 'جميع المتابعين';
    onAddVideo({
      ...newVideo,
      targetAudience: audience,
      scheduledDate: addDay,
      id: `v-${Date.now()}`
    });
    setPanelMode(null);
  };

  const openVideoDetail = (video) => {
    setSelectedVideo({ ...video });
    setPanelMode('view');
  };

  const handleUpdateVideo = () => {
    if (!selectedVideo) return;
    onUpdateVideo(selectedVideo);
    setPanelMode(null);
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', direction: 'rtl', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        {/* Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onPrevMonth}
            style={{
              width: 34, height: 34, cursor: 'pointer', color: G.gold, fontWeight: 700,
              background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}
            title="الشهر السابق"
          >›</button>
          <h1 style={{ margin: 0, fontSize: 24, color: G.gold }}>{monthLabel}</h1>
          <button
            onClick={onNextMonth}
            style={{
              width: 34, height: 34, cursor: 'pointer', color: G.gold, fontWeight: 700,
              background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}
            title="الشهر التالي"
          >‹</button>
          <button
            onClick={onTodayMonth}
            style={{
              padding: '6px 14px', cursor: 'pointer', background: G.panel,
              border: `1px solid ${G.border}`, borderRadius: 10, color: G.text,
              fontSize: 12, fontWeight: 600, fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
            }}
          >اليوم</button>

          {videos.length === 0 && (
            <button
              onClick={onSeedDemo}
              style={{
                padding: '6px 12px', cursor: 'pointer', background: `${G.gold}18`,
                border: `1px solid ${G.gold}44`, borderRadius: 10, color: G.gold,
                fontSize: 11, fontWeight: 700, fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
              }}
            >⚡ استيراد خطة نموذجية</button>
          )}
        </div>

        {/* View Segment & Search & Add */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', background: G.panel, borderRadius: 10, padding: 3, gap: 2, border: `1px solid ${G.border}`
          }}>
            {[
              { id: 'monthly', label: 'شهري' },
              { id: 'weekly', label: 'أسبوعي' },
              { id: 'daily', label: 'يومي' },
            ].map(m => (
              <span
                key={m.id}
                onClick={() => setViewMode(m.id)}
                style={{
                  padding: '5px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                  background: viewMode === m.id ? G.card : 'transparent',
                  color: viewMode === m.id ? G.gold : G.textMuted,
                  fontWeight: viewMode === m.id ? 700 : 500,
                  transition: 'all 0.15s'
                }}
              >{m.label}</span>
            ))}
          </div>

          <input
            value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })}
            placeholder="ابحث عن فكرة فيديو…"
            style={{
              padding: '8px 14px', width: 200, background: G.panel,
              border: `1px solid ${G.border}`, borderRadius: 10,
              color: G.text, fontSize: 13, outline: 'none',
              fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
            }}
          />
          <button onClick={() => openAddPanel(new Date().getDate())} style={{
            background: G.gold, color: '#003D32', border: 'none', borderRadius: 10,
            padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
          }}>+ فكرة جديدة</button>
          <button onClick={onExportPDF} style={{
            background: `${G.gold}18`, border: `1px solid ${G.gold}55`, borderRadius: 10,
            color: G.gold, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'ThmanyahText', 'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: 6
          }}>
            <span>📄</span>
            <span>تصدير تقرير PDF</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <b style={{ fontSize: 12, color: G.textMuted }}>تصفية:</b>
        {[
          { key: 'type', label: 'نوع المحتوى', options: CONTENT_TYPES_REF.map(t => t[0]) },
          { key: 'cat', label: 'فئة المنتج', options: PRODUCT_CATEGORIES.map(c => c[0]) },
          { key: 'aud', label: 'الفئة المستهدفة', options: AUDIENCES_REF.map(a => a[0]) },
          { key: 'status', label: 'حالة الإنتاج', options: Object.entries(STATUS_MAP).map(([k, v]) => ({ value: k, label: v.label })) },
        ].map(f => (
          <select key={f.key}
            value={filters[f.key]}
            onChange={e => setFilters({ ...filters, [f.key]: e.target.value })}
            style={{
              padding: '6px 10px', fontSize: 12, background: G.panel,
              border: `1px solid ${G.border}`, borderRadius: 8,
              color: G.text, outline: 'none',
              fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
            }}
          >
            <option value="">{f.label}</option>
            {f.options.map(o => typeof o === 'object'
              ? <option key={o.value} value={o.value}>{o.label}</option>
              : <option key={o} value={o}>{o}</option>
            )}
          </select>
        ))}
        <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.incomplete} onChange={e => setFilters({ ...filters, incomplete: e.target.checked })} />
          غير المكتملة فقط
        </label>
        <button onClick={() => setFilters({ type: '', cat: '', aud: '', status: '', incomplete: false, search: '' })} style={{
          background: 'none', border: 'none', color: G.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
        }}>مسح الفلاتر</button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: '12px 14px' }}>
            <b style={{ display: 'block', fontSize: 26, lineHeight: 1.2, color: s.c }}>{s.n}</b>
            <span style={{ fontSize: 12, color: G.textMuted }}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid Container */}
      <div style={{ overflowX: 'auto', borderRadius: 12, border: `1px solid ${G.border}` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '88px repeat(7, minmax(150px, 1fr))',
          gap: 1, background: G.border, minWidth: 1150
        }}>
          {/* Header Row */}
          <div style={{ background: `${G.gold}15`, color: G.gold, fontWeight: 700, fontSize: 12, textAlign: 'center', padding: '10px 0' }}>الأسبوع</div>
          {WEEK_DAYS.map(d => (
            <div key={d} style={{ background: `${G.gold}15`, color: G.gold, fontWeight: 700, fontSize: 12, textAlign: 'center', padding: '10px 0' }}>{d}</div>
          ))}

          {/* Weeks Rows */}
          {weeks.map((week, wi) => (
            <div key={`w-row-${wi}`} style={{ display: 'contents' }}>
              {/* Week Side Label */}
              <div style={{
                background: `${G.gold}08`, padding: '12px 6px', textAlign: 'center',
                display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center',
                fontSize: 13, fontWeight: 700, color: G.gold
              }}>
                الأسبوع {WEEK_LABELS[wi] || (wi + 1)}
                <small style={{ fontWeight: 400, fontSize: 10, color: G.textMuted }}>
                  {week.weekStart.getDate()} {MONTH_NAMES[week.weekStart.getMonth()]} – {week.weekEnd.getDate()} {MONTH_NAMES[week.weekEnd.getMonth()]}
                </small>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 6,
                  background: `${G.gold}18`, color: G.gold
                }}>{week.weekVideoCount} فيديو</span>
              </div>

              {/* Day Cells */}
              {week.weekDays.map((day, di) => {
                const dayLabel = (day.dayNum === 1 || (wi === 0 && di === 0))
                  ? `${day.dayNum} ${MONTH_NAMES[day.monthNum]}`
                  : day.dayNum;

                const isBusy = day.inMonth && day.dayVideos.length >= 3;
                const isEmpty = day.inMonth && day.dayVideos.length === 0;
                const isDragTarget = day.inMonth && dragOverDay === day.dayNum;

                return (
                  <div
                    key={`d-${wi}-${di}`}
                    onDragOver={(e) => {
                      if (day.inMonth) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (dragOverDay !== day.dayNum) {
                          setDragOverDay(day.dayNum);
                        }
                      }
                    }}
                    onDragEnter={(e) => {
                      if (day.inMonth) {
                        e.preventDefault();
                        setDragOverDay(day.dayNum);
                      }
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget) && dragOverDay === day.dayNum) {
                        setDragOverDay(null);
                      }
                    }}
                    onDrop={(e) => {
                      if (day.inMonth) {
                        e.preventDefault();
                        setDragOverDay(null);
                        const vid = e.dataTransfer.getData('text/plain') || draggedVideoId;
                        handleDropOnDay(vid, day.dayNum);
                      }
                    }}
                    style={{
                      background: isDragTarget ? `${G.gold}18` : (day.inMonth ? G.card : G.panel),
                      padding: 8, display: 'flex', flexDirection: 'column', gap: 6,
                      minHeight: 250,
                      outline: isDragTarget
                        ? `2px dashed ${G.gold}`
                        : (day.isToday ? `2px solid ${G.gold}` : 'none'),
                      outlineOffset: -2,
                      boxShadow: isDragTarget ? `inset 0 0 16px ${G.gold}22` : 'none',
                      transition: 'background 0.15s, outline-color 0.15s, box-shadow 0.15s',
                      position: 'relative'
                    }}
                  >
                    {/* Day Header */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      fontWeight: 600, fontSize: 13, minHeight: 24,
                      color: day.inMonth ? G.text : G.textMuted
                    }}>
                      <span>{dayLabel}</span>
                      {day.isToday && (
                        <span style={{
                          background: G.gold, color: '#003D32', borderRadius: 12,
                          padding: '1px 8px', fontSize: 12, fontWeight: 700
                        }}>اليوم</span>
                      )}
                      {isBusy && (
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 6,
                          background: `${G.red}18`, color: G.red
                        }}>{day.dayVideos.length} فيديوهات</span>
                      )}
                      {isEmpty && (
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 6,
                          background: `${G.textMuted}15`, color: G.textMuted
                        }}>يوم فارغ</span>
                      )}
                    </div>

                    {/* Drag & Drop Target Indicator */}
                    {isDragTarget && (
                      <div style={{
                        border: `1px dashed ${G.gold}`,
                        borderRadius: 8,
                        padding: '10px 8px',
                        background: `${G.gold}20`,
                        color: G.gold,
                        fontSize: 11,
                        fontWeight: 700,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}>
                        <span>📥</span>
                        <span>إفلات الفكرة في يوم {day.dayNum}</span>
                      </div>
                    )}

                    {/* Add button for empty days */}
                    {day.inMonth && day.dayVideos.length === 0 && !isDragTarget && (
                      <button onClick={() => openAddPanel(day.dayNum)} style={{
                        border: `1px dashed ${G.border}`, borderRadius: 8, height: 64,
                        display: 'grid', placeItems: 'center', fontSize: 11, color: G.textMuted,
                        cursor: 'pointer', background: 'none',
                        fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                      }}>+ أضف فكرة</button>
                    )}

                    {/* Video cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto', maxHeight: 290 }}>
                      {day.dayVideos.map(v => (
                        <VideoCard
                          key={v.id}
                          video={v}
                          dimmed={!matchFilter(v)}
                          isDragging={draggedVideoId === v.id}
                          onDragStart={(e) => handleDragStart(e, v)}
                          onDragEnd={handleDragEnd}
                          onClick={() => openVideoDetail(v)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Production Status Legend */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', fontSize: 11, color: G.textMuted }}>
        <b>حالة الإنتاج:</b>
        {Object.entries(STATUS_MAP).map(([key, val]) => (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {val.label}
            <i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: val.color }} />
          </span>
        ))}
      </div>

      {/* Side Panel - View & Edit Video Idea */}
      <SidePanel open={panelMode === 'view'} onClose={() => setPanelMode(null)}>
        {selectedVideo && (
          <>
            <h2 style={{ margin: 0, fontSize: 18, color: G.gold }}>{selectedVideo.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 12px', fontSize: 13 }}>
              <span style={{ color: G.textMuted }}>نوع المحتوى</span>
              <span style={{ fontWeight: 600 }}>{selectedVideo.contentType || '—'}</span>
              <span style={{ color: G.textMuted }}>فئة المنتج</span>
              <span style={{ fontWeight: 600 }}>{selectedVideo.productCategory || '— غير محددة'}</span>
              <span style={{ color: G.textMuted }}>الفئة المستهدفة</span>
              <span style={{ fontWeight: 600 }}>{selectedVideo.targetAudience || '—'}</span>
              <span style={{ color: G.textMuted }}>المسؤول</span>
              <span style={{ fontWeight: 600 }}>{selectedVideo.assignee || 'أ'}</span>
              <span style={{ color: G.textMuted }}>اليوم في الشهر</span>
              <span style={{ fontWeight: 600 }}>{selectedVideo.scheduledDate || '—'}</span>
            </div>

            <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              حالة الإنتاج
              <select
                value={selectedVideo.status}
                onChange={e => setSelectedVideo({ ...selectedVideo, status: e.target.value })}
                style={{
                  width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                  borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}
              >
                {Object.entries(STATUS_MAP).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </label>

            <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              العنوان
              <input
                value={selectedVideo.title}
                onChange={e => setSelectedVideo({ ...selectedVideo, title: e.target.value })}
                style={{
                  width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                  borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}
              />
            </label>

            <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              نوع المحتوى
              <select
                value={selectedVideo.contentType || ''}
                onChange={e => setSelectedVideo({ ...selectedVideo, contentType: e.target.value })}
                style={{
                  width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                  borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}
              >
                <option value="">اختر نوع المحتوى</option>
                {CONTENT_TYPES_REF.map(t => <option key={t[0]} value={t[0]}>{t[0]}</option>)}
              </select>
            </label>

            <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              فئة المنتج
              <select
                value={selectedVideo.productCategory || ''}
                onChange={e => setSelectedVideo({ ...selectedVideo, productCategory: e.target.value })}
                style={{
                  width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                  borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}
              >
                <option value="">اختر فئة المنتج</option>
                {PRODUCT_CATEGORIES.map(c => <option key={c[0]} value={c[0]}>{c[0]}</option>)}
              </select>
            </label>

            <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              الفئة المستهدفة
              <select
                value={selectedVideo.targetAudience || ''}
                onChange={e => setSelectedVideo({ ...selectedVideo, targetAudience: e.target.value })}
                style={{
                  width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                  borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}
              >
                <option value="">اختر الفئة المستهدفة</option>
                {AUDIENCES_REF.map(a => <option key={a[0]} value={a[0]}>{a[0]}</option>)}
              </select>
            </label>

            <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              المسؤول
              <input
                value={selectedVideo.assignee || ''}
                onChange={e => setSelectedVideo({ ...selectedVideo, assignee: e.target.value })}
                style={{
                  width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                  borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}
              />
            </label>

            <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
              ملاحظات
              <textarea
                value={selectedVideo.notes || ''}
                onChange={e => setSelectedVideo({ ...selectedVideo, notes: e.target.value })}
                rows={3}
                style={{
                  width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                  borderRadius: 8, color: G.text, fontSize: 13, outline: 'none', resize: 'vertical',
                  fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
                }}
              />
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={handleUpdateVideo} style={{
                flex: 1, background: G.gold, color: '#003D32', border: 'none', borderRadius: 10,
                padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
              }}>حفظ التعديلات</button>
              <button onClick={() => { onDeleteVideo(selectedVideo.id); setPanelMode(null); }} style={{
                background: `${G.red}18`, border: `1px solid ${G.red}33`, borderRadius: 10,
                color: G.red, fontSize: 13, fontWeight: 700, padding: '10px 16px', cursor: 'pointer',
                fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
              }}>حذف</button>
            </div>
          </>
        )}
      </SidePanel>

      {/* Side Panel - Add Video Idea */}
      <SidePanel open={panelMode === 'add'} onClose={() => setPanelMode(null)}>
        <h2 style={{ margin: 0, fontSize: 18, color: G.gold }}>فكرة فيديو جديدة — يوم {addDay}</h2>

        <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
          عنوان الفيديو *
          <input
            value={newVideo.title || ''} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
            placeholder="مثال: مقارنة بين نوعين من الأقلام"
            style={{
              width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
              borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
              fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
            }}
          />
        </label>

        <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
          نوع المحتوى
          <select value={newVideo.contentType || ''} onChange={e => setNewVideo({ ...newVideo, contentType: e.target.value })}
            style={{ width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8, color: G.text, fontSize: 13, outline: 'none', fontFamily: "'ThmanyahText', 'Cairo', sans-serif" }}>
            <option value="">اختر نوع المحتوى</option>
            {CONTENT_TYPES_REF.map(t => <option key={t[0]} value={t[0]}>{t[0]}</option>)}
          </select>
        </label>

        <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
          فئة المنتج
          <select value={newVideo.productCategory || ''} onChange={e => setNewVideo({ ...newVideo, productCategory: e.target.value })}
            style={{ width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8, color: G.text, fontSize: 13, outline: 'none', fontFamily: "'ThmanyahText', 'Cairo', sans-serif" }}>
            <option value="">اختر فئة المنتج</option>
            {PRODUCT_CATEGORIES.map(c => <option key={c[0]} value={c[0]}>{c[0]}</option>)}
          </select>
        </label>

        <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
          الفئة المستهدفة
          <select value={newVideo.targetAudience || ''} onChange={e => setNewVideo({ ...newVideo, targetAudience: e.target.value })}
            style={{ width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8, color: G.text, fontSize: 13, outline: 'none', fontFamily: "'ThmanyahText', 'Cairo', sans-serif" }}>
            <option value="">اختر الفئة المستهدفة (تلقائي بحسب المنتج)</option>
            {AUDIENCES_REF.map(a => <option key={a[0]} value={a[0]}>{a[0]}</option>)}
          </select>
        </label>

        <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
          المسؤول
          <input value={newVideo.assignee || 'أ'} onChange={e => setNewVideo({ ...newVideo, assignee: e.target.value })}
            style={{ width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8, color: G.text, fontSize: 13, outline: 'none', fontFamily: "'ThmanyahText', 'Cairo', sans-serif" }}
          />
        </label>

        <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
          ملاحظات
          <textarea
            value={newVideo.notes || ''} onChange={e => setNewVideo({ ...newVideo, notes: e.target.value })}
            rows={2} placeholder="أي تفاصيل أو أفكار إضافية..."
            style={{
              width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
              borderRadius: 8, color: G.text, fontSize: 13, outline: 'none', resize: 'vertical',
              fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
            }}
          />
        </label>

        <button onClick={handleAddVideo} style={{
          background: G.gold, color: '#003D32', border: 'none', borderRadius: 10,
          padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'ThmanyahText', 'Cairo', sans-serif", marginTop: 8
        }}>إضافة الفكرة</button>
      </SidePanel>

      {/* Floating Toast Notification with Undo */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0B1710',
          border: `1px solid ${G.gold}`,
          borderRadius: 12,
          padding: '12px 20px',
          color: G.text,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          fontFamily: "'ThmanyahText', 'Cairo', sans-serif",
          fontSize: 13,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span style={{ color: G.gold, fontSize: 16 }}>✓</span>
          <span>{toast.msg}</span>
          {toast.undo && (
            <button
              onClick={() => {
                toast.undo();
                setToast(null);
              }}
              style={{
                background: `${G.gold}25`,
                border: `1px solid ${G.gold}66`,
                color: G.gold,
                padding: '4px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
              }}
            >تراجع</button>
          )}
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              color: G.textMuted,
              cursor: 'pointer',
              fontSize: 16,
              padding: 0,
              lineHeight: 1
            }}
          >×</button>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN EXPORT: ContentPlanningPanel
// ============================================

export default function ContentPlanningPanel({ apiUrl, currentUser }) {
  const [view, setView] = useState('plan');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9); // 9 = October (0-indexed)
  const [videos, setVideos] = useState([]);
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoDetail, setSelectedVideoDetail] = useState(null);

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;
  
  const currentDate = new Date();
  const isCurrentMonth = currentDate.getMonth() === month && currentDate.getFullYear() === year;
  const today = isCurrentMonth ? currentDate.getDate() : -1;

  // Month Navigation Handlers
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
  };

  const handleTodayMonth = () => {
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth());
  };

  // Load data for current monthKey
  const loadPlan = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/content-plan/${monthKey}`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setVideos(data.data.videos || []);
        setEvents(data.data.events || []);
        setCampaigns(data.data.campaigns || []);
      } else {
        setVideos([]);
        setEvents([]);
        setCampaigns([]);
      }
    } catch (e) {
      console.error('Failed to load content plan:', e);
      setVideos([]);
      setEvents([]);
      setCampaigns([]);
    }
    setLoading(false);
  }, [apiUrl, monthKey]);

  useEffect(() => { loadPlan(); }, [loadPlan]);

  // Seed demo data for October 2026 or any empty month
  const seedDemoPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/content-plan/${monthKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({
          videos: SAMPLE_OCTOBER_DEMO_VIDEOS,
          events: [],
          campaigns: []
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setVideos(data.data.videos || []);
        setEvents(data.data.events || []);
        setCampaigns(data.data.campaigns || []);
      }
    } catch (e) {
      console.error('Failed to seed demo plan:', e);
    }
  };

  // Video CRUD
  const addVideo = async (video) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/content-plan/${monthKey}/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(video)
      });
      const data = await res.json();
      if (data.success) {
        setVideos(data.data.videos || []);
      }
    } catch (e) {
      console.error('Failed to add video:', e);
    }
  };

  const updateVideo = async (video) => {
    // Optimistic update for instant UI response (0ms drag-and-drop latency)
    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, ...video } : v));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/content-plan/${monthKey}/video/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(video)
      });
      const data = await res.json();
      if (data.success && data.data?.videos) {
        setVideos(data.data.videos);
      }
    } catch (e) {
      console.error('Failed to update video:', e);
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/content-plan/${monthKey}/video/${videoId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (data.success) {
        setVideos(data.data.videos || []);
      }
    } catch (e) {
      console.error('Failed to delete video:', e);
    }
  };

  // Event CRUD
  const addEvent = async (event) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/content-plan/${monthKey}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ ...event, id: `e-${Date.now()}` })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.data.events || []);
      }
    } catch (e) {
      console.error('Failed to add event:', e);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/content-plan/${monthKey}/event/${eventId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.data.events || []);
      }
    } catch (e) {
      console.error('Failed to delete event:', e);
    }
  };

  // Campaign CRUD
  const addCampaign = async (campaign) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/content-plan/${monthKey}/campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ ...campaign, id: `c-${Date.now()}` })
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data.campaigns || []);
      }
    } catch (e) {
      console.error('Failed to add campaign:', e);
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/content-plan/${monthKey}/campaign/${campaignId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data.campaigns || []);
      }
    } catch (e) {
      console.error('Failed to delete campaign:', e);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 400, color: G.gold, fontSize: 16, fontWeight: 700,
        fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 32, animation: 'spin 2s linear infinite' }}>♛</div>
          <span>جاري تحميل خطة المحتوى...</span>
        </div>
      </div>
    );
  }

  const handleExportPDF = () => {
    generateContentPlanningReport(monthLabel, videos, events, campaigns);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 180px)', direction: 'rtl', background: G.bg }}>
      {/* Internal Navigation Sidebar */}
      <PlanNav view={view} setView={setView} monthLabel={monthLabel} onExportPDF={handleExportPDF} />

      {/* Main Content Area */}
      {view === 'plan' && (
        <PlanView
          year={year} month={month}
          videos={videos} today={today}
          onAddVideo={addVideo}
          onUpdateVideo={updateVideo}
          onDeleteVideo={deleteVideo}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onTodayMonth={handleTodayMonth}
          onSeedDemo={seedDemoPlan}
          onExportPDF={handleExportPDF}
        />
      )}

      {['types', 'goals', 'cats', 'aud'].includes(view) && (
        <LibraryView kind={view} videos={videos} />
      )}

      {view === 'events' && (
        <VariableView
          kind="events" items={events}
          onAdd={addEvent} onDelete={deleteEvent}
          monthLabel={monthLabel}
        />
      )}

      {view === 'camps' && (
        <VariableView
          kind="campaigns" items={campaigns}
          onAdd={addCampaign} onDelete={deleteCampaign}
          monthLabel={monthLabel}
        />
      )}

      {view === 'pipe' && (
        <PipelineView
          videos={videos}
          onUpdateVideo={updateVideo}
          onOpenDetail={(v) => {
            setSelectedVideoDetail(v);
          }}
        />
      )}

      {/* Pipeline Quick Detail Side Panel */}
      {selectedVideoDetail && (
        <SidePanel open={true} onClose={() => setSelectedVideoDetail(null)}>
          <h2 style={{ margin: 0, fontSize: 18, color: G.gold }}>{selectedVideoDetail.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 12px', fontSize: 13 }}>
            <span style={{ color: G.textMuted }}>نوع المحتوى</span>
            <span style={{ fontWeight: 600 }}>{selectedVideoDetail.contentType || '—'}</span>
            <span style={{ color: G.textMuted }}>فئة المنتج</span>
            <span style={{ fontWeight: 600 }}>{selectedVideoDetail.productCategory || '—'}</span>
            <span style={{ color: G.textMuted }}>المسؤول</span>
            <span style={{ fontWeight: 600 }}>{selectedVideoDetail.assignee || 'أ'}</span>
            <span style={{ color: G.textMuted }}>اليوم</span>
            <span style={{ fontWeight: 600 }}>{selectedVideoDetail.scheduledDate || '—'}</span>
          </div>

          <label style={{ fontSize: 12, color: G.textMuted, display: 'flex', flexDirection: 'column', gap: 4 }}>
            نقل إلى مرحلة
            <select
              value={selectedVideoDetail.status || 'idea'}
              onChange={e => {
                const updated = { ...selectedVideoDetail, status: e.target.value };
                setSelectedVideoDetail(updated);
                updateVideo(updated);
              }}
              style={{
                width: '100%', padding: 8, background: G.panel, border: `1px solid ${G.border}`,
                borderRadius: 8, color: G.text, fontSize: 13, outline: 'none',
                fontFamily: "'ThmanyahText', 'Cairo', sans-serif"
              }}
            >
              {Object.entries(STATUS_MAP).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </label>

          <button
            onClick={() => {
              deleteVideo(selectedVideoDetail.id);
              setSelectedVideoDetail(null);
            }}
            style={{
              background: `${G.red}18`, border: `1px solid ${G.red}33`, borderRadius: 10,
              color: G.red, fontSize: 13, fontWeight: 700, padding: '10px 16px', cursor: 'pointer',
              fontFamily: "'ThmanyahText', 'Cairo', sans-serif", marginTop: 8
            }}
          >حذف الفكرة</button>
        </SidePanel>
      )}
    </div>
  );
}
