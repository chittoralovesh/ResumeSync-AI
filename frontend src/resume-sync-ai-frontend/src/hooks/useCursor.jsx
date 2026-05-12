import { useEffect } from 'react';

const useCursor = () => {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const hoverEffect = () => {
      cursor.classList.add('hover');
    };

    const removeHoverEffect = () => {
      cursor.classList.remove('hover');
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', hoverEffect);
    window.addEventListener('mouseout', removeHoverEffect);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', hoverEffect);
      window.removeEventListener('mouseout', removeHoverEffect);
      document.body.removeChild(cursor);
    };
  }, []);

  return null;
};

export default useCursor;