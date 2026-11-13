/*
 * Ступень 3, второй урок по каждому навыку (ориентир B1–B2, предварительно).
 * Все тексты оригинальные и вымышленные. Ellison Creek — придуманный город.
 */
(function () {
  var C = FEA.choice, T = FEA.typed, M = FEA.match, W = FEA.word;

  // ---------------------------------------------------------------- СӨЗДЕР
  FEA.lessons.push({
    id: 's3-words-2',
    stage: 3,
    order: 2,
    skill: 'words',
    defaultContext: 'tech',
    title: 'Күнделікті фразалық етістіктер',
    goal: 'come up with, run out of, look forward to тіркестерін контекстен түсіну және дұрыс формада қолдану.',
    explain: [
      'Бұл үш тіркестің мағынасы бөлек сөздерден шықпайды, сондықтан оларды тұтас есте сақтаған дұрыс.',
      'look forward to тіркесінен кейін зат есім немесе -ing формасы келеді: I look forward to the weekend. Мұндағы to — етістіктің бөлігі емес, сондықтан «look forward to see» деген қате жиі кездеседі.',
      'run out of — бір нәрсе таусылу: We ran out of bread.'
    ],
    examples: [
      { en: 'She came up with a clever plan.', kk: 'Ол ақылды жоспар ойлап тапты.' },
      { en: 'We\'re looking forward to the holidays.', kk: 'Біз демалысты асыға күтіп жүрміз.' }
    ],
    words: [
      W('come up with', 'ойлап табу', '💡'),
      W('run out of', 'таусылу, бітіп қалу', '🪫'),
      W('look forward to', 'асыға күту', '🗓️')
    ],
    warmup: C('Еске түсіріңіз: «put off» нені білдіреді?', ['кейінге қалдыру', 'тастап кету', 'қалпына келу'], 0,
      'put off — кейінге қалдыру.'),
    tasks: [
      M('Тіркестерді мағынасымен сәйкестендіріңіз.'),
      C('Бос орынға қай тіркес келеді?', ['ran out of', 'came up with', 'looked forward to'], 0,
        'Жолда жанармай таусылды: ran out of petrol.', { sentence: 'Our car ___ petrol in the middle of nowhere.' }),
      T('Жақшадағы етістікті дұрыс түрде жазыңыз:', ['meeting'],
        'look forward to + -ing: looking forward to meeting.', { sentence: 'I\'m looking forward to ___ (meet) your parents.' }),
      C('Қай сөйлем дұрыс?', [
        'We look forward to hearing from you.',
        'We look forward to hear from you.',
        'We look forward hearing from you.'
      ], 0, 'look forward to + -ing: to hearing. Екінші сөйлемде -ing жоқ, үшіншісінде to жоқ.')
    ],
    contexts: {
      tech: {
        themeWords: [W('back up', 'сақтық көшірме жасау', '💾'), W('update', 'жаңарту', '🔄')],
        text: {
          title: 'The lost photos',
          lines: [
            'Last year my aunt\'s phone fell into a river during a picnic.',
            'She had never backed up her photos, and she lost five years of family pictures.',
            'After that, my cousin came up with a simple family rule: back up your phone every Sunday and install updates when they appear.',
            'Now nobody panics when a phone runs out of battery or breaks.',
            'My aunt says she is looking forward to buying a waterproof case, too.'
          ],
          glossary: [{ en: 'install', kk: 'орнату' }, { en: 'waterproof case', kk: 'су өткізбейтін қап' }]
        },
        tasks: [
          C('Мәтіндегі «backed up» нені білдіреді?', ['сақтық көшірме жасаған', 'жоғалтқан', 'жаңартқан'], 0,
            'Көшірмесі болмағандықтан, суреттер жоғалды — демек, backed up «сақтық көшірме жасау».'),
          C('Отбасылық ережені кім ойлап тапты?', ['Автордың туысы (cousin)', 'Автордың тәтесі (aunt)', 'Автордың өзі'], 0,
            'my cousin came up with a simple family rule.')
        ]
      },
      nature: {
        themeWords: [W('trail', 'соқпақ жол', '🥾'), W('campfire', 'алау', '🔥')],
        text: {
          title: 'A long hike',
          lines: [
            'On our hike in the mountains, we followed a narrow trail for six hours.',
            'In the afternoon we ran out of water, and everyone was tired.',
            'My brother came up with an idea: we checked the map and found a spring only one kilometer away.',
            'In the evening we sat by the campfire, safe and happy.',
            'Next time we will carry more water — and I\'m already looking forward to it.'
          ],
          glossary: [{ en: 'narrow', kk: 'тар' }, { en: 'spring', kk: 'бұлақ' }]
        },
        tasks: [
          C('Олардың не таусылды?', ['су', 'тамақ', 'отын'], 0, 'we ran out of water — су таусылды.'),
          C('Бауыры не ойлап тапты?', ['Картадан жақын бұлақты табуды', 'Үйге қайтуды', 'Алау жағуды'], 0,
            'we checked the map and found a spring — картадан бұлақ таптық.')
        ]
      },
      mystery: {
        themeWords: [W('suspect', 'күдікті', '🕵️'), W('alibi', 'алиби', '🧾')],
        text: {
          title: 'The missing cake',
          lines: [
            'Someone ate half of Grandma\'s birthday cake before the party.',
            'Detective Aliya, age eleven, came up with a list of suspects: her two cousins and the cat.',
            'Cousin Erlan had an alibi: he was at football practice all afternoon.',
            'Cousin Dana had chocolate on her sleeve, but she said it was from her ice cream.',
            'Then Aliya noticed that the cake had been cut neatly with a knife. "The cat can\'t use a knife," she said, looking at Dana.'
          ],
          glossary: [{ en: 'neatly', kk: 'ұқыпты, тегіс' }, { en: 'sleeve', kk: 'жең' }]
        },
        tasks: [
          C('Мәтіндегі «suspects» кімдер?', ['Торт жеген болуы мүмкін адамдар мен мысық', 'Мерекеге келген қонақтар', 'Футбол командасы'], 0,
            'a list of suspects: her two cousins and the cat — күдіктілер тізімі.'),
          C('Ерлан неге күдіктен шығады?', ['Ол түстен кейін футбол жаттығуында болған.', 'Ол тортты ұнатпайды.', 'Оның жеңінде шоколад болмады.'], 0,
            'Erlan had an alibi: he was at football practice all afternoon.')
        ]
      }
    },
    review: [
      { id: 's3-words-2-r1', type: 'type', prompt: 'Ағылшынша жазыңыз (үш сөз): таусылу, бітіп қалу', answers: ['run out of'],
        explain: 'таусылу — run out of.' },
      { id: 's3-words-2-r2', type: 'choice', prompt: 'Бос орынға қай тіркес келеді?', sentence: 'Who ___ this great idea?',
        options: ['came up with', 'ran out of', 'looked forward to'], answer: 0, explain: 'Идеяны ойлап табу — come up with an idea.' }
    ],
    editorNotes: [
      'Объяснение «look forward to: to — етістіктің бөлігі емес» — упрощение (to здесь предлог); проверить формулировку специалистом.',
      'Перевод cousin — «туысы» (нейтрально по полу), aunt — «тәтесі»; проверить.'
    ]
  });

  // ---------------------------------------------------------------- ГРАММАТИКА
  FEA.lessons.push({
    id: 's3-grammar-2',
    stage: 3,
    order: 2,
    skill: 'grammar',
    defaultContext: 'usa',
    title: 'Passive: is made / was built',
    goal: 'Әрекетті кім жасағаны емес, әрекеттің өзі маңызды болғанда ырықсыз етісті (Passive) қолдану.',
    explain: [
      'Ырықсыз етісте назар әрекетті жасаған адамға емес, затқа ауады: The school was painted last summer.',
      'Құрылымы: be (is / are / was / were) + етістіктің үшінші түрі (V3): is cleaned, was opened, were made.',
      'Қазақшада ырықсыз етіс етістікке -ыл/-іл, -ын/-ін жұрнағы арқылы жасалады: боялды, ашылды. Ағылшынша бір жұрнақ емес, екі бөлік керек: be + V3.',
      'Әрекетті кім жасағанын айту керек болса, by қолданылады: by our coach.'
    ],
    examples: [
      { en: 'The new library was opened last year.', kk: 'Жаңа кітапхана былтыр ашылды.' },
      { en: 'These bags are made by hand.', kk: 'Бұл сөмкелер қолмен жасалған.' }
    ],
    words: [
      W('build — built', 'салу — салынды', '🏗️'),
      W('repair', 'жөндеу', '🔧')
    ],
    warmup: T('Еске түсіріңіз: бос орынға although немесе despite жазыңыз:', ['despite'],
      'Одан кейін зат есім (the cold) — despite.', { sentence: '___ the cold, we went for a walk.' }),
    tasks: [
      C('Бос орынға қай нұсқа келеді?', ['was built', 'built', 'was build'], 0,
        'Көпірді біреу салды, бірақ назар көпірде: was + V3 (built).', { sentence: 'This bridge ___ in 1990.' }),
      T('Жақшадағы етістікті Passive түрінде жазыңыз (екі сөз):', ['is spoken'],
        'English — тіл, оны адамдар сөйлейді: is spoken (is + V3).', { sentence: 'English ___ (speak) in many countries.' }),
      T('Қатені түзетіп, сөйлемді толық жазыңыз:', ['the windows were cleaned yesterday'],
        'windows — көпше, сондықтан were: The windows were cleaned yesterday.', { sentence: 'The windows was cleaned yesterday.' }),
      C('Қай сөйлемде Passive дұрыс қолданылған?', [
        'My phone was stolen on the bus.',
        'I was stolen my phone on the bus.',
        'My phone stole on the bus.'
      ], 0, 'Телефонды біреу ұрлады, назар телефонда: My phone was stolen.')
    ],
    contexts: {
      usa: {
        themeWords: [W('landmark', 'көрікті жер, белгілі орын', '🗽')],
        text: {
          title: 'The Blue Moon Diner',
          lines: [
            'The Blue Moon Diner on Main Street in Ellison Creek was built in 1958.',
            'For many years it was run by the same family.',
            'In 2019 the building was damaged by a storm, and the diner was closed for a year.',
            'The roof was repaired, the old booths were cleaned, and the neon sign was turned on again.',
            'Today the diner is called a local landmark, and its pancakes are still made by hand.'
          ],
          glossary: [{ en: 'was run by', kk: '... басқарды' }, { en: 'booths', kk: 'орындықтары бар бөлек үстелдер' }, { en: 'neon sign', kk: 'неон жарнама' }]
        },
        tasks: [
          C('Дайнер неге бір жыл жабық тұрды?', ['Боран ғимаратты бүлдірді.', 'Отбасы оны сатып жіберді.', 'Жарнама сынып қалды.'], 0,
            'the building was damaged by a storm — ғимаратты боран бүлдірді.'),
          C('«the diner was closed for a year» сөйлемінде дайнерді кім жапқаны айтылған ба?', [
            'Жоқ, айтылмаған — назар дайнердің өзінде.',
            'Иә, отбасы жапқан.',
            'Иә, қала әкімі жапқан.'
          ], 0, 'Passive-те кім жасағаны жиі айтылмайды, назар затқа ауады.')
        ]
      },
      sport: {
        themeWords: [W('belt', 'белбеу', '🥋')],
        text: {
          title: 'A new belt',
          lines: [
            'Every six months, the students in our club are tested by two coaches.',
            'Techniques are checked, and the safety rules are explained again.',
            'Last Saturday, Arman\'s test was watched by his whole family.',
            'He was given a new belt, and a photo was taken for the club website.',
            'After the test, all the mats were cleaned by the students together.'
          ],
          glossary: [{ en: 'safety rules', kk: 'қауіпсіздік ережелері' }, { en: 'website', kk: 'сайт' }]
        },
        tasks: [
          C('Арманға не берілді?', ['жаңа белбеу', 'кубок', 'медаль'], 0, 'He was given a new belt — оған жаңа белбеу берілді.'),
          C('Кілемдерді кім тазалады?', ['оқушылар бірге', 'жаттықтырушылар', 'Арманның отбасы'], 0,
            'the mats were cleaned by the students together — by кімнің істегенін көрсетеді.')
        ]
      },
      nature: {
        themeWords: [W('dough', 'қамыр', '🍞')],
        text: {
          title: 'How our bread is made',
          lines: [
            'In my grandmother\'s village, bread is still made at home.',
            'First, flour, water, salt and yeast are mixed into a dough.',
            'The dough is left in a warm place for two hours.',
            'Then it is shaped into round loaves and baked in a hot oven.',
            'The first loaf is always given to the neighbors.'
          ],
          glossary: [{ en: 'yeast', kk: 'ашытқы' }, { en: 'loaves', kk: 'бөлке нандар' }, { en: 'baked', kk: 'пісірілді' }]
        },
        tasks: [
          C('Қамыр жылы жерде қанша уақыт тұрады?', ['екі сағат', 'бір сағат', 'түні бойы'], 0, 'The dough is left in a warm place for two hours.'),
          C('Бірінші нан кімге беріледі?', ['көршілерге', 'балаларға', 'әжеге'], 0, 'The first loaf is always given to the neighbors.')
        ]
      }
    },
    review: [
      { id: 's3-grammar-2-r1', type: 'type', prompt: 'Жақшадағы етістікті Passive түрінде жазыңыз (екі сөз):', sentence: 'The letters ___ (send) yesterday.',
        answers: ['were sent'], explain: 'letters — көпше, өткен шақ: were sent.' },
      { id: 's3-grammar-2-r2', type: 'choice', prompt: 'Бос орынға қай нұсқа келеді?', sentence: 'Cars ___ in this factory.',
        options: ['are made', 'make', 'are make'], answer: 0, explain: 'Көліктерді зауытта жасайды: are made (are + V3).' }
    ],
    editorNotes: [
      'Сопоставление «-ыл/-іл, -ын/-ін жұрнағы ↔ be + V3» — ОБЯЗАТЕЛЬНО проверить специалистом по казахскому.',
      'Даты в тексте о дайнере вымышленные (Ellison Creek — придуманный город).'
    ]
  });

  // ---------------------------------------------------------------- ОҚУ
  FEA.lessons.push({
    id: 's3-reading-2',
    stage: 3,
    order: 2,
    skill: 'reading',
    defaultContext: 'tech',
    title: 'Автор неге жазды?',
    goal: 'Мәтіннің мақсатын анықтау: хабарлау (inform), сендіру (persuade) немесе ескерту (warn).',
    explain: [
      'Әр мәтіннің мақсаты бар. Хабарлайтын мәтін мәліметтер береді. Сендіретін мәтін бір нәрсені істеуге не сатып алуға итермелейді. Ескертетін мәтін қауіп туралы айтады.',
      'Мақсатты табуға кейбір сөздер көмектеседі: «the best», «Don\'t miss» — көбіне сендіру; «Be careful», «never» — ескерту; уақыт, сан, орын — хабарлау.'
    ],
    examples: [
      { en: 'Be careful: the floor is wet.', kk: 'Абайлаңыз: еден дымқыл. (ескерту)' },
      { en: 'The library opens at 9:00 on weekdays.', kk: 'Кітапхана жұмыс күндері 9:00-де ашылады. (хабарлау)' }
    ],
    words: [
      W('warn', 'ескерту', '⚠️'),
      W('persuade', 'сендіру, көндіру', '🗣️'),
      W('inform', 'хабарлау', 'ℹ️')
    ],
    warmup: C('Еске түсіріңіз: «In my view» нені білдіреді?', ['Менің ойымша', 'Менің көзімше', 'Менің жолымда'], 0,
      'In my view — менің ойымша.'),
    tasks: [
      C('«persuade» сөзі нені білдіреді?', ['сендіру, көндіру', 'ескерту', 'хабарлау'], 0, 'persuade — сендіру.'),
      T('Ағылшынша жазыңыз: ескерту', ['warn'], 'ескерту — warn.'),
      C('Мәтіннің мақсаты қандай?', ['сендіру (сатып алуға шақыру)', 'ескерту', 'хабарлау'], 0,
        '«the tastiest», «20% cheaper», «Don\'t miss it» — оқырманды сатып алуға көндіреді.',
        { text: ['Try our new pizza! It\'s the tastiest in town, and today it\'s 20% cheaper. Don\'t miss it!'] })
    ],
    contexts: {
      tech: {
        themeWords: [W('scam', 'алаяқтық', '🎣')],
        text: {
          title: 'Be careful with "urgent" messages',
          lines: [
            'Many online scams start with an urgent message, for example: "Your account will be closed today!"',
            'The message asks you to click a link and type your password.',
            'Never do this.',
            'Real companies do not ask for your password in a message.',
            'If you are not sure, open the official app yourself or ask an adult you trust.'
          ],
          glossary: [{ en: 'urgent', kk: 'шұғыл' }, { en: 'account', kk: 'аккаунт (есептік жазба)' }, { en: 'official', kk: 'ресми' }]
        },
        tasks: [
          C('Мәтіннің негізгі мақсаты қандай?', ['алаяқтықтан ескерту', 'жаңа телефон сату', 'жаңа қосымшаны таныстыру'], 0,
            '«Never do this» — ескертудің белгісі.'),
          C('Күмәндансаңыз не істеу керек?', ['Ресми қосымшаны өзіңіз ашу немесе сенімді ересектен сұрау', 'Сілтемені басу', 'Құпиясөзді жазу'], 0,
            'open the official app yourself or ask an adult you trust.')
        ]
      },
      usa: {
        themeWords: [W('discount', 'жеңілдік', '💲')],
        text: {
          title: 'Ellison Creek Bike Shop',
          lines: [
            'Spring is here — and so are our best prices!',
            'Get a 25% discount on all kids\' bikes, this weekend only.',
            'Every bike comes with a free helmet and a safety check.',
            'Visit us at 12 Main Street, Ellison Creek. Don\'t miss this deal!'
          ],
          glossary: [{ en: 'deal', kk: 'тиімді ұсыныс' }, { en: 'helmet', kk: 'дулыға' }]
        },
        tasks: [
          C('Мәтіннің мақсаты қандай?', ['сендіру — велосипед сатып алуға шақыру', 'қауіптен ескерту', 'ауа райы туралы хабарлау'], 0,
            '«our best prices», «Don\'t miss this deal» — жарнама, сендіру.'),
          C('Жеңілдік қашан жарамды?', ['тек осы демалыс күндері', 'бүкіл көктем бойы', 'күн сайын'], 0, 'this weekend only.')
        ]
      },
      travel: {
        themeWords: [W('itinerary', 'сапар жоспары', '🧭')],
        text: {
          title: 'Day 2 itinerary',
          sign: true,
          lines: [
            'DAY 2 ITINERARY — CANYON TRIP',
            '07:30 Breakfast at the hotel',
            '08:30 The bus leaves from the hotel entrance',
            '11:00 Walk in the canyon (about 3 km, comfortable shoes needed)',
            '14:00 Lunch at a guesthouse',
            '18:00 Return to the hotel'
          ],
          glossary: [{ en: 'entrance', kk: 'кіреберіс' }, { en: 'return', kk: 'қайту' }]
        },
        tasks: [
          C('Мәтіннің мақсаты қандай?', ['хабарлау — күн жоспарын беру', 'сендіру', 'ескерту'], 0,
            'Уақыт, орын, қашықтық — мәліметтер. Бұл — хабарлайтын мәтін.'),
          C('Автобус сағат нешеде жүреді?', ['08:30', '07:30', '11:00'], 0, '08:30 The bus leaves from the hotel entrance.')
        ]
      },
      mystery: {
        themeWords: [W('hero', 'кейіпкер, батыр', '🦸')],
        text: {
          title: 'A message from Bright Wing',
          lines: [
            'To all the people of Riverstone:',
            'Tonight a strong storm will hit our city.',
            'Please stay at home after 20:00, keep your phones charged and stay away from the river.',
            'I will patrol the bridges all night, but even a hero needs help: please check on your elderly neighbors.',
            '— Bright Wing'
          ],
          glossary: [{ en: 'patrol', kk: 'күзету, аралап шығу' }, { en: 'elderly', kk: 'қарт, егде' }]
        },
        tasks: [
          C('Хабарламаның негізгі мақсаты қандай?', ['ескерту және кеңес беру', 'бір нәрсе сату', 'күн жоспарын беру'], 0,
            'Боран туралы ескертеді және не істеу керегін айтады: stay at home, stay away from the river.'),
          C('Жарқын Қанат тұрғындардан қандай көмек сұрайды?', ['Қарт көршілерін тексеріп тұруды', 'Көпірлерді күзетуді', 'Телефон сатып алуды'], 0,
            'please check on your elderly neighbors — қарт көршілеріңізге қараңыз. Көпірлерді кейіпкердің өзі күзетеді.')
        ]
      }
    },
    review: [
      { id: 's3-reading-2-r1', type: 'choice', prompt: 'Мәтіннің мақсаты қандай?', text: ['Warning: thin ice. Do not walk on the lake.'],
        options: ['ескерту', 'сендіру', 'хабарлау'], answer: 0, explain: '«Warning», «Do not» — қауіп туралы ескерту.' },
      { id: 's3-reading-2-r2', type: 'type', prompt: 'Ағылшынша жазыңыз: хабарлау', answers: ['inform'], explain: 'хабарлау — inform.' }
    ],
    editorNotes: [
      'Советы по безопасности в сети («не вводить пароль по ссылке из сообщения, открыть официальное приложение, спросить взрослого») — общие; при желании сверить с официальными памятками.',
      'Цены и адрес магазина вымышленные.'
    ]
  });
})();
