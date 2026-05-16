'use client';

/**
 * Redux Provider wrapper for Next.js App Router.
 * Must be a Client Component since it uses React context.
 */

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
