import { LanguageCode } from './types';

export interface Region {
  code: string;
  expectancy: number;
  flag: string;
  names: Record<LanguageCode, string>;
}

export interface SuggestionItem {
  id: string;
  icon: string;
  titles: Record<LanguageCode, string>;
  descs: Record<LanguageCode, string>;
}

export const regionsList: Region[] = [
  {
    code: 'global',
    expectancy: 73.3,
    flag: '🌐',
    names: {
      en: 'Global Average',
      es: 'Promedio Global',
      fr: 'Moyenne Mondiale',
      de: 'Weltweiter Durchschnitt',
      hi: 'वैश्विक औसत',
      ja: '世界平均',
      bn: 'বৈশ্বic গড়',
      ar: 'المعدل العالمي',
      pt: 'Média Global',
      ru: 'Среднемировой показатель',
      zh: '全球平均水平',
      it: 'Media Globale',
      tr: 'Küresel Ortalama',
      ko: '세계 평균',
      vi: 'Trung bình Toàn cầu',
      id: 'Rata-rata Global',
      nl: 'Wereldwijd Gemiddelde',
      pl: 'Średnia Globalna'
    }
  },
  {
    code: 'japan',
    expectancy: 84.6,
    flag: '🇯🇵',
    names: {
      en: 'Japan', es: 'Japón', fr: 'Japon', de: 'Japan', hi: 'जापान', ja: '日本', bn: 'জাপান', ar: 'اليابان', pt: 'Japão', ru: 'Япония', zh: '日本', it: 'Giappone', tr: 'Japonya', ko: '일본', vi: 'Nhật Bản', id: 'Jepang', nl: 'Japan', pl: 'Japonia'
    }
  },
  {
    code: 'switzerland',
    expectancy: 83.8,
    flag: '🇨🇭',
    names: {
      en: 'Switzerland', es: 'Suiza', fr: 'Suisse', de: 'Schweiz', hi: 'स्विट्ज़रलैंड', ja: 'スイス', bn: 'সুইজারল্যান্ড', ar: 'سويسرا', pt: 'Suíça', ru: 'Швейцария', zh: '瑞士', it: 'Svizzera', tr: 'İsviçre', ko: '스위스', vi: 'Thụy Sĩ', id: 'Swiss', nl: 'Zwitserland', pl: 'Szwajcaria'
    }
  },
  {
    code: 'singapore',
    expectancy: 83.5,
    flag: '🇸🇬',
    names: {
      en: 'Singapore', es: 'Singapur', fr: 'Singapour', de: 'Singapur', hi: 'सिंगापुर', ja: 'シンガポール', bn: 'সিঙ্গাপুর', ar: 'سنغافورة', pt: 'Singapura', ru: 'Сингапур', zh: '新加坡', it: 'Singapore', tr: 'Singapur', ko: '싱가포르', vi: 'Singapore', id: 'Singapura', nl: 'Singapore', pl: 'Singapur'
    }
  },
  {
    code: 'spain',
    expectancy: 83.3,
    flag: '🇪🇸',
    names: {
      en: 'Spain', es: 'España', fr: 'Espagne', de: 'Spanien', hi: 'स्पेन', ja: 'スペイン', bn: 'স্পেন', ar: 'إسبانيا', pt: 'Espanha', ru: 'Иspania', zh: '西班牙', it: 'Spagna', tr: 'İspanya', ko: '스페인', vi: 'Tây Ban Nha', id: 'Spanyol', nl: 'Spanje', pl: 'Hiszpania'
    }
  },
  {
    code: 'germany',
    expectancy: 80.9,
    flag: '🇩🇪',
    names: {
      en: 'Germany', es: 'Alemania', fr: 'Allemagne', de: 'Deutschland', hi: 'जर्मनी', ja: 'ドイツ', bn: 'জার্মানি', ar: 'ألمانيا', pt: 'Alemanha', ru: 'Германия', zh: '德国', it: 'Germania', tr: 'Almanya', ko: '독일', vi: 'Đức', id: 'Jerman', nl: 'Duitsland', pl: 'Niemcy'
    }
  },
  {
    code: 'usa',
    expectancy: 77.3,
    flag: '🇺🇸',
    names: {
      en: 'United States', es: 'Estados Unidos', fr: 'États-Unis', de: 'Vereinigte Staaten', hi: 'संयुक्त राज्य अमेरिका', ja: 'アメリカ合衆国', bn: 'মার্কিন যুক্তরাষ্ট্র', ar: 'الولايات المتحدة', pt: 'Estados Unidos', ru: 'США', zh: '美国', it: 'Stati Uniti', tr: 'Amerika Birleşik Devletleri', ko: '미국', vi: 'Hoa Kỳ', id: 'Amerika Serikat', nl: 'Verenigde Staten', pl: 'Stany Zjednoczone'
    }
  },
  {
    code: 'brazil',
    expectancy: 76.2,
    flag: '🇧🇷',
    names: {
      en: 'Brazil', es: 'Brasil', fr: 'Brésil', de: 'Brasilien', hi: 'ब्राजील', ja: 'ブラジル', bn: 'ব্রাজিল', ar: 'البرازيل', pt: 'Brasil', ru: 'Бразилия', zh: '巴西', it: 'Brasile', tr: 'Brezilya', ko: '브라질', vi: 'Brazil', id: 'Brasil', nl: 'Brazilië', pl: 'Brazylia'
    }
  },
  {
    code: 'bangladesh',
    expectancy: 73.0,
    flag: '🇧🇩',
    names: {
      en: 'Bangladesh', es: 'Bangladés', fr: 'Bangladesh', de: 'Bangladesch', hi: 'बांग्लादेश', ja: 'バングラデシュ', bn: 'বাংলাদেশ', ar: 'بنغلاديش', pt: 'Bangladesh', ru: 'Бангладеш', zh: '孟加拉国', it: 'Bangladesh', tr: 'Bangladeş', ko: '방글라데시', vi: 'Bangladesh', id: 'Bangladesh', nl: 'Bangladesh', pl: 'Bangladesz'
    }
  },
  {
    code: 'india',
    expectancy: 70.2,
    flag: '🇮🇳',
    names: {
      en: 'India', es: 'India', fr: 'Inde', de: 'Indien', hi: 'भारत', ja: 'インド', bn: 'ভারত', ar: 'الهند', pt: 'Índia', ru: 'Индия', zh: '印度', it: 'India', tr: 'Hindistan', ko: '인도', vi: 'Ấn Độ', id: 'India', nl: 'India', pl: 'Indie'
    }
  },
  {
    code: 'nigeria',
    expectancy: 54.0,
    flag: '🇳🇬',
    names: {
      en: 'Nigeria', es: 'Nigeria', fr: 'Nigéria', de: 'Nigeria', hi: 'नाइजीरिया', ja: 'ナイジェリア', bn: 'নাইজেরিয়া', ar: 'نيجيريا', pt: 'Nigéria', ru: 'Нигерия', zh: '尼日利亚', it: 'Nigeria', tr: 'Nijerya', ko: '나이지리아', vi: 'Nigeria', id: 'Nigeria', nl: 'Nigeria', pl: 'Nigeria'
    }
  }
];

// Interactive tailored recommendations categorized clearly
export const lifeSuggestions: Record<'health' | 'adventure' | 'connections' | 'mind', {
  long: SuggestionItem[]; // > 35 remaining years
  medium: SuggestionItem[]; // 15 to 35 remaining years
  short: SuggestionItem[]; // < 15 remaining years
}> = {
  health: {
    long: [
      {
        id: 'h_long_1',
        icon: '🏃',
        titles: {
          en: 'Build Unbreakable Joints & Cardio',
          es: 'Construir Cardio y Articulaciones irrompibles',
          fr: 'Bâtir des Articulations et du Cardio Solides',
          de: 'Aufbau robuster Gelenke & Ausdauer',
          hi: 'मजबूत जोड़ों और कार्डियो का निर्माण करें',
          ja: '強固な関節と心肺機能の構築',
          bn: 'অপরাজেয় স্থায়িত্ব ও কার্ডিও গড়ে তুলুন',
          ar: 'بناء مفاصل ولياقة بدنية لا تقهر',
          pt: 'Construir Cardio e Articulações Resistentes',
          ru: 'Создайте крепкие суставы и выносливость',
          zh: '打造极致关节承载力与心肺活力',
          it: 'Costruisci Articolazioni e Cardio Resistenti',
          tr: 'Güçlü Eklemler ve Kardiyo İnşa Et',
          ko: '강력한 관절 및 기초 심폐 지구력 강화',
          vi: 'Xây dựng Hệ Cơ xương khớp & Tim mạch Dẻo dai',
          id: 'Bangun Sendi & Kardio yang Kuat',
          nl: 'Bouw aan Onverwoestbare Gewrichten & Conditie',
          pl: 'Zbuduj niezniszczalne stawy i wydolność'
        },
        descs: {
          en: 'Commit to weight training, high-intensity intervals, and deep flexibility work. It adds decades of physical youth.',
          es: 'Comprométete con el entrenamiento con pesas y flexibilidad profunda. Agrega décadas de juventud física.',
          fr: 'Engagez-vous dans la musculation et la souplesse. Cela ajoute des décennies de jeunesse physique.',
          de: 'Setzen Sie auf Krafttraining und Flexibilität. Das schenkt Ihnen Jahrzehnte an körperlicher Vitalität.',
          hi: 'वेट ट्रेनिंग और गहरी लचीलेपन पर ध्यान दें। यह आपकी शारीरिक जवानी में दशकों जोड़ता है।',
          ja: '筋力トレーニングと柔軟性向上。何十年もの若々しさを身体にもたらします。',
          bn: 'নিয়মিত ওয়েট ট্রেনিং ও দীর্ঘ স্ট্রেচিং প্র্যাকটিস করুন, যা আপনার শারীরিক যৌবনের সময়কাল দ্বিগুণ করবে।',
          ar: 'التزم بتمارين الأوزان والمرونة العميقة. يضيف عقوداً من الشباب البدني.',
          pt: 'Pratique musculação e exercícios de flexibilidade. Isso adiciona décadas de juventude física.',
          ru: 'Занимайтесь силовыми тренировками и растяжкой. Это сохранит гибкость и молодость на десятилетия.',
          zh: '长期坚持力量训练与核心伸展，为身体在未来数十年内储存大量的肌肉储备和抗病能力。',
          it: 'Rafforza i muscoli e la flessibilità per mantenere un corpo giovane per decenni.',
          tr: 'Ağırlık antrenmanı ve esnekliğe odaklan. Fiziksel gençliğine onlarca yıl katacaktır.',
          ko: '중량 스쿼트 같은 근력 강화 훈련과 스트레칭을 루틴화하세요. 신체 나이가 크게 젊어집니다.',
          vi: 'Tập tạ và kéo giãn cơ sâu hàng tuần để tích trữ thể lực dồi dào, kéo dài tuổi xuân.',
          id: 'Lakukan latihan beban dan peregangan mendalam. Ini akan memperpanjang masa muda fisik Anda.',
          nl: 'Richt je op krachttraining en flexibiliteit. Dit verlengt de fysieke jeugdigheid met tientallen jaren.',
          pl: 'Skup się na treningu oporowym i rozciąganiu. To doda Twojemu ciału sprawności na dekady.'
        }
      },
      {
        id: 'h_long_2',
        icon: '🥑',
        titles: {
          en: 'Master Metabolic Balance',
          es: 'Dominar la Nutrición Celular',
          fr: 'Maîtriser la Balance Métabolique',
          de: 'Stoffwechsel-Balance meistern',
          hi: 'मेटाबॉलिक संतुलन हासिल करें',
          ja: '代謝バランスの確立',
          bn: 'নিখুঁত মেটাবলিক ভারসাম্য অর্জন',
          ar: 'إتقان التوازن الغذائي الخلوي',
          pt: 'Dominar o Equilíbrio Metabólico',
          ru: 'Освойте метаболический баланс',
          zh: '精控代谢平衡与细胞再生',
          it: 'Sviluppa l\'Equilibrio Metabolico',
          tr: 'Metabolik Dengeyi Yönet',
          ko: '안정적인 대사 기능 및 식단 습관 마스터',
          vi: 'Làm chủ Cân bằng Trao đổi chất',
          id: 'Kuasai Keseimbangan Metabolisme',
          nl: 'Beheers Je Metabolische Balans',
          pl: 'Opanuj równowagę metaboliczną'
        },
        descs: {
          en: 'Prioritize protein, eliminate ultra-processed sugars, and practice periodic fasting. Keep cellular inflammation to zero.',
          es: 'Prioriza las proteínas, elimina los azúcares procesados y practica el ayuno. Reduce la inflamación celular.',
          fr: 'Priorisez les protéines, éliminez les sucres transformés et jeûnez. Réduisez l\'inflammation cellulaire.',
          de: 'Bevorzugen Sie Eiweiß, meiden Sie raffinierten Zucker und nutzen Sie Intervallfasten gegen Entzündungen.',
          hi: 'प्रोटीन को प्राथमिकता दें, प्रोसेस्ड शुगर से बचें और उपवास करें जो सूजन को खत्म करता है।',
          ja: 'タンパク質中心、加工糖の排除、定期的なファスティングで細胞の炎症を防ぎます。',
          bn: 'প্রোটিন সমৃদ্ধ খাবার বেছে নিন, রিফাইন চিনি পরিহার করুন এবং ইন্টারমিটেন্ট ফাস্টিং করুন।',
          ar: 'أعط الأولوية للبروتين، وتخلص من السكريات المصنعة، وحافظ على مستويات التهاب منخفضة لل خلايا.',
          pt: 'Priorize proteínas, elimine açúcares ultraprocessados e faça jejum intermitente.',
          ru: 'Делайте упор на белок, исключите сахар и практикуйте периодическое голодание для снижения воспалений.',
          zh: '控低高升糖糖类摄入，多吃优质脂肪与膳食纤维，并通过断食周期启动自体吞噬。',
          it: 'Privilegia le proteine, evita gli zuccheri raffinati e sperimenta il digiuno intermittente.',
          tr: 'Proteine öncelik ver, işlenmiş şekeri hayatından çıkar ve hücresel temizlik için aralıklı oruç dene.',
          ko: '정제 설탕과 초가공식품을 완전히 끊고 당독소를 원천 제거해 체내 항염증 비율을 낮추세요.',
          vi: 'Ưu tiên đạm lành mạnh, cắt đường tinh luyện và thực hiện nhịn ăn gián đoạn để thanh lọc tế bào.',
          id: 'Utamakan makanan berserat, jauhi gula rafinasi, dan pelajari puasa berkala untuk metabolisme.',
          nl: 'Kies voor eiwitten, elimineer geraffineerde suikers en doe aan periodiek vasten tegen ontstekingen.',
          pl: 'Wybieraj białko, eliminuj cukier i stosuj post przerywany w celu zmniejszenia stanów zapalnych.'
        }
      }
    ],
    medium: [
      {
        id: 'h_med_1',
        icon: '🧘',
        titles: {
          en: 'Decompress Your Nervous System',
          es: 'Descomprimir tu Sistema Nervioso',
          fr: 'Décompresser le Système Nerveux',
          de: 'Nervensystem entspannen',
          hi: 'नर्वस सिस्टम को तनावमुक्त करें',
          ja: '副交感神経の活性化とストレス軽減',
          bn: 'নার্ভাস সিস্টেমকে টেনশনমুক্ত করুন',
          ar: 'تخفيف الضغط عن الجهاز العصبي',
          pt: 'Descomprimir o Sistema Nervoso',
          ru: 'Разгрузите нервную систему',
          zh: '深度释放与激活自主神经平衡',
          it: 'Rilassa il Sistema Nervoso',
          tr: 'Sinir Sistemini Rahatlat',
          ko: '스트레스 완화를 통한 신경계 감압',
          vi: 'Giải tỏa Áp lực Hệ Thần kinh',
          id: 'Rilekskan Sistem Saraf Anda',
          nl: 'Ontspan Je Zenuwstelsel',
          pl: 'Rozładuj napięcie układu nerwowego'
        },
        descs: {
          en: 'Incorporate daily meditation, breathwork, and non-sleep deep rest. High cortisol speeds up overall cognitive aging.',
          es: 'Incorpora meditación, respiración y descanso profundo. El cortisol alto acelera el envejecimiento cognitivo.',
          fr: 'Incorporez la méditation et la respiration. Un niveau élevé de cortisol accélère le vieillissement cognitif.',
          de: 'Nutzen Sie tägliche Meditation und Atemarbeit. Zu viel Cortisol beschleunigt die geistige Alterung.',
          hi: 'रोज ध्यान और श्वसन कसरत अपनाएं। हाई कोर्टिसोल मानसिक और संज्ञानात्मक बुढ़ापे को तेज करता है।',
          ja: '毎日のマインドフルネス呼吸法。高いコルチゾール値は脳の老化を加速させてしまいます。',
          bn: 'প্রতিদিন মেডিটেশন ও গভীর নিঃশ্বাসের অভ্যাস করুন। অতিরিক্ত কর্টিসল স্নায়বিক বার্ধক্যকে ত্বরান্বিত করে।',
          ar: 'مارس التأمل اليومي وتمارين التنفس. الكورتيزول المرتفع يعزز الشيخوخة المعرفية.',
          pt: 'Incorpore meditação e exercícios de respiração diários. O cortisol alto acelera o envelhecimento.',
          ru: 'Внедрите ежедневную медитацию и дыхательные практики. Высокий кортизол ускоряет старение мозга.',
          zh: '每日留出20分钟进行无休深思或正念呼吸，抑制皮质醇的分泌，极大呵护脑细胞延缓退化。',
          it: 'Pratica meditazione quotidiana e respirazione profonda. Il cortisolo accelera l\'invecchiamento cerebrale.',
          tr: 'Günlük nefes egzersizleri ve meditasyon yap. Yüksek stres hormonu kortizol bilişsel yaşlanmayı hızlandırır.',
          ko: '매일 10분씩 심호흡 마인드풀니스를 진행하세요. 스트레스 호르몬인 코르티솔 수치가 대폭 줄어듭니다.',
          vi: 'Thiền định và nhịp thở chậm hàng ngày để cân bằng nhịp tim, giảm hormone cortisole phá hủy tế bào.',
          id: 'Lakukan meditasi harian dan latihan pernapasan. Hormon stres berlebih mempercepat penuaan otak.',
          nl: 'Integreer dagelijkse meditatie en ademhalingsoefeningen. Stress versnelt de cognitieve achteruitgang.',
          pl: 'Wprowadź codzienną medytację i ćwiczenia oddechowe. Stres przyspiesza starzenie się mózgu.'
        }
      }
    ],
    short: [
      {
        id: 'h_sh_1',
        icon: '🚶',
        titles: {
          en: 'Gentle, Daily Circular Movement',
          es: 'Movimiento Suave e Intencional Diario',
          fr: 'Mouvements Doux et Flux Quotidien',
          de: 'Sanfte und tägliche Bewegung',
          hi: 'हल्का और दैनिक व्यायाम',
          ja: '毎日の穏やかなウォーキングやストレッチ',
          bn: 'হালকা ও মনোরম দৈনিক হাঁটাচলা',
          ar: 'حركة يومية لطيفة ومنتظمة',
          pt: 'Movimentos Diários Suaves e Constantes',
          ru: 'Мягкая ежедневная активность',
          zh: '每日和缓多重循环拉伸',
          it: 'Attività Fisica Dolce e Quotidiana',
          tr: 'Hafif ve Düzenli Günlük Aktivite',
          ko: '매일 30분 관절 무리 없는 숲길 산책',
          vi: 'Vận động Nhẹ nhàng, Dẻo dai Hàng ngày',
          id: 'Aktivitas Fisik Ringan Setiap Hari',
          nl: 'Zachte, Dagelijkse Lichaamsbeweging',
          pl: 'Łagodny i regularny ruch każdego dnia'
        },
        descs: {
          en: 'Walk in nature, stretch out muscle stiffness, and focus on clean posture. Vitalize lymphatic drainage and blood flow.',
          es: 'Camina por la naturaleza, estírate y cuida tu postura para vitalizar el drenaje linfático.',
          fr: 'Marchez dans la nature, étirez-vous et soignez votre posture pour stimuler la lymphe.',
          de: 'Gehen Sie im Grünen spazieren, dehnen Sie sich regelmäßig und achten Sie auf die Durchblutung.',
          hi: 'प्रकृति में टहलें, शरीर की अकड़न दूर करें और बेहतर मुद्रा बनाए रखें जिससे प्राणवायु बढ़े।',
          ja: '森林浴や軽いストレッチを重視し、リンパの循環と血液の流れを円滑に維持します。',
          bn: 'সবুজ প্রকৃতির মাঝে পরিমিত হাঁটুন, মাসল রিল্যাক্স করুন এবং লিউমফ্যাটিক প্রবাহ সচল রাখুন।',
          ar: 'امشِ في أحضان الطبيعة، وقم بتمديد مفاصلك لتعزيز دورتك الدموية والتصريف اللمفاوي.',
          pt: 'Caminhe ao ar livre, alongue-se para evitar rigidez muscular e mantenha boa postura.',
          ru: 'Гуляйте в парках, делайте суставную гимнастику и следите за осанкой для циркуляции лимфы.',
          zh: '林间散步、晨曦太极或瑜伽温和拉伸，能够显著改善心脑供血与免疫淋巴排毒。',
          it: 'Cammina nel verde, allunga i muscoli e mantieni una postura eretta per stimolare la circolação.',
          tr: 'Doğa yürüyüşleri yap, hafifçe esne ve duruşunu dik tut. Kan dolaşımını ve bağışıklığı canlı tutacaktır.',
          ko: '햇볕을 쬐며 산책해 칼슘을 보존하고, 근육 굳어짐을 완화해 혈액과 림프의 순환을 원활케 만드세요.',
          vi: 'Đi dạo giữa thiên nhiên xanh, mát-xa cơ thể và yoga để thúc đẩy tuần hoàn máu và đề kháng.',
          id: 'Berjalanlah di taman, regangkan otot-otot yang kaku, dan jaga sirkulasi darah serta postur tubuh.',
          nl: 'Wandel in de natuur, stretch je spieren en focus op een rechte houding voor de bloedsomloop.',
          pl: 'Spaceruj po łonie natury, rozciągaj się i dbaj o prawidłową postawę, aby poprawić krążenie.'
        }
      }
    ]
  },
  adventure: {
    long: [
      {
        id: 'a_long_1',
        icon: '🧭',
        titles: {
          en: 'Execute Grand Bucket-List Travel',
          es: 'Realizar Viajes de Ensueño Inolvidables',
          fr: 'Réaliser Vos Plus Grands Rêves de Voyage',
          de: 'Die größten Reiseträume erfüllen',
          hi: 'बड़े सपनों की यात्राओं को पूरा करें',
          ja: 'バケットリスト（死ぬまでにやりたいこと）の大旅行',
          bn: 'জীবন বদলানো দারুণ রোমাঞ্চকর ট্যুর',
          ar: 'تنفيذ مغامرات السفر الكبرى',
          pt: 'Realizar as Maiores Viagens dos Sonhos',
          ru: 'Осуществите грандиозные путешествия',
          zh: '趁当下完成极致终生清单远途旅行',
          it: 'Compi i Tuoi Viaggi da Sogno Più Grandi',
          tr: 'Büyük Hayal Gezilerini Gerçekleştir',
          ko: '에너지가 최고조인 시기의 원대한 탐험 여행',
          vi: 'Thực hiện Chuyến phiêu lưu "Cuộc đời" vĩ đại nhất',
          id: 'Wujudkan Petualangan Besar Impian Anda',
          nl: 'Maak Je Meest Ambitieuze Droomreizen',
          pl: 'Zrealizuj swoje największe podróżnicze marzenia'
        },
        descs: {
          en: 'Don\'t delay the physically demanding trips like backpacking high altitudes, diving remote reefs, or ancient trails.',
          es: 'No demores los viajes exigentes: mochilear en alturas, bucear en arrecifes remotos o senderos antiguos.',
          fr: 'Ne repoussez pas les voyages sportifs: randonnées en altitude, plongée ou trek lointain.',
          de: 'Verschieben Sie anstrengende Reisen nicht – etwa Höhenwanderungen, Tauchen an Riffen oder Weitwanderungen.',
          hi: 'ऊंचाई पर ट्रैकिंग, सुदूर रीफ्स में डाइविंग जैसी शारीरिक ताकत वाले साहसिक खेलों और यात्राओं में देर न करें।',
          ja: '高地登山や無人島ダイビングなど、若さと体力があるうちにしか体験できない場所へ旅立ちましょう。',
          bn: 'বেশি বেশি পাহাড় ট্র্যাকিং, গভীর সমুদ্রে ডাইভিং বা গভীর বনে ক্যাম্পিংয়ের মতো দুঃসাহসী ট্যুরগুলো এখনই করে ফেলুন।',
          ar: 'لا تؤجل الرحلات التي تتطلب مجهوداً رائعاً كمسارات الجبال والغطس في البحار العميقة.',
          pt: 'Não adie viagens fisicamente exigentes como trilhas de alta altitude e mergulho.',
          ru: 'Не откладывайте поездки, требующие физических сил: высотный хайкинг, дайвинг, дикие экспедиции.',
          zh: '不要推迟对体力要求极高的世界地级景观旅途，如高海拔徒步登山、深海潜水探秘。',
          it: 'Non rimandare viaggi faticosi come trekking ad alta quota o esplorazioni subacquee.',
          tr: 'Yüksek irtifa yürüyüşleri, derin dalışlar gibi fiziksel güç gerektiren yolculuklarını erteleme.',
          ko: '히말라야 하이킹, 미지의 산호초 다이빙 같은 체력이 활발한 순간에만 소화하는 고강도 모험을 떠나세요.',
          vi: 'Đừng trì hoãn những thử thách tốn sức: lội rừng, leo núi cao, hay lặn ngắm san hô biển sâu.',
          id: 'Jangan tunda perjalanan menantang seperti mendaki gunung tinggi atau diving di laut dalam.',
          nl: 'Stel fysiek zware reizen niet uit, zoals backpacken op grote hoogte of duiken bij verre riffen.',
          pl: 'Nie odkładaj wymagających fizycznie wypraw, takich jak góry wysokie czy nurkowanie na rafach.'
        }
      }
    ],
    medium: [
      {
        id: 'a_med_1',
        icon: '🏕️',
        titles: {
          en: 'Blend with Remote Wilderness',
          es: 'Reconectar con la Naturaleza Salvaje',
          fr: 'S\'immerger au Cœur de la Forêt Sauvage',
          de: 'In unberührte Wildnis eintauchen',
          hi: 'सुदूर जंगलों और वनों के जीवन से जुड़ें',
          ja: '大自然の中に深く身を置くキャンプ体験',
          bn: 'বন্য প্রকৃতি ও ক্যাম্পিংয়ের অনন্য অভিজ্ঞতা',
          ar: 'الانسجام مع غابات الطبيعة النائية',
          pt: 'Conectar-se com a Natureza Selvagem',
          ru: 'Погрузитесь в дикую природу',
          zh: '去没有电网的僻静荒野安营扎寨',
          it: 'Immergiti nella Natura Più Incontaminata',
          tr: 'Ehlileşmemiş Doğada Kamp Kur',
          ko: '디지털 해독을 겸한 대자연 오지 캠핑',
          vi: 'Hòa mình trọn vẹn vào Thiên nhiên Hoang sơ',
          id: 'Menyatu dengan Alam Liar',
          nl: 'Geniet van Pure Wildernis & Kamperen',
          pl: 'Zanurz się w dzikiej naturze'
        },
        descs: {
          en: 'Spend time camping off the grid. Experiencing clear night skies and untouched nature restores dopamine receptors.',
          es: 'Pasa tiempo acampando desconectado. Admirar cielos estrellados cura los receptores de dopamina.',
          fr: 'Passez du temps hors réseau. Les ciels étoilés régénèrent vos récepteurs de dopamine.',
          de: 'Campen Sie abseits des Netzes. Sternenhimmel und reine Luft erholen die Gehirnchemie nachhaltig.',
          hi: 'डिजिटल लाइफ को बंद करके पहाड़ों पर टेंट लगवाएं। प्राकृतिक शांति और टिमटिमाते सितारे मन बदल देंगे।',
          ja: '電波の届かない星降る夜。スマホから完全に遮断された静寂と光害のない宇宙を体験します。',
          bn: 'অন্তত দু-এক রাত ফোন বন্ধ রেখে তারার মেলা দেখতে লোকালয় থেকে দূরে গিয়ে ক্যাম্পিং করুন।',
          ar: 'اقضِ وقتاً في التخييم بعيداً عن صخب التكنولوجيا. سماء مرصعة بالنجوم توازن طاقتك.',
          pt: 'Campine sem internet. Estar sob um céu estrelado purifica a mente e renova o prazer de viver.',
          ru: 'Поживите пару дней в палатке без интернета. Чистое звездное небо очистит мысли и снизит уровень тревоги.',
          zh: '选一周告别手机信号与社交媒体，在绝对纯净的星空密林下围炉烧篝火，极度舒缓浮躁心境。',
          it: 'Campeggia disconnesso dal mondo. Contemplare cieli stellati azzera il cortisolo e rigenera la mente.',
          tr: 'Şehir hayatından uzak, şebekesiz kamp yap. Berrak ve yıldızlı gökyüzü zihnini tamamen arındıracaktır.',
          ko: '인터넷 와이파이가 터지지 않는 호숫가 텐트에서 저녁을 지내세요. 오파민 도파민 중독이 치료됩니다.',
          vi: 'Trải qua vài đêm tắt điện thoại rừng sâu, ngắm trời đầy sao để làm mới dòng suy nghĩ của bản thân.',
          id: 'Berkemahlah di tempat sunyi tanpa internet. Pemandangan bintang-bintang murni menyembuhkan mental.',
          nl: 'Kampeer afgezonderd van de bewoonde wereld. Heldere sterrenhemels herstellen je mentale balans.',
          pl: 'Spędź czas pod namiotem z dala od cywilizacji. Czyste rozgwieżdżone niebo zregeneruje Twój umysł.'
        }
      }
    ],
    short: [
      {
        id: 'a_sh_1',
        icon: '🌸',
        titles: {
          en: 'Immersive Seasonal Retreats',
          es: 'Retiros Estacionales Immersivos',
          fr: 'Des Retraites Saisonnières Paisibles',
          de: 'Saisonale Entspannungsorte entdecken',
          hi: 'सीजनल रिसॉर्ट्स और कुटीरों का अनुभव',
          ja: '季節の移り変わりを楽しむ長期滞在',
          bn: 'ঋতুভিত্তিক মনোরম অবকাশ যাপন',
          ar: 'خلوات موسمية هادئة في الطبيعة',
          pt: 'Retiros Sazonais de Ritmo Lento',
          ru: 'Сезонный медитативный отдых',
          zh: '随四季迁陟慢旅温泉静修',
          it: 'Ritiro Stagionale e Rigenerante',
          tr: 'Sakince Mevsimlik Kamp / Dinlenme',
          ko: '계절의 색채를 묵묵히 즐기는 힐링스테이',
          vi: 'Những Kỳ nghỉ Dưỡng chậm theo Mùa',
          id: 'Retret Musiman yang Tenang',
          nl: 'Ontspannende Retraites in Elk Seizoen',
          pl: 'Zatapianie się w urokach pór roku'
        },
        descs: {
          en: 'Travel at a slow pace. Visit hot springs, autumn forest cabins, or calm lakeside walks. Absorb beauty with absolute ease.',
          es: 'Viaja despacio. Visita aguas termales, cabañas en el bosque, senderos fluviales pacíficos sin prisa.',
          fr: 'Voyagez lentement. Visitez des sources chaudes, des chalets et marchez au bord de lacs calmes.',
          de: 'Reisen Sie langsam. Genießen Sie heiße Quellen, herbstliche Berghütten und ruhige Seenlandschaften.',
          hi: 'धीमी गति से यात्रा करें। गर्म पानी के झरनों, पतझड़ के जंगलों के कॉटेज या शांत झीलों के पास रुकें।',
          ja: '温泉地、紅葉に染まる山。ただ散歩し、地元の食材を堪能する、ゆったりとした時間を愛でます。',
          bn: 'ধীরগতির ভ্রমণ করুন। কোনো পাহাড়ি নীরব কুটিরে বা শান্ত হ্রদের ধারে বসে চা পান করুন এবং স্নিগ্ধ সৌন্দর্য উপভোগ করুন।',
          ar: 'سافر بوتيرة هادئة. زر الينابيع الحارة وغابات الخريف ومناطق الهدوء في الجبال.',
          pt: 'Viaje devagar. Visite águas termais, chalés de floresta no outono e faça caminhadas silenciosas.',
          ru: 'Путешествуйте не спеша. Термальные источники, домики в горах, созерцание листопада у озера.',
          zh: '去山间泡地热温泉，租一栋秋色浸染的林间小木屋，在平缓安详的节奏里重温天人合一。',
          it: 'Viaggia con lentezza. Visita terme naturali, cottage nel bosco e laghi alpini senza orologi.',
          tr: 'Yavaş ritimle seyahat et. Kaplıcaları, sonbahar orman kulübelerini ziyaret et, sakin göl kenarında yürü.',
          ko: '유명 관광지를 가기보다 시골 온천마을, 가을 산장 객실에 보름 이상 머물며 자연의 흐름을 즐기세요.',
          vi: 'Nghỉ dưỡng tĩnh lặng. Ghé thăm các hồ nước nóng, cabin mùa thu giữa rừng thông và mỉm cười nhẹ nhàng.',
          id: 'Nikmati perjalanan santai. Datangi pemandian air hangat atau kabin hutan di tepi danau yang sepi.',
          nl: 'Reis in een rustig tempo. Bezoek warmwaterbronnen, gezellige boshutten en kalme meren.',
          pl: 'Podróżuj leniwym tempem. Odwiedzaj źródła termalne i leśne domki, ciesząc się pięknem chwili.'
        }
      }
    ]
  },
  connections: {
    long: [
      {
        id: 'c_long_1',
        icon: '👥',
        titles: {
          en: 'Cultivate High-Density Friendship circles',
          es: 'Cultivar Círculos de Amigos de Confianza',
          fr: 'Cultiver un Cercle d\'Amis Loyaux',
          de: 'Echte lebenslange Freundschaften tief pflegen',
          hi: 'गहरे और विश्वसनीय मित्रों का समूह बनायें',
          ja: '真のが生涯の親友グループを築く',
          bn: 'অটুট ও বিশ্বস্ত বন্ধুদের পরিধি বৃদ্ধি',
          ar: 'تكوين دوائر صداقة موثوقة وعميقة',
          pt: 'Cultivar Círculos de Amizade de Alta Confiança',
          ru: 'Создайте крепкий круг преданных друзей',
          zh: '悉心构建两三口深度知心死党圈',
          it: 'Coltiva Amicizie Sincere e Affidabili',
          tr: 'Yüksek Güvene Dayalı Dostluk Halkaları Oluştur',
          ko: '평생 함께 웃을 든든한 소수정예 소울메이트 그룹',
          vi: 'Gieo mầm Những Cột mốc Tình bạn Tri kỷ',
          id: 'Bentuk Lingkaran Pertemanan Sejati',
          nl: 'Bouw aan Hechte & Waardevolle Vriendschappen',
          pl: 'Zbuduj krąg wiernych i szczerych przyjaciół'
        },
        descs: {
          en: 'Assemble 3-5 friends who you call regularly. This network buffer is proven to lower all-cause mortality rates by 50%.',
          es: 'Consigue 3-5 amigos íntimos en los que apoyarte. Esto está demostrado que reduce la mortalidad prematura.',
          fr: 'Créez un noyau de 3-5 amis proches. Ce réseau solidaire réduit l\'anxiété globale.',
          de: 'Finden Sie 3-5 Menschen, auf die Sie sich blind verlassen können. Soziale Wärme hält gesund.',
          hi: 'कम से कम 3-5 ऐसे सच्चे दोस्त रखें जिनसे रोज बातें हों। यह खुशी और मानसिक बल को हमेशा बनाए रखेगा।',
          ja: '何でも気軽に話せる3〜5人の親友。強固な共同体は、寂しさをなくし心肺と寿命を大幅に改善します。',
          bn: 'জীবনযুদ্ধে পাশে পাওয়ার মতো ৩-৫ জন বেস্ট ফ্রেন্ড রাখুন। সুখী হওয়ার সবচেয়ে দুর্দান্ত চাবিকাঠি এটি।',
          ar: 'اختر 3-5 أصدقاء رائعين للتحدث معهم دورياً. هذه الشبكة تدعم الاستقرار النفسي تماماً.',
          pt: 'Mantenha de 3 a 5 amigos leais por perto. Bons vínculos reduzem os riscos de doenças mentais.',
          ru: 'Найдите 3–5 близких друзей, с которыми можно разделить всё. Поддержка снижает стресс.',
          zh: '保留3到5位相互无话不谈、有难必帮的至交，良好的情绪依偎能为你遮风避雨。',
          it: 'Trova 3 o 5 anime simili con cui condividere la vita. Le buone relazioni aumentano la longevità.',
          tr: 'Sık sık dertleştiğin 3-5 candan arkadaş biriktir. En güçlü antibiyotik sevgi dolu bir topluluktur.',
          ko: '어떤 시련이 있어도 기댈 수 있는 수평적 친구 3-5명을 가꾸세요. 노후 만성 스트레스의 최고 방어벽입니다.',
          vi: 'Kết nối chặt chẽ với 3-5 người bạn thân thiết nhất. Những cuộc gọi tâm tình giúp bồi đắp hạnh phúc.',
          id: 'Jalin erat hubungan dengan 3-5 sahabat dekat. Ikatan sosial yang tulus menjaga kesehatan jiwa.',
          nl: 'Investeer in 3-5 oprechte vrienden. Sterke sociale banden verhogen het levensgeluk aanzienlijk.',
          pl: 'Zaprzyjaźń się blisko z 3-5 osobami. Prawdziwe relacje chronią przed samotnością i stresem.'
        }
      }
    ],
    medium: [
      {
        id: 'c_med_1',
        icon: '✉️',
        titles: {
          en: 'Write Your Unsent Letters Now',
          es: 'Escribir las Cartas de Agradecimiento',
          fr: 'Écrire les Lettres d\'Amour Oubliées',
          de: 'Unverschickte Briefe an Herzensmenschen schreiben',
          hi: 'अपने प्रियजनों को स्नेह और आभार पत्र लिखें',
          ja: '大切な人たちへ宛てた未送信の手紙をしたためる',
          bn: 'আবেগমাখা মনের অব্যক্ত কথাগুলো লিখে ফেলা',
          ar: 'كتابة الرسائل القلبية المؤجلة للمقربين',
          pt: 'Escrever Cartas Sinceras a quem Amamos',
          ru: 'Напишите искренние письма близким',
          zh: '给真爱的人们手写一封真挚感恩信',
          it: 'Scrivi Lettere di Ringraziamento a chi Ami',
          tr: 'Yazamadığın Teşekkür Mektuplarını Gönder',
          ko: '지금까지 수줍어 말하지 못한 이들에게 손편지 쓰기',
          vi: 'Viết những Lá thư Gửi gắm Lòng biết ơn',
          id: 'Tulis Surat Cinta & Harapan yang Pernah Tertunda',
          nl: 'Schrijf Hartelijke Brieven aan Geliefden',
          pl: 'Napisz niewysłane dotąd listy wdzięczności'
        },
        descs: {
          en: 'Don\'t leave gratitude unexpressed. Pen beautiful messages to mentors, parents, and friends while they are alive.',
          es: 'No dejes la gratitud en el tintero. Escribe hermosas cartas a mentores, padres o amigos del pasado.',
          fr: 'Ne cachez pas votre gratitude. Écrivez des lettres touchantes aux mentors, parents et amis.',
          de: 'Verschweigen Sie Ihre Dankbarkeit nicht. Schreiben Sie Eltern, Mentoren oder Partnern handgeschriebene Briefe.',
          hi: 'आभार व्यक्त करना न भूलें। अपने माता-पिता, गुरु और पुराने सहपाठियों को लिखित रूप में धन्यवाद कहें।',
          ja: '恩師、旧友、両親へ。感謝の言葉はためらわずに文字にして、伝えるべき瞬間に手渡しましょう。',
          bn: 'আপনার জীবনের মেন্টর, বাবা-মা বা প্রিয় মানুষদের মন থেকে গভীর কৃতজ্ঞতা জানিয়ে সুন্দর চিঠি পাঠান।',
          ar: 'لا تترك مشاعر الامتنان حبيسة قلبك. اكتب كلمات شكر لوالديك، رفقائك، ومن علموك قيمة الحياة.',
          pt: 'Expresse gratidão. Escreva palavras sinceras para seus pais, mentores ou velhos amigos.',
          ru: 'Выражайте благодарность. Напишите теплое письмо наставнику, родителям или старому другу.',
          zh: '不要吝啬诉说爱意。用带有温度的墨水手写信，亲手交予你的挚友、父母或启发你的导师。',
          it: 'Esprimi la tua gratitudine. Scrivi lettere piene d\'affetto a genitori, maestri e vecchi amici.',
          tr: 'Şükranlarını ifade etmeyi sonraya bırakma. Anne babana, öğretmenine ya da kadim dostuna minnet mektubu yaz.',
          ko: '마음 속 고마움을 그냥 묻어두지 마세요. 부모님, 인생의 멘토, 그리운 동창에게 연하장을 선물해 보세요.',
          vi: 'Hãy bày tỏ sự cảm kích khi còn có thể. Viết những phong thư gửi bố mẹ, ân sư hay chiến hữu tri âm.',
          id: 'Nyatakan rasa terima kasih Anda. Kirim surat indah kepada orang tua, mentor, atau teman lama.',
          nl: 'Laat dankbaarheid niet onuitgesproken. Schrijf brieven aan je ouders, mentoren en vrienden.',
          pl: 'Wyraź swoją wdzięczność już dzisiaj. Wyślij odręczny list rodzicom, nauczycielom lub dawnym druhom.'
        }
      }
    ],
    short: [
      {
        id: 'c_sh_1',
        icon: '👨‍👩‍👧‍👦',
        titles: {
          en: 'Weekly Family Dinner Circles',
          es: 'Círculos de Cenas Familiares Regulares',
          fr: 'Les Dîners Familiaux Traditionnels',
          de: 'Wöchentliche gemütliche Familienrunden',
          hi: 'साप्ताहिक पारिवारिक भोज का समय',
          ja: '毎週一度、愛する家族や仲間との語らい夕食会',
          bn: 'সাপ্তাহিক পারিবারিক আড্ডা ও মধ্যাহ্নভোজ',
          ar: 'حلقات العشاء الأسبوعية العائلية المشتركة',
          pt: 'Jantares em Família com Presença Plena',
          ru: 'Еженедельный семейный праздничный обед',
          zh: '回归每周一次合家围炉晚餐夜',
          it: 'Invita a Cena i Tuoi Cari Ogni Settimana',
          tr: 'Haftalık Aile Yemeği ve Sıcak Buluşma',
          ko: '식탁 위의 따스함, 온 가족 주말 포트럭 파티',
          vi: 'Mâm cơm Gia đình Sum vầy Hàng tuần',
          id: 'Lingkaran Makan Malam Bersama Keluarga Baru',
          nl: 'Wekelijks Gezellig Dineren met Familie',
          pl: 'Wspólna rodzinna wieczerza co tydzień'
        },
        descs: {
          en: 'Bake meals together, share old childhood stories, and practice multi-generational active listening. Safe bonds create high vitality.',
          es: 'Cocinen juntos, compartan risas e historias y practiquen la escucha sincera. Vínculos sanos salvan vidas.',
          fr: 'Cuisinez ensemble, partagez vos histoires d\'enfance et écoutez-vous avec amour.',
          de: 'Kochen Sie gemeinsam, erzählen Sie alte Geschichten und hören Sie einander aufmerksam zu.',
          hi: 'साथ में खाना पकाएं, पुराने बचपन के किस्से छेड़ें और मुस्कुराएं। पारिवारिक संबल दीर्घायु होने की अचूक दवा है।',
          ja: '一緒に料理を作り、懐かしい昔話を再現。マルチジェネレーションの語らいは、無上の幸福を家族に宿します。',
          bn: 'সবাই মিলে মজা করে রান্না করুন, চমৎকার সব নস্টালজিক গল্প শেয়ার করুন এবং নিজেদের মজবুত বাঁধন উপভোগ করুন।',
          ar: 'اطهوا معاً، استرجعوا قصص الطفولة، واسمعوا لبعضكم بقلب منفتح. الترابط الأسري سر الابتهاج الصامت.',
          pt: 'Cozinhem juntos, relembrem histórias de infância e exercitem a escuta ativa.',
          ru: 'Готовьте вместе, делитесь воспоминаниями и слушайте друг друга. Любовь в семье — лучшая терапия.',
          zh: '下厨烹调家常饭菜，在热气腾腾的餐桌上分享童年往事与真切近况，加深多代人之间的认同与依恋。',
          it: 'Cucinate insieme, ricordate la giovinezza e ascoltatevi sinceramente. L\'amore autentico riscalda il cuore.',
          tr: 'Beraber yemek pişirin, çocukluk anılarını tazeleyin ve gözlerinin içine bakarak dinle. Sevgi bağları can verir.',
          ko: '할머니와 손자가 일주일간의 사소한 즐거움을 나누며 눈을 마주하세요. 소속감과 행복감이 만개합니다.',
          vi: 'Cùng nhau tự tay nấu nướng, tâm sự chuyện của các thế hệ để gieo đắp điểm tựa vững chãi nhất.',
          id: 'Masak bersama, tertawa bercerita tentang masa lalu, aktif merangkul keluarga. Kebersamaan melipatgandakan imun.',
          nl: 'Kook samen, deel jeugdherinneringen en luister echt naar elkaar. Veilige binding versterkt de vitaliteit.',
          pl: 'Gotujcie razem, wspominajcie dzieciństwo i słuchajcie siebie nawzajem. Bliskość to źródło radości.'
        }
      }
    ]
  },
  mind: {
    long: [
      {
        id: 'm_long_1',
        icon: '🎹',
        titles: {
          en: 'Master an Artistic Craft & Coding',
          es: 'Dominar un Instrumento o la Programación creativa',
          fr: 'Maîtriser un Art de Création et le Code',
          de: 'Ein Instrument oder kreatives Coden lernen',
          hi: 'एक कलात्मक विधा या कोडिंग में निपुणता पायें',
          ja: '楽器演奏、芸術的な職人技、プログラミング習得',
          bn: 'মনোরম সুর তৈরি বা প্রোগ্রামিং স্কিল তৈরি',
          ar: 'احتراف أداة موسيقية أو البرمجة الإبداعية',
          pt: 'Dominar uma Nova Arte ou Programação Criativa',
          ru: 'Освойте творческое ремесло или программирование',
          zh: '攻克一门乐器弹奏或硬核科技编程',
          it: 'Impone un Strumento Musicale o l\'Arte dei Codici',
          tr: 'Enstrüman Çalmayı ya da Yaratıcı Kodlamayı Öğren',
          ko: '새로운 악기 다루기 또는 세상을 바꾸는 소프트웨어 빌드',
          vi: 'Học chơi Nhạc cụ hoặc Lập trình Sáng tạo',
          id: 'Kuasai Alat Musik Baru atau Coding Kreatif',
          nl: 'Leer een Instrument Bespelen of Creatief Coderen',
          pl: 'Opanuj instrument muzyczny lub kreatywne kodowanie'
        },
        descs: {
          en: 'Settle into learning piano, painting, or software creation. Neurological plasticity explodes when studying complex patterns.',
          es: 'Aprende piano, óleo o desarrollo de software para expandir tu plasticidad sináptica.',
          fr: 'Apprenez le piano, la peinture ou le codage pour démultiplier vos capacités intellectuelles.',
          de: 'Lernen Sie Klavier spielen, malen oder Software erstellen. Komplexe Muster erhalten Ihr Gehirn flexibel.',
          hi: 'पियानो बजाना, पेंट करना या प्रोग्राम बनाना शुरू करें। जब आप जटिल नई चीजें करते हैं, तो दिमाग तेज होता है।',
          ja: 'ピアノ、絵の具、アプリ設計。複雑な運動パターンの習得は脳の神経可塑性を引き出し、明晰さを保ちます。',
          bn: 'পিয়ানো বাজানো, ক্যানভাসে ছবি আঁকা বা কোডিং শিখে অ্যাপ তৈরি করুন। এই প্রচেষ্টাগুলোর মাধ্যমে মস্তিষ্কের কার্যকারিতা বাড়ে।',
          ar: 'ابدأ بتعلم البيانو، الرسم، أو برمجة ال برمجيات. مرونة الدماغ تنمو بقوة عند ممارسة الأنماط المعقدة.',
          pt: 'Aprenda piano, artes plásticas ou desenvolvimento de aplicativos. Estimule a neuroplasticidade.',
          ru: 'Начните играть на пианино, рисовать или писать код. Это стимулирует появление нейронных связей.',
          zh: '自学钢琴独奏、油画创作或构建小而美的Web工具。复杂的感官与逻辑联动，能够重塑大脑皮层神经突触。',
          it: 'Impara il pianoforte, la pittura a olio o lo sviluppo web. Nuovi percorsi neurali tengono la mente nitida.',
          tr: 'Piyano çalmayı, heykel yapmayı ya da yazılımcılığı öğren. Zihinsel esnekliği zirvede tutacaktır.',
          ko: '클래식 피아노 마스터, 수채화 일러스트, 유용한 사이트 구축에 도전하세요. 뇌 가소성이 전례 없이 폭발합니다.',
          vi: 'Đắm mình ghép nhạc piano, vẽ tranh sơn dầu, hay coding phát triển app. Nhựa sống não bộ sẽ thăng hoa.',
          id: 'Belajarlah bermain piano, melukis, atau membuat perangkat lunak. Plastisitas saraf meledak saat mengolah pola rumit.',
          nl: 'Leer piano spelen, schilderen of codeer software. Complexe patronen stimuleren de plasticiteit van je brein.',
          pl: 'Zacznij uczyć się gry na pianinie, malowania lub kodowania. Rozwijanie nowych talentów ożywia mózg.'
        }
      }
    ],
    medium: [
      {
        id: 'm_med_1',
        icon: '📚',
        titles: {
          en: 'Write and Author Your Memoir',
          es: 'Escribir tu Propia Autobiografía',
          fr: 'Rédiger et Publier Vos Mémoires',
          de: 'Ihre persönlichen Lebenserinnerungen aufschreiben',
          hi: 'अपनी आत्मकथा और संस्मरणों को लिखना शुरू करें',
          ja: '自分自身の半生を綴る「自叙伝・回顧録」の執筆',
          bn: 'নিজের জীবনী ও চমৎকার সব স্মৃতিচারণ লেখা',
          ar: 'تدوين ونشر مذكراتك وقصة كفاحك',
          pt: 'Escrever Sua Própria Autobiografia',
          ru: 'Напишите свою биографию или мемуары',
          zh: '撰写出版你人生路上的非凡自传',
          it: 'Scrivi e Autora le Tue Ricorrenze e Memorie',
          tr: 'Otobiyografini ve Hayat Anılarını Yaz',
          ko: '한 자 한 자 내 삶을 정돈해 나가는 자서전 집필',
          vi: 'Viết và Lưu lại Hồi ký Đời mình',
          id: 'Tulis dan Susun Buku Memoar Hidup Anda',
          nl: 'Schrijf Je Memoires of Biografie',
          pl: 'Napisz i wydaj swoją autobiografię'
        },
        descs: {
          en: 'Reflect on childhood lessons, golden struggles, and values. Leave a structured written legacy for generations.',
          es: 'Reflexiona sobre las lecciones de tu infancia e historia de superación. Deja un legado escrito coherente.',
          fr: 'Partagez vos victoires, vos leçons et vos valeurs. Laissez un héritage écrit pour l\'avenir.',
          de: 'Denken Sie an Ihre prägenden Momente und Erfolge zurück. Schenken Sie Ihren Nachkommen Ihre Geschichte.',
          hi: 'बचपन के सुख-दुख और संघर्ष के पलों को संजोएं। अपनी अगली पीढ़ी के मार्गदर्शक के रूप में अपने विचारों को लिखें।',
          ja: '泥をくぐり抜けた過去の体験、教訓、信念。残された子供たちや未来へ届ける温かな生きた歴史書となります。',
          bn: 'আপনার ছোটবেলার স্মৃতি, দারুণ সব লড়াই আর জীবনের অর্জিত শিক্ষাগুলো ডায়রিতে লিখে অনন্য রূপদান করুন।',
          ar: 'تأمل في فصول حياتك، نجاحاتك والدروس الصعبة التي واجهتها. اترك إرثاً مكتوباً يستلهم منه أبناؤك.',
          pt: 'Reflita sobre lições da infância e vitórias do passado. Deixe um legado escrito valoroso para os seus.',
          ru: 'Вспомните уроки юности и пройденные испытания. Каждое воспоминание — ценный учебник для потомков.',
          zh: '梳理童年微光、青春奋战和宝贵处世经验。整理成册装订好，这是馈赠子孙后代沉甸甸的黄金精神财富。',
          it: 'Raccogli i momenti salienti, le sfide e le lezioni apprese. Lascia un manoscritto prezioso ai tuoi posteri.',
          tr: 'Çocukluk derslerini, unutulmaz mücadelelerini kaleme al. Gelecek nesillere eşsiz yazılı bir miras bırak.',
          ko: '유라시아 방랑기든, 골목길 청춘이든 내면의 부침과 지혜를 문장화하세요. 고유하고 값진 무형유산이 됩니다.',
          vi: 'Ghi lại bài học thơ ấu, giai đoạn lập nghiệp gian khó và các tôn chỉ sống. Di sản giấy viết vô giá cho con cháu.',
          id: 'Renungkan perjalanan hidup dan kebijaksanaan Anda. Buat warisan tertulis bernilai sejarah untuk keturunan Anda.',
          nl: 'Reflecteer op de lessen uit je jeugd en je behaalde successen. Laat een geschreven testament achter.',
          pl: 'Spisz lekcje z dzieciństwa i przeżyte chwile. Zostaw pisany ślad dla wnuków i bliskich.'
        }
      }
    ],
    short: [
      {
        id: 'm_sh_1',
        icon: '🌺',
        titles: {
          en: 'Mindful Daily Meditations & Satori',
          es: 'Meditaciones Diarias y Momento de Paz',
          fr: 'Méditations Conscientes et Satori Nocturne',
          de: 'Achtsame tägliche Meditationen & Seelenfrieden',
          hi: 'दैनिक आत्मिक ध्यान और चैतन्य समाधि',
          ja: '今日という日を愛おしむ正念瞑想と「悟り」の時間',
          bn: 'গভীর পরম শান্ত মেডিটেশন ও আত্ম উপলব্ধি',
          ar: 'تأملات يومية في الطبيعة والهدوء الروحي',
          pt: 'Praticar Meditação e Conexão Interior Diária',
          ru: 'Ежедневная мягкая медитация',
          zh: '日落时分呼吸冥想与“顿悟”内省',
          it: 'Meditazioni Quotidiane di Piena Presenza',
          tr: 'Her Gün Bir Defa Anda Kalma Egzersizi',
          ko: '지금 여기에 온전히 현존하는 호흡 수련과 명상',
          vi: 'Thiền Chánh niệm và Cảm nghiệm cái Đẹp',
          id: 'Meditasi Tenang & Syukur Setiap Subuh',
          nl: 'Dagelijkse Meditatie & Rustmomenten',
          pl: 'Świadoma i wyciszająca medytacja każdego rana'
        },
        descs: {
          en: 'Live strictly in the present moment. Observe flowers blooming, appreciate the birds, and find joy in every sunrise.',
          es: 'Vive estrictamente en el presente. Observa las flores abrirse, escucha las aves y sé feliz con cada amanecer.',
          fr: 'Vivez strictement dans le présent. Regardez les fleurs éclore, observez les oiseaux et souriez au soleil.',
          de: 'Leben Sie bewusst im Hier und Jetzt. Riechen Sie an Blumen, lauschen Sie Vögeln und feiern Sie jeden Sonnenaufgang.',
          hi: 'वर्तमान क्षण में रहने का आनंद लें। खिलते फूलों को निहारें, पक्षियों का संगीत सुनें और उदित होते सूर्य का स्वागत करें।',
          ja: '「いま、ここ」を徹底的に呼吸します。咲いた野花の色、鳥たちの調べ、朝陽の暖かさに心から感謝する生活。',
          bn: 'একদম বর্তমান মুহূর্তে বেঁচে থাকুন। প্রতিদিন ফোটা ফুল দেখুন, পাখিদের কিচিরমিচির উপভোগ করুন এবং প্রতি ভোরের সূর্যকে হাসিমুখে বরণ করুন।',
          ar: 'عش بكل جوارحك في اللحظة الحالية. راقب تفتح الزهور، استمع لتغريد الطيور، وابتهج بكل شروق شمس.',
          pt: 'Viva estritamente no aqui e agora. Sinta o perfume das flores e admire o sol nascer.',
          ru: 'Живите исключительно в настоящем. Наблюдайте за цветением садов, слушайте пение птиц и цените каждое утро.',
          zh: '百分之百活在当下。凝视每一朵蔷薇的绽放、倾听麻雀在屋檐的清鸣，在每一缕晨光中品味生命的纯粹。',
          it: 'Dimora stabilmente nel momento presente. Osserva i petali schiudersi, ascolta gli uccellini e ammira l\'alba.',
          tr: 'Tamamen şimdiki anda yaşa. Çiçeklerin açışını izle, kuşların cıvıltısını dinle, her yeni günün sabahına şükret.',
          ko: '철저히 "현재"에 집중해 사세요. 피어나는 들꽃을 멍하니 보고, 지저귀는 새소리의 완벽한 음향을 감상하며 웃으세요.',
          vi: 'Sống trọn vẹn từng khắc hiện tại. Nhìn hoa cỏ đọng sương mai, nghe chim hót líu lo, ngắm hoàng hôn đỏ thắm.',
          id: 'Hiduplah sepenuhnya di detik ini. Sadari mekarnya kembang pagi, senandungkan lagu syukur atas indahnya fajar.',
          nl: 'Leef strikt in het nu. Geniet van bloeiende bloemen, zingende vogels en wees dankbaar voor de ochtendzon.',
          pl: 'Żyj uważnie tu i teraz. Podziwiaj rozkwitające ogrody, słuchaj ptaków i celebruj każdy świt.'
        }
      }
    ]
  }
};
