import produce, { Draft } from "immer";
import { WritableDraft } from "immer/dist/internal";
import create, { GetState, State, StateCreator } from "zustand";

export { default as shallow } from "zustand/shallow";

export type Selector<S, R = any> = (state: S) => R;
export type Action<T = any> = (() => void) | ((payload: T) => void);

export type Store<
  T,
  A extends Record<string, Action<any>> = {},
  S extends Record<string, (state: T) => any> = {}
> = {
  state: T;
  actions: A;
  selectors: S;
};

export type SetState<T extends State> = (
  set: (draft: WritableDraft<T>) => void
) => void;

/**
 * Immer produce middleware for zustand stores
 *
 * @param createState
 * @returns
 */
const immerMiddleware =
  <T extends State>(
    createState: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
  ): StateCreator<T> =>
  (set, get, api) =>
    createState((fn) => set(produce<T>(fn)), get, api);

/**
 * Creates a strongly typed useStore hook with immer setters and inferred action types
 *
 * @param initialState
 * @param createActions
 *
 * @example
 *
 * const useNameStore = createStore({ name: "Anonymous" }, (set) => ({
 *   setName(name: string) {
 *     set((store) => {
 *       store.state.name = name;
 *     });
 *   },
 *   setDefaultName() {
 *     set((store) => {
 *       store.state.name = "Anonymous";
 *     });
 *   },
 * }));
 */
export function createStore<
  TState extends {},
  TActions extends Record<string, Action>,
  TSelectors extends Record<string, Selector<TState>>
>(
  state: TState,
  config: {
    createActions: (
      set: SetState<Store<TState, any>>,
      get: GetState<Store<TState, any>>
    ) => TActions;
    selectors: TSelectors;
  }
) {
  const useStore = create<Store<TState, TActions, TSelectors>>(
    immerMiddleware((set, get) => ({
      state: state,
      actions: config.createActions(set, get),
      selectors: config.selectors,
    }))
  );

  return useStore;
}
