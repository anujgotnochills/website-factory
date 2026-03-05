import { useClientConfig } from '../ClientConfigContext'

export default function Footer() {
    const config = useClientConfig()
    const currentYear = new Date().getFullYear()

    const linkStyle = {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        transition: 'color 0.3s ease',
        cursor: 'pointer',
        display: 'block',
        marginBottom: '10px',
    }

    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '80px',
            paddingBottom: '32px',
        }}>
            <div className="container">
                <div className="footer-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '48px',
                    marginBottom: '60px',
                }}>
                    {/* Brand */}
                    <div>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.3rem',
                            fontWeight: 700,
                            color: 'var(--gold)',
                            marginBottom: '16px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}>
                            {config.studioName}
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            lineHeight: 1.7,
                            marginBottom: '20px',
                            maxWidth: '280px',
                        }}>
                            Crafting visual stories that elevate brands and capture life's most precious moments.
                        </p>
                        <div className="social-links" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {Object.entries({ Instagram: config.instagram, YouTube: config.youtube, Facebook: config.facebook }).map(([platform, url]) => (
                                <a
                                    key={platform}
                                    href={url || '#'}
                                    target={url && url !== '#' ? '_blank' : '_self'}
                                    rel={url && url !== '#' ? 'noopener noreferrer' : ''}
                                    style={{
                                        padding: '8px 14px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-muted)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.borderColor = 'var(--gold)'
                                        e.target.style.color = 'var(--gold)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.borderColor = 'var(--border-color)'
                                        e.target.style.color = 'var(--text-muted)'
                                    }}
                                >
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--text-primary)',
                            marginBottom: '20px',
                        }}>
                            Quick Links
                        </h4>
                        {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                style={linkStyle}
                                onMouseEnter={(e) => (e.target.style.color = 'var(--gold)')}
                                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                            >
                                {link}
                            </a>
                        ))}
                    </div>

                    {/* Services */}
                    <div>
                        <h4 style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--text-primary)',
                            marginBottom: '20px',
                        }}>
                            Services
                        </h4>
                        {['Maternity Shoot', 'Product Video', 'E-Commerce Shoot', 'Brand Films', 'Photo Retouching'].map((s) => (
                            <span key={s} style={linkStyle}>{s}</span>
                        ))}
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--text-primary)',
                            marginBottom: '20px',
                        }}>
                            Contact
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '8px' }}>
                            {config.address}
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '8px' }}>
                            {config.phone}
                        </p>
                        <a
                            href={`mailto:${config.email}`}
                            style={{ color: 'var(--gold)', fontSize: '0.85rem', lineHeight: 1.7 }}
                        >
                            {config.email}
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        © {currentYear} {config.studioName}. All rights reserved.
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Crafted with passion for visual storytelling
                    </p>
                </div>
            </div>
        </footer>
    )
}
