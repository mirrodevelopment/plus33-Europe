/**
 * FILE: about.js
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Interactive editorial controller for the About page.
 * Leverages GSAP and ScrollTrigger for elite kinetic
 * reveal transitions.
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
 * ══════════════════════════════════════════════════
 */

/**
 * Mounts the About page inside the SPA router container.
 * Sets up ScrollTriggers and returns a cleanup function.
 * @returns {Function} Cleanup function to destroy GSAP scroll instances
 */
export function mountAboutPage() {
  const triggers = [];

  if (window.gsap && window.ScrollTrigger) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    // Reset any existing scroll trigger states
    ScrollTrigger.refresh();

    // 1. Editorial Hero Entrance Reveals
    gsap.from('.about-hero .reveal', {
      y: 35,
      opacity: 0,
      duration: 1.3,
      stagger: 0.18,
      ease: 'power4.out'
    });

    // 2. Pillar cards reveal scrolling trigger
    document.querySelectorAll('.about-pillar-card').forEach((card) => {
      const t = ScrollTrigger.create({
        trigger: card,
        start: 'top 88%',
        onEnter: () => {
          gsap.fromTo(card,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
          );
        },
        once: true
      });
      triggers.push(t);
    });

    // 3. Immersive Paris-Scandi Fusion Reveal
    const fusion = document.querySelector('.about-fusion');
    if (fusion) {
      const t = ScrollTrigger.create({
        trigger: fusion,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('.about-fusion__image', {
            x: -60,
            opacity: 0,
            duration: 1.4,
            ease: 'power3.out'
          });
          gsap.from('.about-fusion__content > *', {
            x: 60,
            opacity: 0,
            duration: 1.4,
            stagger: 0.15,
            ease: 'power3.out'
          });
        },
        once: true
      });
      triggers.push(t);
    }
  }

  // Return explicit SPA cleanup/destructor
  return () => {
    triggers.forEach((trigger) => {
      if (typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
  };
}
