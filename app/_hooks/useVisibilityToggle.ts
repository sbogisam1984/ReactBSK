import { useState, useRef } from 'react';

export function useVisibilityToggle(initialState = false) {
  const [isVisible, setIsVisible] = useState(initialState);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return { isVisible, toggleVisibility };
}
