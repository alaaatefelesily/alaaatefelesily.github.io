// links.js - Social Links Hub Functionality
class LinksPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupSearchFilter();
        this.setupCopyButtons();
        this.setupAnimations();
        this.setupInteractions();
        this.setupSmoothScrolling();
    }

    setupTheme() {
        this.themeToggle = document.getElementById('themeToggle');
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
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');

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

    setupSearchFilter() {
        this.searchInput = document.getElementById('platformSearch');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.categorySections = document.querySelectorAll('.category-section');

        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterPlatforms(searchTerm);
        });

        // Filter functionality
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                this.filterByCategory(filter);
            });
        });
    }

    filterPlatforms(searchTerm) {
        this.categorySections.forEach(section => {
            const platforms = section.querySelectorAll('.platform-card');
            let visibleCount = 0;

            platforms.forEach(platform => {
                const platformName = platform.querySelector('h3').textContent.toLowerCase();
                const platformDesc = platform.querySelector('p').textContent.toLowerCase();
                const platformHandle = platform.querySelector('.platform-handle').textContent.toLowerCase();

                const matches = platformName.includes(searchTerm) || 
                               platformDesc.includes(searchTerm) || 
                               platformHandle.includes(searchTerm);

                platform.style.display = matches ? 'flex' : 'none';
                if (matches) visibleCount++;
            });

            // Show/hide category section based on visible platforms
            section.style.display = visibleCount > 0 ? 'block' : 'none';
        });
    }

    filterByCategory(category) {
        this.categorySections.forEach(section => {
            if (category === 'all') {
                section.style.display = 'block';
                section.querySelectorAll('.platform-card').forEach(card => {
                    card.style.display = 'flex';
                });
            } else {
                const sectionCategory = section.dataset.category;
                if (sectionCategory === category) {
                    section.style.display = 'block';
                    section.querySelectorAll('.platform-card').forEach(card => {
                        card.style.display = 'flex';
                    });
                } else {
                    section.style.display = 'none';
                }
            }
        });

        // Clear search when filtering
        this.searchInput.value = '';
    }

    setupCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-handle-btn');
        
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
        document.querySelectorAll('.glass-card, .category-section, .platform-card').forEach(el => {
            el.classList.add('pre-animate');
            observer.observe(el);
        });
    }

    setupInteractions() {
        // Enhanced hover effects for platform cards
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-5px) scale(1)';
            });
        });

        // Scroll to top button
        const scrollTopBtn = document.getElementById('scrollTop');
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
            }
        });
    }

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
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

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Analytics tracking for link clicks
    trackLinkClick(platform, url) {
        console.log('Platform clicked:', {
            platform: platform,
            url: url,
            timestamp: new Date().toISOString()
        });
        
        // You can integrate with Google Analytics here
        // gtag('event', 'platform_click', { platform: platform });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const linksPage = new LinksPage();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Track platform clicks
    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', function() {
            const platform = this.dataset.platform;
            const url = this.href;
            linksPage.trackLinkClick(platform, url);
        });
    });
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
    
    #scrollTop {
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
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