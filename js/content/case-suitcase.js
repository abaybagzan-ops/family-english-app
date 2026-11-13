/*
 * Демонстрационное дело «Чемодан қайда?» — одна история, четыре версии.
 * Сюжет, цель и развязка общие; версии отличаются длиной и сложностью улик,
 * количеством опор и типом ответа. Версии — внутренние ступени приложения,
 * а не официальные уровни CEFR.
 *
 * Язык двигает сюжет: следующая сцена открывается только после понятой улики.
 * Ошибка не обрывает дело — она открывает дополнительную улику и подсказку.
 * Все персонажи, места и события вымышлены.
 *
 * Структура версии:
 *   explainer — «сначала загадка, потом правило»: puzzle → rule → example/parts → alt («Түсінбедім») → task
 *   scenes[]  — { icon, title, place, clue {label, lines, glossary, sign}, task, hints[3], unlock }
 *   finale    — { lines (en), kk }
 */
window.FEA = window.FEA || {};

FEA.cases = FEA.cases || [];

FEA.cases.push({
  id: 'suitcase',
  title: 'Чемодан қайда?',
  caseNo: '№ 7',
  intro: 'Отбасы демалыстан ұшақпен оралды. Багаж лентасында барлық сөмке шықты, тек қызыл чемодан жоқ. Сіз — бюро тергеушісісіз. Белгілер, куәгерлердің сөзі мен жазбалар ағылшынша, сондықтан әр ізді түсінбей, келесі қадамға өте алмайсыз.',
  goal: 'Жоғалған затты ағылшынша сипаттау және ағылшынша іздерден оқиғаның ретін түсіну.',
  discussion: [
    'Қаласаңыз, үйде талқылаңыз (міндетті емес):',
    'Қай із сізге ең көп көмектесті?',
    'Өз сөмкеңізді басқалардан қалай ерекшелер едіңіз? Ағылшынша бір сөйлеммен айтып көріңіз.'
  ],
  transfer: [
    { theme: 'Саяхат', icon: '✈️', action: 'Қонақүйде жоғалған кілтті әкімшіге сипаттау',
      examples: ['a small silver key', 'The key has a blue tag.', 'I was paying at the desk when I lost my key.', 'My key was left in room 12 by mistake.'] },
    { theme: 'Спорт', icon: '🥋', action: 'Жаттығудан кейін ауыстырылып кеткен қолғапты табу',
      examples: ['black gloves', 'My gloves have a white stripe.', 'I was talking to the coach when someone took my gloves.', 'My gloves were taken by mistake after training.'] },
    { theme: 'Технология', icon: '💻', action: 'Жоғалған телефонды сипаттап, қауіпсіз әрекет жасау',
      examples: ['a black phone', 'It has a green case.', 'I was reading on the bus when I left my phone.', 'The phone was locked, so the data was safe.'] },
    { theme: 'Табиғат және тағам', icon: '🐾', action: 'Жоғалған мысықты көршілерге сипаттау',
      examples: ['a small grey cat', 'It has a white tail.', 'She was sleeping on the balcony when the door opened.', 'The cat was found by a neighbor in the garden.'] }
  ],
  versions: [
    // ======================================================= Нұсқа 0
    {
      stage: 0,
      label: 'Ең жеңіл нұсқа',
      supports: 'Әр ізде аудармасы бар сөздік, суретті карточкалар, жауапты таңдау.',
      canDo: 'Затты түсі мен белгісі арқылы ағылшынша сипаттай аламын: a red suitcase.',
      explainer: {
        puzzle: {
          intro: 'Тергеушінің дәптерінде үш жазба бар. Бір заңдылықты табыңыз:',
          examples: [
            { en: 'a red bag', kk: 'қызыл сөмке' },
            { en: 'a big box', kk: 'үлкен қорап' },
            { en: 'a yellow ribbon', kk: 'сары таспа' }
          ],
          question: 'Түсті немесе өлшемді білдіретін сөз қай жерде тұр?',
          options: ['Заттың алдында: red bag', 'Заттың артында: bag red', 'Кез келген жерде'],
          answer: 0,
          after: 'Иә, бұл заңдылық ағылшын тілінде тұрақты. Енді оны нақты ереже ретінде көрейік.'
        },
        rule: [
          'Заттың түсін немесе өлшемін білдіретін сөз заттың алдында тұрады: a red suitcase.',
          'Қазақшада да тәртіп осындай: қызыл чемодан. Ағылшынша алдына a қосылады (бір зат).'
        ],
        example: { en: 'a red suitcase', kk: 'қызыл чемодан' },
        parts: [
          { en: 'a', kk: 'бір (бір зат туралы)' },
          { en: 'red', kk: 'қызыл — қандай?' },
          { en: 'suitcase', kk: 'чемодан — не?' }
        ],
        alt: {
          simple: 'Алдымен «қандай?», содан кейін «не?»: red (қандай?) suitcase (не?).',
          scheme: { type: 'slots', rows: [[{ t: 'a', c: 'бір' }, { t: 'red', c: 'қандай?' }, { t: 'suitcase', c: 'не?' }]] },
          compare: { kk: 'қызыл чемодан', en: 'a red suitcase', note: 'Тәртіп бірдей: «қандай?» алдында, «не?» артында. Ағылшынша тек a қосылады.' },
          limits: 'Бұл тәртіп «қызыл чемодан» сияқты тіркеске қатысты. Толық сөйлемде түс соңында тұруы мүмкін: The suitcase is red — Чемодан қызыл.',
          example: { en: 'a green bag', kk: 'жасыл сөмке' },
          check: { type: 'choice', prompt: '«Сары таспа» ағылшынша қалай?', options: ['a yellow ribbon', 'a ribbon yellow', 'yellow a ribbon'], answer: 0,
            hints: ['«Қандай?» сөзі қай жерде тұрады?', 'yellow — қандай? ribbon — не? Алдымен қайсысы?', 'a + yellow + ...'],
            explain: 'a yellow ribbon: алдымен a, содан кейін түс, соңында зат.' }
        },
        task: { type: 'choice', prompt: 'Тергеуші жазбасын тексеріңіз: «жасыл қорап» қалай жазылады?', options: ['a green box', 'a box green', 'box a green'], answer: 0,
          hints: ['Түс сөзі заттың алдында ма, артында ма?', 'green — қандай? box — не?', 'a + green + ...'],
          explain: 'a green box: түс заттың алдында.' }
      },
      scenes: [
        {
          icon: '🧳', title: 'Багаж лентасы', place: '3-лента',
          clue: { label: 'Із 1 · Лентада қалған заттар', sign: true,
            lines: ['A: a blue suitcase', 'B: a black suitcase', 'C: a big green bag'],
            glossary: [{ en: 'blue', kk: 'көк' }, { en: 'black', kk: 'қара' }, { en: 'green', kk: 'жасыл' }] },
          task: { type: 'choice', prompt: 'Біздің чемодан — қызыл (red). Лентада қызыл чемодан бар ма?',
            options: ['Жоқ, қызыл чемодан жоқ.', 'Иә, A — қызыл.', 'Иә, C — қызыл.'], answer: 0,
            explain: 'blue — көк, black — қара, green — жасыл. red сөзі ешбір жолда жоқ.' },
          hints: ['Қосымша із: red — қызыл. Үш жолдың әрқайсысындағы түс сөзін оқыңыз.', 'Түс сөздері: blue, black, green. Олардың ішінде red бар ма?', 'Үш түстің ешқайсысы red емес.'],
          unlock: 'Чемодан лентада жоқ. Оны біреу алып кеткен болуы мүмкін! Бюро қызметкеріне хабарлау керек.'
        },
        {
          icon: '🗂️', title: 'Бюро үстелі', place: 'Lost and Found',
          clue: { label: 'Із 2 · Қызметкердің сұрағы', lines: ['Officer: Hello! What color is your suitcase?'],
            glossary: [{ en: 'what color', kk: 'қандай түсті' }] },
          task: { type: 'order', prompt: 'Қызметкерге чемоданды сипаттаңыз: сөздерді дұрыс ретпен қойыңыз.', words: ['red', 'suitcase', 'a'], answer: 'a red suitcase',
            explain: 'a red suitcase — алдымен a, содан кейін түс, соңында зат.' },
          hints: ['Қосымша із: қызметкер түсін сұрап тұр. Біздің чемодан — қызыл.', 'Алдымен a, содан кейін «қандай?», соңында «не?».', 'a ... suitcase'],
          unlock: 'Қызметкер компьютерге жазды: «a red suitcase». Енді жоғалған заттар тізімін тексереді.'
        },
        {
          icon: '📋', title: 'Жоғалған заттар тізімі', place: 'Lost and Found',
          clue: { label: 'Із 3 · Бүгінгі тізім', sign: true,
            lines: ['LOST AND FOUND', '1. a black bag — tag 3310', '2. a red suitcase — tag 4721', '3. a blue suitcase — tag 5084'],
            glossary: [{ en: 'tag', kk: 'тег (нөмір жазылған белгі)' }] },
          task: { type: 'choice', prompt: 'Біздің тегтің нөмірі — 4721. Тізімде ол қай жолда?', options: ['2', '1', '3'], answer: 0,
            explain: '2-жол: a red suitcase — tag 4721. Түсі де, нөмірі де сәйкес.' },
          hints: ['Қосымша із: тегте жазылған сан — 4721.', 'Тізімнен 4721 санын іздеңіз.', '4721 саны red suitcase жолында тұр.'],
          unlock: 'Чемодан табылды! Бірақ қызметкер: «Мұнда екі қызыл чемодан бар» дейді.'
        },
        {
          icon: '🔎', title: 'Соңғы дәлел', place: 'Lost and Found',
          clue: { label: 'Із 4 · Қызметкердің сұрағы',
            lines: ['Officer: There are two red suitcases here.', 'Officer: What is on your handle?'],
            glossary: [{ en: 'handle', kk: 'тұтқа' }, { en: 'there are two', kk: 'екеу бар' }] },
          task: { type: 'choice', prompt: 'Біздің чемоданның тұтқасында сары таспа бар. Не дейсіз?', options: ['a yellow ribbon', 'a blue ribbon', 'a green bag'], answer: 0,
            explain: 'yellow — сары, ribbon — таспа: a yellow ribbon.' },
          hints: ['Қосымша із: таспаның түсі — сары.', 'yellow — сары. ribbon — таспа.', 'a yellow ...'],
          unlock: 'Қызметкер сары таспасы бар чемоданды әкелді.'
        }
      ],
      finale: {
        lines: ['Officer: Here you are. A red suitcase with a yellow ribbon.', 'You: Thank you!'],
        kk: 'Екі қызыл чемодан бір-біріне ұқсас болған. Басқа жолаушы қателесіп біздің чемоданды алған, кейін бюроға әкелген. Сары таспа мен 4721 нөмірі шындықты көрсетті.'
      }
    },

    // ======================================================= Нұсқа 1
    {
      stage: 1,
      label: 'Бастауыш нұсқа',
      supports: 'Қысқа сөйлемдер, ішінара сөздік, сөз құрастыру және бір сөз жазу.',
      canDo: 'Затты «It is… / It has…» арқылы сипаттап, тізімнен керегін таба аламын.',
      explainer: {
        puzzle: {
          intro: 'Бюроның жазбаларында үш сөйлем бар. Аудармасымен салыстырып, заңдылықты табыңыз:',
          examples: [
            { en: 'My suitcase has a yellow ribbon.', kk: 'Менің чемоданымда сары таспа бар.' },
            { en: 'The bag has two pockets.', kk: 'Сөмкенің екі қалтасы бар.' },
            { en: 'Aru has a red phone.', kk: 'Аруда қызыл телефон бар.' }
          ],
          question: 'Қазақшадағы «…да бар / …ның бар» ағылшынша қалай берілген?',
          options: ['has сөзімен: иесі басында, has одан кейін', 'there сөзімен: сөйлемнің соңында', 'is сөзімен: заттан кейін'],
          answer: 0,
          after: 'Дұрыс бағыт. Енді ережені нақты көрейік.'
        },
        rule: [
          'Бір адамның немесе заттың бір нәрсесі бар екенін айтқанда, has қолданылады: It has a ribbon.',
          'Иесі (it, my suitcase, Aru) сөйлемнің басында тұрады, has одан кейін бірден келеді. I, you, we, they үшін — have.'
        ],
        example: { en: 'It has a yellow ribbon.', kk: 'Онда сары таспа бар.' },
        parts: [
          { en: 'It', kk: 'ол — чемодан (иесі)' },
          { en: 'has', kk: 'бар (иелікте)' },
          { en: 'a yellow ribbon', kk: 'сары таспа — не бар' }
        ],
        alt: {
          simple: 'has сөзін «…да бар» деп ойлаңыз: It has a ribbon = Онда таспа бар. Тек ағылшынша «бар» соңында емес, иесінен кейін тұрады.',
          scheme: { type: 'slots', rows: [[{ t: 'It', c: 'иесі' }, { t: 'has', c: 'бар' }, { t: 'a ribbon', c: 'не бар?' }]] },
          compare: { kk: 'Чемоданда таспа бар.', en: 'The suitcase has a ribbon.', note: 'Қазақшада «бар» соңында, ал ағылшынша has иесінен кейін бірден келеді.' },
          limits: 'Бұл салыстыру иелік туралы ғана. Бір жерде бір нәрсе бар деу үшін басқа құрылым керек: There is a bag on the belt — Лентада сөмке бар.',
          example: { en: 'My brother has a blue bag.', kk: 'Бауырымның көк сөмкесі бар.' },
          check: { type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'The suitcase ___ two wheels.', options: ['has', 'have', 'is'], answer: 0,
            hints: ['Сөйлемде иесі кім?', 'The suitcase — бір зат (it). It үшін has пе, have пе?', 'h _ s'],
            explain: 'The suitcase = it, сондықтан has: The suitcase has two wheels.' }
        },
        task: { type: 'choice', prompt: 'Тергеуші жазбасын толықтырыңыз:', sentence: 'My sister ___ a green backpack.', options: ['has', 'have', 'is'], answer: 0,
          hints: ['Иесі — my sister. Ол бір адам ба, бірнеше ме?', 'Бір адам (she) үшін has.', 'h _ s'],
          explain: 'My sister = she, сондықтан has.' }
      },
      scenes: [
        {
          icon: '🧳', title: 'Багаж лентасы', place: '3-лента',
          clue: { label: 'Із 1 · Лентаның қасындағы жазба',
            lines: ['There is a black bag on belt 3.', 'There is a big blue suitcase.', 'There is no red suitcase.'],
            glossary: [{ en: 'belt', kk: 'лента' }, { en: 'there is no', kk: '... жоқ' }] },
          task: { type: 'choice', prompt: 'Лентада қызыл чемодан бар ма?', options: ['Жоқ, лентада қызыл чемодан жоқ.', 'Иә, бар.', 'Мәтінде айтылмаған.'], answer: 0,
            explain: 'There is no red suitcase — қызыл чемодан жоқ.' },
          hints: ['Қосымша із: соңғы сөйлемге назар аударыңыз.', 'There is no … — «… жоқ» деген мағына.', 'There is no red suitcase.'],
          unlock: 'Чемодан лентада жоқ. Бюро қызметкері сипаттама сұрайды.'
        },
        {
          icon: '🗂️', title: 'Бюро үстелі', place: 'Lost and Found',
          clue: { label: 'Із 2 · Диалог',
            lines: ['Officer: Can you describe your suitcase?', 'You: It is red.', 'Officer: Is there anything special on it?'],
            glossary: [{ en: 'describe', kk: 'сипаттау' }, { en: 'special', kk: 'ерекше' }] },
          task: { type: 'order', prompt: 'Ерекше белгіні айтыңыз: сөздерді ретімен қойыңыз.', words: ['has', 'It', 'yellow', 'a', 'ribbon'], answer: 'It has a yellow ribbon',
            explain: 'It has a yellow ribbon — Онда сары таспа бар.' },
          hints: ['Қосымша із: тұтқада сары таспа (a yellow ribbon) бар.', 'Сөйлем It-тен басталады, содан кейін has.', 'It has a ... ribbon'],
          unlock: 'Қызметкер: «Тамаша, бұл маңызды белгі» деп, тізімді ашты.'
        },
        {
          icon: '📋', title: 'Жоғалған заттар тізімі', place: 'Lost and Found',
          clue: { label: 'Із 3 · Бүгінгі тізім', sign: true,
            lines: ['LOST AND FOUND — TODAY', '1. A black bag. It has a red tag.', '2. A red suitcase. It has a yellow ribbon.', '3. A red suitcase. It has a green ribbon.'],
            glossary: [{ en: 'tag', kk: 'тег, белгі' }] },
          task: { type: 'choice', prompt: 'Біздің чемодан қай нөмірде?', options: ['2', '3', '1'], answer: 0,
            explain: '2: red suitcase + yellow ribbon. 3-те таспа жасыл.' },
          hints: ['Қосымша із: тізімде ЕКІ қызыл чемодан бар! Айырмашылығы — таспаның түсі.', 'Біздікінде yellow (сары) таспа.', 'Red suitcase + yellow ribbon — қай жол?'],
          unlock: 'Демек біздің чемодан табылды, ал бюрода тағы бір қызыл чемодан тұр. Біреу шатастырып алған сияқты.'
        },
        {
          icon: '🔎', title: 'Соңғы дәлел', place: 'Lost and Found',
          clue: { label: 'Із 4 · Тег', sign: true, lines: ['TAG 4721'], glossary: [] },
          task: { type: 'type', prompt: 'Қызметкерге тегті айтыңыз. Бос орынды толтырыңыз:', sentence: 'The suitcase ___ a tag. The number is 4721.', answers: ['has'],
            explain: 'The suitcase = it, сондықтан has: The suitcase has a tag.' },
          hints: ['Қосымша із: чемоданда тег бар — «онда тег бар».', 'The suitcase — бір зат (it). Оған has керек пе, have пе?', 'h _ s'],
          unlock: 'Тегтің нөмірі сәйкес келді!'
        }
      ],
      finale: {
        lines: ['Officer: Number 4721 — here it is!', 'Officer: A man took it by mistake. His suitcase is red too, but it has a green ribbon.'],
        kk: 'Басқа жолаушының чемоданы да қызыл екен, тек таспасы жасыл. Ол асығыста қателесіп біздікін алған. Сары таспа мен тег нөмірі істі шешті.'
      }
    },

    // ======================================================= Нұсқа 2
    {
      stage: 2,
      label: 'Негізгі нұсқа',
      supports: 'Камера жазбасы мен куәгердің сөзі, аз сөздік, жауапты өзіңіз жазасыз.',
      canDo: 'Оқиғада не болып жатқанын және кенет не болғанын ағылшынша түсіне аламын.',
      explainer: {
        puzzle: {
          intro: 'Куәгерлердің үш сөйлемін салыстырыңыз:',
          examples: [
            { en: 'Dad was buying water when the bags arrived.', kk: 'Сөмкелер келген кезде, әке су сатып алып жатқан.' },
            { en: 'Aru was talking on the phone when she saw the man.', kk: 'Ару телефонмен сөйлесіп тұрғанда, ер адамды көрді.' },
            { en: 'We were waiting at belt 3 when the light flashed.', kk: 'Біз 3-лентада күтіп тұрғанда, шам жыпылықтады.' }
          ],
          question: 'was/were + -ing бөлігі нені білдіреді?',
          options: ['Сол сәтте созылып жатқан әрекетті (фон)', 'Кенет болған қысқа оқиғаны', 'Келешектегі жоспарды'],
          answer: 0,
          after: 'Солай. Енді екі бөлікті нақты ереже ретінде көрейік.'
        },
        rule: [
          'Бір әрекет созылып жатқан кезде — was / were + -ing (фон).',
          'Оның ортасында кенет болған қысқа оқиға — Past Simple. when сөзі екеуін байланыстырады.'
        ],
        example: { en: 'A man was standing near belt 3 when he took the red suitcase.', kk: 'Ер адам 3-лентаның қасында тұрған кезде, қызыл чемоданды алды.' },
        parts: [
          { en: 'was standing', kk: 'тұрған — созылып жатқан әрекет' },
          { en: 'when', kk: '...кезде' },
          { en: 'took', kk: 'алды — кенет болған қысқа оқиға (take → took)' }
        ],
        alt: {
          simple: 'Кино кадрын елестетіңіз: фонда біреу ұзақ тұрып тұр (was standing), сол кезде кадрда бір оқиға болады (took).',
          scheme: { type: 'timeline', long: 'was standing', point: 'took' },
          compare: { kk: '…тұрған кезде, … алды', en: '… was standing … when … took …', note: 'Қазақшадағы «-ып тұрған/жатқан кезде» көбіне was/were + -ing-ке сәйкес келеді, бірақ әрдайым емес.' },
          limits: 'Кино аналогиясы әрекеттердің ретін ғана көрсетеді. Кейбір етістіктер -ing түрінде сирек қолданылады: I knew him («I was knowing» емес).',
          example: { en: 'I was reading when the bus stopped.', kk: 'Автобус тоқтаған кезде, мен кітап оқып отырғанмын.' },
          check: { type: 'choice', prompt: 'Бос орынға не келеді?', sentence: 'We ___ coffee when the announcement started.', options: ['were drinking', 'was drinking', 'drank'], answer: 0,
            hints: ['Кофе ішу созылды ма, әлде кенет болды ма?', 'We — бірнеше адам: was па, were ме?', 'were d _ _ _ _ _ _ _'],
            explain: 'Кофе ішу — фон, we үшін were: were drinking.' }
        },
        task: { type: 'choice', prompt: 'Куәгер айтқанды аяқтаңыз:', sentence: 'The man ___ on his phone when the bags arrived.', options: ['was talking', 'were talking', 'talked'], answer: 0,
          hints: ['Телефонмен сөйлесу — созылған әрекет пе?', 'The man — бір адам: was па, were ме?', 'was t _ _ _ _ _ _'],
          explain: 'Сөйлесу — фон, бір адам: was talking. Сөмкелердің келуі — оқиға: arrived.' }
      },
      scenes: [
        {
          icon: '🎥', title: 'Камера жазбасы', place: '3-лента',
          clue: { label: 'Із 1 · Камера жазбасы', sign: true,
            lines: ['CAMERA 3 — BELT 3', '14:05 Bags start to arrive.', '14:07 A tall man in a grey coat is standing near the belt.', '14:09 He takes a red suitcase and walks to exit B.'],
            glossary: [{ en: 'grey coat', kk: 'сұр пальто' }] },
          task: { type: 'choice', prompt: 'Ер адам қызыл чемоданды сағат нешеде алды?', options: ['14:09', '14:05', '14:07'], answer: 0,
            explain: '14:09 He takes a red suitcase. 14:07-де ол тек тұрған.' },
          hints: ['Қосымша із: take — алу. takes сөзі бар жолды табыңыз.', 'Әр жолдың басындағы уақыт пен етістікке қараңыз.', '«He takes a red suitcase» қай уақытта тұр?'],
          unlock: 'Сұр пальтолы ер адам чемоданды B шығысына алып кеткен. Сол кезде қасында кім болды?'
        },
        {
          icon: '🗣️', title: 'Куәгер', place: 'B шығысы',
          clue: { label: 'Із 2 · Жинаушының сөзі',
            lines: ['Cleaner: I remember him. I was cleaning the floor when he passed me.', 'Cleaner: He was looking at his phone, and he didn\'t check the ribbon.'],
            glossary: [{ en: 'passed me', kk: 'қасымнан өтті' }, { en: 'check', kk: 'тексеру' }] },
          task: { type: 'choice', prompt: 'Ер адам өтіп бара жатқанда, жинаушы не істеп жатты?', options: ['еденді жуып жатты', 'телефонға қарап тұрды', 'чемодан алып жатты'], answer: 0,
            explain: 'I was cleaning the floor when he passed me — еденді жуып жатқан кезде, ол өтті.' },
          hints: ['Қосымша із: «I was cleaning…» — жинаушы өзі туралы айтып тұр.', 'was + -ing бөлігі — сол сәтте созылып жатқан әрекет.', 'clean the floor — еденді жуу.'],
          unlock: 'Ер адам телефонға қарап, таспаны тексермеген. Бұл ұрлық па, әлде қателік пе?'
        },
        {
          icon: '✍️', title: 'Тергеу есебі', place: 'Бюро',
          clue: { label: 'Із 3 · Есеп жобасы', lines: ['REPORT: The man ___ (look) at his phone when he took our suitcase.'], glossary: [] },
          task: { type: 'type', prompt: 'Есепті аяқтаңыз. Жақшадағы етістікті дұрыс түрде жазыңыз:', sentence: 'The man ___ (look) at his phone when he took our suitcase.', answers: ['was looking'],
            explain: 'Телефонға қарау — созылған әрекет, бір адам: was looking.' },
          hints: ['Қосымша із: екінші іздегі жинаушының сөзін еске түсіріңіз — ер адам сол кезде телефонмен не істеп тұрды?', 'Созылып жатқан әрекет: was + етістік + -ing.', 'was l _ _ _ _ _ _'],
          unlock: 'Есеп дайын. Сол кезде бюроға жаңа хабар келді…'
        },
        {
          icon: '📨', title: 'Бюроның жазбасы', place: 'Lost and Found',
          clue: { label: 'Із 4 · Жазба',
            lines: ['LOST AND FOUND — NOTE', '15:20 A passenger brought a red suitcase with a yellow ribbon.', 'He said: "I was waiting for a taxi when I noticed that the ribbon was not mine."'],
            glossary: [{ en: 'noticed', kk: 'байқадым' }, { en: 'mine', kk: 'менікі' }] },
          task: { type: 'choice', prompt: 'Жолаушы қателігін қашан байқады?', options: ['Такси күтіп тұрғанда', 'Ұшақта', 'Лентаның қасында'], answer: 0,
            explain: 'I was waiting for a taxi when I noticed… — такси күтіп тұрғанда байқады.' },
          hints: ['Қосымша із: жолаушының сөзін оқыңыз — «I was waiting for…».', 'was waiting — фон. Сол фонда не болды?', 'waiting for a taxi'],
          unlock: 'Жолаушы чемоданды өзі қайтарып әкелген!'
        }
      ],
      finale: {
        lines: ['Officer: Is this your suitcase?', 'You: Yes! Tag 4721 and a yellow ribbon.', 'Officer: The man was really sorry. He has the same suitcase, but without a ribbon.'],
        kk: 'Ер адам ұры емес еді: телефонға қарап тұрған кезде, өз чемоданына ұқсас біздің чемоданды алған. Такси күтіп тұрғанда таспаны байқап, қайтарып әкелген.'
      }
    },

    // ======================================================= Нұсқа 3
    {
      stage: 3,
      label: 'Күрделі нұсқа',
      supports: 'Ресми есеп пен қарама-қайшы куәгерлер, сөздіксіз дерлік, тұжырым жасау және сөйлем құру.',
      canDo: 'Оқиғаны Passive арқылы баяндап, куәгерлердің сөзін дәлелмен салыстыра аламын.',
      explainer: {
        puzzle: {
          intro: 'Ресми есептен үш сөйлем:',
          examples: [
            { en: 'The suitcase was taken at 14:09.', kk: 'Чемодан 14:09-да алынды.' },
            { en: 'The bags were checked by the staff.', kk: 'Сөмкелерді қызметкерлер тексерді.' },
            { en: 'The ribbon was tied by Grandma.', kk: 'Таспаны әже байлаған.' }
          ],
          question: 'Бұл сөйлемдердің ортақ ерекшелігі не?',
          options: ['Назар затта: be + етістіктің 3-түрі (taken, checked, tied)', 'Барлығы — сұрақ сөйлемдер', 'Барлығында әрекетті жасаған адам бірінші тұр'],
          answer: 0,
          after: 'Иә. Ресми есептер жиі осылай жазылады. Енді ережені нақтылайық.'
        },
        rule: [
          'Кім істегені белгісіз немесе маңызды емес болса, be + етістіктің 3-түрі (V3) қолданылады: was taken.',
          'Кім істегенін айтқыңыз келсе, by қосылады: by the staff — қызметкерлер.'
        ],
        example: { en: 'Our suitcase was taken by mistake.', kk: 'Біздің чемоданды қателесіп алып кеткен.' },
        parts: [
          { en: 'Our suitcase', kk: 'назар осы затта' },
          { en: 'was taken', kk: 'was + V3 (take → taken)' },
          { en: 'by mistake', kk: 'қателесіп — тұрақты тіркес; мұнда by әрекет иесін көрсетпейді' }
        ],
        alt: {
          simple: 'Тергеушінің хаттамасын елестетіңіз: кім алғаны әлі белгісіз, сондықтан сөйлем заттан басталады.',
          scheme: { type: 'slots', rows: [[{ t: 'The suitcase', c: 'зат' }, { t: 'was', c: 'be' }, { t: 'taken', c: 'V3' }, { t: '(by …)', c: 'кім? — қажет болса' }]] },
          compare: { kk: 'Чемодан алынды.', en: 'The suitcase was taken.', note: 'Қазақшада ырықсыз етіс жұрнақпен жасалады (ал-ын-ды), ағылшынша екі бөлік керек: was + taken.' },
          limits: 'by mistake тіркесіндегі by әрекет иесін емес, «қателесіп» деген мағынаны береді. Бұл — Passive-тегі «by + кім» емес.',
          example: { en: 'The video was checked by the officer.', kk: 'Видеоны офицер тексерді.' },
          check: { type: 'choice', prompt: 'Бос орынға не келеді?', sentence: 'Two red suitcases ___ at belt 3.', options: ['were left', 'was left', 'left'], answer: 0,
            hints: ['Чемодандар өзі бір нәрсе істеді ме, әлде олармен бір нәрсе болды ма?', 'Two suitcases — көпше: was па, were ме?', 'were l _ _ _'],
            explain: 'Чемодандарды қалдырып кеткен: were left (көпше).' }
        },
        task: { type: 'choice', prompt: 'Хаттамадағы сөйлемді таңдаңыз:', sentence: 'The security video ___ by the officer.', options: ['was checked', 'checked', 'was check'], answer: 0,
          hints: ['Видео өзі тексерді ме?', 'be + V3 керек: check → ?', 'was ch _ _ _ _ _'],
          explain: 'Видеоны офицер тексерді: was checked by the officer.' }
      },
      scenes: [
        {
          icon: '📄', title: 'Ресми есеп', place: 'Әуежай қызметі',
          clue: { label: 'Із 1 · Оқиға туралы есеп',
            lines: ['INCIDENT REPORT 7', 'At 14:09 a red suitcase was removed from belt 3.', 'The suitcase was not damaged, and nothing was taken out of it.', 'It was carried to exit B by a man in a grey coat.'],
            glossary: [{ en: 'removed', kk: 'алып кетілді' }] },
          task: { type: 'choice', prompt: 'Есепке сәйкес қай тұжырым дұрыс?', options: ['Чемоданды сұр пальтолы ер адам алып кеткен.', 'Чемоданның ішінен заттар алынған.', 'Чемодан бүлінген.'], answer: 0,
            explain: 'It was carried to exit B by a man in a grey coat. Есепте чемодан бүлінбеген және ішінен ештеңе алынбаған.' },
          hints: ['Қосымша із: «by a man in a grey coat» — әрекет иесі осында.', 'not damaged — бүлінбеген; nothing was taken out — ештеңе алынбаған.', 'Соңғы сөйлемде кім алып кеткені жазылған.'],
          unlock: 'Ер адамды екі куәгер көрген. Бірақ олардың сөзі әртүрлі.'
        },
        {
          icon: '⚖️', title: 'Екі куәгер', place: 'B шығысы',
          clue: { label: 'Із 2 · Куәгерлер және камера',
            lines: ['Witness A: "He looked nervous, so he must have stolen it."', 'Witness B: "He looked calm. He was reading his phone and didn\'t look at the ribbon."', 'Camera: he went straight to the taxi line, not to the car park.'],
            glossary: [{ en: 'must have stolen', kk: 'ұрлаған болуы керек (болжам)' }] },
          task: { type: 'choice', prompt: 'Қай тұжырым дәлелге көбірек сүйенеді?',
            options: ['B куәгер мен камера: ол асығыста, абайсызда алған', 'A куәгер: ол — ұры', 'Ешқайсысы, дәлел жоқ'], answer: 0,
            explain: 'A куәгер тек әсерге сүйенеді (looked nervous). B куәгердің сөзін камера растайды: ол тікелей такси кезегіне барған.' },
          hints: ['Қосымша із: «must have stolen» — болжам, дәлел емес.', 'Қай куәгердің сөзін камера растайды?', 'Камера: taxi line. Бұл кімнің сөзіне сай келеді?'],
          unlock: 'Демек бұл ұрлық емес, қателік болуы мүмкін. Хаттамаға осыны жазу керек.'
        },
        {
          icon: '✍️', title: 'Хаттама', place: 'Бюро',
          clue: { label: 'Із 3 · Хаттаманың басы', lines: ['CONCLUSION: ...'], glossary: [] },
          task: { type: 'order', prompt: 'Қорытынды сөйлемді құрастырыңыз:', words: ['taken', 'Our', 'by', 'was', 'suitcase', 'mistake'], answer: 'Our suitcase was taken by mistake',
            explain: 'Our suitcase was taken by mistake — назар чемоданда, was + V3.' },
          hints: ['Қосымша із: назар чемоданда, сондықтан сөйлем Our suitcase-тен басталады.', 'Одан кейін be + V3: was taken.', 'Our suitcase was ... by ...'],
          unlock: 'Хаттама жазылды. Сол кезде бюроның телефоны шырылдады.'
        },
        {
          icon: '📨', title: 'Соңғы жазба', place: 'Lost and Found',
          clue: { label: 'Із 4 · Бюро жазбасы', lines: ['15:20 A red suitcase with a yellow ribbon (tag 4721) — returned by a passenger.'], glossary: [] },
          task: { type: 'type', prompt: 'Хаттаманы аяқтаңыз. Жақшадағы етістікті Passive түрінде жазыңыз:', sentence: 'The suitcase ___ (return) to the Lost and Found desk at 15:20.', answers: ['was returned'],
            explain: 'Назар чемоданда, өткен шақ, бір зат: was returned.' },
          hints: ['Қосымша із: чемоданды біреу қайтарды, бірақ назар чемоданда.', 'be + V3: return → returned. Бір зат, өткен шақ.', 'w _ _  r _ _ _ _ _ _ _'],
          unlock: 'Іс жабылуға дайын.'
        }
      ],
      finale: {
        lines: ['Officer: Although the two suitcases looked identical, the yellow ribbon made the difference.', 'The other passenger was not a thief: his own suitcase had been left on the same belt, and he was in a hurry.', 'Case closed: the suitcase was returned to its owner.'],
        kk: 'Екі чемодан бірдей көрінгенімен, сары таспа айырмашылықты көрсетті. Екінші жолаушы ұры емес, асығыс адам болып шықты. Іс жабылды.'
      }
    }
  ]
});
