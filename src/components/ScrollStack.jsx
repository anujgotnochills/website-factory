import React, { useLayoutEffect, useRef, useCallback, useState } from 'react'

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
    <div
        className={`scroll-stack-card ${itemClassName}`}
        style={{
            position: 'relative',
            width: '100%',
            minHeight: '320px',
            margin: '32px 0',
            padding: '48px',
            borderRadius: '40px',
            boxShadow: '0 0 30px rgba(0,0,0,0.1)',
            boxSizing: 'border-box',
            transformOrigin: 'top center',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
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
    const cardTopsRef = useRef([])   // cached original positions
    const endTopRef = useRef(0)
    const stackCompletedRef = useRef(false)
    const lastTransformsRef = useRef(new Map())

    const parsePercentage = useCallback((value, containerHeight) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight
        }
        return parseFloat(value)
    }, [])

    // Cache original card positions (called once, before transforms)
    const cachePositions = useCallback(() => {
        const cards = cardsRef.current
        if (!cards.length) return

        // Reset transforms before measuring
        cards.forEach(card => {
            card.style.transform = ''
            card.style.filter = ''
        })

        // Force reflow then measure
        void containerRef.current?.offsetHeight

        const containerTop = containerRef.current?.getBoundingClientRect().top + window.scrollY || 0
        cardTopsRef.current = cards.map(card => {
            return card.getBoundingClientRect().top + window.scrollY
        })

        const endEl = containerRef.current?.querySelector('.scroll-stack-end')
        endTopRef.current = endEl ? endEl.getBoundingClientRect().top + window.scrollY : 0
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
            card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none'

            // Stack complete callback
            if (i === cards.length - 1) {
                const inView = scrollTop >= pinStart && scrollTop <= pinEnd
                if (inView && !stackCompletedRef.current) {
                    stackCompletedRef.current = true
                    onStackComplete?.()
                } else if (!inView && stackCompletedRef.current) {
                    stackCompletedRef.current = false
                }
            }
        })
    }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, blurAmount, onStackComplete, parsePercentage])

    useLayoutEffect(() => {
        const cards = Array.from(containerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
        cardsRef.current = cards

        cards.forEach((card, i) => {
            if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`
            card.style.willChange = 'transform, filter'
            card.style.transformOrigin = 'top center'
        })

        // Cache positions once
        cachePositions()

        // Recache on resize
        const onResize = () => cachePositions()
        window.addEventListener('resize', onResize)

        // rAF loop syncs with existing Lenis
        let rafId
        const tick = () => {
            updateCards()
            rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('resize', onResize)
            cardsRef.current = []
            cardTopsRef.current = []
            lastTransformsRef.current.clear()
            stackCompletedRef.current = false
        }
    }, [itemDistance, cachePositions, updateCards])

    return (
        <div ref={containerRef} className={className} style={{ position: 'relative', width: '100%' }}>
            <div style={{ paddingTop: '10vh', paddingBottom: '50rem', minHeight: '100vh' }}>
                {children}
                <div className="scroll-stack-end" style={{ width: '100%', height: '1px' }} />
            </div>
        </div>
    )
}

export default ScrollStack
