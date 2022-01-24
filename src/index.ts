import produce, { Draft } from "immer";
import { WritableDraft } from "immer/dist/internal";
import create, { GetState, State, StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";

import _shallow from "zustand/shallow";

export type Selector<S, R = any> = (state: S) => R;
export type Action<T = any> = (() => void) | ((payload: T) => void);

export type DefaultSelectors<S> = { [K in keyof S]: Selector<S> };

export type Store<
  T extends Record<string, unknown>,
  A extends Record<string, Action<any>> = Record<string, Action<any>>
> = {
  state: T;
  actions: A;
  get: GetState<Store<T, A>>;
  set: SetState<Store<T, A>>;
};

export type SetState<T extends State> = (set: (draft: WritableDraft<T>) => void) => void;

export const shallow = _shallow;

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
  TState extends Record<string, unknown>,
  TActions extends Record<string, Action>,
  TSelectors extends Record<string, Selector<TState>>
>(
  state: TState,
  config?: {
    createActions?: (
      set: SetState<Store<TState, any>>,
      get: GetState<Store<TState, any>>
    ) => TActions;
    selectors?: TSelectors;
    persist?: {
      name: string;
      version: number;
    };
    devtools?: {
      name?: string;
      anonymousActionType?: string;
    };
  }
) {
  type TStore = Store<TState, TActions>;

  /**
   * State creator with applied immer middleware
   */
  const immerStateCreator = immerMiddleware<TStore>((set, get) => ({
    state,
    actions: config?.createActions ? config.createActions(set, get) : ({} as TActions),
    get: get as GetState<TStore>,
    set,
  }));

  /**
   * State creator with applied devtools middleware
   */
  const devToolsStateCreator = config?.devtools
    ? devtools(immerStateCreator, config.devtools)
    : immerStateCreator;

  /**
   * State creator with applied persist middleware
   */
  const persistStateCreator = config?.persist
    ? persist(devToolsStateCreator, config.persist)
    : devToolsStateCreator;

  const useStore = create<TStore>(persistStateCreator);

  const selectors = {
    ...(config?.selectors ? config.selectors : ({} as TSelectors)),
    ...createDefaultSelectors(state),
  };

  type UseBoundStoreExtended = typeof useStore & {
    selectors: TSelectors;
    useSelector<S extends Selector<TState>>(selector: S): ReturnType<S>;
    useSelector<K extends keyof typeof selectors>(selectorName: K): ReturnType<typeof selectors[K]>;
  };

  // inject selectors
  (useStore as UseBoundStoreExtended).selectors = selectors;

  // inject useSelector
  (useStore as UseBoundStoreExtended).useSelector = function useSelector(selectorNameOrFn: any) {
    const selector =
      typeof selectorNameOrFn === "function"
        ? (store: Store<TState>) => selectorNameOrFn(store.state)
        : (store: Store<TState>) => selectors[selectorNameOrFn](store.state);

    return useStore(selector, shallow);
  };

  return useStore as UseBoundStoreExtended;
}

export function createDefaultSelectors<T extends Record<string, unknown>>(state: T) {
  return Object.keys(state).reduce(
    (acc, key) => ({
      ...acc,
      [key]: (state: T) => state[key as keyof T],
    }),
    {} as DefaultSelectors<T>
  );
}
