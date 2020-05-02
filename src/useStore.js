import { useContext } from 'react';
import memoize from 'nano-memoize';
import { RegrokContext } from './RegrokContext';
import { Errors } from './constants';

const memoizedSelectors = {};

export const useStore = (store) => {
  const context = useContext(RegrokContext);
  if (!context) {
    throw new Error(Errors.PROVIDER_NOT_FOUND);
  }
  const { state, getSlice } = context;

  if (!getSlice(store.key)) {
    return [{}, {}, {}];
  }

  const sliceInstance = getSlice(store.key);
  const { methods, getters } = sliceInstance.__getMembers();

  const actions = methods.reduce((acc, method) => {
    acc[method] = (...params) => {
      sliceInstance[method](...params);
    };
    return acc;
  }, {});

  const selectors = getters.reduce((acc, getter) => {
    acc[getter] = (...params) => {
      if (!memoizedSelectors[getter]) {
        memoizedSelectors[getter] = memoize(
          (state, instance, getter, ...rest) => {
            return instance[getter](...rest);
          }
        );
      }
      const subState = state[store.key];
      return memoizedSelectors[getter](
        subState,
        sliceInstance,
        getter,
        ...params
      );
    };
    return acc;
  }, {});

  const result = [state[store.key], actions, selectors];
  result.__instance = sliceInstance;
  return result;
};
