export const createStore = (obj) => {
  const keys = Object.keys(obj);
  return {
    // TODO: use symbols
    keys,
    ...keys.reduce(
      (acc, key) => ({ ...acc, [key]: { key, value: obj[key] } }),
      {}
    ),
  };
};

export const createSlice = (obj) => obj;
