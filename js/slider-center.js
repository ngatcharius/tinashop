// Script pour détecter visuellement l'élément central du slider UIkit
(function () {
  const root = document.getElementById('slideimage');
  if (!root) return;

  const sliderContainer = root.querySelector('.uk-position-relative') || root;
  const slidesSelector = '.uk-slider-items > div';

  let rafId = null;
  let running = false;

  function updateCenter() {
    const slides = root.querySelectorAll(slidesSelector);
    if (!slides || slides.length === 0) return;

    const containerRect = sliderContainer.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;

    // Trouver la slide la plus proche du centre
    let minDist = Infinity;
    let centerSlide = null;
    slides.forEach((slide) => {
      const r = slide.getBoundingClientRect();
      const slideCenterX = r.left + r.width / 2;
      const dist = Math.abs(slideCenterX - containerCenterX);
      if (dist < minDist) {
        minDist = dist;
        centerSlide = slide;
      }
    });

    // Classe les slides : is-center (la plus proche), is-near (voisines), is-far (autres)
    slides.forEach((slide) => {
      slide.classList.remove('is-center', 'is-near', 'is-far');
    });

    if (!centerSlide) return;

    centerSlide.classList.add('is-center');

    // Détecte voisins directs (visuellement proches) : on considère distance en nombre d'éléments
    // Ici on fait simple : on marque comme 'near' les slides dont le centre est à moins de 0.35 * containerWidth du centre.
    const nearThreshold = containerRect.width * 0.25; // ajustable
    const farThreshold = containerRect.width * 0.45; // ajustable

    slides.forEach((slide) => {
      if (slide === centerSlide) return;
      const r = slide.getBoundingClientRect();
      const slideCenterX = r.left + r.width / 2;
      const dist = Math.abs(slideCenterX - containerCenterX);
      if (dist <= nearThreshold) {
        slide.classList.add('is-near');
      } else if (dist <= farThreshold) {
        slide.classList.add('is-far');
      } else {
        // slides très éloignées : on garde is-far (ou aucun)
        slide.classList.add('is-far');
      }
    });
  }

  // Utilise requestAnimationFrame pour mettre à jour à intervalle régulier (léger)
  function loop() {
    if (running) {
      updateCenter();
      rafId = window.requestAnimationFrame(() => setTimeout(loop, 250)); // ~4x/s
    }
  }

  function start() {
    if (running) return;
    running = true;
    loop();
  }

  function stop() {
    running = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Démarrer automatiquement
  start();

  // Mettre à jour au resize
  window.addEventListener('resize', updateCenter);
  // Si l'onglet devient caché, on stop pour économiser CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  // Aussi mettre à jour quand l'utilisateur clique sur les controls du slider (par sécurité)
  root.addEventListener('click', () => setTimeout(updateCenter, 120));
  // Si UIkit change la liste visible (autoplay), updateCenter est appelé régulièrement par la loop,
  // mais tu peux aussi écouter des évènements spécifiques UIkit si nécessaire.

  // Première mise à jour
  setTimeout(updateCenter, 200);
})();
