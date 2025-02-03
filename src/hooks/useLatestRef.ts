import { type RefObject, useRef } from 'react';

export const useLatestRef = <T>(value: T): Readonly<RefObject<T>> => {
  const ref = useRef<T>(value);
  ref.current = value;
  return ref;
};
