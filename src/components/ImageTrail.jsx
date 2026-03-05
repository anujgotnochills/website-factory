import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

function lerp(a, b, n) {
    return (1 - n) * a + n * b;
}

function getLocalPointerPos(e, rect) {
    let clientX = 0, clientY = 0;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if (e.clientX !== undefined) {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
}

function getMouseDistance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

class ImageItem {
    constructor(el) {
        this.DOM = { el, inner: el.querySelector('.content__img-inner') };
        this.defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
        this.rect = null;
        this.getRect();
        this.resize = () => { gsap.set(this.DOM.el, this.defaultStyle); this.getRect(); };
        window.addEventListener('resize', this.resize);
    }
    getRect() { this.rect = this.DOM.el.getBoundingClientRect(); }
}

class ImageTrailVariant8 {
    constructor(container) {
        this.container = container;
        this.DOM = { el: container };
        this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img));
        this.imagesTotal = this.images.length;
        this.imgPosition = 0;
        this.zIndexVal = 1;
        this.activeImagesCount = 0;
        this.isIdle = true;
        this.threshold = 80;
        this.mousePos = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.cacheMousePos = { x: 0, y: 0 };
        this.rotation = { x: 0, y: 0 };
        this.cachedRotation = { x: 0, y: 0 };
        this.zValue = 0;
        this.cachedZValue = 0;

        const handlePointerMove = (ev) => {
            const rect = container.getBoundingClientRect();
            this.mousePos = getLocalPointerPos(ev, rect);
        };
        container.addEventListener('mousemove', handlePointerMove);
        container.addEventListener('touchmove', handlePointerMove);

        const initRender = (ev) => {
            const rect = container.getBoundingClientRect();
            this.mousePos = getLocalPointerPos(ev, rect);
            this.cacheMousePos = { ...this.mousePos };
            requestAnimationFrame(() => this.render());
            container.removeEventListener('mousemove', initRender);
            container.removeEventListener('touchmove', initRender);
        };
        container.addEventListener('mousemove', initRender);
        container.addEventListener('touchmove', initRender);
    }

    render() {
        const distance = getMouseDistance(this.mousePos, this.lastMousePos);
        this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
        this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
        if (distance > this.threshold) {
            this.showNextImage();
            this.lastMousePos = { ...this.mousePos };
        }
        if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
        requestAnimationFrame(() => this.render());
    }

    showNextImage() {
        const rect = this.container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const relX = this.mousePos.x - centerX;
        const relY = this.mousePos.y - centerY;

        this.rotation.x = -(relY / centerY) * 30;
        this.rotation.y = (relX / centerX) * 30;
        this.cachedRotation = { ...this.rotation };

        const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const proportion = distanceFromCenter / maxDistance;
        this.zValue = proportion * 1200 - 600;
        this.cachedZValue = this.zValue;
        const normalizedZ = (this.zValue + 600) / 1200;
        const brightness = 0.2 + normalizedZ * 2.3;

        ++this.zIndexVal;
        this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
        const img = this.images[this.imgPosition];
        gsap.killTweensOf(img.DOM.el);

        gsap.timeline({
            onStart: () => { this.activeImagesCount++; this.isIdle = false; },
            onComplete: () => { this.activeImagesCount--; if (this.activeImagesCount === 0) this.isIdle = true; }
        })
            .set(this.DOM.el, { perspective: 1000 }, 0)
            .fromTo(img.DOM.el, {
                opacity: 1, z: 0,
                scale: 1 + this.cachedZValue / 1000,
                zIndex: this.zIndexVal,
                x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
                y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2,
                rotationX: this.cachedRotation.x,
                rotationY: this.cachedRotation.y,
                filter: `brightness(${brightness})`
            }, {
                duration: 1, ease: 'expo',
                scale: 1 + this.zValue / 1000,
                x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
                y: this.mousePos.y - (img.rect?.height ?? 0) / 2,
                rotationX: this.rotation.x,
                rotationY: this.rotation.y
            }, 0)
            .to(img.DOM.el, { duration: 0.4, ease: 'power2', opacity: 0, z: -800 }, 0.3);
    }
}

export default function ImageTrail({ items = [], variant = 8 }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        new ImageTrailVariant8(containerRef.current);
    }, [variant, items]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                zIndex: 100,
                borderRadius: '8px',
                background: 'transparent',
                overflow: 'visible',
            }}
        >
            {items.map((url, i) => (
                <div
                    className="content__img"
                    key={i}
                    style={{
                        width: '190px',
                        aspectRatio: '1.1',
                        borderRadius: '15px',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0,
                        overflow: 'hidden',
                        willChange: 'transform, filter',
                    }}
                >
                    <div
                        className="content__img-inner"
                        style={{
                            backgroundImage: `url(${url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: 'calc(100% + 20px)',
                            height: 'calc(100% + 20px)',
                            position: 'absolute',
                            top: '-10px',
                            left: '-10px',
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
