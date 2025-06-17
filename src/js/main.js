import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from '@studio-freight/lenis';
import * as THREE from 'three';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

class NikeWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScroll();
    this.setupNavigation();
    this.setupLoadingScreen();
    this.setupHeroAnimations();
    this.setupParticles();
    this.setupScrollAnimations();
    this.setupProductFilters();
    this.setupMobileMenu();
    this.setupFormHandlers();
    this.setupIntersectionObserver();
  }

  setupSmoothScroll() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger with Lenis
    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    // Navbar scroll effect - mais suave
    let lastScrollY = 0;
    let ticking = false;

    const updateNavbar = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll
      if (scrollY > lastScrollY && scrollY > 200) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);

    // Smooth scroll for navigation links - melhorado
    const handleNavClick = (e, link) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      
      if (targetId === '#home') {
        this.lenis.scrollTo(0, {
          duration: 1.5,
          easing: (t) => 1 - Math.pow(1 - t, 3)
        });
        return;
      }

      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        this.lenis.scrollTo(targetElement, {
          offset: -80,
          duration: 1.5,
          easing: (t) => 1 - Math.pow(1 - t, 3)
        });
      }
    };

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => handleNavClick(e, link));
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => handleNavClick(e, link));
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-menu a, .mobile-nav a');

    const highlightNavItem = () => {
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${sectionId}`) {
              item.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', highlightNavItem);
  }

  setupLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const body = document.body;

    // Loading animation timeline - mais rápida
    const tl = gsap.timeline();

    tl.to('.loading-text span', {
      duration: 0.6,
      y: 0,
      opacity: 1,
      stagger: 0.15,
      ease: 'power2.out'
    })
    .to('.nike-logo-loader', {
      duration: 0.8,
      scale: 1.1,
      ease: 'power2.inOut'
    }, '-=0.4')
    .to('.loading-screen', {
      duration: 0.6,
      opacity: 0,
      ease: 'power2.inOut',
      onComplete: () => {
        loadingScreen.style.display = 'none';
        body.classList.remove('loading');
        this.startHeroAnimations();
      }
    }, '+=0.3');
  }

  setupHeroAnimations() {
    // Hero title animation setup - mais suave
    const heroLines = document.querySelectorAll('.hero-title .line');
    
    gsap.set(heroLines, { y: 100, opacity: 0 });
    gsap.set('.hero-subtitle', { y: 50, opacity: 0 });
    gsap.set('.hero-cta .btn-primary, .hero-cta .btn-secondary', { y: 30, opacity: 0 });
    gsap.set('.hero-scroll', { y: 30, opacity: 0 });
  }

  startHeroAnimations() {
    const tl = gsap.timeline();

    // Hero title animation - mais fluida
    tl.to('.hero-title .line', {
      duration: 1,
      y: 0,
      opacity: 1,
      stagger: 0.15,
      ease: 'power3.out'
    })
    .to('.hero-subtitle', {
      duration: 0.8,
      y: 0,
      opacity: 1,
      ease: 'power2.out'
    }, '-=0.6')
    .to('.hero-cta .btn-primary, .hero-cta .btn-secondary', {
      duration: 0.6,
      y: 0,
      opacity: 1,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.4')
    .to('.hero-scroll', {
      duration: 0.6,
      y: 0,
      opacity: 1,
      ease: 'power2.out'
    }, '-=0.2');
  }

  setupParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles - menos partículas para melhor performance
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 8;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.003,
      color: '#ffffff',
      transparent: true,
      opacity: 0.6
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Animation - mais suave
    const animateParticles = () => {
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0003;

      renderer.render(scene, camera);
      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse interaction - mais sutil
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      gsap.to(particlesMesh.rotation, {
        duration: 3,
        x: mouseY * 0.05,
        y: mouseX * 0.05,
        ease: 'power2.out'
      });
    });
  }

  setupScrollAnimations() {
    // Section titles animation - mais suave
    gsap.utils.toArray('.section-title').forEach(title => {
      const lines = title.querySelectorAll('.title-line');
      
      gsap.set(lines, { y: 60, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: title,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(lines, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power2.out'
          });
        }
      });
    });

    // Product cards animation - mais fluida
    gsap.utils.toArray('.product-card').forEach((card, index) => {
      gsap.set(card, { y: 40, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(card, {
            duration: 0.6,
            y: 0,
            opacity: 1,
            delay: index * 0.08,
            ease: 'power2.out'
          });
        }
      });
    });

    // Collection items animation - mais suave
    gsap.utils.toArray('.collection-item').forEach((item, index) => {
      gsap.set(item, { scale: 0.9, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(item, {
            duration: 0.6,
            scale: 1,
            opacity: 1,
            delay: index * 0.1,
            ease: 'power2.out'
          });
        }
      });
    });

    // Stats counter animation - mais rápida
    gsap.utils.toArray('.stat-number').forEach(stat => {
      const finalValue = stat.textContent;
      const numericValue = parseInt(finalValue.replace(/\D/g, ''));
      
      gsap.set(stat, { textContent: '0' });
      
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(stat, {
            duration: 1.5,
            textContent: numericValue,
            roundProps: 'textContent',
            ease: 'power2.out',
            onUpdate: function() {
              stat.textContent = Math.ceil(this.targets()[0].textContent) + '+';
            }
          });
        }
      });
    });

    // Parallax effects - mais sutil
    gsap.utils.toArray('.collections-bg img, .video-thumbnail img').forEach(img => {
      ScrollTrigger.create({
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: self => {
          const progress = self.progress;
          gsap.set(img, {
            y: progress * 50
          });
        }
      });
    });

    // Feature items animation
    gsap.utils.toArray('.feature-item').forEach((item, index) => {
      gsap.set(item, { x: -30, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(item, {
            duration: 0.6,
            x: 0,
            opacity: 1,
            delay: index * 0.1,
            ease: 'power2.out'
          });
        }
      });
    });
  }

  setupProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter products - animação mais suave
        productCards.forEach((card, index) => {
          const category = card.dataset.category;
          
          if (filter === 'all' || category === filter) {
            gsap.to(card, {
              duration: 0.4,
              opacity: 1,
              scale: 1,
              y: 0,
              delay: index * 0.05,
              ease: 'power2.out',
              onStart: () => {
                card.style.display = 'block';
              }
            });
          } else {
            gsap.to(card, {
              duration: 0.3,
              opacity: 0,
              scale: 0.9,
              y: 20,
              ease: 'power2.in',
              onComplete: () => {
                card.style.display = 'none';
              }
            });
          }
        });
      });
    });
  }

  setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const body = document.body;

    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.contains('active');
      
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      body.classList.toggle('menu-open');

      // Animate menu items
      if (!isActive) {
        gsap.fromTo('.mobile-nav li', {
          x: -50,
          opacity: 0
        }, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.2
        });
      }
    });

    // Close menu when clicking on links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        // Close menu with animation
        gsap.to('.mobile-nav li', {
          x: -50,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.in',
          onComplete: () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Navigate after menu closes
            if (targetId === '#home') {
              this.lenis.scrollTo(0, {
                duration: 1.5,
                easing: (t) => 1 - Math.pow(1 - t, 3)
              });
            } else {
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                this.lenis.scrollTo(targetElement, {
                  offset: -80,
                  duration: 1.5,
                  easing: (t) => 1 - Math.pow(1 - t, 3)
                });
              }
            }
          }
        });
      });
    });
  }

  setupFormHandlers() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = newsletterForm.querySelector('button');
        const input = newsletterForm.querySelector('input');
        const originalText = button.querySelector('span').textContent;
        
        // Animate button - mais suave
        gsap.to(button, {
          duration: 0.2,
          scale: 0.98,
          ease: 'power2.out'
        });
        
        button.querySelector('span').textContent = 'Inscrevendo...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
          button.querySelector('span').textContent = 'Inscrito!';
          button.style.background = '#10b981';
          
          gsap.to(button, {
            duration: 0.3,
            scale: 1,
            ease: 'back.out(1.2)'
          });
          
          setTimeout(() => {
            button.querySelector('span').textContent = originalText;
            button.style.background = '';
            button.disabled = false;
            input.value = '';
            
            gsap.to(button, {
              duration: 0.2,
              scale: 1,
              ease: 'power2.out'
            });
          }, 2000);
        }, 1000);
      });
    }
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe elements for fade-in animations
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
      observer.observe(el);
    });
  }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NikeWebsite();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
    gsap.globalTimeline.pause();
  } else {
    // Resume animations when tab becomes visible
    gsap.globalTimeline.resume();
  }
});

// Add button ripple effects - mais suave
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn-primary, .btn-secondary, .collection-btn, .filter-btn')) {
    const button = e.target;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // Add ripple styles
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.2)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-animation 0.4s ease-out';
    ripple.style.pointerEvents = 'none';
    
    setTimeout(() => {
      ripple.remove();
    }, 400);
  }
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(3);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);