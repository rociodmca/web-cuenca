/**
 * CUENCA MÁGICA - JAVASCRIPT PRINCIPAL
 * Funcionalidades interactivas, filtrado, modal, calculadora de presupuesto y navegación.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileNav();
  initPlacesFilter();
  initPlacesModal();
  initItineraryTabs();
  initBudgetCalculator();
  initZoneTabs();
  initNewsletter();
  initSmoothScroll();
});

/* ==========================================================================
   1. GESTIÓN DE TEMA (CLARO / OSCURO PATRIMONIAL)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('cuenca_theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('cuenca_theme', newTheme);
      updateThemeIcon(newTheme === 'light');
      showToast(`Modo ${newTheme === 'light' ? 'Día soleado' : 'Atardecer patrimonial'} activado`);
    });
  }
}

function updateThemeIcon(isLight) {
  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.innerHTML = isLight ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', isLight ? 'Cambiar a modo noche' : 'Cambiar a modo día');
  }
}

/* ==========================================================================
   2. CABECERA DINÁMICA & SCROLL SPY
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header scrolled state
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scroll spy
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. MENÚ MÓVIL
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('menu-toggle-btn');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuBtn.innerHTML = isOpen ? '✕' : '☰';
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuBtn.innerHTML = '☰';
      });
    });
  }
}

/* ==========================================================================
   4. FILTRADO DE LUGARES IMPRESCINDIBLES
   ========================================================================== */
function initPlacesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const placeCards = document.querySelectorAll('.place-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover clase activa
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      placeCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. DETALLES Y MODAL INTERACTIVO
   ========================================================================== */
const PLACES_DATA = {
  'casas-colgadas': {
    title: 'Casas Colgadas y Puente de San Pablo',
    category: 'Monumento Icono',
    image: 'assets/images/hero-cuenca.jpg',
    description: 'Suspendidas sobre la vertiginosa Hoz del Huécar, las Casas Colgadas son el emblema inmortal de Cuenca. Datadas en el siglo XV, destacan sus balconadas voladizas de madera que desafían el abismo. Cruzar la pasarela de hierro del Puente de San Pablo (construida originalmente en 1533 y reconstruida en 1902 por el ingeniero José María Fagoaga) brinda una panorámica legendaria e inolvidable.',
    schedule: 'Exterior visible 24h. Interior alberga el Museo de Arte Abstracto Español.',
    price: 'Acceso al puente gratuito | Museo: Gratuito',
    tips: 'El mejor momento fotográfico es el atardecer, cuando la roca caliza se tiñe de tonos dorados y se enciende la iluminación artística monumental.',
    location: 'Calle Canónigos, s/n (Sobre la Hoz del Huécar)'
  },
  'catedral': {
    title: 'Catedral de Santa María y San Julián',
    category: 'Joya Gótica & Plaza Mayor',
    image: 'assets/images/catedral.jpg',
    description: 'Iniciada a finales del siglo XII por el rey Alfonso VIII y su esposa Leonor de Plantagenet, es la primera catedral gótica de Castilla, con una marcada influencia anglonormanda única en España. Su fachada recortada con gran rosetón preside la vibrante Plaza Mayor de fachadas policromadas. En su interior atesora el triforio gótico, la capilla de los Apóstoles y un sobrecogedor claustro renacentista.',
    schedule: 'Lunes a domingo de 10:00 a 19:30 (horario continuado)',
    price: 'General: 6,00 € (incluye audioguía) | Reducida: 5,00 €',
    tips: 'No te pierdas la subida al Triforio para obtener una perspectiva cenital de las naves y la Plaza Mayor.',
    location: 'Plaza Mayor, 1, 16001 Cuenca'
  },
  'ciudad-encantada': {
    title: 'La Ciudad Encantada (Serranía de Cuenca)',
    category: 'Monumento Natural Kárstico',
    image: 'assets/images/ciudad-encantada.jpg',
    description: 'Declarada Sitio Natural de Interés Nacional en 1929, es un prodigio geológico situado a 1.500 metros de altitud en el corazón de la Serranía de Cuenca. Durante más de 90 millones de años, la acción del agua, el hielo y el viento modeló las rocas calizas cretácicas formando figuras como El Tormo Alto, Los Barcos, El Puente Romano, La Tortuga o El Convento.',
    schedule: 'Abierto todos los días de 10:00 a 18:00 (cierre taquillas 1h antes)',
    price: 'Entrada individual: 6,00 € | Niños (7 a 12 años): 5,00 €',
    tips: 'El recorrido circular es de unos 3 kilómetros (1h 30min). Lleva calzado de trekking cómodo y agua. A solo 28 km de Cuenca capital.',
    location: 'Carretera CM-2104, Km 19, 16140 Valdecabras'
  },
  'rio-cuervo': {
    title: 'Nacimiento del Río Cuervo',
    category: 'Paraje Natural & Cascadas',
    image: 'assets/images/rio-cuervo.jpg',
    description: 'En Vega del Codorno brota este río tributario formando uno de los espectáculos fluviales más bellos de la península. Las aguas calizas filtradas han depositado tobas calcáreas recubiertas de musgo por donde caen cascadas y cortinas de agua cristalina formando pozas turquesas entre tilos, serbales y pinos silvestres.',
    schedule: 'Acceso libre durante todo el año',
    price: 'Gratuito',
    tips: 'En primavera con el deshielo o tras lluvias de otoño es cuando las cascadas bajan con mayor caudal. Sendero accesible y señalizado.',
    location: 'Vega del Codorno (Serranía Alta de Cuenca, a 80 km de la capital)'
  },
  'arte-abstracto': {
    title: 'Museo de Arte Abstracto Español',
    category: 'Cultura & Vanguardia',
    image: 'assets/images/arte-abstracto.jpg',
    description: 'Fundado en 1966 por el artista y mecenas Fernando Zóbel junto a Gustavo Torner y Gerardo Rueda, este museo ubicado dentro de las auténticas Casas Colgadas fue calificado por Alfred H. Barr (primer director del MoMA de Nueva York) como "el museo de arte moderno más bello del mundo". Alberga obras maestras de Tàpies, Chillida, Saura, Millares y Sempere.',
    schedule: 'Martes a sábado de 11:00 a 14:00 y 16:00 a 18:00 | Domingos de 11:00 a 14:30',
    price: 'Entrada Gratuita (gestión de la Fundación Juan March)',
    tips: 'Las ventanas del museo enmarcan cuadros naturales de la Hoz del Huécar que rivalizan con las pinturas de las salas.',
    location: 'Casas Colgadas, Calle Canónigos, s/n'
  },
  'barrio-castillo': {
    title: 'Miradores del Barrio del Castillo y Torre Mangana',
    category: 'Miradores Panorámicos',
    image: 'assets/images/hero-cuenca.jpg',
    description: 'El punto más elevado del casco antiguo conserva restos de la muralla y fortaleza árabe de Qunka del siglo X. Desde sus arcos y pasarelas se contempla a vista de pájaro la doble garganta de los ríos Júcar y Huécar. A mitad de bajada, la emblemática Torre de Mangana vela el antiguo barrio judío con sus campanas centenarias.',
    schedule: 'Acceso libre al aire libre 24h',
    price: 'Gratuito',
    tips: 'Sube en el autobús L1 o L2 hasta la parada del Castillo para hacer toda la bajada panorámica a pie sin cansarte.',
    location: 'Calle Trabuco / Plaza Mayor - Torre Mangana'
  }
};

function initPlacesModal() {
  const modalOverlay = document.getElementById('details-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalBanner = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalLocation = document.getElementById('modal-location');
  const modalDesc = document.getElementById('modal-desc');
  const modalSchedule = document.getElementById('modal-schedule');
  const modalPrice = document.getElementById('modal-price');
  const modalTips = document.getElementById('modal-tips');

  const openButtons = document.querySelectorAll('[data-place-id]');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const placeId = btn.getAttribute('data-place-id');
      const data = PLACES_DATA[placeId];

      if (data) {
        modalBanner.src = data.image;
        modalBanner.alt = data.title;
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalLocation.textContent = data.location;
        modalDesc.textContent = data.description;
        modalSchedule.textContent = data.schedule;
        modalPrice.textContent = data.price;
        modalTips.textContent = data.tips;

        modalOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. PESTAÑAS DE ITINERARIOS
   ========================================================================== */
function initItineraryTabs() {
  const tabs = document.querySelectorAll('.itinerary-tab');
  const panels = document.querySelectorAll('.itinerary-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. CALCULADORA DINÁMICA DE PRESUPUESTO
   ========================================================================== */
function initBudgetCalculator() {
  const guestsInput = document.getElementById('calc-guests');
  const daysInput = document.getElementById('calc-days');
  const guestsVal = document.getElementById('val-guests');
  const daysVal = document.getElementById('val-days');
  const styleInputs = document.querySelectorAll('input[name="travel-style"]');

  const totalAmountEl = document.getElementById('calc-total');
  const hotelAmountEl = document.getElementById('breakdown-hotel');
  const gastroAmountEl = document.getElementById('breakdown-gastro');
  const ticketsAmountEl = document.getElementById('breakdown-tickets');

  function calculate() {
    const guests = parseInt(guestsInput?.value || '2', 10);
    const days = parseInt(daysInput?.value || '2', 10);
    
    // Actualizar etiquetas
    if (guestsVal) guestsVal.textContent = `${guests} ${guests === 1 ? 'viajero' : 'viajeros'}`;
    if (daysVal) daysVal.textContent = `${days} ${days === 1 ? 'día' : 'días'}`;

    // Estilo de viaje
    let style = 'comfort';
    styleInputs.forEach(input => {
      if (input.checked) style = input.value;
    });

    // Tarifas promedio estimadas (€/noche o €/persona/día)
    let hotelRatePerRoom = 65; // económico
    let gastroPerPersonDay = 25;
    let activitiesPerPersonDay = 10;

    if (style === 'comfort') {
      hotelRatePerRoom = 115;
      gastroPerPersonDay = 45;
      activitiesPerPersonDay = 18;
    } else if (style === 'premium') {
      hotelRatePerRoom = 230; // Parador / hotel boutique
      gastroPerPersonDay = 90; // Menú degustación estrella o alta cocina
      activitiesPerPersonDay = 35; // Visitas privadas
    }

    const rooms = Math.ceil(guests / 2);
    const nights = Math.max(1, days - 1);

    const totalHotel = rooms * hotelRatePerRoom * nights;
    const totalGastro = guests * gastroPerPersonDay * days;
    const totalTickets = guests * activitiesPerPersonDay * days;
    const grandTotal = totalHotel + totalGastro + totalTickets;

    if (totalAmountEl) totalAmountEl.textContent = `${grandTotal} €`;
    if (hotelAmountEl) hotelAmountEl.textContent = `${totalHotel} € (${nights} ${nights === 1 ? 'noche' : 'noches'})`;
    if (gastroAmountEl) gastroAmountEl.textContent = `${totalGastro} €`;
    if (ticketsAmountEl) ticketsAmountEl.textContent = `${totalTickets} €`;
  }

  guestsInput?.addEventListener('input', calculate);
  daysInput?.addEventListener('input', calculate);
  styleInputs.forEach(radio => radio.addEventListener('change', calculate));

  // Cálculo inicial
  calculate();
}

/* ==========================================================================
   8. PESTAÑAS DEL MAPA Y ZONAS
   ========================================================================== */
const ZONE_DATA = {
  'ciudad-alta': {
    title: 'Ciudad Alta & Plaza Mayor',
    desc: 'El corazón medieval fortificado. Calles empedradas estrechas, conventos históricos, casonas blasonadas y el ambiente de las terrazas de la Plaza Mayor frente a la Catedral.',
    highlights: ['Catedral de Cuenca', 'Plaza Mayor y Ayuntamiento barroco', 'Convento de las Carmelitas', 'Mirador de Florencio Cañete'],
    tip: 'Lleva calzado cómodo. Se recomienda subir en autobús (L1/L2) y descender paseando.'
  },
  'hoz-huecar': {
    title: 'La Hoz del Huécar',
    desc: 'El cañón más vertical y dramático de Cuenca. Sus paredes calcáreas verticales son el escenario natural de las Casas Colgadas y el Puente de San Pablo.',
    highlights: ['Casas Colgadas', 'Puente de Hierro de San Pablo', 'Antiguo Convento de San Pablo (Parador Nacional)', 'Paseo fluvial del Huécar'],
    tip: 'Espectaculares vistas nocturnas con la iluminación de los farallones rocosos.'
  },
  'hoz-jucar': {
    title: 'La Hoz del Júcar & San Antón',
    desc: 'Un entorno más verde y fluvial, ideal para el senderismo, el piragüismo y la contemplación de la muralla natural norte que defiende la ciudad alta.',
    highlights: ['Ermita de la Virgen de las Angustias', 'Playa artificial y piragüismo', 'Recreo Peral y restaurantes ribereños', 'Pasarela del Júcar'],
    tip: 'Un remanso de paz para comer al lado del río o caminar bajo los álamos.'
  },
  'serrania-alta': {
    title: 'La Serranía Alta & Monumentos Naturales',
    desc: 'A menos de una hora en coche, los paisajes kársticos, los bosques de pino albar y los nacimientos fluviales de agua cristalina abren un paraíso ecoturístico.',
    highlights: ['La Ciudad Encantada', 'Nacimiento del Río Cuervo', 'El Ventano del Diablo', 'Torcas de Palancares y Lagunas de Cañada'],
    tip: 'Planifica una excursión de día completo en coche para conectar los parajes.'
  }
};

function initZoneTabs() {
  const zoneBtns = document.querySelectorAll('.map-tab-btn');
  const zoneTitle = document.getElementById('zone-title');
  const zoneDesc = document.getElementById('zone-desc');
  const zoneHighlights = document.getElementById('zone-highlights');
  const zoneTip = document.getElementById('zone-tip');

  zoneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      zoneBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const zoneKey = btn.getAttribute('data-zone');
      const data = ZONE_DATA[zoneKey];

      if (data) {
        if (zoneTitle) zoneTitle.textContent = data.title;
        if (zoneDesc) zoneDesc.textContent = data.desc;
        if (zoneTip) zoneTip.textContent = data.tip;

        if (zoneHighlights) {
          zoneHighlights.innerHTML = data.highlights
            .map(h => `<div class="zone-highlight-item"><span class="icon">✦</span><span>${h}</span></div>`)
            .join('');
        }
      }
    });
  });
}

/* ==========================================================================
   9. BOLETÍN Y NOTIFICACIÓN TOAST
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast('¡Gracias! Te hemos enviado la Guía Turística de Cuenca en PDF a tu correo.');
        input.value = '';
      }
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>ℹ️</span><span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   10. SCROLL SUAVE PARA ENLACES INTERNOS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight + 10;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}
