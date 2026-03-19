export interface Question {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  options: string[];
  correct_answer: string;
  duration_seconds: number;
}

// A representative subset of the 300 questions provided.
export const quizQuestions: Question[] = [
  { id: 1, category: "سيرة", difficulty: "سهل", question: "ما هي الحشرة التي كلمت سليمان عليه السلام؟", options: ["النحلة", "النملة", "البعوضة", "الفراشة"], correct_answer: "النملة", duration_seconds: 10 },
  { id: 2, category: "قرآن", difficulty: "سهل", question: "كم عدد سور القرآن الكريم؟", options: ["110", "112", "114", "116"], correct_answer: "114", duration_seconds: 10 },
  { id: 3, category: "تاريخ", difficulty: "متوسط", question: "من هو القائد الذي فتح الأندلس؟", options: ["عقبة بن نافع", "طارق بن زياد", "قتيبة بن مسلم", "صلاح الدين الأيوبي"], correct_answer: "طارق بن زياد", duration_seconds: 10 },
  { id: 4, category: "سيرة", difficulty: "متوسط", question: "في أي سنة للهجرة توفي النبي صلى الله عليه وسلم؟", options: ["10 هـ", "11 هـ", "12 هـ", "13 هـ"], correct_answer: "11 هـ", duration_seconds: 10 },
  { id: 5, category: "قرآن", difficulty: "صعب", question: "ما هي السورة التي بدأت باسم ثمرتين؟", options: ["سورة الرمان", "سورة التين", "سورة الزيتون", "سورة العنب"], correct_answer: "سورة التين", duration_seconds: 10 },
  { id: 6, category: "تاريخ", difficulty: "صعب جداً", question: "من هو الملك الذي حاول هدم الكعبة قبل الإسلام؟", options: ["النمرود", "أبرهة الحبشي", "فرعون", "شداد بن عاد"], correct_answer: "أبرهة الحبشي", duration_seconds: 10 },
  { id: 7, category: "سيرة", difficulty: "سهل", question: "ما هو اسم ناقة النبي صلى الله عليه وسلم التي هاجر عليها؟", options: ["القصواء", "العضباء", "الوجناء", "الشهباء"], correct_answer: "القصواء", duration_seconds: 10 },
  { id: 8, category: "قرآن", difficulty: "سهل", question: "ما هي السورة التي تُسمى 'عروس القرآن'؟", options: ["يس", "الرحمن", "الواقعة", "الملك"], correct_answer: "الرحمن", duration_seconds: 10 },
  { id: 9, category: "تاريخ", difficulty: "سهل", question: "من هو أول الخلفاء الراشدين؟", options: ["عمر بن الخطاب", "علي بن أبي طالب", "أبو بكر الصديق", "عثمان بن عفان"], correct_answer: "أبو بكر الصديق", duration_seconds: 10 },
  { id: 10, category: "قرآن", difficulty: "سهل", question: "كم عدد أجزاء القرآن الكريم؟", options: ["20 جزءاً", "30 جزءاً", "40 جزءاً", "60 جزءاً"], correct_answer: "30 جزءاً", duration_seconds: 10 },
  { id: 11, category: "سيرة", difficulty: "سهل", question: "في أي شهر وُلد النبي صلى الله عليه وسلم؟", options: ["رمضان", "شوال", "ربيع الأول", "رجب"], correct_answer: "ربيع الأول", duration_seconds: 10 },
  { id: 12, category: "تاريخ", difficulty: "متوسط", question: "من هو القائد الذي انتصر في معركة حطين؟", options: ["سيف الدين قطز", "صلاح الدين الأيوبي", "نور الدين زنكي", "عمر المختار"], correct_answer: "صلاح الدين الأيوبي", duration_seconds: 10 },
  { id: 13, category: "قرآن", difficulty: "متوسط", question: "ما هي السورة التي لا تبدأ بـ 'بسم الله الرحمن الرحيم'؟", options: ["سورة النمل", "سورة التوبة", "سورة هود", "سورة يونس"], correct_answer: "سورة التوبة", duration_seconds: 10 },
  { id: 14, category: "سيرة", difficulty: "متوسط", question: "كم كان عمر النبي صلى الله عليه وسلم عند وفاة أمه؟", options: ["4 سنوات", "6 سنوات", "8 سنوات", "10 سنوات"], correct_answer: "6 سنوات", duration_seconds: 10 },
  { id: 15, category: "تاريخ", difficulty: "متوسط", question: "ما هي عاصمة الدولة الأموية؟", options: ["بغداد", "القاهرة", "دمشق", "مكة المكرمة"], correct_answer: "دمشق", duration_seconds: 10 },
  { id: 16, category: "قرآن", difficulty: "متوسط", question: "سورة في القرآن تُسمى 'المنجية'، ما هي؟", options: ["سورة يس", "سورة الملك", "سورة الكهف", "سورة الدخان"], correct_answer: "سورة الملك", duration_seconds: 10 },
  { id: 17, category: "تاريخ", difficulty: "متوسط", question: "من هو الصحابي الذي لُقب بـ 'أمين هذه الأمة'؟", options: ["أبو عبيدة بن الجراح", "خالد بن الوليد", "عبد الرحمن بن عوف", "سعد بن معاذ"], correct_answer: "أبو عبيدة بن الجراح", duration_seconds: 10 },
  { id: 18, category: "سيرة", difficulty: "متوسط", question: "من هو الصحابي الذي رافق النبي في الهجرة؟", options: ["عمر بن الخطاب", "علي بن أبي طالب", "أبو بكر الصديق", "عثمان بن عفان"], correct_answer: "أبو بكر الصديق", duration_seconds: 10 },
  { id: 19, category: "قرآن", difficulty: "صعب", question: "ما هي السورة التي ذكرت فيها 'البسملة' مرتين؟", options: ["سورة الفاتحة", "سورة النمل", "سورة البقرة", "سورة النحل"], correct_answer: "سورة النمل", duration_seconds: 10 },
  { id: 20, category: "تاريخ", difficulty: "صعب", question: "من هو مؤسس الدولة العباسية؟", options: ["هارون الرشيد", "أبو العباس السفاح", "المنصور", "المأمون"], correct_answer: "أبو العباس السفاح", duration_seconds: 10 },
  { id: 21, category: "قرآن", difficulty: "سهل", question: "ما هي السورة التي تعدل ثلث القرآن؟", options: ["سورة الفاتحة", "سورة الإخلاص", "سورة الكافرون", "سورة يس"], correct_answer: "سورة الإخلاص", duration_seconds: 10 },
  { id: 22, category: "سيرة", difficulty: "سهل", question: "من هو مرضعة النبي صلى الله عليه وسلم؟", options: ["ثويبة", "حليمة السعدية", "أم أيمن", "كل ما سبق صحيح"], correct_answer: "كل ما سبق صحيح", duration_seconds: 10 },
  { id: 23, category: "قرآن", difficulty: "متوسط", question: "ما هي السورة التي تسمى 'سورة بني إسرائيل'؟", options: ["سورة البقرة", "سورة الإسراء", "سورة القصص", "سورة يوسف"], correct_answer: "سورة الإسراء", duration_seconds: 10 },
  { id: 24, category: "تاريخ", difficulty: "صعب", question: "من هو القائد المسلم الذي لُقب بـ 'سيف الله المسلول'؟", options: ["خالد بن الوليد", "علي بن أبي طالب", "حمزة بن عبد المطلب", "الزبير بن العوام"], correct_answer: "خالد بن الوليد", duration_seconds: 10 },
  { id: 25, category: "فقه", difficulty: "صعب", question: "ما هو الركن الأعظم في الحج؟", options: ["طواف الإفاضة", "الوقوف بعرفة", "الإحرام", "السعي بين الصفا والمروة"], correct_answer: "الوقوف بعرفة", duration_seconds: 10 },
];
