/**
  * FILE: about.js
  * ══════════════════════════════════════════════════
  * PURPOSE:
  * Interactive editorial controller for the rebuilt +33 About page.
  * Leverages GSAP and ScrollTrigger for elite kinetic reveal transitions.
  * ══════════════════════════════════════════════════
  */

export function mountAboutPage() {
  const triggers = [];

  if (window.gsap && window.ScrollTrigger) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    // Register scroll trigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Reset triggers on page mount
    ScrollTrigger.refresh();

    // 1. Hero Left Text reveal timeline
    const heroElements = document.querySelectorAll('.about-hero .reveal');
    if (heroElements.length > 0) {
      gsap.fromTo(heroElements,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );
    }

    // 2. Generic scroll reveals for all sub-sections
    const revealTargets = document.querySelectorAll('.about-page .reveal');
    revealTargets.forEach((el) => {
      // Skip hero elements already handled
      if (el.closest('.about-hero')) return;

      const t = ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(el,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }
          );
        },
        once: true
      });
      triggers.push(t);
    });

    // Refresh triggers to compute element bounds correctly after a short layout shift delay
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }

  // SPA unmount cleanup destructor hook
  return () => {
    triggers.forEach((trigger) => {
      if (typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
  };
}
