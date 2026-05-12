import React, { useEffect } from 'react';
import Vanta from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

const VantaWrapper = ({ children }) => {
  const [vantaEffect, setVantaEffect] = React.useState(0);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        Vanta({
          THREE,
          el: document.getElementById('vanta-bg'),
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x1e1e2f,
          backgroundColor: 0x0a0a1a,
          points: 10.00,
          maxDistance: 20.00,
          spacing: 20.00,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div id="vanta-bg" className="absolute top-0 left-0 w-full h-full">
      {children}
    </div>
  );
};

export default VantaWrapper;