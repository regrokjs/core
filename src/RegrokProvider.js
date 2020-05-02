import * as React from 'react';
import { useRef, useLayoutEffect } from 'react';
import { useImmer } from 'use-immer';
import { RegrokContext } from './RegrokContext';

export const RegrokProvider = ({ store, children }) => {
  const [state, updateState] = useImmer({});
  const ref = useRef({});
  const getSlice = (key) => {
    return ref.current[key];
  };

  useLayoutEffect(() => {
    store.keys.forEach((key) => {
      ref.current[key] = new store[key].value({ key, updateState });
    });

    const initialState = store.keys.reduce(
      (state, key) => ({
        ...state,
        [key]: getSlice(key).state,
      }),
      {}
    );

    updateState(() => initialState);
  }, []);

  store.keys.forEach((key) => {
    getSlice(key)?.__refreshState(state);
  });

  const value = {
    state,
    getSlice,
  };

  return (
    <RegrokContext.Provider value={value}>{children}</RegrokContext.Provider>
  );
};
