import React, { useLayoutEffect, useRef, useCallback, useEffect } from 'react'

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
    <div
        className={`scroll-stack-card ${itemClassName}`}
        style={{
            position: 'relative',
            width: '100%',
            minHeight: '280px',
            padding: '0',
            boxSizing: 'border-box',
            transformOrigin: 'top center',
        }}
    >
        {children}
    </div>
)

const ScrollStack = ({
    children,
    className = '',
    itemDistance = 100,
    itemScale = 0.03,
    itemStackDistance = 30,
    stackPosition = '20%',
    scaleEndPosition = '10%',
    baseScale = 0.85,
    rotationAmount = 0,
    blurAmount = 0,
    onStackComplete,
}) => {
    const containerRef = useRef(null)
    const cardsRef = useRef([])
    const cardTopsRef = useRef([])
    const endTopRef = useRef(0)
    const rafId = useRef(null)
    const isVisible = useRef(false)

    const parsePercentage = useCallback((value, containerHeight) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight
        }
        return parseFloat(value)
    }, [])

    // Cache original card positions — uses getBoundingClientRect without resetting transforms
    const cachePositions = useCallback(() => {
        const cards = cardsRef.current
        if (!cards.length || !containerRef.current) return

        // Temporarily remove transforms to get true positions
        const savedTransforms = cards.map(c => c.style.transform)
        cards.forEach(c => { c.style.transition = 'none'; c.style.transform = 'none' })

        // Force reflow
        void containerRef.current.offsetHeight

        cardTopsRef.current = cards.map(card =>
            card.getBoundingClientRect().top + window.scrollY
        )

        const endEl = containerRef.current.querySelector('.scroll-stack-end')
        endTopRef.current = endEl ? endEl.getBoundingClientRect().top + window.scrollY : 0

        // Restore transforms immediately
        cards.forEach((c, i) => {
            c.style.transform = savedTransforms[i] || ''
            c.style.transition = ''
        })
    }, [])

    const updateCards = useCallback(() => {
        const cards = cardsRef.current
        const cardTops = cardTopsRef.current
        if (!cards.length || !cardTops.length) return

        const scrollTop = window.scrollY
        const vh = window.innerHeight
        const stackPx = parsePercentage(stackPosition, vh)
        const scaleEndPx = parsePercentage(scaleEndPosition, vh)
        const endTop = endTopRef.current

        cards.forEach((card, i) => {
            if (!card) return

            const cardTop = cardTops[i]
            const pinStart = cardTop - stackPx - itemStackDistance * i
            const pinEnd = endTop - vh / 2
            const triggerStart = pinStart
            const triggerEnd = cardTop - scaleEndPx

            // Scale progress
            let scaleProgress = 0
            if (scrollTop > triggerStart && triggerEnd > triggerStart) {
                scaleProgress = Math.min(1, Math.max(0, (scrollTop - triggerStart) / (triggerEnd - triggerStart)))
            }

            const targetScale = baseScale + i * itemScale
            const scale = 1 - scaleProgress * (1 - targetScale)
            const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

            // Blur
            let blur = 0
            if (blurAmount) {
                let topCardIndex = 0
                for (let j = 0; j < cards.length; j++) {
                    const jStart = cardTops[j] - stackPx - itemStackDistance * j
                    if (scrollTop >= jStart) topCardIndex = j
                }
                if (i < topCardIndex) blur = Math.max(0, (topCardIndex - i) * blurAmount)
            }

            // Pin translateY
            let translateY = 0
            if (scrollTop >= pinStart && scrollTop <= pinEnd) {
                translateY = scrollTop - cardTop + stackPx + itemStackDistance * i
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPx + itemStackDistance * i
            }

            card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`
            card.style.filter = blur > 0 ? `blur(${blur}px)` : ''
        })
    }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, blurAmount, parsePercentage])

    // Only run rAF loop when the section is in/near viewport
    useEffect(() => {
        if (!containerRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    isVisible.current = entry.isIntersecting
                    if (entry.isIntersecting && !rafId.current) {
                        const tick = () => {
                            if (!isVisible.current) {
                                rafId.current = null
                                return
                            }
                            updateCards()
                            rafId.current = requestAnimationFrame(tick)
                        }
                        rafId.current = requestAnimationFrame(tick)
                    }
                })
            },
            { rootMargin: '200px 0px' } // start a bit before it enters viewport
        )

        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
            if (rafId.current) {
                cancelAnimationFrame(rafId.current)
                rafId.current = null
            }
        }
    }, [updateCards])

    useLayoutEffect(() => {
        const cards = Array.from(containerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
        cardsRef.current = cards

        cards.forEach((card, i) => {
            if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`
            card.style.transformOrigin = 'top center'
        })

        // Cache positions once
        cachePositions()

        // Debounced recache on resize
        let resizeTimer
        const onResize = () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(cachePositions, 150)
        }
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
            clearTimeout(resizeTimer)
            cardsRef.current = []
            cardTopsRef.current = []
        }
    }, [itemDistance, cachePositions])

    return (
        <div ref={containerRef} className={className} style={{ position: 'relative', width: '100%' }}>
            <div style={{ paddingTop: '10vh', paddingBottom: '30rem', minHeight: '80vh' }}>
                {children}
                <div className="scroll-stack-end" style={{ width: '100%', height: '1px' }} />
            </div>
        </div>
    )
}

export default ScrollStack
