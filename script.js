// Enhanced Portfolio JavaScript with Performance Optimizations
document.addEventListener('DOMContentLoaded', function () {
    // Performance optimization flags
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 4 || window.innerWidth <= 480;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preloader with enhanced animation
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', function () {
        setTimeout(function () {
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.style.overflow = 'visible';
                // Remove preloader after animation to free memory
                setTimeout(() => preloader.remove(), 300);
            }
        }, prefersReducedMotion ? 100 : 500);
    });

    // Enhanced Mobile Menu with touch support
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    if (hamburger && navLinks) {
        // Add touch event handling for better mobile experience
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Toggle body overflow and prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.top = `-${window.scrollY}px`;
                hamburger.setAttribute('aria-expanded', 'true');
                navLinks.setAttribute('aria-hidden', 'false');
            } else {
                const scrollY = document.body.style.top;
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.top = '';
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
                hamburger.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-hidden', 'true');
            }
        };

        hamburger.addEventListener('click', toggleMenu);

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !hamburger.contains(e.target) &&
                !navLinks.contains(e.target)) {
                toggleMenu();
            }
        });
    }

    // Close mobile menu when clicking on links with smooth scroll
    navLinkItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced Sticky Header with parallax effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function () {
        const currentScrollY = window.scrollY;

        // Add scrolled class for background
        header.classList.toggle('scrolled', currentScrollY > 50);

        // Parallax effect for header
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });

    // Active Link on Scroll with smooth transitions
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', function () {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Enhanced Back to Top Button with smooth animation
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Enhanced Projects Filter with smooth transitions
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectItems.forEach((item, index) => {
                setTimeout(() => {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        if (item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 100);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    }
                }, index * 100);
            });
        });
    });

    // Current Year in Footer
    const year = document.getElementById('year');
    year.textContent = new Date().getFullYear();

    // Enhanced Form Submission with Web3Forms API
    const contactForm = document.getElementById('contact-form');
    const result = document.getElementById('result');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const subject = this.querySelector('input[name="subject"]').value;
            const message = this.querySelector('textarea[name="message"]').value;

            // Basic validation
            if (!name || !email || !subject || !message) {
                showToast('Error', 'Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showToast('Error', 'Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            submitBtn.classList.add('loading');
            showToast('Sending', 'Please wait while we send your message...', 'info');

            // Prepare form data
            const formData = new FormData(this);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Submit to Web3Forms API
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        showToast('Success', 'Message sent successfully! I will get back to you soon.', 'success');
                        this.reset();
                    } else {
                        console.log(response);
                        showToast('Error', json.message || 'Something went wrong!', 'error');
                    }
                })
                .catch(error => {
                    console.log(error);
                    showToast('Error', 'Something went wrong! Please try again.', 'error');
                })
                .finally(function () {
                    // Remove loading state
                    submitBtn.classList.remove('loading');
                });
        });
    }

    // Toaster functionality
    function showToast(title, message, type = 'info') {
        const toaster = document.getElementById('toaster');
        if (!toaster) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        toaster.appendChild(toast);

        // Show toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto remove toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    }

    // Function to show form result message (kept for compatibility)
    function showFormResult(message, type) {
        showToast(type.charAt(0).toUpperCase() + type.slice(1), message, type);
    }

    // Function to hide form result message (kept for compatibility)
    function hideFormResult() {
        // This function is now handled by the toaster
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Enhanced Scroll Animations with Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Special animations for different elements
                if (entry.target.classList.contains('skill-progress')) {
                    entry.target.style.animationDelay = '0.2s';
                }

                if (entry.target.classList.contains('project-item')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                }

                // Add reveal animation
                if (entry.target.classList.contains('reveal')) {
                    entry.target.classList.add('animate');
                }

                if (entry.target.classList.contains('reveal-left')) {
                    entry.target.classList.add('animate');
                }

                if (entry.target.classList.contains('reveal-right')) {
                    entry.target.classList.add('animate');
                }

                if (entry.target.classList.contains('reveal-scale')) {
                    entry.target.classList.add('animate');
                }

                if (entry.target.classList.contains('stagger-animation')) {
                    entry.target.classList.add('animate');
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-progress, .skill-card, .project-item, .info-item, .about-img, .skills-text, .reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-animation, .section-header, .contact-info, .contact-form, .about-content, .skills-content, .contact-content, .tech-category, .tech-item');
    animateElements.forEach(el => observer.observe(el));

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Enhanced mouse move effect for hero with advanced cursor tracking and smoothness
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    document.addEventListener('mousemove', function (e) {
        targetMouseX = e.clientX / window.innerWidth;
        targetMouseY = e.clientY / window.innerHeight;
    });

    function smoothMouseMove() {
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;

        const heroContent = document.querySelector('.hero-content');
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroText = document.querySelector('.hero-text');
        const heroButtons = document.querySelector('.hero-buttons');
        const titleWords = document.querySelectorAll('.title-word');

        if (heroContent) {
            // Enhanced parallax effect for hero content with smooth interpolation
            heroContent.style.transform = `translate(${mouseX * 25}px, ${mouseY * 25}px) rotate(${mouseX * 3}deg)`;

            // Individual element animations with different speeds and smoothness
            if (heroTitle) {
                heroTitle.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px) scale(${1 + mouseX * 0.15})`;
            }

            // Animate each title word individually with smooth interpolation
            titleWords.forEach((word, index) => {
                const speed = 1 + index * 0.3;
                const rotation = mouseX * 8 * speed;
                word.style.transform = `translate(${mouseX * 15 * speed}px, ${mouseY * 15 * speed}px) rotate(${rotation}deg)`;
            });

            if (heroSubtitle) {
                heroSubtitle.style.transform = `translate(${mouseX * -15}px, ${mouseY * -15}px) scale(${1 + Math.abs(mouseX) * 0.08})`;
            }

            if (heroText) {
                heroText.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px) rotate(${mouseX * -2}deg)`;
            }

            if (heroButtons) {
                heroButtons.style.transform = `translate(${mouseX * -20}px, ${mouseY * -20}px) scale(${1 + Math.abs(mouseY) * 0.15})`;
            }
        }

        // Simple mouse tracking effect
        // createParticle(e.clientX, e.clientY);

        requestAnimationFrame(smoothMouseMove);
    }

    smoothMouseMove();

    // Simple particle effect (commented out for clean design)
    function createParticle(x, y) {
        // Uncomment to enable simple particles
        /*
        if (Math.random() > 0.98) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                left: ${x}px;
                top: ${y}px;
                animation: fadeOut 2s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
        */
    }

    // Enhanced floating particles effect
    function createFloatingParticle(x, y) {
        if (Math.random() > 0.97) { // Increased frequency
            const particle = document.createElement('div');
            const colors = ['var(--primary-gradient)', 'var(--secondary-gradient)', 'var(--accent-gradient)'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: ${randomColor};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                left: ${x}px;
                top: ${y}px;
                animation: float-particle ${Math.random() * 4 + 2}s ease-out forwards;
                box-shadow: 0 0 10px ${randomColor};
            `;

            document.body.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 4000);
        }
    }

    // Cursor trail effect
    function createCursorTrail(x, y) {
        if (Math.random() > 0.8) { // More frequent trails
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: var(--primary-gradient);
                border-radius: 50%;
                pointer-events: none;
                z-index: 2;
                left: ${x}px;
                top: ${y}px;
                animation: cursor-trail 1s ease-out forwards;
            `;

            document.body.appendChild(trail);

            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            }, 1000);
        }
    }

    // Floating particles effect
    function createFloatingParticle(x, y) {
        if (Math.random() > 0.95) { // Only create particles occasionally
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-gradient);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                left: ${x}px;
                top: ${y}px;
                animation: float-particle 3s ease-out forwards;
            `;

            document.body.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 3000);
        }
    }

    // Enhanced skill bars animation
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transform = 'scaleX(1)';
            }, index * 200);
        });
    }

    // Trigger skill bars animation when skills section is visible
    const skillsSection = document.querySelector('.skills');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Enhanced typing effect for hero title
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initialize typing effect when page loads - much faster
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 30); // Reduced from 80ms to 30ms
        }
    }, 200); // Reduced from 800ms to 200ms

    // Particle effect for background
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;

        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                animation: float-particle ${Math.random() * 10 + 10}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Add particle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize particles
    createParticles();

    // Enhanced hover effects for project items
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Smooth scroll for all internal links
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

    // Handle window resize
    function handleResize() {
        // Close mobile menu if window is resized to desktop size
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Recalculate animations on resize
        revealOnScroll();
    }

    // Add event listeners
    window.addEventListener('resize', handleResize);

    // Initialize sections with opacity 1 (always visible)
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        section.style.visibility = 'visible';
        section.style.display = 'block';
    });

    // Call reveal function on scroll
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial call

    // Enhanced reveal function that ensures sections stay visible
    function revealOnScroll() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.75) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                section.style.visibility = 'visible';
                section.style.display = 'block';
            }
        });
    }

    // Initialize with all projects visible
    filterBtns[0].click();

    // Enhanced smooth scrolling with custom easing
    function smoothScrollTo(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Custom easing function for smooth animation
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Apply smooth scrolling to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScrollTo(target, 800);
        });
    });

    // Enhanced Performance optimization with better throttling and debouncing
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimized scroll handling based on device capabilities
    const scrollLimit = isMobile || isLowEnd ? 32 : 16; // Adjust frame rate for performance

    // Apply throttling to scroll events
    window.addEventListener('scroll', throttle(function () {
        if (!prefersReducedMotion) {
            revealOnScroll();
        }
    }, scrollLimit), { passive: true });

    // Optimized resize handler
    window.addEventListener('resize', debounce(handleResize, 250), { passive: true });

    // Enhanced image loading with fallback
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Handle successful load
        img.addEventListener('load', function () {
            this.classList.add('loaded');
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });

        // Handle error with fallback
        img.addEventListener('error', function () {
            console.log('Image failed to load:', this.src);
            this.style.background = 'var(--glass-bg)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = 'var(--white)';
            this.style.fontSize = '1rem';
            this.style.fontWeight = '600';
            this.innerHTML = this.alt || 'Image';
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });

        // Set initial state for non-project images
        if (!img.classList.contains('profile-img') && !img.closest('.project-img')) {
            img.style.opacity = '0';
            img.style.transform = 'scale(0.8)';
            img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }

        // If image is already loaded (cached)
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }
    });

    // Special handling for profile image
    const profileImg = document.querySelector('.profile-img');
    const imgContainer = document.querySelector('.img-container');

    if (profileImg) {
        // Add specific loading animation for profile image
        profileImg.addEventListener('load', function () {
            console.log('Profile image loaded successfully');
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
            this.classList.add('loaded');

            // Remove loading state from container
            if (imgContainer) {
                imgContainer.classList.add('loaded');
            }
        });

        // If profile image fails to load, show a placeholder
        profileImg.addEventListener('error', function () {
            console.log('Profile image failed to load, using fallback');
            this.style.background = 'var(--glass-bg)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = 'var(--white)';
            this.style.fontSize = '1.5rem';
            this.style.fontWeight = '600';
            this.innerHTML = 'AS';
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';

            // Remove loading state from container
            if (imgContainer) {
                imgContainer.classList.add('loaded');
            }
        });

        // Check if image is already loaded
        if (profileImg.complete && profileImg.naturalHeight !== 0) {
            console.log('Profile image already loaded');
            profileImg.style.opacity = '1';
            profileImg.style.transform = 'scale(1)';
            profileImg.classList.add('loaded');
            if (imgContainer) {
                imgContainer.classList.add('loaded');
            }
        }
    }

    // Custom cursor with enhanced functionality
    function createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        document.body.appendChild(cursorFollower);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;
        let isMoving = false;

        // Show cursor when mouse moves
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isMoving) {
                cursor.classList.add('active');
                cursorFollower.classList.add('active');
                isMoving = true;
            }
        });

        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursorFollower.classList.remove('active');
            isMoving = false;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.08;
            cursorY += (mouseY - cursorY) * 0.08;
            followerX += (mouseX - followerX) * 0.2;
            followerY += (mouseY - followerY) * 0.2;

            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
            cursorFollower.style.transform = `translate(${followerX - 4}px, ${followerY - 4}px)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Enhanced cursor hover effects with smooth transitions
        const hoverElements = document.querySelectorAll('a, button, .project-item, .skill-card, .btn, .nav-link, .hero-content');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(2)';
                cursorFollower.style.transform += ' scale(0.2)';
                cursor.style.borderColor = 'var(--secondary-gradient)';
                cursorFollower.style.background = 'var(--secondary-gradient)';
                cursor.style.borderWidth = '4px';
                cursor.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                cursorFollower.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(2)', '');
                cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(0.2)', '');
                cursor.style.borderColor = 'var(--primary-gradient)';
                cursorFollower.style.background = 'var(--primary-gradient)';
                cursor.style.borderWidth = '2px';
            });
        });

        // Add cursor pulse effect on click with smooth animation
        document.addEventListener('click', () => {
            cursor.style.transform += ' scale(0.3)';
            cursorFollower.style.transform += ' scale(3)';
            cursor.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            cursorFollower.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            setTimeout(() => {
                cursor.style.transform = cursor.style.transform.replace(' scale(0.3)', '');
                cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(3)', '');
            }, 200);
        });
    }

    // Initialize custom cursor on desktop
    if (window.innerWidth > 768) {
        createCustomCursor();
    }

    // Technologies Section Animations
    function initTechnologiesAnimations() {
        const techItems = document.querySelectorAll('.tech-item');
        const techLevelBars = document.querySelectorAll('.level-bar');

        // Animate tech level bars when visible
        const techObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const levelBar = entry.target;
                    const level = levelBar.getAttribute('data-level');

                    setTimeout(() => {
                        levelBar.style.width = level + '%';
                    }, 200);

                    techObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        techLevelBars.forEach(bar => {
            techObserver.observe(bar);
        });

        // Add interactive hover effects
        techItems.forEach((item, index) => {
            // Stagger animation delay
            item.style.animationDelay = `${index * 0.1}s`;

            // Add click effect for mobile
            item.addEventListener('click', function () {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });

            // Add pulse animation on scroll into view
            const pulseObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.animation = 'techPulse 0.6s ease-out';
                        }, index * 100);
                        pulseObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.8 });

            pulseObserver.observe(item);
        });

        // Floating tech icons interactive effects
        const floatingTechs = document.querySelectorAll('.floating-tech');
        floatingTechs.forEach((tech, index) => {
            tech.style.animationDelay = `${index * 2}s`;

            // Add random positioning
            const randomTop = Math.random() * 80 + 10;
            const randomLeft = Math.random() * 80 + 10;
            tech.style.top = randomTop + '%';
            tech.style.left = randomLeft + '%';
        });
    }

    // Tech categories scroll reveal with enhanced effects
    function initTechCategoriesAnimation() {
        const techCategories = document.querySelectorAll('.tech-category');

        const categoryObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';

                        // Animate tech items within this category
                        const categoryTechItems = entry.target.querySelectorAll('.tech-item');
                        categoryTechItems.forEach((item, itemIndex) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, itemIndex * 100);
                        });

                    }, index * 200);

                    categoryObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        techCategories.forEach(category => {
            // Set initial state
            category.style.opacity = '0';
            category.style.transform = 'translateY(50px)';

            // Set initial state for tech items
            const techItems = category.querySelectorAll('.tech-item');
            techItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });

            categoryObserver.observe(category);
        });
    }

    // Tech item tooltip effect
    function initTechTooltips() {
        const techItems = document.querySelectorAll('.tech-item');

        techItems.forEach(item => {
            const techName = item.getAttribute('data-tech');
            const levelBar = item.querySelector('.level-bar');
            const level = levelBar ? levelBar.getAttribute('data-level') : '0';

            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'tech-tooltip';
            tooltip.innerHTML = `
                <strong>${techName}</strong><br>
                Proficiency: ${level}%
            `;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--text-dark);
                color: var(--white);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                opacity: 0;
                pointer-events: none;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                white-space: nowrap;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%) translateY(-10px);
                margin-bottom: 10px;
            `;

            // Add arrow
            const arrow = document.createElement('div');
            arrow.style.cssText = `
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid var(--text-dark);
            `;
            tooltip.appendChild(arrow);

            item.style.position = 'relative';
            item.appendChild(tooltip);

            // Show/hide tooltip
            item.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateX(-50%) translateY(0)';
            });

            item.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateX(-50%) translateY(-10px)';
            });
        });
    }

    // Initialize all technologies animations
    initTechnologiesAnimations();
    initTechCategoriesAnimation();
    initTechTooltips();

    // Add tech section to navigation observer
    const techSection = document.querySelector('#technologies');
    if (techSection) {
        // Add to existing sections array for navigation
        const existingSections = document.querySelectorAll('section');
        // Technologies section navigation is already handled by existing scroll logic
    }

    // Initialize Three.js 3D Animations
    function initThreeJSAnimations() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.log('Three.js not loaded, skipping 3D animations');
            return;
        }

        // Initialize Hero 3D Background
        initHero3DBackground();

        // Initialize Technologies 3D Background
        initTech3DBackground();

        // Initialize About 3D Background
        initAbout3DBackground();

        // Initialize Skills 3D Background
        initSkills3DBackground();

        // Initialize Projects 3D Background
        initProjects3DBackground();

        // Initialize Contact 3D Background
        initContact3DBackground();
    }

    // Hero Section 3D Background
    function initHero3DBackground() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particle system
        const particleCount = 800;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        // Create particles with random positions and colors
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Positions
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;

            // Colors (blue theme)
            const colorChoices = [
                [0.15, 0.39, 0.93], // Primary blue
                [0.06, 0.73, 0.51], // Secondary green
                [0.96, 0.62, 0.04], // Accent orange
                [1, 1, 1]           // White
            ];
            const randomColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
            colors[i] = randomColor[0];
            colors[i + 1] = randomColor[1];
            colors[i + 2] = randomColor[2];

            // Velocities
            velocities[i] = (Math.random() - 0.5) * 0.01;
            velocities[i + 1] = (Math.random() - 0.5) * 0.01;
            velocities[i + 2] = (Math.random() - 0.5) * 0.01;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Particle material
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // Connecting lines between particles
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x2563eb,
            transparent: true,
            opacity: 0.1
        });

        camera.position.z = 5;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Smooth mouse following
            targetX += (mouseX - targetX) * 0.02;
            targetY += (mouseY - targetY) * 0.02;

            // Update particle positions
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];

                // Boundary checking
                if (positions[i] > 10) positions[i] = -10;
                if (positions[i] < -10) positions[i] = 10;
                if (positions[i + 1] > 10) positions[i + 1] = -10;
                if (positions[i + 1] < -10) positions[i + 1] = 10;
                if (positions[i + 2] > 10) positions[i + 2] = -10;
                if (positions[i + 2] < -10) positions[i + 2] = 10;
            }

            particleSystem.geometry.attributes.position.needsUpdate = true;

            // Rotate particle system
            particleSystem.rotation.x += 0.001;
            particleSystem.rotation.y += 0.002;

            // Camera movement based on mouse
            camera.position.x += (targetX * 0.5 - camera.position.x) * 0.02;
            camera.position.y += (targetY * 0.5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Technologies Section 3D Background
    function initTech3DBackground() {
        const canvas = document.getElementById('tech-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create floating tech symbols
        const techShapes = [];
        const techGeometries = [
            new THREE.BoxGeometry(0.3, 0.3, 0.3),
            new THREE.SphereGeometry(0.2, 8, 6),
            new THREE.ConeGeometry(0.2, 0.4, 6),
            new THREE.CylinderGeometry(0.1, 0.2, 0.3, 6),
            new THREE.OctahedronGeometry(0.2),
            new THREE.TetrahedronGeometry(0.25)
        ];

        const materials = [
            new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.6 }),
            new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 }),
            new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.6 }),
            new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 }),
            new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.6 }),
            new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 })
        ];

        // Create tech shapes
        for (let i = 0; i < 50; i++) {
            const geometry = techGeometries[Math.floor(Math.random() * techGeometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const shape = new THREE.Mesh(geometry, material);

            shape.position.x = (Math.random() - 0.5) * 20;
            shape.position.y = (Math.random() - 0.5) * 20;
            shape.position.z = (Math.random() - 0.5) * 20;

            shape.rotation.x = Math.random() * Math.PI;
            shape.rotation.y = Math.random() * Math.PI;
            shape.rotation.z = Math.random() * Math.PI;

            // Add custom properties for animation
            shape.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: (Math.random() - 0.5) * 0.01,
                originalY: shape.position.y
            };

            techShapes.push(shape);
            scene.add(shape);
        }

        camera.position.z = 10;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Animate each tech shape
            techShapes.forEach((shape, index) => {
                // Rotation
                shape.rotation.x += shape.userData.rotationSpeed.x;
                shape.rotation.y += shape.userData.rotationSpeed.y;
                shape.rotation.z += shape.userData.rotationSpeed.z;

                // Floating animation
                shape.position.y = shape.userData.originalY + Math.sin(Date.now() * 0.001 + index) * 0.5;

                // Slow drift
                shape.position.x += shape.userData.floatSpeed;
                if (shape.position.x > 10) shape.position.x = -10;
                if (shape.position.x < -10) shape.position.x = 10;
            });

            // Camera gentle movement
            camera.position.x = Math.sin(Date.now() * 0.0005) * 2;
            camera.position.y = Math.cos(Date.now() * 0.0003) * 1;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        // Start animation when tech section comes into view
        const techSection = document.querySelector('#technologies');
        const techObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    techObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (techSection) {
            techObserver.observe(techSection);
        }

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // About Section 3D Background
    function initAbout3DBackground() {
        const canvas = document.getElementById('about-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create DNA-like helix structure for About section
        const points = [];
        const colors = [];
        const helixHeight = 20;
        const helixRadius = 3;
        const segments = 200;

        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 4; // 2 full rotations
            const y = (i / segments) * helixHeight - helixHeight / 2;

            // First helix
            points.push(
                Math.cos(angle) * helixRadius,
                y,
                Math.sin(angle) * helixRadius
            );

            // Second helix (offset by π)
            points.push(
                Math.cos(angle + Math.PI) * helixRadius,
                y,
                Math.sin(angle + Math.PI) * helixRadius
            );

            // Colors for both helixes
            colors.push(0.15, 0.39, 0.93); // Primary blue
            colors.push(0.06, 0.73, 0.51); // Secondary green
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const helix = new THREE.Points(geometry, material);
        scene.add(helix);

        camera.position.z = 8;

        function animate() {
            requestAnimationFrame(animate);

            helix.rotation.y += 0.005;
            helix.rotation.x += 0.002;

            renderer.render(scene, camera);
        }

        // Start animation when about section comes into view
        const aboutSection = document.querySelector('#about');
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (aboutSection) {
            aboutObserver.observe(aboutSection);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Skills Section 3D Background
    function initSkills3DBackground() {
        const canvas = document.getElementById('skills-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create skill bars in 3D space
        const skillBars = [];
        const skillLevels = [95, 90, 85, 85, 75, 70]; // Skill percentages
        const colors = [0x2563eb, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xef4444, 0x06b6d4];

        for (let i = 0; i < skillLevels.length; i++) {
            const barGroup = new THREE.Group();

            // Background bar
            const bgGeometry = new THREE.BoxGeometry(4, 0.2, 0.2);
            const bgMaterial = new THREE.MeshBasicMaterial({
                color: 0x333333,
                transparent: true,
                opacity: 0.3
            });
            const bgBar = new THREE.Mesh(bgGeometry, bgMaterial);

            // Skill level bar
            const skillWidth = (skillLevels[i] / 100) * 4;
            const skillGeometry = new THREE.BoxGeometry(skillWidth, 0.2, 0.2);
            const skillMaterial = new THREE.MeshBasicMaterial({
                color: colors[i],
                transparent: true,
                opacity: 0.8
            });
            const skillBar = new THREE.Mesh(skillGeometry, skillMaterial);

            // Position skill bar to align with background
            skillBar.position.x = (skillWidth - 4) / 2;

            barGroup.add(bgBar);
            barGroup.add(skillBar);

            // Position bars vertically
            barGroup.position.y = (skillLevels.length / 2 - i) * 0.8;
            barGroup.position.z = Math.sin(i) * 2;

            skillBars.push(barGroup);
            scene.add(barGroup);
        }

        camera.position.z = 8;
        camera.position.y = 0;

        function animate() {
            requestAnimationFrame(animate);

            skillBars.forEach((bar, index) => {
                bar.rotation.z += 0.01;
                bar.position.x = Math.sin(Date.now() * 0.001 + index) * 0.5;
            });

            camera.position.x = Math.sin(Date.now() * 0.0003) * 2;

            renderer.render(scene, camera);
        }

        const skillsSection = document.querySelector('#skills');
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (skillsSection) {
            skillsObserver.observe(skillsSection);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Projects Section 3D Background
    function initProjects3DBackground() {
        const canvas = document.getElementById('projects-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create project cards floating in 3D space
        const projectCards = [];
        const cardCount = 8;

        for (let i = 0; i < cardCount; i++) {
            const cardGeometry = new THREE.PlaneGeometry(2, 1.2);
            const cardMaterial = new THREE.MeshBasicMaterial({
                color: 0x2563eb,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const card = new THREE.Mesh(cardGeometry, cardMaterial);

            // Random positioning
            card.position.x = (Math.random() - 0.5) * 15;
            card.position.y = (Math.random() - 0.5) * 10;
            card.position.z = (Math.random() - 0.5) * 10;

            // Random rotation
            card.rotation.x = Math.random() * Math.PI;
            card.rotation.y = Math.random() * Math.PI;
            card.rotation.z = Math.random() * Math.PI;

            // Add animation properties
            card.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                },
                originalY: card.position.y
            };

            projectCards.push(card);
            scene.add(card);
        }

        camera.position.z = 12;

        function animate() {
            requestAnimationFrame(animate);

            projectCards.forEach((card, index) => {
                card.rotation.x += card.userData.rotationSpeed.x;
                card.rotation.y += card.userData.rotationSpeed.y;
                card.rotation.z += card.userData.rotationSpeed.z;

                card.position.y = card.userData.originalY + Math.sin(Date.now() * 0.001 + index) * 0.5;
            });

            camera.position.x = Math.sin(Date.now() * 0.0002) * 3;
            camera.position.y = Math.cos(Date.now() * 0.0001) * 2;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        const projectsSection = document.querySelector('#projects');
        const projectsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    projectsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (projectsSection) {
            projectsObserver.observe(projectsSection);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Contact Section 3D Background
    function initContact3DBackground() {
        const canvas = document.getElementById('contact-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create communication network effect
        const nodes = [];
        const connections = [];
        const nodeCount = 30;

        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const nodeGeometry = new THREE.SphereGeometry(0.1, 8, 6);
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: 0x10b981,
                transparent: true,
                opacity: 0.8
            });
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);

            node.position.x = (Math.random() - 0.5) * 20;
            node.position.y = (Math.random() - 0.5) * 15;
            node.position.z = (Math.random() - 0.5) * 15;

            nodes.push(node);
            scene.add(node);
        }

        // Create connections between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                if (distance < 5) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        nodes[i].position,
                        nodes[j].position
                    ]);
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: 0x2563eb,
                        transparent: true,
                        opacity: 0.3
                    });
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    connections.push(line);
                    scene.add(line);
                }
            }
        }

        camera.position.z = 15;

        function animate() {
            requestAnimationFrame(animate);

            // Animate nodes
            nodes.forEach((node, index) => {
                node.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
                node.rotation.x += 0.01;
                node.rotation.y += 0.01;
            });

            // Update connections
            connections.forEach(connection => {
                connection.geometry.setFromPoints([
                    connection.geometry.attributes.position.array.slice(0, 3),
                    connection.geometry.attributes.position.array.slice(3, 6)
                ]);
            });

            // Camera gentle movement
            camera.position.x = Math.sin(Date.now() * 0.0004) * 3;
            camera.position.y = Math.cos(Date.now() * 0.0002) * 2;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        const contactSection = document.querySelector('#contact');
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    contactObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (contactSection) {
            contactObserver.observe(contactSection);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Enhanced Section Transitions with 3D Effects
    function init3DSectionTransitions() {
        const sections = document.querySelectorAll('section');

        sections.forEach((section, index) => {
            const transition3D = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add 3D transform effects to section content
                        const content = entry.target.querySelector('.container');
                        if (content) {
                            content.style.transform = 'translateZ(0) scale(1)';
                            content.style.opacity = '1';
                        }
                    } else {
                        // Subtle 3D exit effect
                        const content = entry.target.querySelector('.container');
                        if (content) {
                            content.style.transform = 'translateZ(-50px) scale(0.95)';
                            content.style.opacity = '0.8';
                        }
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '-10% 0px -10% 0px'
            });

            transition3D.observe(section);
        });
    }

    // Performance optimization for mobile and multiple canvases
    function optimizeForMobile() {
        const isMobile = window.innerWidth <= 768;
        const isLowEnd = navigator.hardwareConcurrency <= 4 || window.innerWidth <= 480;

        if (isMobile || isLowEnd) {
            // Reduce opacity and effects for all canvases on mobile/low-end devices
            const canvases = [
                'hero-canvas',
                'about-canvas',
                'skills-canvas',
                'tech-canvas',
                'projects-canvas',
                'contact-canvas'
            ];

            canvases.forEach(canvasId => {
                const canvas = document.getElementById(canvasId);
                if (canvas) {
                    canvas.style.opacity = isMobile ? '0.3' : '0.4';
                    // Reduce frame rate for mobile
                    if (isMobile) {
                        canvas.style.filter = 'blur(1px)';
                    }
                }
            });
        }
    }

    // Performance monitoring and adaptive quality
    function initPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 60;

        function measureFPS() {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;

                // Adjust quality based on FPS
                if (fps < 30) {
                    // Reduce quality for better performance
                    document.querySelectorAll('canvas').forEach(canvas => {
                        if (canvas.style.opacity > 0.2) {
                            canvas.style.opacity = (parseFloat(canvas.style.opacity) * 0.8).toString();
                        }
                    });
                }
            }

            requestAnimationFrame(measureFPS);
        }

        measureFPS();
    }

    // Touch gesture support for mobile
    function initTouchGestures() {
        if (!isMobile) return;

        let touchStartY = 0;
        let touchEndY = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        // Add swipe to close menu
        if (navLinks) {
            navLinks.addEventListener('touchstart', e => {
                touchStartY = e.changedTouches[0].screenY;
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            navLinks.addEventListener('touchend', e => {
                touchEndY = e.changedTouches[0].screenY;
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const deltaY = touchStartY - touchEndY;
            const deltaX = touchStartX - touchEndX;

            // Swipe right to close menu
            if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX < 0 && navLinks.classList.contains('active')) {
                    hamburger.click();
                }
            }
        }

        // Improved touch feedback for buttons
        const touchElements = document.querySelectorAll('.btn, .nav-link, .social-link, .project-link, .filter-btn');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function () {
                this.style.transform = 'scale(0.95)';
            }, { passive: true });

            element.addEventListener('touchend', function () {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }, { passive: true });
        });
    }

    // Lazy loading for performance
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Enhanced smooth scrolling with better easing
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (navLinks && navLinks.classList.contains('active')) {
                        hamburger.click();
                    }
                }
            });
        });
    }

    // Service Worker for offline support (Progressive Web App features)
    function initServiceWorker() {
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
    }

    // Initialize all enhancements
    initTouchGestures();
    initLazyLoading();
    initSmoothScrolling();

    // Initialize 3D effects with performance checks
    setTimeout(() => {
        if (!isLowEnd && !prefersReducedMotion) {
            initThreeJSAnimations();
            init3DSectionTransitions();
        }
        optimizeForMobile();
        initPerformanceMonitoring();
        initServiceWorker();
    }, prefersReducedMotion ? 0 : 1000);

});