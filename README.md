# Regrokjs

A lightweight state management library for react with a focus on minimal boilerplate. It uses [immer](https://github.com/immerjs/immer) internally for managing the state in an immutable way.

⚠️ Regrokjs is in an alpha stage at this point. Use with caution.

## Installation

```bash
npm i @regrokjs/core
```

## Get Started

```js
// store.js

import { createSlice, createStore } from '@regrokjs/core';

const counter = createSlice({
  initialState: {
    value: 0,
  },
  // action
  increment() {
    this.state.value++;
  },
  // selector
  getComputedValue() {
    return this.state.value * 10;
  },
});

export const store = createStore({
  counter,
});
```

```jsx
// Counter.js

import * as React from 'react';
import { useStore } from '@regrokjs/core';
import { store } from './store';

export const Counter = ({ name }) => {
  const [{ value }, { increment }, { getComputedValue }] = useStore(
    store.counter
  );
  return (
    <div>
      <div>{value}</div>
      <div>{getComputedValue()}</div>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
```

```jsx
// App.js

import * as React from 'react';
import { RegrokProvider } from '@regrokjs/core';
import { store } from './store';
import { Counter } from './Counter';

export const App = () => {
  return (
    <RegrokProvider store={store}>
      <Counter />
    </RegrokProvider>
  );
};
```

## Store

In Regrok you can define one root store and multiple slices. When defining a store you should keep in mind the following conventions:

- there can be only **one root store**
- a store can have multiple slices
- a **slice** is defined as an object containing
  - `initialState` field
    - must be an object - can't be a primitive type
    - initialized to an empty object if omitted
  - **actions**
    - functions which serve used for updating your state
    - each function which is not prefixed by get is an action
  - **selectors**
    - functions for selecting a subset of a slice's state or for returning computed/derived values
    - their name must start with a **get** prefix
    - selector results are automatically memomized for better performance
    - they can't modify state
