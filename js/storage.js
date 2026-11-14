/*
 * Локальное хранение. Всё лежит в одном ключе localStorage этого браузера.
 * Нет сервера, нет аккаунтов, нет синхронизации.
 */
window.FEA = window.FEA || {};

FEA.storage = (function () {
  var KEY = 'familyEnglishApp.v1';
  var memoryFallback = null;   // если localStorage недоступен
  var available = true;

  function emptyState() {
    return { version: 1, activeProfileId: null, profiles: {} };
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return emptyState();
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || !data.profiles) return emptyState();
      return data;
    } catch (e) {
      available = false;
      return memoryFallback || emptyState();
    }
  }

  function save(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
      available = true;
    } catch (e) {
      available = false;
      memoryFallback = state;
    }
  }

  /* Удаляет ТОЛЬКО данные этого приложения на этом устройстве. */
  function clearAll() {
    try { window.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    memoryFallback = null;
  }

  function newId() {
    return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function newProfile(name, presetLevel) {
    return {
      id: newId(),
      name: name,
      presetLevel: presetLevel || null, // предварительный ориентир (A0, A1, A2, B1–B2)
      interest: null,            // старое поле (версия 1): читается для совместимости
      otherTopic: '',
      interests: null,           // версия 2: null — ещё не выбирал, [] — без интересов, иначе до 3 направлений
      createdAt: new Date().toISOString(),
      diagnostic: null,          // { date, correct: {words, grammar, reading}, suggested: {...} }
      stages: presetLevel ? FEA.stagesFromLevel(presetLevel) : null, // меняет только ученик
      lessons: {},               // id -> { completedAt, times, lastAccuracy, bestAccuracy, contextsUsed: [] }
      reviews: {},               // id -> { box, due, added, correct, wrong, lastAt }
      mistakes: [],              // последние ошибки
      reviewLog: []              // { id, skill, ok, at } — для предложения о смене ступени
    };
  }

  // ---------- Резервная копия (только локально: файл скачивается и читается в браузере)
  var BACKUP_APP = 'family-english-app';
  var MAX_BACKUP_BYTES = 5 * 1024 * 1024;

  function exportBackup(state) {
    return JSON.stringify({ app: BACKUP_APP, format: 1, exportedAt: new Date().toISOString(), data: state }, null, 2);
  }

  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }

  /* Проверка одного профиля из файла. Возвращает текст ошибки или null. */
  function checkProfile(p, key) {
    if (!isObj(p)) return 'профиль ' + key + ' — қате формат';
    if (typeof p.id !== 'string' || !p.id || p.id !== key) return 'профиль ' + key + ' — id сәйкес емес';
    if (typeof p.name !== 'string' || !p.name.trim() || p.name.length > 60) return 'профиль ' + key + ' — аты қате';
    if (!isObj(p.lessons) || !isObj(p.reviews)) return '«' + p.name + '» — сабақтар не қайталаулар табылмады';
    if (p.mistakes !== undefined && !Array.isArray(p.mistakes)) return '«' + p.name + '» — қателер тізімі қате';
    if (p.stages !== null && p.stages !== undefined && !isObj(p.stages)) return '«' + p.name + '» — саты қате';
    if (p.interests !== null && p.interests !== undefined && !Array.isArray(p.interests)) return '«' + p.name + '» — қызығушылықтар тізімі қате';
    if (p.vocab !== undefined && !isObj(p.vocab)) return '«' + p.name + '» — сөздік деректері қате';
    return null;
  }

  /*
   * Разбор файла резервной копии. Ничего не сохраняет.
   * current — текущее состояние, чтобы показать, что новое, а что совпадает.
   */
  function parseBackup(text, current) {
    if (typeof text !== 'string' || text.length > MAX_BACKUP_BYTES) return { ok: false, error: 'Файл тым үлкен немесе бос.' };
    var obj;
    try { obj = JSON.parse(text); } catch (e) { return { ok: false, error: 'Бұл JSON файлы емес немесе файл бүлінген.' }; }
    if (!isObj(obj) || obj.app !== BACKUP_APP || obj.format !== 1 || !isObj(obj.data)) {
      return { ok: false, error: 'Бұл файл осы қосымшаның сақтық көшірмесі емес.' };
    }
    var data = obj.data;
    if (data.version !== 1 || !isObj(data.profiles)) return { ok: false, error: 'Файлдағы деректердің құрылымы танылмады.' };
    var ids = Object.keys(data.profiles);
    if (!ids.length) return { ok: false, error: 'Файлда бірде-бір профиль жоқ.' };
    for (var i = 0; i < ids.length; i++) {
      var problem = checkProfile(data.profiles[ids[i]], ids[i]);
      if (problem) return { ok: false, error: 'Файл тексеруден өтпеді: ' + problem + '.' };
    }
    var curProfiles = (current && current.profiles) || {};
    var curNames = {};
    Object.keys(curProfiles).forEach(function (id) { curNames[curProfiles[id].name.trim().toLowerCase()] = id; });
    var summary = ids.map(function (id) {
      var p = data.profiles[id];
      var status = curProfiles[id] ? 'same-id' : (curNames[p.name.trim().toLowerCase()] ? 'same-name' : 'new');
      return {
        id: id, name: p.name, status: status,
        lessons: Object.keys(p.lessons).length,
        reviews: Object.keys(p.reviews).length,
        mistakes: (p.mistakes || []).length,
        cases: p.cases ? Object.keys(p.cases).length : 0
      };
    });
    return { ok: true, data: data, exportedAt: obj.exportedAt || null, summary: summary };
  }

  /* Безопасное объединение: добавляются только профили, которых нет ни по id, ни по имени. */
  function mergeNewProfiles(state, parsed) {
    var added = [];
    parsed.summary.forEach(function (s) {
      if (s.status === 'new') { state.profiles[s.id] = parsed.data.profiles[s.id]; added.push(s.name); }
    });
    return added;
  }

  return {
    KEY: KEY,
    exportBackup: exportBackup,
    parseBackup: parseBackup,
    mergeNewProfiles: mergeNewProfiles,
    load: load,
    save: save,
    clearAll: clearAll,
    newProfile: newProfile,
    isAvailable: function () { return available; }
  };
})();
