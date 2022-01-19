import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react-hooks/dom";

import { createStore } from "../src";

const useCounterStore = createStore(
  { counter: 1, step: 1 },
  {
    createActions: (set, get) => ({
      getCounter: () => get().state.counter,
      incrementCounter: () =>
        set((draft) => {
          draft.state.counter += draft.state.step;
        }),
      decrementCounter: () =>
        set((draft) => {
          draft.state.counter -= draft.state.step;
        }),
      setStep: (value: number) =>
        set((draft) => {
          draft.state.step = value;
        }),
      setCounter: (value: number) =>
        set((draft) => {
          draft.state.counter = value;
        }),
    }),
    selectors: {
      /**
       * Doesn't it look a bit odd?
       **/
      isOdd: (state) => state.counter % 2 !== 0,
      /**
       * Is it even EVEN, brah?
       **/
      isEven: (state) => state.counter % 2 === 0,
    },
  }
);

describe("creates a store and api object", () => {
  const store = setup();
  const { selectors } = useCounterStore;

  it("returns counter value", () => {
    expect(store.actions.getCounter()).toBe(1);
  });

  it("increment counter value", () => {
    store.actions.incrementCounter();
    expect(store.actions.getCounter()).toBe(2);
  });

  it("decrement counter value", () => {
    store.actions.decrementCounter();
    expect(store.actions.getCounter()).toBe(1);
  });

  it("set counter value", () => {
    store.actions.setCounter(150);
    expect(store.actions.getCounter()).toBe(150);
  });

  it("select isOdd value", () => {
    const result = selectors?.isOdd(store.get().state);
    expect(result).toBe(false);
  });

  it("select isEven value", () => {
    store.actions.setCounter(33);
    const result = selectors?.isEven(store.get().state);
    expect(result).toBe(false);
  });
});

function setup() {
  const { result } = renderHook(() => {
    return useCounterStore();
  });
  return result.current;
}
