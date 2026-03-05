import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useGsapReveal — reveals elements with staggered fade-in + slide-up on scroll.
 * Attach the returned ref to a parent container.
 * Children with `data-reveal` will be animated.
 */
export function useGsapReveal(options = {}) {
    const ref = useRef(null)

    useEffect(() => {
        if (!ref.current) return
        const els = ref.current.querySelectorAll('[data-reveal]')
        if (!els.length) return

        gsap.set(els, { y: 60, opacity: 0 })

        const tl = gsap.to(els, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: options.stagger || 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ref.current,
                start: options.start || 'top 80%',
                toggleActions: 'play none none none',
            },
        })

        return () => {
            tl.kill()
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === ref.current) st.kill()
            })
        }
    }, [])

    return ref
}

/**
 * useGsapParallax — adds a vertical parallax effect to an element.
 */
export function useGsapParallax(speed = 0.3) {
    const ref = useRef(null)

    useEffect(() => {
        if (!ref.current) return

        const tl = gsap.to(ref.current, {
            y: () => speed * 200,
            ease: 'none',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        })

        return () => tl.kill()
    }, [speed])

    return ref
}

/**
 * useGsapTextSplit — split text character-by-character reveal
 */
export function useGsapTextReveal() {
    const ref = useRef(null)

    useEffect(() => {
        if (!ref.current) return
        const text = ref.current.textContent
        ref.current.innerHTML = ''

        const chars = text.split('').map(char => {
            const span = document.createElement('span')
            span.textContent = char === ' ' ? '\u00A0' : char
            span.style.display = 'inline-block'
            span.style.opacity = '0'
            span.style.transform = 'translateY(40px)'
            ref.current.appendChild(span)
            return span
        })

        gsap.to(chars, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.02,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        })
    }, [])

    return ref
}
