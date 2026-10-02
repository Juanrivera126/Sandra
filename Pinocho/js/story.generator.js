(function($) {
  $(function() {
    var generator = document.getElementById('story-generator');
    var setupForm = document.getElementById('story-setup-form');
    var timingForm = document.getElementById('story-timing-form');
    var timingFields = document.getElementById('slide-timing-fields');
    var feedback = document.getElementById('generator-feedback');
    var titleInput = document.getElementById('story-name');
    var imageCountInput = document.getElementById('image-count');
    var cover = document.querySelector('.story-cover');
    var storyName = '';
    var imageCount = 0;

    function formatStartTime(totalSeconds) {
      var minutes = Math.floor(totalSeconds / 60);
      var seconds = (totalSeconds - minutes * 60).toFixed(1);

      if (Number(seconds) >= 60) {
        minutes += 1;
        seconds = '00.0';
      }

      return String(minutes).padStart(2, '0') + ':' + seconds.padStart(4, '0');
    }

    function updateStartTimes() {
      var nextStart = Number(cover.getAttribute('data-narrator-duration')) || 0;
      var cards = timingFields.querySelectorAll('.slide-timing-card');

      Array.prototype.forEach.call(cards, function(card) {
        card.querySelector('[data-slide-start]').textContent = formatStartTime(nextStart);
        nextStart += Number(card.querySelector('input').value) || 0;
      });
    }

    function createTimingFields() {
      var fragment = document.createDocumentFragment();

      for (var index = 1; index <= imageCount; index += 1) {
        var card = document.createElement('fieldset');
        var legend = document.createElement('legend');
        var label = document.createElement('label');
        var input = document.createElement('input');
        var start = document.createElement('p');
        var startTime = document.createElement('time');
        var inputId = 'slide-duration-' + index;

        card.className = 'slide-timing-card';
        legend.textContent = 'Imagen ' + index;
        label.htmlFor = inputId;
        label.textContent = 'Duración (segundos)';
        input.id = inputId;
        input.name = 'duration-' + index;
        input.type = 'number';
        input.min = '0.1';
        input.step = '0.1';
        input.value = '10';
        input.required = true;
        start.className = 'slide-start-time';
        start.appendChild(document.createTextNode('Inicio estimado: '));
        startTime.setAttribute('data-slide-start', '');
        start.appendChild(startTime);
        card.appendChild(legend);
        card.appendChild(label);
        card.appendChild(input);
        card.appendChild(start);
        fragment.appendChild(card);
      }

      timingFields.replaceChildren(fragment);
      updateStartTimes();
    }

    function escapeHtml(value) {
      return value.replace(/[&<>"']/g, function(character) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[character];
      });
    }

    function createStoryHtml(name, durations) {
      var safeName = escapeHtml(name);
      var slides = durations.map(function(duration, index) {
        return '    <section class="slide story-illustration" data-narrator-duration="' + duration + '" data-duration="' + Math.round(duration * 1000) + '">\n' +
          '      <img src="imagenes/' + (index + 1) + '.jpg" width="100%" alt="Imagen ' + (index + 1) + ' del cuento ' + safeName + '">\n' +
          '    </section>';
      }).join('\n\n');

      return '<!DOCTYPE html>\n' +
        '<html lang="es">\n' +
        '<head>\n' +
        '  <meta charset="utf-8">\n' +
        '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '  <base href="./">\n' +
        '  <title>' + safeName + '</title>\n' +
        '  <link rel="stylesheet" href="lib/deck.js/core/deck.core.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/extensions/menu/deck.menu.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/extensions/navigation/deck.navigation.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/extensions/status/deck.status.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/extensions/scale/deck.scale.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.automatic.js/automatic/deck.automatic.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/themes/style/web-2.0.css">\n' +
        '  <link rel="stylesheet" href="css/deck.narrator.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/themes/transition/horizontal-slide.css">\n' +
        '  <script src="lib/deck.js/modernizr.custom.js"><\/script>\n' +
        '</head>\n' +
        '<body class="deck-container">\n' +
        '  <section class="slide story-cover" data-narrator-duration="7" data-duration="7000">\n' +
        '    <div class="story-cover-content">\n' +
        '      <p class="story-cover-kicker">¡Abre bien los ojos!</p>\n' +
        '      <h1>' + safeName + '</h1>\n' +
        '      <p class="story-cover-subtitle">Una aventura mágica llena de sorpresas</p>\n' +
        '      <footer>¡Pulsa Play y comienza el cuento!</footer>\n' +
        '    </div>\n' +
        '  </section>\n\n' + slides + '\n\n' +
        '  <nav aria-label="Navegación del cuento">\n' +
        '    <a href="#" class="deck-prev-link" title="Previa" aria-label="Diapositiva anterior">←</a>\n' +
        '    <a href="#" class="deck-next-link" title="Próxima" aria-label="Diapositiva siguiente">→</a>\n' +
        '  </nav>\n' +
        '  <p class="deck-status"><span class="deck-status-current"></span> / <span class="deck-status-total"></span></p>\n' +
        '  <audio controls class="deck-narrator-audio" id="narrator-audio">\n' +
        '    <source src="audio/audio.mp3" type="audio/mpeg">\n' +
        '  </audio>\n' +
        '  <script src="lib/deck.js/jquery.min.js"><\/script>\n' +
        '  <script src="lib/deck.js/core/deck.core.js"><\/script>\n' +
        '  <script src="lib/deck.js/extensions/menu/deck.menu.js"><\/script>\n' +
        '  <script src="lib/deck.js/extensions/status/deck.status.js"><\/script>\n' +
        '  <script src="lib/deck.js/extensions/navigation/deck.navigation.js"><\/script>\n' +
        '  <script src="lib/deck.js/extensions/scale/deck.scale.js"><\/script>\n' +
        '  <script src="lib/deck.automatic.js/automatic/deck.automatic.js"><\/script>\n' +
        '  <script src="js/deck.narrator.js"><\/script>\n' +
        '  <script>\n' +
        '    $(function() {\n' +
        '      $.extend(true, $.deck.defaults, { automatic: { startRunning: false, cycle: false } });\n' +
        '      $.deck(".slide");\n' +
        '    });\n' +
        '  <\/script>\n' +
        '</body>\n' +
        '</html>\n';
    }

    function createDownloadName(name) {
      var fileName = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().replace(/[. ]+$/, '');

      if (!fileName) {
        fileName = 'cuento infantil';
      }
      if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(fileName)) {
        fileName = 'cuento ' + fileName;
      }

      return fileName + '.html';
    }

    setupForm.addEventListener('submit', function(event) {
      event.preventDefault();

      if (!setupForm.reportValidity()) {
        return;
      }

      storyName = titleInput.value.trim();
      var nextImageCount = Number(imageCountInput.value);

      if (!storyName || !Number.isInteger(nextImageCount) || nextImageCount < 1 || nextImageCount > 100) {
        feedback.textContent = 'Escribe un nombre y elige entre 1 y 100 imágenes.';
        return;
      }

      if (imageCount !== nextImageCount) {
        imageCount = nextImageCount;
        createTimingFields();
      }
      setupForm.hidden = true;
      timingForm.hidden = false;
      feedback.textContent = '';
      timingFields.querySelector('input').focus();
    });

    timingFields.addEventListener('input', updateStartTimes);

    document.getElementById('timing-back').addEventListener('click', function() {
      timingForm.hidden = true;
      setupForm.hidden = false;
      feedback.textContent = '';
      titleInput.focus();
    });

    timingForm.addEventListener('submit', function(event) {
      event.preventDefault();

      if (!timingForm.reportValidity()) {
        return;
      }

      var durationInputs = timingFields.querySelectorAll('input[type="number"]');
      var durations = Array.prototype.map.call(durationInputs, function(input) {
        return Number(input.value);
      });

      if (durations.length !== imageCount || durations.some(function(duration) {
        return !Number.isFinite(duration) || duration <= 0;
      })) {
        feedback.textContent = 'Revisa que todas las duraciones sean mayores que cero.';
        return;
      }

      var file = new Blob([createStoryHtml(storyName, durations)], { type: 'text/html;charset=utf-8' });
      var downloadUrl = URL.createObjectURL(file);
      var downloadLink = document.createElement('a');

      downloadLink.href = downloadUrl;
      downloadLink.download = createDownloadName(storyName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(function() {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
      feedback.textContent = 'Se descargó "' + downloadLink.download + '". Conserva el HTML junto a las carpetas imagenes, audio, lib, css y js para abrir la presentación.';
    });
  });
})(jQuery);
