import * as React from 'react';
import { RegrokProvider, createSlice, createStore, useStore } from '../src';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { Errors } from '../src/constants';

const counter = createSlice({
  initialState: {
    value: 0,
  },
  increment() {
    this.state.value++;
  },
  set(value, valueTwo) {
    this.state.value = valueTwo;
  },
  getValue() {
    return this.state.value;
  },
  getInvalid() {
    this.state.value++;
    return this.state.value;
  },
});

const store = createStore({
  counter,
});

const Counter = ({ name }) => {
  const [{ value }, { increment }] = useStore(store.counter);
  return (
    <div>
      <div data-testid={`${name}-value`}>{value}</div>
      <button data-testid={`${name}-increment`} onClick={increment}>
        Increment
      </button>
    </div>
  );
};

const Container = () => {
  const [{ value }] = useStore(store.counter);
  return (
    <>
      <div data-testid="root-value">{value}</div>
      <Counter key="first" name="first" />
      <Counter key="second" name="second" />
    </>
  );
};

const makeWrapper = (store) => ({ children }) => (
  <RegrokProvider store={store}>{children}</RegrokProvider>
);

describe('Regrok', () => {
  it('can read state', () => {
    const { result } = renderHook(() => useStore(store.counter), {
      wrapper: makeWrapper(store),
    });
    const [{ value }, { increment }] = result.current;
    expect(value).toBe(0);
    expect(typeof increment).toBe('function');
    act(() => {
      increment();
      increment();
    });
    expect(result.current[0].value).toBe(2);
  });

  it('pass arguments to methods', () => {
    const { result } = renderHook(() => useStore(store.counter), {
      wrapper: makeWrapper(store),
    });
    const [{ value }, { set }] = result.current;
    expect(value).toBe(0);
    act(() => {
      set(1, 3);
    });
    expect(result.current[0].value).toBe(3);
  });

  it('should share state between components component', () => {
    render(
      <RegrokProvider store={store}>
        <Container />
      </RegrokProvider>
    );
    const rootValue = screen.getByTestId('root-value');
    const firstValue = screen.getByTestId('first-value');
    const incrementFirst = screen.getByTestId('first-increment');
    const incrementSecond = screen.getByTestId('second-increment');
    const secondValue = screen.getByTestId('second-value');

    expect(rootValue).toHaveTextContent(0);
    expect(firstValue).toHaveTextContent(0);
    expect(secondValue).toHaveTextContent(0);

    fireEvent.click(incrementFirst);

    expect(rootValue).toHaveTextContent(1);
    expect(firstValue).toHaveTextContent(1);
    expect(secondValue).toHaveTextContent(1);

    fireEvent.click(incrementSecond);

    expect(rootValue).toHaveTextContent(2);
    expect(firstValue).toHaveTextContent(2);
    expect(secondValue).toHaveTextContent(2);
  });

  it('should throw a meaningful error for missing context', () => {
    // mocking console error for preventing react polluting the console https://github.com/facebook/react/issues/11098
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => render(<Container />)).toThrow(Errors.PROVIDER_NOT_FOUND);
    spy.mockRestore();
  });
});

describe('selector', () => {
  it('can read state', () => {
    const { result } = renderHook(() => useStore(store.counter), {
      wrapper: makeWrapper(store),
    });
    const [{ value }, { increment }, { getValue }] = result.current;
    expect(value).toBe(0);
    expect(getValue()).toBe(0);
    act(() => {
      increment();
      increment();
    });
    expect(result.current[0].value).toBe(2);
    expect(result.current[2].getValue()).toBe(2);
  });
  it('throws for mutation', () => {
    const { result } = renderHook(() => useStore(store.counter), {
      wrapper: makeWrapper(store),
    });
    const [, , { getInvalid }] = result.current;
    expect(() => getInvalid()).toThrow();
  });
  it.skip('memoizes', () => {
    const getValueSpy = jest.spyOn(store.counter.value, 'getValue');
    const { result } = renderHook(() => useStore(store.counter), {
      wrapper: makeWrapper(store),
    });
    const [, { increment }, { getValue }] = result.current;
    expect(getValue()).toBe(0);
    expect(getValue()).toBe(0);
    expect(getValueSpy).toBeCalledTimes(1);
    act(() => {
      increment();
    });
    expect(getValue()).toBe(1);
    expect(getValue()).toBe(1);
    expect(getValueSpy).toBeCalledTimes(2);
    getValueSpy.mockRestore();
  });
});
