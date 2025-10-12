// Interactive elements and advanced animations
// This file handles complex interactions beyond basic functionality

document.addEventListener('DOMContentLoaded', function() {
    initFloatingCards();
    initParticleBackground();
    initFormValidation();
    initTestimonialCarousel();
    initTypewriterEffect();
    initParallaxEffects();
    
    console.log('Interactive elements initialized!');
});

// Floating cards with advanced tilt effects
function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-card, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            // Add glow effect based on mouse position
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                scale3d(1.02, 1.02, 1.02)
            `;
            
            card.style.background = `
                radial-gradient(circle at ${glowX}% ${glowY}%, 
                rgba(0, 255, 255, 0.1) 0%, 
                rgba(155, 92, 255, 0.05) 50%,
                transparent 70%)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.background = '';
            
            // Add smooth transition back
            gsap.to(card, {
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// Simple particle background (fallback if Three.js fails)
function initParticleBackground() {
    const canvas = document.getElementById('threejs-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Create particles
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(0, 255, 255, ${Math.random() * 0.3})`;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            
            // Fade in and out
            this.alpha += Math.random() * 0.02 - 0.01;
            this.alpha = Math.max(0.1, Math.min(0.6, this.alpha));
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(50, Math.floor(canvas.width * canvas.height / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections between nearby particles
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    // Draw lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = 1 - (distance / 100);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.1})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Start animation
    initParticles();
    animate();
}

// Form validation for contact form
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const errors = [];
        
        // Validate name
        const name = formData.get('name');
        if (!name || name.length < 2) {
            errors.push('Please enter a valid name');
        }
        
        // Validate email
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Validate message
        const message = formData.get('message');
        if (!message || message.length < 10) {
            errors.push('Please enter a message with at least 10 characters');
        }
        
        if (errors.length > 0) {
            showFormErrors(errors);
        } else {
            submitForm(formData);
        }
    });
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(field.name) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
        showFieldSuccess(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFieldSuccess(field) {
    field.classList.add('success');
    setTimeout(() => {
        field.classList.remove('success');
    }, 2000);
}

function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-errors');
    existingErrors.forEach(error => error.remove());
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-errors';
    
    errors.forEach(error => {
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = error;
        errorContainer.appendChild(errorElement);
    });
    
    const contactForm = document.getElementById('contact-form');
    contactForm.insertBefore(errorContainer, contactForm.firstChild);
    
    // Scroll to errors
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function submitForm(formData) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showFormSuccess();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        document.getElementById('contact-form').reset();
    }, 2000);
}

function showFormSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div class="success-icon">✓</div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for your message. I'll get back to you soon.</p>
    `;
    
    const contactForm = document.getElementById('contact-form');
    contactForm.innerHTML = '';
    contactForm.appendChild(successMessage);
    
    // Add animation
    gsap.fromTo(successMessage, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
    );
}

// Testimonial carousel
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;
    
    const testimonials = carousel.querySelectorAll('.testimonial');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    
    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    function goToSlide(index) {
        currentIndex = index;
        
        // Update testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === currentIndex);
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Animate transition
        gsap.fromTo(testimonials[currentIndex], 
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.5 }
        );
    }
    
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        goToSlide(prevIndex);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto-advance
    setInterval(nextSlide, 5000);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// Typewriter effect for hero text
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                
                // Start cursor blink
                const cursor = document.createElement('span');
                cursor.className = 'typewriter-cursor';
                cursor.textContent = '|';
                element.appendChild(cursor);
                
                setInterval(() => {
                    cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
                }, 500);
            }
        }, 100);
    });
}

// Parallax scrolling effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            const depth = element.getAttribute('data-parallax-depth') || 0.5;
            const movement = rate * depth;
            element.style.transform = `translateY(${movement}px)`;
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});