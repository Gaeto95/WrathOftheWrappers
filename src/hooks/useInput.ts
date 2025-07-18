import { useState, useEffect } from 'react';

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  escape: boolean;
}

export function useInput(): InputState {
  const [keys, setKeys] = useState<InputState>({
    up: false,
    down: false,
    left: false,
    right: false,
    escape: false
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setKeys(prev => ({ ...prev, up: true }));
          break;
        case 's':
        case 'arrowdown':
          setKeys(prev => ({ ...prev, down: true }));
          break;
        case 'a':
        case 'arrowleft':
          setKeys(prev => ({ ...prev, left: true }));
          break;
        case 'd':
        case 'arrowright':
          setKeys(prev => ({ ...prev, right: true }));
          break;
        case 'escape':
          setKeys(prev => ({ ...prev, escape: true }));
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setKeys(prev => ({ ...prev, up: false }));
          break;
        case 's':
        case 'arrowdown':
          setKeys(prev => ({ ...prev, down: false }));
          break;
        case 'a':
        case 'arrowleft':
          setKeys(prev => ({ ...prev, left: false }));
          break;
        case 'd':
        case 'arrowright':
          setKeys(prev => ({ ...prev, right: false }));
          break;
        case 'escape':
          setKeys(prev => ({ ...prev, escape: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}