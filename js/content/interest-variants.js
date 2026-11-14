/*
 * Варианты уроков по интересам: меняются роль, задача и способ принятия решения,
 * языковая цель и основные задания урока — нет.
 *
 * Вариант — это обычная запись в lesson.contexts с ключом 'v-<направление>' и полями:
 *   interests — для каких направлений вариант (FEA.directions[].id);
 *   mode      — тип учебного действия (FEA.actionModes);
 *   role      — кто ученик в этом варианте;
 *   label     — короткое название для выбора варианта;
 *   mission   — { title, scene } — сцена миссии для этой роли;
 *   textHeading — заголовок шага с материалом (что сделать с текстом);
 *   text, tasks — материал и 2 задания: решение по тексту + использование целевой формы.
 * В выборе (choice) можно задать outcomes[i] — последствие выбора варианта i.
 *
 * Ключи ответов основных заданий уроков здесь не меняются.
 * Все персонажи, места и события вымышленные. Казахские тексты не проверены носителем языка.
 */
(function () {
  var C = FEA.choice, T = FEA.typed;
  var byId = {};
  FEA.lessons.forEach(function (l) { byId[l.id] = l; });

  function variant(lessonId, key, v) {
    var l = byId[lessonId];
    if (!l) throw new Error('interest-variants: нет урока ' + lessonId);
    if (l.contexts[key]) throw new Error('interest-variants: повтор варианта ' + lessonId + '/' + key);
    l.contexts[key] = Object.assign({ themeWords: [] }, v);
  }

  // =====================================================================
  // ПИЛОТ: s2-grammar-2 «bigger / more interesting»
  // Цель для всех вариантов: сравнить две вещи (-er / more + than) и использовать форму.
  // =====================================================================
  var L = 's2-grammar-2';

  variant(L, 'v-strategy', {
    task: 'ойын ережесін оқып, қамалға апаратын жолды таңдау',   // [не проверено носителем]
    interests: ['strategy'], mode: 'plan', role: 'Команда капитаны', label: 'Капитан: жолды таңда',
    mission: { title: 'Қамалға үш жүріс', scene: 'Сіз — үстел ойынындағы команда капитанысыз. Қамалға дейін екі жол бар. Ережені оқып, команда үшін жол таңдаңыз және шешіміңізді ағылшынша түсіндіріңіз.' },
    textHeading: 'Ойын ережесін оқып, екі жолды салыстырыңыз',
    text: {
      title: 'Two roads to the castle',
      lines: [
        'In our board game, my team must reach the castle in three turns.',
        'The mountain road is shorter than the river road, but it is more dangerous: a storm card can stop you for one turn.',
        'The river road is longer, but it is safer.',
        'With a boat card, the river road is faster than the mountain road.',
        'We have a boat card.'
      ],
      glossary: [{ en: 'turn', kk: 'жүріс' }, { en: 'dangerous', kk: 'қауіпті' }, { en: 'storm card', kk: 'дауыл картасы' }]
    },
    tasks: [
      C('Команда қай жолды таңдауы керек? Мәтіндегі салыстыруға сүйеніңіз.', [
        'Өзен жолын: қайық картасымен ол жылдамырақ әрі қауіпсіздеу',
        'Тау жолын: ол қысқарақ',
        'Айырмашылығы жоқ, кез келгенін'
      ], 0,
        'With a boat card, the river road is faster, және it is safer. Тау жолы қысқарақ (shorter), бірақ more dangerous.',
        { outcomes: [
          'Команда қамалға үшінші жүрісте жетті.',
          'Дауыл картасы шықты — команда бір жүріс тұрып қалды.',
          'Команда таласып, уақыт өтіп кетті.'
        ] }),
      T('Таңдауыңызды командаға түсіндіріңіз. Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['safer'],
        'safe — қысқа сөз, соңы -e, сондықтан тек -r қосылады: safer.', { sentence: 'The river road is ___ (safe) than the mountain road.' })
    ]
  });

  variant(L, 'v-build', {
    task: 'өлшемдерді салыстырып, сөре неге шайқалатынын табу',   // [не проверено носителем]
    interests: ['build'], mode: 'diagnose', role: 'Шебер', label: 'Шебер: сөрені жөнде',
    mission: { title: 'Шайқалатын сөре', scene: 'Сіз нұсқаулық бойынша кітап сөресін құрастырдыңыз, бірақ ол шайқалады. Өлшемдерді салыстырып, себебін тауып, шешімін ағылшынша айтыңыз.' },
    textHeading: 'Нұсқаулық пен өлшемдерді оқыңыз',
    text: {
      title: 'The wobbly shelf',
      lines: [
        'Step 1: Fix the four legs to the top board.',
        'Step 2: Check that all four legs are the same length.',
        'My shelf wobbles. Three legs are 60 cm, but the back left leg is 58 cm.',
        'I have two pads: a thin pad (1 cm) and a thick pad (2 cm).'
      ],
      glossary: [{ en: 'wobbles', kk: 'шайқалады' }, { en: 'length', kk: 'ұзындық' }, { en: 'pad', kk: 'төсеме' }]
    },
    tasks: [
      C('Сөре неге шайқалады?', [
        'Артқы сол аяғы басқа аяқтардан қысқарақ.',
        'Артқы сол аяғы басқа аяқтардан ұзынырақ.',
        'Төрт аяғының ұзындығы бірдей.'
      ], 0, 'The back left leg is 58 cm, басқалары 60 cm: бұл аяқ shorter — қысқарақ.'),
      C('Қай төсемені қоясыз? Шеберге ағылшынша жауап беріңіз.', [
        'The thick pad, because the leg is 2 cm shorter.',
        'The thin pad, because the leg is 1 cm longer.',
        'The thick pad, because the leg is more short.'
      ], 0, '60 − 58 = 2 cm, сондықтан қалың (2 cm) төсеме. short → shorter; «more short» деп айтпаймыз.',
        { outcomes: [
          'Сөре енді шайқалмайды. Жөндеу аяқталды.',
          'Сөре әлі де шайқалады: 1 cm жетпейді.',
          'Шешім дұрыс, бірақ «more short» — қате тіркес. Шебер сізді түсінбей қалды.'
        ] })
    ]
  });

  variant(L, 'v-design', {
    task: 'екі плакатты салыстырып, көшеден оқылатынын таңдау',   // [не проверено носителем]
    interests: ['design'], mode: 'justify', role: 'Дизайнер', label: 'Дизайнер: плакатты таңда',
    mission: { title: 'Көшеден оқылатын плакат', scene: 'Сіз — дизайнерсіз. Мектеп концертіне екі плакат дайын. Тапсырыс берушінің талабына қарай біреуін таңдап, неге екенін ағылшынша дәлелдеңіз.' },
    textHeading: 'Тапсырыс пен екі плакаттың сипаттамасын оқыңыз',
    text: {
      title: 'Two posters',
      lines: [
        'Ms Aliya needs a poster for the school concert. People must read it from the street.',
        'Poster A has bigger letters and only two colours.',
        'Poster B is more colourful, but its letters are smaller.',
        'Poster A is simpler than Poster B.'
      ],
      glossary: [{ en: 'poster', kk: 'плакат' }, { en: 'from the street', kk: 'көшеден' }, { en: 'letters', kk: 'әріптер' }]
    },
    tasks: [
      C('Тапсырыс берушіге қай плакатты ұсынасыз?', [
        'A плакатын: әріптері үлкенірек, көшеден оқу оңайырақ',
        'B плакатын: ол түрлі түстірек',
        'Ешқайсысын: екеуі де жарамайды'
      ], 0, 'Басты талап — көшеден оқылу. Poster A has bigger letters — әріптері үлкенірек.',
        { outcomes: [
          'Алия апай келісті: плакат көшеден анық оқылады.',
          'Плакат әдемі, бірақ көшеден жазуы оқылмайды.',
          'Концертке дейін плакатсыз қалдыңыз.'
        ] }),
      T('Таңдауыңызды дәлелдеңіз. Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['easier'],
        'easy — соңы -y: y әрпі i-ге ауысып, -er қосылады: easier.', { sentence: 'Poster A is ___ (easy) to read from the street than Poster B.' })
    ]
  });

  variant(L, 'v-money', {
    task: 'екі ұсынысты салыстырып, лимонды қайдан алатынын шешу',   // [не проверено носителем]
    interests: ['money', 'strategy'], mode: 'deal', role: 'Лимонад дүңгіршегінің иесі', label: 'Бизнес: тиімді сатып ал',
    mission: { title: 'Лимонад дүңгіршегі', scene: 'Сенбі сайын лимонад сатасыз. Он лимон керек, бюджет — 1 500 ₸. Екі ұсынысты салыстырып, тиімдісін таңдаңыз және серігіңізге ағылшынша жазыңыз.' },
    textHeading: 'Екі ұсынысты оқып, шығынды есептеңіз',
    text: {
      title: 'Lemons for our stand',
      lines: [
        'We sell lemonade on Saturdays. We need ten lemons.',
        'At Market A, ten lemons cost 1,200 tenge. The market is far: the bus costs 200 tenge.',
        'At Shop B, ten lemons cost 1,500 tenge. The shop is near: we can walk.',
        'Our budget is 1,500 tenge. We also need money for cups.'
      ],
      glossary: [{ en: 'cost', kk: 'тұрады (бағасы)' }, { en: 'far / near', kk: 'алыс / жақын' }, { en: 'budget', kk: 'бюджет' }]
    },
    tasks: [
      C('Лимонды қайдан алған тиімді?', [
        'A базарынан: автобуспен қоса 1 400 ₸, B дүкенінен арзанырақ',
        'B дүкенінен: ол жақын, сондықтан арзанырақ',
        'Ешқайдан: бюджет жетпейді'
      ], 0, '1 200 + 200 = 1 400 ₸ — бұл 1 500 ₸-ден аз. Жақын болу арзан болу дегенді білдірмейді.',
        { outcomes: [
          '100 ₸ үнемдедіңіз — оған стақан аласыз.',
          'Бүкіл бюджет лимонға кетті, стақанға ақша қалмады.',
          'Бюджет жетеді еді — сенбіде дүңгіршек бос тұрды.'
        ] }),
      T('Серігіңізге жазыңыз. Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['cheaper'],
        'cheap — қысқа сөз: cheaper.', { sentence: 'Market A is ___ (cheap) than Shop B, even with the bus.' })
    ]
  });

  variant(L, 'v-investigate', {
    task: 'куәлардың сөзін салыстырып, ұрыны табу',   // [не проверено носителем]
    interests: ['investigate'], mode: 'deduce', role: 'Тергеуші', label: 'Тергеуші: куәларды салыстыр',
    mission: { title: 'Жоғалған велосипед', scene: 'Мектеп ауласынан қызыл велосипед жоғалды. Екі куә ұрының бойы туралы айтты. Деректерді салыстырып, кім ұры болуы мүмкін екенін анықтаңыз.' },
    textHeading: 'Куәлардың сөзі мен деректерді салыстырыңыз',
    text: {
      title: 'Who took the bike?',
      lines: [
        'A red bike disappeared from the school yard.',
        'Witness 1: "The thief was taller than the guard."',
        'Witness 2: "The thief was shorter than me."',
        'The guard is 175 cm. Witness 2 is 185 cm.',
        'Suspects: Arman is 170 cm, Bolat is 180 cm, Dana is 190 cm.'
      ],
      glossary: [{ en: 'thief', kk: 'ұры' }, { en: 'witness', kk: 'куә' }, { en: 'suspects', kk: 'күдіктілер' }]
    },
    tasks: [
      C('Екі куәнің сөзі де шын болса, кім ұры болуы мүмкін?', ['Болат (180 cm)', 'Арман (170 cm)', 'Дана (190 cm)'], 0,
        'taller than the guard — 175 cm-ден ұзын; shorter than Witness 2 — 185 cm-ден қысқа. Екі шартқа тек Болат сай келеді.',
        { outcomes: [
          'Болат велосипедті «уақытша алғанын» мойындады.',
          'Арман күзетшіден аласа — бұл бірінші куәнің сөзіне қайшы.',
          'Дана екінші куәдан ұзын — бұл екінші куәнің сөзіне қайшы.'
        ] }),
      T('Есебіңізді аяқтаңыз. Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['shorter'],
        'short — қысқа сөз: shorter. Арман (170) күзетшіден (175) аласа.', { sentence: 'Arman is not the thief: he is ___ (short) than the guard.' })
    ]
  });

  variant(L, 'v-sport', {
    task: 'қарсылас туралы есепті оқып, шабуыл жағын таңдау',   // [не проверено носителем]
    interests: ['sport'], mode: 'tactics', role: 'Жаттықтырушының көмекшісі', label: 'Тактика: шабуыл жағын таңда',
    mission: { title: 'Қарсылас туралы есеп', scene: 'Сіз — футбол жаттықтырушысының көмекшісісіз. Келесі қарсылас туралы есепті оқып, қапталшы Нұрлан қай жақтан және қалай шабуылдайтынын таңдаңыз.' },
    textHeading: 'Барлау есебін оқыңыз',
    text: {
      title: 'Scouting report',
      lines: [
        'Report on the Eagles, our next opponent.',
        'Their left defender is faster than their right defender.',
        'But the right defender is taller and stronger in the air.',
        'Our winger Nurlan is fast, but he is shorter than both defenders.'
      ],
      glossary: [{ en: 'defender', kk: 'қорғаушы' }, { en: 'in the air', kk: 'биік доп үшін күресте' }, { en: 'winger', kk: 'қапталшы' }]
    },
    tasks: [
      C('Нұрлан қай жақтан және қалай шабуылдағаны дұрыс?', [
        'Оң жақтан, доп жерде: ол жақтағы қорғаушы баяуырақ',
        'Оң жақтан, биік доппен: ол жақтағы қорғаушы ұзын',
        'Сол жақтан, жылдамдықпен озып өту'
      ], 0,
        'The left defender is faster — демек оң жақтағы қорғаушы баяуырақ. Бірақ ол taller, сондықтан биік доп емес, жердегі доп.',
        { outcomes: [
          'Нұрлан қорғаушыдан озып, дәл пас берді.',
          'Ұзын қорғаушы допты басымен қағып жіберді.',
          'Жылдам қорғаушы Нұрланды қуып жетті.'
        ] }),
      T('Жаттықтырушыға қысқа есеп жазыңыз. Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['slower'],
        'slow — қысқа сөз: slower.', { sentence: 'Their right defender is ___ (slow) than their left defender.' })
    ]
  });

  variant(L, 'v-music', {
    task: 'үш үзіндіні салыстырып, қуғын көрінісіне музыка таңдау',   // [не проверено носителем]
    interests: ['music'], mode: 'fragments', role: 'Дыбыс режиссері', label: 'Дыбыс: көрініске музыка таңда',
    mission: { title: 'Қуғын көрінісінің музыкасы', scene: 'Сіз мектеп спектаклінің дыбыс режиссерісіз. Үш қысқа үзіндінің сипаттамасы бар. Қуғын көрінісіне қайсысы сай екенін анықтап, режиссерге түсіндіріңіз.' },
    textHeading: 'Үш үзіндінің сипаттамасын оқыңыз',
    text: {
      title: 'Three sound clips',
      lines: [
        'Clip 1: piano, quiet and slow.',
        'Clip 2: drums, faster and louder than Clip 1.',
        'Clip 3: violin, slower than Clip 2, but louder than Clip 1.',
        'Scene 4 is a chase: the hero runs through the market.'
      ],
      glossary: [{ en: 'clip', kk: 'үзінді' }, { en: 'drums', kk: 'барабан' }, { en: 'chase', kk: 'қуғын' }]
    },
    tasks: [
      C('Қуғын көрінісіне қай үзінді сай келеді?', [
        '2-үзінді: ең жылдамы әрі қаттысы',
        '1-үзінді: тыныш әрі баяу',
        '3-үзінді: 2-үзіндіден баяуырақ'
      ], 0, 'Clip 2 is faster and louder than Clip 1; Clip 3 is slower than Clip 2. Қуғынға ең жылдамы керек.',
        { outcomes: [
          'Көрермендер демін ішіне тартып қарады.',
          'Қуғын кезінде залда біреу есінеп отырды.',
          'Жаман емес, бірақ қуғын баяулап кетті.'
        ] }),
      T('Режиссерге түсіндіріңіз. Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['louder'],
        'loud — қысқа сөз: louder.', { sentence: 'Clip 2 is ___ (loud) than Clip 1.' })
    ]
  });

  variant(L, 'v-daily', {
    task: 'даяшының сөзін түсініп, әжеге ыңғайлы үстел таңдау',   // [не проверено носителем]
    interests: ['daily'], mode: 'dialogue', role: 'Әжесімен кафеге келген немере', label: 'Диалог: үстел таңда',
    mission: { title: 'Әжемен кафеде', scene: 'Әжеңізбен кафеге келдіңіз. Әже шаршаған, тыныш әңгімелескісі келеді. Даяшы екі бос үстел ұсынады. Жауап таңдаңыз — әр жауаптың салдары бар.' },
    textHeading: 'Даяшының сөзін оқыңыз',
    text: {
      title: 'At the café',
      lines: [
        'Waiter: "We have two free tables."',
        'Waiter: "The table by the window is quieter than the table near the kitchen."',
        'Waiter: "But the table near the kitchen is bigger."',
        'You and your grandmother are two people. She is tired.'
      ],
      glossary: [{ en: 'free', kk: 'бос (бұл жерде)' }, { en: 'by the window', kk: 'терезенің жанында' }, { en: 'near the kitchen', kk: 'ас үйдің жанында' }]
    },
    tasks: [
      C('Даяшыға не дейсіз?', [
        'The table by the window, please. It is quieter.',
        'The table near the kitchen, please. It is bigger.',
        'Any table. We are hungry.'
      ], 0, 'Әжеге тыныш жер керек: quieter — тынышырақ. Екі адамға үлкен үстел қажет емес.',
        { outcomes: [
          'Әжеңіз жайлы отырып, асықпай әңгімелесті.',
          'Ас үйдің жанында шулы болды — әжеңіз тез шаршады.',
          'Даяшы сізді ас үйдің жанына отырғызды — шулы болды.'
        ] }),
      T('Әжеңізге ағылшынша түсіндіріңіз. Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['more comfortable'],
        'comfortable — ұзын сөз, сондықтан more comfortable.', { sentence: 'This table is ___ (comfortable) for us than that one.' })
    ]
  });

  variant(L, 'v-science', {
    task: 'бақылау журналын оқып, болжамды тексеру',   // [не проверено носителем]
    interests: ['science'], mode: 'observe', role: 'Жас зерттеуші', label: 'Зерттеуші: бақылауды тексер',
    mission: { title: 'Бұршақ тәжірибесі', scene: 'Сіз тәжірибе жүргіздіңіз: бір бұршақ терезеде, екіншісі қараңғы шкафта өсті. Бақылау журналын оқып, болжамды тексеріңіз.' },
    textHeading: 'Бақылау журналын оқыңыз',
    text: {
      title: 'Our bean experiment',
      lines: [
        'Question: do bean plants need light to grow well?',
        'We planted two beans on the same day. Bean A grew on the window. Bean B grew in a dark cupboard.',
        'After ten days, Bean B is taller than Bean A, but it is thinner and its leaves are yellow.',
        'Bean A is shorter, but it is stronger and its leaves are green.'
      ],
      glossary: [{ en: 'bean', kk: 'бұршақ' }, { en: 'cupboard', kk: 'шкаф' }, { en: 'leaves', kk: 'жапырақтар' }]
    },
    tasks: [
      C('Бақылау не көрсетеді?', [
        'Қараңғыдағы өскін ұзынырақ, бірақ әлсіз: сау өсу үшін жарық керек.',
        'Қараңғыдағы өскін ұзынырақ, демек жарық керек емес.',
        'Екі өскін бірдей өсті.'
      ], 0, 'Bean B is taller, but thinner, leaves are yellow. Bean A is stronger, leaves are green. Ұзынырақ болу — саурақ болу емес.',
        { outcomes: [
          'Қорытындыңыз журналдағы барлық деректерге сай.',
          'Тек ұзындық ескерілді — жапырақтың түсі мен жуандығы назардан тыс қалды.',
          'Журналда өскіндердің ұзындығы әртүрлі деп жазылған.'
        ] }),
      T('Бақылау журналына жазыңыз. Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['stronger'],
        'strong — қысқа сөз: stronger.', { sentence: 'Bean A is ___ (strong) than Bean B.' })
    ]
  });

  // =====================================================================
  // s1-reading-2 «Нұсқаулықты оқу»: цель — порядок шагов (first, then) и запрет (Don't).
  // =====================================================================
  L = 's1-reading-2';

  variant(L, 'v-build', {
    task: 'нұсқаулықты оқып, көпір неге құлағанын табу',   // [не проверено носителем]
    interests: ['build'], mode: 'diagnose', role: 'Құрастырушы', label: 'Шебер: көпір неге құлады?',
    mission: { title: 'Қағаз көпір', scene: 'Нұсқаулық бойынша қағаз көпір жасадыңыз, бірақ ол бір тиыннан кейін құлады. Қай қадам өткізіліп кеткенін тауып, досыңызға ережені айтыңыз.' },
    textHeading: 'Нұсқаулықты оқыңыз',
    text: {
      title: 'Paper bridge',
      lines: [
        'First, fold the paper three times. Then it is strong.',
        'Then put the paper between two books.',
        'Don\'t use wet paper.',
        'Then put coins on the bridge, one by one.'
      ],
      glossary: [{ en: 'fold', kk: 'бүктеу' }, { en: 'wet', kk: 'дымқыл' }, { en: 'coins', kk: 'тиындар' }]
    },
    tasks: [
      C('Сіз қағазды бүктемей, бірден кітаптардың арасына қойдыңыз. Көпір құлады. Қай қадам орындалмады?', [
        'First, fold the paper three times.',
        'Then put coins on the bridge.',
        'Don\'t use wet paper.'
      ], 0, 'First — бірінші қадам: қағазды үш рет бүктеу. Сонда көпір мықты болады.',
        { outcomes: [
          'Қағазды бүктедіңіз — көпір бес тиынды көтерді.',
          'Тиын қойылған, бірақ көпір бәрібір құлайды: бірінші қадам жоқ.',
          'Қағаз құрғақ еді — мәселе басқада.'
        ] }),
      C('Досыңыз дымқыл қағаз алды. Нұсқаулық бойынша оған не айтасыз?', [
        'Don\'t use wet paper!',
        'Use wet paper!',
        'Then fold wet paper.'
      ], 0, 'Don\'t + етістік — тыйым: дымқыл қағазды қолданба.',
        { outcomes: ['Досыңыз құрғақ қағаз алды.', 'Дымқыл көпір бірден майысты.', 'Дымқыл қағаз бүктелмей, жыртылды.'] })
    ]
  });

  variant(L, 'v-food', {
    task: 'рецептті оқып, құймақ неге күйгенін табу',   // [не проверено носителем]
    interests: ['food'], mode: 'diagnose', role: 'Аспаз', label: 'Аспаз: құймақты құтқар',
    mission: { title: 'Күйген құймақ', scene: 'Рецепт бойынша құймақ пісірдіңіз: сырты күйіп, іші шикі қалды. Рецептің қай ережесі бұзылғанын табыңыз және інің қателеспеуі үшін ағылшынша айтыңыз.' },
    textHeading: 'Рецептті оқыңыз',
    text: {
      title: 'Quick pancakes',
      lines: [
        'First, mix one egg, one cup of milk and one cup of flour.',
        'Then heat the pan with a little oil.',
        'Don\'t make the fire too high.',
        'Cook each pancake for one minute on each side.'
      ],
      glossary: [{ en: 'flour', kk: 'ұн' }, { en: 'pan', kk: 'таба' }, { en: 'heat', kk: 'қыздыру' }]
    },
    tasks: [
      C('Құймақтың сырты күйіп, іші шикі қалды. Рецептің қай ережесі бұзылды?', [
        'Don\'t make the fire too high.',
        'First, mix one egg, milk and flour.',
        'Then heat the pan with a little oil.'
      ], 0, 'Сырты тез күйсе, от тым қатты болған: Don\'t make the fire too high.',
        { outcomes: ['Келесі құймақ біркелкі пісті.', 'Қамыр дұрыс араласқан — мәселе отта.', 'Май бар еді — мәселе отта.'] }),
      C('Інің: «Алдымен табаны қыздырайын» дейді. Рецепт бойынша не дейсіз?', [
        'No. First, mix the egg, milk and flour.',
        'Yes. First, heat the pan with oil.',
        'Yes. Heat the pan, then mix the egg.'
      ], 0, 'Рецептте first — араластыру, then — табаны қыздыру.',
        { outcomes: ['Інің қамырды араластырып, сосын табаны қыздырды.', 'Таба бос қызып, май түтіндей бастады.', 'Қамыр дайын болмай тұрып, таба тым қызып кетті.'] })
    ]
  });

  variant(L, 'v-music', {
    task: 'нұсқаулықтан ырғақтың ретін табу',   // [не проверено носителем]
    interests: ['music'], mode: 'fragments', role: 'Сынып ансамблінің мүшесі', label: 'Ырғақ: ретін тап',
    mission: { title: 'Сынып ырғағы', scene: 'Сынып ансамблі жаңа ырғақ үйренеді. Нұсқаулықтан дыбыстардың ретін қалпына келтіріп, қателескен досыңызға ағылшынша айтыңыз.' },
    textHeading: 'Ырғақ нұсқаулығын оқыңыз',
    text: {
      title: 'Our class rhythm',
      lines: [
        'First, clap two times: clap, clap.',
        'Then stamp your foot one time: stamp.',
        'Don\'t clap after the stamp. Wait one beat.',
        'Then start again.'
      ],
      glossary: [{ en: 'clap', kk: 'алақан соғу' }, { en: 'stamp your foot', kk: 'аяқпен тарс ету' }, { en: 'beat', kk: 'ырғақ соққысы' }]
    },
    tasks: [
      C('Қай ырғақ нұсқаулыққа сай?', [
        'clap, clap, stamp, (үзіліс)',
        'stamp, clap, clap, clap',
        'clap, stamp, clap, (үзіліс)'
      ], 0, 'First — екі рет clap, then — бір рет stamp, сосын бір соққы күту (Don\'t clap after the stamp).'),
      C('Досыңыз stamp-тан кейін бірден алақан соқты. Не дейсіз?', [
        'Don\'t clap after the stamp. Wait!',
        'Clap after the stamp, then wait!',
        'Stamp two times, then clap!'
      ], 0, 'Don\'t clap — алақан соқпа. Нұсқаулықта stamp-тан кейін үзіліс бар.',
        { outcomes: ['Ансамбль бірге, бір ырғақпен ойнады.', 'Ырғақ шатасып кетті.', 'Енді ырғақ мүлде басқаша болып кетті.'] })
    ]
  });

  // Спорт: тот же текст разминки, что и тематический вариант урока, но ученик — помощник тренера,
  // который находит ошибку товарища по инструкции. [Казахские формулировки не проверены носителем]
  variant(L, 'v-sport', {
    task: 'қыздыру нұсқаулығын оқып, досыңыздың қатесін табу',
    interests: ['sport'], mode: 'diagnose', role: 'Жаттықтырушының көмекшісі', label: 'Көмекші: қыздыру қатесін тап',
    mission: { title: 'Қыздырудағы қате', scene: 'Сіз — жаттықтырушының көмекшісісіз. Досыңыз қыздыруды басқа ретпен жасап жатыр. Нұсқаулықты оқып, қатесін тауып, оған ағылшынша айтыңыз.' },
    textHeading: 'Қыздыру нұсқаулығын оқыңыз',
    text: byId[L].contexts.sport.text,
    tasks: [
      C('Досыңыз алдымен созылды, содан кейін жүгірді. Нұсқаулық бойынша не дұрыс емес?', [
        'Алдымен 5 минут баяу жүру не жүгіру керек еді',
        'Жүгіруді мүлде жасамай, тек созылу керек еді',
        'Алдымен қол мен аяқты шеңбермен айналдыру керек еді'
      ], 0, 'First, walk or jog slowly for five minutes. Созылу — кейін: Then stretch gently.',
        { outcomes: [
          'Досыңыз алдымен баяу жүгіріп, денесін қыздырды.',
          'Нұсқаулықтың бірінші қадамы — жүру не баяу жүгіру, созылу емес.',
          'Қол мен аяқты айналдыру — екінші қадам, бірінші емес.'
        ] }),
      C('Досыңыз: «My knee hurts, but I continue» дейді. Нұсқаулық бойынша не айтасыз?', [
        'Stop and tell your coach.',
        'Don\'t stop. Stretch more.',
        'Then jog fast.'
      ], 0, 'If something hurts, stop and tell your coach — ауырса, тоқтап, жаттықтырушыға айт.',
        { outcomes: [
          'Досыңыз тоқтап, жаттықтырушыға айтты.',
          'Ауырып тұрғанда созылуды жалғастыру — нұсқаулыққа қайшы.',
          'Ауырып тұрғанда жылдам жүгіру — нұсқаулыққа қайшы.'
        ] })
    ]
  });

  // =====================================================================
  // ОРИГИНАЛЬНЫЕ МИРЫ (поле world, см. FEA.worlds). Все герои, места и турниры вымышлены.
  // s1-reading «Қысқа хабарламаны түсіну»: цель — найти кім / қайда / қашан в коротких сообщениях.
  // ПРОТОТИП: два варианта на одну цель — расследование (двойняшки) и спорт (вымышленный турнир).
  // [Казахские формулировки не проверены носителем]
  // =====================================================================
  L = 's1-reading';

  variant(L, 'v-investigate', {
    task: 'хабарламалардағы уақыт пен орынды салыстырып, кімнің сөзі қайшы екенін табу',
    world: 'twins',
    interests: ['investigate'], mode: 'deduce', role: 'Алан мен Аяның көмекшісі', label: 'Тергеу: қайшы хабарламаны тап',
    mission: { title: 'Жоғалған кілт', scene: 'Мектеп бақшасындағы қойманың кілті жоғалды. Егіз тергеушілер Алан мен Ая сыныптастардың қысқа хабарламаларын жинады. Уақыт пен орынды салыстырып, кімнің сөзі басқа хабарламаға қайшы екенін табыңыз.' },
    textHeading: 'Хабарламаларды оқып, уақыт пен орынды салыстырыңыз',
    themeWords: [FEA.word('library', 'кітапхана', '📚')],
    text: {
      title: 'Who is not telling the truth?',
      lines: [
        'The garden shed key is missing. Alan and Aya collect messages.',
        'Bota (15:05): "I\'m at the library now."',
        'Erlan (15:00): "I\'m in the garden. The shed door is open!"',
        'Mira (15:10): "I\'m at home today. I\'m ill."',
        'Librarian (15:05): "Bota is not here today."'
      ],
      glossary: [{ en: 'shed', kk: 'қойма' }, { en: 'missing', kk: 'жоғалған' }, { en: 'librarian', kk: 'кітапханашы' }]
    },
    tasks: [
      C('Кімнің хабарламасы басқа хабарламаға қайшы келеді?', ['Бота', 'Ерлан', 'Мира'], 0,
        'Bota (15:05): «I\'m at the library now». Бірақ дәл сол уақытта кітапханашы: «Bota is not here today».',
        { outcomes: [
          'Алан мен Ая Ботадан қайта сұрады: ол кітапханада болмаған екен.',
          'Ерланның хабарламасына ешбір хабарлама қайшы келмейді.',
          'Мираның хабарламасына ешбір хабарлама қайшы келмейді.'
        ] }),
      C('Қойманың есігі ашық екенін кім, қайдан және сағат нешеде жазды?', [
        'Ерлан, бақшадан, 15:00',
        'Бота, кітапханадан, 15:05',
        'Мира, үйден, 15:10'
      ], 0, 'Erlan (15:00): «I\'m in the garden. The shed door is open!» — кім: Ерлан, қайда: бақшада, қашан: 15:00.')
    ]
  });

  variant(L, 'v-sport', {
    task: 'ұйымдастырушының хабарламасынан қашан және қай залға бару керегін табу',
    world: 'steppe-cup',
    interests: ['sport'], mode: 'plan', role: 'Жас спортшының көмекшісі', label: 'Турнир: кесте мен залды тап',
    mission: { title: 'Турнир кестесі', scene: '«Дала кубогы» — ойдан шығарылған жасөспірімдер турнирі, ұйымдастырушы Садық мырза да ойдан шығарылған кейіпкер. Ол хабарлама жіберді. Досыңызға қашан және қайда бару керегін анықтап беріңіз.' },
    textHeading: 'Ұйымдастырушының хабарламасын оқыңыз',
    themeWords: [FEA.word('hall', 'зал', '🏟️')],
    text: {
      title: 'Message from the Steppe Cup',
      lines: [
        'Steppe Cup — a message from the organizer, Mr. Sadyk:',
        '"The weigh-in is today at 17:00 in Hall B."',
        '"Junior matches start tomorrow at 10:00 in Hall B."',
        '"Hall A is closed tomorrow. Don\'t go there."',
        '"Bring your gloves and your ID card."'
      ],
      glossary: [{ en: 'weigh-in', kk: 'салмақ өлшеу' }, { en: 'junior', kk: 'жасөспірімдер' }, { en: 'ID card', kk: 'жеке куәлік' }]
    },
    tasks: [
      C('Ертең жарысқа қашан және қай залға бару керек?', ['Ертең 10:00-де, B залына', 'Ертең 10:00-де, A залына', 'Бүгін 17:00-де, A залына'], 0,
        '«Junior matches start tomorrow at 10:00 in Hall B.» A залы ертең жабық: «Hall A is closed tomorrow».',
        { outcomes: [
          'Досыңыз ертең 10:00-де B залына уақытында келді.',
          'A залы ертең жабық — досыңыз есік алдында қалды.',
          'Бүгін 17:00-де — жарыс емес, салмақ өлшеу, және ол B залында.'
        ] }),
      C('Бүгін кешке не істеу керек?', ['17:00-де B залында салмақ өлшеу', '17:00-де A залында жарысқа шығу', '10:00-де B залында салмақ өлшеу'], 0,
        '«The weigh-in is today at 17:00 in Hall B.» Жарыс — ертең.')
    ]
  });

  variant(L, 'v-heroes', {
    task: 'хабарламалардан көмек қайда керек екенін және кімді іздейтінін табу',
    world: 'night-lynx',
    interests: ['heroes'], mode: 'plan', role: 'Қала көмекшілері тобының мүшесі', label: 'Кейіпкерлер: кімге көмек керек?',
    mission: { title: 'Саябақтағы адасқан бала', scene: 'Сіз ойдан шығарылған кейіпкерлер — Түнгі Сілеусін мен Ұшқын тобындасыз. Олар ешкіммен төбелеспейді, адамдарға көмектеседі. Хабарламаларды оқып, көмек қайда керек екенін және кімді іздеу керегін табыңыз.' },
    textHeading: 'Топтың хабарламаларын оқыңыз',
    themeWords: [FEA.word('lost', 'адасып қалған', '🧭')],
    text: {
      title: 'Messages for the city helpers',
      lines: [
        'Spark (16:00): "I\'m at the river bridge. Everything is OK here."',
        'Park guard (16:05): "A small boy is lost near the fountain. His name is Dias."',
        'Night Lynx (16:06): "I\'m at the museum. I can be at the park at 16:30."',
        'Mom (16:07): "Dias has a red cap. He is six."'
      ],
      glossary: [{ en: 'fountain', kk: 'субұрқақ' }, { en: 'guard', kk: 'күзетші' }, { en: 'cap', kk: 'бас киім (кепка)' }]
    },
    tasks: [
      C('Көмек қай жерде керек?', ['Саябақта, субұрқақтың жанында', 'Өзеннің үстіндегі көпірдің жанында', 'Мұражайдың алдындағы аялдамада'], 0,
        'Park guard (16:05): «A small boy is lost near the fountain». Көпірде бәрі жақсы (Spark), мұражайда — Түнгі Сілеусіннің өзі.',
        { outcomes: [
          'Топ саябаққа барды — бала субұрқақтың жанында екен.',
          'Spark көпірден жазды: «Everything is OK here» — онда көмек керек емес.',
          'Мұражайда Түнгі Сілеусін тұр, ол жерде ешкім адаспаған.'
        ] }),
      C('Кімді іздейсіз? Қай мәлімет хабарламаларға сай?', ['Дияс, алты жаста, қызыл бас киімі бар', 'Дияс, алты жаста, көк бас киімі бар', 'Дияс, жеті жаста, қызыл бас киімі бар'], 0,
        'Mom (16:07): «Dias has a red cap. He is six.» — қызыл бас киім, алты жас.')
    ]
  });

  // s1-reading-2: инструкция (first / then / don't) — мир «Аспан академиясы»
  L = 's1-reading-2';
  variant(L, 'v-magic', {
    task: 'жел сиқыры нұсқаулығын оқып, қадамдар ретін және тыйымды табу',
    world: 'aspan',
    interests: ['magic'], mode: 'diagnose', role: 'Аспан академиясының оқушысы', label: 'Сиқыр: нұсқаулықты орында',
    mission: { title: 'Жел сиқыры', scene: 'Аспан академиясы — ойдан шығарылған сиқыр мектебі. Мұғалім тақтаға жел сиқырының нұсқаулығын жазды. Қадамдарды дұрыс ретпен орындап, досыңызды тыйымнан сақтандырыңыз.' },
    textHeading: 'Тақтадағы нұсқаулықты оқыңыз',
    themeWords: [FEA.word('feather', 'қауырсын', '🪶')],
    text: {
      title: 'Wind spell practice',
      lines: [
        'First, open the window.',
        'Then hold the feather in your left hand.',
        'Don\'t touch the green bottle. It is for teachers.',
        'Then say "Zhel!" three times, slowly.'
      ],
      glossary: [{ en: 'hold', kk: 'ұстау' }, { en: 'bottle', kk: 'құты' }, { en: 'slowly', kk: 'баяу' }]
    },
    tasks: [
      C('Сіз қауырсынды алдыңыз, бірақ терезе әлі жабық. Нұсқаулық бойынша не дұрыс емес?', [
        'Алдымен терезені ашу керек еді',
        'Алдымен «Zhel!» деп айту керек еді',
        'Алдымен жасыл құтыны алу керек еді'
      ], 0, 'First, open the window — бірінші қадам. Қауырсын — содан кейін: Then hold the feather.',
        { outcomes: [
          'Терезені аштыңыз — жел кірді, қауырсын қозғала бастады.',
          '«Zhel!» — соңғы қадам, бірінші емес.',
          'Жасыл құтыға тиюге болмайды: Don\'t touch the green bottle.'
        ] }),
      C('Досыңыз жасыл құтыны алғысы келеді. Нұсқаулық бойынша не айтасыз?', [
        'Don\'t touch the green bottle.',
        'Then touch the green bottle.',
        'First, open the green bottle.'
      ], 0, 'Don\'t + етістік — тыйым: Don\'t touch the green bottle. It is for teachers.',
        { outcomes: ['Досыңыз құтыны орнында қалдырды.', 'Нұсқаулықта бұл қадам жоқ — бұл тыйым.', 'Құтыны ашу — нұсқаулыққа қайшы.'] })
    ]
  });

  // s1-grammar-2: There is / There are — мир «Блок аралы» (ресурсы → что можно построить)
  L = 's1-grammar-2';
  variant(L, 'v-build', {
    task: 'ресурстар тізімін оқып, не салуға болатынын шешу',
    world: 'block-island',
    interests: ['build'], mode: 'plan', role: 'Блок аралының құрылысшысы', label: 'Құрылыс: не салуға болады?',
    mission: { title: 'Аралдағы құрылыс', scene: 'Блок аралы — ойдан шығарылған арал. Сөмкеңіздегі ресурстарды және құрылыс талаптарын оқып, не салуға болатынын шешіңіз, досыңызға ағылшынша есеп беріңіз.' },
    textHeading: 'Ресурстар мен құрылыс талаптарын оқыңыз',
    themeWords: [FEA.word('log', 'бөрене', '🪵')],
    text: {
      title: 'Block Island: what can we build?',
      lines: [
        'There are six logs in my bag.',
        'There is one door, and there are two windows.',
        'A small house needs four logs, one door and two windows.',
        'A bridge needs eight logs.'
      ],
      glossary: [{ en: 'logs', kk: 'бөренелер' }, { en: 'needs', kk: 'керек' }, { en: 'bridge', kk: 'көпір' }]
    },
    tasks: [
      C('Сөмкедегі ресурстармен не салуға болады?', ['Тек кішкентай үйді', 'Тек ұзын көпірді', 'Үйді де, көпірді де'], 0,
        'Үйге 4 бөрене, 1 есік, 2 терезе керек — бәрі бар. Көпірге 8 бөрене керек, ал сөмкеде алты ғана (There are six logs).',
        { outcomes: [
          'Үй дайын! Екі бөрене артылып қалды.',
          'Көпірге бөрене жетпейді: 8 керек, бар болғаны 6.',
          'Екеуіне 12 бөрене керек, ал сөмкеде 6 қана.'
        ] }),
      C('Досыңызға есеп жазыңыз. Қай сөйлем дұрыс?', ['There are six logs and one door.', 'There is six logs and one door.', 'There are six log and one door.'], 0,
        'six logs — бірнеше зат: There are, және log сөзіне -s қосылады.')
    ]
  });

  // =====================================================================
  // ПЕРСОНАЖИ ПРОИЗВЕДЕНИЙ (семейная версия, решение владельца проекта).
  // Новые короткие учебные ситуации: не сцены, не реплики и не сюжеты оригиналов.
  // characters — кто участвует и делает что-то нужное для решения (валидатор проверяет, что имя есть в тексте).
  // Такие варианты подбираются только если ученик сам выбрал хотя бы одного из этих персонажей.
  // [Казахские формулировки не проверены носителем]
  // =====================================================================
  function fan(lessonId, key, v) {
    v.mission.scene += ' (Бұл — оқуға арналған жаңа жағдай, түпнұсқадағы сахна емес.)';
    variant(lessonId, key, v);
  }

  // ---- s1-reading — ПРОТОТИП: та же цель «кім / қайда / қашан», два разных мира
  fan('s1-reading', 'v-investigate-gf', {
    franchise: 'gravity-falls', characters: ['dipper', 'mabel', 'soos'],
    task: 'хабарламалардан кім қайда екенін және жоспардың қалай өзгергенін табу',
    interests: ['investigate'], mode: 'deduce', role: 'Диппер мен Мэйблдің досы', label: 'Gravity Falls: жоспар қалай өзгерді?',
    mission: { title: 'Ормандағы із', scene: 'Сіз Диппер мен Мэйблдің досысыз. Тоңазытқышта үш қысқа хабарлама тұр. Кім қайда екенін және жоспар қалай өзгергенін табыңыз.' },
    textHeading: 'Тоңазытқыштағы хабарламаларды оқыңыз',
    themeWords: [FEA.word('forest', 'орман', '🌲')],
    text: {
      title: 'Notes on the fridge',
      lines: [
        'Dipper (9:00): "I\'m in the forest. I found a strange footprint. Come at 11:00!"',
        'Mabel (9:30): "Soos and I are at the lake. We are back at 12:00."',
        'Soos (10:15): "Sorry, the boat is slow. Mabel and I are back at 13:00, not 12:00."'
      ],
      glossary: [{ en: 'footprint', kk: 'із' }, { en: 'lake', kk: 'көл' }, { en: 'back', kk: 'қайтып келу' }]
    },
    tasks: [
      C('Мэйбл мен Соос ақырында сағат нешеде оралады?', ['13:00-де', '12:00-де', '11:00-де'], 0,
        'Mabel (9:30): «back at 12:00». Бірақ кейінірек Soos (10:15): «back at 13:00, not 12:00». Соңғы хабарлама жоспарды өзгертті.',
        { outcomes: [
          'Дұрыс: сіз Мэйбл мен Соосты 13:00-де күттіңіз.',
          '12:00 — ескі жоспар. Соос 10:15-те оны өзгертті.',
          '11:00 — Диппердің орманға шақырған уақыты.'
        ] }),
      C('Диппер қайда және сағат нешеде күтіп тұр?', ['Орманда, 11:00-де', 'Көлде, 11:00-де', 'Орманда, 12:00-де'], 0,
        'Dipper (9:00): «I\'m in the forest… Come at 11:00!» — қайда: орманда, қашан: 11:00.')
    ]
  });

  fan('s1-reading', 'v-magic-hp', {
    franchise: 'harry-potter', characters: ['harry', 'hermione', 'ron'],
    task: 'хабарламалардан кім қашан және қайда келетінін табу',
    interests: ['magic'], mode: 'plan', role: 'Гермионаның оқу тобының мүшесі', label: 'Harry Potter: кітапханада кездесу',
    mission: { title: 'Кітапханадағы топ', scene: 'Хогвартс мектебі. Гермиона кітапханада оқу тобын жинады. Гарри мен Рон хабарлама жіберді. Кім қашан және қайда келетінін анықтаңыз.' },
    textHeading: 'Достардың хабарламаларын оқыңыз',
    themeWords: [FEA.word('notes', 'жазбалар', '📝')],
    text: {
      title: 'Messages at Hogwarts',
      lines: [
        'Hermione (Monday): "Study group in the library today at 4 pm. Bring your notes!"',
        'Ron (3 pm): "Harry, I\'m at the Quidditch pitch. I\'m late for the library."',
        'Harry (3:30 pm): "Hermione, Ron and I are coming at 4:30, not 4."',
        'Hermione (3:45 pm): "OK. The library closes at 6 pm."'
      ],
      glossary: [{ en: 'study group', kk: 'оқу тобы' }, { en: 'pitch', kk: 'алаң' }, { en: 'closes', kk: 'жабылады' }]
    },
    tasks: [
      C('Гарри мен Рон кітапханаға сағат нешеде келеді?', ['4:30-да', '4:00-де', '6:00-де'], 0,
        'Harry (3:30 pm): «Ron and I are coming at 4:30, not 4.» 6:00 — кітапхана жабылатын уақыт.',
        { outcomes: [
          'Гермиона 4:30-ға дейін өз тапсырмасын бітірді.',
          '4:00 — бастапқы жоспар. Гарри оны 3:30-да өзгертті.',
          '6:00-де кітапхана жабылады — бұл кешігу болар еді.'
        ] }),
      C('Рон сағат 3-те қай жерде болды?', ['Квиддич алаңында', 'Кітапхананың ішінде', 'Үлкен залдың ішінде'], 0,
        'Ron (3 pm): «I\'m at the Quidditch pitch.» — Квиддич алаңында.')
    ]
  });

  // ---- s1-reading-2: инструкция (first / then / don't)
  fan('s1-reading-2', 'v-build-mc', {
    franchise: 'minecraft', characters: ['steve', 'alex'],
    task: 'Алекстің нұсқаулығын оқып, Стивтің қатесін табу',
    interests: ['build'], mode: 'diagnose', role: 'Стив пен Алекстің серігі', label: 'Minecraft: Алекстің нұсқаулығы',
    mission: { title: 'Түнге дейін баспана', scene: 'Алекс Стивке қысқа нұсқаулық жазды. Стив асығып, қате жасағысы келеді. Нұсқаулық бойынша оны тоқтатыңыз.' },
    textHeading: 'Алекстің жазбасын оқыңыз',
    themeWords: [FEA.word('wood', 'ағаш (материал)', '🪵')],
    text: {
      title: 'Alex\'s note for Steve',
      lines: [
        'First, collect wood from four trees.',
        'Then make a crafting table.',
        'Don\'t dig straight down. You can fall into a cave.',
        'Then build a small shelter before night.'
      ],
      glossary: [{ en: 'crafting table', kk: 'шеберхана үстелі' }, { en: 'dig straight down', kk: 'тура төмен қазу' }, { en: 'shelter', kk: 'баспана' }]
    },
    tasks: [
      C('Стив шеберхана үстелін жасағысы келеді, бірақ ағашы жоқ. Не дұрыс емес?', ['Алдымен ағаш жинау керек еді', 'Алдымен баспана салу керек еді', 'Алдымен тура төмен қазу керек еді'], 0,
        'First, collect wood — бірінші қадам. Шеберхана үстелі — содан кейін (Then make a crafting table).',
        { outcomes: ['Стив төрт ағаштан ағаш жинап, үстел жасады.', 'Баспана — соңғы қадам, бірінші емес.', 'Тура төмен қазуға тыйым салынған.'] }),
      C('Стив: «I will dig straight down!» дейді. Алекстің жазбасы бойынша не айтасыз?', ['Don\'t dig straight down.', 'Then dig straight down.', 'First, dig straight down.'], 0,
        'Don\'t + етістік — тыйым: Don\'t dig straight down. You can fall into a cave.',
        { outcomes: ['Стив басқа жерден қазуды таңдады.', 'Нұсқаулықта бұл — тыйым, қадам емес.', 'Нұсқаулықтың бірінші қадамы — ағаш жинау.'] })
    ]
  });

  fan('s1-reading-2', 'v-science-pkm', {
    franchise: 'pokemon', characters: ['ash', 'pikachu', 'nurse-joy'],
    task: 'Джой медбикенің карточкасын оқып, Пикачуға дұрыс күтім жасау',
    interests: ['science', 'strategy'], mode: 'diagnose', role: 'Эштің досы', label: 'Pokémon: Пикачуға күтім',
    mission: { title: 'Шаршаған Пикачу', scene: 'Пикачу шаршады. Джой медбике Эшке нұсқаулық карточкасын берді. Эшке не істеу керек, не істеуге болмайтынын айтыңыз.' },
    textHeading: 'Джой медбикенің карточкасын оқыңыз',
    themeWords: [FEA.word('tired', 'шаршаған', '😴')],
    text: {
      title: 'Nurse Joy\'s card for Ash',
      lines: [
        'First, give Pikachu some water.',
        'Then let Pikachu sleep for one hour.',
        'Don\'t battle today. Pikachu is tired.',
        'Then come back to the Pokémon Center at 5 pm.'
      ],
      glossary: [{ en: 'let … sleep', kk: 'ұйықтатып қою' }, { en: 'battle', kk: 'жарыс, сайыс' }, { en: 'come back', kk: 'қайтып келу' }]
    },
    tasks: [
      C('Эш Пикачуды бірден ұйықтатқысы келеді. Алдымен не істеу керек?', ['Пикачуға су беру', 'Пикачуды ұйықтату', 'Орталыққа қайту'], 0,
        'First, give Pikachu some water. Ұйқы — содан кейін (Then let Pikachu sleep).',
        { outcomes: ['Пикачу су ішіп, тынығуға жатты.', 'Ұйқы — екінші қадам.', 'Орталыққа сағат 5-те қайту керек — бұл соңғы қадам.'] }),
      C('Досы Эшті бүгін сайысқа шақырды. Эш не деуі керек?', ['Nurse Joy says: don\'t battle today.', 'Nurse Joy says: battle today.', 'Nurse Joy says: battle at 5 pm.'], 0,
        'Don\'t battle today. Pikachu is tired — бүгін сайысқа шықпа, Пикачу шаршаған.',
        { outcomes: ['Эш сайысты ертеңге қалдырды.', 'Карточкада керісінше: бүгін сайыс жоқ.', 'Сағат 5-те — орталыққа қайту, сайыс емес.'] })
    ]
  });

  // ---- s1-grammar-2: There is / There are
  fan('s1-grammar-2', 'v-strategy-mario', {
    franchise: 'mario', characters: ['toad', 'luigi', 'mario'],
    task: 'Тоадтың есебін оқып, кілттер қай есіктің артында екенін шешу',
    interests: ['strategy'], mode: 'plan', role: 'Марио мен Луиджидің көмекшісі', label: 'Mario: қай есікті ашу керек?',
    mission: { title: 'Қамалдағы екі есік', scene: 'Тоад қамалдағы бөлмелерді тексеріп, есеп жазды. Марио мен Луиджиге қай есікті ашу керегін шешіңіз және есепті ағылшынша аяқтаңыз.' },
    textHeading: 'Тоадтың есебін оқыңыз',
    themeWords: [FEA.word('key', 'кілт', '🔑')],
    text: {
      title: 'Toad\'s report from the castle',
      lines: [
        'Toad: "There are two doors in the hall: a red door and a blue door."',
        '"Behind the red door there is one key, and there are three coins."',
        '"Behind the blue door there are two keys."',
        'Luigi: "We need two keys for the tower."',
        'Mario: "We can open only one door today."'
      ],
      glossary: [{ en: 'behind', kk: 'артында' }, { en: 'coins', kk: 'тиындар' }, { en: 'tower', kk: 'мұнара' }]
    },
    tasks: [
      C('Мұнараға екі кілт керек, бірақ бір ғана есік ашуға болады. Қай есікті ашқан дұрыс?', ['Көк есікті: онда екі кілт бар', 'Қызыл есікті: онда екі кілт бар', 'Қызыл есікті: онда үш кілт бар'], 0,
        'Behind the blue door there are two keys. Қызыл есіктің артында — бір кілт (there is one key) және үш тиын.',
        { outcomes: ['Марио мен Луиджи екі кілтпен мұнараны ашты.', 'Қызыл есікте бір ғана кілт: there is one key.', 'Үшеу — тиындар (three coins), кілт емес.'] }),
      C('Тоадтың есебін аяқтаңыз. Қай сөйлем дұрыс?', ['There are three coins behind the red door.', 'There is three coins behind the red door.', 'There are three coin behind the red door.'], 0,
        'three coins — бірнеше зат: There are, және coin сөзіне -s қосылады.')
    ]
  });

  // ---- s2-grammar-2: сравнение (-er / more … than)
  fan('s2-grammar-2', 'v-strategy-sonic', {
    franchise: 'sonic', characters: ['tails', 'knuckles', 'sonic'],
    task: 'Тейлз бен Наклстың сөзін салыстырып, Соникке жол таңдау',
    interests: ['strategy', 'sport'], mode: 'plan', role: 'Соник командасының штурманы', label: 'Sonic: қай жол жылдамырақ?',
    mission: { title: 'Бекетке жарыс', scene: 'Тейлз бен Наклс екі жол туралы айтты. Соник үшін ең маңыздысы — жылдамдық. Салыстырып, жол таңдаңыз.' },
    textHeading: 'Достардың сөзін салыстырыңыз',
    themeWords: [FEA.word('path', 'соқпақ, жол', '🛤️')],
    text: {
      title: 'Two paths to the station',
      lines: [
        'Tails: "The mountain path is shorter, but it is slower because of the rocks."',
        'Knuckles: "The beach path is longer, but it is flatter and faster."',
        'Sonic: "Today speed is more important than distance."'
      ],
      glossary: [{ en: 'rocks', kk: 'тастар' }, { en: 'flatter', kk: 'тегістеу' }, { en: 'distance', kk: 'қашықтық' }]
    },
    tasks: [
      C('Соник қай жолды таңдауы керек?', ['Жағажай жолын: ұзынырақ, бірақ жылдамырақ', 'Тау жолын: қысқарақ, сондықтан жылдамырақ', 'Тау жолын: тегістеу әрі жылдамырақ'], 0,
        'Knuckles: «The beach path is … faster». Tails: тау жолы shorter, бірақ slower. Соник үшін жылдамдық маңыздырақ.',
        { outcomes: ['Соник жағажай жолымен бірінші жетті.', 'Тау жолы қысқарақ, бірақ тастарға байланысты баяуырақ.', 'Тегіс — жағажай жолы, тау жолы емес.'] }),
      T('Тейлзге жауап жазыңыз. Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['faster'],
        'fast — қысқа сөз: faster.', { sentence: 'The beach path is ___ (fast) than the mountain path.' })
    ]
  });

  fan('s2-grammar-2', 'v-heroes-spv', {
    franchise: 'spider-verse', characters: ['miles', 'gwen'],
    task: 'Майлз бен Гвеннің сөзін салыстырып, роботты жәрмеңкеге қалай апаруды шешу',
    interests: ['heroes', 'build'], mode: 'justify', role: 'Майлз бен Гвеннің командасы', label: 'Spider-Verse: роботты қалай апарамыз?',
    mission: { title: 'Ғылым жәрмеңкесі', scene: 'Майлз бен Гвен ғылым жәрмеңкесіне ауыр робот апарады. Екі нұсқаны салыстырып, шешім қабылдаңыз.' },
    textHeading: 'Майлз бен Гвеннің әңгімесін оқыңыз',
    themeWords: [FEA.word('robot', 'робот', '🤖')],
    text: {
      title: 'Two ways to the science fair',
      lines: [
        'Miles: "The science fair starts at 10:00. Our robot is heavy."',
        'Gwen: "The subway is cheaper than a taxi, but it is more crowded."',
        'Miles: "A taxi is more expensive, but it is safer for the robot."',
        'Gwen: "We have money for a taxi. The robot is more important today."'
      ],
      glossary: [{ en: 'science fair', kk: 'ғылым жәрмеңкесі' }, { en: 'crowded', kk: 'адамға толы' }, { en: 'safer', kk: 'қауіпсіздеу' }]
    },
    tasks: [
      C('Олар қалай баруы керек?', ['Таксимен: қымбатырақ, бірақ роботқа қауіпсіздеу', 'Метромен: арзанырақ, сондықтан роботқа жақсырақ', 'Метромен: таксиден бос әрі қауіпсіздеу'], 0,
        'Miles: «A taxi is … safer for the robot». Gwen: «The robot is more important today». Метро — cheaper, бірақ more crowded.',
        { outcomes: ['Робот жәрмеңкеге аман жетті.', 'Метро арзанырақ, бірақ адамға толы — роботқа қауіпті.', 'Мәтін бойынша метро бос емес: more crowded.'] }),
      C('Гвеннің ойын қай сөйлем дұрыс береді?', ['The robot is more important than the money.', 'The robot is importanter than the money.', 'The robot is more importanter than the money.'], 0,
        'important — ұзын сөз: more important than.')
    ]
  });

  // ---- s2-grammar: was / were + -ing … when …
  fan('s2-grammar', 'v-investigate-sh', {
    franchise: 'sherlock', characters: ['holmes', 'watson', 'hudson'],
    task: 'куәлардың «не істеп жатқанын» дерекпен салыстырып, қайшылықты табу',
    interests: ['investigate', 'history'], mode: 'deduce', role: 'Холмстың көмекшісі', label: 'Sherlock Holmes: скрипка садағы',
    mission: { title: 'Жоғалған садақ', scene: 'Шерлок Холмстың скрипка садағы кешкі 8-де жоғалды. Үйдегілер сол сәтте не істеп жатқанын айтты. Дерекпен салыстырып, кімнің сөзі шындыққа сай емес екенін табыңыз.' },
    textHeading: 'Үйдегілердің сөзін оқыңыз',
    themeWords: [FEA.word('violin', 'скрипка', '🎻')],
    text: {
      title: 'The missing violin bow',
      lines: [
        'Holmes\'s violin bow disappeared at 8 pm.',
        'Mrs Hudson: "At 8 pm I was making tea in the kitchen."',
        'Dr Watson: "At 8 pm I was reading the newspaper by the fire."',
        'The new cook: "At 8 pm I was buying bread at the market."',
        'Holmes: "But the market closes at 6 pm."'
      ],
      glossary: [{ en: 'bow', kk: 'садақ (скрипка садағы)' }, { en: 'newspaper', kk: 'газет' }, { en: 'cook', kk: 'аспаз' }]
    },
    tasks: [
      C('Кімнің сөзі дерекке қайшы?', ['Жаңа аспаздың', 'Хадсон ханымның', 'Ватсонның'], 0,
        'The new cook: «At 8 pm I was buying bread at the market». Бірақ Holmes: «the market closes at 6 pm».',
        { outcomes: ['Аспаз садақты байқаусызда алып қойғанын мойындады.', 'Хадсон ханымның сөзіне дерек қайшы емес.', 'Ватсонның сөзіне дерек қайшы емес.'] }),
      T('Холмстың жазбасын аяқтаңыз (екі сөз):', ['was reading'],
        'Сол сәтте созылып жатқан әрекет: was + reading.', { sentence: 'At 8 pm Dr Watson ___ (read) the newspaper.' })
    ]
  });

  fan('s2-grammar', 'v-investigate-sd', {
    franchise: 'scooby-doo', characters: ['fred', 'daphne', 'shaggy', 'scooby', 'velma'],
    task: 'команданың сөзін Велманың дерегімен салыстырып, жарық неге сөнгенін табу',
    interests: ['investigate', 'humor'], mode: 'deduce', role: 'Mystery Inc. командасының мүшесі', label: 'Scooby-Doo: жарық неге сөнді?',
    mission: { title: 'Мұражайдағы қараңғылық', scene: 'Кешкі 9-да мұражайда кенет жарық сөнді. Әркім сол сәтте не істеп жатқанын айтты. Велманың дерегімен салыстырып, жарықтың неге сөнгенін табыңыз.' },
    textHeading: 'Команданың сөзін оқыңыз',
    themeWords: [FEA.word('switch', 'ажыратқыш', '💡')],
    text: {
      title: 'The lights went out',
      lines: [
        'At 9 pm the lights in the museum suddenly went out.',
        'Fred: "I was checking the back door when it happened."',
        'Daphne: "I was talking to the guard at the front desk."',
        'Shaggy: "Scooby and I were eating sandwiches in the café!"',
        'Velma: "The café is closed today. And there are sandwich crumbs next to the light switch."'
      ],
      glossary: [{ en: 'went out', kk: 'сөнді' }, { en: 'crumbs', kk: 'қиқым, үгінді' }, { en: 'switch', kk: 'ажыратқыш' }]
    },
    tasks: [
      C('Велманың дерегі бойынша кімнің сөзі қате?', ['Шэгги мен Скубидің', 'Фред пен Дафнаның', 'Күзетші мен Велманың'], 0,
        'Shaggy: «we were eating sandwiches in the café». Бірақ Velma: «The café is closed today», ал сэндвич қиқымдары ажыратқыштың жанында.',
        { outcomes: ['Шэгги күліп мойындады: екеуі ажыратқышқа сүйеніп тұрған екен.', 'Фред пен Дафнаның сөзіне дерек қайшы емес.', 'Велма — дерек тапқан адам, күдікті емес.'] }),
      T('Велманың қорытындысын аяқтаңыз (екі сөз):', ['were standing'],
        'Shaggy and Scooby — көпше, сондықтан were + standing.', { sentence: 'Shaggy and Scooby ___ (stand) next to the light switch when the lights went out.' })
    ]
  });

  // =====================================================================
  // s2-grammar «was doing ... when ...»: цель — фон (was/were + -ing) и внезапное событие.
  // =====================================================================
  L = 's2-grammar';

  variant(L, 'v-investigate', {
    task: 'куәлардың сөзін камерамен салыстырып, қайшылықты табу',   // [не проверено носителем]
    interests: ['investigate'], mode: 'deduce', role: 'Тергеуші', label: 'Тергеуші: алибиді тексер',
    mission: { title: 'Сынған ваза', scene: 'Ваза 7:15-те құлап сынды. Әркім сол сәтте не істеп жатқанын айтты. Олардың сөзін камера дерегімен салыстырып, кімнің сөзі шындыққа сай емес екенін табыңыз.' },
    textHeading: 'Куәлардың сөзі мен камера дерегін салыстырыңыз',
    text: {
      title: 'The broken vase',
      lines: [
        'The vase fell at 7:15. Everyone says what they were doing at that moment.',
        'Aibek: "I was washing the dishes when I heard the noise."',
        'Saule: "I was reading in my room when the vase fell."',
        'Timur: "I was walking the dog when it happened."',
        'But the camera shows: at 7:15 the dog was in the hall, asleep.'
      ],
      glossary: [{ en: 'vase', kk: 'ваза' }, { en: 'noise', kk: 'шу, дыбыс' }, { en: 'asleep', kk: 'ұйықтап жатқан' }]
    },
    tasks: [
      C('Кімнің сөзі камера дерегіне қайшы?', ['Тимур', 'Айбек', 'Сәуле'], 0,
        'Timur: «I was walking the dog» — бірақ 7:15-те ит дәлізде ұйықтап жатқан.',
        { outcomes: [
          'Тимур итті серуендетпегенін мойындады.',
          'Айбектің сөзін ешқандай дерек жоққа шығармайды.',
          'Сәуленің сөзін ешқандай дерек жоққа шығармайды.'
        ] }),
      T('Тергеу жазбасын аяқтаңыз (екі сөз):', ['was sleeping'],
        'Сол сәтте созылып жатқан әрекет: was + sleeping.', { sentence: 'At 7:15 the dog ___ (sleep) in the hall.' })
    ]
  });

  variant(L, 'v-sport', {
    task: 'видеоны талдап, гол неге кіргенін түсіндіру',   // [не проверено носителем]
    interests: ['sport'], mode: 'tactics', role: 'Видеоталдаушы', label: 'Талдау: гол неге кірді?',
    mission: { title: 'Матч видеосы', scene: 'Команда гол жіберді. Видеоны талдап, сол сәтте кім не істеп жатқанын анықтаңыз және келесі матчқа тактика ұсыныңыз.' },
    textHeading: 'Видеоталдау жазбасын оқыңыз',
    text: {
      title: 'Why did we lose the ball?',
      lines: [
        'Minute 60. We were attacking with seven players.',
        'Our two defenders were standing near the centre.',
        'Suddenly their goalkeeper caught the ball and kicked it long.',
        'Their striker was already running, and our defenders were too far.'
      ],
      glossary: [{ en: 'caught', kk: 'ұстап алды' }, { en: 'striker', kk: 'шабуылшы' }, { en: 'too far', kk: 'тым алыста' }]
    },
    tasks: [
      C('Видеоға сүйеніп, келесі матчта не өзгертесіз?', [
        'Шабуыл кезінде бір қорғаушы артта қалады',
        'Қақпашыға допты мүлде бермейміз',
        'Барлық ойыншы шабуылға шығады'
      ], 0, 'We were attacking with seven players, defenders were standing near the centre — артта ешкім болмады.',
        { outcomes: [
          'Келесі матчта ұзын пасты артта қалған қорғаушы ұстап алды.',
          'Бұл ережеге байланысты емес: қақпашы допты бәрібір ұстайды.',
          'Арт жақ тағы бос қалды — тағы гол.'
        ] }),
      T('Талдау жазбасын аяқтаңыз (екі сөз):', ['were standing'],
        'defenders — көпше, сондықтан were + standing.', { sentence: 'Our defenders ___ (stand) near the centre when the goalkeeper kicked the ball.' })
    ]
  });

  variant(L, 'v-history', {
    task: 'үш хатты салыстырып, оқиға ретін анықтау',   // [не проверено носителем]
    interests: ['history', 'investigate'], mode: 'timeline', role: 'Мұражай қызметкері', label: 'Мұражай: оқиға ретін анықта',
    mission: { title: 'Ескі көпір туралы үш хат', scene: 'Ауыл мұражайы ескі көпірдің құлағаны туралы үш хат тапты (ойдан шығарылған оқиға). Хаттарды салыстырып, оқиғалар ретін анықтаңыз және мұражай жазуын аяқтаңыз.' },
    textHeading: 'Үш хатты оқыңыз',
    text: {
      title: 'Three letters about the old bridge',
      lines: [
        'Three people from the village of Akzhar wrote about the day the old bridge fell.',
        'Letter 1: "I was feeding the horses when I heard a loud crack."',
        'Letter 2: "We were crossing the bridge on our cart when the crack came. We ran back."',
        'Letter 3: "The bridge fell ten minutes after the crack. Nobody was on it."'
      ],
      glossary: [{ en: 'crack', kk: 'сықыр, сызат дыбысы' }, { en: 'cart', kk: 'арба' }, { en: 'feeding', kk: 'жем беріп' }]
    },
    tasks: [
      C('Хаттар бойынша оқиғалар реті қандай?', [
        'Арба көпірден өтіп жатты → сықыр естілді → адамдар кері жүгірді → көпір құлады',
        'Көпір құлады → сықыр естілді → арба өтіп жатты',
        'Сықыр естілді → көпір бірден құлады → арба өтті'
      ], 0, 'were crossing — фон; the crack came — кенет оқиға; көпір сықырдан он минуттан кейін құлады.'),
      T('Мұражай жазуын аяқтаңыз (екі сөз):', ['was crossing'],
        'A family — жекеше, сондықтан was + crossing.', { sentence: 'A family ___ (cross) the bridge when the crack came.' })
    ]
  });

  // =====================================================================
  // s0-reading-2 «Бағаны табу»: цель — найти цену и «free».
  // =====================================================================
  L = 's0-reading-2';

  variant(L, 'v-money', {
    task: 'баға тізімінен бір білезіктің шығынын есептеу',   // [не проверено носителем]
    interests: ['money'], mode: 'deal', role: 'Білезік сататын шағын бизнестің иесі', label: 'Бизнес: шығынды есепте',
    mission: { title: 'Білезік бизнесі', scene: 'Сіз моншақтан білезік жасап сатасыз. Баға тізімінен бір білезікке кететін шығынды тауып, ақшаны неге жұмсамау керегін анықтаңыз.' },
    textHeading: 'Баға тізімін оқыңыз',
    text: {
      title: 'Bead shop',
      lines: [
        'BEADS (one bag) — 300 ₸',
        'STRING — 100 ₸',
        'GIFT BOX — free',
        'You sell one bracelet for 600 ₸.'
      ],
      glossary: [{ en: 'beads', kk: 'моншақ' }, { en: 'string', kk: 'жіп' }, { en: 'gift box', kk: 'сыйлық қорабы' }]
    },
    tasks: [
      C('Бір білезікке бір пакет моншақ пен бір жіп керек. Шығын қанша?', ['400 ₸', '300 ₸', '600 ₸'], 0,
        'BEADS — 300 ₸, STRING — 100 ₸: барлығы 400 ₸.',
        { outcomes: ['Әр білезіктен 200 ₸ пайда қалады.', 'Жіп ұмытылды — білезік құрастырылмайды.', '600 ₸ — бұл сату бағасы, шығын емес.'] }),
      C('Сыйлық қорабына ақша жұмсау керек пе?', ['Жоқ: GIFT BOX — free', 'Иә: 100 ₸', 'Иә: 300 ₸'], 0,
        'free — тегін. Ақша төлемейсіз.')
    ]
  });

  variant(L, 'v-humor', {
    task: 'мәзірден қисынсыз бағаларды табу',   // [не проверено носителем]
    interests: ['humor'], mode: 'absurd', role: 'Күлкілі газеттің редакторы', label: 'Редактор: оғаш бағаны тап',
    mission: { title: 'Оғаш кафе', scene: 'Сіз күлкілі газеттің редакторысыз. Оқырман оғаш кафенің мәзірін жіберді. Қисынсыз бағаларды тауып, ақшасыз оқырманға не алуға болатынын айтыңыз.' },
    textHeading: 'Мәзірді оқыңыз',
    text: {
      title: 'The Silly Café',
      lines: [
        'SOUP — $3',
        'AIR — $5',
        'WATER — free',
        'INVISIBLE CAKE — $10'
      ],
      glossary: [{ en: 'soup', kk: 'сорпа' }, { en: 'air', kk: 'ауа' }, { en: 'invisible', kk: 'көзге көрінбейтін' }]
    },
    tasks: [
      C('Мәзірде қандай бағалар қисынсыз?', [
        'Ауа — $5 және көзге көрінбейтін торт — $10',
        'Сорпа — $3',
        'Су тегін'
      ], 0, 'AIR — $5, INVISIBLE CAKE — $10: ауа мен көрінбейтін торт үшін ақша алу — әзіл.',
        { outcomes: ['Мақала дайын: «Ауаға ақша төлейтін кафе».', '$3 сорпа — қалыпты баға, бұл әзіл емес.', 'Тегін су — кафеде қалыпты нәрсе.'] }),
      C('Оқырманның ақшасы жоқ, бірақ шөлдеген. Не алуға болады?', ['WATER — free', 'AIR — $5', 'SOUP — $3'], 0,
        'free — тегін: су ақысыз.')
    ]
  });

  variant(L, 'v-tech', {
    task: 'хабарламадан бағаны тауып, алаяқтықты тану',   // [не проверено носителем]
    interests: ['tech'], mode: 'safety', role: 'Отбасының цифрлық қорғаушысы', label: 'Қауіпсіздік: алаяқтықты тап',
    mission: { title: 'Ұтыс туралы хабарлама', scene: 'Әжеңіздің телефонына «тегін телефон ұттыңыз» деген хабарлама келді. Бағаны тауып, хабарламаның неге қауіпті екенін анықтаңыз.' },
    textHeading: 'Хабарламаны оқыңыз',
    text: {
      title: 'Prize message',
      lines: [
        'YOU WON A FREE PHONE!',
        'Delivery price — $1',
        'Send your card number today.'
      ],
      glossary: [{ en: 'won', kk: 'ұтып алдыңыз' }, { en: 'delivery', kk: 'жеткізу' }, { en: 'card number', kk: 'карта нөмірі' }]
    },
    tasks: [
      C('Телефон «тегін» делінген. Бірақ хабарлама бойынша не төлеу керек?', ['Жеткізу үшін $1', 'Ештеңе', 'Телефон үшін $100'], 0,
        'Delivery price — $1. «Тегін» дейді де, ақша мен карта нөмірін сұрайды — бұл алаяқтықтың белгісі.'),
      C('Әжеңізге не кеңес бересіз?', [
        'Карта нөмірін жібермеңіз: бұл алаяқтықтың белгісі',
        'Жіберіңіз: $1 — арзан',
        'Хабарламаны досыңызға жіберіңіз, ол да ұтсын'
      ], 0, 'FREE + ақы + карта нөмірі = қауіпті белгі. Карта нөмірін бейтаныс хабарламаға жібермейміз.',
        { outcomes: ['Әжеңіз хабарламаны өшірді. Ақша аман.', 'Картадан $1 емес, әлдеқайда көп ақша шешілуі мүмкін.', 'Енді досыңыз да қауіпке ұшырайды.'] })
    ]
  });
})();
