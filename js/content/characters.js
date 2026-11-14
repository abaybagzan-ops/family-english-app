/*
 * Каталог персонажей (семейная версия). Решение владельца проекта: допускаются настоящие персонажи
 * произведений. Правила:
 *  - сцены в приложении — новые короткие учебные ситуации; ни отрывков книг, ни реплик, ни сцен,
 *    ни сюжетных поворотов, ни стиля авторов; логотипы и картинки не используются;
 *  - персонаж «активен», только если есть готовый вариант урока, где он выполняет функцию в задаче
 *    (поле characters у варианта в interest-variants.js; проверяет валидатор);
 *  - остальные — каталог «сюжет кейін» (позже), в активный выбор не попадают;
 *  - реальные люди — отдельно (real: true), только проверенные факты, без выдуманных поступков;
 *    в этой версии активных сцен с реальными людьми нет;
 *  - возраст: ориентир 10–12 лет. age — оценка по источнику (source) либо «не проверено в этой сессии».
 *  - популярность среди детей Казахстана этим каталогом НЕ утверждается.
 *
 * genre: mystery | magic | heroes | games | animation | adventure | comedy | books | space-sport | folk
 * Названия и имена персонажей — торговые марки и объекты прав их владельцев; используются только как
 * имена в учебных ситуациях.
 */
window.FEA = window.FEA || {};

FEA.maxFavorites = 6;

FEA.characterGenres = [
  { id: 'mystery', title: 'Жұмбақ пен тергеу' },
  { id: 'magic', title: 'Сиқыр мен шытырман оқиға' },
  { id: 'heroes', title: 'Суперкейіпкерлер' },
  { id: 'games', title: 'Ойындар' },
  { id: 'animation', title: 'Мультфильмдер' },
  { id: 'comedy', title: 'Әзіл' },
  { id: 'books', title: 'Кітаптар' },
  { id: 'folk', title: 'Қазақ ертегілері мен аңыздары' },
  { id: 'real', title: 'Нақты адамдар (тек фактілер)' }
];

/* Миры. age — возрастной ориентир, ageNote — что учитывать, source — где проверено. */
FEA.characterWorlds = [
  { id: 'gravity-falls', title: 'Gravity Falls', genre: 'mystery', age: 'Common Sense Media: 8+', ageNote: 'Кейбір сериялар қорқынышты; Bill Cipher кейіпкері қосылмаған.', source: 'https://www.commonsensemedia.org/tv-reviews/gravity-falls' },
  { id: 'scooby-doo', title: 'Scooby-Doo', genre: 'mystery', age: 'Common Sense Media: 7+ (Mystery Incorporated)', ageNote: 'Жеңіл «қорқынышты» әзіл.', source: 'https://www.commonsensemedia.org/tv-reviews/scooby-doo-mystery-incorporated' },
  { id: 'sherlock', title: 'Sherlock Holmes (A. Conan Doyle)', genre: 'mystery', age: 'кітаптар: ересектерге арналған детектив', ageNote: 'Түпнұсқада қылмыстар бар — тек жаңа, жеңіл жағдайлар. Канон АҚШ-та 2023 жылдан қоғамдық игілік.', source: 'https://www.librarypoint.org/blogs/post/2023-public-domain/' },
  { id: 'zootopia', title: 'Zootopia', genre: 'mystery', age: 'Common Sense Media: 8+, PG', ageNote: 'Жеңіл қауіп сахналары.', source: 'https://www.commonsensemedia.org/movie-reviews/zootopia' },
  { id: 'harry-potter', title: 'Harry Potter', genre: 'magic', age: 'Common Sense Media: кітаптар біртіндеп қараңғыланады (4-кітаптан 10+)', ageNote: 'Тек алғашқы кітаптардағыдай жеңіл мектеп жағдайлары; Voldemort және соңғы кітаптардың оқиғалары қолданылмайды.', source: 'https://www.commonsensemedia.org/blog/harry-potter-age-by-age-guide' },
  { id: 'percy-jackson', title: 'Percy Jackson', genre: 'magic', age: 'Common Sense Media (фильм): 10+', ageNote: 'Құбыжықтармен шайқас бар — тек бейбіт тапсырмалар.', source: 'https://commonsensemedia.org/movie-reviews/percy-jackson-and-the-olympians-the-lightning-thief' },
  { id: 'httyd', title: 'How to Train Your Dragon', genre: 'magic', age: 'PG (не проверено в этой сессии)', ageNote: 'Шайқас сахналары бар.', source: '' },
  { id: 'avatar', title: 'Avatar: The Last Airbender', genre: 'magic', age: 'Common Sense Media: 8+', ageNote: 'Соғыс тақырыбы — тек бейбіт жағдайлар.', source: 'https://www.commonsensemedia.org/tv-reviews/avatar-the-last-airbender' },
  { id: 'spider-verse', title: 'Spider-Man / Spider-Verse (Marvel)', genre: 'heroes', age: 'Common Sense Media: Spider-Man age-by-age guide (Into the Spider-Verse — 8–10 тобында)', ageNote: 'Төбелес сахналары — тек бейбіт тапсырмалар.', source: 'https://www.commonsensemedia.org/articles/spider-man-age-by-age-guide' },
  { id: 'marvel-young', title: 'Ms. Marvel, Squirrel Girl (Marvel)', genre: 'heroes', age: 'не проверено в этой сессии', ageNote: 'Комикстер әртүрлі жасқа арналған.', source: '' },
  { id: 'dc', title: 'Batman, Superman, Wonder Woman (DC)', genre: 'heroes', age: 'фильмдердің көбі PG-13 (не проверено в этой сессии)', ageNote: 'Бэтмен фильмдері қараңғы — тек балаларға арналған мультфильм нұсқасының жеңіл бейнесі.', source: '' },
  { id: 'big-hero-6', title: 'Big Hero 6', genre: 'heroes', age: 'PG (не проверено в этой сессии)', ageNote: 'Жоғалту тақырыбы бар.', source: '' },
  { id: 'minecraft', title: 'Minecraft', genre: 'games', age: 'ESRB: E10+ (Fantasy Violence)', ageNote: 'Ойын ішіндегі онлайн-қарым-қатынас.', source: 'https://www.esrb.org/tag/minecraft-dungeons/' },
  { id: 'mario', title: 'Super Mario', genre: 'games', age: 'ESRB: E (Super Mario Bros. Wonder)', ageNote: '—', source: 'https://www.esrb.org/tag/super-mario-bros-wonder' },
  { id: 'sonic', title: 'Sonic the Hedgehog', genre: 'games', age: 'ESRB: E10+ (Sonic Frontiers)', ageNote: 'Жеңіл қиял зорлығы.', source: 'https://www.esrb.org/ratings/38707/sonic-frontiers/' },
  { id: 'pokemon', title: 'Pokémon', genre: 'games', age: 'ESRB: Mild Fantasy Violence (Pokémon Scarlet)', ageNote: 'Жарыстар — тек бейбіт тапсырмалар.', source: 'https://www.esrb.org/ratings/38810/pokemon-scarlet/' },
  { id: 'zelda', title: 'The Legend of Zelda', genre: 'games', age: 'E10+ (не проверено в этой сессии)', ageNote: 'Шайқастар бар.', source: '' },
  { id: 'ninjago', title: 'LEGO Ninjago', genre: 'games', age: 'не проверено в этой сессии', ageNote: '—', source: '' },
  { id: 'toy-story', title: 'Toy Story', genre: 'animation', age: 'G (не проверено в этой сессии)', ageNote: '—', source: '' },
  { id: 'frozen', title: 'Frozen', genre: 'animation', age: 'PG (не проверено в этой сессии)', ageNote: '—', source: '' },
  { id: 'moana', title: 'Moana', genre: 'animation', age: 'PG (не проверено в этой сессии)', ageNote: '—', source: '' },
  { id: 'encanto', title: 'Encanto', genre: 'animation', age: 'PG (не проверено в этой сессии)', ageNote: '—', source: '' },
  { id: 'inside-out', title: 'Inside Out', genre: 'animation', age: 'PG (не проверено в этой сессии)', ageNote: '—', source: '' },
  { id: 'kung-fu-panda', title: 'Kung Fu Panda', genre: 'animation', age: 'PG (не проверено в этой сессии)', ageNote: 'Жекпе-жек сахналары.', source: '' },
  { id: 'wall-e', title: 'WALL-E', genre: 'animation', age: 'G (не проверено в этой сессии)', ageNote: '—', source: '' },
  { id: 'ghibli', title: 'Studio Ghibli (Totoro, Kiki, Spirited Away)', genre: 'animation', age: 'G / PG (не проверено в этой сессии)', ageNote: 'Spirited Away кей сахналары қорқынышты.', source: '' },
  { id: 'doraemon', title: 'Doraemon', genre: 'animation', age: 'не проверено в этой сессии', ageNote: '—', source: '' },
  { id: 'star-wars', title: 'Star Wars', genre: 'animation', age: 'фильмдер PG / PG-13 (не проверено в этой сессии)', ageNote: 'Шайқастар; Grogu — TV-14 сериалынан, сондықтан жеке тексеру керек.', source: '' },
  { id: 'spongebob', title: 'SpongeBob SquarePants', genre: 'comedy', age: 'TV-Y7 (не проверено в этой сессии)', ageNote: 'Дөрекі әзіл.', source: '' },
  { id: 'wallace-gromit', title: 'Wallace & Gromit', genre: 'comedy', age: 'G (не проверено в этой сессии)', ageNote: '—', source: '' },
  { id: 'shrek', title: 'Shrek', genre: 'comedy', age: 'PG (не проверено в этой сессии)', ageNote: 'Дөрекі әзіл.', source: '' },
  { id: 'despicable-me', title: 'Despicable Me / Minions', genre: 'comedy', age: 'PG (не проверено в этой сессии)', ageNote: '—', source: '' },
  { id: 'wimpy-kid', title: 'Diary of a Wimpy Kid', genre: 'books', age: 'не проверено в этой сессии', ageNote: '—', source: '' },
  { id: 'paddington', title: 'Paddington', genre: 'books', age: 'не проверено в этой сессии', ageNote: '—', source: '' },
  { id: 'tom-sawyer', title: 'Tom Sawyer (Mark Twain)', genre: 'books', age: 'классика, қоғамдық игілік', ageNote: 'Түпнұсқада ескірген нәсілдік сөздер бар — тек жаңа жағдайлар. Қазақстан кітапханаларында ең көп оқылатындардың бірі ретінде аталған (bes.media).', source: 'https://bes.media/news/deti-v-kazahstane-predpochitayut-chitat-fantastiku-i-komiksi-1a8288/' },
  { id: 'kazakh-folk', title: 'Қазақ ертегілері (Алдар Көсе, Қожанасыр, Ер Төстік)', genre: 'folk', age: 'халық шығармашылығы', ageNote: 'Нұсқалары көп — тек жаңа жағдайлар.', source: '' },
  { id: 'masha-bear', title: 'Masha and the Bear', genre: 'animation', age: 'кішкентай балаларға (3–7) — 10–12 жасқа тым балаң болуы мүмкін', ageNote: 'Белсенді таңдауға қосылмайды.', source: '' },
  { id: 'smeshariki', title: 'Смешарики / Kikoriki', genre: 'animation', age: 'кішкентай балаларға — 10–12 жасқа тым балаң болуы мүмкін', ageNote: 'Белсенді таңдауға қосылмайды.', source: '' },
  { id: 'real-sport', title: 'Нақты спортшылар мен ұйымдастырушылар', genre: 'real', age: 'нақты адамдар', ageNote: 'Тек тексерілген фактілер; ойдан шығарылған әрекет жазылмайды. UFC — ересектерге арналған жекпе-жек; бұл нұсқада сахна жоқ.', source: '' },
  { id: 'real-space', title: 'Ғарышкерлер', genre: 'real', age: 'нақты адамдар', ageNote: 'Тек тексерілген фактілер.', source: '' }
];

/* Персонажи: [id, имя (как в произведении), мир]. Активность определяется наличием варианта урока. */
FEA.characters = [
  ['dipper', 'Dipper Pines', 'gravity-falls'], ['mabel', 'Mabel Pines', 'gravity-falls'], ['stan', 'Grunkle Stan', 'gravity-falls'], ['soos', 'Soos', 'gravity-falls'], ['wendy', 'Wendy Corduroy', 'gravity-falls'],
  ['scooby', 'Scooby-Doo', 'scooby-doo'], ['shaggy', 'Shaggy', 'scooby-doo'], ['velma', 'Velma', 'scooby-doo'], ['daphne', 'Daphne', 'scooby-doo'], ['fred', 'Fred', 'scooby-doo'],
  ['holmes', 'Sherlock Holmes', 'sherlock'], ['watson', 'Dr Watson', 'sherlock'], ['hudson', 'Mrs Hudson', 'sherlock'],
  ['judy', 'Judy Hopps', 'zootopia'], ['nick', 'Nick Wilde', 'zootopia'], ['flash-sloth', 'Flash', 'zootopia'],
  ['harry', 'Harry Potter', 'harry-potter'], ['hermione', 'Hermione Granger', 'harry-potter'], ['ron', 'Ron Weasley', 'harry-potter'], ['hagrid', 'Hagrid', 'harry-potter'], ['luna', 'Luna Lovegood', 'harry-potter'], ['neville', 'Neville Longbottom', 'harry-potter'], ['ginny', 'Ginny Weasley', 'harry-potter'],
  ['percy', 'Percy Jackson', 'percy-jackson'], ['annabeth', 'Annabeth Chase', 'percy-jackson'], ['grover', 'Grover Underwood', 'percy-jackson'],
  ['hiccup', 'Hiccup', 'httyd'], ['toothless', 'Toothless', 'httyd'], ['astrid', 'Astrid', 'httyd'],
  ['aang', 'Aang', 'avatar'], ['katara', 'Katara', 'avatar'], ['sokka', 'Sokka', 'avatar'], ['toph', 'Toph', 'avatar'], ['zuko', 'Zuko', 'avatar'],
  ['miles', 'Miles Morales', 'spider-verse'], ['gwen', 'Gwen Stacy', 'spider-verse'], ['peter', 'Peter Parker', 'spider-verse'],
  ['kamala', 'Kamala Khan (Ms. Marvel)', 'marvel-young'], ['doreen', 'Doreen Green (Squirrel Girl)', 'marvel-young'],
  ['batman', 'Batman', 'dc'], ['robin', 'Robin', 'dc'], ['superman', 'Superman', 'dc'], ['wonder-woman', 'Wonder Woman', 'dc'], ['the-flash', 'The Flash', 'dc'],
  ['hiro', 'Hiro Hamada', 'big-hero-6'], ['baymax', 'Baymax', 'big-hero-6'],
  ['steve', 'Steve', 'minecraft'], ['alex', 'Alex', 'minecraft'], ['villager', 'Villager', 'minecraft'], ['creeper', 'Creeper', 'minecraft'],
  ['mario', 'Mario', 'mario'], ['luigi', 'Luigi', 'mario'], ['peach', 'Princess Peach', 'mario'], ['toad', 'Toad', 'mario'], ['yoshi', 'Yoshi', 'mario'], ['bowser', 'Bowser', 'mario'],
  ['sonic', 'Sonic', 'sonic'], ['tails', 'Tails', 'sonic'], ['knuckles', 'Knuckles', 'sonic'], ['amy', 'Amy Rose', 'sonic'], ['eggman', 'Dr. Eggman', 'sonic'],
  ['ash', 'Ash', 'pokemon'], ['pikachu', 'Pikachu', 'pokemon'], ['misty', 'Misty', 'pokemon'], ['brock', 'Brock', 'pokemon'], ['nurse-joy', 'Nurse Joy', 'pokemon'], ['eevee', 'Eevee', 'pokemon'],
  ['link', 'Link', 'zelda'], ['zelda', 'Princess Zelda', 'zelda'],
  ['lloyd', 'Lloyd', 'ninjago'], ['kai', 'Kai', 'ninjago'], ['nya', 'Nya', 'ninjago'],
  ['woody', 'Woody', 'toy-story'], ['buzz', 'Buzz Lightyear', 'toy-story'], ['jessie', 'Jessie', 'toy-story'],
  ['anna', 'Anna', 'frozen'], ['elsa', 'Elsa', 'frozen'], ['olaf', 'Olaf', 'frozen'],
  ['moana', 'Moana', 'moana'], ['maui', 'Maui', 'moana'],
  ['mirabel', 'Mirabel', 'encanto'], ['luisa', 'Luisa', 'encanto'], ['bruno', 'Bruno', 'encanto'],
  ['joy', 'Joy', 'inside-out'], ['sadness', 'Sadness', 'inside-out'], ['anxiety', 'Anxiety', 'inside-out'],
  ['po', 'Po', 'kung-fu-panda'], ['tigress', 'Tigress', 'kung-fu-panda'], ['shifu', 'Master Shifu', 'kung-fu-panda'],
  ['wall-e', 'WALL-E', 'wall-e'], ['eve', 'EVE', 'wall-e'],
  ['totoro', 'Totoro', 'ghibli'], ['kiki', 'Kiki', 'ghibli'], ['chihiro', 'Chihiro', 'ghibli'],
  ['doraemon', 'Doraemon', 'doraemon'], ['nobita', 'Nobita', 'doraemon'],
  ['rey', 'Rey', 'star-wars'], ['r2d2', 'R2-D2', 'star-wars'], ['bb8', 'BB-8', 'star-wars'], ['yoda', 'Yoda', 'star-wars'], ['grogu', 'Grogu', 'star-wars'],
  ['spongebob', 'SpongeBob', 'spongebob'], ['patrick', 'Patrick Star', 'spongebob'], ['sandy', 'Sandy Cheeks', 'spongebob'], ['squidward', 'Squidward', 'spongebob'],
  ['wallace', 'Wallace', 'wallace-gromit'], ['gromit', 'Gromit', 'wallace-gromit'],
  ['shrek', 'Shrek', 'shrek'], ['donkey', 'Donkey', 'shrek'],
  ['gru', 'Gru', 'despicable-me'], ['minions', 'Minions', 'despicable-me'],
  ['greg', 'Greg Heffley', 'wimpy-kid'], ['rowley', 'Rowley Jefferson', 'wimpy-kid'],
  ['paddington', 'Paddington', 'paddington'],
  ['tom', 'Tom Sawyer', 'tom-sawyer'], ['becky', 'Becky Thatcher', 'tom-sawyer'], ['huck', 'Huckleberry Finn', 'tom-sawyer'],
  ['aldar', 'Алдар Көсе', 'kazakh-folk'], ['qozhanasyr', 'Қожанасыр', 'kazakh-folk'], ['tostik', 'Ер Төстік', 'kazakh-folk'],
  ['masha', 'Masha', 'masha-bear'], ['bear', 'Bear (Мишка)', 'masha-bear'],
  ['krosh', 'Krosh', 'smeshariki'], ['yozhik', 'Yozhik', 'smeshariki'],
  // Реальные люди — отдельно, только факты; активных сцен в этой версии нет
  ['golovkin', 'Gennady Golovkin', 'real-sport'], ['rakhmonov', 'Shavkat Rakhmonov', 'real-sport'], ['dana-white', 'Dana White', 'real-sport'], ['messi', 'Lionel Messi', 'real-sport'], ['ronaldo', 'Cristiano Ronaldo', 'real-sport'],
  ['aubakirov', 'Toktar Aubakirov', 'real-space'], ['aimbetov', 'Aidyn Aimbetov', 'real-space'], ['gagarin', 'Yuri Gagarin', 'real-space']
].map(function (c) { return { id: c[0], name: c[1], world: c[2] }; });

/* Не включены в каталог для 10–12 лет (причина). */
FEA.characterExcluded = [
  ['Bill Cipher (Gravity Falls)', 'қорқынышты зұлым кейіпкер'],
  ['Voldemort (Harry Potter)', 'қараңғы зорлық, өлім тақырыбы'],
  ['Joker (DC)', 'ересектерге арналған қараңғы бейне'],
  ['Deadpool (Marvel)', 'R рейтингі'],
  ['Five Nights at Freddy\'s', 'үрей жанры'],
  ['Wednesday, Stranger Things', 'TV-14 (не проверено в этой сессии)'],
  ['Squid Game', 'TV-MA'],
  ['Demon Slayer, Attack on Titan', 'ересектерге арналған зорлық (не проверено в этой сессии)']
];
