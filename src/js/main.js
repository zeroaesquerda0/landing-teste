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

    // Navbar scroll effect
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: navbar }
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          this.lenis.scrollTo(targetElement, {
            offset: -80,
            duration: 1.5
          });
        }
      });
    });
  }

  setupLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const body = document.body;

    // Loading animation timeline
    const tl = gsap.timeline();

    tl.to('.loading-text span', {
      duration: 0.8,
      y: 0,
      opacity: 1,
      stagger: 0.2,
      ease: 'power2.out'
    })
    .to('.nike-logo-loader', {
      duration: 1,
      scale: 1.2,
      ease: 'power2.inOut'
    }, '-=0.5')
    .to('.loading-screen', {
      duration: 0.8,
      opacity: 0,
      ease: 'power2.inOut',
      onComplete: () => {
        loadingScreen.style.display = 'none';
        body.classList.remove('loading');
        this.startHeroAnimations();
      }
    }, '+=0.5');
  }

  setupHeroAnimations() {
    // Hero title animation setup
    const heroLines = document.querySelectorAll('.hero-title .line');
    
    heroLines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
  }

  startHeroAnimations() {
    const tl = gsap.timeline();

    // Hero title animation
    tl.to('.hero-title .line', {
      duration: 1.2,
      y: 0,
      opacity: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })
    .to('.hero-subtitle', {
      duration: 1,
      y: 0,
      opacity: 1,
      ease: 'power2.out'
    }, '-=0.8')
    .to('.hero-cta .btn-primary, .hero-cta .btn-secondary', {
      duration: 0.8,
      y: 0,
      opacity: 1,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.5')
    .to('.hero-scroll', {
      duration: 0.8,
      y: 0,
      opacity: 1,
      ease: 'power2.out'
    }, '-=0.3');
  }

  setupParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: '#ffffff',
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Animation
    const animateParticles = () => {
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;

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

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      gsap.to(particlesMesh.rotation, {
        duration: 2,
        x: mouseY * 0.1,
        y: mouseX * 0.1
      });
    });
  }

  setupScrollAnimations() {
    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
      const lines = title.querySelectorAll('.title-line');
      
      gsap.set(lines, { y: 100, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(lines, {
            duration: 1,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power3.out'
          });
        }
      });
    });

    // Product cards animation
    gsap.utils.toArray('.product-card').forEach((card, index) => {
      gsap.set(card, { y: 60, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(card, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            delay: index * 0.1,
            ease: 'power2.out'
          });
        }
      });
    });

    // Collection items animation
    gsap.utils.toArray('.collection-item').forEach((item, index) => {
      gsap.set(item, { scale: 0.8, opacity: 0 });
      
      ScrollTrigger.create({
        trigger: item,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(item, {
            duration: 0.8,
            scale: 1,
            opacity: 1,
            delay: index * 0.2,
            ease: 'back.out(1.7)'
          });
        }
      });
    });

    // Stats counter animation
    gsap.utils.toArray('.stat-number').forEach(stat => {
      const finalValue = stat.textContent;
      const numericValue = parseInt(finalValue.replace(/\D/g, ''));
      
      gsap.set(stat, { textContent: '0' });
      
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(stat, {
            duration: 2,
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

    // Parallax effects
    gsap.utils.toArray('.collections-bg img, .video-thumbnail img').forEach(img => {
      ScrollTrigger.create({
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: self => {
          const progress = self.progress;
          gsap.set(img, {
            y: progress * 100
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
        
        // Filter products
        productCards.forEach(card => {
          const category = card.dataset.category;
          
          if (filter === 'all' || category === filter) {
            gsap.to(card, {
              duration: 0.5,
              opacity: 1,
              scale: 1,
              display: 'block',
              ease: 'power2.out'
            });
          } else {
            gsap.to(card, {
              duration: 0.3,
              opacity: 0,
              scale: 0.8,
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
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      body.classList.toggle('menu-open');
    });

    // Close menu when clicking on links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        // Close menu
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Scroll to target
        if (targetElement) {
          setTimeout(() => {
            this.lenis.scrollTo(targetElement, {
              offset: -80,
              duration: 1.5
            });
          }, 300);
        }
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
        
        // Animate button
        gsap.to(button, {
          duration: 0.3,
          scale: 0.95,
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
            ease: 'back.out(1.7)'
          });
          
          setTimeout(() => {
            button.querySelector('span').textContent = originalText;
            button.style.background = '';
            button.disabled = false;
            input.value = '';
            
            gsap.to(button, {
              duration: 0.3,
              scale: 1,
              ease: 'power2.out'
            });
          }, 2000);
        }, 1500);
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

// Add button ripple effects
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
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-animation 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);