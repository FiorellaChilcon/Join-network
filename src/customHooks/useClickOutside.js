import { useEffect, useRef } from 'react'

export default function useClickOutside(isOpen, close) {
  const node = useRef(null);
  const triggerElement = useRef(null);
  const clickOutside = ({ target }) => {
    if (!node.current.contains(target) && !triggerElement.current.contains(target)) {
      return close(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', clickOutside);
    } else {
      document.removeEventListener('mousedown', clickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, [isOpen]); //eslint-disable-line

  return [node, triggerElement];
}
