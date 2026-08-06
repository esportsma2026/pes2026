(function () {
  'use strict';

  var CARD = document.getElementById('reportCard');
  if (!CARD) return;

  function t(key) { return typeof EffotbaleLang !== 'undefined' ? EffotbaleLang.t(key) : key; }

  var numField = document.getElementById('numField');
  var playerNum = document.getElementById('playerNum');
  var form = document.getElementById('reportForm');
  var success = document.getElementById('msgSuccess');
  var waNote = document.getElementById('waNote');

  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var num = playerNum.value.trim();
    var msg = document.getElementById('msgText').value.trim();
    var valid = true;

    if (!num) { numField.classList.add('error'); shake(numField); valid = false; }
    else numField.classList.remove('error');

    if (!num) return;

    if (!valid) return;

    var lines = [];
    lines.push(t('waHello'));
    lines.push(t('waPlayer') + ': ' + num);
    if (msg) lines.push(t('waIssue') + ': ' + msg);
    else lines.push(t('waIssue') + ': ' + t('waNoIssue'));

    try {
      if (typeof EffotbaleDB !== 'undefined' && EffotbaleDB.addPlayerMessage) {
        EffotbaleDB.addPlayerMessage(num, msg || '—');
      }
    } catch (err) { /* ignore */ }

    var text = encodeURIComponent(lines.join('\n'));
    success.classList.add('visible');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () { success.classList.remove('visible'); }, 4200);
    waNote.classList.add('visible');
    setTimeout(function () { waNote.classList.remove('visible'); }, 18000);

    window.open('https://wa.me/212783860620?text=' + text, '_blank', 'noopener');
  });
})();