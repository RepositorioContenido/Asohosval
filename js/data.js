/**
 * ============================================================================
 *  OVA SENA - Retos y Pretest
 *  ESTRUCTURA DEL OVA - ARCHIVO CONGELADO. NO EDITAR.
 * ============================================================================
 *
 *  Responsabilidades (y solo estas):
 *    1. Publicar js/content.js como window.courseData
 *    2. Aplicar la sección "features" de content.json sobre los botones
 *    3. Verificar la integridad del contenido al abrir y avisar si algo falla
 *
 *  Para cambiar contenido:  editar content.json  +  ./generar-content.command
 *  Para cambiar estructura: NUNCA desde acá ni desde content.json.
 *
 *  Contrato con el resto del código:
 *    - app.js y modal.js leen window.courseData
 *    - el valor se entrega por referencia, sin clonar ni normalizar
 *    - ningún módulo lo muta en runtime (es de solo lectura)
 * ============================================================================
 */
(function (global) {
  'use strict';

  // ------------------------------------------------------------------------
  // FNV-1a 32 bit. Sincrónico y sin dependencias.
  // Control de integridad contra ediciones accidentales, NO criptografía.
  // Debe coincidir bit a bit con tools/generar-content.js
  // ------------------------------------------------------------------------
  function contentHash(value) {
    var text = JSON.stringify(value);
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ('00000000' + h.toString(16)).slice(-8);
  }

  function warn(message, detail) {
    console.warn('[OVA] ' + message + (detail ? '\n       ' + detail : ''));
  }

  var content = global.OVA_CONTENT;
  var meta = global.OVA_CONTENT_META;

  // ---- 1. publicar contenido ---------------------------------------------
  if (!content) {
    console.error(
      '[OVA] No se encontró window.OVA_CONTENT.\n' +
      '       Falta js/content.js. Verificá el <script> en index.html.'
    );
    return;
  }
  global.courseData = content;

  // ---- 2. verificar integridad -------------------------------------------
  if (!meta || !meta.contentSha256) {
    warn(
      'js/content.js no tiene manifiesto de integridad.',
      'Regeneralo con ./generar-content.command'
    );
  } else if (contentHash(content) !== meta.contentSha256) {
    warn(
      'El contenido fue editado FUERA de content.json.',
      'Tu cambio se va a perder en la próxima generación.\n' +
      '       Mové el cambio a content.json y corré ./generar-content.command'
    );
  }

  // ---- 3. aplicar "features" a los botones --------------------------------
  var features = content.features;
  if (!features || typeof features !== 'object') return;

  var BUTTON_IDS = {
    creditsPopup: 'btnDockCredits',
    bibliographyPopup: 'btnDockBibliography',
    portadaScroll: 'btnPortadaScroll',
    enterCarousel: 'btnEnterCarrusel',
    modalClose: 'btnModalClose',
    popupClose: 'btnAmieClose'
  };

  function applyButton(enabled, buttonId) {
    var btn = buttonId && document.getElementById(buttonId);
    if (!btn) return;
    if (enabled === false) {
      btn.hidden = true;
      btn.setAttribute('aria-hidden', 'true');
      btn.disabled = true;
    } else {
      btn.hidden = false;
      btn.removeAttribute('aria-hidden');
      btn.disabled = false;
    }
  }

  Object.keys(BUTTON_IDS).forEach(function (name) {
    var f = features[name];
    if (!f || typeof f !== 'object') return;      // no declarado = no tocar
    applyButton(f.enabled !== false, f.button || BUTTON_IDS[name]);
  });



})(typeof window !== 'undefined' ? window : this);