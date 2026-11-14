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
        'Yes. First, heat the pan.',
        'Don\'t mix the egg.'
      ], 0, 'Рецептте first — араластыру, then — табаны қыздыру.',
        { outcomes: ['Інің қамырды араластырып, сосын табаны қыздырды.', 'Таба бос қызып, май түтіндей бастады.', 'Жұмыртқасыз қамыр жабысып қалды.'] })
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
        'Clap after the stamp!',
        'First, stamp two times.'
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
        'Созылу мүлде керек емес',
        'Алдымен қолды айналдыру керек еді'
      ], 0, 'First, walk or jog slowly for five minutes. Созылу — кейін: Then stretch gently.',
        { outcomes: [
          'Досыңыз алдымен баяу жүгіріп, денесін қыздырды.',
          'Нұсқаулықта созылу бар: Then stretch gently.',
          'Нұсқаулықта бірінші қадам — жүру не баяу жүгіру.'
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
