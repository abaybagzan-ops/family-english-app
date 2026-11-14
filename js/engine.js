/*
 * Учебная логика: сборка урока, проверка ответов, повторение,
 * рекомендация следующего занятия, предложения о смене ступени.
 * Интерфейса здесь нет — только данные и правила.
 */
window.FEA = window.FEA || {};

FEA.engine = (function () {
  var S = FEA.settings;
  var DAY = 24 * 60 * 60 * 1000;
  var SKILL_ORDER = ['words', 'grammar', 'reading'];

  // ---------- Индексы контента
  var lessonsById = {};
  FEA.lessons.forEach(function (l) {
    lessonsById[l.id] = l;
    // Квест-слой (миссия, практический результат, история, подсказки) из missions.js
    var x = (FEA.lessonExtras || {})[l.id] || {};
    if (x.mission && !l.mission) l.mission = x.mission;
    if (x.canDo && !l.canDo) l.canDo = x.canDo;
    if (x.story && !l.story) l.story = x.story;
    if (x.hints && !l.hints) l.hints = x.hints;
  });

  /* Миссия урока с учётом темы. */
  function missionFor(lesson, ctxKey) {
    var m = lesson.mission || { title: lesson.title, scene: lesson.goal };
    var ctx = lesson.contexts[ctxKey];
    // Вариант по интересу задаёт свою роль и сцену; практический результат (canDo) у урока один
    if (ctx && ctx.mission) return { title: ctx.mission.title, scene: ctx.mission.scene, canDo: lesson.canDo || '', role: ctx.role || '' };
    var scene = m.contexts && m.contexts[ctxKey] ? m.contexts[ctxKey] : m.scene;
    return { title: m.title, scene: scene, canDo: lesson.canDo || '' };
  }

  var reviewItems = {};   // id -> item (+ skill, stage, source)
  FEA.lessons.forEach(function (l) {
    (l.review || []).forEach(function (r) {
      reviewItems[r.id] = Object.assign({ skill: l.skill, stage: l.stage, source: l.id }, r);
    });
  });
  FEA.diagnostic.forEach(function (d) {
    var id = d.id + '-r';
    reviewItems[id] = Object.assign({ id: id, skill: d.skill, stage: null, source: 'diagnostic' }, d.review);
  });

  function getLesson(id) { return lessonsById[id] || null; }
  function byOrder(a, b) { return (a.stage - b.stage) || ((a.order || 1) - (b.order || 1)); }
  /* Все уроки ступени по навыку, по порядку прохождения. */
  function lessonsAt(stage, skill) {
    return FEA.lessons.filter(function (l) { return l.stage === stage && l.skill === skill; }).sort(byOrder);
  }
  function lessonFor(stage, skill) { return lessonsAt(stage, skill)[0] || null; }
  function lessonsForSkill(skill) {
    return FEA.lessons.filter(function (l) { return l.skill === skill; }).sort(byOrder);
  }
  /* Первый непройденный урок ступени по навыку. */
  function nextLessonFor(profile, skill) {
    return lessonsAt(profile.stages[skill], skill).filter(function (l) { return !profile.lessons[l.id]; })[0] || null;
  }

  // ---------- Утилиты
  function normalize(s) {
    var str = String(s || '');
    if (str.normalize) str = str.normalize('NFKC');
    return str
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')   // невидимые символы клавиатур
      .toLowerCase()
      .replace(/[’‘`´ʼʹ′‛]/g, "'")
      .replace(/[.,!?;:"«»()—–\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Порядок вариантов перемешивается; возвращает [{text, correct}] */
  function shuffledOptions(task) {
    var opts = task.options.map(function (t, i) { return { text: t, correct: i === task.answer }; });
    return shuffle(opts);
  }

  /* Порядок слов: гарантируем, что перемешанный порядок не совпадает с ответом. */
  function shuffledWords(task) {
    var w = task.words.slice();
    for (var k = 0; k < 10; k++) {
      var s = shuffle(w);
      if (normalize(s.join(' ')) !== normalize(task.answer)) return s;
    }
    return w.slice().reverse();
  }

  /* Есть ли в ответе кириллица (русская или казахская раскладка). */
  function hasCyrillic(value) {
    return /[\u0400-\u04FF]/.test(String(value || ''));
  }

  /*
   * Все допустимые формы ответа:
   *  - ответы из данных урока;
   *  - всё предложение целиком, если в задании есть пропуск ___ (подсказка в скобках убирается);
   *  - «to + глагол» для однословного ответа без предложения (to go = go).
   */
  function acceptedForms(task) {
    var forms = task.answers.slice();
    if (task.sentence && task.sentence.indexOf('___') !== -1) {
      var base = task.sentence.replace(/\s*\([^)]*\)/g, '');
      task.answers.forEach(function (a) { forms.push(base.replace(/_{2,}/, a)); });
    } else if (!task.sentence) {
      task.answers.forEach(function (a) { if (a.indexOf(' ') === -1) forms.push('to ' + a); });
    }
    return forms.map(normalize);
  }

  function checkTyped(task, value) {
    var v = normalize(value);
    if (!v) return false;
    return acceptedForms(task).indexOf(v) !== -1;
  }

  function editDistance(a, b) {
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  /*
   * Опечатка в одну букву — только в заданиях на перевод слова («Ағылшынша жазыңыз…»).
   * В грамматике не применяется: там одна буква (-s, -ed) и есть проверяемое правило.
   */
  function isNearMiss(task, value) {
    if (!/^Ағылшынша жазыңыз/.test(task.prompt || '')) return false;
    var v = normalize(value);
    return task.answers.some(function (a) {
      var n = normalize(a);
      return n.length >= 4 && editDistance(v, n) === 1;
    });
  }

  function checkOrder(task, tokens) {
    return normalize(tokens.join(' ')) === normalize(task.answer);
  }

  function contextKeyFor(profile) {
    var it = FEA.interests.filter(function (i) { return i.id === profile.interest; })[0];
    return it ? it.context : 'everyday';
  }

  // ---------- Интересы (версия 2)
  var directionsById = {};
  (FEA.directions || []).forEach(function (d) { directionsById[d.id] = d; });
  function directionMeta(id) { return id === 'custom' ? FEA.customDirection : directionsById[id] || null; }

  /* Проверка и очистка одного выбранного направления. */
  function cleanInterest(x) {
    if (!x || typeof x !== 'object' || typeof x.id !== 'string') return null;
    if (x.id === 'custom') {
      var custom = typeof x.custom === 'string' ? x.custom.trim().slice(0, 40) : '';
      var modes = Array.isArray(x.likes) ? x.likes.filter(function (m) { return FEA.customDirection.modeChoices.indexOf(m) !== -1; }).slice(0, 2) : [];
      return { id: 'custom', custom: custom, likes: modes };
    }
    var d = directionsById[x.id];
    if (!d) return null;
    var ok = d.likes.map(function (l) { return l.id; });
    var likes = Array.isArray(x.likes) ? x.likes.filter(function (l) { return ok.indexOf(l) !== -1; }) : [];
    var out = { id: d.id, likes: likes };
    // Выбранные оригинальные миры (необязательно); поле есть только если что-то выбрано
    var okW = worldsFor(d.id).map(function (w) { return w.id; });
    var worlds = Array.isArray(x.worlds) ? x.worlds.filter(function (w) { return okW.indexOf(w) !== -1; }) : [];
    if (worlds.length) out.worlds = worlds;
    return out;
  }

  /*
   * Интересы профиля в порядке приоритета (не больше трёх).
   *  null — ученик ещё не выбирал;  [] — выбрал «без интересов».
   * Старое поле interest читается, но не перезаписывается.
   */
  function profileInterests(profile) {
    if (!profile) return null;
    if (Array.isArray(profile.interests)) {
      var seen = {};
      return profile.interests.map(cleanInterest).filter(function (x) {
        if (!x || seen[x.id]) return false; seen[x.id] = 1; return true;
      }).slice(0, FEA.maxDirections);
    }
    if (profile.interest === 'other') return [{ id: 'custom', custom: (profile.otherTopic || '').slice(0, 40), likes: [] }];
    var mapped = FEA.legacyInterestMap[profile.interest];
    if (mapped) return [{ id: mapped, likes: [] }];
    return null;
  }

  /* Оригинальные миры направления (только те, у которых есть вариант урока). */
  function worldsFor(dirId) {
    return (FEA.worlds || []).filter(function (w) {
      return w.direction === dirId && FEA.lessons.some(function (l) {
        return Object.keys(l.contexts).some(function (k) { return l.contexts[k].world === w.id; });
      });
    });
  }
  function worldMeta(id) { return (FEA.worlds || []).filter(function (w) { return w.id === id; })[0] || null; }

  function hasInterestChoice(profile) { return profileInterests(profile) !== null; }

  /* Предпочитаемые типы действия для направления (по уточнениям). */
  function likedModes(it) {
    if (it.id === 'custom') return it.likes.slice();
    var d = directionsById[it.id];
    return d.likes.filter(function (l) { return it.likes.indexOf(l.id) !== -1; }).map(function (l) { return l.mode; });
  }

  function isActionVariant(ctx) { return !!(ctx && ctx.mode && ctx.interests); }

  /*
   * Выбор варианта урока по интересам.
   *  kind: 'action'  — вариант для направления ученика (меняются роль, задача и решение);
   *        'mode'    — для своей темы ученика вариантов нет, но совпал любимый тип действия;
   *        'topic'   — есть только текст на тему направления (действие общее);
   *        'neutral' — подходящего нет: общий вариант урока, без подстановки слов.
   * Интерес не меняет ступень, порядок уроков и основные задания.
   */
  function pickVariant(lesson, profile) {
    var list = profileInterests(profile) || [];
    var used = profile && profile.lessons && profile.lessons[lesson.id] ? profile.lessons[lesson.id].contextsUsed || [] : [];
    var best = null;
    Object.keys(lesson.contexts).forEach(function (key) {
      var ctx = lesson.contexts[key];
      list.forEach(function (it, pos) {
        var weight = FEA.maxDirections - pos;           // 3, 2, 1 — порядок выбора
        var modes = likedModes(it);
        var score = 0, kind = null;
        if (isActionVariant(ctx) && it.id !== 'custom' && ctx.interests.indexOf(it.id) !== -1) {
          kind = 'action';
          score = 100 + weight * 10 + (modes.indexOf(ctx.mode) !== -1 ? 5 : 0) + (ctx.interests[0] === it.id ? 2 : 0);
          // Мир: выбранный — плюс; если ученик выбрал другие миры этого направления — минус (но вариант остаётся доступен)
          if (ctx.world && it.worlds && it.worlds.length) score += it.worlds.indexOf(ctx.world) !== -1 ? 4 : -3;
        } else if (isActionVariant(ctx) && modes.indexOf(ctx.mode) !== -1) {
          kind = 'mode';
          score = 50 + weight * 10;
        } else if (!isActionVariant(ctx) && it.id !== 'custom' && directionsById[it.id].topics.indexOf(key) !== -1) {
          kind = 'topic';
          score = 20 + weight * 10;
        }
        if (!kind) return;
        if (used.indexOf(key) === -1) score += 1;         // при равенстве — ещё не пройденный вариант
        if (!best || score > best.score) best = { key: key, kind: kind, score: score, interest: it };
      });
    });
    if (best) return { key: best.key, ctx: lesson.contexts[best.key], kind: best.kind, interest: best.interest };
    var def = lesson.defaultContext || 'everyday';
    return { key: def, ctx: lesson.contexts[def], kind: 'neutral', interest: list[0] || null };
  }

  /*
   * Покрытие направления по урокам: где есть вариант-действие (с примером) и где только текст на тему.
   * Нужен экрану выбора, чтобы не обещать больше, чем есть.
   */
  function directionStats(id) {
    var d = directionsById[id];
    var out = { action: [], topic: 0 };
    FEA.lessons.slice().sort(byOrder).forEach(function (l) {
      var keys = Object.keys(l.contexts);
      var act = keys.filter(function (k) { var c = l.contexts[k]; return isActionVariant(c) && c.interests.indexOf(id) !== -1; })
        .sort(function (a, b) { return (l.contexts[b].interests[0] === id) - (l.contexts[a].interests[0] === id); });
      if (act.length) out.action.push({ lesson: l, key: act[0], ctx: l.contexts[act[0]] });
      else if (d && keys.some(function (k) { return !isActionVariant(l.contexts[k]) && d.topics.indexOf(k) !== -1; })) out.topic++;
    });
    return out;
  }

  /* Все варианты урока для ручного выбора: сначала варианты-действия. */
  function lessonVariants(lesson) {
    var all = Object.keys(lesson.contexts);
    // Тематический текст, который уже целиком используется вариантом-действием, не показываем вторым пунктом
    var keys = all.filter(function (k) {
      var c = lesson.contexts[k];
      return isActionVariant(c) || !all.some(function (o) { return o !== k && isActionVariant(lesson.contexts[o]) && lesson.contexts[o].text === c.text; });
    });
    return keys.filter(function (k) { return isActionVariant(lesson.contexts[k]); })
      .concat(keys.filter(function (k) { return !isActionVariant(lesson.contexts[k]); }))
      .map(function (k) { return { key: k, ctx: lesson.contexts[k], action: isActionVariant(lesson.contexts[k]) }; });
  }

  /*
   * Словарь из слов уроков: ядро урока (words) и тематические слова текстов (themeWords).
   * Перевод берётся только из записи слова; глоссарии к текстам не берутся (это контекстные формы).
   * Пример — из примеров урока (с переводом), иначе строка из текста урока (только английский).
   * Запись без перевода не показывается.
   */
  var dictCache = null;
  function containsWord(line, en) {
    var w = en.split(/\s+[—-]\s+/)[0].toLowerCase().replace(/[.!?]/g, '');
    var esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|[^a-z\'])' + esc + '([^a-z]|$)', 'i').test(line);
  }
  function buildDictionary() {
    if (dictCache) return dictCache;
    var map = {};
    FEA.lessons.slice().sort(byOrder).forEach(function (l) {
      function add(w, ctxKey) {
        if (!w || !w.en || !w.kk) return;
        var k = w.en.trim().toLowerCase();
        var e = map[k] || (map[k] = { key: k, en: w.en.trim(), kk: [], emoji: w.emoji || '', example: null, sources: [] });
        if (e.kk.indexOf(w.kk) === -1) e.kk.push(w.kk);
        if (!e.sources.some(function (x) { return x.lessonId === l.id; })) e.sources.push({ lessonId: l.id, title: l.title, skill: l.skill, stage: l.stage, ctx: ctxKey || null });
        if (!e.example) {
          var ex = (l.examples || []).filter(function (x) { return containsWord(x.en, w.en); })[0];
          if (ex) e.example = { en: ex.en, kk: ex.kk };
        }
        if (!e.example || !e.example.kk) {
          var ctxs = ctxKey ? [l.contexts[ctxKey]] : [l.contexts[l.defaultContext || 'everyday']];
          ctxs.forEach(function (c) {
            if (e.example || !c) return;
            var line = c.text.lines.filter(function (x) { return containsWord(x, w.en) && x.length <= 90; })[0];
            if (line) e.example = { en: line, kk: null };
          });
        }
      }
      l.words.forEach(function (w) { add(w, null); });
      Object.keys(l.contexts).forEach(function (k) { (l.contexts[k].themeWords || []).forEach(function (w) { add(w, k); }); });
    });
    dictCache = Object.keys(map).map(function (k) { return map[k]; })
      .sort(function (a, b) { return a.key.localeCompare(b.key); });
    return dictCache;
  }

  function variantLabel(lesson, key) {
    var ctx = lesson.contexts[key];
    if (ctx && ctx.label) return ctx.label;
    return 'Мәтін: ' + (FEA.contextNames[key] || key);
  }

  /*
   * Текст урока для интереса. Если для интереса нет варианта, берётся общий
   * вариант урока (defaultContext, иначе everyday) и fallback = true.
   */
  function contextFor(lesson, ctxKey) {
    if (lesson.contexts[ctxKey]) return { key: ctxKey, ctx: lesson.contexts[ctxKey], fallback: false };
    var def = lesson.defaultContext || 'everyday';
    return { key: def, ctx: lesson.contexts[def], fallback: true };
  }

  function lessonWords(lesson, ctxKey) {
    var ctx = contextFor(lesson, ctxKey).ctx;
    return {
      core: lesson.words.slice(),
      theme: (ctx.themeWords || []).slice()
    };
  }

  // ---------- Повторение
  /*
   * Вопрос повторения по id. Два вида:
   *  - заранее написанные вопросы урока и диагностики (reviewItems);
   *  - ошибки из урока: 'm|<урок>|<тема>|<фаза>|<номер>' — то же задание через день,
   *    для задания по тексту вместе с текстом.
   */
  // ---------- Дела (демонстрационные миссии)
  var casesById = {};
  (FEA.cases || []).forEach(function (c) { casesById[c.id] = c; });
  function getCase(id) { return casesById[id] || null; }
  /* Версия дела по ступени чтения профиля (ученик может выбрать другую). */
  function caseVersionFor(profile, c) {
    var st = profile && profile.stages ? profile.stages.reading : 0;
    return c.versions.filter(function (v) { return v.stage === st; })[0] || c.versions[0];
  }
  /* Задание сцены вместе с лесенкой подсказок сцены. */
  function caseSceneTask(scene) {
    return Object.assign({}, scene.task, { hints: scene.hints });
  }

  function getReview(id) {
    var item = reviewItems[id];
    if (item) return { task: item, text: null, skill: item.skill, source: item.source };
    if (id.indexOf('q|') === 0) {
      var q = id.split('|');
      var c = casesById[q[1]];
      var v = c && c.versions.filter(function (x) { return x.stage === Number(q[2]); })[0];
      var sc = v && v.scenes[Number(q[3])];
      if (!sc) return null;
      return { task: caseSceneTask(sc), text: { title: sc.clue.label, lines: sc.clue.lines, glossary: sc.clue.glossary, sign: sc.clue.sign },
        skill: 'reading', source: 'case:' + c.id };
    }
    if (id.indexOf('m|') !== 0) return null;
    var p = id.split('|');
    var lesson = lessonsById[p[1]];
    if (!lesson) return null;
    var ctx = lesson.contexts[p[2]];
    var idx = Number(p[4]);
    var task = p[3] === 'warmup' ? lesson.warmup : p[3] === 'core' ? lesson.tasks[idx]
      : p[3] === 'challenge' ? (challengeItems(lesson)[idx] || {}).task : (ctx && ctx.tasks[idx]);
    if (!task || task.type === 'match') return null;
    return { task: task, text: p[3] === 'context' && ctx ? ctx.text : null, skill: lesson.skill, source: lesson.id };
  }

  function dueReviewIds(profile, now, limit, exclude, excludeSource) {
    exclude = exclude || [];
    var ids = Object.keys(profile.reviews || {}).filter(function (id) {
      var r = profile.reviews[id];
      var item = getReview(id);
      return item && r.due <= now && exclude.indexOf(id) === -1 && (!excludeSource || item.source !== excludeSource);
    });
    // Сначала самые просроченные, затем те, где были ошибки
    ids.sort(function (a, b) {
      var ra = profile.reviews[a], rb = profile.reviews[b];
      if (ra.due !== rb.due) return ra.due - rb.due;
      return (rb.wrong || 0) - (ra.wrong || 0);
    });
    return typeof limit === 'number' ? ids.slice(0, limit) : ids;
  }

  function countDue(profile, now) { return dueReviewIds(profile, now).length; }

  function scheduleReview(profile, id, now) {
    if (!profile.reviews[id]) {
      profile.reviews[id] = { box: 0, due: now + S.reviewIntervalsDays[0] * DAY, added: now, correct: 0, wrong: 0, lastAt: null };
    }
  }

  /* Ошибка в уроке: задание вернётся в повторение через первый интервал (по умолчанию завтра). */
  function scheduleMistake(profile, lessonId, ctxKey, phase, idx, now) {
    var id = ['m', lessonId, ctxKey, phase, idx].join('|');
    if (!getReview(id)) return null;
    var r = profile.reviews[id];
    if (!r) profile.reviews[id] = { box: 0, due: now + S.reviewIntervalsDays[0] * DAY, added: now, correct: 0, wrong: 1, lastAt: now };
    else { r.box = 0; r.due = now + S.reviewIntervalsDays[0] * DAY; r.wrong = (r.wrong || 0) + 1; r.lastAt = now; }
    return id;
  }

  /* Ошибка в деле: задание сцены вернётся в повторение. */
  function scheduleCaseMistake(profile, caseId, stage, idx, now) {
    var id = ['q', caseId, stage, idx].join('|');
    if (!getReview(id)) return null;
    var r = profile.reviews[id];
    if (!r) profile.reviews[id] = { box: 0, due: now + S.reviewIntervalsDays[0] * DAY, added: now, correct: 0, wrong: 1, lastAt: now };
    else { r.box = 0; r.due = now + S.reviewIntervalsDays[0] * DAY; r.wrong = (r.wrong || 0) + 1; r.lastAt = now; }
    return id;
  }

  /* Результат повторения: верно -> следующий интервал, неверно -> снова через 1 день. */
  function applyReview(profile, id, ok, now) {
    var r = profile.reviews[id];
    if (!r) { scheduleReview(profile, id, now); r = profile.reviews[id]; }
    var intervals = S.reviewIntervalsDays;
    if (ok) {
      r.box = Math.min(r.box + 1, intervals.length - 1);
      r.correct = (r.correct || 0) + 1;
      r.due = now + intervals[r.box] * DAY;
    } else {
      r.box = 0;
      r.wrong = (r.wrong || 0) + 1;
      r.due = now + intervals[0] * DAY;
    }
    r.lastAt = now;
    var item = getReview(id);
    profile.reviewLog = profile.reviewLog || [];
    profile.reviewLog.push({ id: id, skill: item ? item.skill : null, source: item ? item.source : null, ok: ok, at: now });
    if (profile.reviewLog.length > 300) profile.reviewLog = profile.reviewLog.slice(-300);
  }

  function addMistake(profile, m) {
    profile.mistakes = profile.mistakes || [];
    profile.mistakes.unshift(m);
    if (profile.mistakes.length > S.mistakesKept) profile.mistakes.length = S.mistakesKept;
  }

  // ---------- Сборка урока
  /*
   * Шаги: разминка (вспоминание) -> до N повторов -> введение -> основные задания
   * (узнавание -> вспоминание -> применение) -> текст -> задания по тексту.
   */
  /*
   * Ступень сложности задания: 'base' (по умолчанию) или 'challenge' — только если у урока есть вызов.
   * Не связана с уровнем языка (ступенью профиля) и с интересом.
   */
  function challengeFor(lesson) { return (FEA.lessonChallenges || {})[lesson.id] || null; }
  function challengeItems(lesson) {
    var ch = challengeFor(lesson);
    if (!ch) return [];
    var items = Object.keys(ch.replaces || {}).sort(function (a, b) { return a - b; }).map(function (k) { return { replaces: Number(k), task: ch.replaces[k] }; });
    return items.concat((ch.add || []).map(function (t) { return { replaces: null, task: t }; }));
  }
  function tierFor(lesson, tier) { return tier === 'challenge' && challengeFor(lesson) ? 'challenge' : 'base'; }

  function buildLessonSteps(lesson, ctxKey, profile, now, tier) {
    var ctx = contextFor(lesson, ctxKey).ctx;
    tier = tierFor(lesson, tier);
    var items = tier === 'challenge' ? challengeItems(lesson) : [];
    var own = (lesson.review || []).map(function (r) { return r.id; });
    var steps = [];
    steps.push({ kind: 'mission' });
    steps.push({ kind: 'task', phase: 'warmup', task: lesson.warmup, idx: 0 });
    // Повторы из других уроков (не из этого же — чтобы не подсказывать ответы)
    dueReviewIds(profile, now, S.reviewsInLesson, own, lesson.id).forEach(function (id) {
      var r = getReview(id);
      steps.push({ kind: 'task', phase: 'review', task: r.task, text: r.text, reviewId: id });
    });
    if (lesson.story) steps.push({ kind: 'story', story: lesson.story });
    steps.push({ kind: 'intro' });
    lesson.tasks.forEach(function (t, i) {
      var j = -1;
      items.forEach(function (it, k) { if (it.replaces === i) j = k; });
      if (j !== -1) steps.push({ kind: 'task', phase: 'challenge', task: items[j].task, idx: j });
      else steps.push({ kind: 'task', phase: 'core', task: t, idx: i, hint: lesson.hints ? lesson.hints[i] : null });
    });
    items.forEach(function (it, k) { if (it.replaces === null) steps.push({ kind: 'task', phase: 'challenge', task: it.task, idx: k }); });
    steps.push({ kind: 'text', text: ctx.text });
    ctx.tasks.forEach(function (t, i) {
      steps.push({ kind: 'task', phase: 'context', task: t, text: ctx.text, idx: i });
    });
    return steps;
  }

  /*
   * Тренировка пройденного без записи: заранее написанные вопросы повторения из пройденных уроков
   * (слова и конструкции). Расписание повторения, ошибки и прогресс не меняются.
   */
  function buildPracticeSteps(profile, size) {
    var ids = [];
    Object.keys(profile.lessons || {}).forEach(function (id) {
      var l = lessonsById[id];
      if (l) (l.review || []).forEach(function (r) { ids.push(r.id); });
    });
    return shuffle(ids).slice(0, size || 6).map(function (id) {
      var r = getReview(id);
      return { kind: 'task', phase: 'practice', task: r.task, text: r.text, practice: true };
    });
  }

  function buildReviewSteps(profile, now) {
    return dueReviewIds(profile, now, S.reviewSessionSize).map(function (id) {
      var r = getReview(id);
      return { kind: 'task', phase: 'review', task: r.task, text: r.text, reviewId: id };
    });
  }

  /* Пары для сопоставления: новые слова урока (ядро + тематические). */
  function matchPairs(lesson, ctxKey) {
    var w = lessonWords(lesson, ctxKey);
    return w.core.concat(w.theme).slice(0, 5).map(function (x) { return { en: x.en, kk: x.kk }; });
  }

  /*
   * Завершение урока. results: [{phase, ok, task, answer, reviewId}]
   * Точность считается только по основным заданиям и заданиям по тексту.
   */
  function completeLesson(profile, lesson, ctxKey, results, now, tier) {
    var scored = results.filter(function (r) { return r.phase === 'core' || r.phase === 'context' || r.phase === 'challenge'; });
    var ok = scored.filter(function (r) { return r.ok; }).length;
    var acc = scored.length ? ok / scored.length : 0;
    var rec = profile.lessons[lesson.id] || { times: 0, bestAccuracy: 0, contextsUsed: [] };
    rec.times += 1;
    rec.completedAt = new Date(now).toISOString();
    rec.completedAtMs = now;
    rec.lastAccuracy = acc;
    rec.bestAccuracy = Math.max(rec.bestAccuracy || 0, acc);
    if (rec.contextsUsed.indexOf(ctxKey) === -1) rec.contextsUsed.push(ctxKey);
    // Какая ступень задания была в последний раз (на уровень профиля не влияет)
    rec.lastTier = tierFor(lesson, tier);
    if (rec.lastTier === 'challenge') rec.challengeDone = true;
    profile.lessons[lesson.id] = rec;
    (lesson.review || []).forEach(function (r) { scheduleReview(profile, r.id, now); });
    return { correct: ok, total: scored.length, accuracy: acc };
  }

  // ---------- Рекомендация
  function completedCount(profile, skill) {
    return Object.keys(profile.lessons).filter(function (id) {
      var l = lessonsById[id]; return l && l.skill === skill;
    }).length;
  }

  function recommendNext(profile, now) {
    var candidates = SKILL_ORDER.map(function (skill) {
      return nextLessonFor(profile, skill);
    }).filter(Boolean);

    if (candidates.length) {
      candidates.sort(function (a, b) {
        var d = completedCount(profile, a.skill) - completedCount(profile, b.skill);
        return d !== 0 ? d : SKILL_ORDER.indexOf(a.skill) - SKILL_ORDER.indexOf(b.skill);
      });
      return { kind: 'lesson', lesson: candidates[0] };
    }
    if (countDue(profile, now) > 0) return { kind: 'review' };
    return { kind: 'allDone' };
  }

  // ---------- Предложение сменить ступень (никогда не применяется автоматически)
  /*
   * Предложение учитывает ВСЕ уроки ступени по навыку. Повышение предлагается,
   * только когда все они пройдены хорошо и после этого были верные повторения.
   */
  function stageProposal(profile, skill) {
    var stage = profile.stages[skill];
    var list = lessonsAt(stage, skill);
    if (!list.length) return null;
    var recs = list.map(function (l) { return profile.lessons[l.id]; }).filter(Boolean);
    if (!recs.length) return null;
    var latest = recs.slice().sort(function (a, b) { return (b.completedAtMs || 0) - (a.completedAtMs || 0); })[0];
    var hasNext = lessonsAt(stage + 1, skill).length > 0;
    if (latest.lastAccuracy <= S.proposeDownMaxAccuracy && stage > 0) {
      return { dir: 'down', text: 'Бұл саты әзірге қиындау болуы мүмкін. Сабақты басқа мәтінмен қайталауға немесе жеңілірек сатыға ауысуға болады.' };
    }
    if (recs.length < list.length) {
      return { dir: 'info', text: 'Осы сатыдағы сабақтар: ' + recs.length + ' / ' + list.length + ' өтілді.' };
    }
    var avg = recs.reduce(function (sum, r) { return sum + (r.bestAccuracy || 0); }, 0) / recs.length;
    var after = (profile.reviewLog || []).filter(function (e) {
      return e.skill === skill && e.ok && e.source !== 'diagnostic' && e.at > (latest.completedAtMs || 0);
    }).length;
    if (avg >= S.proposeUpMinAccuracy && after >= S.proposeUpMinLaterReviews && hasNext) {
      return { dir: 'up', text: 'Осы сатыдағы сабақтар жақсы өтті және кейінгі қайталауларда да есіңізде қалды. Келесі сатыны байқап көруге болады.' };
    }
    if (avg >= S.proposeUpMinAccuracy && hasNext) {
      return { dir: 'wait', text: 'Сабақтар жақсы өтті. Келесі сатыны ұсыну үшін алдымен бірнеше күннен кейін қайталауды орындаңыз — бұл есте сақталғанын көрсетеді.' };
    }
    return null;
  }

  /* Для отчёта и интерфейса: в каких уроках есть текст для каждой темы. */
  function interestCoverage() {
    var out = {};
    FEA.lessons.slice().sort(byOrder).forEach(function (l) {
      Object.keys(l.contexts).forEach(function (k) { (out[k] = out[k] || []).push(l.id); });
    });
    return out;
  }

  // ---------- Диагностика
  function diagStage(correctCount) {
    var map = S.diagScoreToStage;
    return map[Math.max(0, Math.min(correctCount, map.length - 1))];
  }

  return {
    SKILL_ORDER: SKILL_ORDER,
    DAY: DAY,
    getLesson: getLesson,
    lessonFor: lessonFor,
    lessonsAt: lessonsAt,
    nextLessonFor: nextLessonFor,
    contextFor: contextFor,
    missionFor: missionFor,
    getCase: getCase,
    caseVersionFor: caseVersionFor,
    caseSceneTask: caseSceneTask,
    scheduleCaseMistake: scheduleCaseMistake,
    getReview: getReview,
    scheduleMistake: scheduleMistake,
    interestCoverage: interestCoverage,
    lessonsForSkill: lessonsForSkill,
    reviewItems: reviewItems,
    normalize: normalize,
    shuffledOptions: shuffledOptions,
    shuffledWords: shuffledWords,
    shuffle: shuffle,
    hasCyrillic: hasCyrillic,
    checkTyped: checkTyped,
    isNearMiss: isNearMiss,
    checkOrder: checkOrder,
    contextKeyFor: contextKeyFor,
    profileInterests: profileInterests,
    hasInterestChoice: hasInterestChoice,
    cleanInterest: cleanInterest,
    directionMeta: directionMeta,
    pickVariant: pickVariant,
    lessonVariants: lessonVariants,
    challengeFor: challengeFor,
    challengeItems: challengeItems,
    tierFor: tierFor,
    buildPracticeSteps: buildPracticeSteps,
    directionStats: directionStats,
    worldsFor: worldsFor,
    worldMeta: worldMeta,
    buildDictionary: buildDictionary,
    variantLabel: variantLabel,
    isActionVariant: isActionVariant,
    lessonWords: lessonWords,
    dueReviewIds: dueReviewIds,
    countDue: countDue,
    scheduleReview: scheduleReview,
    applyReview: applyReview,
    addMistake: addMistake,
    buildLessonSteps: buildLessonSteps,
    buildReviewSteps: buildReviewSteps,
    matchPairs: matchPairs,
    completeLesson: completeLesson,
    recommendNext: recommendNext,
    stageProposal: stageProposal,
    diagStage: diagStage
  };
})();
