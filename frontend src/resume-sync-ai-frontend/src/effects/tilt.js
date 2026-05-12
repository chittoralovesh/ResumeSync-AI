import { useEffect } from 'react';

const useTiltEffect = (ref) => {
  useEffect(() => {
    const tiltElement = ref.current;

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const { offsetWidth, offsetHeight } = tiltElement;
      const x = (clientX - tiltElement.offsetLeft) / offsetWidth;
      const y = (clientY - tiltElement.offsetTop) / offsetHeight;

      const tiltX = (y - 0.5) * 20; // Adjust tilt strength
      const tiltY = (x - 0.5) * -20; // Adjust tilt strength

      tiltElement.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    const handleMouseLeave = () => {
      tiltElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    tiltElement.addEventListener('mousemove', handleMouseMove);
    tiltElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      tiltElement.removeEventListener('mousemove', handleMouseMove);
      tiltElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref]);
};

export default useTiltEffect;