# useLocalStorageKey

A React hook for syncing state with localStorage using React's `useSyncExternalStore`. This hook provides type-safe localStorage access with automatic synchronization across browser tabs and windows.

## Features

- **Type-safe**: Full TypeScript support with generic types
- **Cross-tab sync**: Changes automatically sync across browser tabs/windows via Storage Events
- **React 19 native**: Built on `useSyncExternalStore` for optimal React integration
- **JSON serialization**: Automatic JSON parsing and stringification
- **SSR compatible**: Includes server-side snapshot support
- **Null handling**: Clean API for removing values from localStorage

## Installation

This is a proof-of-concept project. To use the hook in your project, copy `src/use-local-storage-key.ts` to your codebase.

## Usage

```tsx
import { useLocalStorageKey } from './use-local-storage-key'

const MyComponent = () => {
  const [name, setName] = useLocalStorageKey<string>('user:name')
  const [count, setCount] = useLocalStorageKey<number>('app:count')
  const [enabled, setEnabled] = useLocalStorageKey<boolean>('feature:enabled')

  return (
    <div>
      <input 
        value={name ?? ''} 
        onChange={(e) => setName(e.target.value)} 
      />
      <button onClick={() => setCount((count ?? 0) + 1)}>
        Count: {count ?? 0}
      </button>
      <button onClick={() => setName(null)}>Clear name</button>
    </div>
  )
}
```

## API

### `useLocalStorageKey<T>(key: string): [T | null, (value: T | null) => void]`

#### Parameters

- **key**: `string` - The localStorage key to sync with

#### Returns

A tuple containing:
- **value**: `T | null` - The current value from localStorage (parsed from JSON)
- **setter**: `(value: T | null) => void` - Function to update the value (pass `null` to remove)

## How It Works

1. **Subscription**: Uses `useSyncExternalStore` to subscribe to Storage Events
2. **Custom wrapper**: Dispatches synthetic Storage Events for same-tab updates
3. **JSON handling**: Automatically serializes/deserializes values
4. **Error handling**: Catches and logs parsing/storage errors gracefully

## Demo

The included demo app showcases:
- String storage with input field
- Number storage with increment/decrement
- Boolean storage with checkbox
- Cross-tab synchronization

### Running the Demo

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```

Open the app in multiple browser tabs to see real-time synchronization.

## Technical Details

### Storage Event Wrapper

The hook uses a custom `localStorageWrapper` that dispatches synthetic Storage Events for same-tab updates:

```typescript
const localStorageWrapper = {
  setItem(key: string, value: string) {
    localStorage.setItem(key, value)
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: value }))
  },
  // ...
}
```

This ensures that `useSyncExternalStore` receives notifications for all changes, not just cross-tab updates.

### SSR Support

The hook provides a server snapshot that returns `null`, making it safe for server-side rendering:

```typescript
const getServerSnapshot = useCallback(() => null, [])
```

## Tech Stack

- React 19.2
- TypeScript 5.9
- Vite 7.1
- Bun (package manager)

## License

MIT
