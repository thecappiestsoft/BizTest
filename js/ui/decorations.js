/**
 * decorations.js — elementy ozdobne stylów, tłumaczone razem z interfejsem:
 *   • pasek notowań z pojęciami z lekcji (styl „Parkiet giełdowy”)
 *   • rysunek kredą z wykresem BEP i wzorami (styl „Tablica w klasie”)
 * Widoczność steruje CSS (css/skins/*.css), tu tylko treść.
 */
(function (NS) {
  'use strict';

  const esc = NS.Dom.escapeHtml;
  const I = NS.I18n;

  function renderTicker() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    const items = I.t('decor.ticker');
    if (!Array.isArray(items)) return;
    const arrows = { up: '▲', down: '▼', flat: '■' };
    const html = items
      .map((it) => '<span class="ticker__item"><b>' + esc(it[0]) + '</b><span class="' + it[2] + '">' + arrows[it[2]] + ' ' + esc(it[1]) + '</span></span>')
      .join('');
    // treść podwójna → płynna, zapętlona animacja (przesunięcie o -50%)
    track.innerHTML = html + html;
  }

  function renderDoodle() {
    const box = document.getElementById('chalk-doodle');
    if (!box) return;
    box.innerHTML =
      '<svg viewBox="0 0 130 56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M8 4V50H126"/>' +
      '<path d="M8 34C40 30 80 24 122 16"/>' +
      '<path d="M8 50C40 38 80 20 122 4"/>' +
      '<circle cx="68" cy="25" r="3" fill="currentColor"/>' +
      '<text x="72" y="40" fill="currentColor" stroke="none" font-size="11">BEP</text></svg>' +
      '<div>' + esc(I.t('decor.formulaRoi')) + '<br>' + esc(I.t('decor.formulaBep')) + '</div>';
  }

  function render() {
    renderTicker();
    renderDoodle();
  }

  function init() {
    render();
    NS.Bus.on('lang:changed', render);
  }

  NS.Decorations = { init, render };
})(globalThis.BizTest = globalThis.BizTest || {});
