import { createContext, useContext } from 'react'
import allConfig from '../client-config.json'

// Read ?client=xxx from the URL
const params = new URLSearchParams(window.location.search)
const clientId = params.get('client') || allConfig.default

// Resolve client data (fallback to default if ID not found)
const resolvedConfig = allConfig.clients[clientId] || allConfig.clients[allConfig.default]

// ─── Apply client accent color as CSS variables ───
function hexToHSL(hex) {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function applyAccentColor(accent, bg) {
    const root = document.documentElement

    // ── Accent color ──
    if (accent) {
        const { h, s, l } = hexToHSL(accent)
        root.style.setProperty('--gold', accent)
        root.style.setProperty('--gold-light', `hsl(${h}, ${Math.max(s - 15, 10)}%, ${Math.min(l + 22, 88)}%)`)
        root.style.setProperty('--gold-dark', `hsl(${h}, ${Math.min(s + 5, 100)}%, ${Math.max(l - 12, 15)}%)`)
        root.style.setProperty('--border-color', `hsla(${h}, ${s}%, ${l}%, 0.15)`)
    }

    // ── Background color ──
    if (bg) {
        const { h, s, l } = hexToHSL(bg)
        root.style.setProperty('--bg-primary', bg)
        root.style.setProperty('--bg-secondary', `hsl(${h}, ${s}%, ${Math.min(l + 4, 20)}%)`)
        root.style.setProperty('--bg-card', `hsl(${h}, ${s}%, ${Math.min(l + 7, 25)}%)`)
    }
}

applyAccentColor(resolvedConfig.accentColor, resolvedConfig.bgColor)

// ─── Context ───
const ClientConfigContext = createContext(resolvedConfig)

export function ClientConfigProvider({ children }) {
    return (
        <ClientConfigContext.Provider value={resolvedConfig}>
            {children}
        </ClientConfigContext.Provider>
    )
}

export function useClientConfig() {
    return useContext(ClientConfigContext)
}
