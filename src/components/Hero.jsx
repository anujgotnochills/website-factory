import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useClientConfig } from '../ClientConfigContext'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 100

function getFrameUrl(index) {
    const num = String(index).padStart(3, '0')
    return `/animation/ezgif-frame-${num}.jpg`
}

export default function Hero() {
    const config = useClientConfig()
    const sectionRef = useRef(null)
    const canvasRef = useRef(null)
    const contentRef = useRef(null)
    const headingRef = useRef(null)
    const subRef = useRef(null)
    const ctaRef = useRef(null)
    const scrollRef = useRef(null)
    const imagesRef = useRef([])
    const [loaded, setLoaded] = useState(false)

    // Preload all frames
    useEffect(() => {
        const images = []
        let loadedCount = 0

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image()
            img.src = getFrameUrl(i)
            img.onload = () => {
                loadedCount++
                if (loadedCount === FRAME_COUNT) setLoaded(true)
            }
            images.push(img)
        }
        imagesRef.current = images
    }, [])

    // Canvas rendering + scroll-based animation
    useEffect(() => {
        if (!loaded || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const images = imagesRef.current

        function drawFrame(index) {
            const img = images[Math.min(Math.max(index, 0), FRAME_COUNT - 1)]
            if (!img || !ctx) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Cover-fit
            const canvasRatio = canvas.width / canvas.height
            const imgRatio = img.width / img.height
            let drawW, drawH, drawX, drawY
            if (canvasRatio > imgRatio) {
                drawW = canvas.width
                drawH = canvas.width / imgRatio
                drawX = 0
                drawY = (canvas.height - drawH) / 2
            } else {
                drawH = canvas.height
                drawW = canvas.height * imgRatio
                drawX = (canvas.width - drawW) / 2
                drawY = 0
            }
            ctx.drawImage(img, drawX, drawY, drawW, drawH)
        }

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            drawFrame(animObj.frame)
        }

        // Draw first frame immediately
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        drawFrame(0)

        window.addEventListener('resize', resize)

        // Scroll-driven frame animation
        const animObj = { frame: 0 }
        gsap.to(animObj, {
            frame: FRAME_COUNT - 1,
            snap: 'frame',
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                // no pin here — the section itself provides the scroll height
            },
            onUpdate: () => drawFrame(Math.round(animObj.frame)),
        })

        return () => {
            window.removeEventListener('resize', resize)
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === sectionRef.current) t.kill()
            })
        }
    }, [loaded])

    // Text reveal — scroll-triggered when animation nears completion
    useEffect(() => {
        if (!loaded || !contentRef.current) return
        const ctx = gsap.context(() => {
            // Hide everything initially
            gsap.set(contentRef.current, { opacity: 0 })
            gsap.set(scrollRef.current, { opacity: 0 })

            // Reveal content when scroll reaches ~75% of hero section
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: '35% center',
                    end: '50% center',
                    scrub: false,
                    toggleActions: 'play none none reverse',
                },
                defaults: { ease: 'power3.out' },
            })
            tl.to(contentRef.current, { opacity: 1, duration: 0.6 })
                .fromTo(headingRef.current.children, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 1 }, 0)
                .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
                .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
                .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.1')

            gsap.to(scrollRef.current, { y: 8, repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut' })
        }, sectionRef)
        return () => ctx.revert()
    }, [loaded])

    return (
        <section id="home" ref={sectionRef} style={{
            position: 'relative',
            height: '300vh', /* Extra height for scroll-based animation */
        }}>
            {/* Sticky viewport that pins while scrolling */}
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
            }}>
                {/* Canvas Background */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                    }}
                />

                {/* Dark overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.5) 50%, rgba(10,10,15,0.9) 100%)',
                    zIndex: 1,
                }} />

                {/* Loading indicator */}
                {!loaded && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 5,
                        background: 'var(--bg-primary)',
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid var(--border-color)',
                            borderTopColor: 'var(--gold)',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {/* Content — centered, hidden until animation completes */}
                <div ref={contentRef} className="container" style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    width: '100%',
                    opacity: 0,
                }}>
                    <div className="hero-content" style={{ maxWidth: '800px' }}>
                        <div ref={headingRef}>
                            <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                color: 'var(--gold)',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                            }}>
                                <span style={{ width: '40px', height: '1px', background: 'var(--gold)', display: 'inline-block' }} />
                                Premium Visual Studio
                                <span style={{ width: '40px', height: '1px', background: 'var(--gold)', display: 'inline-block' }} />
                            </p>
                            <h1 style={{
                                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                                fontWeight: 500,
                                lineHeight: 1.05,
                                marginBottom: '28px',
                            }}>
                                We Craft<br />
                                <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Visual Stories</span><br />
                                That Sell
                            </h1>
                        </div>
                        <p ref={subRef} style={{
                            fontSize: '1.1rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.7,
                            maxWidth: '520px',
                            margin: '0 auto 40px',
                        }}>
                            Maternity shoots that capture the glow. Product videos that convert.
                            E-commerce photography that elevates your brand.
                        </p>
                        <div ref={ctaRef} className="hero-cta" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <a
                                href={`https://wa.me/${config.whatsappNumber}?text=Hi%20${encodeURIComponent(config.studioName)},%20I%20would%20like%20to%20book%20a%20shoot!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                Book Your Shoot
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                </svg>
                            </a>
                            <a href="#portfolio" className="btn-outline">
                                View Our Work
                            </a>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div ref={scrollRef} style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <span style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                    }}>Scroll</span>
                    <div style={{
                        width: '1px',
                        height: '40px',
                        background: 'linear-gradient(to bottom, var(--gold), transparent)',
                    }} />
                </div>
            </div>
        </section>
    )
}
