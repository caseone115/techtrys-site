/* ===========================================
   TECHTRYS — Shared Components & Utilities
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollReveal();
  initAccordions();
  initFilterBar();
  initTestimonialCarousel();
  initCounterAnimation();
});

/* --- Navigation --- */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      menu.classList.toggle('open');
      toggle.innerHTML = menu.classList.contains('open') ? '✕' : '☰';
    });
    
    // Close on link click
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('open');
        toggle.innerHTML = '☰';
      });
    });
  }
  
  // Header scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
  
  // Highlight active nav link
  var path = window.location.pathname;
  document.querySelectorAll('.nav-desktop a, .mobile-menu a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href && path.indexOf(href) !== -1 && href !== '/') {
      a.classList.add('active');
    } else if (href && path === '/' && href === '/') {
      a.classList.add('active');
    }
  });
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  reveals.forEach(function(el) { observer.observe(el); });
}

/* --- Accordions --- */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      var accordion = this.parentElement;
      var isOpen = accordion.classList.contains('open');
      
      // Close all siblings
      var siblings = accordion.parentElement ? accordion.parentElement.querySelectorAll('.accordion.open') : [];
      siblings.forEach(function(s) { if (s !== accordion) s.classList.remove('open'); });
      
      accordion.classList.toggle('open');
    });
  });
}

/* --- Filter Bar --- */
function initFilterBar() {
  document.querySelectorAll('.filter-bar').forEach(function(bar) {
    bar.querySelectorAll('.filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = this.getAttribute('data-filter');
        var target = this.getAttribute('data-target');
        
        // Toggle active state
        bar.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        
        // Filter items
        var items = document.querySelectorAll(target + ' .filter-item');
        items.forEach(function(item) {
          if (!filter || filter === 'all') {
            item.style.display = '';
          } else {
            item.style.display = item.getAttribute('data-category') === filter ? '' : 'none';
          }
        });
      });
    });
  });
}

/* --- Testimonial Carousel --- */
function initTestimonialCarousel() {
  var carousels = document.querySelectorAll('.testimonial-carousel');
  carousels.forEach(function(carousel) {
    var items = carousel.querySelectorAll('.testimonial-slide');
    if (items.length < 2) return;
    
    var current = 0;
    items.forEach(function(item, i) { 
      item.style.display = i === 0 ? '' : 'none';
    });
    
    // Create dots
    var dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    dotsContainer.style.cssText = 'display:flex;justify-content:center;gap:.5rem;margin-top:1.5rem';
    
    for (var i = 0; i < items.length; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.style.cssText = 'width:10px;height:10px;border-radius:50%;border:none;background:' + (i === 0 ? 'var(--blue)' : 'var(--gray-300)') + ';cursor:pointer;transition:all .3s';
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      (function(idx) {
        dot.addEventListener('click', function() { goTo(idx); });
      })(i);
      dotsContainer.appendChild(dot);
    }
    carousel.appendChild(dotsContainer);
    
    function goTo(idx) {
      items.forEach(function(item) { item.style.display = 'none'; });
      items[idx].style.display = '';
      carousel.querySelectorAll('.carousel-dot').forEach(function(d, i) {
        d.style.background = i === idx ? 'var(--blue)' : 'var(--gray-300)';
      });
      current = idx;
    }
    
    // Auto-rotate
    setInterval(function() {
      goTo((current + 1) % items.length);
    }, 5000);
  });
}

/* --- Toast Notification --- */
function showToast(message, icon) {
  icon = icon || '✓';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<span class="toast-icon">' + icon + '</span>' + message;
  container.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('toast-out');
    setTimeout(function() { toast.remove(); }, 300);
  }, 4000);
}

/* --- Counter Animation --- */
function initCounterAnimation() {
  var counters = document.querySelectorAll('.stat-value[data-target]');
  if (!counters.length) return;
  
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(function(c) { observer.observe(c); });
  
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'));
    var duration = 2000;
    var start = 0;
    var startTime = null;
    var suffix = el.getAttribute('data-suffix') || '';
    
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}
