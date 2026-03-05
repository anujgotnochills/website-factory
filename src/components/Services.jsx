import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import maternityImg from '../assets/maternity.png'
import productImg from '../assets/product.png'
import ecommerceImg from '../assets/ecommerce.png'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
    {
        id: 'maternity',
        title: 'Maternity Shoot',
        subtitle: 'Capturing the Glow',
        description: 'Celebrate the most beautiful chapter of life with our artistic maternity photography. Soft lighting, elegant styling, and a personalized experience that turns expectation into timeless art.',
        features: ['Indoor & Outdoor', 'Couple Shoots', 'Styled Sessions', 'Album Packages'],
        image: maternityImg,
    },
    {
        id: 'product',
        title: 'Product Video',
        subtitle: 'Stories That Convert',
        description: 'Cinematic product videos that showcase your brand\'s essence. From unboxing sequences to lifestyle integrations, we create content that stops the scroll and drives conversions.',
        features: ['Cinematic Quality', 'Social Media Reels', 'Brand Films', '360° Showcases'],
        image: productImg,
    },
    {
        id: 'ecommerce',
        title: 'E-Commerce Shoot',
        subtitle: 'Pixels That Perform',
        description: 'Professional product photography optimized for online marketplaces. Clean, consistent, and compelling imagery that builds buyer confidence and elevates your store.',
        features: ['White Background', 'Lifestyle Shots', 'Model Integration', 'Bulk Processing'],
        image: ecommerceImg,
    },
]

export default function Services() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section heading
            gsap.fromTo('.services-heading',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: '.services-heading', start: 'top 85%' },
                }
            )

            // Cards stagger
            gsap.utils.toArray('.service-card').forEach((card, i) => {
                gsap.fromTo(card,
                    { y: 80, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 85%' },
                        delay: i * 0.1,
                    }
                )
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="services" ref={sectionRef} className="section-padding">
            <div className="container">
                {/* Heading */}
                <div className="services-heading" style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>What We Do</span>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                        marginBottom: '20px',
                    }}>
                        Our <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Services</span>
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.05rem',
                        maxWidth: '560px',
                        margin: '0 auto',
                        lineHeight: 1.7,
                    }}>
                        Three core specializations. One unified vision — making your brand unforgettable.
                    </p>
                </div>

                {/* Service Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {SERVICES.map((service, index) => (
                        <div
                            key={service.id}
                            className="service-card"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '0',
                                background: 'var(--bg-secondary)',
                                overflow: 'hidden',
                                border: '1px solid var(--border-color)',
                                transition: 'border-color 0.4s ease, transform 0.4s ease',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--gold)'
                                e.currentTarget.style.transform = 'translateY(-4px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            {/* Image */}
                            <div style={{
                                position: 'relative',
                                overflow: 'hidden',
                                aspectRatio: '16/10',
                                order: index % 2 === 0 ? 0 : 1,
                            }}
                                className="service-card-img"
                            >
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    }}
                                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                                />
                                {/* Number overlay */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '4rem',
                                    fontWeight: 700,
                                    color: 'rgba(201, 169, 110, 0.15)',
                                    lineHeight: 1,
                                }}>
                                    0{index + 1}
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{
                                padding: 'clamp(32px, 4vw, 56px)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                order: index % 2 === 0 ? 1 : 0,
                            }}>
                                <p style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'var(--gold)',
                                    marginBottom: '12px',
                                }}>
                                    {service.subtitle}
                                </p>
                                <h3 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                                    fontWeight: 500,
                                    marginBottom: '20px',
                                    lineHeight: 1.2,
                                }}>
                                    {service.title}
                                </h3>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.8,
                                    marginBottom: '28px',
                                }}>
                                    {service.description}
                                </p>

                                {/* Feature Tags */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                                    {service.features.map((feature) => (
                                        <span
                                            key={feature}
                                            style={{
                                                padding: '6px 16px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                letterSpacing: '0.05em',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-secondary)',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href="#contact"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: 'var(--gold)',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        transition: 'gap 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => (e.target.style.gap = '14px')}
                                    onMouseLeave={(e) => (e.target.style.gap = '8px')}
                                >
                                    Learn More
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @media (min-width: 768px) {
          .service-card {
            grid-template-columns: 1fr 1fr !important;
          }
          .service-card-img {
            aspect-ratio: auto !important;
            min-height: 420px;
          }
        }
      `}</style>
        </section>
    )
}
