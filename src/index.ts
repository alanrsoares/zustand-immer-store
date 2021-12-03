import produce, { Draft } from "immer";
import { WritableDraft } from "immer/dist/internal";
import create, { GetState, State, StateCreator } from "zustand";

export type Action<T = any> = (() => void) | ((payload: T) => void);

export type Store<T, A extends Record<string, Action<any>> = {}> = {
  state: T;
  actions: A;
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
  TActions extends Record<string, Action>
>(
  state: TState,
  createActions: (
    set: SetState<Store<TState, any>>,
    get: GetState<Store<TState, any>>
  ) => TActions
) {
  const useStore = create<Store<TState, TActions>>(
    immerMiddleware((set, get) => ({
      state: state,
      actions: createActions(set, get),
    }))
  );

  return useStore;
}
