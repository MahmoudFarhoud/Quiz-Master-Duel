export interface Question {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  options: string[];
  correct_answer: string;
  duration_seconds: number;
}

export const quizQuestions: Question[] = [
  // ── قرآن كريم ──
  { id: 1, category: "قرآن", difficulty: "سهل", question: "كم عدد سور القرآن الكريم؟", options: ["110", "112", "114", "116"], correct_answer: "114", duration_seconds: 10 },
  { id: 2, category: "قرآن", difficulty: "سهل", question: "كم عدد أجزاء القرآن الكريم؟", options: ["20 جزءاً", "30 جزءاً", "40 جزءاً", "60 جزءاً"], correct_answer: "30 جزءاً", duration_seconds: 10 },
  { id: 3, category: "قرآن", difficulty: "سهل", question: "ما هي السورة التي تعدل ثلث القرآن؟", options: ["سورة الفاتحة", "سورة الإخلاص", "سورة الكافرون", "سورة يس"], correct_answer: "سورة الإخلاص", duration_seconds: 10 },
  { id: 4, category: "قرآن", difficulty: "سهل", question: "ما هي السورة التي تُسمى 'فاتحة الكتاب'؟", options: ["البقرة", "الفاتحة", "آل عمران", "النساء"], correct_answer: "الفاتحة", duration_seconds: 10 },
  { id: 5, category: "قرآن", difficulty: "سهل", question: "ما هي أطول سورة في القرآن الكريم؟", options: ["آل عمران", "النساء", "البقرة", "المائدة"], correct_answer: "البقرة", duration_seconds: 10 },
  { id: 6, category: "قرآن", difficulty: "سهل", question: "ما هي أقصر سورة في القرآن الكريم؟", options: ["الناس", "الفلق", "الكوثر", "الإخلاص"], correct_answer: "الكوثر", duration_seconds: 10 },
  { id: 7, category: "قرآن", difficulty: "سهل", question: "ما هي السورة التي تُسمى 'عروس القرآن'؟", options: ["يس", "الرحمن", "الواقعة", "الملك"], correct_answer: "الرحمن", duration_seconds: 10 },
  { id: 8, category: "قرآن", difficulty: "سهل", question: "ما هي أول كلمة نزلت من القرآن الكريم؟", options: ["بسم الله", "الحمد لله", "اقرأ", "قل"], correct_answer: "اقرأ", duration_seconds: 10 },
  { id: 9, category: "قرآن", difficulty: "متوسط", question: "ما هي السورة التي لا تبدأ بـ 'بسم الله الرحمن الرحيم'؟", options: ["سورة النمل", "سورة التوبة", "سورة هود", "سورة يونس"], correct_answer: "سورة التوبة", duration_seconds: 10 },
  { id: 10, category: "قرآن", difficulty: "متوسط", question: "سورة في القرآن تُسمى 'المنجية'، ما هي؟", options: ["سورة يس", "سورة الملك", "سورة الكهف", "سورة الدخان"], correct_answer: "سورة الملك", duration_seconds: 10 },
  { id: 11, category: "قرآن", difficulty: "متوسط", question: "ما هي السورة التي تسمى 'سورة بني إسرائيل'؟", options: ["سورة البقرة", "سورة الإسراء", "سورة القصص", "سورة يوسف"], correct_answer: "سورة الإسراء", duration_seconds: 10 },
  { id: 12, category: "قرآن", difficulty: "متوسط", question: "كم عدد الأنبياء المذكورين في القرآن الكريم؟", options: ["18 نبياً", "25 نبياً", "30 نبياً", "40 نبياً"], correct_answer: "25 نبياً", duration_seconds: 10 },
  { id: 13, category: "قرآن", difficulty: "متوسط", question: "ما هي السورة الوحيدة التي ذُكر فيها اسم امرأة بالاسم الصريح؟", options: ["سورة فاطمة", "سورة مريم", "سورة خديجة", "سورة آسيا"], correct_answer: "سورة مريم", duration_seconds: 10 },
  { id: 14, category: "قرآن", difficulty: "متوسط", question: "في أي سورة ذُكرت قصة أصحاب الفيل؟", options: ["سورة قريش", "سورة الفيل", "سورة الماعون", "سورة الكوثر"], correct_answer: "سورة الفيل", duration_seconds: 10 },
  { id: 15, category: "قرآن", difficulty: "صعب", question: "ما هي السورة التي بدأت باسم ثمرتين؟", options: ["سورة الرمان", "سورة التين", "سورة الزيتون", "سورة العنب"], correct_answer: "سورة التين", duration_seconds: 10 },
  { id: 16, category: "قرآن", difficulty: "صعب", question: "ما هي السورة التي ذكرت فيها 'البسملة' مرتين؟", options: ["سورة الفاتحة", "سورة النمل", "سورة البقرة", "سورة النحل"], correct_answer: "سورة النمل", duration_seconds: 10 },
  { id: 17, category: "قرآن", difficulty: "صعب", question: "ما هي السورة التي تحتوي على آية الكرسي؟", options: ["آل عمران", "النساء", "البقرة", "المائدة"], correct_answer: "البقرة", duration_seconds: 10 },
  { id: 18, category: "قرآن", difficulty: "صعب", question: "كم مرة ذُكر اسم النبي محمد صلى الله عليه وسلم في القرآن الكريم؟", options: ["مرتان", "3 مرات", "4 مرات", "5 مرات"], correct_answer: "4 مرات", duration_seconds: 10 },
  { id: 19, category: "قرآن", difficulty: "صعب", question: "ما هي السورة التي نزلت بسبب عبس النبي في وجه ابن أم مكتوم؟", options: ["سورة عبس", "سورة الضحى", "سورة التكوير", "سورة الانفطار"], correct_answer: "سورة عبس", duration_seconds: 10 },
  { id: 20, category: "قرآن", difficulty: "صعب", question: "ما عدد آيات سورة البقرة؟", options: ["280 آية", "285 آية", "286 آية", "290 آية"], correct_answer: "286 آية", duration_seconds: 10 },
  { id: 21, category: "قرآن", difficulty: "صعب", question: "ما هي السورة المدنية الوحيدة في جزء عم؟", options: ["سورة النبأ", "سورة البيّنة", "سورة النصر", "سورة الزلزلة"], correct_answer: "سورة البيّنة", duration_seconds: 10 },
  { id: 22, category: "قرآن", difficulty: "صعب جداً", question: "كم عدد الحروف المقطعة في أوائل السور؟", options: ["12 حرفاً", "14 حرفاً", "16 حرفاً", "18 حرفاً"], correct_answer: "14 حرفاً", duration_seconds: 10 },
  { id: 23, category: "قرآن", difficulty: "صعب جداً", question: "ما هي السورة التي تبدأ بـ 'كهيعص'؟", options: ["سورة يوسف", "سورة مريم", "سورة طه", "سورة الأنبياء"], correct_answer: "سورة مريم", duration_seconds: 10 },

  // ── سيرة نبوية ──
  { id: 30, category: "سيرة", difficulty: "سهل", question: "ما هي الحشرة التي كلمت سليمان عليه السلام؟", options: ["النحلة", "النملة", "البعوضة", "الفراشة"], correct_answer: "النملة", duration_seconds: 10 },
  { id: 31, category: "سيرة", difficulty: "سهل", question: "في أي شهر وُلد النبي صلى الله عليه وسلم؟", options: ["رمضان", "شوال", "ربيع الأول", "رجب"], correct_answer: "ربيع الأول", duration_seconds: 10 },
  { id: 32, category: "سيرة", difficulty: "سهل", question: "ما هو اسم ناقة النبي صلى الله عليه وسلم التي هاجر عليها؟", options: ["القصواء", "العضباء", "الوجناء", "الشهباء"], correct_answer: "القصواء", duration_seconds: 10 },
  { id: 33, category: "سيرة", difficulty: "سهل", question: "من هو الصحابي الذي رافق النبي في الهجرة؟", options: ["عمر بن الخطاب", "علي بن أبي طالب", "أبو بكر الصديق", "عثمان بن عفان"], correct_answer: "أبو بكر الصديق", duration_seconds: 10 },
  { id: 34, category: "سيرة", difficulty: "سهل", question: "ما اسم زوجة النبي الأولى؟", options: ["عائشة", "حفصة", "خديجة", "ميمونة"], correct_answer: "خديجة", duration_seconds: 10 },
  { id: 35, category: "سيرة", difficulty: "سهل", question: "كم كان عمر النبي صلى الله عليه وسلم عند وفاته؟", options: ["55 سنة", "60 سنة", "63 سنة", "65 سنة"], correct_answer: "63 سنة", duration_seconds: 10 },
  { id: 36, category: "سيرة", difficulty: "سهل", question: "من هو مرضعة النبي صلى الله عليه وسلم الشهيرة؟", options: ["ثويبة", "حليمة السعدية", "أم أيمن", "سيدة أخرى"], correct_answer: "حليمة السعدية", duration_seconds: 10 },
  { id: 37, category: "سيرة", difficulty: "متوسط", question: "في أي سنة للهجرة توفي النبي صلى الله عليه وسلم؟", options: ["10 هـ", "11 هـ", "12 هـ", "13 هـ"], correct_answer: "11 هـ", duration_seconds: 10 },
  { id: 38, category: "سيرة", difficulty: "متوسط", question: "كم كان عمر النبي صلى الله عليه وسلم عند وفاة أمه؟", options: ["4 سنوات", "6 سنوات", "8 سنوات", "10 سنوات"], correct_answer: "6 سنوات", duration_seconds: 10 },
  { id: 39, category: "سيرة", difficulty: "متوسط", question: "في أي جبل بدأ نزول الوحي؟", options: ["جبل عرفات", "جبل النور", "جبل ثور", "جبل أبي قبيس"], correct_answer: "جبل النور", duration_seconds: 10 },
  { id: 40, category: "سيرة", difficulty: "متوسط", question: "ما هو الغار الذي لجأ إليه النبي وأبو بكر أثناء الهجرة؟", options: ["غار حراء", "غار ثور", "غار الأرقم", "غار المدينة"], correct_answer: "غار ثور", duration_seconds: 10 },
  { id: 41, category: "سيرة", difficulty: "متوسط", question: "ما هو اسم أبي النبي محمد صلى الله عليه وسلم؟", options: ["عبد المطلب", "عبد الله", "أبو طالب", "حمزة"], correct_answer: "عبد الله", duration_seconds: 10 },
  { id: 42, category: "سيرة", difficulty: "متوسط", question: "كم عدد أبناء النبي الذكور الذين عاشوا؟", options: ["صفر", "واحد", "اثنان", "ثلاثة"], correct_answer: "صفر", duration_seconds: 10 },
  { id: 43, category: "سيرة", difficulty: "صعب", question: "ما هو اسم الصحابي الذي نزل فيه القرآن بالاسم الصريح؟", options: ["أبو بكر", "عمر", "زيد بن حارثة", "عثمان"], correct_answer: "زيد بن حارثة", duration_seconds: 10 },
  { id: 44, category: "سيرة", difficulty: "صعب", question: "ما هو اسم الكاتب الذي كان يكتب الوحي للنبي؟", options: ["معاوية بن أبي سفيان", "زيد بن ثابت", "كلاهما صحيح", "عبد الله بن مسعود"], correct_answer: "كلاهما صحيح", duration_seconds: 10 },
  { id: 45, category: "سيرة", difficulty: "صعب", question: "كم سنة استغرق نزول القرآن الكريم؟", options: ["20 سنة", "23 سنة", "25 سنة", "30 سنة"], correct_answer: "23 سنة", duration_seconds: 10 },
  { id: 46, category: "سيرة", difficulty: "صعب", question: "ما اسم ابنة النبي التي تُلقب بـ 'سيدة نساء العالمين'؟", options: ["زينب", "رقية", "فاطمة", "أم كلثوم"], correct_answer: "فاطمة", duration_seconds: 10 },

  // ── تاريخ إسلامي ──
  { id: 60, category: "تاريخ", difficulty: "سهل", question: "من هو أول الخلفاء الراشدين؟", options: ["عمر بن الخطاب", "علي بن أبي طالب", "أبو بكر الصديق", "عثمان بن عفان"], correct_answer: "أبو بكر الصديق", duration_seconds: 10 },
  { id: 61, category: "تاريخ", difficulty: "سهل", question: "من هو القائد الذي فتح الأندلس؟", options: ["عقبة بن نافع", "طارق بن زياد", "قتيبة بن مسلم", "صلاح الدين الأيوبي"], correct_answer: "طارق بن زياد", duration_seconds: 10 },
  { id: 62, category: "تاريخ", difficulty: "سهل", question: "من هو القائد الذي انتصر في معركة حطين؟", options: ["سيف الدين قطز", "صلاح الدين الأيوبي", "نور الدين زنكي", "عمر المختار"], correct_answer: "صلاح الدين الأيوبي", duration_seconds: 10 },
  { id: 63, category: "تاريخ", difficulty: "سهل", question: "ما هي عاصمة الدولة الأموية؟", options: ["بغداد", "القاهرة", "دمشق", "مكة المكرمة"], correct_answer: "دمشق", duration_seconds: 10 },
  { id: 64, category: "تاريخ", difficulty: "سهل", question: "من هو الملك الذي حاول هدم الكعبة قبل الإسلام؟", options: ["النمرود", "أبرهة الحبشي", "فرعون", "شداد بن عاد"], correct_answer: "أبرهة الحبشي", duration_seconds: 10 },
  { id: 65, category: "تاريخ", difficulty: "متوسط", question: "من هو الصحابي الذي لُقب بـ 'أمين هذه الأمة'؟", options: ["أبو عبيدة بن الجراح", "خالد بن الوليد", "عبد الرحمن بن عوف", "سعد بن معاذ"], correct_answer: "أبو عبيدة بن الجراح", duration_seconds: 10 },
  { id: 66, category: "تاريخ", difficulty: "متوسط", question: "من هو القائد المسلم الذي لُقب بـ 'سيف الله المسلول'؟", options: ["خالد بن الوليد", "علي بن أبي طالب", "حمزة بن عبد المطلب", "الزبير بن العوام"], correct_answer: "خالد بن الوليد", duration_seconds: 10 },
  { id: 67, category: "تاريخ", difficulty: "متوسط", question: "من هو مؤسس الدولة العباسية؟", options: ["هارون الرشيد", "أبو العباس السفاح", "المنصور", "المأمون"], correct_answer: "أبو العباس السفاح", duration_seconds: 10 },
  { id: 68, category: "تاريخ", difficulty: "متوسط", question: "في أي عام فُتحت القسطنطينية على يد السلطان محمد الفاتح؟", options: ["1389م", "1453م", "1492م", "1517م"], correct_answer: "1453م", duration_seconds: 10 },
  { id: 69, category: "تاريخ", difficulty: "متوسط", question: "ما هو اسم أول مسجد بني في الإسلام؟", options: ["المسجد الحرام", "مسجد قباء", "المسجد النبوي", "مسجد الأقصى"], correct_answer: "مسجد قباء", duration_seconds: 10 },
  { id: 70, category: "تاريخ", difficulty: "متوسط", question: "كم استمرت خلافة أبي بكر الصديق؟", options: ["سنتان وأشهر", "4 سنوات", "6 سنوات", "10 سنوات"], correct_answer: "سنتان وأشهر", duration_seconds: 10 },
  { id: 71, category: "تاريخ", difficulty: "صعب", question: "من هو المسلم الذي اكتشف أمريكا قبل كولومبوس وفق بعض الروايات؟", options: ["سيف الإسلام", "مانسا موسى", "علي بن أبي طالب", "لم يكتشفها مسلم"], correct_answer: "لم يكتشفها مسلم", duration_seconds: 10 },
  { id: 72, category: "تاريخ", difficulty: "صعب", question: "من هو الخليفة الذي جمع القرآن الكريم في مصحف واحد؟", options: ["أبو بكر الصديق", "عمر بن الخطاب", "عثمان بن عفان", "علي بن أبي طالب"], correct_answer: "أبو بكر الصديق", duration_seconds: 10 },
  { id: 73, category: "تاريخ", difficulty: "صعب", question: "ما هي المعركة التي سُميت بـ 'فتح الفتوح'؟", options: ["معركة بدر", "معركة اليرموك", "معركة القادسية", "معركة حطين"], correct_answer: "معركة اليرموك", duration_seconds: 10 },
  { id: 74, category: "تاريخ", difficulty: "صعب", question: "من هو أول من أذّن في الإسلام؟", options: ["عمر بن الخطاب", "بلال بن رباح", "عبد الله بن زيد", "أبو بكر الصديق"], correct_answer: "بلال بن رباح", duration_seconds: 10 },
  { id: 75, category: "تاريخ", difficulty: "صعب", question: "في أي عام كانت معركة بدر الكبرى؟", options: ["1 هـ", "2 هـ", "3 هـ", "4 هـ"], correct_answer: "2 هـ", duration_seconds: 10 },
  { id: 76, category: "تاريخ", difficulty: "صعب جداً", question: "ما عدد سنوات الدولة العثمانية تقريباً؟", options: ["400 سنة", "500 سنة", "600 سنة", "700 سنة"], correct_answer: "600 سنة", duration_seconds: 10 },
  { id: 77, category: "تاريخ", difficulty: "صعب جداً", question: "من هو العالم المسلم الذي وضع أسس علم الجبر؟", options: ["ابن سينا", "الخوارزمي", "الرازي", "ابن رشد"], correct_answer: "الخوارزمي", duration_seconds: 10 },

  // ── فقه وعبادات ──
  { id: 90, category: "فقه", difficulty: "سهل", question: "كم عدد أركان الإسلام؟", options: ["3", "4", "5", "6"], correct_answer: "5", duration_seconds: 10 },
  { id: 91, category: "فقه", difficulty: "سهل", question: "كم عدد أركان الإيمان؟", options: ["4", "5", "6", "7"], correct_answer: "6", duration_seconds: 10 },
  { id: 92, category: "فقه", difficulty: "سهل", question: "كم عدد الصلوات المفروضة في اليوم؟", options: ["3", "4", "5", "6"], correct_answer: "5", duration_seconds: 10 },
  { id: 93, category: "فقه", difficulty: "سهل", question: "في أي شهر يصوم المسلمون؟", options: ["شوال", "ذو الحجة", "رمضان", "رجب"], correct_answer: "رمضان", duration_seconds: 10 },
  { id: 94, category: "فقه", difficulty: "سهل", question: "ما هو نصاب زكاة الذهب؟", options: ["75 غراماً", "85 غراماً", "95 غراماً", "100 غرام"], correct_answer: "85 غراماً", duration_seconds: 10 },
  { id: 95, category: "فقه", difficulty: "سهل", question: "ما هي القبلة التي يتجه إليها المسلمون في صلاتهم؟", options: ["المدينة المنورة", "القدس", "مكة المكرمة", "بغداد"], correct_answer: "مكة المكرمة", duration_seconds: 10 },
  { id: 96, category: "فقه", difficulty: "متوسط", question: "ما هو الركن الأعظم في الحج؟", options: ["طواف الإفاضة", "الوقوف بعرفة", "الإحرام", "السعي بين الصفا والمروة"], correct_answer: "الوقوف بعرفة", duration_seconds: 10 },
  { id: 97, category: "فقه", difficulty: "متوسط", question: "ما هو أول وقت صلاة الفجر؟", options: ["غروب الشمس", "طلوع الفجر الصادق", "طلوع الشمس", "منتصف الليل"], correct_answer: "طلوع الفجر الصادق", duration_seconds: 10 },
  { id: 98, category: "فقه", difficulty: "متوسط", question: "كم عدد ركعات صلاة الظهر؟", options: ["2", "3", "4", "5"], correct_answer: "4", duration_seconds: 10 },
  { id: 99, category: "فقه", difficulty: "متوسط", question: "ما هو مقدار زكاة الفطر بالكيلوغرام تقريباً؟", options: ["1 كغ", "2 كغ", "3 كغ", "5 كغ"], correct_answer: "3 كغ", duration_seconds: 10 },
  { id: 100, category: "فقه", difficulty: "متوسط", question: "ما الشرط الأساسي لصحة الصلاة المتعلق بالمكان؟", options: ["أن يكون في مسجد", "طهارة المكان", "أن يكون واسعاً", "أن يكون في الهواء الطلق"], correct_answer: "طهارة المكان", duration_seconds: 10 },
  { id: 101, category: "فقه", difficulty: "صعب", question: "ما هي الصلاة الوسطى المذكورة في القرآن الكريم؟", options: ["الفجر", "الظهر", "العصر", "المغرب"], correct_answer: "العصر", duration_seconds: 10 },
  { id: 102, category: "فقه", difficulty: "صعب", question: "ما هو الحد الأدنى لمقدار الزكاة (النسبة)؟", options: ["1%", "2%", "2.5%", "5%"], correct_answer: "2.5%", duration_seconds: 10 },
  { id: 103, category: "فقه", difficulty: "صعب", question: "كم عدد أشواط الطواف حول الكعبة؟", options: ["5", "6", "7", "8"], correct_answer: "7", duration_seconds: 10 },
  { id: 104, category: "فقه", difficulty: "صعب", question: "ما هي صلاة التراويح وكم ركعة؟", options: ["8 ركعات فقط", "20 ركعة فقط", "8 أو 20 ركعة", "12 ركعة"], correct_answer: "8 أو 20 ركعة", duration_seconds: 10 },

  // ── عقيدة ──
  { id: 110, category: "عقيدة", difficulty: "سهل", question: "ما هو أول واجب على المكلف؟", options: ["الصلاة", "معرفة الله", "الصيام", "قراءة القرآن"], correct_answer: "معرفة الله", duration_seconds: 10 },
  { id: 111, category: "عقيدة", difficulty: "سهل", question: "كم عدد الملائكة الموكلين بالإنسان (الحفظة)؟", options: ["2", "4", "6", "8"], correct_answer: "4", duration_seconds: 10 },
  { id: 112, category: "عقيدة", difficulty: "سهل", question: "ما هو الكتاب المقدس المنزل على موسى عليه السلام؟", options: ["الإنجيل", "الزبور", "التوراة", "القرآن"], correct_answer: "التوراة", duration_seconds: 10 },
  { id: 113, category: "عقيدة", difficulty: "سهل", question: "ما هو الكتاب المنزل على داود عليه السلام؟", options: ["الإنجيل", "الزبور", "التوراة", "الصحف"], correct_answer: "الزبور", duration_seconds: 10 },
  { id: 114, category: "عقيدة", difficulty: "متوسط", question: "ما هي أسماء منكر ونكير؟", options: ["ملكان في السماء", "ملكا العذاب", "ملكا القبر", "ملكا الرزق"], correct_answer: "ملكا القبر", duration_seconds: 10 },
  { id: 115, category: "عقيدة", difficulty: "متوسط", question: "كم عدد الأنبياء والرسل الذين ذُكروا في القرآن الكريم؟", options: ["18", "25", "30", "40"], correct_answer: "25", duration_seconds: 10 },
  { id: 116, category: "عقيدة", difficulty: "متوسط", question: "ما هو أول نبي أُرسل إلى البشر؟", options: ["إبراهيم", "نوح", "آدم", "إدريس"], correct_answer: "آدم", duration_seconds: 10 },
  { id: 117, category: "عقيدة", difficulty: "صعب", question: "ما هو اسم الملك الموكل بالأرواح؟", options: ["جبريل", "ميكائيل", "إسرافيل", "عزرائيل"], correct_answer: "عزرائيل", duration_seconds: 10 },
  { id: 118, category: "عقيدة", difficulty: "صعب", question: "ما هو اسم الملك الموكل بالوحي؟", options: ["جبريل", "ميكائيل", "إسرافيل", "عزرائيل"], correct_answer: "جبريل", duration_seconds: 10 },
  { id: 119, category: "عقيدة", difficulty: "صعب", question: "ما اسم الصراط المستقيم في يوم القيامة؟", options: ["الجسر", "الصراط", "الميزان", "المحشر"], correct_answer: "الصراط", duration_seconds: 10 },

  // ── أخلاق وآداب ──
  { id: 130, category: "أخلاق", difficulty: "سهل", question: "ما هو الحديث المشهور الذي يلخص الإسلام في كلمة؟", options: ["الإيمان", "الصلاة", "النية", "الإحسان"], correct_answer: "النية", duration_seconds: 10 },
  { id: 131, category: "أخلاق", difficulty: "سهل", question: "ما هو أعظم الذنوب في الإسلام؟", options: ["السرقة", "الزنا", "الشرك بالله", "الكذب"], correct_answer: "الشرك بالله", duration_seconds: 10 },
  { id: 132, category: "أخلاق", difficulty: "متوسط", question: "ما هو الحد الفاصل بين الكفر والإيمان في الحديث الشريف؟", options: ["الصلاة", "الزكاة", "الحج", "الصوم"], correct_answer: "الصلاة", duration_seconds: 10 },
  { id: 133, category: "أخلاق", difficulty: "متوسط", question: "ما هي الكبائر السبع المهلكات؟ (أحدها:)", options: ["كثرة الصيام", "الشرك بالله", "قراءة القرآن", "كثرة الصدقة"], correct_answer: "الشرك بالله", duration_seconds: 10 },

  // ── علوم إسلامية ──
  { id: 140, category: "علوم", difficulty: "متوسط", question: "من هو العالم الذي وضع علم مصطلح الحديث؟", options: ["الإمام البخاري", "الإمام مسلم", "الإمام الرامهرمزي", "الإمام الشافعي"], correct_answer: "الإمام الرامهرمزي", duration_seconds: 10 },
  { id: 141, category: "علوم", difficulty: "متوسط", question: "ما هو اسم أصح كتاب بعد القرآن الكريم؟", options: ["صحيح مسلم", "صحيح البخاري", "سنن أبي داود", "الموطأ"], correct_answer: "صحيح البخاري", duration_seconds: 10 },
  { id: 142, category: "علوم", difficulty: "متوسط", question: "كم عدد المذاهب الفقهية الكبرى المتبعة؟", options: ["2", "3", "4", "5"], correct_answer: "4", duration_seconds: 10 },
  { id: 143, category: "علوم", difficulty: "صعب", question: "ما هو اسم المذهب الفقهي المنسوب للإمام مالك؟", options: ["الحنفي", "المالكي", "الشافعي", "الحنبلي"], correct_answer: "المالكي", duration_seconds: 10 },
  { id: 144, category: "علوم", difficulty: "صعب", question: "من هو مؤسس علم أصول الفقه؟", options: ["الإمام أبو حنيفة", "الإمام الشافعي", "الإمام مالك", "الإمام أحمد"], correct_answer: "الإمام الشافعي", duration_seconds: 10 },
  { id: 145, category: "علوم", difficulty: "صعب", question: "ما هو علم التجويد؟", options: ["علم تفسير القرآن", "علم أحكام تلاوة القرآن", "علم الفقه الإسلامي", "علم الحديث"], correct_answer: "علم أحكام تلاوة القرآن", duration_seconds: 10 },
  { id: 146, category: "علوم", difficulty: "صعب جداً", question: "كم عدد أحاديث صحيح البخاري تقريباً؟", options: ["3000", "5000", "7563", "10000"], correct_answer: "7563", duration_seconds: 10 },

  // ── الأنبياء والرسل ──
  { id: 150, category: "أنبياء", difficulty: "سهل", question: "من هو النبي الذي بنى السفينة؟", options: ["إبراهيم", "موسى", "نوح", "يونس"], correct_answer: "نوح", duration_seconds: 10 },
  { id: 151, category: "أنبياء", difficulty: "سهل", question: "من هو النبي الذي أُلقي في النار فلم تحرقه؟", options: ["إسماعيل", "إبراهيم", "يوسف", "موسى"], correct_answer: "إبراهيم", duration_seconds: 10 },
  { id: 152, category: "أنبياء", difficulty: "سهل", question: "من هو النبي الذي ابتلعه الحوت؟", options: ["موسى", "يونس", "إلياس", "يوسف"], correct_answer: "يونس", duration_seconds: 10 },
  { id: 153, category: "أنبياء", difficulty: "سهل", question: "من هو النبي المعروف بصبره؟", options: ["أيوب", "يعقوب", "يوسف", "سليمان"], correct_answer: "أيوب", duration_seconds: 10 },
  { id: 154, category: "أنبياء", difficulty: "سهل", question: "من هو النبي الذي كُلِّمه الله مباشرة؟", options: ["إبراهيم", "محمد", "موسى", "عيسى"], correct_answer: "موسى", duration_seconds: 10 },
  { id: 155, category: "أنبياء", difficulty: "متوسط", question: "من هو النبي الذي أُعطي مُلك لا ينبغي لأحد من بعده؟", options: ["داود", "سليمان", "يوسف", "ذو القرنين"], correct_answer: "سليمان", duration_seconds: 10 },
  { id: 156, category: "أنبياء", difficulty: "متوسط", question: "ما هو معجزة موسى عليه السلام الكبرى؟", options: ["إحياء الموتى", "شق البحر", "الناقة", "العصا تصبح ثعباناً وشق البحر"], correct_answer: "العصا تصبح ثعباناً وشق البحر", duration_seconds: 10 },
  { id: 157, category: "أنبياء", difficulty: "متوسط", question: "ما هو اسم أبي عيسى عليه السلام؟", options: ["يوسف", "زكريا", "ليس له أب", "يحيى"], correct_answer: "ليس له أب", duration_seconds: 10 },
  { id: 158, category: "أنبياء", difficulty: "متوسط", question: "من هو النبي الذي وُلد في مصر؟", options: ["يوسف", "موسى", "إسماعيل", "إبراهيم"], correct_answer: "موسى", duration_seconds: 10 },
  { id: 159, category: "أنبياء", difficulty: "صعب", question: "من هو النبي الذي رُفع إلى السماء ولم يمت؟", options: ["إلياس", "إدريس", "عيسى", "إدريس وعيسى"], correct_answer: "إدريس وعيسى", duration_seconds: 10 },
  { id: 160, category: "أنبياء", difficulty: "صعب", question: "ما هو اسم زوجة فرعون التي آمنت بموسى؟", options: ["آسيا", "مريم", "هاجر", "سارة"], correct_answer: "آسيا", duration_seconds: 10 },
  { id: 161, category: "أنبياء", difficulty: "صعب", question: "من هو النبي الذي كانت له الريح مسخرة؟", options: ["داود", "سليمان", "إدريس", "لقمان"], correct_answer: "سليمان", duration_seconds: 10 },

  // ── أماكن مقدسة ──
  { id: 170, category: "أماكن", difficulty: "سهل", question: "ما هو أول البيوت وُضع للناس؟", options: ["المسجد النبوي", "المسجد الأقصى", "الكعبة المشرفة", "مسجد قباء"], correct_answer: "الكعبة المشرفة", duration_seconds: 10 },
  { id: 171, category: "أماكن", difficulty: "سهل", question: "في أي مدينة يقع المسجد النبوي؟", options: ["مكة المكرمة", "المدينة المنورة", "القدس", "الرياض"], correct_answer: "المدينة المنورة", duration_seconds: 10 },
  { id: 172, category: "أماكن", difficulty: "سهل", question: "في أي مدينة يقع المسجد الحرام؟", options: ["مكة المكرمة", "المدينة المنورة", "القدس", "مكة أو المدينة"], correct_answer: "مكة المكرمة", duration_seconds: 10 },
  { id: 173, category: "أماكن", difficulty: "متوسط", question: "ما هو اسم الحجر الأسود ومكانه في الكعبة؟", options: ["الركن العراقي", "الركن الشامي", "الركن الأسود", "الركن اليماني"], correct_answer: "الركن الأسود", duration_seconds: 10 },
  { id: 174, category: "أماكن", difficulty: "متوسط", question: "ما هو اسم بئر زمزم ومن أجرت له؟", options: ["لإبراهيم عليه السلام", "لإسماعيل عليه السلام", "للنبي محمد", "لموسى عليه السلام"], correct_answer: "لإسماعيل عليه السلام", duration_seconds: 10 },
  { id: 175, category: "أماكن", difficulty: "متوسط", question: "كم تبلغ المسافة بين الصفا والمروة تقريباً؟", options: ["200 متر", "394 متراً", "500 متر", "1 كيلومتر"], correct_answer: "394 متراً", duration_seconds: 10 },
  { id: 176, category: "أماكن", difficulty: "صعب", question: "في أي بلد يقع المسجد الأقصى؟", options: ["السعودية", "مصر", "فلسطين", "الأردن"], correct_answer: "فلسطين", duration_seconds: 10 },
  { id: 177, category: "أماكن", difficulty: "صعب", question: "ما هو اسم الجبل الذي وقف عليه النبي في خطبة حجة الوداع؟", options: ["جبل عرفات", "جبل النور", "جبل ثور", "جبل المزدلفة"], correct_answer: "جبل عرفات", duration_seconds: 10 },

  // ── رمضان وعبادات خاصة ──
  { id: 180, category: "عبادات", difficulty: "سهل", question: "ما هي ليلة القدر وفي أي عشر؟", options: ["في العشر الأوائل", "في العشر الأواسط", "في العشر الأواخر", "في أول ليلة من رمضان"], correct_answer: "في العشر الأواخر", duration_seconds: 10 },
  { id: 181, category: "عبادات", difficulty: "سهل", question: "ما هو الدعاء المستحب عند الإفطار؟", options: ["الحمد لله", "ذهب الظمأ...", "بسم الله", "سبحان الله"], correct_answer: "ذهب الظمأ...", duration_seconds: 10 },
  { id: 182, category: "عبادات", difficulty: "متوسط", question: "كم تساوي ليلة القدر من حيث العبادة؟", options: ["شهراً", "سنة", "ألف شهر", "عشر سنوات"], correct_answer: "ألف شهر", duration_seconds: 10 },
  { id: 183, category: "عبادات", difficulty: "متوسط", question: "في أي وقت تُستحب صلاة الضحى؟", options: ["بعد الفجر مباشرة", "بعد شروق الشمس بربع ساعة حتى قبيل الزوال", "وقت الظهيرة", "بعد صلاة الظهر"], correct_answer: "بعد شروق الشمس بربع ساعة حتى قبيل الزوال", duration_seconds: 10 },
  { id: 184, category: "عبادات", difficulty: "صعب", question: "ما هو أفضل الذكر بعد الصلاة وفق الأحاديث؟", options: ["التسبيح 33 مرة", "الصلاة على النبي", "قراءة آية الكرسي", "كل ما سبق"], correct_answer: "كل ما سبق", duration_seconds: 10 },
];
