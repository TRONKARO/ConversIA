/* =====================================================
   ConversIA — script.js
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PARTICLES =====
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.width = (Math.random() * 2 + 1) + 'px';
        p.style.height = p.style.width;
        p.style.animationDelay = (Math.random() * 20) + 's';
        p.style.animationDuration = (15 + Math.random() * 12) + 's';
        p.style.opacity = Math.random() * 0.6 + 0.2;
        container.appendChild(p);
    }

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const onScroll = debounce(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, 10);
    window.addEventListener('scroll', onScroll);

    // ===== HAMBURGER / MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const isOpen = mobileMenu.classList.contains('open');
        hamburger.querySelectorAll('span').forEach((s, i) => {
            if (isOpen) {
                if (i === 0) s.style.transform = 'rotate(45deg) translate(5px,5px)';
                if (i === 1) s.style.opacity = '0';
                if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px,-5px)';
            } else {
                s.style.transform = '';
                s.style.opacity = '';
            }
        });
    });

    mobileMenu.querySelectorAll('.mobile-link, .btn-primary').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== INTERSECTION OBSERVER — reveal animations =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // Stagger for grid items
                const siblings = entry.target.parentElement.querySelectorAll('.animate-reveal');
                let delay = 0;
                siblings.forEach((el, i) => { if (el === entry.target) delay = i * 80; });
                setTimeout(() => entry.target.classList.add('visible'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.animate-reveal').forEach(el => revealObserver.observe(el));

    // ===== ANIMATED COUNTERS =====
    const counters = document.querySelectorAll('.stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.target));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el, target, duration = 1800) {
        const startTime = performance.now();
        const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        };
        requestAnimationFrame(update);
    }

    // ===== FLIP CARDS — click en todos los dispositivos =====
    const flipCards = document.querySelectorAll('.service-card-flip');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            const isFlipped = card.classList.contains('flipped');
            // Cerrar todas las demás
            flipCards.forEach(c => c.classList.remove('flipped'));
            // Si esta no estaba abierta, abrirla
            if (!isFlipped) {
                card.classList.add('flipped');
            }
        });
    });

    // Cerrar al hacer click fuera de una card
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.service-card-flip')) {
            flipCards.forEach(c => c.classList.remove('flipped'));
        }
    });

    // ===== METRIC COUNTERS in Cases section =====
    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.metric-num').forEach(el => {
                    const val = parseFloat(el.textContent);
                    if (!isNaN(val)) animateCounter(el, val);
                });
                metricObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.case-card').forEach(c => metricObserver.observe(c));

    // ===== PARALLAX on hero bg glow =====
    const heroBgGlow = document.querySelector('.hero-bg-glow');
    window.addEventListener('scroll', debounce(() => {
        if (heroBgGlow) {
            heroBgGlow.style.transform = `translateX(-50%) translateY(${window.scrollY * 0.25}px)`;
        }
    }, 5));

    // ===== CTA FORM SUBMIT =====
    // ⚠️ Reemplazá TU_NUMERO por tu número en formato internacional
    // Ejemplo Argentina: 5491155556666  (54 + 9 + área sin 0 + número sin 15)
    const WHATSAPP_NUMBER = '541151257006';

    window.submitForm = function () {
        const name = document.getElementById('userName').value.trim();
        const company = document.getElementById('userCompany').value.trim();
        const email = document.getElementById('userEmail').value.trim();

        if (!name || !company) {
            showToast('Por favor completá tu nombre y empresa.', 'warning');
            return;
        }

        // Arma el mensaje — email aparece solo si fue completado
        const emailLine = email ? `📧 Email: ${email}\n` : '';
        const message = `Hola ConversIA! 👋 Me interesa el diagnóstico gratuito.\n\n` +
            `📛 Nombre: ${name}\n` +
            `🏢 Empresa / Rubro: ${company}\n` +
            emailLine +
            `\n¿Cuándo podemos hablar?`;

        const encodedMsg = encodeURIComponent(message);
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

        const btn = document.getElementById('ctaBtn');
        btn.textContent = '✅ Abriendo WhatsApp...';
        btn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
        btn.disabled = true;

        showToast('¡Redirigiendo a WhatsApp, ' + name + '!', 'success');

        // Pequeño delay para que el usuario vea el feedback
        setTimeout(() => { window.open(waUrl, '_blank'); }, 800);
    };

    // ===== TOAST NOTIFICATION =====
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
      position: fixed; bottom: 32px; right: 32px;
      background: ${type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)'};
      border: 1px solid ${type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(245,158,11,0.4)'};
      color: ${type === 'success' ? '#4ade80' : '#fbbf24'};
      backdrop-filter: blur(16px);
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 9999;
      max-width: 340px;
      animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1);
    `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ===== UTILITY: DEBOUNCE =====
    function debounce(fn, wait) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
    }

    // ===== CSS for toast animation (inject once) =====
    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
    `;
        document.head.appendChild(style);
    }

});
