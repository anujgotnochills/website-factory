import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useClientConfig } from '../ClientConfigContext'

const NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const config = useClientConfig()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navRef = useRef(null)
    const overlayRef = useRef(null)
    const menuLinksRef = useRef([])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 2)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
            gsap.to(overlayRef.current, {
                clipPath: 'circle(150% at top right)',
                duration: 0.8,
                ease: 'power3.inOut',
            })
            gsap.fromTo(
                menuLinksRef.current,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.08, delay: 0.3, duration: 0.6, ease: 'power3.out' }
            )
        } else {
            document.body.style.overflow = ''
            gsap.to(overlayRef.current, {
                clipPath: 'circle(0% at top right)',
                duration: 0.6,
                ease: 'power3.inOut',
            })
        }
    }, [menuOpen])

    const handleLinkClick = (e, href) => {
        e.preventDefault()
        setMenuOpen(false)
        setTimeout(() => {
            const el = document.querySelector(href)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
    }

    return (
        <>
            <nav
                ref={navRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    padding: scrolled ? '16px 0' : '24px 0',
                    background: scrolled ? 'rgba(10, 10, 15, 0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(201, 169, 110, 0.1)' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
            >
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <a
                        href="#home"
                        onClick={(e) => handleLinkClick(e, '#home')}
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: 'var(--gold)',
                            letterSpacing: '0.08em',
                            zIndex: 1001,
                        }}
                    >
                        {config.studioName.toUpperCase()}
                    </a>

                    {/* Desktop Links */}
                    <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}
                        className="desktop-nav"
                    >
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleLinkClick(e, link.href)}
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-secondary)',
                                    transition: 'color 0.3s ease',
                                    position: 'relative',
                                }}
                                onMouseEnter={(e) => (e.target.style.color = 'var(--gold)')}
                                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href={`https://wa.me/${config.whatsappNumber}?text=Hi%20${encodeURIComponent(config.studioName)},%20I%20would%20like%20to%20book%20a%20shoot!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                            style={{ padding: '10px 24px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            Book a Shoot
                        </a>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            zIndex: 1001,
                            padding: '8px',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: menuOpen ? '0px' : '6px', transition: 'gap 0.3s ease' }}>
                            <span style={{
                                display: 'block', width: '28px', height: '2px', background: 'var(--gold)',
                                transition: 'transform 0.3s ease',
                                transform: menuOpen ? 'rotate(45deg) translateY(1px)' : 'none',
                            }} />
                            <span style={{
                                display: 'block', width: '28px', height: '2px', background: 'var(--gold)',
                                transition: 'opacity 0.3s ease',
                                opacity: menuOpen ? 0 : 1,
                            }} />
                            <span style={{
                                display: 'block', width: '28px', height: '2px', background: 'var(--gold)',
                                transition: 'transform 0.3s ease',
                                transform: menuOpen ? 'rotate(-45deg) translateY(-1px)' : 'none',
                            }} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Overlay */}
            <div
                ref={overlayRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999,
                    background: 'rgba(10, 10, 15, 0.98)',
                    clipPath: 'circle(0% at top right)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
                    {NAV_LINKS.map((link, i) => (
                        <a
                            key={link.label}
                            ref={(el) => (menuLinksRef.current[i] = el)}
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link.href)}
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '2rem',
                                fontWeight: 500,
                                color: 'var(--text-primary)',
                                letterSpacing: '0.05em',
                                transition: 'color 0.3s ease',
                            }}
                            onMouseEnter={(e) => (e.target.style.color = 'var(--gold)')}
                            onMouseLeave={(e) => (e.target.style.color = 'var(--text-primary)')}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Responsive CSS */}
            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </>
    )
}
