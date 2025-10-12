// Main JavaScript file for Alaa Atef Elesily Portfolio
// Handles initialization, theme switching, and core functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoadingScreen();
    initThemeToggle();
    initScrollAnimations();
    initNavigation();
    initStatsCounter();
    initSkillBars();
    initChatBubble();
    initKeyboardShortcuts();
    
    console.log('Portfolio initialized successfully!');
});

// Loading Screen Animation
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 200);
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
        
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    });
}

function updateThemeIcon(theme, iconElement) {
    iconElement.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// Scroll Animations with GSAP
function initScrollAnimations() {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate elements on scroll
    gsap.utils.toArray('.section-title, .section-description').forEach(element => {
        gsap.fromTo(element, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Stagger animation for project cards
    gsap.fromTo('.project-card', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Animate skill bars on scroll
    gsap.utils.toArray('.skill-progress').forEach(progressBar => {
        ScrollTrigger.create({
            trigger: progressBar,
            start: 'top 80%',
            onEnter: () => {
                const width = progressBar.getAttribute('data-width');
                gsap.to(progressBar, {
                    width: `${width}%`,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Animated stats counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.round(current);
        }, 16);
    });
}

// Initialize skill bars (backup for GSAP)
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = `${width}%`;
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// AI Chat Bubble functionality
function initChatBubble() {
    const chatBubble = document.getElementById('ai-chat-bubble');
    
    if (chatBubble) {
        chatBubble.addEventListener('click', () => {
            // Scroll to contact section
            document.querySelector('footer').scrollIntoView({ 
                behavior: 'smooth' 
            });
            
            // Add visual feedback
            chatBubble.style.transform = 'scale(0.9)';
            setTimeout(() => {
                chatBubble.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only trigger if not in input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key.toLowerCase()) {
            case 'h': // Home
                e.preventDefault();
                window.location.href = 'index.html';
                break;
            case 'a': // About
                e.preventDefault();
                window.location.href = 'about.html';
                break;
            case 'p': // Projects
                e.preventDefault();
                if (window.location.pathname.endsWith('index.html')) {
                    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = 'index.html#projects';
                }
                break;
            case 'c': // Contact
                e.preventDefault();
                window.location.href = 'contact.html';
                break;
            case 'd': // Toggle dark/light mode
                e.preventDefault();
                document.getElementById('theme-toggle').click();
                break;
        }
    });
}

// Utility function for tilt effect
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Export functions for use in other files
window.Portfolio = {
    initTiltEffect,
    initThemeToggle,
    initScrollAnimations
};