// Modern Portfolio JavaScript with Advanced Animations
document.addEventListener('DOMContentLoaded', function() {
    // Preloader with enhanced animation
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.style.overflow = 'visible';
        }, 500); // Reduced from 1000ms to 500ms
    });

    // Mobile Menu Toggle with enhanced animations
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Toggle body overflow when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on links with smooth scroll
    navLinkItems.forEach(item => {
        item.addEventListener('click', function(e) {
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
    
    window.addEventListener('scroll', function() {
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
    window.addEventListener('scroll', function() {
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
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', function(e) {
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
        btn.addEventListener('click', function() {
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
        contactForm.addEventListener('submit', function(e) {
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
            .finally(function() {
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
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Special animations for different elements
                if (entry.target.classList.contains('skill-progress')) {
                    entry.target.style.animationDelay = '0.5s';
                }
                
                if (entry.target.classList.contains('project-item')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-progress, .skill-card, .project-item, .info-item, .about-img, .skills-text');
    animateElements.forEach(el => observer.observe(el));

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', function() {
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
    
    document.addEventListener('mousemove', function(e) {
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
    function typeWriter(element, text, speed = 100) {
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

    // Initialize typing effect when page loads
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 80); // Reduced from 150ms to 80ms
        }
    }, 800); // Reduced from 2000ms to 800ms

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
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
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
    
    // Enhanced image loading with fallback
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Handle successful load
        img.addEventListener('load', function() {
            this.classList.add('loaded');
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Handle error with fallback
        img.addEventListener('error', function() {
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
        profileImg.addEventListener('load', function() {
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
        profileImg.addEventListener('error', function() {
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
});