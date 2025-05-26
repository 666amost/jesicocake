'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HomePageAnimationsProps {
  heroTextRef: React.RefObject<HTMLDivElement>;
  heroButtonsRef: React.RefObject<HTMLDivElement>;
  featuredCategoriesRef: React.RefObject<HTMLElement>;
  featuresRef: React.RefObject<HTMLElement>;
  productsSectionRef: React.RefObject<HTMLElement>;
  testimonialsRef: React.RefObject<HTMLElement>;
}

export default function HomePageAnimations({
  heroTextRef,
  heroButtonsRef,
  featuredCategoriesRef,
  featuresRef,
  productsSectionRef,
  testimonialsRef,
}: HomePageAnimationsProps) {
  useEffect(() => {
    // Add GSAP animation logic here using the refs
    
    // Example: Animating Hero Text
    if (heroTextRef.current) {
      gsap.fromTo(heroTextRef.current, 
        { opacity: 0, y: 50, willChange: 'transform, opacity' },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }

    // Example: Animating Hero Buttons
    if (heroButtonsRef.current) {
      gsap.fromTo(heroButtonsRef.current, 
        { opacity: 0, y: 50, willChange: 'transform, opacity' },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.3 }
      );
    }

    // Example: Animating Featured Categories with ScrollTrigger
    if (featuredCategoriesRef.current) {
      gsap.fromTo(featuredCategoriesRef.current, 
        { opacity: 0, y: 50, willChange: 'transform, opacity' },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: featuredCategoriesRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

     // Animasi untuk Features
     if (featuresRef.current) {
      gsap.fromTo(featuresRef.current, 
        { opacity: 0, y: 50, willChange: 'transform, opacity' },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
     }

     // Animasi untuk Products Section
     if (productsSectionRef.current) {
      gsap.fromTo(productsSectionRef.current, 
        { opacity: 0, y: 50, willChange: 'transform, opacity' },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: productsSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
     }

      // Animasi untuk Testimonials
      if (testimonialsRef.current) {
        gsap.fromTo(testimonialsRef.current, 
          { opacity: 0, y: 50, willChange: 'transform, opacity' },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: {
              trigger: testimonialsRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      }


  }, []); // Dependensi kosong, jalankan sekali saat mount

  return null; // Komponen ini tidak me-render elemen visual, hanya menangani animasi
} 