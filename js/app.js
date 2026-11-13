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
  function interestMeta(id) { return FEA.interests.filter(function (i) { return i.id === id; })[0]; }

  function go(name, params) {
    route = { name: name, params: params || {} };
    render();
    window.scrollTo(0, 0);
  }

  function startRoute() {
    var p = profile();
    if (!p) return Object.keys(state.profiles).length ? 'profiles' : 'welcome';
    if (!p.interest) return 'interest';
    if (!p.stages || !p.diagnostic) return 'diagIntro';
    return 'home';
  }

  // ------------------------------------------------------------ общие элементы
  var LOGO_SVG =
    '<svg viewBox="0 0 120 80" aria-hidden="true" focusable="false">' +
    '<circle cx="92" cy="22" r="14" fill="var(--sun)"/>' +
    '<path d="M10 64 Q40 30 70 64 Z" fill="var(--hill1)"/>' +
    '<path d="M44 66 Q78 36 112 66 Z" fill="var(--hill2)"/>' +
    '<rect x="30" y="48" width="44" height="26" rx="4" fill="var(--card)" stroke="var(--accent)" stroke-width="2.5"/>' +
    '<path d="M52 50 V72" stroke="var(--accent)" stroke-width="2.5"/>' +
    '<path d="M36 56 H48 M36 62 H48 M56 56 H68 M56 62 H68" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';

  function topbar() {
    var p = profile();
    return h('header', { class: 'topbar' },
      h('div', { class: 'brand' }, h('span', { class: 'brand-mark', html: LOGO_SVG }), h('span', null, 'Отбасылық ағылшын')),
      p ? h('button', { class: 'chip chip-profile', onclick: function () {
        // Пока настройка профиля не закончена, кнопка ведёт к списку профилей (можно выбрать другой)
        go(p.interest && p.stages && p.diagnostic ? 'progress' : 'profiles');
      }, 'aria-label': 'Профиль және баптаулар' }, '👤 ' + p.name) : null
    );
  }

  function bottomNav(active) {
    function item(name, icon, label) {
      return h('button', { class: 'nav-item' + (active === name ? ' active' : ''), onclick: function () { go(name); }, 'aria-current': active === name ? 'page' : null },
        h('span', { class: 'nav-icon', 'aria-hidden': 'true' }, icon), h('span', null, label));
    }
    return h('nav', { class: 'bottom-nav', 'aria-label': 'Негізгі мәзір' },
      item('home', '🏠', 'Басты бет'),
      item('skills', '🧭', 'Дағдылар'),
      item('progress', '📈', 'Прогресс'));
  }

  function storageBanner() {
    if (store.isAvailable()) return null;
    return h('div', { class: 'banner banner-warn', role: 'status' },
      'Бұл браузерде деректерді сақтау мүмкін емес. Беттің жабылуымен прогресс жоғалады.');
  }

  function page(children, navActive) {
    return [topbar(), storageBanner(), h('main', { class: 'page' }, children), navActive ? bottomNav(navActive) : null];
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
    var hintBtn = ladder ? h('button', { class: 'btn btn-ghost btn-small hint-btn' }, '💡 Кеңес керек') : null;
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
      var head = finalOk ? (firstTryOk ? '✓ Дұрыс!' : '✓ Дұрыс! Кеңеспен өзіңіз таптыңыз.') : '📘 Шешімін бірге қарайық';
      feedback.appendChild(h('div', { class: 'feedback ' + (finalOk ? 'feedback-ok' : 'feedback-solution') },
        h('div', { class: 'feedback-head' }, head),
        !finalOk && correctText ? h('div', { class: 'feedback-answer' }, 'Шешімі: ', h('strong', { lang: 'en' }, correctText)) : null,
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
        retryNote.textContent = 'Әлі емес — бұл қалыпты. Кеңесті оқып, тағы бір рет байқап көріңіз.';
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
      return h('details', { class: 'text-card compact', open: true }, h('summary', null, '📖 Мәтін'), inner);
    }
    return h('div', { class: 'text-card' }, inner);
  }

  // ------------------------------------------------------------ ПРИВЕТСТВИЕ И ПРОФИЛЬ
  function screenWelcome() {
    var hasProfiles = Object.keys(state.profiles).length > 0;
    return page([
      h('section', { class: 'hero' },
        h('div', { class: 'hero-art', html: LOGO_SVG }),
        h('h1', null, 'Сәлеметсіз бе! 👋'),
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

  function screenInterest() {
    var p = profile();
    var editing = route.params.edit;
    var selected = p.interest || null;
    var topic = p.otherTopic || '';
    var cards = {};
    var otherBox = h('div', { class: 'other-box' + (selected === 'other' ? '' : ' hidden') });
    var topicInput = h('input', { class: 'text-input', type: 'text', maxlength: '40', placeholder: 'Өз тақырыбыңызды жазыңыз', value: topic, 'aria-label': 'Өз тақырыбыңыз' });
    var next = h('button', { class: 'btn btn-primary btn-block', disabled: !selected }, editing ? 'Сақтау' : 'Жалғастыру');

    otherBox.appendChild(h('div', { class: 'chips' }, FEA.otherTopics.map(function (t) {
      return h('button', { class: 'chip', onclick: function () { topicInput.value = t; } }, t);
    })));
    otherBox.appendChild(topicInput);
    otherBox.appendChild(h('p', { class: 'muted small' }, 'Өз тақырыбыңызға арналған мәтіндер автоматты түрде жасалмайды. Дайын мәтін болмаса, сабақта жалпы мәтін беріледі — бұл сабақтың басында көрсетіледі.'));

    function pick(id) {
      selected = id;
      Object.keys(cards).forEach(function (k) { cards[k].classList.toggle('selected', k === id); cards[k].setAttribute('aria-pressed', k === id ? 'true' : 'false'); });
      otherBox.classList.toggle('hidden', id !== 'other');
      next.disabled = false;
    }

    next.addEventListener('click', function () {
      p.interest = selected;
      p.otherTopic = selected === 'other' ? topicInput.value.trim().slice(0, 40) : '';
      persist();
      go(editing ? 'progress' : startRoute());
    });

    return page([
      h('section', { class: 'card card-pad' },
        h('p', { class: 'step-label' }, editing ? 'Қызығушылық' : '2-қадам / 3'),
        h('h1', null, 'Сізге не қызық?'),
        h('p', { class: 'muted' }, 'Қызығушылық мәтіндердің тақырыбын, мысалдарды және тақырыптық сөздердің бір бөлігін өзгертеді. Сабақтардың реті мен күрделілігі өзгермейді.'),
        h('div', { class: 'interest-grid' }, FEA.interests.map(function (it) {
          var c = h('button', { class: 'interest-card' + (selected === it.id ? ' selected' : ''), 'aria-pressed': selected === it.id ? 'true' : 'false', onclick: function () { pick(it.id); } },
            h('span', { class: 'interest-icon', 'aria-hidden': 'true' }, it.icon),
            h('span', { class: 'interest-text' }, h('span', null, it.title), it.desc ? h('span', { class: 'interest-desc' }, it.desc) : null));
          cards[it.id] = c;
          return c;
        })),
        otherBox,
        next,
        editing ? h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('progress'); } }, 'Артқа') : null
      )
    ]);
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
            h('span', null, '👤 ' + p.name + (p.presetLevel ? ' · болжамды ' + p.presetLevel : '')),
            h('span', { class: 'muted small' }, p.interest && interestMeta(p.interest) ? interestMeta(p.interest).title : 'баптау аяқталмаған'));
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
            h('div', { class: 'skill-result-head' }, h('span', { class: 'skill-icon', 'aria-hidden': 'true' }, sm.icon), h('strong', null, sm.title),
              d && d.correct ? h('span', { class: 'muted small' }, d.correct[s] + ' / 5 дұрыс') : null),
            h('div', { class: 'muted small' }, 'Қазіргі саты:'),
            stageStepper(s, function () { render(); }),
            sug ? h('div', { class: 'suggest' + (diff ? ' diff' : '') },
              diff ? [h('span', null, 'Диагностика ұсынады: ', h('strong', null, stageLabel(sug[s])), ' (' + stageMeta(sug[s]).cefrHint + ')'),
                h('button', { class: 'btn btn-secondary btn-small', onclick: function () { p.stages[s] = sug[s]; persist(); render(); } }, 'Қабылдау')]
                : h('span', null, '✓ Диагностика қазіргі сатымен сәйкес келеді.')) : null);
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
  function lessonCard(lesson, opts) {
    opts = opts || {};
    var sm = skillMeta(lesson.skill);
    var p = profile();
    var done = !!p.lessons[lesson.id];
    return h('div', { class: 'lesson-card skill-' + lesson.skill + (opts.big ? ' big' : '') },
      h('div', { class: 'lesson-card-head' },
        h('span', { class: 'skill-badge' }, sm.icon + ' ' + sm.title),
        h('span', { class: 'muted small' }, stageLabel(lesson.stage)),
        done ? h('span', { class: 'done-badge' }, '✓ Өтілді') : null),
      h('h3', { class: 'lesson-title' }, lesson.title),
      h('p', { class: 'muted' }, lesson.goal),
      themeLine(lesson, opts.ctxKey),
      h('div', { class: 'lesson-card-foot' },
        h('span', { class: 'muted small' }, '⏱ 5–10 минут'),
        h('button', { class: 'btn ' + (opts.big ? 'btn-primary' : 'btn-secondary'), onclick: function () { startLesson(lesson.id, opts.ctxKey); } },
          opts.label || (done ? 'Қайталау' : 'Бастау'))));
  }

  function themeLine(lesson, ctxKey) {
    var c = E.contextFor(lesson, ctxKey || E.contextKeyFor(profile()));
    return h('p', { class: 'small theme-line' + (c.fallback ? ' fallback' : '') },
      (c.fallback ? '📄 Жалпы мәтін: ' : '🎨 Сіздің тақырыбыңыз: ') + FEA.contextNames[c.key]);
  }

  function screenHome() {
    var p = profile();
    var t = now();
    var rec = E.recommendNext(p, t);
    var due = E.countDue(p, t);
    var doneCount = Object.keys(p.lessons).length;
    var main;

    if (rec.kind === 'lesson') {
      main = h('section', null, h('h2', { class: 'section-title' }, 'Келесі ұсынылатын сабақ'), lessonCard(rec.lesson, { big: true, label: doneCount ? 'Жалғастыру' : 'Бастау' }));
    } else if (rec.kind === 'review') {
      main = h('section', { class: 'card card-pad' },
        h('h2', null, 'Бүгін — қайталау күні'),
        h('p', { class: 'muted' }, 'Сатыңыздағы сабақтар өтілді. Енді бұрын үйренгенді еске түсіру маңызды.'),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () { startReview(); } }, 'Қайталауды бастау'));
    } else {
      var other = E.SKILL_ORDER.map(function (s) { return E.lessonFor(p.stages[s], s); }).filter(Boolean)[0];
      var ctxUsed = other && p.lessons[other.id] ? p.lessons[other.id].contextsUsed : [];
      var altCtx = other ? Object.keys(other.contexts).filter(function (k) { return ctxUsed.indexOf(k) === -1; })[0] : null;
      main = h('section', { class: 'card card-pad' },
        h('h2', null, 'Жарайсыз! Ағымдағы сабақтар өтілді'),
        h('p', { class: 'muted' }, 'Бүгін қайталайтын сұрақ жоқ. Сабақты жаңа мәтінмен қайталауға немесе «Прогресс» бетінде келесі сатыны таңдауға болады.'),
        other && altCtx ? h('button', { class: 'btn btn-primary btn-block', onclick: function () { startLesson(other.id, altCtx); } },
          '«' + other.title + '» — жаңа мәтінмен (' + FEA.contextNames[altCtx] + ')') : null,
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('progress'); } }, 'Прогресс және сатылар'));
    }

    return page([
      h('section', { class: 'greet' },
        h('h1', null, 'Сәлем, ' + p.name + '!'),
        h('p', { class: 'muted' }, 'Бүгінгі мақсат — бір қысқа сабақ. Тұрақты аз-аздан оқу — ең тиімді жол.')),
      caseHomeCard(p),
      main,
      due > 0 && rec.kind !== 'review' ? h('section', { class: 'card card-pad review-card' },
        h('div', null, h('strong', null, '🔁 Қайталау: ' + due + ' сұрақ'),
          h('p', { class: 'muted small' }, 'Бұрын үйренгенді ұмытпау үшін. Сабақтың басында да 1–2 сұрақ қосылады.')),
        h('button', { class: 'btn btn-secondary', onclick: function () { startReview(); } }, 'Қайталау')) : null,
      h('section', { class: 'card card-pad' },
        h('div', { class: 'stats-row' },
          h('div', null, h('div', { class: 'stat-num' }, String(doneCount)), h('div', { class: 'muted small' }, 'өтілген сабақ')),
          h('div', null, h('div', { class: 'stat-num' }, String(Object.keys(p.reviews).length)), h('div', { class: 'muted small' }, 'қайталаудағы сұрақ'))),
        h('p', { class: 'muted small' }, '💾 Прогресс осы құрылғыда, осы браузерде сақталады.')),
      h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('skills'); } }, 'Дағдыны өзім таңдаймын →')
    ], 'home');
  }

  // ------------------------------------------------------------ ДАҒДЫЛАР
  function screenSkills() {
    var p = profile();
    var focus = route.params.skill || null;
    return page([
      h('h1', null, 'Дағдыны таңдаңыз'),
      h('p', { class: 'muted' }, 'Әр дағдының өз сатысы бар. Сіздің сатыңыздағы сабақ белгіленген.'),
      E.SKILL_ORDER.map(function (s) {
        var sm = skillMeta(s);
        return h('section', { class: 'skill-section skill-' + s, id: 'skill-' + s },
          h('div', { class: 'skill-section-head' },
            h('span', { class: 'skill-icon big', 'aria-hidden': 'true' }, sm.icon),
            h('div', null, h('h2', null, sm.title), h('p', { class: 'muted small' }, sm.desc),
              h('p', { class: 'small' }, 'Сіздің сатыңыз: ', h('strong', null, stageLabel(p.stages[s])), ' (болжамды)'))),
          h('div', { class: 'lesson-list' }, E.lessonsForSkill(s).map(function (l) {
            var isCurrent = l.stage === p.stages[s];
            return h('div', { class: 'lesson-wrap' + (isCurrent ? ' current' : '') },
              isCurrent ? h('div', { class: 'current-label' }, '★ Сіздің сатыңыз') : null,
              lessonCard(l));
          })));
      })
    ], 'skills');
  }

  // ------------------------------------------------------------ САБАҚ
  var run = null;

  function startLesson(lessonId, ctxKey) {
    var p = profile();
    var lesson = E.getLesson(lessonId);
    var wanted = ctxKey || E.contextKeyFor(p);
    var c = E.contextFor(lesson, wanted);
    run = { mode: 'lesson', lesson: lesson, ctxKey: c.key, ctxFallback: c.fallback, wantedCtx: wanted,
      steps: E.buildLessonSteps(lesson, c.key, p, now()), i: 0, results: [], mistakes: [], newReviews: 0 };
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
      summary = E.completeLesson(p, run.lesson, run.ctxKey, run.results, t);
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
    var title = run.mode === 'lesson' ? run.lesson.title : 'Қайталау';
    var content;

    if (step.kind === 'mission') content = missionView(run.lesson, run.ctxKey);
    else if (step.kind === 'story') content = storyView(step.story);
    else if (step.kind === 'intro') content = introView(run.lesson, run.ctxKey);
    else if (step.kind === 'text') content = h('section', null,
      h('h2', { class: 'task-prompt' }, 'Мәтінді оқыңыз'),
      h('p', { class: 'muted small' }, 'Алдымен негізгі ойды түсінуге тырысыңыз. Әр сөзді аудару міндетті емес.'),
      textCard(step.text, false),
      h('button', { class: 'btn btn-primary btn-block', onclick: nextStep }, 'Сұрақтарға көшу →'));
    else {
      var phaseLabel = { warmup: '🔁 Алдымен еске түсірейік', review: '🔁 Қайталау', core: '✏️ Жаттығу', context: '📖 Мәтін бойынша' }[step.phase];
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
        h('button', { class: 'icon-btn', 'aria-label': 'Сабақтан шығу', onclick: exitLesson }, '✕'),
        h('div', { class: 'lesson-top-mid' },
          h('div', { class: 'lesson-top-title' }, title),
          h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Сабақ барысы', 'aria-valuenow': String(progress), 'aria-valuemin': '0', 'aria-valuemax': '100' },
            h('div', { class: 'progress-bar', style: 'width:' + progress + '%' }))),
        h('div', { class: 'lesson-top-count muted small' }, (run.i + 1) + '/' + run.steps.length)),
      storageBanner(),
      h('main', { class: 'page lesson-page' }, h('div', { class: 'card card-pad' }, content))
    ];
  }

  function missionView(lesson, ctxKey) {
    var m = E.missionFor(lesson, ctxKey);
    return h('section', { class: 'mission' },
      h('div', { class: 'mission-badge' }, '🎯 Миссия · ' + skillMeta(lesson.skill).title),
      h('h2', { class: 'mission-title' }, m.title),
      h('p', { class: 'mission-scene' }, m.scene),
      m.canDo ? h('div', { class: 'goal' }, h('span', { class: 'goal-label' }, 'Миссиядан кейін:'), h('p', null, m.canDo)) : null,
      h('p', { class: 'muted small' }, 'Шамамен 5–10 минут. Қате болса — подсказка және тағы бір әрекет беріледі.'),
      h('button', { class: 'btn btn-primary btn-block', onclick: nextStep }, 'Миссияны бастау →'));
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
          after.appendChild(h('p', { class: 'puzzle-verdict' }, i === pz.answer ? '✓ Жақсы болжам!' : '🔎 Бұл болжам дәл емес — бұл қалыпты. Дұрыс заңдылық белгіленді.'));
          after.appendChild(h('p', null, pz.after));
          after.appendChild(h('button', { class: 'btn btn-primary btn-block', onclick: function () { this.disabled = true; ruleShown = true; draw(); } }, 'Ережені нақты көру →'));
          after.classList.remove('hidden');
        });
        return b;
      });
      return h('div', { class: 'puzzle' },
        h('div', { class: 'phase-label' }, '🧩 Алдымен — тілдік жұмбақ'),
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
      var altBtn = ex.alt ? h('button', { class: 'btn btn-ghost btn-block not-clear' }, '🤔 Түсінбедім — басқаша түсіндіріңізші') : null;
      if (altBtn) altBtn.addEventListener('click', function () {
        altBtn.remove();
        altBox.appendChild(altPanel(ex.alt));
      });
      return h('div', { class: 'rule-block' },
        ex.scene ? h('p', { class: 'story-scene' }, ex.scene) : null,
        h('div', { class: 'rule-card' },
          h('div', { class: 'rule-card-label' }, '📐 Ереже'),
          h('ul', { class: 'rule-list' }, ex.rule.map(function (r) { return h('li', null, r); }))),
        h('div', { class: 'example big-example' }, h('div', { lang: 'en', class: 'ex-en' }, ex.example.en), h('div', { class: 'ex-kk' }, ex.example.kk)),
        h('div', { class: 'parts' }, ex.parts.map(function (pt) {
          return h('div', { class: 'part' }, h('span', { class: 'part-en', lang: 'en' }, pt.en), h('span', { class: 'part-kk' }, pt.kk));
        })),
        altBtn, altBox,
        h('h3', { class: 'sub' }, '✍️ Енді өзіңіз'),
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
      alt.check ? h('div', { class: 'alt-check' }, h('div', { class: 'phase-label' }, '✅ Түсінгеніңізді тексеріңіз'),
        taskView(alt.check, { ladder: true, onResult: function () {}, onNext: function () {}, nextLabel: '✓ Түсінікті' })) : null);
  }

  /* Схема правила: «ячейки» предложения или линия времени. */
  function schemeView(sc) {
    if (sc.type === 'timeline') {
      return h('div', { class: 'scheme timeline', 'aria-label': 'Уақыт сызығы' },
        h('div', { class: 'tl-track' },
          h('div', { class: 'tl-long' }, h('span', { lang: 'en' }, sc.long), h('small', null, 'созылып жатқан әрекет')),
          h('div', { class: 'tl-point' }, h('span', { class: 'tl-bolt', 'aria-hidden': 'true' }, '⚡'), h('span', { lang: 'en' }, sc.point), h('small', null, 'кенет оқиға'))));
    }
    return h('div', { class: 'scheme slots' }, sc.rows.map(function (row) {
      return h('div', { class: 'slot-row' }, row.map(function (cell) {
        return h('div', { class: 'slot' }, h('span', { class: 'slot-t', lang: 'en' }, cell.t), cell.c ? h('span', { class: 'slot-c' }, cell.c) : null);
      }));
    }));
  }

  function storyView(story) {
    return h('section', { class: 'story' },
      h('div', { class: 'phase-label' }, '📜 Күрделі тақырып'),
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
      h('div', { class: 'goal' }, h('span', { class: 'goal-label' }, '🎯 Сабақтың мақсаты'), h('p', null, lesson.goal)),
      lesson.prereq ? h('p', { class: 'banner banner-info' }, lesson.prereq) : null,
      run && run.ctxFallback ? h('p', { class: 'banner banner-info' }, fallbackNote()) : null,
      h('h2', { class: 'task-prompt' }, lesson.title),
      lesson.story ? h('p', { class: 'muted small' }, 'Ережені жоғарыдағы оқиғадан көрдіңіз. Енді жаңа сөздер мен мысалдар.')
        : lesson.explain.map(function (para) { return h('p', null, para); }),
      h('h3', { class: 'sub' }, 'Мысалдар'),
      h('div', { class: 'examples' }, lesson.examples.map(function (ex) {
        return h('div', { class: 'example' }, h('div', { lang: 'en', class: 'ex-en' }, ex.en), h('div', { class: 'ex-kk' }, ex.kk));
      })),
      h('h3', { class: 'sub' }, 'Жаңа сөздер'),
      h('div', { class: 'word-grid' }, w.core.map(function (x) { return wordTile(x, false); }), w.theme.map(function (x) { return wordTile(x, true); })),
      w.theme.length ? h('p', { class: 'muted small' }, '🎨 Түспен белгіленген сөздер — сіз таңдаған тақырыптан.') : null,
      h('button', { class: 'btn btn-primary btn-block', onclick: nextStep }, 'Жаттығуларға көшу →'));
  }

  function fallbackNote() {
    var p = profile();
    var topic = p.interest === 'other' && p.otherTopic ? '«' + p.otherTopic + '»' : '«' + (FEA.contextNames[run.wantedCtx] || '') + '»';
    return 'Бұл сабақта ' + topic + ' тақырыбына арналған дайын мәтін әлі жоқ. Сондықтан «' + FEA.contextNames[run.ctxKey] + '» тақырыбындағы жалпы мәтін берілді. Сабақтың мақсаты мен күрделілігі өзгермейді.';
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
    var steps = [{ icon: '🧰', title: 'Тілдік құрал' }].concat(cs.v.scenes.map(function (sc) { return { icon: sc.icon, title: sc.title }; }), [{ icon: '🏁', title: 'Шешім' }]);
    var current = cs.phase === 'intro' ? -1 : cs.phase === 'tool' ? 0 : cs.phase === 'finale' ? steps.length - 1 : cs.i + 1;
    return h('ol', { class: 'route', 'aria-label': 'Іс маршруты' }, steps.map(function (st, k) {
      var state = k < current || (cs.phase === 'unlock' && k === current) ? 'done' : k === current ? 'current' : 'locked';
      return h('li', { class: 'route-step ' + state, 'aria-current': state === 'current' ? 'step' : null },
        h('span', { class: 'route-dot', 'aria-hidden': 'true' }, state === 'done' ? '✓' : st.icon),
        h('span', { class: 'route-title' }, st.title));
    }));
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
      h('button', { class: 'icon-btn', 'aria-label': 'Істен шығу', onclick: function () { cs = null; go('home'); } }, '✕'),
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
        h('div', { class: 'goal' }, h('span', { class: 'goal-label' }, '🎯 Тілдік мақсат'), h('p', null, c.goal)),
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
          h('div', { class: 'phase-label' }, '🧰 Тергеушінің тілдік құралы'),
          h('p', { class: 'muted small' }, 'Іздерді түсіну үшін алдымен бір тілдік құралды меңгерейік.'),
          explainerView(v.explainer, { doneLabel: 'Бірінші ізге →', onDone: function () {
            cs.toolDone = true; cs.phase = 'scene'; cs.i = 0; saveCase(); render(); window.scrollTo(0, 0);
          } })));
    } else if (cs.phase === 'scene') {
      var sc = v.scenes[cs.i];
      body = h('div', null, routeView(),
        h('div', { class: 'card card-pad scene' },
          h('div', { class: 'scene-place small muted' }, '📍 ' + sc.place),
          h('h2', null, sc.icon + ' ' + sc.title),
          clueCard(sc.clue),
          h('div', { class: 'phase-label' }, '🕵️ Сіздің әрекетіңіз'),
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
          h('div', { class: 'unlock-badge' }, '🔓 Жаңа мәлімет'),
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
          h('h2', null, '🏁 Шешім'),
          h('div', { class: 'clue-text', lang: 'en' }, v.finale.lines.map(function (l) { return h('p', null, l); })),
          h('p', null, v.finale.kk),
          h('div', { class: 'goal can-do' }, h('span', { class: 'goal-label' }, '✅ Енді сіз:'), h('p', null, v.canDo))),
        h('div', { class: 'card card-pad' },
          h('h2', null, '🔁 Осы тілдік құрал басқа тақырыпта'),
          h('p', { class: 'muted small' }, 'Сол мақсат — басқа жағдай мен басқа әрекет:'),
          h('div', { class: 'transfer-grid' }, c.transfer.map(function (t) {
            return h('div', { class: 'transfer' }, h('div', { class: 'transfer-head' }, t.icon + ' ' + t.theme),
              h('p', { class: 'small' }, t.action), h('div', { class: 'ex-en', lang: 'en' }, t.examples[idx] || t.examples[0]));
          }))),
        h('details', { class: 'card card-pad discussion' },
          h('summary', null, '👨‍👩‍👧 Отбасымен талқылау (міндетті емес)'),
          c.discussion.map(function (d) { return h('p', null, d); })),
        h('div', { class: 'stack' },
          h('button', { class: 'btn btn-primary btn-block', onclick: function () { cs = null; go('home'); } }, 'Басты бетке'),
          h('button', { class: 'btn btn-ghost btn-block', onclick: function () { cs.phase = 'intro'; cs.i = 0; cs.toolDone = false; render(); window.scrollTo(0, 0); } }, 'Басқа нұсқамен қайта ойнау')));
    }
    return [head, storageBanner(), h('main', { class: 'page case-page' }, body)];
  }

  function caseHomeCard(p) {
    return (FEA.cases || []).map(function (c) {
      var rec = (p.cases || {})[c.id];
      var v = E.caseVersionFor(p, c);
      var inProgress = rec && !rec.done && (rec.toolDone || rec.scene > 0);
      var status = inProgress ? 'Тергеу жалғасып жатыр' : rec && rec.solved && rec.solved.length ? '✓ Шешілді' : 'Жаңа іс';
      return h('section', { class: 'case-card' },
        h('div', { class: 'case-card-tab' }, 'АРНАЙЫ ІС ' + c.caseNo),
        h('h2', null, '🕵️ ' + c.title),
        h('p', { class: 'small' }, c.goal),
        h('div', { class: 'case-card-foot' },
          h('span', { class: 'small muted' }, status + ' · ' + v.label),
          h('button', { class: 'btn btn-primary', onclick: function () { openCase(c.id); } }, inProgress ? 'Жалғастыру' : rec && rec.solved && rec.solved.length ? 'Қайта ашу' : 'Істі ашу')));
    });
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
        h('div', { class: 'result-icon', 'aria-hidden': 'true' }, '✓'),
        h('h1', null, isLesson ? 'Миссия орындалды!' : 'Қайталау аяқталды!'),
        isLesson ? h('p', { class: 'muted' }, '«' + r.lesson.title + '» — ', h('strong', null, 'өтілді деп белгіленді.')) : null,
        isLesson && r.lesson.canDo ? h('div', { class: 'goal can-do' }, h('span', { class: 'goal-label' }, '✅ Енді сіз:'), h('p', null, r.lesson.canDo)) : null,
        h('p', { class: 'result-score' }, 'Бірінші әрекеттен дұрыс: ', h('strong', null, s.correct + ' / ' + s.total)),
        h('p', { class: 'muted small' }, s.total && s.correct / s.total < 0.6
          ? 'Бұл тақырып әлі жаңа — бұл қалыпты. Қайталау оны бекітуге көмектеседі.'
          : 'Жақсы нәтиже. Бірнеше күннен кейінгі қайталау оны есте берік сақтауға көмектеседі.'),
        isLesson ? h('p', { class: 'small' }, '🔁 Бұл сабақтың сұрақтары ертеңнен бастап қайталауға қосылды.') : null,
        isLesson && r.newReviews ? h('p', { class: 'small' }, '📌 Қате кеткен ' + r.newReviews + ' тапсырма ертең қайталауда қайта шығады.') : null),
      h('section', { class: 'card card-pad' },
        h('h2', null, 'Қателер және түсіндірме'),
        lessonMistakes.length ? h('div', { class: 'mistake-list' }, lessonMistakes.map(mistakeItem))
          : h('p', { class: 'empty' }, 'Бұл жолы қате болмады. 🎉')),
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
    var it = interestMeta(p.interest);

    return page([
      h('h1', null, 'Менің прогресім'),

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
            h('div', { class: 'skill-result-head' }, h('span', { class: 'skill-icon', 'aria-hidden': 'true' }, sm.icon), h('strong', null, sm.title)),
            stageBox,
            prop ? h('p', { class: 'banner ' + (prop.dir === 'up' ? 'banner-ok' : 'banner-info') }, prop.text) : null);
        }),
        h('p', { class: 'muted small' }, FEA.cefrDisclaimer)),

      canDoSection(p),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Өтілген сабақтар'),
        completed.length ? h('div', { class: 'list' }, completed.map(function (x) {
          return h('div', { class: 'list-row' },
            h('span', null, skillMeta(x.lesson.skill).icon + ' ' + x.lesson.title),
            h('span', { class: 'muted small' }, stageLabel(x.lesson.stage) + ' · ' + Math.round(x.rec.lastAccuracy * 100) + '% · ' + x.rec.times + ' рет'));
        })) : h('p', { class: 'empty' }, 'Әзірге аяқталған сабақ жоқ. Бірінші сабақтан бастаңыз!')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Қайталау'),
        h('p', null, 'Қайталаудағы сұрақтар: ', h('strong', null, String(Object.keys(p.reviews).length)), ' · бүгін: ', h('strong', null, String(due))),
        due ? h('button', { class: 'btn btn-secondary', onclick: function () { startReview(); } }, 'Қазір қайталау') : h('p', { class: 'muted small' }, 'Бүгін қайталайтын сұрақ жоқ.')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Соңғы қателер'),
        (p.mistakes || []).length ? h('div', { class: 'mistake-list' }, p.mistakes.slice(0, 8).map(mistakeItem))
          : h('p', { class: 'empty' }, 'Қате әзірге жоқ.')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Профиль'),
        h('div', { class: 'list-row' }, h('span', null, 'Аты: ', h('strong', null, p.name)),
          h('button', { class: 'btn btn-ghost btn-small', onclick: function () { go('name', { edit: true }); } }, 'Өзгерту')),
        h('div', { class: 'list-row' }, h('span', null, 'Қызығушылық: ', h('strong', null, it ? it.title : '—'), p.otherTopic ? ' (' + p.otherTopic + ')' : ''),
          h('button', { class: 'btn btn-ghost btn-small', onclick: function () { go('interest', { edit: true }); } }, 'Өзгерту')),
        h('p', { class: 'muted small' }, 'Қызығушылықты өзгерту сатыңызды өзгертпейді — тек мәтіндер мен мысалдар ауысады.'),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('profiles'); } }, '👥 Профильді ауыстыру немесе жаңасын қосу')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Деректер'),
        h('p', { class: 'small' }, '💾 Прогресс тек осы құрылғыда, осы браузерде сақталады. Басқа құрылғыға автоматты түрде көшпейді.'),
        h('div', { class: 'backup-box' },
          h('h3', { class: 'sub' }, 'Сақтық көшірме'),
          h('p', { class: 'small muted' }, 'Файл тек сіздің құрылғыңызға жүктеледі. Ешқайда жіберілмейді.'),
          h('div', { class: 'row-gap' },
            h('button', { class: 'btn btn-secondary', onclick: downloadBackup }, '⬇️ Сақтық көшірме жасау'),
            h('button', { class: 'btn btn-ghost', onclick: pickBackupFile }, '⬆️ Қалпына келтіру'))),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () {
          FEA.ui.confirmDialog({ title: 'Осы профильдің прогресін тазалау керек пе?', text: '«' + p.name + '» профилінің диагностикасы, сабақтары, қайталаулары мен қателері өшіріледі. Аты мен қызығушылығы қалады.', ok: 'Тазалау', danger: true })
            .then(function (yes) {
              if (!yes) return;
              var fresh = store.newProfile(p.name, p.presetLevel);
              fresh.id = p.id; fresh.interest = p.interest; fresh.otherTopic = p.otherTopic;
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
      h('h2', null, '🗺️ ' + FEA.canDoTitle),
      h('p', { class: 'muted small' }, 'Әр орындалған миссиядан кейін ағылшынша не істей алатыныңыз. Бұл ұпай емес — нақты дағды.'),
      (FEA.cases || []).filter(function (c) { var r = p.cases && p.cases[c.id]; return r && r.solved && r.solved.length; }).map(function (c) {
        var solved = p.cases[c.id].solved;
        var v = c.versions.filter(function (x) { return x.stage === solved[solved.length - 1]; })[0] || c.versions[0];
        return h('div', { class: 'cando-skill cando-case' }, h('strong', null, '🕵️ Іс ' + c.caseNo + ': ' + c.title), h('ul', { class: 'cando-list' }, h('li', null, '✅ ' + v.canDo)));
      }),
      E.SKILL_ORDER.map(function (s) {
        var done = E.lessonsForSkill(s).filter(function (l) { return p.lessons[l.id]; });
        var next = E.nextLessonFor(p, s);
        return h('div', { class: 'cando-skill skill-' + s },
          h('div', { class: 'skill-result-head' }, h('span', { class: 'skill-icon', 'aria-hidden': 'true' }, skillMeta(s).icon), h('strong', null, skillMeta(s).title)),
          done.length ? h('ul', { class: 'cando-list' }, done.map(function (l) { return h('li', null, '✅ ' + (l.canDo || l.title)); }))
            : h('p', { class: 'empty small' }, 'Әзірге орындалған миссия жоқ.'),
          next ? h('div', { class: 'cando-next' },
            h('span', { class: 'small' }, '➡️ Келесі миссия: ', h('strong', null, E.missionFor(next, E.contextKeyFor(p)).title)),
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
        } }, '➕ Тек жаңа профильдерді қосу (' + news.length + ')') : h('p', { class: 'small muted' }, 'Файлда жаңа профиль жоқ: барлығы құрылғыда бар.'),
        h('button', { class: 'btn btn-secondary btn-block', onclick: downloadBackup }, '⬇️ Алдымен қазіргі деректердің көшірмесін жасау'),
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
    home: screenHome, skills: screenSkills, lesson: screenLesson, result: screenResult, progress: screenProgress,
    'case': screenCase, restore: screenRestore
  };

  function render() {
    var needsProfile = ['home', 'skills', 'progress', 'diagIntro', 'diag', 'diagResult', 'interest', 'lesson', 'result', 'case'];
    if (needsProfile.indexOf(route.name) !== -1 && !profile()) route = { name: startRoute(), params: {} };
    if (['home', 'skills', 'progress'].indexOf(route.name) !== -1) {
      var p = profile();
      if (!p.interest) route = { name: 'interest', params: {} };
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
