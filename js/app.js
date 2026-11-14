/*
 * Экраны приложения. Вся логика обучения — в engine.js, данные — в js/content/.
 */
(function () {
  var h = FEA.ui.h;
  var E = FEA.engine;
  var store = FEA.storage;
  var root = document.getElementById('app');

  var state = store.load();
  var route = { name: 'boot', params: {} };

  // ------------------------------------------------------------ состояние
  function profile() { return state.activeProfileId ? state.profiles[state.activeProfileId] : null; }
  function persist() { store.save(state); }
  function now() { return Date.now(); }
  function skillMeta(id) { return FEA.skills.filter(function (s) { return s.id === id; })[0]; }
  function stageMeta(id) { return FEA.stages[id]; }
  /* Короткое описание выбранных направлений: «Тергеу және жұмбақтар, Музыка…» или null. */
  function interestsSummary(p) {
    var list = E.profileInterests(p);
    if (list === null) return null;
    if (!list.length) return 'Қызығушылық таңдалмаған — жалпы нұсқалар';
    return list.map(function (it) {
      if (it.id === 'custom') return 'Өз тақырыбым' + (it.custom ? ' «' + it.custom + '»' : '');
      return E.directionMeta(it.id).title;
    }).join(', ');
  }

  function go(name, params) {
    if (name !== 'dictionary' && typeof dict !== 'undefined') dict.review = null;
    route = { name: name, params: params || {} };
    render();
    window.scrollTo(0, 0);
  }

  function startRoute() {
    var p = profile();
    if (!p) return Object.keys(state.profiles).length ? 'profiles' : 'welcome';
    if (!E.hasInterestChoice(p)) return 'interest';
    if (!p.stages || !p.diagnostic) return 'diagIntro';
    return 'home';
  }

  // ------------------------------------------------------------ общие элементы
  /*
   * Собственная графика: монограмма-лупа и линейные иконки (шаг линии 1.75, currentColor).
   * Эмодзи в интерфейсе не используются; они остаются только в учебном контенте, где помогают понять слово.
   */
  var LOGO_SVG =
    '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
    '<rect x="3" y="3" width="34" height="34" rx="9" fill="var(--action)"/>' +
    '<text x="20" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="800" fill="var(--on-action)">Aa</text>' +
    '</svg>';

  var ICONS = {
    home: '<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
    skills: '<path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z"/>',
    progress: '<path d="M4 20h16M7 16v-4M12 16V8M17 16v-7"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
    arrow: '<path d="M5 12h13M13 7l5 5-5 5"/>',
    check: '<path d="M5 12.5 10 17l9-10"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    hint: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    review: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4"/>',
    save: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    doc: '<path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5"/>',
    words: '<path d="M4 18 8.5 6 13 18M5.6 14h5.8M15 18v-6.5M15 12.5c0-1.4 1-2.5 2.5-2.5S20 11 20 12.5V18"/>',
    grammar: '<path d="M8 5H5v14h3M16 5h3v14h-3M10 12h4"/>',
    reading: '<path d="M3 6c3-1.5 6-1.5 9 0v13c-3-1.5-6-1.5-9 0zM21 6c-3-1.5-6-1.5-9 0v13c3-1.5 6-1.5 9 0z"/>',
    lessons: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
    dictionary: '<path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2z"/><path d="M6 18a2 2 0 0 1 2-2h10M10 8h4M10 11h4"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    pin: '<path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>'
  };
  function icon(name, cls) {
    return h('span', { class: 'ico' + (cls ? ' ' + cls : ''), 'aria-hidden': 'true',
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false">' + ICONS[name] + '</svg>' });
  }

  var NAV = [['home', 'Басты бет', 'home'], ['skills', 'Сабақтар', 'lessons'], ['dictionary', 'Сөздік', 'dictionary'], ['progress', 'Прогресс', 'progress']];

  function topbar(active) {
    var p = profile();
    return h('header', { class: 'topbar' },
      h('div', { class: 'topbar-inner' },
        h('div', { class: 'brand' }, h('span', { class: 'brand-mark', html: LOGO_SVG }),
          h('span', { class: 'brand-text' }, h('span', { class: 'brand-name' }, 'Отбасылық ағылшын'))),
        active ? h('nav', { class: 'top-nav', 'aria-label': 'Негізгі мәзір' }, NAV.map(function (n) {
          return h('button', { class: 'top-nav-item' + (active === n[0] ? ' active' : ''), 'aria-current': active === n[0] ? 'page' : null, onclick: function () { go(n[0]); } }, n[1]);
        })) : null,
        p ? h('button', { class: 'chip-profile', onclick: function () {
          // Пока настройка профиля не закончена, кнопка ведёт к списку профилей (можно выбрать другой)
          go(E.hasInterestChoice(p) && p.stages && p.diagnostic ? 'progress' : 'profiles');
        }, 'aria-label': 'Профиль: ' + p.name + '. Профиль және баптаулар' },
          h('span', { class: 'chip-initial', 'aria-hidden': 'true' }, String(p.name).trim().charAt(0).toUpperCase()),
          h('span', { class: 'chip-name' }, p.name)) : null));
  }

  function bottomNav(active) {
    return h('nav', { class: 'bottom-nav', 'aria-label': 'Негізгі мәзір' }, NAV.map(function (n) {
      return h('button', { class: 'nav-item' + (active === n[0] ? ' active' : ''), onclick: function () { go(n[0]); }, 'aria-current': active === n[0] ? 'page' : null },
        icon(n[2], 'nav-icon'), h('span', null, n[1]));
    }));
  }

  function storageBanner() {
    if (store.isAvailable()) return null;
    return h('div', { class: 'banner banner-warn', role: 'status' },
      'Бұл браузерде деректерді сақтау мүмкін емес. Беттің жабылуымен прогресс жоғалады.');
  }

  function page(children, navActive) {
    return [topbar(navActive), storageBanner(), h('main', { class: 'page' + (navActive ? ' page-' + navActive : '') }, children), navActive ? bottomNav(navActive) : null];
  }

  function stageLabel(stageId) {
    var s = stageMeta(stageId);
    return s ? s.title : '';
  }

  // ------------------------------------------------------------ задания
  /*
   * Универсальный показ задания (диагностика, урок, повторение, история, дело).
   * opts: { onResult(firstTryOk, answerText, info), onNext, nextLabel, text, dontKnow, wrongNote,
   *         ladder, hint, lesson, ctxKey }
   * ladder: лесенка подсказок — 1) наводящий вопрос, 2) правило / нужная часть, 3) каркас ответа,
   *         4) решение. Решение показывается только после попытки ученика, сделанной ПОСЛЕ третьей подсказки.
   *         В диагностике лесенки нет: одна попытка.
   * В точность идёт только первая попытка без подсказок; иначе задание уходит в повторение.
   */
  function genericHint(task, opts) {
    if (opts.text || task.text || task.sign) return 'Жауап мәтінде бар. Сұрақтағы негізгі сөзді мәтіннен тауып, сол сөйлемді қайта оқыңыз.';
    if (task.type === 'order') return 'Ағылшын сөйлемі көбіне «кім — не істейді — қалғаны» ретімен құрылады.';
    if (task.type === 'type' && task.sentence) return 'Сөйлемге қайта қараңыз: кім туралы айтылған және әрекет қашан болған?';
    if (task.type === 'type') return 'Сабақтағы жаңа сөздерді еске түсіріп, жазылуын тексеріңіз.';
    return 'Сұрақты қайта оқыңыз: онда не сұралып тұр — кім, не, қашан?';
  }

  function guidingQuestion(task, opts) {
    if (opts.text || task.text || task.sign) return 'Сұрақтағы ең маңызды сөз қайсы? Оны мәтіннен іздеңіз.';
    if (task.type === 'order') return 'Сөйлем кім туралы? Сол сөзден бастап көріңіз.';
    if (task.type === 'type') return 'Бұл жерде қандай сөз керек: зат па, әрекет пе, әлде сипаттама ма?';
    return 'Әр нұсқаны сұрақпен салыстырыңыз: қайсысы толық сәйкес келеді?';
  }

  /* Каркас ответа: показывает форму, но не сам ответ. */
  function autoScaffold(task) {
    if (task.type === 'type') {
      var a = task.answers[0];
      return 'Жауаптың пішіні: ' + a.split(' ').map(function (w) { return w.charAt(0) + w.slice(1).replace(/[a-z]/gi, '_'); }).join('  ') + ' (' + a.split(' ').length + ' сөз)';
    }
    if (task.type === 'order') return 'Сөйлем «' + task.answer.split(' ')[0] + '» сөзінен басталады.';
    return 'Бір қате нұсқаны алып тастадық. Енді таңдау оңайырақ.';
  }

  function buildLadder(task, opts) {
    var hs = task.hints || [];
    return [
      { label: '1-кеңес · сұрақ', text: hs[0] || guidingQuestion(task, opts) },
      { label: '2-кеңес · ереже', text: hs[1] || opts.hint || task.hint || genericHint(task, opts) },
      { label: '3-кеңес · жауаптың қаңқасы', text: hs[2] || autoScaffold(task), scaffold: true }
    ];
  }

  function taskView(task, opts) {
    var answered = false;
    var attempts = 0;
    var level = 0;                 // сколько подсказок открыто
    var attemptsAtLevel3 = 0;      // попытки после третьей подсказки
    var ladder = opts.ladder ? buildLadder(task, opts) : null;
    var feedback = h('div', { class: 'feedback-slot', 'aria-live': 'polite' });
    var hintList = h('ol', { class: 'hint-ladder hidden', 'aria-live': 'polite' });
    var hintBtn = ladder ? h('button', { class: 'btn btn-ghost btn-small hint-btn' }, icon('hint'), 'Кеңес керек') : null;
    var retryNote = h('p', { class: 'retry-note hidden', role: 'status' });
    var nextBtn = h('button', { class: 'btn btn-primary btn-block hidden', onclick: function () { opts.onNext(); } }, opts.nextLabel || 'Келесі →');
    var api = { attempt: attempt, complete: complete, onScaffold: null };

    function openHint() {
      if (!ladder || level >= ladder.length) return;
      var step = ladder[level];
      level++;
      hintList.classList.remove('hidden');
      hintList.appendChild(h('li', { class: 'hint-step' }, h('span', { class: 'hint-label' }, step.label), h('span', null, step.text)));
      if (step.scaffold && api.onScaffold) api.onScaffold();
      if (level >= ladder.length && hintBtn) { hintBtn.disabled = true; hintBtn.textContent = 'Барлық кеңес ашылды'; }
    }
    if (hintBtn) hintBtn.addEventListener('click', openHint);

    function complete(firstTryOk, finalOk, answerText, correctText) {
      if (answered) return;
      answered = true;
      retryNote.classList.add('hidden');
      if (hintBtn) hintBtn.classList.add('hidden');
      opts.onResult(firstTryOk, answerText, { final: finalOk, attempts: attempts, hints: level });
      var head = finalOk ? (firstTryOk ? '✓ Дұрыс!' : '✓ Дұрыс! Кеңеспен өзіңіз таптыңыз.') : 'Шешімін бірге қарайық';
      feedback.appendChild(h('div', { class: 'feedback ' + (finalOk ? 'feedback-ok' : 'feedback-solution') },
        h('div', { class: 'feedback-head' }, head),
        !finalOk && correctText ? h('div', { class: 'feedback-answer' }, 'Шешімі: ', h('strong', { lang: 'en' }, correctText)) : null,
        task.outcomes && task.outcomes[task.answer] ? h('p', { class: 'feedback-outcome' }, h('strong', null, 'Нәтиже: '), task.outcomes[task.answer]) : null,
        task.explain ? h('p', { class: 'feedback-explain' }, task.explain) : null,
        !firstTryOk ? h('p', { class: 'feedback-note' }, finalOk ? 'Бұл тапсырма бекіту үшін кейін тағы бір рет шығады. Прогресс сақталды.' : (opts.wrongNote || 'Бұл тақырып кейін қайталауға қосылады. Прогресс сақталды.')) : null
      ));
      nextBtn.classList.remove('hidden');
      nextBtn.focus();
    }

    /* Попытка ответа. Возвращает true, если ученик отвечает ещё раз. */
    function attempt(ok, answerText, correctText) {
      if (answered) return false;
      attempts++;
      if (ok) { complete(attempts === 1 && level === 0, true, answerText, correctText); return false; }
      if (!ladder) { complete(false, false, answerText, correctText); return false; }
      if (level < ladder.length) {
        openHint();
        retryNote.textContent = (api.lastOutcome ? 'Салдары: ' + api.lastOutcome + ' ' : '') + 'Әлі емес — бұл қалыпты. Кеңесті оқып, тағы бір рет байқап көріңіз.';
        api.lastOutcome = null;
        retryNote.classList.remove('hidden');
        return true;
      }
      attemptsAtLevel3++;
      if (attemptsAtLevel3 < 1) return true;
      complete(false, false, answerText, correctText);
      return false;
    }

    var body;
    if (task.type === 'choice') body = choiceBody(task, api, opts);
    else if (task.type === 'type') body = typeBody(task, api);
    else if (task.type === 'order') body = orderBody(task, api);
    else if (task.type === 'match') body = matchBody(task, api, opts);
    else body = h('p', null, 'Белгісіз тапсырма түрі.');

    return h('section', { class: 'task' },
      opts.text ? textCard(opts.text, true) : null,
      h('h2', { class: 'task-prompt' }, task.prompt),
      taskMaterial(task),
      body,
      retryNote,
      hintList,
      hintBtn && task.type !== 'match' ? h('div', { class: 'hint-row' }, hintBtn) : null,
      feedback,
      nextBtn
    );
  }

  function taskMaterial(task) {
    return [
      task.visual ? h('div', { class: 'visual', 'aria-hidden': 'true' }, task.visual) : null,
      task.sign ? h('div', { class: 'sign', lang: 'en' }, task.sign.map(function (l) { return h('div', null, l); })) : null,
      task.text ? h('blockquote', { class: 'mini-text', lang: 'en' }, task.text.map(function (l) { return h('p', null, l); })) : null,
      task.sentence ? h('p', { class: 'sentence', lang: 'en' }, task.sentence) : null,
      task.glossary ? glossary(task.glossary) : null
    ];
  }

  function glossary(items) {
    if (!items || !items.length) return null;
    return h('div', { class: 'glossary' },
      h('span', { class: 'glossary-label' }, 'Сөздік:'),
      items.map(function (g) { return h('span', { class: 'gloss' }, h('span', { lang: 'en' }, g.en), ' — ', g.kk); }));
  }

  function choiceBody(task, api, opts) {
    var opts2 = E.shuffledOptions(task);
    var buttons = [];
    var correctText = task.options[task.answer];
    var wrap = h('div', { class: 'options' });
    function lockAll() {
      buttons.forEach(function (x, i) { x.disabled = true; if (opts2[i].correct) x.classList.add('is-correct'); });
      if (dk) dk.disabled = true;
    }
    opts2.forEach(function (o) {
      var b = h('button', { class: 'option', lang: /[a-z]/i.test(o.text) && !/[а-яәіңғүұқөһ]/i.test(o.text) ? 'en' : null }, o.text);
      b.addEventListener('click', function () {
        if (o.correct) { lockAll(); api.attempt(true, o.text, correctText); return; }
        b.classList.add('is-wrong'); b.disabled = true; b.setAttribute('aria-label', o.text + ' — сәйкес емес');
        var oi = task.options.indexOf(o.text);
        api.lastOutcome = task.outcomes && task.outcomes[oi] ? task.outcomes[oi] : null;
        if (!api.attempt(false, o.text, correctText)) lockAll();
      });
      buttons.push(b);
      wrap.appendChild(b);
    });
    // Каркас: убрать ещё один неверный вариант, если он остался
    api.onScaffold = function () {
      for (var i = 0; i < buttons.length; i++) {
        if (!opts2[i].correct && !buttons[i].disabled) { buttons[i].disabled = true; buttons[i].classList.add('is-eliminated'); return; }
      }
    };
    var dk = opts.dontKnow ? h('button', { class: 'btn btn-ghost btn-small', onclick: function () {
      lockAll();
      api.complete(false, false, '(білмеймін)', correctText);
    } }, 'Білмеймін') : null;
    return [wrap, dk ? h('div', { class: 'dk-row' }, dk) : null];
  }

  function typeBody(task, api) {
    var input = h('input', { class: 'text-input', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', lang: 'en', 'aria-label': 'Жауабыңыз', placeholder: task.sentence && task.sentence.indexOf('___') !== -1 ? 'Бос орынға келетін сөзді жазыңыз…' : 'Жауапты жазыңыз…' });
    var check = h('button', { class: 'btn btn-primary', disabled: true }, 'Тексеру');
    var dk = h('button', { class: 'btn btn-ghost' }, 'Білмеймін');
    var layoutHint = h('p', { class: 'type-hint hidden', role: 'status' }, 'Ағылшын әріптерімен жазыңыз');
    var nearMissUsed = false;
    function showHint(text) {
      layoutHint.textContent = text;
      layoutHint.classList.remove('hidden');
      input.classList.add('is-hint');
      input.focus();
    }
    function lock(ok) {
      input.disabled = true; check.disabled = true; dk.disabled = true;
      input.classList.remove('is-hint');
      input.classList.remove('is-retry');
      input.classList.add(ok ? 'is-correct' : 'is-solution');
    }
    function submit() {
      if (!input.value.trim() || input.disabled) return;
      // Кириллица в английском ответе — это раскладка, а не ошибка: подсказка и новая попытка
      if (E.hasCyrillic(input.value)) { showHint('Ағылшын әріптерімен жазыңыз'); return; }
      var ok = E.checkTyped(task, input.value);
      // Опечатка в одну букву в слове: одна дополнительная попытка, без записи ошибки
      if (!ok && !nearMissUsed && E.isNearMiss(task, input.value)) {
        nearMissUsed = true;
        showHint('Дұрысқа жақын. Жазылуын тексеріп, қайта жазыңыз.');
        return;
      }
      layoutHint.classList.add('hidden');
      if (ok) { lock(true); api.attempt(true, input.value, task.answers[0]); return; }
      if (api.attempt(false, input.value, task.answers[0])) {
        input.classList.add('is-retry');
        input.select();
        input.focus();
      } else lock(false);
    }
    input.addEventListener('input', function () {
      check.disabled = !input.value.trim();
      layoutHint.classList.add('hidden');
      input.classList.remove('is-hint');
      input.classList.remove('is-retry');
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    check.addEventListener('click', submit);
    dk.addEventListener('click', function () {
      lock(false);
      api.complete(false, false, '(білмеймін)', task.answers[0]);
    });
    setTimeout(function () { input.focus(); }, 30);
    return h('div', { class: 'type-row' }, input, layoutHint, h('div', { class: 'row-gap' }, check, dk));
  }

  function orderBody(task, api) {
    var bank = E.shuffledWords(task);
    var chosen = [];
    var line = h('div', { class: 'order-line', 'aria-label': 'Сіздің сөйлеміңіз' });
    var pool = h('div', { class: 'order-pool' });
    var check = h('button', { class: 'btn btn-primary', disabled: true }, 'Тексеру');
    var reset = h('button', { class: 'btn btn-ghost' }, 'Қайта бастау');
    var done = false;

    function draw() {
      line.innerHTML = ''; pool.innerHTML = '';
      if (!chosen.length) line.appendChild(h('span', { class: 'placeholder' }, 'Сөздерді ретімен басыңыз'));
      chosen.forEach(function (w, i) {
        line.appendChild(h('button', { class: 'token token-chosen', lang: 'en', disabled: done, onclick: function () {
          bank.push(chosen.splice(i, 1)[0]); draw();
        } }, w));
      });
      bank.forEach(function (w, i) {
        pool.appendChild(h('button', { class: 'token', lang: 'en', disabled: done, onclick: function () {
          line.classList.remove('is-retry');
          chosen.push(bank.splice(i, 1)[0]); draw();
        } }, w));
      });
      check.disabled = done || bank.length > 0;
    }
    check.addEventListener('click', function () {
      var ok = E.checkOrder(task, chosen);
      var given = chosen.join(' ');
      if (ok) { done = true; line.classList.add('is-correct'); reset.disabled = true; draw(); api.attempt(true, given, task.answer); return; }
      if (api.attempt(false, given, task.answer)) {
        bank = bank.concat(chosen); chosen = [];
        if (scaffolded) { chosen = [first]; bank.splice(bank.indexOf(first), 1); }
        line.classList.add('is-retry'); draw();
      } else {
        done = true; line.classList.add('is-solution'); reset.disabled = true; draw();
      }
    });
    // Каркас: первое слово ставится на место
    var first = task.answer.split(' ')[0], scaffolded = false;
    api.onScaffold = function () {
      scaffolded = true;
      bank = bank.concat(chosen); chosen = [first]; bank.splice(bank.indexOf(first), 1); draw();
    };
    reset.addEventListener('click', function () {
      bank = bank.concat(chosen); chosen = [];
      if (scaffolded) { chosen = [first]; bank.splice(bank.indexOf(first), 1); }
      draw();
    });
    draw();
    return h('div', { class: 'order' }, line, pool, h('div', { class: 'row-gap' }, check, reset));
  }

  function matchBody(task, api, opts) {
    var pairs = E.matchPairs(opts.lesson, opts.ctxKey);
    var left = E.shuffle(pairs), right = E.shuffle(pairs);
    var selected = null, matched = 0, mistakes = 0;
    var leftBtns = [], rightBtns = [];
    var status = h('p', { class: 'muted small' }, 'Алдымен ағылшын сөзін, содан кейін оның мағынасын басыңыз.');

    function clearSel() { leftBtns.forEach(function (b) { b.classList.remove('selected'); }); selected = null; }

    var lcol = h('div', { class: 'match-col' });
    var rcol = h('div', { class: 'match-col' });
    left.forEach(function (p) {
      var b = h('button', { class: 'token match-item', lang: 'en' }, p.en);
      b.addEventListener('click', function () { clearSel(); selected = { pair: p, btn: b }; b.classList.add('selected'); });
      leftBtns.push(b); lcol.appendChild(b);
    });
    right.forEach(function (p) {
      var b = h('button', { class: 'token match-item' }, p.kk);
      b.addEventListener('click', function () {
        if (!selected) { status.textContent = 'Алдымен сол жақтағы ағылшын сөзін таңдаңыз.'; return; }
        if (selected.pair.en === p.en) {
          selected.btn.disabled = true; selected.btn.classList.add('is-correct');
          b.disabled = true; b.classList.add('is-correct');
          matched++; clearSel();
          status.textContent = 'Жарайсыз! Қалғанын да сәйкестендіріңіз.';
          if (matched === pairs.length) api.complete(mistakes === 0, true, '', '');
        } else {
          mistakes++;
          b.classList.add('shake');
          setTimeout(function () { b.classList.remove('shake'); }, 400);
          status.textContent = 'Бұл жұп емес. Тағы байқап көріңіз.';
        }
      });
      rightBtns.push(b); rcol.appendChild(b);
    });
    return [h('div', { class: 'match' }, lcol, rcol), status];
  }

  function textCard(text, compact) {
    var inner = [
      h('div', { class: 'text-label' }, 'Сабаққа арнайы жазылған ойдан шығарылған мәтін'),
      h('h3', { class: 'text-title', lang: 'en' }, text.title),
      h('div', { class: text.sign ? 'sign' : 'reading', lang: 'en' }, text.lines.map(function (l) { return h(text.sign ? 'div' : 'p', null, l); })),
      glossary(text.glossary)
    ];
    if (compact) {
      return h('details', { class: 'text-card compact', open: true }, h('summary', null, 'Мәтін'), inner);
    }
    return h('div', { class: 'text-card' }, inner);
  }

  // ------------------------------------------------------------ ПРИВЕТСТВИЕ И ПРОФИЛЬ
  function screenWelcome() {
    var hasProfiles = Object.keys(state.profiles).length > 0;
    return page([
      h('section', { class: 'hero' },
        h('div', { class: 'hero-art', html: LOGO_SVG }),
        h('h1', null, 'Сәлеметсіз бе!'),
        h('p', { class: 'lead' }, 'Бұл — отбасыңызға арналған ағылшын тілі қосымшасы. Күніне 5–10 минут: сөздер, грамматика және қысқа мәтіндер.'),
        h('ul', { class: 'hero-list' },
          h('li', null, 'Әркім өз қарқынымен, өз құрылғысында оқиды.'),
          h('li', null, 'Тіркелу, телефон немесе пошта керек емес.'),
          h('li', null, 'Прогресс тек осы құрылғыда, осы браузерде сақталады.')),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () { go('name'); } }, 'Бастау'),
        hasProfiles ? h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('profiles'); } }, 'Бар профильді таңдау') : null
      )
    ]);
  }

  function findProfileByName(name) {
    var n = String(name || '').trim().toLowerCase();
    var ids = Object.keys(state.profiles).filter(function (id) { return state.profiles[id].name.trim().toLowerCase() === n; });
    return ids.length ? ids[0] : null;
  }

  function openProfile(id) {
    state.activeProfileId = id;
    persist();
    go(startRoute());
  }

  function createProfile(name, level) {
    var np = store.newProfile(name, level);
    state.profiles[np.id] = np;
    state.activeProfileId = np.id;
    persist();
    go('interest');
  }

  function initials(name) { return String(name).trim().charAt(0).toUpperCase(); }

  function screenWho() {
    var otherBox = h('div', { class: 'other-box hidden' });
    var input = h('input', { class: 'text-input', type: 'text', maxlength: '30', placeholder: 'Атыңызды жазыңыз', 'aria-label': 'Атыңыз' });
    var level = 'A0';
    var levelBtns = FEA.levelPresets.map(function (lp) {
      var b = h('button', { class: 'chip' + (lp.id === level ? ' chip-on' : ''), 'aria-pressed': lp.id === level ? 'true' : 'false' }, 'болжамды ' + lp.id);
      b.addEventListener('click', function () {
        level = lp.id;
        levelBtns.forEach(function (x, i) { var on = FEA.levelPresets[i].id === level; x.classList.toggle('chip-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      });
      return b;
    });
    var go2 = h('button', { class: 'btn btn-primary btn-block', disabled: true }, 'Жалғастыру');
    input.addEventListener('input', function () { go2.disabled = !input.value.trim(); });
    function submitOther() {
      var name = input.value.trim().slice(0, 30);
      if (!name) return;
      var existing = findProfileByName(name);
      if (existing) {
        FEA.ui.confirmDialog({ title: '«' + name + '» профилі бар', text: 'Бұл құрылғыда осындай профиль бар. Соны ашайық па? Оның прогресі сақталады.', ok: 'Профильді ашу' })
          .then(function (yes) { if (yes) openProfile(existing); });
        return;
      }
      createProfile(name, level);
    }
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitOther(); });
    go2.addEventListener('click', submitOther);
    otherBox.appendChild(input);
    otherBox.appendChild(h('p', { class: 'muted small' }, 'Бастапқы деңгей (кейін өзгертуге болады):'));
    otherBox.appendChild(h('div', { class: 'chips' }, levelBtns));
    otherBox.appendChild(go2);

    var cards = FEA.familyProfiles.map(function (fp) {
      var existing = findProfileByName(fp.name);
      return h('button', { class: 'family-card' + (existing ? ' existing' : ''), onclick: function () {
        if (existing) openProfile(existing); else createProfile(fp.name, fp.level);
      } },
        h('span', { class: 'avatar', 'aria-hidden': 'true' }, initials(fp.name)),
        h('span', { class: 'family-name' }, fp.name),
        h('span', { class: 'family-level' }, 'болжамды ' + fp.level),
        existing ? h('span', { class: 'family-open' }, 'Бар профиль — ашу') : null);
    });
    var otherCard = h('button', { class: 'family-card other', onclick: function () {
      otherBox.classList.remove('hidden'); input.focus();
    } }, h('span', { class: 'avatar', 'aria-hidden': 'true' }, '＋'), h('span', { class: 'family-name' }, 'Басқа профиль'), h('span', { class: 'family-level' }, 'атын жазу'));

    return page([
      h('section', { class: 'card card-pad' },
        h('p', { class: 'step-label' }, '1-қадам / 3'),
        h('h1', null, 'Кім оқиды?'),
        h('p', { class: 'muted' }, 'Өз профиліңізді таңдаңыз. Деңгей — болжамды бағдар ғана, ресми бағалау емес. Кейін өзгертуге болады. Тегі, телефон, пошта керек емес.'),
        h('div', { class: 'family-grid' }, cards, otherCard),
        otherBox,
        Object.keys(state.profiles).length ? h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('profiles'); } }, 'Барлық профильдер тізімі') : null
      )
    ]);
  }

  function screenName() {
    var p = profile();
    var editing = route.params.edit && p;
    if (!editing) return screenWho();
    var input = h('input', { class: 'text-input', type: 'text', maxlength: '30', placeholder: 'Мысалы: Айгерім', 'aria-label': 'Атыңыз немесе жүгіну', value: editing ? p.name : '' });
    var next = h('button', { class: 'btn btn-primary btn-block', disabled: !editing }, editing ? 'Сақтау' : 'Жалғастыру');
    input.addEventListener('input', function () { next.disabled = !input.value.trim(); });
    function submit() {
      var name = input.value.trim().slice(0, 30);
      if (!name) return;
      if (editing) { p.name = name; persist(); go('progress'); return; }
      var np = store.newProfile(name);
      state.profiles[np.id] = np;
      state.activeProfileId = np.id;
      persist();
      go('interest');
    }
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    next.addEventListener('click', submit);
    setTimeout(function () { input.focus(); }, 30);
    return page([
      h('section', { class: 'card card-pad' },
        h('p', { class: 'step-label' }, 'Профиль'),
        h('h1', null, 'Профиль атын өзгерту'),
        h('p', { class: 'muted' }, 'Тегі мен басқа жеке деректер керек емес.'),
        input,
        next,
        editing ? h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('progress'); } }, 'Артқа') : null
      )
    ]);
  }

  /*
   * Выбор интересов (до трёх направлений) и уточнение «что именно нравится».
   * Порядок выбора = приоритет. Выбор можно сменить позже на странице «Прогресс».
   * Пустой выбор допустим: тогда везде показывается общий вариант урока.
   */
  function screenInterest() {
    var p = profile();
    var editing = route.params.edit;
    var max = FEA.maxDirections;
    var sel = (E.profileInterests(p) || []).map(function (x) { return { id: x.id, likes: x.likes.slice(), custom: x.custom || '' }; });
    var cards = {};
    var counter = h('p', { class: 'interest-counter', role: 'status' });
    var details = h('div', { class: 'interest-details' });
    var save = h('button', { class: 'btn btn-primary btn-block' }, editing ? 'Сақтау' : 'Жалғастыру');

    function find(id) { return sel.filter(function (x) { return x.id === id; })[0]; }
    function meta(id) { return E.directionMeta(id); }

    function sync(msg) {
      Object.keys(cards).forEach(function (id) {
        var on = !!find(id);
        var full = !on && sel.length >= max;
        cards[id].classList.toggle('selected', on);
        cards[id].classList.toggle('is-full', full);
        cards[id].setAttribute('aria-pressed', on ? 'true' : 'false');
        var no = cards[id].querySelector('.interest-order');
        no.textContent = on ? String(sel.indexOf(find(id)) + 1) : '';
      });
      counter.textContent = msg || (sel.length ? 'Таңдалды: ' + sel.length + (sel.length < max ? ' · тағы қосуға болады (міндетті емес)' : '') : 'Біреуін таңдаңыз');
      save.disabled = !sel.length;
      drawDetails();
    }

    function toggle(id) {
      var cur = find(id);
      if (cur) sel.splice(sel.indexOf(cur), 1);
      else if (sel.length >= max) { sync('Ең көбі ' + max + ' бағыт. Жаңасын қосу үшін біреуін алып тастаңыз.'); return; }
      else sel.push({ id: id, likes: [], custom: '' });
      sync();
    }

    function likeChip(item, value, title, limit) {
      var on = item.likes.indexOf(value) !== -1;
      return h('button', { class: 'chip' + (on ? ' chip-on' : ''), 'aria-pressed': on ? 'true' : 'false', onclick: function () {
        var i = item.likes.indexOf(value);
        if (i !== -1) item.likes.splice(i, 1);
        else { if (limit && item.likes.length >= limit) item.likes.shift(); item.likes.push(value); }
        drawDetails(this.textContent);
      } }, title);
    }

    /* Реальный пример из урока, где направление меняет задание; иначе — честно, что меняется только тема. */
    function examplePanel(item) {
      if (item.id === 'custom') return null;
      var st = E.directionStats(item.id);
      if (!st.action.length) {
        return h('p', { class: 'note' }, 'Бұл бағыт бойынша рөлі бар сабақ әзірге жоқ. ' +
          (st.topic ? st.topic + ' сабақта тек мәтіннің тақырыбы ауысады, тапсырма жалпы.' : 'Сабақтар жалпы нұсқада беріледі.'));
      }
      var ex = st.action[0];
      var line = ex.ctx.text.lines[0];
      return h('div', { class: 'example' },
        h('p', { class: 'example-head' }, 'Мысал: «' + ex.lesson.title + '» сабағы'),
        h('p', { class: 'example-role' }, 'Сіз — ', h('strong', null, ex.ctx.role.toLowerCase()), '. ', ex.ctx.task.charAt(0).toUpperCase() + ex.ctx.task.slice(1) + '.'),
        h('p', { class: 'example-en', lang: 'en' }, line),
        h('p', { class: 'example-q' }, ex.ctx.tasks[0].prompt),
        h('p', { class: 'example-count' }, 'Рөлі бар сабақтар: ' + st.action.length + ' / ' + FEA.lessons.length +
          (st.topic ? ' · тек тақырып: ' + st.topic : '') + '. Қалғандары — жалпы сабақ.'));
    }

    function drawDetails(focusText) {
      details.innerHTML = '';
      sel.forEach(function (item, n) {
        var d = meta(item.id);
        var short = FEA.directionShort[item.id] || {};
        var box = h('fieldset', { class: 'interest-detail' }, h('legend', null, (sel.length > 1 ? (n + 1) + ' · ' : '') + d.title));
        if (item.id === 'custom') {
          var input = h('input', { class: 'text-input', type: 'text', maxlength: '40', placeholder: 'Тақырыбыңызды жазыңыз', value: item.custom, 'aria-label': 'Өз тақырыбыңыз' });
          input.addEventListener('input', function () { item.custom = input.value; });
          box.appendChild(h('div', { class: 'chips' }, d.suggestions.map(function (t) {
            return h('button', { class: 'chip', onclick: function () { input.value = t; item.custom = t; } }, t);
          })));
          box.appendChild(input);
          box.appendChild(h('p', { class: 'small' }, 'Қандай әрекет ұнайды? Сабақ сол әрекетпен беріледі, бірақ тақырыбы басқа болады.'));
          box.appendChild(h('div', { class: 'chips' }, d.modeChoices.map(function (m) { return likeChip(item, m, FEA.actionModes[m].title, 2); })));
        } else {
          box.appendChild(examplePanel(item));
          box.appendChild(h('p', { class: 'likes-label' }, 'Нақтырақ (міндетті емес):'));
          box.appendChild(h('div', { class: 'chips' }, d.likes.map(function (l) { return likeChip(item, l.id, l.title); })));
        }
        details.appendChild(box);
      });
      if (focusText) {
        var again = [].filter.call(details.querySelectorAll('.chip'), function (c) { return c.textContent === focusText; })[0];
        if (again) again.focus();
      }
    }

    function card(d) {
      var short = FEA.directionShort[d.id] || {};
      var st = d.id === 'custom' ? null : E.directionStats(d.id);
      var line = short.role ? 'Мен — ' + short.role : d.id === 'custom' ? 'Ұнайтын әрекетті өзіңіз таңдайсыз' : 'Тек мәтін тақырыбы';
      var avail = !st ? '' : st.action.length ? st.action.length + ' сабақта рөл' : 'рөлі бар сабақ әзірге жоқ';
      var c = h('button', { class: 'interest-card', 'aria-pressed': 'false', onclick: function () { toggle(d.id); } },
        h('span', { class: 'interest-check', 'aria-hidden': 'true' }, h('span', { class: 'interest-order' })),
        h('span', { class: 'interest-text' },
          h('span', { class: 'interest-title' }, d.title),
          h('span', { class: 'interest-desc' }, line),
          avail ? h('span', { class: 'interest-avail' + (st.action.length ? '' : ' none') }, avail) : null));
      cards[d.id] = c;
      return c;
    }

    save.addEventListener('click', function () {
      if (!sel.length) return;
      p.interests = sel.map(function (x) { return E.cleanInterest(x); }).filter(Boolean);
      persist();
      go(editing ? 'progress' : startRoute());
    });
    var skip = h('button', { class: 'btn btn-ghost btn-block', onclick: function () {
      p.interests = [];
      persist();
      go(editing ? 'progress' : startRoute());
    } }, 'Әзірге таңдамаймын');

    var groups = FEA.directionGroups.map(function (g) {
      var list = FEA.directions.filter(function (d) { return d.group === g.id; });
      return h('section', { class: 'interest-group', 'aria-label': g.title },
        h('h2', { class: 'group-title' }, g.title),
        h('div', { class: 'interest-grid' }, list.map(function (d) { return card(d); })));
    });
    groups.push(h('section', { class: 'interest-group', 'aria-label': 'Басқа' },
      h('h2', { class: 'group-title' }, 'Тізімде жоқ па?'),
      h('div', { class: 'interest-grid' }, card(FEA.customDirection))));

    var view = page([
      h('section', { class: 'interest-screen' },
        h('p', { class: 'kicker' }, editing ? 'Қызығушылық' : '2-қадам / 3'),
        h('h1', null, 'Сізге не ұнайды?'),
        h('p', { class: 'lead' }, 'Біреуін таңдаңыз. Кей сабақтарда сіз осы бағыттағы рөлді аласыз.'),
        h('p', { class: 'muted small' }, 'Деңгей мен сабақтар реті өзгермейді. Кейін «Прогресс» бетінде ауыстыруға болады.'),
        groups,
        h('div', { class: 'interest-footer' }, counter, details, save, skip,
          editing ? h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('progress'); } }, 'Артқа') : null))
    ]);
    sync();
    return view;
  }

  function screenProfiles() {
    var ids = Object.keys(state.profiles);
    return page([
      h('section', { class: 'card card-pad' },
        h('h1', null, 'Профильді таңдаңыз'),
        h('p', { class: 'muted' }, 'Бір құрылғыда бірнеше профиль болуы мүмкін. Әр профильдің прогресі бөлек сақталады.'),
        ids.length ? h('div', { class: 'list' }, ids.map(function (id) {
          var p = state.profiles[id];
          return h('button', { class: 'list-item', onclick: function () { state.activeProfileId = id; persist(); go(startRoute()); } },
            h('span', { class: 'list-name' }, h('span', { class: 'chip-initial small-initial', 'aria-hidden': 'true' }, String(p.name).trim().charAt(0).toUpperCase()), p.name + (p.presetLevel ? ' · болжамды ' + p.presetLevel : '')),
            h('span', { class: 'muted small' }, interestsSummary(p) || 'баптау аяқталмаған'));
        })) : h('p', { class: 'empty' }, 'Әзірге профиль жоқ.'),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () { go('name'); } }, '＋ Жаңа профиль немесе отбасы мүшесін таңдау')
      )
    ]);
  }

  // ------------------------------------------------------------ ДИАГНОСТИКА
  var diag = null;

  function ensureStages(p) {
    if (!p.stages) p.stages = p.presetLevel ? FEA.stagesFromLevel(p.presetLevel) : { words: 0, grammar: 0, reading: 0 };
  }

  function screenDiagIntro() {
    var p = profile();
    ensureStages(p);
    return page([
      h('section', { class: 'card card-pad' },
        h('p', { class: 'step-label' }, '3-қадам / 3'),
        h('h1', null, 'Қысқа диагностика'),
        h('div', { class: 'banner banner-info' },
          h('strong', null, 'Қазіргі бастапқы деңгей' + (p.presetLevel ? ' (болжамды ' + p.presetLevel + ')' : '') + ':'),
          h('div', null, E.SKILL_ORDER.map(function (s) { return skillMeta(s).title + ' — ' + stageLabel(p.stages[s]); }).join(' · '))),
        h('p', null, '15 қысқа сұрақ: 5 — сөздер, 5 — грамматика, 5 — оқу. Әр бөлімде сұрақтар біртіндеп қиындай береді.'),
        h('ul', { class: 'hero-list' },
          h('li', null, 'Білмесеңіз, «Білмеймін» батырмасын басыңыз — бұл қалыпты жағдай.'),
          h('li', null, 'Қате үшін ешқандай айып жоқ. Әр жауаптан кейін қысқа түсіндірме шығады.'),
          h('li', null, 'Нәтиже — тек болжамды бастапқы деңгей. Ол сабақтар барысында нақтыланады.')),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () { startDiag(); } }, 'Диагностиканы бастау'),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { skipDiag(); } }, 'Диагностикасыз, осы деңгейден бастау')
      )
    ]);
  }

  function startDiag() {
    diag = { i: 0, correct: { words: 0, grammar: 0, reading: 0 }, wrongInRow: { words: 0, grammar: 0, reading: 0 }, wrongIds: [], stoppedParts: [] };
    go('diag');
  }

  function skipDiag() {
    var p = profile();
    ensureStages(p);
    p.diagnostic = { date: new Date().toISOString(), skipped: true, correct: null, suggested: null };
    persist();
    go('diagResult');
  }

  function nextDiagIndex() {
    var items = FEA.diagnostic;
    var i = diag.i + 1;
    while (i < items.length && diag.stoppedParts.indexOf(items[i].skill) !== -1) i++;
    return i;
  }

  function screenDiag() {
    var items = FEA.diagnostic;
    var item = items[diag.i];
    var partIndex = FEA.engine.SKILL_ORDER.indexOf(item.skill);
    var partItems = items.filter(function (x) { return x.skill === item.skill; });
    var posInPart = partItems.indexOf(item) + 1;
    var progress = Math.round((diag.i / items.length) * 100);
    var stoppedNote = null;

    var view = taskView({ type: 'choice', prompt: item.prompt, options: item.options, answer: item.answer, explain: item.explain,
      visual: item.visual, sentence: item.sentence, sign: item.sign, text: item.text }, {
      dontKnow: true,
      wrongNote: 'Бұл сұраққа ұқсас тапсырма кейін қайталауға қосылады.',
      onResult: function (ok) {
        if (ok) { diag.correct[item.skill]++; diag.wrongInRow[item.skill] = 0; }
        else {
          diag.wrongInRow[item.skill]++;
          diag.wrongIds.push(item.id);
          if (diag.wrongInRow[item.skill] >= FEA.settings.diagStopAfterWrongInRow && posInPart < 5) {
            diag.stoppedParts.push(item.skill);
            stoppedNote.classList.remove('hidden');
          }
        }
      },
      onNext: function () {
        var n = nextDiagIndex();
        if (n >= items.length) finishDiag();
        else { diag.i = n; go('diag'); }
      }
    });
    stoppedNote = h('p', { class: 'banner banner-info hidden' }, 'Бұл бөлімді осы жерде аяқтаймыз. Қалғанын сабақтарда біртіндеп үйренесіз.');

    return page([
      h('div', { class: 'progress-wrap' },
        h('div', { class: 'progress-meta' },
          h('span', null, (partIndex + 1) + '-бөлім: ' + skillMeta(item.skill).title + ' · ' + posInPart + '/5'),
          h('button', { class: 'link-btn', onclick: function () {
            FEA.ui.confirmDialog({ title: 'Диагностиканы тоқтатасыз ба?', text: 'Жауаптар сақталмайды. Кейін қайта бастауға болады.', ok: 'Тоқтату' })
              .then(function (yes) { if (yes) { diag = null; go('diagIntro'); } });
          } }, 'Тоқтату')),
        h('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': String(progress), 'aria-valuemin': '0', 'aria-valuemax': '100' },
          h('div', { class: 'progress-bar', style: 'width:' + progress + '%' }))),
      h('div', { class: 'card card-pad' }, view, stoppedNote)
    ]);
  }

  function finishDiag() {
    var p = profile();
    var t = now();
    var suggested = {};
    E.SKILL_ORDER.forEach(function (s) { suggested[s] = E.diagStage(diag.correct[s]); });
    ensureStages(p);
    // Уровень НЕ меняется: ученик подтверждает предложение на следующем экране
    p.diagnostic = { date: new Date(t).toISOString(), skipped: false, correct: diag.correct, suggested: suggested };
    diag.wrongIds.forEach(function (id) {
      var d = FEA.diagnostic.filter(function (x) { return x.id === id; })[0];
      E.scheduleReview(p, id + '-r', t);
      E.addMistake(p, { at: t, where: 'Диагностика', prompt: d.prompt + (d.sentence ? ' ' + d.sentence : ''), answer: d.options[d.answer], explain: d.explain });
    });
    diag = null;
    persist();
    go('diagResult');
  }

  function stageStepper(skill, onChange) {
    var p = profile();
    var val = p.stages[skill];
    var label = h('div', { class: 'stage-name' }, stageLabel(val));
    var hint = h('div', { class: 'muted small' }, stageMeta(val).cefrHint);
    var minus = h('button', { class: 'btn btn-ghost btn-small', 'aria-label': 'Жеңілірек' }, '− Жеңілірек');
    var plus = h('button', { class: 'btn btn-ghost btn-small', 'aria-label': 'Қиынырақ' }, 'Қиынырақ +');
    function upd() {
      label.textContent = stageLabel(p.stages[skill]);
      hint.textContent = stageMeta(p.stages[skill]).cefrHint;
      minus.disabled = p.stages[skill] <= 0;
      plus.disabled = p.stages[skill] >= FEA.stages.length - 1;
    }
    minus.addEventListener('click', function () { p.stages[skill]--; persist(); upd(); if (onChange) onChange(); });
    plus.addEventListener('click', function () { p.stages[skill]++; persist(); upd(); if (onChange) onChange(); });
    upd();
    return h('div', { class: 'stepper' }, h('div', null, label, hint), h('div', { class: 'row-gap' }, minus, plus));
  }

  function screenDiagResult() {
    var p = profile();
    var d = p.diagnostic;
    var sug = d && !d.skipped && d.suggested ? d.suggested : null;
    var differs = sug ? E.SKILL_ORDER.filter(function (s) { return sug[s] !== p.stages[s]; }) : [];
    return page([
      h('section', { class: 'card card-pad' },
        h('h1', null, d && d.skipped ? 'Бастапқы деңгей сақталды' : 'Диагностика нәтижесі'),
        h('p', { class: 'muted' }, d && d.skipped
          ? 'Диагностика өткізілмеді. Профиль бойынша берілген болжамды деңгей сақталды. Төменде өзгертуге болады.'
          : 'Бұл — қысқа тексерудің алдын ала нәтижесі, әр дағды бөлек. Деңгейіңіз өзіңіз растағанда ғана өзгереді.'),
        differs.length > 1 ? h('button', { class: 'btn btn-secondary btn-block', onclick: function () {
          differs.forEach(function (s) { p.stages[s] = sug[s]; }); persist(); render();
        } }, 'Барлық ұсынысты қабылдау') : null,
        h('div', { class: 'skill-results' }, E.SKILL_ORDER.map(function (s) {
          var sm = skillMeta(s);
          var diff = sug && sug[s] !== p.stages[s];
          return h('div', { class: 'skill-result skill-' + s },
            h('div', { class: 'skill-result-head' }, h('span', { class: 'skill-icon' }, icon(s)), h('strong', null, sm.title),
              d && d.correct ? h('span', { class: 'muted small' }, d.correct[s] + ' / 5 дұрыс') : null),
            h('div', { class: 'muted small' }, 'Қазіргі саты:'),
            stageStepper(s, function () { render(); }),
            sug ? h('div', { class: 'suggest' + (diff ? ' diff' : '') },
              diff ? [h('span', null, 'Диагностика ұсынады: ', h('strong', null, stageLabel(sug[s])), ' (' + stageMeta(sug[s]).cefrHint + ')'),
                h('button', { class: 'btn btn-secondary btn-small', onclick: function () { p.stages[s] = sug[s]; persist(); render(); } }, 'Қабылдау')]
                : h('span', null, 'Диагностика қазіргі сатымен сәйкес келеді.')) : null);
        })),
        h('p', { class: 'muted small' }, FEA.cefrDisclaimer),
        h('p', { class: 'muted small' }, 'Тым жеңіл немесе тым қиын көрінсе, «Жеңілірек» не «Қиынырақ» батырмасымен өзіңіз таңдаңыз.'),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () {
          var rec = E.recommendNext(p, now());
          if (rec.kind === 'lesson') startLesson(rec.lesson.id); else go('home');
        } }, 'Бірінші сабақты бастау'),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('home'); } }, 'Басты бетке')
      )
    ]);
  }

  // ------------------------------------------------------------ ГЛАВНАЯ
  /*
   * Карточка урока: навык и ступень, название, короткий практический результат (canDo),
   * состояние, короткая метка варианта и одна кнопка. Подробности — внутри урока.
   */
  function lessonCard(lesson, opts) {
    opts = opts || {};
    var sm = skillMeta(lesson.skill);
    var p = profile();
    var done = !!p.lessons[lesson.id];
    return h('article', { class: 'lesson-card skill-' + lesson.skill + (opts.big ? ' big' : '') },
      opts.kicker ? h('p', { class: 'kicker' }, opts.kicker) : null,
      h('p', { class: 'lesson-card-head' },
        h('span', { class: 'skill-badge' }, icon(lesson.skill), sm.title),
        h('span', { class: 'meta-sep', 'aria-hidden': 'true' }, '·'),
        h('span', null, stageLabel(lesson.stage))),
      h(opts.big ? 'h2' : 'h3', { class: 'lesson-title' }, lesson.title),
      h('p', { class: 'lesson-goal' }, lesson.canDo || lesson.goal),
      h('div', { class: 'lesson-card-foot' },
        h('div', { class: 'lesson-card-tags' },
          variantBadge(lesson, opts.ctxKey),
          E.challengeFor(lesson) ? h('span', { class: 'state-tag challenge-tag' }, (p.lessons[lesson.id] && p.lessons[lesson.id].challengeDone) ? icon('check') : null, 'Күрделірек бар') : null,
          done ? h('span', { class: 'state-tag done' }, icon('check'), 'Өтілді') : h('span', { class: 'state-tag' }, icon('clock'), '5–10 мин')),
        h('button', { class: 'btn ' + (opts.big ? 'btn-primary' : 'btn-secondary'), onclick: function () { startLesson(lesson.id, opts.ctxKey); } },
          opts.label || (done ? 'Қайталау' : 'Бастау'))));
  }

  /* Что выбрано для ученика и почему — честно, без обещаний, которых нет. */
  function variantInfo(lesson, ctxKey) {
    var p = profile();
    if (ctxKey) {
      var ctx = lesson.contexts[ctxKey];
      return { key: ctxKey, ctx: ctx, kind: E.isActionVariant(ctx) ? 'chosen' : 'chosen-topic', interest: null };
    }
    return E.pickVariant(lesson, p);
  }
  function interestName(it) {
    if (!it) return '';
    return it.id === 'custom' ? (it.custom ? '«' + it.custom + '»' : 'өз тақырыбыңыз') : '«' + E.directionMeta(it.id).title + '»';
  }
  /*
   * Три честных случая:
   *  'mission' — меняется само задание (роль и действие);
   *  'topic'   — меняется только сюжет текста, упражнение общее;
   *  'general' — интерес в этом уроке не поддерживается (или не выбран).
   */
  function variantKind(v) {
    if (v.kind === 'action' || v.kind === 'chosen' || v.kind === 'mode') return 'mission';
    if (v.kind === 'topic' || v.kind === 'chosen-topic') return 'topic';
    return 'general';
  }
  function variantBadge(lesson, ctxKey) {
    var v = variantInfo(lesson, ctxKey);
    var k = variantKind(v);
    var text = k === 'mission' ? 'Миссия: ' + v.ctx.role.toLowerCase()
      : k === 'topic' ? 'Тақырып: ' + (FEA.contextNames[v.key] || v.key).toLowerCase()
      : 'Жалпы сабақ';
    return h('span', { class: 'variant-tag tag-' + k }, text);
  }
  /* Одно короткое пояснение для миссии (без повторов роли и цели). */
  function variantNote(v) {
    var k = variantKind(v);
    if (v.kind === 'mode') return interestName(v.interest) + ' бойынша нұсқа жоқ, бірақ сіз таңдаған әрекет түрі берілді.';
    if (k === 'topic') return 'Мұнда тек мәтіннің тақырыбы ауысады («' + (FEA.contextNames[v.key] || v.key) + '»), тапсырма бәріне бірдей.';
    if (k === 'general' && v.interest) return interestName(v.interest) + ' бойынша бұл сабақта нұсқа әлі жоқ — жалпы сабақ. Мақсат пен деңгей өзгермейді.';
    return null;
  }

  function screenHome() {
    var p = profile();
    var t = now();
    var rec = E.recommendNext(p, t);
    var due = E.countDue(p, t);
    var doneCount = Object.keys(p.lessons).length;
    var main;

    if (rec.kind === 'lesson') {
      main = lessonCard(rec.lesson, { big: true, kicker: 'Келесі сабақ', label: 'Бастау' });
    } else if (rec.kind === 'review') {
      main = h('section', { class: 'lesson-card big' },
        h('p', { class: 'kicker' }, 'Бүгін'),
        h('h2', { class: 'lesson-title' }, 'Қайталау күні'),
        h('p', { class: 'lesson-goal' }, 'Сатыңыздағы сабақтар өтілді. Бұрын үйренгенді еске түсірейік.'),
        h('div', { class: 'lesson-card-foot' }, h('span', { class: 'state-tag' }, due + ' сұрақ'),
          h('button', { class: 'btn btn-primary', onclick: function () { startReview(); } }, 'Бастау')));
    } else {
      var other = E.SKILL_ORDER.map(function (s) { return E.lessonFor(p.stages[s], s); }).filter(Boolean)[0];
      var ctxUsed = other && p.lessons[other.id] ? p.lessons[other.id].contextsUsed : [];
      var altCtx = other ? Object.keys(other.contexts).filter(function (k) { return ctxUsed.indexOf(k) === -1; })[0] : null;
      main = h('section', { class: 'lesson-card big' },
        h('p', { class: 'kicker' }, 'Жарайсыз!'),
        h('h2', { class: 'lesson-title' }, 'Ағымдағы сабақтар өтілді'),
        h('p', { class: 'lesson-goal' }, 'Сабақты басқа нұсқамен қайталауға немесе «Прогресс» бетінде келесі сатыны таңдауға болады.'),
        other && altCtx ? h('button', { class: 'btn btn-primary btn-block', onclick: function () { startLesson(other.id, altCtx); } },
          '«' + other.title + '» — басқа нұсқамен') : null,
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('progress'); } }, 'Прогресс және сатылар'));
    }

    function quick(title, sub, onclick, ico) {
      return h('button', { class: 'quick-row', onclick: onclick },
        h('span', { class: 'quick-ico' }, icon(ico)),
        h('span', { class: 'quick-text' }, h('span', { class: 'quick-title' }, title), h('span', { class: 'quick-sub' }, sub)),
        icon('arrow', 'quick-arrow'));
    }
    var cases = (FEA.cases || []).map(function (c) {
      var r = (p.cases || {})[c.id];
      var inProgress = r && !r.done && (r.toolDone || r.scene > 0);
      var solved = r && r.solved && r.solved.length;
      return quick('Арнайы іс: ' + c.title, inProgress ? 'Жалғастыру' : solved ? 'Шешілді · қайта ашу' : 'Жаңа іс · 4 айғақ', function () { openCase(c.id); }, 'doc');
    });
    return page([
      h('section', { class: 'greet' },
        h('h1', null, 'Сәлем, ' + p.name + '!'),
        h('p', { class: 'muted' }, doneCount ? 'Бүгін бір қысқа сабақ жеткілікті.' : 'Бірінші сабақтан бастайық.')),
      main,
      h('section', { class: 'quick', 'aria-label': 'Тағы не істеуге болады' },
        h('h2', { class: 'quick-head' }, 'Тағы'),
        due > 0 && rec.kind !== 'review' ? quick('Қайталау', due + ' сұрақ бүгін', function () { startReview(); }, 'review') : null,
        cases,
        quick('Сөздік', 'Сабақтардағы сөздер және қайталау', function () { go('dictionary'); }, 'dictionary'))
    ], 'home');
  }

  // ------------------------------------------------------------ САБАҚТАР
  var lessonsTab = null;
  function screenSkills() {
    var p = profile();
    var skill = route.params.skill || lessonsTab || E.SKILL_ORDER[0];
    lessonsTab = skill;
    var lessons = E.lessonsForSkill(skill);
    var stages = [];
    lessons.forEach(function (l) { if (stages.indexOf(l.stage) === -1) stages.push(l.stage); });
    var mine = p.stages[skill];
    // Сначала ступень ученика, потом остальные по порядку
    stages.sort(function (a, b) { return (b === mine) - (a === mine) || a - b; });
    function group(st) {
      var list = lessons.filter(function (l) { return l.stage === st; });
      var done = list.filter(function (l) { return p.lessons[l.id]; }).length;
      var head = [h('span', { class: 'stage-name' }, stageLabel(st)), h('span', { class: 'stage-count' }, done + ' / ' + list.length + ' өтілді')];
      var cards = h('div', { class: 'lesson-list' }, list.map(function (l) { return lessonCard(l); }));
      if (st === mine) return h('section', { class: 'stage-group current' }, h('h2', { class: 'stage-head' }, head, h('span', { class: 'mine-tag' }, 'Сіздің сатыңыз')), cards);
      return h('details', { class: 'stage-group' }, h('summary', { class: 'stage-head' }, head), cards);
    }
    return page([
      h('h1', null, 'Сабақтар'),
      h('div', { class: 'tabs', role: 'group', 'aria-label': 'Дағды' }, E.SKILL_ORDER.map(function (s) {
        return h('button', { class: 'tab' + (s === skill ? ' active' : ''), 'aria-pressed': s === skill ? 'true' : 'false', onclick: function () { go('skills', { skill: s }); } },
          icon(s), skillMeta(s).title);
      })),
      h('ul', { class: 'legend', 'aria-label': 'Белгілер' },
        h('li', null, h('span', { class: 'variant-tag tag-mission' }, 'Миссия'), ' қызығушылығыңыз тапсырманы өзгертеді'),
        h('li', null, h('span', { class: 'variant-tag tag-topic' }, 'Тақырып'), ' тек мәтін ауысады'),
        h('li', null, h('span', { class: 'variant-tag tag-general' }, 'Жалпы'), ' бәріне бірдей сабақ')),
      stages.map(group)
    ], 'skills');
  }

  // ------------------------------------------------------------ СӨЗДІК
  /*
   * Словарь из слов уроков (FEA.engine.buildDictionary). Поиск по английскому слову и по переводу.
   * Повторение: 8 карточек; результат пишется только в profile.vocab — прогресс уроков и
   * интервальное повторение не затрагиваются.
   */
  var dict = { q: '', filter: 'all', review: null, limit: 30 };

  function normQ(x) { return String(x || '').toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim(); }
  function learnedSet(p) {
    var out = {};
    E.buildDictionary().forEach(function (e) { if (e.sources.some(function (s) { return p.lessons[s.lessonId]; })) out[e.key] = 1; });
    return out;
  }
  function dictEntries(p) {
    var q = normQ(dict.q);
    var learned = dict.filter === 'learned' ? learnedSet(p) : null;
    return E.buildDictionary().filter(function (e) {
      if (learned && !learned[e.key]) return false;
      if (!q) return true;
      return normQ(e.en).indexOf(q) !== -1 || e.kk.some(function (k) { return normQ(k).indexOf(q) !== -1; });
    });
  }
  function sourceText(e) {
    var s0 = e.sources[0];
    var more = e.sources.length > 1 ? ' және тағы ' + (e.sources.length - 1) : '';
    return '«' + s0.title + '» · ' + skillMeta(s0.skill).title.toLowerCase() + (s0.ctx ? ' · ' + (FEA.contextNames[s0.ctx] || s0.ctx).toLowerCase() + ' мәтіні' : '') + more;
  }
  function exampleView(e) {
    if (!e.example) return null;
    return h('p', { class: 'dict-ex' }, h('span', { lang: 'en' }, e.example.en),
      e.example.kk ? h('span', { class: 'dict-ex-kk' }, ' — ' + e.example.kk) : h('span', { class: 'dict-ex-kk' }, ' (сабақ мәтінінен)'));
  }
  function entryView(e) {
    return h('li', { class: 'dict-entry' },
      h('p', { class: 'dict-head' },
        e.emoji ? h('span', { class: 'dict-emoji', 'aria-hidden': 'true' }, e.emoji) : null,
        h('span', { class: 'dict-en', lang: 'en' }, e.en),
        h('span', { class: 'dict-kk' }, e.kk.join('; '))),
      exampleView(e),
      h('p', { class: 'dict-src' }, sourceText(e)));
  }

  function startVocabReview() {
    var p = profile();
    var all = E.buildDictionary();
    var learned = learnedSet(p);
    var pool = all.filter(function (e) { return learned[e.key]; });
    var from = 'learned';
    if (pool.length < 4) {
      // Пока мало пройдено — слова уроков текущих ступеней ученика
      pool = all.filter(function (e) { return e.sources.some(function (s) { return s.stage === p.stages[s.skill]; }); });
      from = 'stage';
    }
    var v = p.vocab || {};
    function weight(e) { var r = v[e.key]; return !r ? 1 : (r.again > r.known ? 0 : 2 + (r.known || 0)); }
    pool = E.shuffle(pool.slice()).sort(function (a, b) { return weight(a) - weight(b); }).slice(0, 8);
    dict.review = { list: pool, i: 0, shown: false, known: 0, again: 0, from: from };
    render();
  }
  function markVocab(e, known) {
    var p = profile();
    p.vocab = p.vocab && typeof p.vocab === 'object' ? p.vocab : {};
    var r = p.vocab[e.key] || { known: 0, again: 0 };
    if (known) r.known++; else r.again++;
    r.at = now();
    p.vocab[e.key] = r;
    persist();
    if (known) dict.review.known++; else dict.review.again++;
    dict.review.i++; dict.review.shown = false;
    render();
    var f = document.querySelector('.flash .btn-primary, .flash .btn');
    if (f) f.focus();
  }
  function vocabReviewView() {
    var r = dict.review;
    var exit = h('button', { class: 'btn btn-ghost', onclick: function () { dict.review = null; render(); } }, 'Сөздікке оралу');
    if (!r.list.length) return h('section', { class: 'flash' }, h('h2', null, 'Қайталайтын сөз әлі жоқ'), h('p', { class: 'muted' }, 'Алдымен бір сабақ өтіңіз.'), exit);
    if (r.i >= r.list.length) {
      return h('section', { class: 'flash' },
        h('p', { class: 'kicker' }, 'Қайталау аяқталды'),
        h('h2', null, 'Білдім: ' + r.known + ' · Тағы қайталаймын: ' + r.again),
        h('p', { class: 'muted' }, '«Тағы қайталаймын» деген сөздер келесі жолы бірінші шығады.'),
        h('div', { class: 'row-gap' }, h('button', { class: 'btn btn-primary', onclick: startVocabReview }, 'Тағы 8 сөз'), exit));
    }
    var e = r.list[r.i];
    return h('section', { class: 'flash', 'aria-live': 'polite' },
      h('p', { class: 'kicker' }, 'Сөз ' + (r.i + 1) + ' / ' + r.list.length + (r.from === 'stage' ? ' · сатыңыздағы сабақтардан' : ' · өткен сабақтардан')),
      h('p', { class: 'flash-word' }, e.emoji ? h('span', { 'aria-hidden': 'true' }, e.emoji + ' ') : null, h('span', { lang: 'en' }, e.en)),
      r.shown ? [
        h('p', { class: 'flash-kk' }, e.kk.join('; ')),
        exampleView(e),
        h('p', { class: 'muted small' }, 'Есіңізде болды ма?'),
        h('div', { class: 'flash-actions' },
          h('button', { class: 'btn btn-primary', onclick: function () { markVocab(e, true); } }, 'Білдім'),
          h('button', { class: 'btn btn-secondary', onclick: function () { markVocab(e, false); } }, 'Тағы қайталаймын'))
      ] : [
        h('p', { class: 'muted' }, 'Аудармасын еске түсіріңіз, сосын тексеріңіз.'),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () { r.shown = true; render(); var b = document.querySelector('.flash-actions .btn'); if (b) b.focus(); } }, 'Аудармасын көру')
      ],
      exit);
  }

  function screenDictionary() {
    var p = profile();
    if (dict.review) return page([h('h1', null, 'Сөздерді қайталау'), vocabReviewView()], 'dictionary');
    var list = h('ul', { class: 'dict-list' });
    var count = h('p', { class: 'dict-count', role: 'status' });
    var more = h('button', { class: 'btn btn-ghost btn-block', onclick: function () { dict.limit += 30; draw(); } });
    function draw() {
      var items = dictEntries(p);
      list.innerHTML = '';
      items.slice(0, dict.limit).forEach(function (e) { list.appendChild(entryView(e)); });
      count.textContent = items.length ? items.length + ' сөз' + (items.length > dict.limit ? ' · алғашқы ' + dict.limit + ' көрсетілген' : '') : 'Ештеңе табылмады. Басқаша жазып көріңіз.';
      more.classList.toggle('hidden', items.length <= dict.limit);
      more.textContent = 'Тағы көрсету (' + Math.min(30, items.length - dict.limit) + ')';
    }
    var input = h('input', { class: 'text-input search-input', type: 'search', value: dict.q, placeholder: 'Ағылшынша немесе қазақша іздеу', 'aria-label': 'Сөзді іздеу', autocomplete: 'off', spellcheck: 'false' });
    input.addEventListener('input', function () { dict.q = input.value; dict.limit = 30; draw(); });
    var learnedCount = Object.keys(learnedSet(p)).length;
    function filterBtn(id, title) {
      return h('button', { class: 'chip' + (dict.filter === id ? ' chip-on' : ''), 'aria-pressed': dict.filter === id ? 'true' : 'false',
        onclick: function () { dict.filter = id; dict.limit = 30; render(); } }, title);
    }
    draw();
    return page([
      h('div', { class: 'dict-top' },
        h('h1', null, 'Сөздік'),
        h('button', { class: 'btn btn-primary', onclick: startVocabReview }, icon('review'), 'Қайталау')),
      h('label', { class: 'search' }, icon('search', 'search-ico'), input),
      h('div', { class: 'chips', role: 'group', 'aria-label': 'Сүзгі' },
        filterBtn('all', 'Барлық сөз'), filterBtn('learned', 'Өткен сабақтардан · ' + learnedCount)),
      count,
      list,
      more,
      h('p', { class: 'fineprint' }, 'Сөздер мен аудармалар — сабақтардан. Қазақша аудармаларды тіл маманы әлі тексермеген.')
    ], 'dictionary');
  }

  // ------------------------------------------------------------ САБАҚ
  var run = null;

  /*
   * tier — ступень задания ('base' | 'challenge'). Не задана — берётся последний выбор ученика
   * для этого урока (profile.taskLevel), иначе базовая. Уровень языка и интерес не меняет.
   */
  function startLesson(lessonId, ctxKey, tier) {
    var p = profile();
    var lesson = E.getLesson(lessonId);
    var v = variantInfo(lesson, ctxKey);
    var t = E.tierFor(lesson, tier || (p.taskLevel && p.taskLevel[lessonId]) || 'base');
    run = { mode: 'lesson', lesson: lesson, ctxKey: v.key, variant: v, tier: t, pinnedCtx: ctxKey || null,
      steps: E.buildLessonSteps(lesson, v.key, p, now(), t), i: 0, results: [], mistakes: [], newReviews: 0 };
    go('lesson');
  }

  /* Тренировка пройденных слов и конструкций: ничего не записывает. */
  function startPractice() {
    var steps = E.buildPracticeSteps(profile(), 6);
    if (!steps.length) return;
    run = { mode: 'practice', lesson: null, steps: steps, i: 0, results: [], mistakes: [] };
    go('lesson');
  }

  function startReview() {
    var p = profile();
    var steps = E.buildReviewSteps(p, now());
    if (!steps.length) { go('home'); return; }
    run = { mode: 'review', lesson: null, steps: steps, i: 0, results: [], mistakes: [] };
    go('lesson');
  }

  /* ok — верно с первой попытки; info.final — верно в итоге (в т.ч. со второй попытки). */
  function recordResult(step, ok, answerText, info) {
    var p = profile();
    var t = now();
    info = info || { final: ok };
    run.results.push({ phase: step.phase, ok: ok, reviewId: step.reviewId || null });
    if (run.mode === 'practice') return;   // тренировка: расписание, ошибки и прогресс не меняются
    if (step.reviewId) E.applyReview(p, step.reviewId, ok, t);
    if (!ok && !step.reviewId && run.mode === 'lesson' && step.task.type !== 'match') {
      if (E.scheduleMistake(p, run.lesson.id, run.ctxKey, step.phase, step.idx, t)) run.newReviews++;
    }
    if (!ok && step.task.type !== 'match') {
      var correct = step.task.type === 'choice' ? step.task.options[step.task.answer]
        : step.task.type === 'type' ? step.task.answers[0] : step.task.answer;
      var m = {
        at: t,
        where: (run.lesson ? run.lesson.title : 'Қайталау') + (info.final ? ' · екінші әрекетте дұрыс' : ''),
        prompt: step.task.prompt + (step.task.sentence ? ' ' + step.task.sentence : ''),
        given: info.final ? '' : answerText,
        answer: correct,
        explain: step.task.explain
      };
      E.addMistake(p, m);
      run.mistakes.push(m);
    } else if (!ok) {
      run.mistakes.push({ at: t, where: run.lesson ? run.lesson.title : '', prompt: step.task.prompt, answer: 'Барлық жұп сәйкестендірілді, бірақ бірнеше әрекетпен.', explain: step.task.explain });
    }
    persist();
  }

  function nextStep() {
    run.i++;
    if (run.i >= run.steps.length) finishRun(); else go('lesson');
  }

  function finishRun() {
    var p = profile();
    var t = now();
    var summary;
    if (run.mode === 'lesson') {
      summary = E.completeLesson(p, run.lesson, run.ctxKey, run.results, t, run.tier);
    } else {
      var ok = run.results.filter(function (r) { return r.ok; }).length;
      summary = { correct: ok, total: run.results.length };
    }
    persist();
    var finished = run;
    run = null;
    go('result', { run: finished, summary: summary });
  }

  function exitLesson() {
    FEA.ui.confirmDialog({ title: 'Сабақтан шығасыз ба?', text: 'Сабақ аяқталмаған болып қалады. Кейін қайта бастауға болады.', ok: 'Шығу', cancel: 'Жалғастыру' })
      .then(function (yes) { if (yes) { run = null; go('home'); } });
  }

  function screenLesson() {
    var step = run.steps[run.i];
    var progress = Math.round((run.i / run.steps.length) * 100);
    var title = run.mode === 'lesson' ? run.lesson.title : run.mode === 'practice' ? 'Өткенді жаттығу' : 'Қайталау';
    var content;

    if (step.kind === 'mission') content = missionView(run.lesson, run.ctxKey);
    else if (step.kind === 'story') content = storyView(step.story);
    else if (step.kind === 'intro') content = introView(run.lesson, run.ctxKey);
    else if (step.kind === 'text') content = h('section', null,
      h('h2', { class: 'task-prompt' }, (run.variant && run.variant.ctx && run.variant.ctx.textHeading) || 'Мәтінді оқыңыз'),
      run.variant && run.variant.ctx && run.variant.ctx.mission && run.variant.ctx.mode ? h('p', { class: 'mission-scene' }, run.variant.ctx.mission.scene) : null,
      h('p', { class: 'muted small' }, run.variant && run.variant.ctx && run.variant.ctx.mode
        ? 'Келесі қадамда осы мәліметке сүйеніп шешім қабылдайсыз. Әр сөзді аудару міндетті емес.'
        : 'Алдымен негізгі ойды түсінуге тырысыңыз. Әр сөзді аудару міндетті емес.'),
      textCard(step.text, false),
      h('button', { class: 'btn btn-primary btn-block', onclick: nextStep }, 'Сұрақтарға көшу →'));
    else {
      var phaseLabel = { warmup: 'Алдымен еске түсірейік', review: 'Қайталау', core: 'Жаттығу',
        challenge: 'Күрделірек тапсырма', practice: 'Жаттығу · нәтиже жазылмайды',
        context: run.variant && run.variant.ctx && run.variant.ctx.role ? 'Сіздің шешіміңіз · ' + run.variant.ctx.role : 'Мәтін бойынша' }[step.phase];
      content = h('div', null,
        h('div', { class: 'phase-label' }, phaseLabel),
        taskView(step.task, {
          text: step.text,
          dontKnow: step.task.type === 'choice' && (step.phase === 'warmup' || step.phase === 'review'),
          lesson: run.lesson, ctxKey: run.ctxKey,
          ladder: true,
          hint: step.hint || null,
          wrongNote: step.reviewId ? 'Бұл сұрақ ертең қайта шығады.' : 'Бұл тапсырма ертең қайталауға қосылады.',
          onResult: function (ok, ans, info) { recordResult(step, ok, ans, info); },
          onNext: nextStep,
          nextLabel: run.i === run.steps.length - 1 ? 'Аяқтау ✓' : 'Келесі →'
        }));
    }

    return [
      h('header', { class: 'lesson-top' },
        h('button', { class: 'icon-btn', 'aria-label': 'Сабақтан шығу', onclick: exitLesson }, icon('close')),
        h('div', { class: 'lesson-top-mid' },
          h('div', { class: 'lesson-top-title' }, title),
          h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Сабақ барысы', 'aria-valuenow': String(progress), 'aria-valuemin': '0', 'aria-valuemax': '100' },
            h('div', { class: 'progress-bar', style: 'width:' + progress + '%' }))),
        h('div', { class: 'lesson-top-count muted small' }, (run.i + 1) + '/' + run.steps.length)),
      storageBanner(),
      h('main', { class: 'page lesson-page' }, h('div', { class: 'card card-pad' }, content))
    ];
  }

  /*
   * Миссия: коротко — кто ученик, что сделать, какая языковая цель. Каждое — один раз.
   * Сюжет сцены варианта показывается позже, вместе с материалом.
   */
  function missionView(lesson, ctxKey) {
    var m = E.missionFor(lesson, ctxKey);
    var v = run.variant || variantInfo(lesson, ctxKey);
    var ctx = v.ctx || {};
    var isMission = variantKind(v) === 'mission';
    var note = variantNote(v);
    var others = E.lessonVariants(lesson).filter(function (x) { return x.key !== ctxKey; });
    return h('section', { class: 'mission' },
      h('p', { class: 'kicker' }, 'Миссия · ' + skillMeta(lesson.skill).title + ' · 5–10 мин'),
      h('h2', { class: 'mission-title' }, m.title),
      h('dl', { class: 'mission-facts' },
        isMission ? h('div', null, h('dt', null, 'Сіздің рөліңіз'), h('dd', null, ctx.role)) : null,
        h('div', null, h('dt', null, 'Не істейсіз'), h('dd', null, isMission && ctx.task ? ctx.task.charAt(0).toUpperCase() + ctx.task.slice(1) + '.' : m.scene)),
        m.canDo ? h('div', null, h('dt', null, 'Тіл мақсаты'), h('dd', null, m.canDo)) : null),
      note ? h('p', { class: 'note' }, note) : null,
      tierPicker(lesson),
      h('button', { class: 'btn btn-primary btn-block', onclick: nextStep }, 'Бастау'),
      others.length ? h('details', { class: 'variant-picker' },
        h('summary', null, 'Басқа рөл таңдау'),
        h('p', { class: 'muted small' }, 'Тіл мақсаты мен негізгі жаттығулар өзгермейді.'),
        h('div', { class: 'variant-list' }, others.map(function (x) {
          return h('button', { class: 'variant-option', onclick: function () { startLesson(lesson.id, x.key); } },
            h('span', { class: 'variant-option-title' }, x.action ? x.ctx.role : 'Мәтін: ' + (FEA.contextNames[x.key] || x.key)),
            h('span', { class: 'variant-option-sub' }, x.action ? x.ctx.task : 'тапсырма жалпы'));
        }))) : null);
  }

  /*
   * Выбор ступени задания на экране миссии (только у уроков с вызовом, только до начала).
   * Выбор запоминается для урока в profile.taskLevel; уровень языка и уроки не меняются.
   */
  function tierPicker(lesson) {
    var ch = E.challengeFor(lesson);
    if (!ch) return null;
    function opt(t, title, sub) {
      var on = run.tier === t;
      return h('button', { class: 'tier-option' + (on ? ' active' : ''), 'aria-pressed': on ? 'true' : 'false', onclick: function () {
        if (run.tier === t) return;
        var p = profile();
        p.taskLevel = p.taskLevel && typeof p.taskLevel === 'object' ? p.taskLevel : {};
        p.taskLevel[lesson.id] = t;
        persist();
        startLesson(lesson.id, run.pinnedCtx || undefined, t);
      } }, on ? icon('check') : null, h('span', { class: 'tier-title' }, title), h('span', { class: 'tier-sub' }, sub));
    }
    return h('div', { class: 'tier' },
      h('p', { class: 'tier-head' }, 'Тапсырма түрі'),
      h('div', { class: 'tier-options', role: 'group', 'aria-label': 'Тапсырма түрі' },
        opt('base', 'Негізгі', 'форма көрсетіледі'),
        opt('challenge', 'Күрделірек', ch.note)),
      h('p', { class: 'tier-fine' }, 'Тіл мақсаты бірдей. Деңгейіңіз бен прогресіңіз өзгермейді.'));
  }

  /*
   * «Сначала загадка — потом правило».
   * 1) несколько примеров с одной закономерностью и догадка ученика (без штрафа);
   * 2) обязательно — прямое правило простым казахским, пример и разбор частей;
   * 3) «Түсінбедім» — другой способ понять (простое объяснение, схема, сравнение, границы аналогии, проверка);
   * 4) попытка ученика на новом примере с лесенкой подсказок.
   * ex: { puzzle?, scene?, rule[], example, parts[], alt?, task }
   */
  function explainerView(ex, opts) {
    var root = h('section', { class: 'explainer' });
    var ruleShown = !ex.puzzle;

    function puzzleBlock() {
      var pz = ex.puzzle;
      var after = h('div', { class: 'puzzle-after hidden', 'aria-live': 'polite' });
      var btns = pz.options.map(function (o, i) {
        var b = h('button', { class: 'option' }, o);
        b.addEventListener('click', function () {
          btns.forEach(function (x, j) { x.disabled = true; if (j === pz.answer) x.classList.add('is-correct'); });
          if (i !== pz.answer) b.classList.add('is-guess');
          after.appendChild(h('p', { class: 'puzzle-verdict' }, i === pz.answer ? '✓ Жақсы болжам!' : 'Бұл болжам дәл емес — бұл қалыпты. Дұрыс заңдылық белгіленді.'));
          after.appendChild(h('p', null, pz.after));
          after.appendChild(h('button', { class: 'btn btn-primary btn-block', onclick: function () { this.disabled = true; ruleShown = true; draw(); } }, 'Ережені нақты көру →'));
          after.classList.remove('hidden');
        });
        return b;
      });
      return h('div', { class: 'puzzle' },
        h('div', { class: 'phase-label' }, 'Алдымен — тілдік жұмбақ'),
        h('p', null, pz.intro),
        h('div', { class: 'evidence-grid' }, pz.examples.map(function (e, i) {
          return h('div', { class: 'evidence' }, h('span', { class: 'evidence-no' }, String(i + 1)),
            h('div', { lang: 'en', class: 'ex-en' }, e.en), h('div', { class: 'ex-kk' }, e.kk));
        })),
        h('h3', { class: 'task-prompt' }, pz.question),
        h('div', { class: 'options' }, btns),
        after);
    }

    function ruleBlock() {
      var altBox = h('div', { class: 'alt-slot' });
      var altBtn = ex.alt ? h('button', { class: 'btn btn-ghost btn-block not-clear' }, 'Түсінбедім — басқаша түсіндіріңізші') : null;
      if (altBtn) altBtn.addEventListener('click', function () {
        altBtn.remove();
        altBox.appendChild(altPanel(ex.alt));
      });
      return h('div', { class: 'rule-block' },
        ex.scene ? h('p', { class: 'story-scene' }, ex.scene) : null,
        h('div', { class: 'rule-card' },
          h('div', { class: 'rule-card-label' }, 'Ереже'),
          h('ul', { class: 'rule-list' }, ex.rule.map(function (r) { return h('li', null, r); }))),
        h('div', { class: 'example big-example' }, h('div', { lang: 'en', class: 'ex-en' }, ex.example.en), h('div', { class: 'ex-kk' }, ex.example.kk)),
        h('div', { class: 'parts' }, ex.parts.map(function (pt) {
          return h('div', { class: 'part' }, h('span', { class: 'part-en', lang: 'en' }, pt.en), h('span', { class: 'part-kk' }, pt.kk));
        })),
        altBtn, altBox,
        h('h3', { class: 'sub' }, 'Енді өзіңіз'),
        taskView(ex.task, { ladder: true, onResult: opts.onResult || function () {}, onNext: opts.onDone, nextLabel: opts.doneLabel || 'Жалғастыру →' }));
    }

    // Загадка строится один раз; правило добавляется под ней после ответа
    function draw() {
      if (!ruleShown || root.querySelector('.rule-block')) return;
      var rb = ruleBlock();
      root.appendChild(rb);
      if (ex.puzzle && rb.scrollIntoView) rb.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
    if (ex.puzzle) root.appendChild(puzzleBlock());
    if (ruleShown) root.appendChild(ruleBlock());
    return root;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* «Түсінбедім»: другой способ понять то же правило. */
  function altPanel(alt) {
    return h('div', { class: 'alt-panel' },
      h('div', { class: 'alt-title' }, 'Басқаша айтқанда'),
      h('p', { class: 'alt-simple' }, alt.simple),
      alt.scheme ? schemeView(alt.scheme) : null,
      alt.compare ? h('div', { class: 'compare' },
        h('div', { class: 'compare-row' }, h('span', { class: 'compare-tag' }, 'ҚАЗ'), h('span', null, alt.compare.kk)),
        h('div', { class: 'compare-row' }, h('span', { class: 'compare-tag en' }, 'ENG'), h('span', { lang: 'en' }, alt.compare.en)),
        h('p', { class: 'small' }, alt.compare.note)) : null,
      alt.limits ? h('p', { class: 'limits' }, h('strong', null, 'Бұл түсіндірменің шегі: '), alt.limits) : null,
      alt.example ? h('div', { class: 'example' }, h('div', { lang: 'en', class: 'ex-en' }, alt.example.en), h('div', { class: 'ex-kk' }, alt.example.kk)) : null,
      alt.check ? h('div', { class: 'alt-check' }, h('div', { class: 'phase-label' }, 'Түсінгеніңізді тексеріңіз'),
        taskView(alt.check, { ladder: true, onResult: function () {}, onNext: function () {}, nextLabel: '✓ Түсінікті' })) : null);
  }

  /* Схема правила: «ячейки» предложения или линия времени. */
  function schemeView(sc) {
    if (sc.type === 'timeline') {
      return h('div', { class: 'scheme timeline', 'aria-label': 'Уақыт сызығы' },
        h('div', { class: 'tl-track' },
          h('div', { class: 'tl-long' }, h('span', { lang: 'en' }, sc.long), h('small', null, 'созылып жатқан әрекет')),
          h('div', { class: 'tl-point' }, h('span', { class: 'tl-bolt', 'aria-hidden': 'true' }), h('span', { lang: 'en' }, sc.point), h('small', null, 'кенет оқиға'))));
    }
    return h('div', { class: 'scheme slots' }, sc.rows.map(function (row) {
      return h('div', { class: 'slot-row' }, row.map(function (cell) {
        return h('div', { class: 'slot' }, h('span', { class: 'slot-t', lang: 'en' }, cell.t), cell.c ? h('span', { class: 'slot-c' }, cell.c) : null);
      }));
    }));
  }

  function storyView(story) {
    return h('section', { class: 'story' },
      h('div', { class: 'phase-label' }, 'Күрделі тақырып'),
      explainerView(story, { onDone: nextStep }));
  }

  function introView(lesson, ctxKey) {
    var w = E.lessonWords(lesson, ctxKey);
    function wordTile(x, theme) {
      return h('div', { class: 'word-tile' + (theme ? ' theme' : '') },
        h('div', { class: 'word-emoji', 'aria-hidden': 'true' }, x.emoji || '•'),
        h('div', { class: 'word-en', lang: 'en' }, x.en),
        h('div', { class: 'word-kk' }, x.kk),
        x.say ? h('div', { class: 'word-say' }, 'шамамен: «' + x.say + '»') : null);
    }
    return h('section', null,
      h('div', { class: 'goal' }, h('span', { class: 'goal-label' }, 'Сабақтың мақсаты'), h('p', null, lesson.goal)),
      lesson.prereq ? h('p', { class: 'banner banner-info' }, lesson.prereq) : null,
      h('h2', { class: 'task-prompt' }, lesson.title),
      lesson.story ? h('p', { class: 'muted small' }, 'Ережені жоғарыдағы оқиғадан көрдіңіз. Енді жаңа сөздер мен мысалдар.')
        : lesson.explain.map(function (para) { return h('p', null, para); }),
      h('h3', { class: 'sub' }, 'Мысалдар'),
      h('div', { class: 'examples' }, lesson.examples.map(function (ex) {
        return h('div', { class: 'example' }, h('div', { lang: 'en', class: 'ex-en' }, ex.en), h('div', { class: 'ex-kk' }, ex.kk));
      })),
      h('h3', { class: 'sub' }, 'Жаңа сөздер'),
      h('div', { class: 'word-grid' }, w.core.map(function (x) { return wordTile(x, false); }), w.theme.map(function (x) { return wordTile(x, true); })),
      w.theme.length ? h('p', { class: 'muted small' }, 'Белгіленген сөздер — сіз таңдаған тақырыптан.') : null,
      h('button', { class: 'btn btn-primary btn-block', onclick: nextStep }, 'Жаттығуларға көшу →'));
  }

  // ------------------------------------------------------------ ІС (демонстрационная миссия)
  var cs = null;   // { c, v, phase: 'intro'|'tool'|'scene'|'unlock'|'finale', i }

  function caseRecord(p, c) {
    p.cases = p.cases || {};
    return p.cases[c.id] || null;
  }

  function openCase(id) {
    var p = profile();
    var c = E.getCase(id);
    var rec = caseRecord(p, c);
    // Незавершённое прохождение продолжается с сохранённого места
    var resume = rec && !rec.done && (rec.toolDone || rec.scene > 0);
    var v = resume ? c.versions.filter(function (x) { return x.stage === rec.version; })[0] : E.caseVersionFor(p, c);
    cs = { c: c, v: v, phase: 'intro', i: resume ? rec.scene : 0, toolDone: !!(resume && rec.toolDone) };
    go('case');
  }

  function saveCase(extra) {
    var p = profile();
    p.cases = p.cases || {};
    var old = p.cases[cs.c.id] || {};
    p.cases[cs.c.id] = Object.assign({}, old, { version: cs.v.stage, scene: cs.i, toolDone: cs.toolDone, updatedAt: now() }, extra || {});
    persist();
  }

  function routeView() {
    var steps = [{ title: 'Тілдік құрал' }].concat(cs.v.scenes.map(function (sc) { return { icon: sc.icon, title: sc.title }; }), [{ title: 'Шешім' }]);
    var current = cs.phase === 'intro' ? -1 : cs.phase === 'tool' ? 0 : cs.phase === 'finale' ? steps.length - 1 : cs.i + 1;
    var cur = steps[Math.max(0, current)];
    return [h('ol', { class: 'route', 'aria-label': 'Іс маршруты' }, steps.map(function (st, k) {
      var state = k < current || (cs.phase === 'unlock' && k === current) ? 'done' : k === current ? 'current' : 'locked';
      return h('li', { class: 'route-step ' + state, 'aria-current': state === 'current' ? 'step' : null },
        h('span', { class: 'route-dot', 'aria-hidden': 'true' }, state === 'done' ? icon('check') : String(k + 1).padStart(2, '0')),
        h('span', { class: 'route-title' }, st.title));
    })),
    current >= 0 ? h('p', { class: 'route-caption', 'aria-hidden': 'true' }, 'Қадам ' + (current + 1) + ' / ' + steps.length + ' · ', h('strong', null, cur.title)) : null];
  }

  function clueCard(clue, n) {
    return h('div', { class: 'clue' },
      h('div', { class: 'clue-tab' }, clue.label),
      h('div', { class: clue.sign ? 'sign' : 'clue-text', lang: 'en' }, clue.lines.map(function (l) { return h(clue.sign ? 'div' : 'p', null, l); })),
      glossary(clue.glossary));
  }

  function screenCase() {
    var p = profile();
    var c = cs.c, v = cs.v;
    var head = h('header', { class: 'case-head' },
      h('button', { class: 'icon-btn', 'aria-label': 'Істен шығу', onclick: function () { cs = null; go('home'); } }, icon('close')),
      h('div', { class: 'case-head-mid' },
        h('div', { class: 'case-no' }, 'ІС ' + c.caseNo), h('div', { class: 'case-title' }, c.title)),
      h('div', { class: 'case-ver small' }, stageLabel(v.stage)));
    var body;

    if (cs.phase === 'intro') {
      var rec = caseRecord(p, c);
      body = h('div', { class: 'case-file' },
        h('div', { class: 'stamp' + (rec && rec.solved && rec.solved.length ? ' done' : '') }, rec && rec.solved && rec.solved.length ? 'ШЕШІЛДІ' : 'АШЫҚ ІС'),
        h('h1', null, c.title),
        h('p', { class: 'lead' }, c.intro),
        h('div', { class: 'goal' }, h('span', { class: 'goal-label' }, 'Тілдік мақсат'), h('p', null, c.goal)),
        h('div', { class: 'version-card' },
          h('div', { class: 'small muted' }, 'Сіздің нұсқаңыз (профиліңіздің оқу сатысы бойынша):'),
          h('strong', null, v.label + ' · ' + stageLabel(v.stage)),
          h('p', { class: 'small' }, v.supports),
          h('div', { class: 'small muted' }, 'Басқа нұсқа таңдауға болады — сюжет пен мақсат бірдей, тек іздер мен көмек өзгереді:'),
          h('div', { class: 'chips' }, c.versions.map(function (x) {
            return h('button', { class: 'chip' + (x.stage === v.stage ? ' chip-on' : ''), 'aria-pressed': x.stage === v.stage ? 'true' : 'false', onclick: function () {
              cs.v = x; cs.i = 0; cs.toolDone = false; render();
            } }, x.label);
          }))),
        routeView(),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () {
          cs.phase = cs.toolDone ? 'scene' : 'tool'; saveCase({ done: false }); render(); window.scrollTo(0, 0);
        } }, cs.toolDone || cs.i > 0 ? 'Тергеуді жалғастыру →' : 'Істі ашу →'));
    } else if (cs.phase === 'tool') {
      body = h('div', null, routeView(),
        h('div', { class: 'card card-pad' },
          h('div', { class: 'phase-label' }, 'Тергеушінің тілдік құралы'),
          h('p', { class: 'muted small' }, 'Іздерді түсіну үшін алдымен бір тілдік құралды меңгерейік.'),
          explainerView(v.explainer, { doneLabel: 'Бірінші ізге →', onDone: function () {
            cs.toolDone = true; cs.phase = 'scene'; cs.i = 0; saveCase(); render(); window.scrollTo(0, 0);
          } })));
    } else if (cs.phase === 'scene') {
      var sc = v.scenes[cs.i];
      body = h('div', null, routeView(),
        h('div', { class: 'card card-pad scene' },
          h('div', { class: 'scene-place' }, icon('pin'), sc.place),
          h('h2', null, sc.title),
          clueCard(sc.clue),
          h('div', { class: 'phase-label' }, 'Сіздің әрекетіңіз'),
          taskView(E.caseSceneTask(sc), {
            ladder: true,
            wrongNote: 'Іс жалғасады. Бұл із ертең қайталауда тағы шығады.',
            onResult: function (ok, ans, info) {
              var t = now();
              if (!ok) {
                E.scheduleCaseMistake(p, c.id, v.stage, cs.i, t);
                E.addMistake(p, { at: t, where: 'Іс ' + c.caseNo + ': ' + c.title + (info.final ? ' · кеңеспен табылды' : ''),
                  prompt: sc.task.prompt + (sc.task.sentence ? ' ' + sc.task.sentence : ''),
                  answer: sc.task.type === 'choice' ? sc.task.options[sc.task.answer] : sc.task.type === 'type' ? sc.task.answers[0] : sc.task.answer,
                  explain: sc.task.explain });
              }
              persist();
            },
            onNext: function () {
              // Улика решена: при возврате ученик продолжит со следующей
              saveCase({ scene: Math.min(cs.i + 1, v.scenes.length - 1) });
              cs.phase = 'unlock'; render(); window.scrollTo(0, 0);
            },
            nextLabel: 'Із ашылды →'
          })));
    } else if (cs.phase === 'unlock') {
      var sc2 = v.scenes[cs.i];
      var last = cs.i === v.scenes.length - 1;
      body = h('div', null, routeView(),
        h('div', { class: 'card card-pad unlock' },
          h('div', { class: 'unlock-badge' }, 'Жаңа мәлімет'),
          h('p', { class: 'unlock-text' }, sc2.unlock),
          h('button', { class: 'btn btn-primary btn-block', onclick: function () {
            if (last) {
              var old = (p.cases && p.cases[c.id]) || {};
              var solved = (old.solved || []).filter(function (x) { return x !== v.stage; }).concat([v.stage]);
              cs.phase = 'finale'; cs.i = 0; cs.toolDone = false;
              saveCase({ done: true, completedAt: now(), solved: solved });
            }
            else { cs.i++; cs.phase = 'scene'; saveCase(); }
            render(); window.scrollTo(0, 0);
          } }, last ? 'Істің шешімі →' : 'Келесі із →')));
    } else {
      var idx = Math.max(0, c.versions.indexOf(v));
      body = h('div', null, routeView(),
        h('div', { class: 'card card-pad case-file finale' },
          h('div', { class: 'stamp done' }, 'ІС ЖАБЫЛДЫ'),
          h('h2', null, 'Шешім'),
          h('div', { class: 'clue-text', lang: 'en' }, v.finale.lines.map(function (l) { return h('p', null, l); })),
          h('p', null, v.finale.kk),
          h('div', { class: 'goal can-do' }, h('span', { class: 'goal-label' }, 'Енді сіз:'), h('p', null, v.canDo))),
        h('div', { class: 'card card-pad' },
          h('h2', null, 'Осы тілдік құрал басқа тақырыпта'),
          h('p', { class: 'muted small' }, 'Сол мақсат — басқа жағдай мен басқа әрекет:'),
          h('div', { class: 'transfer-grid' }, c.transfer.map(function (t) {
            return h('div', { class: 'transfer' }, h('div', { class: 'transfer-head' }, t.theme),
              h('p', { class: 'small' }, t.action), h('div', { class: 'ex-en', lang: 'en' }, t.examples[idx] || t.examples[0]));
          }))),
        h('details', { class: 'card card-pad discussion' },
          h('summary', null, 'Отбасымен талқылау (міндетті емес)'),
          c.discussion.map(function (d) { return h('p', null, d); })),
        h('div', { class: 'stack' },
          h('button', { class: 'btn btn-primary btn-block', onclick: function () { cs = null; go('home'); } }, 'Басты бетке'),
          h('button', { class: 'btn btn-ghost btn-block', onclick: function () { cs.phase = 'intro'; cs.i = 0; cs.toolDone = false; render(); window.scrollTo(0, 0); } }, 'Басқа нұсқамен қайта ойнау')));
    }
    return [head, storageBanner(), h('main', { class: 'page case-page' }, body)];
  }

  // ------------------------------------------------------------ НӘТИЖЕ
  function screenResult() {
    var r = route.params.run, s = route.params.summary;
    var p = profile();
    var lessonMistakes = r.mistakes || [];
    var rec = E.recommendNext(p, now());
    var isLesson = r.mode === 'lesson';

    return page([
      h('section', { class: 'card card-pad result' },
        h('div', { class: 'result-icon', 'aria-hidden': 'true' }, icon('check')),
        h('h1', null, isLesson ? 'Миссия орындалды!' : r.mode === 'practice' ? 'Жаттығу аяқталды!' : 'Қайталау аяқталды!'),
        r.mode === 'practice' ? h('p', { class: 'muted small' }, 'Жаттығу нәтижесі сақталмайды: қайталау кестесі мен прогресс өзгермеді.') : null,
        isLesson ? h('p', { class: 'muted' }, '«' + r.lesson.title + '» — ', h('strong', null, 'өтілді деп белгіленді.')) : null,
        isLesson && r.lesson.canDo ? h('div', { class: 'goal can-do' }, h('span', { class: 'goal-label' }, 'Енді сіз:'), h('p', null, r.lesson.canDo)) : null,
        h('p', { class: 'result-score' }, 'Бірінші әрекеттен дұрыс: ', h('strong', null, s.correct + ' / ' + s.total)),
        h('p', { class: 'muted small' }, s.total && s.correct / s.total < 0.6
          ? 'Бұл тақырып әлі жаңа — бұл қалыпты. Қайталау оны бекітуге көмектеседі.'
          : 'Жақсы нәтиже. Бірнеше күннен кейінгі қайталау оны есте берік сақтауға көмектеседі.'),
        isLesson ? h('p', { class: 'small' }, 'Бұл сабақтың сұрақтары ертеңнен бастап қайталауға қосылды.') : null,
        isLesson && r.newReviews ? h('p', { class: 'small' }, 'Қате кеткен ' + r.newReviews + ' тапсырма ертең қайталауда қайта шығады.') : null),
      h('section', { class: 'card card-pad' },
        h('h2', null, 'Қателер және түсіндірме'),
        lessonMistakes.length ? h('div', { class: 'mistake-list' }, lessonMistakes.map(mistakeItem))
          : h('p', { class: 'empty' }, 'Бұл жолы қате болмады.')),
      h('div', { class: 'stack' },
        rec.kind === 'lesson' ? h('button', { class: 'btn btn-primary btn-block', onclick: function () { startLesson(rec.lesson.id); } }, 'Келесі сабақ: ' + rec.lesson.title) : null,
        rec.kind === 'review' ? h('button', { class: 'btn btn-primary btn-block', onclick: function () { startReview(); } }, 'Қайталауды бастау') : null,
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('home'); } }, 'Басты бетке'))
    ]);
  }

  function mistakeItem(m) {
    return h('div', { class: 'mistake' },
      h('div', { class: 'muted small' }, m.where),
      h('div', { class: 'mistake-prompt' }, m.prompt),
      m.given ? h('div', { class: 'small' }, 'Сіздің жауабыңыз: ', h('span', { lang: 'en' }, m.given)) : null,
      h('div', { class: 'small' }, 'Дұрыс жауап: ', h('strong', { lang: 'en' }, m.answer)),
      m.explain ? h('p', { class: 'small muted' }, m.explain) : null);
  }

  // ------------------------------------------------------------ ПРОГРЕСС ЖӘНЕ БАПТАУЛАР
  function screenProgress() {
    var p = profile();
    var t = now();
    var due = E.countDue(p, t);
    var completed = Object.keys(p.lessons).map(function (id) { return { lesson: E.getLesson(id), rec: p.lessons[id] }; })
      .filter(function (x) { return x.lesson; })
      .sort(function (a, b) { return (b.rec.completedAtMs || 0) - (a.rec.completedAtMs || 0); });

    var solvedCases = (FEA.cases || []).filter(function (c) { var r = (p.cases || {})[c.id]; return r && r.solved && r.solved.length; }).length;
    var words = Object.keys(p.vocab || {}).filter(function (k) { return p.vocab[k].known; }).length;
    return page([
      h('h1', null, 'Прогресс'),
      h('dl', { class: 'stats' },
        h('div', null, h('dt', null, 'Өтілген сабақ'), h('dd', null, String(completed.length))),
        h('div', null, h('dt', null, 'Бүгін қайталау'), h('dd', null, String(due))),
        h('div', null, h('dt', null, 'Білетін сөз'), h('dd', null, String(words))),
        h('div', null, h('dt', null, 'Шешілген іс'), h('dd', null, String(solvedCases)))),

      due ? h('button', { class: 'btn btn-secondary btn-block', onclick: function () { startReview(); } }, icon('review'), 'Қазір қайталау · ' + due + ' сұрақ') : null,
      completed.length ? h('button', { class: 'btn btn-ghost btn-block', onclick: startPractice }, 'Өткен сөздер мен ережелерді жаттығу') : null,
      canDoSection(p),
      h('section', { class: 'card card-pad' },
        h('h2', null, 'Дағдылар бойынша саты'),
        h('p', { class: 'muted small' }, 'Саты автоматты түрде өзгермейді. Жүйе тек ұсыныс береді, шешімді өзіңіз қабылдайсыз.'),
        E.SKILL_ORDER.map(function (s) {
          var sm = skillMeta(s);
          var prop = E.stageProposal(p, s);
          var stageBox = h('div');
          function redraw() {
            stageBox.innerHTML = '';
            stageBox.appendChild(stageStepperConfirm(s, redraw));
          }
          redraw();
          return h('div', { class: 'skill-progress skill-' + s },
            h('div', { class: 'skill-result-head' }, h('span', { class: 'skill-icon' }, icon(s)), h('strong', null, sm.title)),
            stageBox,
            prop ? h('p', { class: 'banner ' + (prop.dir === 'up' ? 'banner-ok' : 'banner-info') }, prop.text) : null);
        }),
        h('p', { class: 'muted small' }, FEA.cefrDisclaimer)),


      h('section', { class: 'card card-pad' },
        h('h2', null, 'Соңғы қателер'),
        (p.mistakes || []).length ? h('div', { class: 'mistake-list' }, p.mistakes.slice(0, 8).map(mistakeItem))
          : h('p', { class: 'empty' }, 'Қате әзірге жоқ.')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Профиль'),
        h('div', { class: 'list-row' }, h('span', null, 'Аты: ', h('strong', null, p.name)),
          h('button', { class: 'btn btn-ghost btn-small', onclick: function () { go('name', { edit: true }); } }, 'Өзгерту')),
        h('div', { class: 'list-row' }, h('span', null, 'Қызығушылықтар: ', h('strong', null, interestsSummary(p) || '—')),
          h('button', { class: 'btn btn-ghost btn-small', onclick: function () { go('interest', { edit: true }); } }, 'Өзгерту')),
        h('p', { class: 'muted small' }, 'Кей сабақтарда қызығушылық рөл мен тапсырманы өзгертеді, кейбірінде тек мәтін тақырыбын, қалғандары — жалпы. Саты, сабақтар реті және тіл мақсаты өзгермейді.'),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('profiles'); } }, 'Профильді ауыстыру немесе жаңасын қосу')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Деректер'),
        h('p', { class: 'small' }, 'Прогресс тек осы құрылғыда, осы браузерде сақталады. Басқа құрылғыға автоматты түрде көшпейді.'),
        h('div', { class: 'backup-box' },
          h('h3', { class: 'sub' }, 'Сақтық көшірме'),
          h('p', { class: 'small muted' }, 'Файл тек сіздің құрылғыңызға жүктеледі. Ешқайда жіберілмейді.'),
          h('div', { class: 'row-gap' },
            h('button', { class: 'btn btn-secondary', onclick: downloadBackup }, icon('save'), 'Сақтық көшірме жасау'),
            h('button', { class: 'btn btn-ghost', onclick: pickBackupFile }, icon('upload'), 'Қалпына келтіру'))),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () {
          FEA.ui.confirmDialog({ title: 'Осы профильдің прогресін тазалау керек пе?', text: '«' + p.name + '» профилінің диагностикасы, сабақтары, қайталаулары мен қателері өшіріледі. Аты мен қызығушылығы қалады.', ok: 'Тазалау', danger: true })
            .then(function (yes) {
              if (!yes) return;
              var fresh = store.newProfile(p.name, p.presetLevel);
              fresh.id = p.id; fresh.interest = p.interest; fresh.otherTopic = p.otherTopic;
              fresh.interests = Array.isArray(p.interests) ? p.interests.slice() : null;
              if (!fresh.stages) fresh.stages = Object.assign({}, p.stages);
              state.profiles[p.id] = fresh; persist(); go('diagIntro');
            });
        } }, 'Осы профильдің прогресін тазалау'),
        h('button', { class: 'btn btn-danger btn-block', onclick: function () {
          FEA.ui.confirmDialog({ title: 'Барлық деректерді өшіру керек пе?', text: 'Осы құрылғыдағы осы қосымшаның барлық профильдері мен прогресі өшіріледі. Басқа сайттар мен файлдарға әсер етпейді. Бұл әрекетті қайтару мүмкін емес.', ok: 'Барлығын өшіру', danger: true })
            .then(function (yes) { if (!yes) return; store.clearAll(); state = store.load(); go('welcome'); });
        } }, 'Осы құрылғыдағы барлық деректерді өшіру'))
    ], 'progress');
  }

  /* Идея «Мен не істей аламын»: практические результаты пройденных миссий и следующая миссия по каждому навыку. */
  function canDoSection(p) {
    return h('section', { class: 'card card-pad' },
      h('h2', null, FEA.canDoTitle),
      h('p', { class: 'muted small' }, 'Әр орындалған миссиядан кейін ағылшынша не істей алатыныңыз. Бұл ұпай емес — нақты дағды.'),
      (FEA.cases || []).filter(function (c) { var r = p.cases && p.cases[c.id]; return r && r.solved && r.solved.length; }).map(function (c) {
        var solved = p.cases[c.id].solved;
        var v = c.versions.filter(function (x) { return x.stage === solved[solved.length - 1]; })[0] || c.versions[0];
        return h('div', { class: 'cando-skill cando-case' }, h('strong', null, 'Іс ' + c.caseNo + ': ' + c.title), h('ul', { class: 'cando-list' }, h('li', null, icon('check'), h('span', null, v.canDo))));
      }),
      E.SKILL_ORDER.map(function (s) {
        var done = E.lessonsForSkill(s).filter(function (l) { return p.lessons[l.id]; });
        var next = E.nextLessonFor(p, s);
        return h('div', { class: 'cando-skill skill-' + s },
          h('div', { class: 'skill-result-head' }, h('span', { class: 'skill-icon' }, icon(s)), h('strong', null, skillMeta(s).title)),
          done.length ? h('ul', { class: 'cando-list' }, done.map(function (l) { return h('li', null, icon('check'), h('span', null, l.canDo || l.title)); }))
            : h('p', { class: 'empty small' }, 'Әзірге орындалған миссия жоқ.'),
          next ? h('div', { class: 'cando-next' },
            h('span', { class: 'small' }, 'Келесі миссия: ', h('strong', null, E.missionFor(next, E.pickVariant(next, p).key).title)),
            h('button', { class: 'btn btn-secondary btn-small', onclick: function () { startLesson(next.id); } }, 'Бастау')) : null);
      }));
  }

  // ------------------------------------------------------------ сақтық көшірме
  function downloadBackup() {
    var text = store.exportBackup(state);
    var blob = new Blob([text], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'family-english-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function pickBackupFile() {
    var input = h('input', { type: 'file', accept: 'application/json,.json', class: 'hidden' });
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      input.remove();
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () { go('restore', { parsed: store.parseBackup(String(reader.result), state), fileName: f.name }); };
      reader.onerror = function () { go('restore', { parsed: { ok: false, error: 'Файлды оқу мүмкін болмады.' }, fileName: f.name }); };
      reader.readAsText(f);
    });
    document.body.appendChild(input);
    input.click();
  }

  /* Предпросмотр восстановления: ничего не меняется без явного действия. */
  function screenRestore() {
    var parsed = route.params.parsed;
    var back = h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go(profile() ? 'progress' : 'welcome'); } }, 'Бас тарту — ештеңе өзгермейді');
    if (!parsed || !parsed.ok) {
      return page([h('section', { class: 'card card-pad' },
        h('h1', null, 'Файлды қалпына келтіру мүмкін емес'),
        h('p', null, parsed ? parsed.error : 'Файл таңдалмады.'),
        h('p', { class: 'muted small' }, 'Құрылғыдағы деректер өзгерген жоқ.'),
        back)]);
    }
    var news = parsed.summary.filter(function (x) { return x.status === 'new'; });
    var conflicts = parsed.summary.filter(function (x) { return x.status !== 'new'; });
    var statusText = { 'new': 'жаңа профиль — қосылады', 'same-id': 'бұл профиль құрылғыда бар', 'same-name': 'осы атпен профиль бар' };
    return page([h('section', { class: 'card card-pad' },
      h('p', { class: 'step-label' }, 'Қалпына келтіру · алдын ала қарау'),
      h('h1', null, 'Файлда не бар?'),
      h('p', { class: 'small muted' }, (route.params.fileName || '') + (parsed.exportedAt ? ' · ' + parsed.exportedAt.slice(0, 10) : '')),
      h('div', { class: 'list' }, parsed.summary.map(function (x) {
        return h('div', { class: 'list-row restore-row ' + x.status },
          h('span', null, h('strong', null, x.name), h('span', { class: 'small muted' }, ' · ' + statusText[x.status])),
          h('span', { class: 'small muted' }, x.lessons + ' сабақ · ' + x.reviews + ' қайталау · ' + x.mistakes + ' қате'));
      })),
      conflicts.length ? h('div', { class: 'banner banner-info' },
        h('strong', null, 'Біріктіру туралы: '),
        'бұл профильдер құрылғыда бұрыннан бар: ' + conflicts.map(function (x) { return x.name; }).join(', ') + '. ' +
        'Қай прогресті сақтау керегін автоматты түрде анықтау мүмкін емес, сондықтан қауіпсіз біріктіруде олар өзгертілмейді. ' +
        'Оларды файлдағы нұсқамен ауыстыру үшін ғана «Барлығын ауыстыру» керек — бұл құрылғыдағы қазіргі деректерді өшіреді.') : null,
      h('div', { class: 'stack' },
        news.length ? h('button', { class: 'btn btn-primary btn-block', onclick: function () {
          var added = store.mergeNewProfiles(state, parsed);
          persist();
          FEA.ui.confirmDialog({ title: 'Қосылды', text: 'Жаңа профильдер: ' + added.join(', ') + '. Қазіргі профильдер өзгерген жоқ.', ok: 'Жақсы', cancel: 'Жабу' })
            .then(function () { go(profile() ? 'progress' : 'profiles'); });
        } }, 'Тек жаңа профильдерді қосу (' + news.length + ')') : h('p', { class: 'small muted' }, 'Файлда жаңа профиль жоқ: барлығы құрылғыда бар.'),
        h('button', { class: 'btn btn-secondary btn-block', onclick: downloadBackup }, icon('save'), 'Алдымен қазіргі деректердің көшірмесін жасау'),
        h('button', { class: 'btn btn-danger btn-block', onclick: function () {
          FEA.ui.confirmDialog({ title: 'Барлық деректерді файлмен ауыстыру керек пе?',
            text: 'Осы құрылғыдағы барлық профильдер мен прогресс файлдағы деректермен алмастырылады. Қазіргі деректерді қайтару мүмкін болмайды, егер алдымен көшірме жасамасаңыз.',
            ok: 'Иә, ауыстыру', danger: true })
            .then(function (yes) {
              if (!yes) return;
              state = parsed.data;
              if (!state.profiles[state.activeProfileId]) state.activeProfileId = null;
              persist();
              go(startRoute());
            });
        } }, 'Барлығын файлмен ауыстыру'),
        back))]);
  }

  function stageStepperConfirm(skill, redraw) {
    var p = profile();
    var val = p.stages[skill];
    function change(delta) {
      var target = val + delta;
      FEA.ui.confirmDialog({
        title: delta > 0 ? 'Қиынырақ сатыға ауысу керек пе?' : 'Жеңілірек сатыға ауысу керек пе?',
        text: '«' + skillMeta(skill).title + '»: ' + stageLabel(val) + ' → ' + stageLabel(target) + '. Өтілген сабақтар мен қайталаулар сақталады.',
        ok: 'Ауысу'
      }).then(function (yes) { if (yes) { p.stages[skill] = target; persist(); render(); } });
    }
    return h('div', { class: 'stepper' },
      h('div', null, h('div', { class: 'stage-name' }, stageLabel(val)), h('div', { class: 'muted small' }, stageMeta(val).cefrHint)),
      h('div', { class: 'row-gap' },
        h('button', { class: 'btn btn-ghost btn-small', disabled: val <= 0, onclick: function () { change(-1); } }, '− Жеңілірек'),
        h('button', { class: 'btn btn-ghost btn-small', disabled: val >= FEA.stages.length - 1, onclick: function () { change(1); } }, 'Қиынырақ +')));
  }

  // ------------------------------------------------------------ рендер
  var screens = {
    welcome: screenWelcome, name: screenName, interest: screenInterest, profiles: screenProfiles,
    diagIntro: screenDiagIntro, diag: screenDiag, diagResult: screenDiagResult,
    home: screenHome, skills: screenSkills, dictionary: screenDictionary, lesson: screenLesson, result: screenResult, progress: screenProgress,
    'case': screenCase, restore: screenRestore
  };

  function render() {
    var needsProfile = ['home', 'skills', 'dictionary', 'progress', 'diagIntro', 'diag', 'diagResult', 'interest', 'lesson', 'result', 'case'];
    if (needsProfile.indexOf(route.name) !== -1 && !profile()) route = { name: startRoute(), params: {} };
    if (['home', 'skills', 'dictionary', 'progress'].indexOf(route.name) !== -1) {
      var p = profile();
      if (!E.hasInterestChoice(p)) route = { name: 'interest', params: {} };
      else if (!p.stages || !p.diagnostic) route = { name: 'diagIntro', params: {} };
    }
    if (route.name === 'lesson' && !run) route = { name: 'home', params: {} };
    if (route.name === 'case' && (!cs || !profile())) route = { name: 'home', params: {} };
    if (route.name === 'result' && !route.params.run) route = { name: 'home', params: {} };
    if (route.name === 'diag' && !diag) {
      diag = { i: 0, correct: { words: 0, grammar: 0, reading: 0 }, wrongInRow: { words: 0, grammar: 0, reading: 0 }, wrongIds: [], stoppedParts: [] };
    }
    var fn = screens[route.name] || screenWelcome;
    var out = fn();
    root.innerHTML = '';
    var list = Array.isArray(out) ? out : [out];
    list.forEach(function (n) { if (n) root.appendChild(n); });
    root.setAttribute('data-screen', route.name);
  }

  // Старт: загрузочный экран уже показан в index.html
  try {
    go(startRoute());
  } catch (e) {
    root.innerHTML = '';
    root.appendChild(h('div', { class: 'page' }, h('div', { class: 'card card-pad' },
      h('h1', null, 'Қате орын алды'),
      h('p', null, 'Қосымшаны жүктеу мүмкін болмады. Бетті жаңартып көріңіз.'),
      h('pre', { class: 'small muted' }, String(e && e.message || e)))));
    throw e;
  }
})();
