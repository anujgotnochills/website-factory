import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ImageTrail from './ImageTrail'
import portfolio1 from '../assets/portfolio1.png'
import portfolio2 from '../assets/portfolio2.png'
import portfolio3 from '../assets/portfolio3.png'
import maternityImg from '../assets/maternity.png'
import productImg from '../assets/product.png'
import ecommerceImg from '../assets/ecommerce.png'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = ['All', 'Maternity', 'Product', 'E-Commerce']

const WORKS = [
    { id: 1, title: 'The Bloom Series', category: 'Maternity', image: portfolio1, size: 'large' },
    { id: 2, title: 'Luxe Timepieces', category: 'Product', image: portfolio2, size: 'small' },
    { id: 3, title: 'Summer Collection', category: 'E-Commerce', image: portfolio3, size: 'small' },
    { id: 4, title: 'Radiant Glow', category: 'Maternity', image: maternityImg, size: 'medium' },
    { id: 5, title: 'Artisan Spirits', category: 'Product', image: productImg, size: 'medium' },
    { id: 6, title: 'Fashion Forward', category: 'E-Commerce', image: ecommerceImg, size: 'large' },
]

const TRAIL_IMAGES = [
    portfolio1, portfolio2, portfolio3,
    maternityImg, productImg, ecommerceImg,
    portfolio1, portfolio2, portfolio3,
    maternityImg,
]

export default function Portfolio() {
    const [activeCategory, setActiveCategory] = useState('All')
    const sectionRef = useRef(null)
    const gridRef = useRef(null)
    const [trailKey, setTrailKey] = useState(0)

    const filtered = activeCategory === 'All'
        ? WORKS
        : WORKS.filter((w) => w.category === activeCategory)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.portfolio-heading',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: '.portfolio-heading', start: 'top 85%' },
                }
            )
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    useEffect(() => {
        if (!gridRef.current) return
        const items = gridRef.current.querySelectorAll('.portfolio-item')
        gsap.fromTo(items,
            { y: 40, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
        )
    }, [activeCategory])

    return (
        <section id="portfolio" ref={sectionRef} className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                {/* Heading */}
                <div className="portfolio-heading" style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>Our Work</span>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '20px' }}>
                        Selected <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Portfolio</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                        A curated collection of our finest work across all specializations.
                    </p>
                </div>

                {/* Interactive Image Trail Area */}
                <div className="image-trail-container" style={{
                    height: '500px',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '60px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    cursor: 'crosshair',
                }}>
                    {/* Center Text */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}>
                        <span className="material-symbols-outlined" style={{
                            fontSize: '40px',
                            color: 'var(--gold)',
                            marginBottom: '16px',
                            opacity: 0.6,
                        }}>swipe</span>
                        <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.4rem',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            opacity: 0.5,
                            letterSpacing: '0.05em',
                        }}>
                            Move your cursor to explore
                        </p>
                    </div>
                    <ImageTrail
                        key={trailKey}
                        items={TRAIL_IMAGES}
                        variant={8}
                    />
                </div>

                {/* Filter Tabs */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '48px',
                    flexWrap: 'wrap',
                }}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '10px 24px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                fontFamily: 'var(--font-body)',
                                border: '1px solid',
                                borderColor: activeCategory === cat ? 'var(--gold)' : 'var(--border-color)',
                                background: activeCategory === cat ? 'var(--gold)' : 'transparent',
                                color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div
                    ref={gridRef}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px',
                        gridAutoRows: '280px',
                    }}
                    className="portfolio-grid"
                >
                    {filtered.map((work) => (
                        <div
                            key={work.id}
                            className="portfolio-item"
                            style={{
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                gridRow: work.size === 'large' ? 'span 2' : 'span 1',
                                border: '1px solid var(--border-color)',
                            }}
                            onMouseEnter={(e) => {
                                const overlay = e.currentTarget.querySelector('.portfolio-overlay')
                                const img = e.currentTarget.querySelector('img')
                                if (overlay) overlay.style.opacity = '1'
                                if (img) img.style.transform = 'scale(1.08)'
                            }}
                            onMouseLeave={(e) => {
                                const overlay = e.currentTarget.querySelector('.portfolio-overlay')
                                const img = e.currentTarget.querySelector('img')
                                if (overlay) overlay.style.opacity = '0'
                                if (img) img.style.transform = 'scale(1)'
                            }}
                        >
                            <img
                                src={work.image}
                                alt={work.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                }}
                            />
                            {/* Hover Overlay */}
                            <div
                                className="portfolio-overlay"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, rgba(10,10,15,0.3) 50%, transparent 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '28px',
                                    opacity: 0,
                                    transition: 'opacity 0.4s ease',
                                }}
                            >
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'var(--gold)',
                                    marginBottom: '6px',
                                }}>
                                    {work.category}
                                </span>
                                <h4 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.3rem',
                                    fontWeight: 500,
                                }}>
                                    {work.title}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 640px) {
          .portfolio-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 260px !important;
          }
          .portfolio-item {
            grid-row: span 1 !important;
          }
        }
      `}</style>
        </section>
    )
}
