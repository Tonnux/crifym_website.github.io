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
