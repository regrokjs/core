import { useContext } from 'react';
import { RegrokContext } from './RegrokContext';

export const useStore = (store) => {
  const { state, updateState } = useContext(RegrokContext);
  const { methods } = getMembers(store.value);
  const actions = methods.reduce((acc, method) => {
    acc[method] = (...params) => {
      updateState((draft) => {
        const subState = draft[store.key];
        store.value[method].call({ state: subState }, ...params);
      });
    };
    return acc;
  }, {});

  return [state[store.key], actions];
};

function getMembers(obj) {
  const methods = [];
  const getters = [];
  for (const key of Object.keys(obj)) {
    const propertyType = getTypeOfProperty(obj, key);
    if (propertyType === 'function') {
      methods.push(key);
    } else if (propertyType === 'getter') {
      getters.push(getters);
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
