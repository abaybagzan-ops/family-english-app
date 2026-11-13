/*
 * Ступень 1, второй урок по каждому навыку (ориентир A1, предварительно).
 * Все тексты оригинальные и вымышленные.
 */
(function () {
  var C = FEA.choice, T = FEA.typed, O = FEA.order, M = FEA.match, W = FEA.word;

  // ---------------------------------------------------------------- СӨЗДЕР
  FEA.lessons.push({
    id: 's1-words-2',
    stage: 1,
    order: 2,
    skill: 'words',
    defaultContext: 'travel',
    title: 'Ауа райы',
    goal: 'Ауа райын сипаттайтын сөздерді тану, еске түсіру және киім мен жоспар таңдағанда қолдану.',
    explain: [
      'Ауа райы туралы көбіне It is ... деп айтамыз. Қазақша «Бүгін суық» деп айта береміз, ал ағылшынша сөйлемге It is керек.',
      'rain — жаңбыр. Бұл зат есім, сондықтан «It is rain» деп айтпаймыз.'
    ],
    examples: [
      { en: 'It is cold today.', kk: 'Бүгін суық.' },
      { en: 'I like rain.', kk: 'Мен жаңбырды ұнатамын.' }
    ],
    words: [
      W('cold', 'суық', '🥶', 'коулд'),
      W('hot', 'ыстық', '🥵', 'хот'),
      W('rain', 'жаңбыр', '🌧️', 'рэйн')
    ],
    warmup: C('Еске түсіріңіз: «tomorrow» сөзі нені білдіреді?', ['ертең', 'бүгін', 'кеше'], 0,
      'tomorrow — ертең, today — бүгін.'),
    tasks: [
      M('Сөздерді мағынасымен сәйкестендіріңіз.'),
      C('Термометр +35°C көрсетіп тұр. Қалай айтамыз?', ['It is hot.', 'It is cold.', 'It is rain.'], 0,
        '+35°C — ыстық: It is hot. «It is rain» — қате тіркес.'),
      T('Бос орынды толтырыңыз (суық):', ['cold'],
        'cold — суық. Put on your hat — бас киіміңді ки.', { sentence: 'Put on your hat. It is ___ outside.' })
    ],
    contexts: {
      travel: {
        themeWords: [W('umbrella', 'қолшатыр', '☂️', 'амбрэлла'), W('jacket', 'күрте', '🧥', 'джэкит')],
        text: {
          title: 'Packing for the trip',
          lines: [
            'Our family trip is in April.',
            'In April it can be hot or cold.',
            'Mom says: "Take a jacket and an umbrella. Rain is possible."',
            'Dad packs the jackets. I pack the umbrella.'
          ],
          glossary: [{ en: 'can be', kk: 'болуы мүмкін' }, { en: 'possible', kk: 'мүмкін' }, { en: 'packs', kk: 'салады (жинайды)' }]
        },
        tasks: [
          C('Анасы не алуды айтады?', ['күрте мен қолшатыр', 'күн көзілдірігі', 'етік'], 0, 'Take a jacket and an umbrella.'),
          C('Қолшатырды кім салады?', ['мәтіннің авторы («I»)', 'әкесі', 'анасы'], 0, 'I pack the umbrella — қолшатырды мен саламын.')
        ]
      },
      nature: {
        themeWords: [W('snow', 'қар', '❄️', 'сноу'), W('winter', 'қыс', '🌨️', 'уинтэр')],
        text: {
          title: 'Barsik and the snow',
          lines: [
            'It is winter. It is very cold.',
            'There is snow in the garden.',
            'Our cat Barsik does not like the snow.',
            'He sits near the hot radiator all day.'
          ],
          glossary: [{ en: 'does not like', kk: 'ұнатпайды' }, { en: 'radiator', kk: 'жылыту батареясы' }]
        },
        tasks: [
          C('Барсик неге күні бойы үйде отырады?', ['Ол қарды ұнатпайды.', 'Ол ауырып қалды.', 'Ол ұйықтағысы келеді.'], 0,
            'Barsik does not like the snow — Барсик қарды ұнатпайды.'),
          C('Барсик қай жерде отырады?', ['ыстық батареяның қасында', 'бақшада', 'терезенің алдында'], 0,
            'He sits near the hot radiator — ыстық батареяның қасында отырады.')
        ]
      },
      sport: {
        themeWords: [W('outside', 'далада, сыртта', '🌳', 'аутсайд')],
        text: {
          title: 'Training in summer',
          lines: [
            'In summer it is very hot.',
            'Coach Marat says: "We train outside in the morning, not at noon."',
            '"Drink water every 15 minutes."',
            '"In rain, we train in the gym."'
          ],
          glossary: [{ en: 'noon', kk: 'түс мезгілі (12:00)' }, { en: 'every 15 minutes', kk: 'әр 15 минут сайын' }]
        },
        tasks: [
          C('Жазда далада қашан жаттығады?', ['таңертең', 'түсте', 'түнде'], 0, 'in the morning, not at noon — таңертең, түсте емес.'),
          C('Жаңбыр жауса, қайда жаттығады?', ['спорт залда', 'далада', 'үйде'], 0, 'In rain, we train in the gym.')
        ]
      }
    },
    review: [
      { id: 's1-words-2-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: ыстық', answers: ['hot'], explain: 'ыстық — hot.' },
      { id: 's1-words-2-r2', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'It is -20°C. It is very ___.', options: ['cold', 'hot', 'rain'], answer: 0,
        explain: '-20°C — өте суық: very cold.' }
    ],
    editorNotes: [
      '«Бүгін суық ↔ It is cold» — сопоставление проверить специалистом.',
      'Совет «не тренироваться в полдень в жару, пить воду» — общий; проверить формулировку тренером.'
    ]
  });

  // ---------------------------------------------------------------- ГРАММАТИКА
  FEA.lessons.push({
    id: 's1-grammar-2',
    stage: 1,
    order: 2,
    skill: 'grammar',
    defaultContext: 'usa',
    title: 'There is / There are',
    goal: 'Бір жерде бір немесе бірнеше зат бар екенін айту: There is ... / There are ...',
    explain: [
      'Қазақша «Бөлмеде үстел бар» дегенде «бар» сөзі соңында тұрады. Ағылшынша мұндай сөйлем There is немесе There are деп басталады.',
      'Бір зат болса — There is: There is a bed in the room.',
      'Бірнеше зат болса — There are: There are two windows.'
    ],
    examples: [
      { en: 'There is a park near my house.', kk: 'Үйімнің жанында саябақ бар.' },
      { en: 'There are three chairs in the kitchen.', kk: 'Ас үйде үш орындық бар.' }
    ],
    words: [
      W('near', 'жанында', '📍', 'ниэр'),
      W('window', 'терезе', '🪟', 'уиндоу')
    ],
    warmup: T('Еске түсіріңіз: жақшадағы етістікті дұрыс жазыңыз:', ['works'],
      'She → works (-s қосылады).', { sentence: 'She ___ (work) in a shop.' }),
    tasks: [
      C('Бос орынға қай нұсқа келеді?', ['There is', 'There are', 'It are'], 0,
        'a bank — бір банк, сондықтан There is.', { sentence: '___ a bank near the station.' }),
      C('Бос орынға қай сөз келеді?', ['are', 'is', 'be'], 0,
        'four apples — төрт алма, бірнеше зат, сондықтан are.', { sentence: 'There ___ four apples on the table.' }),
      O('Сөздерді дұрыс ретпен қойыңыз.', ['are', 'There', 'beds', 'two', 'here'], 'There are two beds here',
        'Алдымен There are, содан кейін заттар: There are two beds here — Мұнда екі төсек бар.'),
      T('Қатені түзетіп, сөйлемді толық жазыңыз:', ['there are three cats in the garden'],
        'three cats — бірнеше зат, сондықтан There are.', { sentence: 'There is three cats in the garden.' })
    ],
    contexts: {
      usa: {
        themeWords: [W('subway', 'метро', '🚇', 'сабуэй')],
        text: {
          title: 'Our hotel in Chicago',
          lines: [
            'Our hotel is on a busy street.',
            'There is a subway station near the hotel.',
            'There are two cafés and a small shop on the corner.',
            'There is no parking, so we take the subway.'
          ],
          glossary: [{ en: 'busy', kk: 'қарбалас, адам көп' }, { en: 'corner', kk: 'бұрыш (көше бұрышы)' }, { en: 'no parking', kk: 'көлік қоятын орын жоқ' }]
        },
        tasks: [
          C('Қонақүйдің жанында не бар?', ['метро бекеті', 'саябақ', 'мектеп'], 0, 'There is a subway station near the hotel.'),
          C('Олар неге метромен жүреді?', ['Көлік қоятын орын жоқ.', 'Метро тегін.', 'Такси жоқ.'], 0,
            'There is no parking, so we take the subway — so «сондықтан» деген мағынада.')
        ]
      },
      mystery: {
        themeWords: [W('stairs', 'баспалдақ', '🪜', 'стэаз')],
        text: {
          title: 'Seven doors',
          lines: [
            'In the old house there is a long hall.',
            'At the end of the hall there are stairs.',
            'There are seven doors, but there are only six keys.',
            'Which door has no key?'
          ],
          glossary: [{ en: 'hall', kk: 'дәліз' }, { en: 'at the end of', kk: '... соңында' }]
        },
        tasks: [
          C('Үйде неше есік бар?', ['жеті', 'алты', 'бір'], 0, 'There are seven doors — жеті есік бар.'),
          C('Жұмбақ неде?', ['Есік — жетеу, ал кілт — алтау.', 'Баспалдақ жоқ.', 'Дәліз қысқа.'], 0,
            'seven doors, but only six keys — бір есіктің кілті жоқ.')
        ]
      },
      tech: {
        themeWords: [W('screen', 'экран', '🖥️', 'скрин')],
        text: {
          title: 'My desk',
          lines: [
            'There is a computer on my desk.',
            'There are two screens, a keyboard and a mouse.',
            'There is a sticky note on the screen with my password.',
            'Mom says: "That is not safe. Remove it!"'
          ],
          glossary: [{ en: 'sticky note', kk: 'жабысқақ қағаз' }, { en: 'remove', kk: 'алып таста' }]
        },
        tasks: [
          C('Үстелде неше экран бар?', ['екі', 'бір', 'үш'], 0, 'There are two screens — екі экран бар.'),
          C('Анасы неге «бұл қауіпсіз емес» дейді?', ['Құпиясөз экранға жабыстырылған қағазда жазулы.', 'Компьютер ескі.', 'Тышқан жоқ.'], 0,
            'a sticky note with my password — құпиясөзді көрінетін жерге жазу қауіпті.')
        ]
      }
    },
    review: [
      { id: 's1-grammar-2-r1', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'There ___ a lot of people at the bus stop.', options: ['are', 'is', 'am'], answer: 0,
        explain: 'people — адамдар (көпше), сондықтан are.' },
      { id: 's1-grammar-2-r2', type: 'type', prompt: 'Бос орынды толтырыңыз:', sentence: 'There ___ a cat under the table.', answers: ['is'],
        explain: 'a cat — бір мысық, сондықтан is.' }
    ],
    editorNotes: [
      'Сопоставление «...бар (соңында) ↔ There is/are (басында)» — проверить специалистом по казахскому.',
      '«There is a lot of people» иногда встречается в разговоре; в задании принят только стандартный вариант «are».'
    ]
  });

  // ---------------------------------------------------------------- ОҚУ
  FEA.lessons.push({
    id: 's1-reading-2',
    stage: 1,
    order: 2,
    skill: 'reading',
    defaultContext: 'tech',
    title: 'Нұсқаулықты оқу',
    goal: 'Қысқа нұсқаулықтан қадамдардың ретін және не істеуге болмайтынын табу.',
    explain: [
      'Нұсқаулықта етістік сөйлемнің басында тұрады: Open the box. Бұл — бұйрық немесе кеңес.',
      'Don\'t ... — тыйым: Don\'t shout! — Айқайлама!',
      'Қадамдардың ретін first (алдымен) және then (содан кейін) сөздері көрсетеді.'
    ],
    examples: [
      { en: 'First, wash your hands. Then eat.', kk: 'Алдымен қолыңды жу. Содан кейін же.' },
      { en: 'Don\'t touch!', kk: 'Ұстама!' }
    ],
    words: [
      W('first', 'алдымен', '1️⃣', 'фёрст'),
      W('then', 'содан кейін', '➡️', 'зэн'),
      W('don\'t', '...ма/-ме (жасама)', '🚫', 'доунт')
    ],
    warmup: C('Еске түсіріңіз: «late» сөзі нені білдіреді?', ['кеш, кешігіп', 'ерте', 'бүгін'], 0,
      'late — кеш. I\'m late — кешігіп жатырмын.'),
    tasks: [
      C('«Don\'t open the door!» нені білдіреді?', ['Есікті ашпа!', 'Есікті аш!', 'Есік ашық.'], 0,
        'Don\'t + етістік — тыйым: ашпа.'),
      T('Ағылшынша жазыңыз: алдымен', ['first'], 'алдымен — first.'),
      C('Ең бірінші не істеу керек?', ['аяқкиімді кию', 'есікті ашу', 'кілтті алу'], 0,
        'First, put on your shoes — алдымен аяқкиімді ки.',
        { text: ['First, put on your shoes.', 'Then open the door.', 'Don\'t forget your keys!'], glossary: [{ en: 'forget', kk: 'ұмыту' }] })
    ],
    contexts: {
      tech: {
        themeWords: [W('password', 'құпиясөз', '🔐', 'пасуөрд')],
        text: {
          title: 'Make a strong password',
          lines: [
            'First, use at least 12 characters.',
            'Then mix words, numbers and symbols, for example: Blue-Horse-27!',
            'Don\'t use your name or your birthday.',
            'Don\'t share your password with friends.'
          ],
          glossary: [{ en: 'at least', kk: 'кем дегенде' }, { en: 'characters', kk: 'таңбалар' }, { en: 'share', kk: 'бөлісу' }]
        },
        tasks: [
          C('Құпиясөзде кем дегенде неше таңба болуы керек?', ['12', '7', '27'], 0, 'use at least 12 characters — кем дегенде 12 таңба.'),
          C('Мәтін бойынша не істеуге болмайды?', ['Құпиясөзге өз атыңызды қолдану', 'Сандарды қосу', 'Ұзын құпиясөз жасау'], 0,
            'Don\'t use your name or your birthday — атыңызды не туған күніңізді қолданбаңыз.')
        ]
      },
      sport: {
        themeWords: [W('stretch', 'созылу', '🤸', 'стрэч')],
        text: {
          title: 'Warm-up before training',
          lines: [
            'First, walk or jog slowly for five minutes.',
            'Then move your arms and legs in big circles.',
            'Then stretch gently. Don\'t stretch until it hurts.',
            'If something hurts, stop and tell your coach.'
          ],
          glossary: [{ en: 'jog', kk: 'баяу жүгіру' }, { en: 'gently', kk: 'ақырын, абайлап' }, { en: 'hurts', kk: 'ауырады' }]
        },
        tasks: [
          C('Қыздыру неден басталады?', ['5 минут баяу жүру немесе жүгіру', 'созылу', 'қолды айналдыру'], 0,
            'First, walk or jog slowly for five minutes.'),
          C('Бір жеріңіз ауырса не істеу керек?', ['Тоқтап, жаттықтырушыға айту', 'Жаттығуды жалғастыру', 'Қаттырақ созылу'], 0,
            'If something hurts, stop and tell your coach.')
        ]
      },
      nature: {
        themeWords: [W('seed', 'тұқым', '🌱', 'сид')],
        text: {
          title: 'Plant a sunflower',
          lines: [
            'First, fill a small pot with soil.',
            'Then put two seeds in the soil.',
            'Water the pot every two days.',
            'Don\'t put it in a dark room. Sunflowers need sun.'
          ],
          glossary: [{ en: 'pot', kk: 'гүл құмырасы' }, { en: 'soil', kk: 'топырақ' }, { en: 'sunflower', kk: 'күнбағыс' }]
        },
        tasks: [
          C('Құмыраға неше тұқым салу керек?', ['екі', 'бір', 'үш'], 0, 'put two seeds — екі тұқым салыңыз.'),
          C('Құмыраны неге қараңғы бөлмеге қоюға болмайды?', ['Күнбағысқа күн керек.', 'Тұқым кішкентай.', 'Топырақ құрғақ.'], 0,
            'Sunflowers need sun — күнбағысқа күн керек.')
        ]
      }
    },
    review: [
      { id: 's1-reading-2-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: содан кейін', answers: ['then'], explain: 'содан кейін — then.' },
      { id: 's1-reading-2-r2', type: 'choice', prompt: '«Don\'t run!» нені білдіреді?', options: ['Жүгірме!', 'Жүгір!', 'Жүгіріп жүр.'], answer: 0,
        explain: 'Don\'t + етістік — тыйым: Жүгірме!' }
    ],
    editorNotes: [
      'Советы по паролю (длина ≥12, не использовать имя/дату рождения, не делиться) — общие рекомендации; при желании сверить с актуальными официальными памятками.',
      'Советы по разминке («не тянуться до боли, сказать тренеру») — проверить тренером.'
    ]
  });
})();
