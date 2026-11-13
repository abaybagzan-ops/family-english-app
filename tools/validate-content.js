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
    if (KNOWN_CTX.indexOf(c) === -1) err(w + ': неизвестная тема ' + c);
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
