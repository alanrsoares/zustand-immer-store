import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react-hooks/dom";

import { createStore } from "./zustand-immer-store";

describe("creates a store and api object", () => {
  const store = setup();

  it("returns counter value", () => {
    expect(store.actions.getCounter()).toBe(0);
  });

  it("increment counter value", () => {
    store.actions.incrementCounter();
    expect(store.actions.getCounter()).toBe(1);
  });

  it("decrement counter value", () => {
    store.actions.decrementCounter();
    expect(store.actions.getCounter()).toBe(0);
  });

  it("set counter value", () => {
    store.actions.setCounter(150);
    expect(store.actions.getCounter()).toBe(150);
  });

  it("select isOdd value", () => {
    expect(store.selectors.isOdd(store.state)).toBe(false);
  });

  it("select isEven value", () => {
    expect(store.selectors.isEven(store.state)).toBe(true);
  });
});

function setup() {
  let { result } = renderHook(() => {
    let useCounterStore = createStore(
      { counter: 0, step: 1 },
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
    return useCounterStore();
  });
  return result.current;
}
