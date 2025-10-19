/**
 * Premium Bilingual SEO Personal Website Scripts
 * Alaa Atef Elesily - Software Engineering Student
 * EDIT: Customize functionality as needed
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initTheme();
    initNavigation();
    initAnimations();
    initContactForm();
    initCopyButtons();
    initSocialLinks();
    initSkillsAnimation();
    initThreeJS();
    initKeyboardShortcuts();
    initAccessibility();
    initPerformance();
});

/**
 * Theme Management
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Show theme change notification
            showToast(`Switched to ${newTheme} theme`);
        });
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
}

/**
 * Navigation Management
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const header = document.querySelector('.header');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (navClose && navMenu) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
        });
    });
    
    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Animations and Effects
 */
function initAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
    
    // Initialize GSAP animations
    if (typeof gsap !== 'undefined') {
        // Hero section animations
        const heroTitle = document.querySelector('.hero__title');
        const heroSubtitle = document.querySelector('.hero__subtitle');
        const heroButtons = document.querySelector('.hero__buttons');
        
        if (heroTitle && heroSubtitle && heroButtons) {
            const tl = gsap.timeline();
            
            tl.from(heroTitle, {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            })
            .from(heroSubtitle, {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.5')
            .from(heroButtons, {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.3');
        }
        
        // ScrollTrigger animations
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Parallax effects
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(element => {
                gsap.to(element, {
                    yPercent: -20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            });
            
            // Skill bars animation
            const skillBars = document.querySelectorAll('.skill__progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                ScrollTrigger.create({
                    trigger: bar,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.to(bar, {
                            width: `${width}%`,
                            duration: 1.5,
                            ease: 'power2.out'
                        });
                    }
                });
            });
        }
    }
    
    // Floating shapes animation
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        if (shape) {
            gsap.to(shape, {
                y: -20,
                rotation: 180,
                duration: 3 + index,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            submitForm(this);
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Honeypot check
    const honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value !== '') {
        // Likely a bot - silently fail
        return false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    
    // Clear previous error
    clearError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

function showError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.style.borderColor = '#ef4444';
}

function clearError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    field.style.borderColor = '';
}

function submitForm(form) {
    const submitButton = form.querySelector('.form__submit');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual form submission)
    setTimeout(() => {
        showToast('Message sent successfully!', 'success');
        form.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

/**
 * Copy to Clipboard Functionality
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            
            copyToClipboard(textToCopy).then(success => {
                if (success) {
                    showToast('Copied to clipboard!');
                    
                    // Visual feedback
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="ri-check-line"></i> Copied!';
                    this.style.color = '#10b981';
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.style.color = '';
                    }, 2000);
                } else {
                    showToast('Failed to copy', 'error');
                }
            });
        });
    });
    
    // Username copy button
    const copyUsernameBtn = document.getElementById('copy-username');
    if (copyUsernameBtn) {
        copyUsernameBtn.addEventListener('click', () => {
            copyToClipboard('@alaaatefelesily').then(success => {
                if (success) {
                    showToast('Username copied to clipboard!');
                }
            });
        });
    }
}

async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

/**
 * Social Links Management
 */
function initSocialLinks() {
    // Copy all links
    const copyAllLinksBtn = document.getElementById('copy-all-links');
    if (copyAllLinksBtn) {
        copyAllLinksBtn.addEventListener('click', copyAllLinks);
    }
    
    // Open all links
    const openAllLinksBtn = document.getElementById('open-all-links');
    if (openAllLinksBtn) {
        openAllLinksBtn.addEventListener('click', openAllLinksConfirmation);
    }
    
    // Modal handling
    const modal = document.getElementById('confirmation-modal');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    
    if (modal && confirmBtn && cancelBtn) {
        confirmBtn.addEventListener('click', openAllLinks);
        cancelBtn.addEventListener('click', closeModal);
        
        // Close modal on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                closeModal();
            }
        });
    }
}

function copyAllLinks() {
    const socialCards = document.querySelectorAll('.social-card');
    let linksText = 'Alaa Atef Elesily - Social Links:\n\n';
    
    socialCards.forEach(card => {
        const title = card.querySelector('.social-card__title').textContent;
        const username = card.querySelector('.social-card__username').textContent;
        const url = card.querySelector('.social-card__action[data-copy]')?.getAttribute('data-copy') || 
                   card.querySelector('a')?.href;
        
        if (url) {
            linksText += `${title}: ${username}\n${url}\n\n`;
        }
    });
    
    copyToClipboard(linksText).then(success => {
        if (success) {
            showToast('All links copied to clipboard!');
        }
    });
}

function openAllLinksConfirmation() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
        
        // Focus trap
        const confirmBtn = document.getElementById('modal-confirm');
        if (confirmBtn) {
            confirmBtn.focus();
        }
    }
}

function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
    }
}

function openAllLinks() {
    const socialLinks = document.querySelectorAll('.social-card__action:first-child');
    let openedCount = 0;
    
    socialLinks.forEach(link => {
        if (link.href && link.target === '_blank') {
            window.open(link.href, '_blank', 'noopener,noreferrer');
            openedCount++;
        }
    });
    
    closeModal();
    showToast(`Opened ${openedCount} links in new tabs`);
}

/**
 * Skills Animation
 */
function initSkillsAnimation() {
    const skillProgresses = document.querySelectorAll('.skill__progress');
    
    skillProgresses.forEach(progress => {
        progress.addEventListener('mouseenter', function() {
            const tooltip = this.getAttribute('data-tooltip');
            if (tooltip) {
                // Tooltip is handled in CSS with data-tooltip attribute
            }
        });
    });
}

/**
 * Three.js Animation
 */
function initThreeJS() {
    const container = document.getElementById('threejs-container');
    if (!container || typeof THREE === 'undefined') return;
    
    try {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        
        renderer.setSize(400, 400);
        renderer.setClearColor(0x000000, 0);
        
        // Clear fallback content and add Three.js canvas
        const fallback = container.querySelector('.fallback-animation');
        if (fallback) {
            fallback.style.display = 'none';
        }
        container.appendChild(renderer.domElement);
        
        // Create geometry
        const geometry = new THREE.IcosahedronGeometry(2, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // Position camera
        camera.position.z = 5;
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.01;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        function handleResize() {
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
        
        window.addEventListener('resize', handleResize);
        handleResize();
        
    } catch (error) {
        console.warn('Three.js initialization failed:', error);
        // Fallback to CSS animation will remain visible
    }
}

/**
 * Keyboard Shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Global shortcuts (g + key)
        if (e.key === 'g' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            // Wait for second key
            document.addEventListener('keydown', function keyHandler(f) {
                if (f.key === 'h') {
                    // g + h - Go Home
                    e.preventDefault();
                    window.location.href = '/';
                } else if (f.key === 'c') {
                    // g + c - Go to Contact
                    e.preventDefault();
                    window.location.href = '/contact.html';
                } else if (f.key === 'a') {
                    // g + a - Go to About
                    e.preventDefault();
                    window.location.href = '/about.html';
                } else if (f.key === 'l') {
                    // g + l - Go to Links
                    e.preventDefault();
                    window.location.href = '/links.html';
                }
                
                document.removeEventListener('keydown', keyHandler);
            }, { once: true });
        }
        
        // Escape key - close modals/menus
        if (e.key === 'Escape') {
            // Close mobile menu
            const navMenu = document.getElementById('nav-menu');
            if (navMenu && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                document.body.style.overflow = '';
            }
            
            // Close modal
            closeModal();
        }
    });
}

/**
 * Accessibility Enhancements
 */
function initAccessibility() {
    // Focus management for modals
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Add aria-labels to social icons
    const socialIcons = document.querySelectorAll('.footer__social-link');
    socialIcons.forEach(icon => {
        if (!icon.getAttribute('aria-label')) {
            const platform = icon.querySelector('i').className.match(/ri-(.*?)-fill/);
            if (platform) {
                icon.setAttribute('aria-label', platform[1].charAt(0).toUpperCase() + platform[1].slice(1));
            }
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Performance Optimizations
 */
function initPerformance() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    const criticalResources = [
        '/assets/css/styles.css',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'font';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Set message and type
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    
    // Show toast
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Error Boundary
 */
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access if needed
window.Website = {
    copyToClipboard,
    showToast,
    initTheme,
    initNavigation
};