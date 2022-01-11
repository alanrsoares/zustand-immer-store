# Zustand Immer Store

A utility library to create type-safe redux-style stores with Zustand and Immer


# Installation

```bash
yarn add zustand-immer-store
```

# Usage

```ts
// counter-store.ts

import { createStore } from "zustand-immer-store"

export default useCounterStore = createStore({ counter: 0 }, (set, get) => ({
    increment: () => set((draft) => {
        draft.state.counter++;
    }),
    decrement: () => set((draft) => {
        draft.state.counter--;
    }),
}))
```


```ts
// App.tsx

import useCounterStore from "./counter-store"

export default function App() {
    const { state, actions } = useCounterStore()
    return (
        <main>
            <div>
                <button onClick={actions.decrement}> - </button>
                 <div>{count}</div>
                <button onClick={actions.increment}> + </button>
            </div>
        </main>
    )
}

```