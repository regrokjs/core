import * as React from 'react';
import { useImmer } from 'use-immer';
import { RegrokContext } from './RegrokContext';

export const RegrokProvider = ({ store, children }) => {
  const initialState = store.keys.reduce(
    (state, key) => ({
      ...state,
      [key]: store[key].value.initialState,
    }),
    {}
  );
  const [state, updateState] = useImmer(initialState);
  const value = {
    state,
    updateState,
  };
  return (
    <RegrokContext.Provider value={value}>{children}</RegrokContext.Provider>
  );
};
