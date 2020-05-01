import { useContext } from 'react';
import { RegrokContext } from './RegrokContext';
import { Errors } from './constants';

export const useStore = (store) => {
  const context = useContext(RegrokContext);
  if (!context) {
    throw new Error(Errors.PROVIDER_NOT_FOUND);
  }
  const { state, updateState } = context;
  const { methods, getters } = getMembers(store.value);
  const actions = methods.reduce((acc, method) => {
    acc[method] = (...params) => {
      updateState((draft) => {
        const subState = draft[store.key];
        store.value[method].call({ state: subState }, ...params);
      });
    };
    return acc;
  }, {});
  const selectors = getters.reduce((acc, getter) => {
    acc[getter] = (...params) => {
      const subState = state[store.key];
      return store.value[getter].call(
        { state: Object.freeze(subState) },
        ...params
      );
    };
    return acc;
  }, {});
  return [state[store.key], actions, selectors];
};

function getMembers(obj) {
  const methods = [];
  const getters = [];
  for (const key of Object.keys(obj)) {
    const propertyType = getTypeOfProperty(obj, key);
    if (propertyType === 'function') {
      if (key.startsWith('get')) {
        getters.push(key);
      } else {
        methods.push(key);
      }
    }
  }
  return {
    methods,
    getters,
  };
}

function getTypeOfProperty(object, property) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc.hasOwnProperty('value')) {
    if (typeof object[property] === 'function') {
      return 'function';
    }
    return 'data';
  }

  if (typeof desc.get === 'function' && typeof desc.set === 'function') {
    return 'accessor';
  }

  return typeof desc.get === 'function' ? 'getter' : 'setter';
}
