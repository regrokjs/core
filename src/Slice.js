const isFunctionProperty = (proto, propertyName) => {
  const desc = Object.getOwnPropertyDescriptor(proto, propertyName);
  return (
    desc.hasOwnProperty('value') && typeof proto[propertyName] === 'function'
  );
};

const isConstructor = (propertyName) => propertyName === 'constructor';

const isPrivate = (propertyName) => propertyName.startsWith('__');

export class Slice {
  constructor({ updateState, key } = {}) {
    //TODO: assert constructor args
    this.state = {};
    this.__updateState = updateState;
    this.__key = key;
  }
  // investigate the possibility of using this.state Proxy instead of setState
  setState(value) {
    this.__updateState((draft) => {
      if (typeof value === 'function') {
        const state = draft[this.__key];
        value(state);
      } else {
        // TODO: test
        draft[this.__key] = value;
      }
    });
  }
  __refreshState(state) {
    this.state = Object.freeze(state[this.__key]);
  }
  __getMembers() {
    const methods = [];
    const getters = [];
    const proto = Object.getPrototypeOf(this);
    const propertyNames = Object.getOwnPropertyNames(proto);
    propertyNames.forEach((propertyName) => {
      if (
        !isConstructor(propertyName) &&
        !isPrivate(propertyName) &&
        isFunctionProperty(proto, propertyName)
      ) {
        if (propertyName.startsWith('get')) {
          getters.push(propertyName);
        } else {
          methods.push(propertyName);
        }
      }
    });
    return {
      methods,
      getters,
    };
  }
}
