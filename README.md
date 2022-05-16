# Zustand Immer Store

[![npm](https://img.shields.io/npm/v/zustand-immer-store)](https://www.npmjs.com/package/zustand-immer-store)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/zustand-immer-store?style=flat)](https://bundlephobia.com/package/zustand-immer-store)

A ~268B library to create type-safe redux-style stores with [Zustand](https://github.com/pmndrs/zustand) and [Immer](https://github.com/immerjs/immer)

[Live demo on codesandbox](https://codesandbox.io/s/zustand-immer-store-demo-q5xqi)

# Installation

```bash
yarn add zustand-immer-store
```

# Usage

```tsx
// counter-store.ts
import { createStore } from "zustand-immer-store";

const useCounterStore = createStore(
  { counter: 0 },
  {
    createActions: (set) => ({
      increment: () =>
        set((draft) => {
          draft.state.counter++;
        }),
      decrement: () =>
        set((draft) => {
          draft.state.counter--;
        }),
    }),
  }
);

export default useCounterStore;
```

```tsx
// App.tsx
import useCounterStore from "./counter-store";

export default function App() {
  const { state, actions } = useCounterStore();
  return (
    <main>
      <div>
        <button onClick={actions.decrement}> - </button>
        <div>{state.count}</div>
        <button onClick={actions.increment}> + </button>
      </div>
    </main>
  );
}
```
