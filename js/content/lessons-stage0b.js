/*
 * Ступень 0, второй урок по каждому навыку (ориентир A0 / Pre-A1, предварительно).
 * Все тексты оригинальные и вымышленные. У каждого урока 3 тематических текста;
 * для остальных интересов показывается общий текст (defaultContext) с пометкой.
 */
(function () {
  var C = FEA.choice, T = FEA.typed, O = FEA.order, M = FEA.match, W = FEA.word;

  // ---------------------------------------------------------------- СӨЗДЕР
  FEA.lessons.push({
    id: 's0-words-2',
    stage: 0,
    order: 2,
    skill: 'words',
    defaultContext: 'travel',
    title: 'Сыпайы сөздер',
    goal: 'Өтініп сұрау, кешірім сұрау және келісу үшін сыпайы сөздерді тану, еске түсіру және жағдайға қарай қолдану.',
    explain: [
      'Бұл сабақта үш қысқа, бірақ өте жиі керек сөз үйренеміз: please, sorry, yes.',
      'please — бірдеңе сұрағанда айтылады, көбіне сөйлемнің соңында тұрады. Қазақшадағы «...шы/-ші» немесе «өтінемін» сияқты сыпайылық береді.',
      'sorry — кешірім сұрағанда айтылады, мысалы, біреуге абайсызда соғылып қалсаңыз.'
    ],
    examples: [
      { en: 'Tea, please.', kk: 'Шай беріңізші.' },
      { en: 'Sorry!', kk: 'Кешіріңіз!' }
    ],
    words: [
      W('please', 'өтінемін, ...шы/-ші', '🙏', 'плиз'),
      W('sorry', 'кешіріңіз', '😔', 'сори'),
      W('yes', 'иә', '👍', 'йес')
    ],
    warmup: C('Еске түсіріңіз: «hello» сөзі нені білдіреді?', ['сәлем', 'рақмет', 'иә'], 0,
      'hello — сәлем. Кездескенде айтылады.'),
    tasks: [
      M('Сөздерді мағынасымен сәйкестендіріңіз.'),
      C('Кафеде кофе сұрайсыз. Қалай айтасыз?', ['Coffee, please.', 'Coffee, sorry.', 'Coffee, hello.'], 0,
        'Бірдеңе сұрағанда — please: Coffee, please.'),
      T('Ағылшынша жазыңыз: кешіріңіз (кешірім сұрағанда)', ['sorry', "i'm sorry", 'i am sorry'],
        'кешіріңіз — sorry. Жазылуында екі r бар: s-o-r-r-y.')
    ],
    contexts: {
      travel: {
        themeWords: [W('coffee', 'кофе', '☕', 'кофи'), W('seat', 'орын (отыратын)', '💺', 'сит')],
        text: {
          title: 'On the plane',
          lines: ['A: Coffee, please.', 'B: Yes. Here you are.', 'A: Thank you!', 'A: Sorry, this is my seat. It is 12A.'],
          glossary: [{ en: 'here you are', kk: 'мінеки, алыңыз' }, { en: 'my seat', kk: 'менің орным' }]
        },
        tasks: [
          C('Жолаушы не сұрайды?', ['кофе', 'шай', 'су'], 0, 'Coffee, please — кофе беріңізші.'),
          C('Жолаушының орны қай?', ['12A', '21A', '12B'], 0, 'It is 12A — менің орным 12A.')
        ]
      },
      tech: {
        themeWords: [W('charger', 'зарядтағыш', '🔌', 'чарджер'), W('laptop', 'ноутбук', '💻', 'лэптоп')],
        text: {
          title: 'The charger',
          lines: ['Aru: Dad, the charger, please!', 'Dad: Yes. Here you are.', 'Aru: Thank you!', 'Aru: Oh, sorry, Dad! This is your laptop, not my laptop.'],
          glossary: [{ en: 'here you are', kk: 'мінеки, алыңыз' }, { en: 'your', kk: 'сіздің' }]
        },
        tasks: [
          C('Ару әкесінен не сұрайды?', ['зарядтағыш', 'телефон', 'су'], 0, 'the charger, please — зарядтағышты беріңізші.'),
          C('Ару неге кешірім сұрайды?', ['Ноутбук әкесінікі болып шықты.', 'Ол кешігіп келді.', 'Ол телефонды сындырды.'], 0,
            'This is your laptop, not my laptop — бұл менің емес, сіздің ноутбугіңіз.')
        ]
      },
      nature: {
        themeWords: [W('dog', 'ит', '🐶', 'дог'), W('cat', 'мысық', '🐱', 'кэт')],
        text: {
          title: 'In the park',
          lines: ['A dog runs to a girl.', 'Man: Sorry! Sorry! This is my dog.', 'Girl: It is OK. I have a cat.', 'Girl: Hello, dog!'],
          glossary: [{ en: 'runs to', kk: '... қарай жүгіреді' }, { en: 'I have', kk: 'менде бар' }]
        },
        tasks: [
          C('Ит кімдікі?', ['ер адамның', 'қыздың', 'ешкімнің'], 0, 'Man: This is my dog — бұл менің итім (дейді ер адам).'),
          C('Қыздың үйінде қандай жануар бар?', ['мысық', 'ит', 'құс'], 0, 'I have a cat — менде мысық бар.')
        ]
      }
    },
    review: [
      { id: 's0-words-2-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: өтінемін (бірдеңе сұрағанда)', answers: ['please'],
        explain: 'өтінемін — please.' },
      { id: 's0-words-2-r2', type: 'choice', prompt: 'Біреудің аяғын абайсызда басып кеттіңіз. Не дейсіз?', options: ['Sorry!', 'Please!', 'Yes!'], answer: 0,
        explain: 'Кешірім сұрағанда — Sorry!' }
    ],
    editorNotes: [
      '«please ↔ ...шы/-ші, өтінемін» — сопоставление проверить специалистом по казахскому.',
      'Примерное чтение кириллицей (плиз, сори, чарджер) — грубое приближение.'
    ]
  });

  // ---------------------------------------------------------------- ГРАММАТИКА
  FEA.lessons.push({
    id: 's0-grammar-2',
    stage: 0,
    order: 2,
    skill: 'grammar',
    defaultContext: 'nature',
    title: 'one cat — two cats',
    goal: 'Бірнеше затты атағанда сөздің соңына -s қосу: бір зат — -s жоқ, бірнеше зат — -s бар.',
    explain: [
      'Қазақша сан есімнен кейін көптік жалғау қойылмайды: екі кітап (екі кітаптар емес).',
      'Ағылшынша керісінше: зат бірден көп болса, сөзге -s қосылады.',
      'Зат біреу болса, -s қосылмайды.'
    ],
    examples: [
      { en: 'one book — two books', kk: 'бір кітап — екі кітап' },
      { en: 'three bags', kk: 'үш сөмке' }
    ],
    words: [
      W('two', 'екі', '2️⃣', 'ту'),
      W('three', 'үш', '3️⃣', 'сри')
    ],
    warmup: C('Еске түсіріңіз: бос орынға қай сөз келеді?', ['am', 'is', 'are'], 0,
      'I сөзімен am келеді: I am ready.', { sentence: 'I ___ ready.' }),
    tasks: [
      C('Дұрыс нұсқаны таңдаңыз.', ['dogs', 'dog', 'doges'], 0,
        'two — екі, яғни біреуден көп. Сондықтан -s қосылады: dogs.', { sentence: 'I have two ___.' }),
      T('Көпше түрде жазыңыз:', ['cars'],
        'three — үш, сондықтан car → cars.', { sentence: 'one car — three ___' }),
      T('Қатені түзетіп, сөйлемді толық жазыңыз:', ['i have three books'],
        'three — үш, сондықтан books. Қазақша «үш кітап» дейміз, бірақ ағылшынша -s міндетті.', { sentence: 'I have three book.' })
    ],
    contexts: {
      nature: {
        themeWords: [W('bird', 'құс', '🐦', 'бёрд')],
        text: {
          title: 'My garden',
          lines: ['This is my garden.', 'I see two birds.', 'I see one cat.', 'The cat is small.'],
          glossary: [{ en: 'garden', kk: 'бақша' }, { en: 'I see', kk: 'мен көремін' }]
        },
        tasks: [
          C('Бақшада неше құс бар?', ['екі', 'бір', 'үш'], 0, 'I see two birds — екі құсты көремін.'),
          C('Мәтінде неге «birds» деп жазылған?', ['Құс біреуден көп.', 'Құс кішкентай.', 'Құс бақшада.'], 0,
            'two birds — құс екеу, сондықтан -s қосылған. Мысық біреу: one cat.')
        ]
      },
      sport: {
        themeWords: [W('glove', 'қолғап', '🥊', 'глав')],
        text: {
          title: 'My sport bag',
          lines: ['This is my sport bag.', 'In the bag: two gloves, one towel and three bottles of water.'],
          glossary: [{ en: 'towel', kk: 'орамал' }, { en: 'bottles of water', kk: 'бөтелке су' }]
        },
        tasks: [
          C('Сөмкеде неше қолғап бар?', ['екі', 'бір', 'үш'], 0, 'two gloves — екі қолғап.'),
          C('Қай сөз бір ғана затты білдіреді?', ['towel', 'gloves', 'bottles'], 0,
            'one towel — бір орамал, сондықтан -s жоқ. gloves пен bottles соңында -s бар.')
        ]
      },
      tech: {
        themeWords: [W('computer', 'компьютер', '🖥️', 'компьютэр')],
        text: {
          title: 'Our home',
          lines: ['We have two computers.', 'Mom has one phone.', 'I have one phone too.', 'We have three chargers.'],
          glossary: [{ en: 'we have', kk: 'бізде бар' }, { en: 'too', kk: 'да, де (сондай-ақ)' }]
        },
        tasks: [
          C('Үйде неше компьютер бар?', ['екі', 'үш', 'бір'], 0, 'two computers — екі компьютер.'),
          C('«three chargers» дегенде неге соңында -s бар?', ['Зарядтағыш үшеу.', 'Зарядтағыш жаңа.', 'Зарядтағыш анасыныкі.'], 0,
            'three — үш, біреуден көп, сондықтан chargers.')
        ]
      }
    },
    review: [
      { id: 's0-grammar-2-r1', type: 'type', prompt: 'Көпше түрде жазыңыз:', sentence: 'one bag — two ___', answers: ['bags'],
        explain: 'two — екі, сондықтан bags.' },
      { id: 's0-grammar-2-r2', type: 'choice', prompt: 'Бос орынға қай нұсқа келеді?', sentence: 'We have three ___.', options: ['cats', 'cat', 'a cat'], answer: 0,
        explain: 'three — үш, сондықтан cats.' }
    ],
    editorNotes: [
      'Сопоставление «сан есімнен кейін көптік жалғау жоқ (екі кітап)» — проверить формулировку специалистом по казахскому.',
      'Исключения (child — children, man — men) намеренно не даются на этой ступени.'
    ]
  });

  // ---------------------------------------------------------------- ОҚУ
  FEA.lessons.push({
    id: 's0-reading-2',
    stage: 0,
    order: 2,
    skill: 'reading',
    defaultContext: 'usa',
    title: 'Бағаны табу',
    goal: 'Мәзірден, билеттен немесе баға тізімінен керек заттың бағасын және тегін нәрсені табу.',
    explain: [
      'Баға көбіне сан мен ақша белгісі арқылы жазылады: $5 — бес доллар, 500 ₸ — бес жүз теңге.',
      'Алдымен керек заттың атын тауып, сол жолдағы санды оқыңыз. Әр сөзді түсіну міндетті емес.'
    ],
    examples: [
      { en: 'Tea — $2', kk: 'Шай — 2 доллар' },
      { en: 'Kids: free', kk: 'Балаларға: тегін' }
    ],
    words: [
      W('price', 'баға', '🏷️', 'прайс'),
      W('free', 'тегін', '🎁', 'фри')
    ],
    warmup: C('Еске түсіріңіз: «closed» сөзі нені білдіреді?', ['жабық', 'ашық', 'тегін'], 0,
      'closed — жабық, open — ашық.'),
    tasks: [
      C('«free» сөзі бағамен бірге нені білдіреді?', ['тегін', 'қымбат', 'жабық'], 0,
        'free — тегін, ақша төлемейсіз.'),
      C('Су қанша тұрады?', ['$1', '$2', '$3'], 0,
        'WATER — $1. Әр жолда бір зат және оның бағасы тұр.', { sign: ['JUICE — $3', 'WATER — $1', 'TEA — $2'], glossary: [{ en: 'juice', kk: 'шырын' }] }),
      T('Ағылшынша жазыңыз: баға', ['price'], 'баға — price.')
    ],
    contexts: {
      usa: {
        themeWords: [W('menu', 'мәзір', '📋', 'мэнью')],
        text: {
          title: 'Diner menu',
          sign: true,
          lines: ['DINER MENU', 'Pancakes — $6', 'Eggs — $4', 'Coffee — $2', 'Water — free'],
          glossary: [{ en: 'pancakes', kk: 'құймақ' }, { en: 'eggs', kk: 'жұмыртқа' }]
        },
        tasks: [
          C('Құймақ қанша тұрады?', ['$6', '$4', '$2'], 0, 'Pancakes — $6.'),
          C('Мәзірде не тегін?', ['су', 'кофе', 'жұмыртқа'], 0, 'Water — free: су тегін.')
        ]
      },
      travel: {
        themeWords: [W('adult', 'ересек', '🧑', 'эдалт')],
        text: {
          title: 'Bus tickets',
          sign: true,
          lines: ['CITY BUS', 'Adult ticket — 200 ₸', 'Child ticket — 100 ₸', 'Under 7 years — free'],
          glossary: [{ en: 'child', kk: 'бала' }, { en: 'under 7 years', kk: '7 жасқа дейін' }]
        },
        tasks: [
          C('Ересек адамның билеті қанша тұрады?', ['200 ₸', '100 ₸', 'тегін'], 0, 'Adult ticket — 200 ₸.'),
          C('5 жастағы балаға билет қанша тұрады?', ['тегін', '100 ₸', '200 ₸'], 0,
            'Under 7 years — free: 7 жасқа дейінгі балаларға тегін. 5 жас — 7-ден кіші.')
        ]
      },
      nature: {
        themeWords: [W('zoo', 'хайуанаттар бағы', '🦁', 'зу')],
        text: {
          title: 'Zoo tickets',
          sign: true,
          lines: ['GREEN HILL ZOO', 'Open: 9:00–18:00', 'Adults — 1500 ₸', 'Kids — 700 ₸', 'Monday — free for kids'],
          glossary: [{ en: 'kids', kk: 'балалар' }, { en: 'adults', kk: 'ересектер' }, { en: 'Monday', kk: 'дүйсенбі' }]
        },
        tasks: [
          C('Балалар билеті қанша тұрады?', ['700 ₸', '1500 ₸', 'тегін'], 0, 'Kids — 700 ₸.'),
          C('Балаларға қай күні тегін?', ['дүйсенбі', 'сенбі', 'жексенбі'], 0, 'Monday — free for kids: дүйсенбіде балаларға тегін.')
        ]
      },
      sport: {
        themeWords: [W('stadium', 'стадион', '🏟️', 'стэйдиэм')],
        text: {
          title: 'Football match',
          sign: true,
          lines: ['CITY STADIUM — FOOTBALL MATCH', 'Saturday, 18:00', 'Ticket — 2000 ₸', 'Kids under 12 — 1000 ₸', 'Gates open: 17:00'],
          glossary: [{ en: 'kids under 12', kk: '12 жасқа дейінгі балалар' }, { en: 'gates open', kk: 'кіру басталады' }]
        },
        tasks: [
          C('10 жастағы балаға билет қанша тұрады?', ['1000 ₸', '2000 ₸', 'тегін'], 0,
            'Kids under 12 — 1000 ₸: 12 жасқа дейінгі балаларға 1000 теңге.'),
          C('Стадионға сағат нешеден бастап кіруге болады?', ['17:00', '18:00', '12:00'], 0,
            'Gates open: 17:00 — кіру 17:00-де басталады. 18:00 — матчтың басталуы.')
        ]
      }
    },
    review: [
      { id: 's0-reading-2-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: тегін', answers: ['free'], explain: 'тегін — free.' },
      { id: 's0-reading-2-r2', type: 'choice', prompt: 'Сорпа қанша тұрады?', sign: ['SANDWICH — $5', 'SOUP — $4'], glossary: [{ en: 'soup', kk: 'сорпа' }],
        options: ['$4', '$5', 'тегін'], answer: 0, explain: 'SOUP — $4.' }
    ],
    editorNotes: [
      'Цены в текстах вымышленные и не описывают реальные тарифы.'
    ]
  });
})();
