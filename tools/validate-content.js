#!/usr/bin/env node
/*
 * Проверка учебных данных без браузера.
 *   node tools/validate-content.js            — проверка
 *   node tools/validate-content.js --notes    — плюс пометки для редактора
 *   node tools/validate-content.js --coverage — плюс в каких уроках есть текст для каждой темы
 *
 * Проверяет: уникальность id и порядка, общий текст (defaultContext) у каждого урока,
 * лимит тематических слов (≤ половины новых), 4–6 основных заданий, верные индексы ответов,
 * отсутствие дословных повторов заданий внутри урока, уникальность id повторов, лимит глоссария,
 * что правильный ответ принимается проверкой (в т.ч. целым предложением для пропусков).
 */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var root = path.join(__dirname, '..');
// Порядок файлов берётся из index.html — так проверяется ровно то, что загружает приложение
var html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
var files = [];
html.replace(/<script src="(js\/[^"]+)"><\/script>/g, function (_, f) { files.push(f); });
var sandbox = { window: {}, document: null };
sandbox.window = sandbox;
vm.createContext(sandbox);
files.filter(function (f) { return f.indexOf('js/content/') === 0 || f === 'js/engine.js'; }).forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
});
var FEA = sandbox.FEA;
var E = FEA.engine;
var S = FEA.settings;
var errors = [];
var warnings = [];
function err(m) { errors.push(m); }
function warn(m) { warnings.push(m); }

var SKILLS = ['words', 'grammar', 'reading'];
var KNOWN_CTX = Object.keys(FEA.contextNames);
var reviewIds = {};
var lessonIds = {};

function checkTask(t, where) {
  if (!t || !t.type) return err(where + ': нет типа задания');
  if (!t.prompt) err(where + ': нет формулировки');
  if (t.type !== 'match' && !t.explain) err(where + ': нет объяснения');
  if (t.type === 'choice') {
    if (!Array.isArray(t.options) || t.options.length < 2) err(where + ': мало вариантов');
    else if (typeof t.answer !== 'number' || !t.options[t.answer]) err(where + ': неверный индекс ответа');
    else if (new Set(t.options).size !== t.options.length) err(where + ': одинаковые варианты');
  }
  if (t.type === 'type') {
    if (!Array.isArray(t.answers) || !t.answers.length) err(where + ': нет допустимых ответов');
    else {
      t.answers.forEach(function (a) { if (!E.checkTyped(t, a)) err(where + ': ответ «' + a + '» не принимается проверкой'); });
      if (t.sentence && t.sentence.indexOf('___') !== -1) {
        var full = t.sentence.replace(/\s*\([^)]*\)/g, '').replace(/_{2,}/, t.answers[0]);
        if (!E.checkTyped(t, full)) err(where + ': целое предложение «' + full + '» не принимается');
      }
    }
  }
  if (t.type === 'order') {
    var a = t.words.slice().sort().join(' ').toLowerCase();
    var b = t.answer.split(/\s+/).sort().join(' ').toLowerCase();
    if (a !== b) err(where + ': слова не совпадают с ответом');
  }
}

/*
 * Вариант по интересу: известные направления и тип действия, роль, своя миссия,
 * ровно 2 задания (решение + форма), у выбора с последствиями — последствие на каждый вариант.
 * Ключ 'v-<первое направление>'.
 */
var DIRS = {};
(FEA.directions || []).forEach(function (d) { DIRS[d.id] = d; });
function checkVariant(l, c, ctx, w) {
  var vw = w + '/' + c;
  if (c.indexOf('v-') !== 0) err(vw + ': ключ варианта должен начинаться с v-');
  if (!Array.isArray(ctx.interests) || !ctx.interests.length) err(vw + ': нет направлений');
  (ctx.interests || []).forEach(function (i) { if (!DIRS[i]) err(vw + ': неизвестное направление ' + i); });
  if (ctx.interests && c !== 'v-' + ctx.interests[0]) err(vw + ': ключ не совпадает с первым направлением');
  if (!FEA.actionModes[ctx.mode]) err(vw + ': неизвестный тип действия ' + ctx.mode);
  if (!ctx.role || !ctx.label || !ctx.textHeading || !ctx.task) err(vw + ': нет роли, названия, короткой задачи (task) или заголовка материала');
  if (!ctx.mission || !ctx.mission.title || !ctx.mission.scene) err(vw + ': нет миссии варианта');
  if (ctx.tasks.length !== 2) err(vw + ': у варианта должно быть 2 задания (решение + использование формы)');
  ctx.tasks.forEach(function (t, i) {
    if (t.outcomes && (!t.options || t.outcomes.length !== t.options.length)) err(vw + ' задание ' + (i + 1) + ': последствий не столько, сколько вариантов');
  });
}

function key(t) { return (t.prompt + '|' + (t.sentence || '') + '|' + (t.text ? t.text.join(' ') : '') + '|' + (t.sign ? t.sign.join(' ') : '')).toLowerCase(); }

// Ступени x навыки: хотя бы по уроку, порядок уникален
FEA.stages.forEach(function (st) {
  SKILLS.forEach(function (sk) {
    var list = E.lessonsAt(st.id, sk);
    if (!list.length) err('Нет урока: ступень ' + st.id + ', навык ' + sk);
    var orders = list.map(function (l) { return l.order || 1; });
    if (new Set(orders).size !== orders.length) err('Повтор порядка уроков: ступень ' + st.id + ', навык ' + sk);
  });
});

FEA.lessons.forEach(function (l) {
  var w = 'Урок ' + l.id;
  if (lessonIds[l.id]) err('Повтор id урока: ' + l.id);
  lessonIds[l.id] = 1;
  ['title', 'goal'].forEach(function (f) { if (!l[f]) err(w + ': нет поля ' + f); });
  if (!l.explain || !l.explain.length) err(w + ': нет объяснения');
  if (!l.examples || !l.examples.length) err(w + ': нет примеров');
  if (!l.review || !l.review.length) err(w + ': нет вопросов для повторения');
  var def = l.defaultContext || 'everyday';
  if (!l.contexts[def]) err(w + ': нет общего текста (' + def + ')');
  if (!l.mission || !l.mission.title || !l.mission.scene) err(w + ': нет миссии');
  if (!l.canDo) err(w + ': нет практического результата (canDo)');
  if (l.mission && l.mission.contexts) Object.keys(l.mission.contexts).forEach(function (c) {
    if (!l.contexts[c]) err(w + ': миссия для темы ' + c + ', но текста для неё нет');
  });
  if (l.story) {
    var st = l.story;
    if (!st.scene || !st.rule || !st.rule.length || st.rule.length > 3 || !st.example || !st.parts || !st.parts.length) err(w + ': неполная история (сценка, 1–3 правила, пример, разбор)');
    if (st.example && st.parts) st.parts.forEach(function (pt) {
      if (st.example.en.toLowerCase().indexOf(pt.en.toLowerCase()) === -1) err(w + ': часть «' + pt.en + '» не из примера');
    });
    checkTask(st.task, w + ' задание истории');
    if (st.task && !st.task.hint) err(w + ': у задания истории нет подсказки');
    if (st.task && l.explain.concat(st.rule).join(' ').toLowerCase().indexOf(st.task.sentence.replace('___', st.task.options[st.task.answer]).toLowerCase().replace(/\.$/, '')) !== -1) err(w + ': ответ задания истории виден в объяснении');
  }
  if (l.hints) Object.keys(l.hints).forEach(function (i) { if (!l.tasks[i]) err(w + ': подсказка к несуществующему заданию ' + i); });
  checkTask(l.warmup, w + ' разминка');
  l.tasks.forEach(function (t, i) { checkTask(t, w + ' задание ' + (i + 1)); });

  Object.keys(l.contexts).forEach(function (c) {
    var ctx = l.contexts[c];
    if (E.isActionVariant(ctx)) checkVariant(l, c, ctx, w);
    else if (KNOWN_CTX.indexOf(c) === -1) err(w + ': неизвестная тема ' + c);
    var core = l.words.length, theme = (ctx.themeWords || []).length;
    if (theme / (core + theme) > S.maxThemeWordShare + 1e-9) err(w + '/' + c + ': тематических слов больше половины (' + theme + ' из ' + (core + theme) + ')');
    var total = l.tasks.length + ctx.tasks.length;
    if (total < S.tasksPerLessonMin || total > S.tasksPerLessonMax) err(w + '/' + c + ': основных заданий ' + total + ' (нужно ' + S.tasksPerLessonMin + '–' + S.tasksPerLessonMax + ')');
    var gl = (ctx.text.glossary || []).length;
    if (gl > S.maxGlossaryByStage[l.stage]) warn(w + '/' + c + ': глоссарий ' + gl + ' слов');
    if (!ctx.text.title || !ctx.text.lines.length) err(w + '/' + c + ': пустой текст');
    (ctx.themeWords || []).forEach(function (tw) {
      var first = tw.en.toLowerCase().split(' ')[0];
      var stem = first.replace(/(e|y)$/, '').slice(0, 5);
      var irregular = { give: 'gave', build: 'built' }[first];
      var body = ctx.text.lines.join(' ').toLowerCase();
      if (body.indexOf(stem) === -1 && !(irregular && body.indexOf(irregular) !== -1)) warn(w + '/' + c + ': тематическое слово «' + tw.en + '» не встречается в тексте');
    });
    ctx.tasks.forEach(function (t, i) { checkTask(t, w + '/' + c + ' задание по тексту ' + (i + 1)); });
    var all = [l.warmup].concat(l.tasks, ctx.tasks).filter(function (t) { return t.type !== 'match'; });
    var seen = {};
    all.forEach(function (t) {
      var k = key(t);
      if (seen[k]) err(w + '/' + c + ': повтор задания «' + t.prompt + '»');
      seen[k] = 1;
    });
  });

  l.review.forEach(function (r) {
    if (reviewIds[r.id]) err('Повтор id вопроса повторения: ' + r.id);
    reviewIds[r.id] = 1;
    checkTask(r, w + ' повторение ' + r.id);
  });
});

// Короткие формулировки направлений и словарь
(FEA.directions || []).forEach(function (d) {
  var sh = FEA.directionShort && FEA.directionShort[d.id];
  if (!sh || !sh.doing) err('Направление ' + d.id + ': нет короткой формулировки');
  var st = E.directionStats(d.id);
  if (sh && sh.role && !st.action.length) err('Направление ' + d.id + ': обещана роль, но вариантов-действий нет');
  if (sh && !sh.role && st.action.length) warn('Направление ' + d.id + ': есть варианты, но роль на экране выбора не показана');
});
var dictionary = E.buildDictionary();
dictionary.forEach(function (e) {
  if (!e.kk.length) err('Словарь: «' + e.en + '» без перевода');
  if (!e.sources.length) err('Словарь: «' + e.en + '» без урока-источника');
});
console.log('Словарь: ' + dictionary.length + ' записей, с примером: ' + dictionary.filter(function (e) { return e.example; }).length);

// Диагностика
var perSkill = {};
FEA.diagnostic.forEach(function (d) {
  perSkill[d.skill] = (perSkill[d.skill] || 0) + 1;
  checkTask(Object.assign({ type: 'choice' }, d), 'Диагностика ' + d.id);
  if (!d.review) err('Диагностика ' + d.id + ': нет вопроса для повторения');
  else {
    checkTask(d.review, 'Диагностика ' + d.id + ' повторение');
    if (key(d.review) === key(d)) err('Диагностика ' + d.id + ': повторение дословно совпадает с вопросом');
  }
});
SKILLS.forEach(function (s) { if (perSkill[s] !== 5) err('Диагностика: в части ' + s + ' должно быть 5 вопросов, есть ' + (perSkill[s] || 0)); });

// Объяснения: загадка, «Түсінбедім», проверка
function answerText(t) { return t.type === 'choice' ? t.options[t.answer] : t.type === 'type' ? t.answers[0] : t.answer; }
function checkExplainer(ex, w) {
  if (!ex) return err(w + ': нет объяснения');
  if (!ex.rule || !ex.rule.length || ex.rule.length > 3) err(w + ': правило должно быть в 1–3 предложениях');
  if (!ex.example || !ex.parts || !ex.parts.length) err(w + ': нет примера с разбором');
  if (ex.puzzle) {
    var pz = ex.puzzle;
    if (!pz.examples || pz.examples.length < 2 || !pz.options || !pz.options[pz.answer] || !pz.after) err(w + ': неполная языковая загадка');
  }
  if (ex.alt) {
    var a = ex.alt;
    if (!a.simple || !a.limits || !a.example || !a.check) err(w + ': «Түсінбедім» без простого объяснения, границ, примера или проверки');
    if (a.check) checkTask(a.check, w + ' «Түсінбедім» проверка');
    if (a.scheme && ['slots', 'timeline'].indexOf(a.scheme.type) === -1) err(w + ': неизвестная схема');
  }
  checkTask(ex.task, w + ' задание объяснения');
}
function checkHintsNoAnswer(t, hints, w) {
  var ans = String(answerText(t) || '').toLowerCase();
  if (ans.length < 4) return;
  (hints || []).forEach(function (hnt, i) { if (String(hnt).toLowerCase().indexOf(ans) !== -1) err(w + ': подсказка ' + (i + 1) + ' содержит готовый ответ «' + ans + '»'); });
}
FEA.lessons.forEach(function (l) {
  if (l.story && (l.story.puzzle || l.story.alt)) checkExplainer(l.story, 'Урок ' + l.id + ' история');
});

// Дела
(FEA.cases || []).forEach(function (c) {
  var w = 'Дело ' + c.id;
  if (!c.title || !c.intro || !c.goal) err(w + ': нет названия, вступления или цели');
  var stages = c.versions.map(function (v) { return v.stage; });
  if (new Set(stages).size !== stages.length) err(w + ': повтор версии');
  FEA.stages.forEach(function (st) { if (stages.indexOf(st.id) === -1) err(w + ': нет версии для ступени ' + st.id); });
  (c.transfer || []).forEach(function (t) { if (!t.examples || t.examples.length !== c.versions.length) err(w + ': перенос «' + t.theme + '» — нужен пример для каждой версии'); });
  c.versions.forEach(function (v) {
    var vw = w + ' версия ' + v.stage;
    if (!v.label || !v.supports || !v.canDo || !v.finale) err(vw + ': нет описания, опор, результата или развязки');
    checkExplainer(v.explainer, vw);
    if (!v.scenes || v.scenes.length !== 4) err(vw + ': должно быть 4 сцены');
    (v.scenes || []).forEach(function (sc, i) {
      var sw = vw + ' сцена ' + (i + 1);
      if (!sc.clue || !sc.clue.lines || !sc.clue.lines.length) err(sw + ': нет улики');
      if (!sc.hints || sc.hints.length !== 3) err(sw + ': нужно 3 подсказки (вопрос, правило, каркас)');
      if (!sc.unlock) err(sw + ': нет продолжения сюжета');
      checkTask(sc.task, sw);
      checkHintsNoAnswer(sc.task, sc.hints, sw);
      if (!E.getReview(['q', c.id, v.stage, i].join('|'))) err(sw + ': не находится для повторения');
    });
    checkHintsNoAnswer(v.explainer.task, v.explainer.task.hints, vw + ' задание объяснения');
  });
});

// Семейные профили
(FEA.familyProfiles || []).forEach(function (fp) {
  if (!FEA.levelPresets.some(function (lp) { return lp.id === fp.level; })) err('Профиль ' + fp.name + ': неизвестный уровень ' + fp.level);
});

console.log('Уроков: ' + FEA.lessons.length + ', вопросов диагностики: ' + FEA.diagnostic.length + ', вопросов повторения: ' + Object.keys(reviewIds).length);
warnings.forEach(function (m) { console.log('ВНИМАНИЕ: ' + m); });
errors.forEach(function (m) { console.log('ОШИБКА: ' + m); });

if (process.argv.indexOf('--coverage') !== -1) {
  console.log('\n=== Темы: в каких уроках есть свой текст ===');
  var cov = E.interestCoverage();
  FEA.interests.forEach(function (it) {
    var list = cov[it.context] || [];
    console.log(it.icon + ' ' + it.title + ' [' + it.context + '] — ' + list.length + ' из ' + FEA.lessons.length + ': ' + list.join(', '));
  });
}

if (process.argv.indexOf('--notes') !== -1) {
  console.log('\n=== Пометки для редактора (ученику не показываются) ===');
  FEA.lessons.forEach(function (l) {
    (l.editorNotes || []).forEach(function (n) { console.log('[' + l.id + '] ' + n); });
  });
  (FEA.diagnosticEditorNotes || []).forEach(function (n) { console.log('[diagnostic] ' + n); });
}

if (errors.length) { console.log('\nПроверка НЕ пройдена: ' + errors.length + ' ошиб.'); process.exit(1); }
console.log('\nПроверка пройдена.');
