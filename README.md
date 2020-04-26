# Regrok

A lightweight state management library for react with a focus on minimal boilerplate.

## Installation

```bash
npm i @regrokjs/core
```

## Usage

```js
// store.js

import { createSlice, createStore } from '@regrokjs/core';

const counter = createSlice({
  initialState: {
    value: 0,
  },
  increment() {
    this.state.value++;
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
  const [{ value }, { increment }] = useStore(store.counter);
  return (
    <div>
      <div>{value}</div>
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
