import React from 'react';
import useCursor from './useCursor';
import './Cursor.css';

const CustomCursor = () => {
  const { position, isHovering } = useCursor();

  return (
    <>
      <div
        className={`cursor-dot${isHovering ? ' hovering' : ''}`}
        style={{ left: position.x, top: position.y }}
      />
      <div
        className={`cursor-outline${isHovering ? ' hovering' : ''}`}
        style={{ left: position.x, top: position.y }}
      />
    </>
  );
};

export default CustomCursor;
