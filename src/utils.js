export const createStore = (slices) => {
  const keys = Object.keys(slices);
  return {
    // TODO: use symbols
    keys,
    ...keys.reduce(
      (acc, key) => ({ ...acc, [key]: { key, value: slices[key] } }),
      {}
    ),
  };
};

export const createSlice = (slices) => slices;
