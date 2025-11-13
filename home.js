// home.js - النسخة الأنيقة
document.addEventListener('DOMContentLoaded', function() {
    // إدارة الوضع الليلي/النهاري
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // تطبيق الوضع الحالي
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton(currentTheme);
    
    // تبديل الوضع
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
        
        // إضافة تأثير سلس
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    });
    
    function updateThemeButton(theme) {
        const themeText = themeToggle.querySelector('.theme-text');
        themeText.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    }

    // إدارة القائمة للجوال
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // تأثيرات التمرير السلس
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

    // تأثيرات الظهور عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // مراقبة العناصر للظهور
    document.querySelectorAll('.glass-card, .hero-content, .section-header').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // تأثير الكتابة للعنوان
    const heroTitle = document.querySelector('.hero-title');
    const originalHTML = heroTitle.innerHTML;
    
    function typeWriter() {
        heroTitle.innerHTML = '';
        const text = "Alaa Atef Elesily";
        let i = 0;
        
        function type() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 100);
            } else {
                // استعادة التنسيق الأصلي بعد الانتهاء
                setTimeout(() => {
                    heroTitle.innerHTML = originalHTML;
                }, 1000);
            }
        }
        type();
    }

    // بدء تأثير الكتابة بعد تحميل الصفحة
    setTimeout(typeWriter, 1000);

    // تأثيرات للـ Header عند التمرير
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'var(--bg-card)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.background = 'var(--bg-card)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = 'var(--shadow-sm)';
        }

        // إخفاء/إظهار الـ Header عند التمرير
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });

    // تأثيرات Hover محسنة للبطاقات
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // تحميل سلس للصفحة
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // تأثيرات للأيقونات العائمة
    const floatingBtns = document.querySelectorAll('.floating-btn');
    floatingBtns.forEach((btn, index) => {
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.style.animation = 'float 3s ease-in-out infinite';
    });

    // تحديث السنة في الفوتر
    const yearElement = document.querySelector('.footer-bottom p:first-child');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }

    // تحسين أداء التمرير
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // أي تأثيرات مرتبطة بالتمرير
                ticking = false;
            });
            ticking = true;
        }
    });
    // تحسينات قائمة الجوال
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;

    // إنشاء طبقة التعتيم إذا لم تكن موجودة
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    // فتح/إغلاق القائمة
    function toggleMenu() {
        const isOpening = !nav.classList.contains('active');
        
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (isOpening) {
            body.classList.add('menu-open');
            // إضافة حدث لإغلاق القائمة عند النقر على التعتيم
            overlay.addEventListener('click', closeMenu);
        } else {
            body.classList.remove('menu-open');
            overlay.removeEventListener('click', closeMenu);
        }
    }

    // إغلاق القائمة
    function closeMenu() {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('menu-open');
        overlay.removeEventListener('click', closeMenu);
    }

    // إضافة الأحداث
    mobileMenuBtn.addEventListener('click', toggleMenu);

    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // إذا كان الرابط يشير إلى صفحة أخرى، لا نمنع السلوك الافتراضي
            if (link.getAttribute('href').startsWith('http') || 
                link.getAttribute('href').includes('.html')) {
                return; // اترك السلوك الافتراضي يعمل
            }
            
            // إذا كان رابط تنقل داخلي، أغلق القائمة فقط
            e.preventDefault();
            closeMenu();
            
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            }
        });
    });

    // إغلاق القائمة عند الضغط على زر Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
        }
    });

    // إغلاق القائمة عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            closeMenu();
        }
    });
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
});
});