import { renderHook, act } from '@testing-library/react-hooks/dom';
import { createStore } from './zustand-immer-store';

describe('creates a store and api object', () => {
  let store = setup();

  it('returns counter value', () => {
    expect(store.actions.getCounter()).toBe(0);
  });

  it('increment counter value', () => {
    store.actions.incrementCounter();
    expect(store.actions.getCounter()).toBe(1);
  });

  it('decrement counter value', () => {
    store.actions.decrementCounter();
    expect(store.actions.getCounter()).toBe(0);
  });

  it('set counter value', () => {
    store.actions.setCounter(150);
    expect(store.actions.getCounter()).toBe(150);
  });
});

function setup() {
  let { result } = renderHook(() => {
    let store = createStore({ counter: 0 }, (set, get) => ({
      getCounter: () => get().state.counter,
      incrementCounter: () =>
        set((draft) => {
          draft.state.counter++;
        }),
      decrementCounter: () =>
        set((draft) => {
          draft.state.counter--;
        }),
      setCounter: (value: number) =>
        set((draft) => {
          draft.state.counter = value;
        }),
    }));
    return store();
  });
  return result.current;
}
