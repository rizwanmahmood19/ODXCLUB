import { useState } from 'react';

export function useToggle(
  initialValue: boolean,
): [boolean, (override?: boolean) => void] {
  const [state, setState] = useState(initialValue);
  const toggle = (override?: boolean) => {
    if (typeof override === 'boolean') {
      setState(override);
    } else {
      setState(!state);
    }
  };
  return [state, toggle];
}
