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

    // ===== CTA FORM SUBMIT → n8n webhook =====
    const N8N_WEBHOOK = 'https://troncarotest.app.n8n.cloud/webhook/retell-leads';
    const RATE_LIMIT_MS = 60 * 1000;

    const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const isValidPhone = v => /^\+\d{7,}$/.test(v.replace(/[\s\-().]/g, ''));

    function markField(id, valid) {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.borderColor = valid ? '' : 'rgba(239,68,68,0.7)';
        el.style.boxShadow = valid ? '' : '0 0 0 3px rgba(239,68,68,0.15)';
    }
    function clearFieldErrors() {
        ['userName', 'userPhone', 'userEmail', 'userMessage'].forEach(id => markField(id, true));
    }

    window.submitForm = async function () {
        clearFieldErrors();

        const name = document.getElementById('userName').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const message = document.getElementById('userMessage').value.trim();

        // Honeypot anti-bot
        const honey = document.getElementById('_hp_field');
        if (honey && honey.value) return;

        // Rate limiting
        const lastSubmit = Number(localStorage.getItem('conversiaLastSubmit') || 0);
        const elapsed = Date.now() - lastSubmit;
        if (elapsed < RATE_LIMIT_MS) {
            const wait = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
            showToast(`Esperá ${wait}s antes de volver a enviar.`, 'warning');
            return;
        }

        // Validaciones
        let valid = true;
        if (!name) { markField('userName', false); valid = false; }
        if (!isValidPhone(phone)) { markField('userPhone', false); valid = false; }
        if (!isValidEmail(email)) { markField('userEmail', false); valid = false; }
        if (!valid) {
            showToast('Revisá los campos marcados en rojo.', 'warning');
            return;
        }

        const btn = document.getElementById('ctaBtn');
        const originalText = btn.textContent;
        btn.textContent = '⏳ Enviando...';
        btn.disabled = true;

        try {
            const response = await fetch(N8N_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: name, telefono: phone, email, mensaje: message })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            localStorage.setItem('conversiaLastSubmit', Date.now());

            btn.textContent = '✅ ¡Mensaje enviado!';
            btn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
            showToast('¡Gracias ' + name + '! Te contactamos pronto 🚀', 'success');

            ['userName', 'userPhone', 'userEmail', 'userMessage'].forEach(id => {
                document.getElementById(id).value = '';
            });

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 4000);

        } catch (err) {
            console.error('Error al enviar formulario:', err);
            showToast('Hubo un error al enviar. Intentá de nuevo.', 'warning');
            btn.textContent = originalText;
            btn.disabled = false;
        }
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
