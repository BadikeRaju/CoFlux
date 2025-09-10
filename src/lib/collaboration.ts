import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebsocketProvider } from 'y-websocket'

// Singleton pattern to ensure only one Yjs document instance
let ydocInstance: Y.Doc | null = null
let indexeddbProviderInstance: IndexeddbPersistence | null = null
let websocketProviderInstance: WebsocketProvider | null = null

export const getYjsDocument = () => {
  if (!ydocInstance) {
    ydocInstance = new Y.Doc()
    
    // Set up IndexedDB persistence for offline support
    indexeddbProviderInstance = new IndexeddbPersistence('collab-craft-doc', ydocInstance)
    
    // Set up WebSocket provider for real-time collaboration
    // For development, we'll use a mock WebSocket provider
    // In production, you would connect to your own WebSocket server
    try {
      websocketProviderInstance = new WebsocketProvider(
        'ws://localhost:1234', // Replace with your WebSocket server URL
        'collab-craft-room',
        ydocInstance
      )
    } catch (error) {
      console.warn('WebSocket server not available, continuing with offline mode:', error)
    }
  }
  
  return ydocInstance
}

// Get the Yjs text type for the document content
export const getYjsText = () => {
  const doc = getYjsDocument()
  return doc.getText('content')
}

// Clean up providers when needed
export const cleanup = () => {
  if (indexeddbProviderInstance) {
    indexeddbProviderInstance.destroy()
    indexeddbProviderInstance = null
  }
  if (websocketProviderInstance) {
    websocketProviderInstance.destroy()
    websocketProviderInstance = null
  }
  if (ydocInstance) {
    ydocInstance.destroy()
    ydocInstance = null
  }
}
