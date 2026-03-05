import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollStack, { ScrollStackItem } from './ScrollStack'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Priya Sharma',
        role: 'Expecting Mother',
        type: 'Maternity Shoot',
        stars: 5,
        text: 'The entire experience was magical. From the consultation call to the final album delivery, every detail was handled with such care and creativity. Our maternity photos are breathtaking.',
    },
    {
        id: 2,
        name: 'Rahul Kapoor',
        role: 'Founder, LuxeWatch India',
        type: 'Product Video',
        stars: 5,
        text: 'SmartClickStudio transformed our product launch with their cinematic videos. Our engagement rate tripled and the brand perception shifted dramatically. Highly professional team.',
    },
    {
        id: 3,
        name: 'Ananya Desai',
        role: 'Owner, StyleCraft Boutique',
        type: 'E-Commerce Shoot',
        stars: 5,
        text: 'Our online store conversion rates jumped 40% after switching to SmartClickStudio for product photography. The quality and consistency across 500+ SKUs was remarkable.',
    },
    {
        id: 4,
        name: 'Meera Patel',
        role: 'New Mom',
        type: 'Maternity Shoot',
        stars: 5,
        text: 'I was nervous about the shoot but the team at SmartClickStudio made it such a joyful experience. The photos are absolutely stunning — we\'ll treasure them forever.',
    },
]

const StarRating = ({ count }) => (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {Array.from({ length: count }).map((_, i) => (
            <span
                key={i}
                className="material-symbols-outlined"
                style={{ fontSize: '18px', color: 'var(--gold)' }}
            >
                star
            </span>
        ))}
    </div>
)

export default function Testimonials() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.testimonials-heading',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: '.testimonials-heading', start: 'top 85%' },
                }
            )
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="testimonials" ref={sectionRef} className="section-padding" style={{ background: 'var(--bg-primary)' }}>
            {/* Heading */}
            <div className="testimonials-heading" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span className="section-label" style={{ justifyContent: 'center' }}>Client Love</span>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '20px' }}>
                    What Our <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Clients Say</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                    Real stories from real clients who trusted us with their vision.
                </p>
            </div>

            {/* ScrollStack Cards */}
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <ScrollStack
                    itemDistance={80}
                    itemScale={0.04}
                    itemStackDistance={25}
                    stackPosition="30%"
                    scaleEndPosition="15%"
                    baseScale={0.88}
                    blurAmount={2}
                >
                    {TESTIMONIALS.map((t) => (
                        <ScrollStackItem key={t.id}>
                            <div style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '40px',
                                padding: '48px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}>
                                {/* Type badge */}
                                <span style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'var(--gold)',
                                    marginBottom: '16px',
                                    display: 'inline-block',
                                }}>
                                    {t.type}
                                </span>

                                <StarRating count={t.stars} />

                                {/* Quote */}
                                <p style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.15rem',
                                    fontWeight: 400,
                                    fontStyle: 'italic',
                                    lineHeight: 1.8,
                                    color: 'var(--text-primary)',
                                    marginBottom: '32px',
                                    flex: 1,
                                }}>
                                    "{t.text}"
                                </p>

                                {/* Client */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    borderTop: '1px solid var(--border-color)',
                                    paddingTop: '20px',
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--gold-dark), var(--gold-light))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: 'var(--bg-primary)',
                                    }}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '2px' }}>{t.name}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollStackItem>
                    ))}
                </ScrollStack>
            </div>
        </section>
    )
}
