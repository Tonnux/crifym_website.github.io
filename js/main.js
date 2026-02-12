/* ==========================================================================
   CRIFYM - JavaScript Principal
   Funcionalidades: menú responsive, sticky header, scroll suave,
   validación de formulario, interacciones ligeras
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   1. SELECTORES DEL DOM
   -------------------------------------------------------------------------- */
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const navMobile = document.querySelector('.nav-mobile');
const navMobileLinks = document.querySelectorAll('.nav-mobile__link');

/* --------------------------------------------------------------------------
   2. STICKY HEADER CON SOMBRA AL HACER SCROLL
   Agrega una clase al header cuando el usuario baja de 50px
   -------------------------------------------------------------------------- */
function handleStickyHeader() {
  if (window.scrollY > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
}

// Escuchar el evento scroll
window.addEventListener('scroll', handleStickyHeader);

// Ejecutar al cargar la página (por si ya hay scroll)
handleStickyHeader();

/* --------------------------------------------------------------------------
   3. MENÚ HAMBURGUESA (Mobile)
   Abre y cierra el menú en dispositivos móviles
   -------------------------------------------------------------------------- */
function toggleMobileMenu() {
  const isOpen = navMobile.classList.toggle('nav-mobile--open');
  menuToggle.classList.toggle('menu-toggle--active');

  // Bloquear scroll del body cuando el menú está abierto
  document.body.style.overflow = isOpen ? 'hidden' : '';

  // Accesibilidad: actualizar aria-expanded
  menuToggle.setAttribute('aria-expanded', isOpen);
}

// Cerrar menú al hacer clic en un enlace del menú mobile
function closeMobileMenu() {
  navMobile.classList.remove('nav-mobile--open');
  menuToggle.classList.remove('menu-toggle--active');
  document.body.style.overflow = '';
  menuToggle.setAttribute('aria-expanded', 'false');
}

// Event listeners del menú
if (menuToggle && navMobile) {
  menuToggle.addEventListener('click', toggleMobileMenu);

  // Cerrar menú al hacer clic en un enlace
  navMobileLinks.forEach(function(link) {
    link.addEventListener('click', closeMobileMenu);
  });
}

/* --------------------------------------------------------------------------
   4. CERRAR MENÚ MOBILE AL REDIMENSIONAR A DESKTOP
   Si el usuario abre el menú en mobile y luego agranda la ventana,
   el menú se cierra automáticamente.
   -------------------------------------------------------------------------- */
window.addEventListener('resize', function() {
  if (window.innerWidth >= 1024) {
    closeMobileMenu();
  }
});

/* --------------------------------------------------------------------------
   5. SCROLL SUAVE PARA ENLACES INTERNOS (#)
   Aplica a todos los enlaces que apunten a un ancla dentro de la misma página
   -------------------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');

    // Ignorar enlaces vacíos (#)
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      e.preventDefault();

      // Calcular la posición considerando el header sticky
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* --------------------------------------------------------------------------
   6. NAVEGACIÓN ACTIVA (resaltar enlace de la página actual)
   Agrega clase --active al enlace que corresponde a la página actual
   Usa azul clínico (#0B3C5D), NUNCA verde — el verde es solo para CTA
   -------------------------------------------------------------------------- */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Enlaces de navegación desktop
  document.querySelectorAll('.nav__link').forEach(function(link) {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) {
      link.classList.add('nav__link--active');
    }
  });

  // Enlaces de navegación mobile
  document.querySelectorAll('.nav-mobile__link').forEach(function(link) {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) {
      link.classList.add('nav-mobile__link--active');
    }
  });
}

setActiveNavLink();

/* --------------------------------------------------------------------------
   7. VALIDACIÓN BÁSICA DE FORMULARIO DE CONTACTO
   Solo se activa si existe un formulario con id="contact-form"
   -------------------------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');

    // Limpiar errores previos
    contactForm.querySelectorAll('.form-error').forEach(function(error) {
      error.remove();
    });
    contactForm.querySelectorAll('.form-field--error').forEach(function(field) {
      field.classList.remove('form-field--error');
    });

    // Validar cada campo requerido
    requiredFields.forEach(function(field) {
      const value = field.value.trim();

      if (!value) {
        isValid = false;
        showFieldError(field, 'Este campo es obligatorio');
        return;
      }

      // Validar email
      if (field.type === 'email' && !isValidEmail(value)) {
        isValid = false;
        showFieldError(field, 'Ingresa un correo electrónico válido');
      }
    });

    // Si todo es válido, enviar el formulario (o mostrar mensaje de éxito)
    if (isValid) {
      // Aquí se puede conectar con un servicio de envío de formularios
      showFormSuccess();
    }
  });
}

/**
 * Muestra un mensaje de error debajo de un campo del formulario
 * @param {HTMLElement} field - El campo con error
 * @param {string} message - El mensaje de error a mostrar
 */
function showFieldError(field, message) {
  field.classList.add('form-field--error');
  const errorElement = document.createElement('span');
  errorElement.className = 'form-error';
  errorElement.textContent = message;
  field.parentNode.appendChild(errorElement);
}

/**
 * Valida si un string tiene formato de correo electrónico
 * @param {string} email - El correo a validar
 * @returns {boolean}
 */
function isValidEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Muestra un mensaje de éxito después de enviar el formulario
 */
function showFormSuccess() {
  if (!contactForm) return;

  contactForm.innerHTML = '<div class="form-success">' +
    '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" stroke-width="2">' +
    '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>' +
    '<polyline points="22 4 12 14.01 9 11.01"/>' +
    '</svg>' +
    '<h3>¡Mensaje enviado!</h3>' +
    '<p>Nos pondremos en contacto con usted lo antes posible.</p>' +
    '</div>';
}

/* --------------------------------------------------------------------------
   8. AÑO ACTUAL EN EL FOOTER (Copyright)
   -------------------------------------------------------------------------- */
const yearElement = document.getElementById('current-year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   9. MODAL AGENDAR VALORACIÓN MÉDICA (página Contacto)
   Abre modal al hacer clic en el botón; cierre con X, overlay o ESC.
   Botón WhatsApp deshabilitado hasta que los campos obligatorios estén completos.
   Al enviar, genera mensaje formal y abre wa.me con el texto codificado.
   -------------------------------------------------------------------------- */
var agendarModalOverlay = document.getElementById('agendar-modal-overlay');
var agendarModal = document.getElementById('agendar-modal');
var openAgendarBtns = document.querySelectorAll('.js-open-agendar-modal');
var closeAgendarBtn = document.getElementById('js-close-agendar-modal');
var agendarForm = document.getElementById('agendar-modal-form');
var agendarSubmitBtn = document.getElementById('js-agendar-enviar-whatsapp');

var WHATSAPP_NUMBER = '5219511101434';

function openAgendarModal() {
  if (!agendarModalOverlay) return;
  agendarModalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  agendarModalOverlay.setAttribute('aria-hidden', 'false');
}

function closeAgendarModal() {
  if (!agendarModalOverlay) return;
  agendarModalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
  agendarModalOverlay.setAttribute('aria-hidden', 'true');
}

function isAgendarFormValid() {
  if (!agendarForm) return false;
  var nombre = agendarForm.querySelector('#agendar-nombre');
  var telefono = agendarForm.querySelector('#agendar-telefono');
  var servicio = agendarForm.querySelector('#agendar-servicio');
  var fecha = agendarForm.querySelector('#agendar-fecha');
  var horario = agendarForm.querySelector('#agendar-horario');
  return nombre && telefono && servicio && fecha && horario &&
    nombre.value.trim() !== '' &&
    telefono.value.trim() !== '' &&
    servicio.value.trim() !== '' &&
    fecha.value.trim() !== '' &&
    horario.value.trim() !== '';
}

function updateAgendarSubmitButton() {
  if (!agendarSubmitBtn) return;
  agendarSubmitBtn.disabled = !isAgendarFormValid();
}

/* Opciones de horario por tipo de día (Lun-Vie 8:00-20:00, Sáb 8:00-12:00, Dom cerrado) */
var HORARIO_OPCIONES = {
  weekdays: [
    'Lunes a Viernes — 08:00 a.m. - 09:00 a.m.',
    'Lunes a Viernes — 09:00 a.m. - 10:00 a.m.',
    'Lunes a Viernes — 10:00 a.m. - 11:00 a.m.',
    'Lunes a Viernes — 11:00 a.m. - 12:00 p.m.',
    'Lunes a Viernes — 12:00 p.m. - 01:00 p.m.',
    'Lunes a Viernes — 01:00 p.m. - 02:00 p.m.',
    'Lunes a Viernes — 02:00 p.m. - 03:00 p.m.',
    'Lunes a Viernes — 03:00 p.m. - 04:00 p.m.',
    'Lunes a Viernes — 04:00 p.m. - 05:00 p.m.',
    'Lunes a Viernes — 05:00 p.m. - 06:00 p.m.',
    'Lunes a Viernes — 06:00 p.m. - 07:00 p.m.',
    'Lunes a Viernes — 07:00 p.m. - 08:00 p.m.'
  ],
  saturday: [
    'Sábado — 08:00 a.m. - 09:00 a.m.',
    'Sábado — 09:00 a.m. - 10:00 a.m.',
    'Sábado — 10:00 a.m. - 11:00 a.m.',
    'Sábado — 11:00 a.m. - 12:00 p.m.'
  ]
};

/**
 * Actualiza las opciones del select "Horario preferido" según la fecha elegida.
 * Lun-Vie: bloques de 1 h de 8:00 a 20:00. Sáb: 8:00 a 12:00. Dom: cerrado.
 */
function updateHorarioOptionsByDate() {
  var fechaInput = agendarForm && agendarForm.querySelector('#agendar-fecha');
  var horarioSelect = agendarForm && agendarForm.querySelector('#agendar-horario');
  if (!fechaInput || !horarioSelect) return;

  var fechaValue = fechaInput.value.trim();
  horarioSelect.innerHTML = '';

  var placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Seleccionar horario';
  horarioSelect.appendChild(placeholder);

  if (!fechaValue) {
    /* Sin fecha: solo placeholder; el usuario debe elegir fecha primero */
    return;
  }

  /* getDay(): 0 = Domingo, 1 = Lunes, ..., 6 = Sábado */
  var d = new Date(fechaValue + 'T12:00:00');
  var day = d.getDay();

  if (day === 0) {
    /* Domingo: cerrado, sin opciones seleccionables */
    var cerrado = document.createElement('option');
    cerrado.value = '';
    cerrado.textContent = 'Domingo — Cerrado (sin atención)';
    cerrado.disabled = true;
    horarioSelect.appendChild(cerrado);
    return;
  }

  if (day === 6) {
    HORARIO_OPCIONES.saturday.forEach(function(text) {
      var opt = document.createElement('option');
      opt.value = text;
      opt.textContent = text;
      horarioSelect.appendChild(opt);
    });
    return;
  }

  /* Lunes a Viernes (1-5) */
  HORARIO_OPCIONES.weekdays.forEach(function(text) {
    var opt = document.createElement('option');
    opt.value = text;
    opt.textContent = text;
    horarioSelect.appendChild(opt);
  });
}

function buildWhatsAppMessage() {
  if (!agendarForm) return '';
  var nombre = (agendarForm.querySelector('#agendar-nombre') && agendarForm.querySelector('#agendar-nombre').value.trim()) || '';
  var telefono = (agendarForm.querySelector('#agendar-telefono') && agendarForm.querySelector('#agendar-telefono').value.trim()) || '';
  var servicio = (agendarForm.querySelector('#agendar-servicio') && agendarForm.querySelector('#agendar-servicio').value.trim()) || '';
  var fecha = (agendarForm.querySelector('#agendar-fecha') && agendarForm.querySelector('#agendar-fecha').value.trim()) || '';
  var horario = (agendarForm.querySelector('#agendar-horario') && agendarForm.querySelector('#agendar-horario').value.trim()) || '';
  var comentarios = (agendarForm.querySelector('#agendar-comentarios') && agendarForm.querySelector('#agendar-comentarios').value.trim()) || '—';

  return 'Buenas tardes.\n\n' +
    'Solicito agendar una valoración médica.\n\n' +
    'Nombre: ' + nombre + '\n' +
    'Teléfono: ' + telefono + '\n' +
    'Servicio: ' + servicio + '\n' +
    'Fecha preferida: ' + fecha + '\n' +
    'Horario preferido: ' + horario + '\n' +
    'Comentarios: ' + comentarios + '\n\n' +
    'Quedo atento a confirmación.';
}

function sendAgendarViaWhatsApp() {
  if (!isAgendarFormValid()) return;
  var message = buildWhatsAppMessage();
  var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener,noreferrer');
  closeAgendarModal();
}

openAgendarBtns.forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') e.preventDefault();
    openAgendarModal();
    updateHorarioOptionsByDate();
    updateAgendarSubmitButton();
  });
});

if (closeAgendarBtn) {
  closeAgendarBtn.addEventListener('click', closeAgendarModal);
}

if (agendarModalOverlay) {
  agendarModalOverlay.addEventListener('click', function(e) {
    if (e.target === agendarModalOverlay) closeAgendarModal();
  });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && agendarModalOverlay && agendarModalOverlay.classList.contains('is-open')) {
    closeAgendarModal();
  }
});

if (agendarForm) {
  agendarForm.addEventListener('input', updateAgendarSubmitButton);
  agendarForm.addEventListener('change', updateAgendarSubmitButton);

  /* Al cambiar la fecha, adaptar las opciones de horario al día elegido y limpiar la selección */
  var fechaInput = agendarForm.querySelector('#agendar-fecha');
  if (fechaInput) {
    fechaInput.addEventListener('change', function() {
      updateHorarioOptionsByDate();
      var horarioSelect = agendarForm.querySelector('#agendar-horario');
      if (horarioSelect) horarioSelect.value = '';
      updateAgendarSubmitButton();
    });
  }
}

if (agendarSubmitBtn) {
  agendarSubmitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    sendAgendarViaWhatsApp();
  });
}

