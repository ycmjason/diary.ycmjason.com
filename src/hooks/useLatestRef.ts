import { type RefObject, useLayoutEffect, useRef } from 'react';

export const useLatestRef = <T>(value: T): Readonly<RefObject<T>> => {
  const ref = useRef<T>(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};
