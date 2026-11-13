/*
 * Ступень 2, второй урок по каждому навыку (ориентир A2, предварительно).
 * Все тексты оригинальные и вымышленные. Реальные места — только фон, без фактических утверждений.
 */
(function () {
  var C = FEA.choice, T = FEA.typed, M = FEA.match, W = FEA.word;

  // ---------------------------------------------------------------- СӨЗДЕР
  FEA.lessons.push({
    id: 's2-words-2',
    stage: 2,
    order: 2,
    skill: 'words',
    defaultContext: 'travel',
    title: 'Сапарға дайындық',
    goal: 'Сапарға дайындыққа қатысты book, pack, miss етістіктерін түсіну және дұрыс тіркеспен қолдану.',
    explain: [
      'Ағылшынша кейбір етістіктер белгілі бір сөздермен жұп болып келеді: book a room — бөлме брондау, pack a bag — сөмке жинау.',
      'Бір сөздің бірнеше мағынасы болуы мүмкін: a book — кітап, ал to book — брондау.',
      'miss — бір нәрседен құр қалу, үлгермеу. Бұл жай «кешігу» емес: кешіккендіктен автобус кетіп қалды деген мағына.'
    ],
    examples: [
      { en: 'We booked a table for six.', kk: 'Алты адамға үстел брондадық.' },
      { en: 'Don\'t forget to pack your charger.', kk: 'Зарядтағышыңды салуды ұмытпа.' }
    ],
    words: [
      W('book', 'брондау (етістік)', '📅'),
      W('pack', 'жинау, сөмкеге салу', '🧳'),
      W('miss', 'үлгермей қалу, құр қалу', '⏰')
    ],
    warmup: C('Еске түсіріңіз: «tired» сөзі нені білдіреді?', ['шаршаған', 'таң қалған', 'алаңдаған'], 0,
      'tired — шаршаған.'),
    tasks: [
      M('Сөздерді мағынасымен сәйкестендіріңіз.'),
      C('Бос орынға қай сөз келеді?', ['miss', 'book', 'pack'], 0,
        'Асықпасақ, пойызға үлгермей қаламыз: miss the train.', { sentence: 'Hurry up, or we will ___ the train!' }),
      T('Бос орынды толтырыңыз (жинау):', ['pack'],
        'pack a suitcase — чемодан жинау.', { sentence: 'I need to ___ my suitcase tonight. We leave at 6 a.m.' }),
      C('Қай сөйлемде book сөзі «брондау» мағынасында тұр?', [
        'We want to book a room by the sea.',
        'This book is very interesting.',
        'I left my book on the bus.'
      ], 0, 'to book a room — бөлме брондау. Қалған екі сөйлемде book — кітап.')
    ],
    contexts: {
      travel: {
        themeWords: [W('route', 'бағыт, маршрут', '🗺️'), W('reservation', 'брондау (құжаты), тапсырыс', '📝')],
        text: {
          title: 'Planning our trip to Burabay',
          lines: [
            'Last month our family planned a weekend trip to Burabay.',
            'Dad booked two rooms in a small guesthouse and printed the reservation.',
            'Aru made the route: Astana, then a short stop for lunch, then the lake.',
            'On Friday night everyone packed their bags.',
            'On Saturday we almost missed the bus, because Grandma could not find her glasses — they were on her head!'
          ],
          glossary: [{ en: 'guesthouse', kk: 'шағын қонақ үй' }, { en: 'printed', kk: 'басып шығарды' }]
        },
        tasks: [
          C('Маршрутты кім жасады?', ['Ару', 'Әкесі', 'Әжесі'], 0, 'Aru made the route — маршрутты Ару жасады.'),
          C('Олар неге автобусқа үлгермей қала жаздады?', ['Әжесі көзілдірігін таба алмады.', 'Әкесі бронды ұмытты.', 'Сөмкелер жиналмаған еді.'], 0,
            'Grandma could not find her glasses — әже көзілдірігін таба алмады. Ол басында тұрған екен!')
        ]
      },
      usa: {
        themeWords: [W('rental car', 'жалға алынған көлік', '🚙'), W('motel', 'мотель (жол бойындағы қонақүй)', '🏨')],
        text: {
          title: 'A road trip',
          lines: [
            'Before our road trip, my uncle booked a rental car online.',
            'We packed snacks, water and warm jackets.',
            'The plan was to drive six hours and stay at a motel near the canyon.',
            'We missed the first exit, so the trip took seven hours instead of six.',
            'But the view at sunset was worth it.'
          ],
          glossary: [{ en: 'exit', kk: 'тас жолдан шығатын жол' }, { en: 'worth it', kk: 'тұрарлық' }]
        },
        tasks: [
          C('Көлікті кім брондады?', ['автордың ағасы (uncle)', 'автордың әкесі', 'автордың өзі'], 0, 'my uncle booked a rental car.'),
          C('Жол неге жеті сағатқа созылды?', ['Олар бірінші бұрылыстан өтіп кетті.', 'Көлік бұзылды.', 'Мотель жабық болды.'], 0,
            'We missed the first exit — бірінші шығатын жолдан өтіп кеттік.')
        ]
      },
      sport: {
        themeWords: [W('tournament', 'турнир', '🏆'), W('equipment', 'жабдық', '🥋')],
        text: {
          title: 'Getting ready for the tournament',
          lines: [
            'Next week our club travels to a regional tournament.',
            'Coach Aigerim booked the bus and a hostel for the team.',
            'Each student must pack their own equipment: gloves, a mouth guard and a water bottle.',
            '"Don\'t miss the bus at 7:00," she said. "It will not wait!"'
          ],
          glossary: [{ en: 'hostel', kk: 'хостел (арзан қонақ үй)' }, { en: 'mouth guard', kk: 'тіс қорғағыш (капа)' }]
        },
        tasks: [
          C('Автобус пен хостелді кім брондады?', ['Жаттықтырушы Әйгерім', 'Оқушылар', 'Ата-аналар'], 0, 'Coach Aigerim booked the bus and a hostel.'),
          C('Әр оқушы өзі не жинауы керек?', ['Өз жабдығын', 'Тамақ', 'Автобус билетін'], 0,
            'Each student must pack their own equipment — әр оқушы өз жабдығын жинайды.')
        ]
      }
    },
    review: [
      { id: 's2-words-2-r1', type: 'type', prompt: 'Ағылшынша жазыңыз (бір сөз): брондау', answers: ['book'], explain: 'брондау — book.' },
      { id: 's2-words-2-r2', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'If you leave home late, you will ___ your flight.',
        options: ['miss', 'pack', 'book'], answer: 0, explain: 'Кеш шықсаң, ұшаққа үлгермейсің: miss your flight.' }
    ],
    editorNotes: [
      '«miss — жай кешігу емес» — формулировку проверить специалистом по казахскому.',
      'Burabay упоминается только как место поездки; фактических утверждений нет.'
    ]
  });

  // ---------------------------------------------------------------- ГРАММАТИКА
  FEA.lessons.push({
    id: 's2-grammar-2',
    stage: 2,
    order: 2,
    skill: 'grammar',
    defaultContext: 'nature',
    title: 'bigger / more interesting',
    goal: 'Екі нәрсені салыстыру: қысқа сөзге -er, ұзын сөзге more және than.',
    explain: [
      'Қазақша салыстырғанда «-рақ/-рек» жұрнағы мен «-нан/-нен» жалғауы қолданылады: Бұл қорап ана қораптан кішірек.',
      'Ағылшынша қысқа сөзге -er қосылады, ал «-нан/-нен» орнына than сөзі келеді: This box is smaller than that box.',
      'Ұзын сөздің алдына more қойылады: more beautiful — әдемірек.',
      'Ерекше сөздер: good → better, bad → worse.'
    ],
    examples: [
      { en: 'My brother is taller than me.', kk: 'Бауырым менен ұзынырақ.' },
      { en: 'This film is more exciting than that one.', kk: 'Бұл фильм анауынан қызығырақ.' }
    ],
    words: [
      W('than', '...-нан/-нен (салыстырғанда)', '⚖️'),
      W('heavy', 'ауыр', '🏋️')
    ],
    warmup: C('Еске түсіріңіз: бос орынға қай сөз келеді?', ['was', 'were', 'am'], 0,
      'I сөзімен өткен шақта was: I was reading.', { sentence: 'I ___ reading when the phone rang.' }),
    tasks: [
      C('Бос орынға қай нұсқа келеді?', ['bigger', 'big', 'more big'], 0,
        'big — қысқа сөз: bigger. «more big» деп айтпаймыз.', { sentence: 'An elephant is ___ than a mouse.' }),
      T('Жақшадағы сөзді салыстыру түрінде жазыңыз:', ['heavier'],
        'heavy — y әрпі i-ге ауысып, -er қосылады: heavier.', { sentence: 'My suitcase is ___ (heavy) than yours.' }),
      C('Бос орынға қай нұсқа келеді?', ['more interesting', 'interestinger', 'more interestinger'], 0,
        'interesting — ұзын сөз, сондықтан more interesting.', { sentence: 'This book is ___ than the film.' }),
      T('Қатені түзетіп, сөйлемді толық жазыңыз:', ['today is colder than yesterday'],
        'cold — қысқа сөз: colder. «more cold» — қате.', { sentence: 'Today is more cold than yesterday.' })
    ],
    contexts: {
      nature: {
        themeWords: [W('puppy', 'күшік', '🐶')],
        text: {
          title: 'Two puppies',
          lines: [
            'Our neighbors have two puppies, Tobi and Lala.',
            'Tobi is bigger than Lala, but Lala is faster.',
            'Tobi is calmer and sleeps more.',
            'Lala is more curious: she smells every flower in the garden.',
            'Which puppy is better? Both are wonderful!'
          ],
          glossary: [{ en: 'calm', kk: 'сабырлы' }, { en: 'curious', kk: 'әуесқой, білуге құмар' }]
        },
        tasks: [
          C('Қай күшік үлкенірек?', ['Тоби', 'Лала', 'екеуі бірдей'], 0, 'Tobi is bigger than Lala.'),
          C('Лала туралы қай сөйлем дұрыс?', ['Ол Тобиден жылдамырақ.', 'Ол Тобиден үлкенірек.', 'Ол көбірек ұйықтайды.'], 0,
            'Lala is faster — Лала жылдамырақ. Көбірек ұйықтайтын — Тоби.')
        ]
      },
      tech: {
        themeWords: [W('battery', 'батарея', '🔋')],
        text: {
          title: 'Choosing a phone',
          lines: [
            'Dina wants a new phone and compares two models.',
            'Phone A is cheaper than Phone B.',
            'Phone B has a bigger screen and a stronger battery.',
            'Phone A is lighter, so it is easier to carry.',
            'Dina chooses Phone A, because the price is more important to her than the screen.'
          ],
          glossary: [{ en: 'compares', kk: 'салыстырады' }, { en: 'lighter', kk: 'жеңілірек' }]
        },
        tasks: [
          C('Қай телефонның батареясы мықтырақ?', ['B', 'A', 'бірдей'], 0, 'Phone B has a stronger battery.'),
          C('Дина неге A телефонын таңдады?', ['Ол үшін баға экраннан маңыздырақ.', 'A телефонның экраны үлкенірек.', 'B телефоны сатылып кеткен.'], 0,
            'the price is more important to her than the screen.')
        ]
      },
      mystery: {
        themeWords: [W('tower', 'мұнара', '🗼')],
        text: {
          title: 'The two towers',
          lines: [
            'In the village there are two old towers: the White Tower and the Black Tower.',
            'The White Tower is taller, but the Black Tower is older.',
            'One evening, Sana noticed that the clock on the White Tower was slower than her watch — exactly ten minutes slower.',
            'The next evening it was twenty minutes slower.',
            'Was it a broken clock, or a message?'
          ],
          glossary: [{ en: 'noticed', kk: 'байқады' }, { en: 'watch', kk: 'қол сағаты' }]
        },
        tasks: [
          C('Қай мұнара ескірек?', ['Қара мұнара', 'Ақ мұнара', 'екеуі бірдей'], 0, 'the Black Tower is older.'),
          C('Сана нені байқады?', ['Ақ мұнарадағы сағат артта қалып жүр.', 'Қара мұнара құлап қалған.', 'Мұнарада жарық жанып тұр.'], 0,
            'the clock on the White Tower was slower than her watch — сағат артта қалған.')
        ]
      }
    },
    review: [
      { id: 's2-grammar-2-r1', type: 'type', prompt: 'Жақшадағы сөзді салыстыру түрінде жазыңыз:', sentence: 'Summer is ___ (hot) than spring.', answers: ['hotter'],
        explain: 'hot → hotter: соңғы t екі рет жазылады.' },
      { id: 's2-grammar-2-r2', type: 'choice', prompt: 'Бос орынға қай нұсқа келеді?', sentence: 'This test is ___ than the last one.',
        options: ['easier', 'more easy', 'easyer'], answer: 0, explain: 'easy → easier (y → i + er).' }
    ],
    editorNotes: [
      'Сопоставление «-рақ/-рек, -нан/-нен ↔ -er, than» — проверить специалистом по казахскому.',
      'Пример «Бауырым менен ұзынырақ» — проверить перевод (brother → бауырым).'
    ]
  });

  // ---------------------------------------------------------------- ОҚУ
  FEA.lessons.push({
    id: 's2-reading-2',
    stage: 2,
    order: 2,
    skill: 'reading',
    defaultContext: 'mystery',
    title: 'Сөз мағынасын мәтіннен табу',
    goal: 'Таныс емес сөздің мағынасын айналадағы сөздерден табу және it, they сөздері нені меңзейтінін түсіну.',
    explain: [
      'Таныс емес сөзді көргенде бірден аударуға асықпаңыз. Алдындағы және кейінгі сөйлемдерге қараңыз: олар көбіне мағынасын көрсетеді.',
      'it, they, this сияқты сөздер мәтінде бұрын аталған нәрсені меңзейді. Нені меңзейтінін табу үшін алдыңғы сөйлемге қайта қараңыз.'
    ],
    examples: [
      { en: 'The soup was so spicy that my mouth was on fire.', kk: 'Сорпа соншалық ащы болды, аузым күйіп кетті. (spicy — ащы)' },
      { en: 'I bought new shoes. They are very comfortable.', kk: 'Жаңа аяқкиім сатып алдым. Олар өте ыңғайлы. (They = shoes)' }
    ],
    words: [
      W('guess', 'болжау, топшылау', '🤔'),
      W('meaning', 'мағына', '💡')
    ],
    warmup: C('Еске түсіріңіз: «The text does not say» нені білдіреді?', ['Мәтінде айтылмаған.', 'Мәтін ұзын.', 'Мәтін түсінікті.'], 0,
      'Жауап мәтінде болмаса — The text does not say.'),
    tasks: [
      C('Мәтіндегі «slippery» сөзі нені білдіреді?', ['тайғақ', 'кең', 'құрғақ'], 0,
        'Жаңбырдан кейін, әкесі баяу жүрді — демек, жол тайғақ болды.',
        { text: ['The road was slippery after the rain, so Dad drove very slowly.'] }),
      C('Мәтіндегі «it» нені меңзейді?', ['бақшаны', 'әжені', 'таңды'], 0,
        'Алдыңғы сөйлемде a garden аталған. She works in it — бақшада жұмыс істейді.',
        { text: ['My grandmother has a garden. She works in it every morning.'] }),
      T('Ағылшынша жазыңыз: мағына', ['meaning'], 'мағына — meaning.')
    ],
    contexts: {
      mystery: {
        themeWords: [W('riddle', 'жұмбақ', '❓')],
        text: {
          title: 'The note in the lunchbox',
          lines: [
            'On Monday, Timur found a folded note in his lunchbox.',
            'It said: "I sleep in your bag all day. At night I drink from the wall. If I stop drinking, your phone goes quiet. What am I?"',
            'Timur was puzzled. He read the riddle again and again.',
            'At night, when he plugged in his phone, he suddenly understood: the answer was his charger!',
            'But who put the riddle in his lunchbox? His sister just smiled.'
          ],
          glossary: [{ en: 'folded', kk: 'бүктелген' }, { en: 'plugged in', kk: 'розеткаға қосты' }]
        },
        tasks: [
          C('Мәтіндегі «puzzled» сөзі нені білдіреді?', ['таңырқап, түсінбей қалған', 'қуанышты', 'ашулы'], 0,
            'Ол жұмбақты қайта-қайта оқыды — демек, бірден түсінбеді.'),
          C('«It said: …» сөйлеміндегі It нені меңзейді?', ['жазбаны', 'түскі ас қорабын', 'телефонды'], 0,
            'Алдыңғы сөйлемде a folded note аталған — It сол жазбаны меңзейді.')
        ]
      },
      tech: {
        themeWords: [W('link', 'сілтеме', '🔗')],
        text: {
          title: 'A strange message',
          lines: [
            'Yesterday Mom got a message: "Congratulations! You won a new phone! Click this link and enter your card number."',
            'She did not know the sender, and the message had many mistakes.',
            'Mom did not click it. She deleted the message and told the family.',
            '"Real prizes never ask for your card number," she said.'
          ],
          glossary: [{ en: 'sender', kk: 'жіберуші' }, { en: 'deleted', kk: 'өшірді' }]
        },
        tasks: [
          C('«Mom did not click it» сөйлеміндегі it нені меңзейді?', ['сілтемені', 'телефонды', 'карточканы'], 0,
            'Хабарламада «Click this link» деп жазылған — анасы сілтемені баспады.'),
          C('«Congratulations» сөзінің мағынасын мәтіннен болжаңыз:', ['Құттықтаймыз', 'Кешіріңіз', 'Сақ болыңыз'], 0,
            'Келесі сөздер «You won» — сіз ұттыңыз. Ұтқан адамға «құттықтаймыз» дейді.')
        ]
      },
      nature: {
        themeWords: [W('nest', 'ұя', '🪺')],
        text: {
          title: 'A nest on the balcony',
          lines: [
            'In April, two small birds built a nest on our balcony.',
            'They used grass, leaves and even some of our dog\'s hair.',
            'Soon there were four tiny eggs in it.',
            'We kept the balcony door closed and watched quietly from the window.',
            'Three weeks later, the chicks flew away.'
          ],
          glossary: [{ en: 'chicks', kk: 'балапандар' }, { en: 'tiny', kk: 'кішкентай' }]
        },
        tasks: [
          C('«They used grass…» сөйлеміндегі They кімді меңзейді?', ['екі құсты', 'біздің отбасыны', 'итті'], 0,
            'Алдыңғы сөйлемде two small birds аталған.'),
          C('«flew away» тіркесінің мағынасы қандай?', ['ұшып кетті', 'ұйықтап қалды', 'жасырынып қалды'], 0,
            'Балапандар өсті, сосын ұядан кетті — ұшып кетті.')
        ]
      }
    },
    review: [
      { id: 's2-reading-2-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: болжау', answers: ['guess'], explain: 'болжау — guess.' },
      { id: 's2-reading-2-r2', type: 'choice', prompt: 'Мәтіндегі She кімді меңзейді?', text: ['We have a new teacher. She is very kind.'],
        options: ['жаңа мұғалімді', 'бізді', 'сыныпты'], answer: 0, explain: 'Алдыңғы сөйлемде a new teacher аталған.' }
    ],
    editorNotes: [
      'Загадка про зарядку — оригинальная (не классическая загадка про клавиатуру или часы).',
      'Перевод «puzzled — таңырқап, түсінбей қалған» — проверить специалистом.'
    ]
  });
})();
