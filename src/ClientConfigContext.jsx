import { createContext, useContext } from 'react'
import allConfig from '../client-config.json'

// Read ?client=xxx from the URL
const params = new URLSearchParams(window.location.search)
const clientId = params.get('client') || allConfig.default

// Resolve client data (fallback to default if ID not found)
const resolvedConfig = allConfig.clients[clientId] || allConfig.clients[allConfig.default]

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
