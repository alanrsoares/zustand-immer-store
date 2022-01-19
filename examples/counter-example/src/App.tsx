import { createStore } from "zustand-immer-store";

import "./App.css";

const useCounterStore = createStore(
  { count: 0 },
  {
    createActions(set, _get) {
      return {
        inc() {
          set(({ state }) => {
            state.count++;
          });
        },
        dec() {
          set(({ state }) => {
            state.count--;
          });
        },
      };
    },
    selectors: {
      isOdd(state) {
        return state.count % 2 !== 0;
      },
      isEven(state) {
        return state.count % 2 !== 0;
      },
    },
  }
);

function App() {
  const { state, actions } = useCounterStore();

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <button
            style={{ borderRadius: "0.5rem", padding: "0.75rem 1.25rem" }}
            type="button"
            onClick={(e) => (e.shiftKey ? actions.dec() : actions.inc())}
          >
            count is: {state.count}
          </button>
        </p>
        <legend style={{ fontFamily: "monospace", fontSize: "1.25rem" }}>
          Click to increment; Shift+click to decrement;
        </legend>
      </header>
    </div>
  );
}

export default App;
