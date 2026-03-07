import { useState, useEffect, useRef } from 'react'

/*
  Pure CSS camera-shutter loading screen.
  Only animates `transform` + `opacity` → runs on GPU compositor.
  No GSAP, no SVG attribute animation, no forced repaints.
*/

export default function LoadingScreen({ onComplete }) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        // Total animation is ~3s, then unmount
        const timer = setTimeout(() => {
            setVisible(false)
            onComplete?.()
        }, 3200)
        return () => clearTimeout(timer)
    }, [onComplete])

    if (!visible) return null

    return (
        <>
            <div className="loader-screen">
                {/* Flash overlay */}
                <div className="loader-flash" />

                {/* Corner viewfinder brackets */}
                <div className="vf-corner vf-tl" />
                <div className="vf-corner vf-tr" />
                <div className="vf-corner vf-bl" />
                <div className="vf-corner vf-br" />

                {/* Crosshairs */}
                <div className="vf-crosshair vf-h" />
                <div className="vf-crosshair vf-v" />

                {/* Lens assembly */}
                <div className="lens-group">
                    {/* Outer ring */}
                    <div className="lens-ring lens-ring-outer" />
                    <div className="lens-ring lens-ring-inner" />

                    {/* 6 Aperture blades */}
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className="aperture-blade"
                            style={{
                                '--blade-angle': `${60 * i}deg`,
                                '--blade-delay': `${i * 0.04}s`,
                                background: i % 2 === 0
                                    ? 'linear-gradient(135deg, #50505e 0%, #2a2a34 50%, #3e3e4c 100%)'
                                    : 'linear-gradient(135deg, #44444f 0%, #252530 50%, #383845 100%)',
                            }}
                        />
                    ))}

                    {/* Center lens */}
                    <div className="lens-center">
                        <div className="lens-dot" />
                    </div>
                </div>

                {/* Text */}
                <p className="loader-text">✦&ensp;Capturing Moments&ensp;✦</p>
            </div>

            <style>{`
                .loader-screen {
                    position: fixed;
                    inset: 0;
                    z-index: 10000;
                    background: #08080c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    animation: loader-exit 0.5s ease-in-out 2.8s forwards;
                    will-change: opacity;
                }

                @keyframes loader-exit {
                    0% { opacity: 1; }
                    100% { opacity: 0; pointer-events: none; }
                }

                /* ── Flash ── */
                .loader-flash {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle, #fff, rgba(255,255,255,0.6) 60%, transparent);
                    opacity: 0;
                    z-index: 3;
                    pointer-events: none;
                    animation: flash-burst 0.6s ease-out 1.5s forwards;
                    will-change: opacity;
                }
                @keyframes flash-burst {
                    0% { opacity: 0; }
                    12% { opacity: 0.95; }
                    100% { opacity: 0; }
                }

                /* ── Viewfinder corners ── */
                .vf-corner {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                }
                .vf-tl { top: 20px; left: 20px; border-top: 2px solid rgba(201,169,110,0.2); border-left: 2px solid rgba(201,169,110,0.2); }
                .vf-tr { top: 20px; right: 20px; border-top: 2px solid rgba(201,169,110,0.2); border-right: 2px solid rgba(201,169,110,0.2); }
                .vf-bl { bottom: 20px; left: 20px; border-bottom: 2px solid rgba(201,169,110,0.2); border-left: 2px solid rgba(201,169,110,0.2); }
                .vf-br { bottom: 20px; right: 20px; border-bottom: 2px solid rgba(201,169,110,0.2); border-right: 2px solid rgba(201,169,110,0.2); }

                /* ── Crosshairs ── */
                .vf-crosshair {
                    position: absolute;
                    background: rgba(201,169,110,0.08);
                }
                .vf-h { top: 50%; left: 25%; right: 25%; height: 1px; transform: translateY(-0.5px); }
                .vf-v { left: 50%; top: 25%; bottom: 25%; width: 1px; transform: translateX(-0.5px); }

                /* ── Lens group ── */
                .lens-group {
                    position: relative;
                    width: 220px;
                    height: 220px;
                    animation: lens-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    will-change: transform, opacity;
                }
                @keyframes lens-enter {
                    0% { transform: scale(0.3); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                /* ── Lens rings ── */
                .lens-ring {
                    position: absolute;
                    border-radius: 50%;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                }
                .lens-ring-outer {
                    width: 215px; height: 215px;
                    border: 2px solid rgba(201,169,110,0.2);
                    box-shadow: 0 0 30px rgba(201,169,110,0.05), inset 0 0 20px rgba(0,0,0,0.3);
                }
                .lens-ring-inner {
                    width: 195px; height: 195px;
                    border: 1px solid rgba(80,80,95,0.4);
                }

                /* ── Aperture blades ── */
                .aperture-blade {
                    position: absolute;
                    width: 90px;
                    height: 90px;
                    top: 50%;
                    left: 50%;
                    clip-path: polygon(50% 0%, 100% 35%, 85% 100%, 15% 100%, 0% 35%);
                    border: 1px solid rgba(140,140,160,0.3);
                    transform-origin: center bottom;
                    transform: translate(-50%, -100%) rotate(var(--blade-angle));
                    opacity: 0;
                    will-change: transform, opacity;
                    animation:
                        blade-appear 0.3s ease-out calc(0.5s + var(--blade-delay)) forwards,
                        blade-close 0.3s ease-in-out 1.2s forwards,
                        blade-open 0.7s ease-out 1.8s forwards;
                }

                @keyframes blade-appear {
                    0% { opacity: 0; transform: translate(-50%, -100%) rotate(var(--blade-angle)) scale(0.5); }
                    100% { opacity: 1; transform: translate(-50%, -100%) rotate(var(--blade-angle)) scale(1); }
                }
                @keyframes blade-close {
                    0% { transform: translate(-50%, -100%) rotate(var(--blade-angle)) scale(1); }
                    100% { transform: translate(-50%, -85%) rotate(var(--blade-angle)) scale(1.08); }
                }
                @keyframes blade-open {
                    0% { transform: translate(-50%, -85%) rotate(var(--blade-angle)) scale(1.08); opacity: 1; }
                    100% { transform: translate(-50%, -130%) rotate(calc(var(--blade-angle) + 30deg)) scale(1.5); opacity: 0; }
                }

                /* ── Center lens ── */
                .lens-center {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 44px; height: 44px;
                    border-radius: 50%;
                    border: 1.5px solid rgba(201,169,110,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: center-pulse 1.5s ease-in-out 0.6s;
                }
                .lens-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: var(--gold, #c9a96e);
                    box-shadow: 0 0 15px rgba(201,169,110,0.5);
                }

                @keyframes center-pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.15); }
                }

                /* ── Text ── */
                .loader-text {
                    margin-top: 32px;
                    font-family: var(--font-body, sans-serif);
                    font-size: 0.6rem;
                    font-weight: 600;
                    letter-spacing: 0.4em;
                    text-transform: uppercase;
                    color: var(--gold, #c9a96e);
                    opacity: 0;
                    animation: text-reveal 0.8s ease-out 2.0s forwards;
                    will-change: opacity, transform;
                }
                @keyframes text-reveal {
                    0% { opacity: 0; transform: translateY(10px); }
                    60% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-5px); }
                }
            `}</style>
        </>
    )
}
