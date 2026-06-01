const hamburger = document.querySelector('.hamburger');
const submitButton = document.querySelector('.form-submit');
const currentYear = document.getElementById('current-year');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Mobile menu
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const cta = document.querySelector('.nav-cta');
  if (!links) return;
  const open = links.style.display === 'flex';
  links.style.display = open ? '' : 'flex';
  links.style.flexDirection = 'column';
  links.style.position = 'absolute';
  links.style.top = '64px';
  links.style.left = '0';
  links.style.right = '0';
  links.style.background = 'rgba(32,28,86,.98)';
  links.style.padding = '20px 24px';
  links.style.gap = '20px';
  if (cta) cta.style.display = open ? '' : 'block';
}

hamburger?.addEventListener('click', toggleMenu);

// Scroll-reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.prod-card, .svc-card, .sector-card, .wv-card, .value-item, .faq-item, .pdf-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

// LÓGICA DE CONTADORES ANIMADOS (Stats Counter)
const statsElements = document.querySelectorAll('.stat-num[data-target], .wv-num[data-target]');

const animateCounter = (el) => {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const isPercentage = el.textContent.includes('%');
  const isPlus = el.textContent.includes('+');
  
  let count = 0;
  const duration = 1200; // Milisegundos de duración
  const startTime = performance.now();
  
  const update = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    // Easing out cuadrático
    const easeProgress = progress * (2 - progress);
    count = Math.floor(easeProgress * target);
    
    el.innerHTML = `${count}${isPlus ? '<span>+</span>' : ''}${isPercentage ? '%' : ''}`;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.innerHTML = `${target}${isPlus ? '<span>+</span>' : ''}${isPercentage ? '%' : ''}`;
    }
  };
  
  requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statsElements.forEach(el => statsObserver.observe(el));

// LÓGICA DE ACORDEÓN DE PREGUNTAS FRECUENTES (FAQs)
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentNode;
    const answer = item.querySelector('.faq-answer');
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Cierra otras preguntas abiertas (Efecto premium)
    document.querySelectorAll('.faq-item').forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-answer').classList.remove('open');
      }
    });
    
    // Alterna el acordeón seleccionado
    question.setAttribute('aria-expanded', !isExpanded);
    answer.classList.toggle('open');
  });
});

// VALIDACIÓN Y ENVÍO DE FORMULARIO DE CONTACTO
function validateField(input, isEmail = false) {
  if (!input) return true;
  const value = input.value.trim();
  let isValid = true;
  
  if (value === '') {
    isValid = false;
  } else if (isEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
  }
  
  if (!isValid) {
    input.classList.add('error');
  } else {
    input.classList.remove('error');
  }
  
  return isValid;
}

function sendForm(e) {
  e?.preventDefault();
  
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');
  const toast = document.getElementById('toast');
  
  const isNameValid = validateField(nameInput);
  const isEmailValid = validateField(emailInput, true);
  const isMsgValid = validateField(messageInput);
  
  if (!isNameValid || !isEmailValid || !isMsgValid) {
    return;
  }
  
  // Si todo es válido, vaciamos el formulario
  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  if (messageInput) messageInput.value = '';
  
  const companyInput = document.getElementById('form-company');
  const phoneInput = document.getElementById('form-phone');
  const sectorInput = document.getElementById('form-sector');
  if (companyInput) companyInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (sectorInput) sectorInput.value = '';
  
  // Disparamos la notificación de éxito
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

submitButton?.addEventListener('click', sendForm);

// Eliminar marca de error cuando el usuario comience a escribir
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      input.classList.remove('error');
    }
  });
});

// LÓGICA DE FILTRADO PARA EL BUSCADOR DE PRODUCTOS (productos.html)
const searchInput = document.getElementById('product-search');
const productCards = document.querySelectorAll('.detail-item');

searchInput?.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  
  productCards.forEach(card => {
    const title = card.querySelector('.detail-item-header h3').textContent.toLowerCase();
    const description = card.querySelector('.detail-description').textContent.toLowerCase();
    const features = Array.from(card.querySelectorAll('.detail-features-list li')).map(li => li.textContent.toLowerCase()).join(' ');
    
    const isMatch = title.includes(query) || description.includes(query) || features.includes(query);
    
    if (isMatch) {
      card.style.display = 'block';
      // Permite la animación de desvanecimiento
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, 50);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px) scale(0.98)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
});
