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

import { createSlice, createStore, Slice } from '@regrokjs/core';

class CounterSlice extends Slice {
  // a state must be an object
  state = {
    value: 0,
  }
  // action
  increment() {
    this.setState(state => {
      state.value++;
    });
  }
  // selector
  getComputedValue() {
    return this.state.value * 10;
  }
});

export const store = createStore({
  counter: createSlice(CounterSlice),
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

- there can be only **one root store**
  - a root store is created by calling `createStore({})` and passing a dictionary of slices (a POJO containing slices as keys)
- a **slice** is a sub-state of the global state

  - it's defined as a class and must extend from the `Slice` base class
  - the state can be initialized in constructor or by using class property syntax
    - by default it's initialized to an empty object
    - must be an object (primitives or arrays are not supported)
  - each slice has its own state which can be accessed by `this.state`
  - you can update state by calling `this.setState` and passing an updater callback.

  <!-- - **actions**
  - functions which are used for updating your state
  - update state by calling `setState`
  - **selectors**
    - functions for selecting a subset of a slice's state or for returning computed/derived values
    - their name must start with a **get** prefix
    - selector results are automatically memomized for better performance
    - they can't modify state
  - API -->
