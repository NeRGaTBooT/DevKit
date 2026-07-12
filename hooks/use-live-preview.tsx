"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

interface LivePreviewStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  setLive: (updater: T | ((prev: T) => T)) => void;
}

function createLivePreviewStore<T>(initial: T): LivePreviewStore<T> {
  let live = initial;
  const listeners = new Set<() => void>();

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return live;
    },
    setLive(updater) {
      live =
        typeof updater === "function"
          ? (updater as (prev: T) => T)(live)
          : updater;
      listeners.forEach((listener) => listener());
    },
  };
}

const LivePreviewContext = createContext<LivePreviewStore<unknown> | null>(null);

interface LivePreviewProviderProps<T> {
  committed: T;
  children: React.ReactNode;
}

export function LivePreviewProvider<T>({
  committed,
  children,
}: LivePreviewProviderProps<T>) {
  const storeRef = useRef<LivePreviewStore<T> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createLivePreviewStore(committed);
  }

  useEffect(() => {
    storeRef.current?.setLive(committed);
  }, [committed]);

  const contextValue = useMemo(
    () => storeRef.current as LivePreviewStore<unknown>,
    [],
  );

  return (
    <LivePreviewContext.Provider value={contextValue}>
      {children}
    </LivePreviewContext.Provider>
  );
}

export function useLivePreviewState<T>(): T {
  const store = useContext(LivePreviewContext);

  if (!store) {
    throw new Error("useLivePreviewState must be used within LivePreviewProvider");
  }

  const typedStore = store as LivePreviewStore<T>;

  return useSyncExternalStore(
    typedStore.subscribe,
    typedStore.getSnapshot,
    typedStore.getSnapshot,
  );
}

export function useLivePreviewActions<T>() {
  const store = useContext(LivePreviewContext);

  if (!store) {
    throw new Error("useLivePreviewActions must be used within LivePreviewProvider");
  }

  const typedStore = store as LivePreviewStore<T>;

  return {
    setLive: typedStore.setLive,
  };
}
