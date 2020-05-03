import * as React from 'react';
import { useRef } from 'react';
import { useImmer } from 'use-immer';
import { RegrokContext } from './RegrokContext';

export const RegrokProvider = ({ store, children }) => {
  const ref = useRef({});

  const getSlice = (key) => {
    return ref.current[key];
  };

  let initialState;
  if (!ref.current.__done) {
    store.keys.forEach((key) => {
      ref.current[key] = new store[key].value();
    });
    initialState = store.keys.reduce(
      (state, key) => ({
        ...state,
        [key]: getSlice(key).state,
      }),
      {}
    );
  }

  const [state, updateState] = useImmer(initialState);

  if (!ref.current.__done) {
    store.keys.forEach((key) => {
      ref.current[key].__init({ key, updateState });
    });
    ref.current.__done = true;
  }

  store.keys.forEach((key) => {
    const slice = getSlice(key);
    if (slice) {
      slice.__refreshState(state);
    }
  });

  const value = {
    state,
    getSlice,
  };

  return (
    <RegrokContext.Provider value={value}>{children}</RegrokContext.Provider>
  );
};
