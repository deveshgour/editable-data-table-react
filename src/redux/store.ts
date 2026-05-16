/**
 * Redux store configuration using plain Redux.
 * Uses createStore + combineReducers with Redux DevTools extension support.
 */

import { createStore } from 'redux';
import rootReducer from './reducers';

/* Enable Redux DevTools Extension in development */
const devToolsEnhancer =
  typeof window !== 'undefined' &&
  (window as unknown as { __REDUX_DEVTOOLS_EXTENSION__?: () => undefined }).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as unknown as { __REDUX_DEVTOOLS_EXTENSION__: () => undefined }).__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

/**
 * Creates a new Redux store instance.
 * Uses the makeStore pattern for Next.js App Router compatibility —
 * ensures the store is created per-request on the server
 * and once on the client.
 */
export function makeStore() {
  return createStore(rootReducer, devToolsEnhancer);
}

/** Singleton store for client-side use */
let store: ReturnType<typeof makeStore> | null = null;

export function getStore() {
  if (!store) {
    store = makeStore();
  }
  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
