'use client'

import { menuItems } from '@/app/menu'
import { createContext, useCallback, useContext, useRef, useState } from 'react'

const AppStore = createContext(null)

export function AppStoreProvider({ children }) {
  const [menuItem, setMenuItem] = useState(menuItems)
  const activeStreamRef = useRef(null)

  const initActiveStream = useCallback((sessionId, userMessage) => {
    activeStreamRef.current = {
      sessionId: String(sessionId),
      userMessage,
      assistantContent: '',
      status: null,
      done: false,
      error: null,
      sources: [],
      listeners: new Set(),
    }
  }, [])

  const appendActiveStreamToken = useCallback((token) => {
    const stream = activeStreamRef.current
    if (!stream) return
    stream.assistantContent += token
    stream.status = null
    stream.listeners.forEach((listener) => listener(stream))
  }, [])

  const setActiveStreamStatus = useCallback((statusEvent) => {
    const stream = activeStreamRef.current
    if (!stream) return
    stream.status = statusEvent
    stream.listeners.forEach((listener) => listener(stream))
  }, [])

  const finishActiveStream = useCallback((payload = {}) => {
    const stream = activeStreamRef.current
    if (!stream) return
    stream.done = true
    stream.status = null
    if (Array.isArray(payload?.sources)) {
      stream.sources = payload.sources
    }
    stream.listeners.forEach((listener) => listener(stream))
  }, [])

  const failActiveStream = useCallback((error) => {
    const stream = activeStreamRef.current
    if (!stream) return
    stream.error = error
    stream.done = true
    stream.listeners.forEach((listener) => listener(stream))
  }, [])

  const getActiveStream = useCallback((sessionId) => {
    const stream = activeStreamRef.current
    if (stream?.sessionId === String(sessionId)) return stream
    return null
  }, [])

  const subscribeActiveStream = useCallback((listener) => {
    const stream = activeStreamRef.current
    if (!stream) return () => {}
    stream.listeners.add(listener)
    return () => stream.listeners.delete(listener)
  }, [])

  const clearActiveStream = useCallback((sessionId) => {
    if (activeStreamRef.current?.sessionId === String(sessionId)) {
      activeStreamRef.current = null
    }
  }, [])

  const value = {
    menuItem,
    setMenuItem,
    initActiveStream,
    appendActiveStreamToken,
    setActiveStreamStatus,
    finishActiveStream,
    failActiveStream,
    getActiveStream,
    subscribeActiveStream,
    clearActiveStream,
  }

  return <AppStore.Provider value={value}>{children}</AppStore.Provider>
}

export function useAppStore() {
  const context = useContext(AppStore)
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider')
  }
  return context
}
