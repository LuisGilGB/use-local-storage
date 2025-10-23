import { useCallback, useMemo, useSyncExternalStore } from "react"

// TODO: Consider if we can use Proxy or a similar JS feature to make sure all writes in local storage emit a storage event.
const localStorageWrapper = {
  getItem(key: string) {
    return localStorage.getItem(key)
  },
  setItem(key: string, value: string) {
    localStorage.setItem(key, value)
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: value }))
  },
  removeItem(key: string) {
    localStorage.removeItem(key)
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: null }))
  },
}

export const useLocalStorageKey = <T>(key: string): [T | null, (value: T | null) => void] => {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const handler = (event: StorageEvent) => {
      console.log('storage event', event)
      if (event.key !== key) {
        return
      }
      console.log('storage event for key', key)
      onStoreChange()
    }
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('storage', handler)
    }
  }, [key])

  // It's better that we return the raw value without parsing it so getRawSnapshot always returns
  // a string or null (so always a primitive value), which is immutable, stable and what React docs
  // recommend for useSyncExternalStore.
  //
  // https://react.dev/reference/react/useSyncExternalStore#im-getting-an-error-the-result-of-getsnapshot-should-be-cached
  const getRawSnapshot = useCallback(() => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(error)
      return null
    }
  }, [key])

  const getServerSnapshot = useCallback(() => {
    return null
  }, [])

  // https://react.dev/reference/react/useSyncExternalStore
  const rawValue = useSyncExternalStore<string | null>(subscribe, getRawSnapshot, getServerSnapshot)

  const value = useMemo<T | null>(() => {
    try {
      return JSON.parse(rawValue || 'null') as T | null
    } catch (error) {
      console.error(error)
      return null
    }
  }, [rawValue])

  const setter = useCallback((value: T | null) => {
    if (value === null) {
      localStorageWrapper.removeItem(key)
    } else {
      let stringifiedValue: string
      try {
        stringifiedValue = JSON.stringify(value)
      } catch (error) {
        console.error(error)
        return
      }
      localStorageWrapper.setItem(key, stringifiedValue)
    }
  }, [key])

  return [value, setter]
}
