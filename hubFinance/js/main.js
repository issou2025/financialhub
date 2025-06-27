// Main JavaScript for Personal Finance Hub

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNavigation();
    initFAQAccordion();
    initNewsletterForm();
    initSmoothScrolling();
    initAdSense();
    initAnimations();
    initFormValidation();
    initParallaxEffects();
    initCardHoverEffects();
    initCounterAnimations();
    initTypingEffect();
    initModernInteractions();
    initPremiumEffects();
    initAdvanced3DEffects();
    initMagneticButtons();
    initParticleSystem();
    initGlowEffects();
    // Language support removed - site is now English only
});

// Mobile Navigation
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const nav = document.querySelector('.nav--header');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            nav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileToggle.contains(event.target) && !nav.contains(event.target)) {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// FAQ Accordion
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('.newsletter-form__input').value;
            const button = this.querySelector('.newsletter-form__button');
            const originalText = button.textContent;
            
            // Basic email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// AdSense Initialization
function initAdSense() {
    // Check if AdSense is loaded
    if (typeof adsbygoogle !== 'undefined') {
        // AdSense is already loaded, push ads
        (adsbygoogle = window.adsbygoogle || []).push({});
    } else {
        // Wait for AdSense to load
        window.addEventListener('load', function() {
            if (typeof adsbygoogle !== 'undefined') {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        });
    }
}

// Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .tool-card, .card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Staggered animations for grids
    const staggerElements = document.querySelectorAll('.features__grid, .tools-grid');
    staggerElements.forEach(grid => {
        if (grid.children.length > 0) {
            grid.classList.add('animate-stagger');
        }
    });
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('.form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Form submission validation
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fix the errors in the form.', 'error');
            }
        });
    });
}

// Field Validation
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (required && !value) {
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    // Type-specific validation
    switch (type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address.');
                return false;
            }
            break;
            
        case 'number':
            if (value && isNaN(value)) {
                showFieldError(field, 'Please enter a valid number.');
                return false;
            }
            break;
            
        case 'tel':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number.');
                return false;
            }
            break;
    }
    
    // Custom validation attributes
    const min = field.getAttribute('min');
    const max = field.getAttribute('max');
    const minLength = field.getAttribute('minlength');
    const maxLength = field.getAttribute('maxlength');
    
    if (min && parseFloat(value) < parseFloat(min)) {
        showFieldError(field, `Value must be at least ${min}.`);
        return false;
    }
    
    if (max && parseFloat(value) > parseFloat(max)) {
        showFieldError(field, `Value must be no more than ${max}.`);
        return false;
    }
    
    if (minLength && value.length < parseInt(minLength)) {
        showFieldError(field, `Must be at least ${minLength} characters.`);
        return false;
    }
    
    if (maxLength && value.length > parseInt(maxLength)) {
        showFieldError(field, `Must be no more than ${maxLength} characters.`);
        return false;
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('form__input--error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form__error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('form__input--error');
    
    const errorElement = field.parentNode.querySelector('.form__error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" aria-label="Close notification">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Number formatting utilities
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatPercentage(value, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
}

function formatNumber(value, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

// Local storage utilities
const Storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    },
    
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Failed to read from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Failed to remove from localStorage:', e);
        }
    }
};

// Export utilities for use in other scripts
window.FinanceHub = {
    formatCurrency,
    formatPercentage,
    formatNumber,
    Storage,
    showNotification
};

// Modern Interactions and Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero__shapes, .newsletter__shapes, .tools__pattern, .hero__orbs');
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            if (element) {
                const rate = scrolled * (-0.3 - index * 0.1);
                const rotation = scrolled * 0.05;
                element.style.transform = `translateY(${rate}px) rotate(${rotation}deg)`;
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

function initCardHoverEffects() {
    const cards = document.querySelectorAll('.tool-card, .feature-card, .category-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-16px) scale(1.02)';
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // Add glow effect
            card.style.boxShadow = '0 32px 64px rgba(99, 102, 241, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
    });
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('.hero__stat-number, .tools__stat-number');
    
    const animateCounter = (counter) => {
        const text = counter.textContent;
        const target = parseInt(text.replace(/[^\d]/g, ''));
        const suffix = text.replace(/[\d]/g, '');
        const duration = 2500;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix.includes('K')) {
                counter.textContent = Math.floor(current) + 'K+';
            } else if (suffix.includes('.')) {
                counter.textContent = (current / 10).toFixed(1) + '/5';
            } else if (suffix.includes('%')) {
                counter.textContent = Math.floor(current) + '%';
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateCounter(entry.target);
                }, Math.random() * 500);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function initTypingEffect() {
    const heroTitle = document.querySelector('.hero__title');
    
    if (heroTitle) {
        const textGradient = heroTitle.querySelector('.text-gradient');
        
        if (textGradient) {
            const gradientText = textGradient.textContent;
            textGradient.innerHTML = '';
            textGradient.classList.add('typing-cursor');
            
            let i = 0;
            const typeWriter = () => {
                if (i < gradientText.length) {
                    textGradient.textContent += gradientText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 120 + Math.random() * 80);
                } else {
                    textGradient.classList.remove('typing-cursor');
                    // Add sparkle effect after typing
                    setTimeout(() => {
                        textGradient.style.animation = 'gradientShift 3s ease-in-out infinite';
                    }, 500);
                }
            };
            
            setTimeout(typeWriter, 1500);
        }
    }
}

function initModernInteractions() {
    // Enhanced button effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.02)';
            btn.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = '';
        });
    });
    
    // Enhanced ripple effect
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.8s ease-out;
                pointer-events: none;
                z-index: 0;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Enhanced scroll to top
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '↑';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: var(--gradient-premium);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px) scale(0.8);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(scrollToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollToTop.style.opacity = '1';
            scrollToTop.style.transform = 'translateY(0) scale(1)';
        } else {
            scrollToTop.style.opacity = '0';
            scrollToTop.style.transform = 'translateY(100px) scale(0.8)';
        }
    });
    
    scrollToTop.addEventListener('mouseenter', () => {
        scrollToTop.style.transform = 'translateY(-5px) scale(1.1)';
        scrollToTop.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.4)';
    });
    
    scrollToTop.addEventListener('mouseleave', () => {
        scrollToTop.style.transform = 'translateY(0) scale(1)';
        scrollToTop.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
    });
    
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Premium Effects
function initPremiumEffects() {
    // Cursor trail effect
    initCursorTrail();
    
    // Advanced loading animations
    initLoadingAnimations();
    
    // Scroll-triggered reveals
    initScrollReveal();
    
    // Dynamic background effects
    initDynamicBackground();
}

function initCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(99, 102, 241, ${1 - i / trailLength});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateTrail() {
        for (let i = trail.length - 1; i > 0; i--) {
            trail[i].style.left = trail[i - 1].style.left;
            trail[i].style.top = trail[i - 1].style.top;
        }
        
        trail[0].style.left = mouseX + 'px';
        trail[0].style.top = mouseY + 'px';
        
        requestAnimationFrame(updateTrail);
    }
    
    updateTrail();
}

function initLoadingAnimations() {
    // Simulate loading for buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.classList.contains('btn--loading')) return;
            
            // Don't apply loading to navigation links
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) return;
            
            this.classList.add('btn--loading');
            
            setTimeout(() => {
                this.classList.remove('btn--loading');
            }, 2000);
        });
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.hero__stats, .tools__stats, .features__cta');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    revealElements.forEach(el => {
        el.style.transform = 'translateY(50px)';
        el.style.opacity = '0';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

function initDynamicBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const mesh = hero.querySelector('.hero__mesh');
    if (!mesh) return;
    
    let mouseX = 0;
    let mouseY = 0;
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
        
        const translateX = (mouseX - 0.5) * 50;
        const translateY = (mouseY - 0.5) * 50;
        
        mesh.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
}

// Premium 3D Effects
function initAdvanced3DEffects() {
    const cards = document.querySelectorAll('.tool-card, .feature-card, .card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Magnetic Button Effects
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn--primary, .btn--secondary');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 50;
            
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = x * force * 0.3;
                const moveY = y * force * 0.3;
                
                btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// Advanced Particle System
function initParticleSystem() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleContainer = hero.querySelector('.hero__particles');
    if (!particleContainer) return;
    
    // Create additional floating particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-dynamic';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
        `;
        particleContainer.appendChild(particle);
    }
}

// Glow Effects on Scroll
function initGlowEffects() {
    const glowElements = document.querySelectorAll('.btn--primary, .tool-card__icon, .feature-card__icon');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-glow');
            }
        });
    }, { threshold: 0.5 });
    
    glowElements.forEach(el => observer.observe(el));
}

// Add premium CSS animations
const premiumStyles = document.createElement('style');
premiumStyles.textContent = `
    .typing-cursor::after {
        content: '';
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        width: 3px;
        background: currentColor;
        animation: blink 1.2s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes gradientShift {
        0%, 100% { 
            background-position: 0% 50%;
            filter: hue-rotate(0deg);
        }
        50% { 
            background-position: 100% 50%;
            filter: hue-rotate(45deg);
        }
    }
    
    .animate-fade-in-up {
        animation: fadeInUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    
    .animate-fade-in-scale {
        animation: fadeInScale 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(40px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .scroll-to-top:hover {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3); }
        50% { box-shadow: 0 8px 25px rgba(99, 102, 241, 0.6), 0 0 0 20px rgba(99, 102, 241, 0.1); }
        100% { box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3); }
    }
    
    .cursor-trail {
        filter: blur(1px);
    }
    
    @media (max-width: 768px) {
        .cursor-trail {
            display: none;
        }
    }
`;
document.head.appendChild(premiumStyles);

// Language support removed - site is now English only 