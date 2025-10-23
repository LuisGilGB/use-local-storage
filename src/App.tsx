import { useState } from 'react'
import './App.css'
import { useLocalStorageKey } from './use-local-storage-key'

type AppProps = {
  className?: string
}

const App = ({ className }: AppProps) => {
  const [name, setName] = useLocalStorageKey<string>('demo:name')
  const [count, setCount] = useLocalStorageKey<number>('demo:count')
  const [enabled, setEnabled] = useLocalStorageKey<boolean>('demo:enabled')

  const [nameInput, setNameInput] = useState(name ?? '')

  const clearAll = () => {
    setName(null)
    setCount(null)
    setEnabled(null)
  }

  return (
    <div className={className}>
      <h1>useLocalStorageKey demo</h1>

      <section style={{ padding: '1rem', border: '1px solid hsl(0 0% 80%)', borderRadius: 8 }}>
        <h2>String key: "demo:name"</h2>
        <input
          aria-label="name"
          placeholder="Enter a name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button onClick={() => setName(nameInput.trim() === '' ? null : nameInput)} style={{ marginLeft: 8 }}>Save</button>
        <button onClick={() => setName(null)} style={{ marginLeft: 8 }}>Clear</button>
        <div>Current input state: <code>{JSON.stringify(nameInput)}</code></div>
        <div>Stored value: <code>{name === null ? 'null' : JSON.stringify(name)}</code></div>
      </section>

      <section style={{ padding: '1rem', border: '1px solid hsl(0 0% 80%)', borderRadius: 8, marginTop: 12 }}>
        <h2>Number key: "demo:count"</h2>
        <div>
          <button onClick={() => setCount((count ?? 0) - 1)}>-1</button>
          <button onClick={() => setCount((count ?? 0) + 1)} style={{ marginLeft: 8 }}>+1</button>
          <button onClick={() => setCount(null)} style={{ marginLeft: 8 }}>Clear</button>
        </div>
        <div>Current value: <code>{count === null ? 'null' : JSON.stringify(count)}</code></div>
      </section>

      <section style={{ padding: '1rem', border: '1px solid hsl(0 0% 80%)', borderRadius: 8, marginTop: 12 }}>
        <h2>Boolean key: "demo:enabled"</h2>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input
            type="checkbox"
            checked={!!enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Enabled
        </label>
        <button onClick={() => setEnabled(null)} style={{ marginLeft: 8 }}>Clear</button>
        <div>Current value: <code>{enabled === null ? 'null' : JSON.stringify(enabled)}</code></div>
      </section>

      <div style={{ marginTop: 16 }}>
        <button onClick={clearAll}>Clear all keys</button>
      </div>

      <p style={{ color: 'hsl(0 0% 40%)' }}>
        Tip: Open this page in another tab or window. Updates will sync via the storage event.
      </p>
    </div>
  )
}

export default App
