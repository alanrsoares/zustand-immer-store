import produce, { Draft } from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import create, { GetState, State, StateCreator } from 'zustand';

export { default as shallow } from 'zustand/shallow';

export type Selector<S, R = any> = (state: S) => R;
export type Action<T = any> = (() => void) | ((payload: T) => void);

export type DefaultSelectors<S> = { [K in keyof S]: Selector<S> };

export type Store<T extends {}, A extends Record<string, Action<any>> = {}> = {
  state: T;
  actions: A;
  get: GetState<Store<T, A>>;
  set: SetState<Store<T, A>>;
};

export type SetState<T extends State> = (set: (draft: WritableDraft<T>) => void) => void;

/**
 * Immer produce middleware for zustand stores
 *
 * @param createState
 * @returns
 */
const immerMiddleware =
  <T extends State>(createState: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>): StateCreator<T> =>
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
 * const useNameStore = createStore({ name: "Anonymous" }, {
 *   createActions: (set) => ({
 *     setName(name: string) {
 *       set((store) => {
 *         store.state.name = name;
 *       });
 *     },
 *     setDefaultName() {
 *       set((store) => {
 *         store.state.name = "Anonymous";
 *       });
 *     },
 *   })
 * });
 */
export function createStore<
  TState extends {},
  TActions extends Record<string, Action>,
  TSelectors extends Record<string, Selector<TState>>
>(
  state: TState,
  config?: {
    createActions?: (set: SetState<Store<TState, any>>, get: GetState<Store<TState, any>>) => TActions;
    selectors?: TSelectors;
  }
) {
  const useStore = create<Store<TState, TActions>>(
    immerMiddleware((set, get) => ({
      state,
      actions: config?.createActions ? config.createActions(set, get) : ({} as TActions),
      selectors: {
        ...(config?.selectors ? config.selectors : ({} as TSelectors)),
        ...createDefaultSelectors(state),
      },
      get: get as GetState<Store<TState, TActions>>,
      set,
    }))
  );

  type UseBoundStoreExtended = typeof useStore & {
    selectors?: TSelectors;
  };

  (useStore as UseBoundStoreExtended).selectors = config?.selectors ? config.selectors : ({} as TSelectors);

  return useStore as UseBoundStoreExtended;
}

export function createDefaultSelectors<T extends {}>(state: T) {
  return Object.keys(state).reduce(
    (acc, key) => ({
      ...acc,
      [key]: (state: T) => state[key as keyof T],
    }),
    {} as DefaultSelectors<T>
  );
}
