// contact.js - Professional Contact Page Functionality
class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupForm();
        this.setupMap();
        this.setupCopyButtons();
        this.setupAnimations();
        this.setupInteractions();
    }

    setupTheme() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();

        this.themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
            this.updateThemeIcon();
            this.showToast('Theme switched to ' + this.currentTheme + ' mode');
        });
    }

    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    setupNavigation() {
        this.menuToggle = document.getElementById('menu-toggle');
        this.navMenu = document.getElementById('nav-menu');

        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.menuToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.menuToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    setupForm() {
        this.contactForm = document.getElementById('contactForm');
        this.submitBtn = this.contactForm.querySelector('.submit-btn');
        this.successModal = document.getElementById('successModal');
        this.closeModal = document.getElementById('closeModal');

        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        this.closeModal.addEventListener('click', () => {
            this.successModal.classList.remove('active');
            this.contactForm.reset();
        });

        // Form field animations
        this.setupFormFields();
    }

    setupFormFields() {
        const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Initialize fields with values
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    async handleFormSubmit() {
        const formData = new FormData(this.contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            service: formData.get('service'),
            message: formData.get('message')
        };

        // Show loading state
        this.submitBtn.classList.add('loading');

        try {
            // Simulate API call
            await this.simulateApiCall(data);
            
            // Show success
            this.submitBtn.classList.remove('loading');
            this.successModal.classList.add('active');
            
            // Track form submission
            this.trackFormSubmission(data);
            
        } catch (error) {
            this.submitBtn.classList.remove('loading');
            this.showToast('Error sending message. Please try again.');
            console.error('Form submission error:', error);
        }
    }

    simulateApiCall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve(data);
            }, 2000);
        });
    }

    setupMap() {
        // Initialize map with Beni Suef coordinates
        const map = L.map('map').setView([29.0667, 31.0833], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        // Add marker for Ehnasia City
        const marker = L.marker([29.0667, 31.0833]).addTo(map)
            .bindPopup('Ehnasia City, Beni Suef<br>My Location')
            .openPopup();

        // Style map container
        map.getContainer().style.borderRadius = '12px';
    }

    setupCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const textToCopy = btn.getAttribute('data-text');
                this.copyToClipboard(textToCopy);
            });
        });
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard: ' + text);
        } catch (err) {
            console.error('Failed to copy: ', err);
            this.showToast('Failed to copy text');
        }
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.glass-card, .section-header, .social-card').forEach(el => {
            el.classList.add('pre-animate');
            observer.observe(el);
        });
    }

    setupInteractions() {
        // Enhanced hover effects
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Social card interactions
        document.querySelectorAll('.social-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Contact method interactions
        document.querySelectorAll('.contact-method').forEach(method => {
            method.addEventListener('mouseenter', () => {
                method.querySelector('.copy-btn').style.opacity = '1';
            });
            
            method.addEventListener('mouseleave', () => {
                method.querySelector('.copy-btn').style.opacity = '0';
            });
        });
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    trackFormSubmission(data) {
        // Analytics tracking
        console.log('Form analytics:', {
            event: 'contact_form_submission',
            timestamp: new Date().toISOString(),
            data: data
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add missing CSS for animations
const style = document.createElement('style');
style.textContent = `
    .pre-animate {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .menu-toggle.active span:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
    }
    
    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
        transform: scale(0);
    }
    
    .menu-toggle.active span:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);