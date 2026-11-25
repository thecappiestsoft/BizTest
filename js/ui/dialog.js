/**
 * dialog.js — własne okno potwierdzenia (zamiast window.confirm).
 * In-page confirm dialog: works also in sandboxed frames where confirm() is blocked.
 *
 * Użycie: NS.Dialog.confirm('Usunąć?').then((ok) => { ... })
 */
(function (NS) {
  'use strict';

  const esc = NS.Dom.escapeHtml;

  function confirm(message, options) {
    const o = options || {};
    const I = NS.I18n;
    return new Promise((resolve) => {
      const previousFocus = document.activeElement;
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';
      overlay.innerHTML =
        '<div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-msg">' +
        '<p class="dialog__message" id="dialog-msg">' + esc(message) + '</p>' +
        '<div class="dialog__actions">' +
        '<button type="button" class="btn" data-answer="no">' + esc(o.cancelLabel || I.t('dialog.cancel')) + '</button>' +
        '<button type="button" class="btn ' + (o.danger ? 'btn--danger-solid' : 'btn--primary') + '" data-answer="yes">' +
        esc(o.confirmLabel || I.t('dialog.ok')) + '</button>' +
        '</div></div>';

      function close(answer) {
        document.removeEventListener('keydown', onKey, true);
        overlay.remove();
        if (previousFocus && previousFocus.focus) previousFocus.focus();
        resolve(answer);
      }

      function onKey(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          close(false);
        } else if (e.key === 'Tab') {
          // pętla fokusu wewnątrz okna
          const buttons = overlay.querySelectorAll('button');
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) return close(false);
        const btn = e.target.closest('[data-answer]');
        if (btn) close(btn.getAttribute('data-answer') === 'yes');
      });
      document.addEventListener('keydown', onKey, true);
      document.body.appendChild(overlay);
      overlay.querySelector('[data-answer="no"]').focus();
    });
  }

  /** Czy aplikacja działa w osadzonej ramce (np. podgląd), gdzie druk bywa zablokowany. */
  function isEmbedded() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  NS.Dialog = { confirm, isEmbedded };
})(globalThis.BizTest = globalThis.BizTest || {});
