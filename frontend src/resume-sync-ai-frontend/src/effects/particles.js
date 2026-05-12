import { useEffect } from 'react';

const createParticles = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  let particles = [];
  const colors = ['#ff0055', '#00c6ff', '#00ff99', '#ffcc00'];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createParticle = () => {
    const size = Math.random() * 5 + 1;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const speedX = Math.random() * 3 - 1.5;
    const speedY = Math.random() * 3 - 1.5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particles.push({ x, y, speedX, speedY, size, color });
  };

  const updateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
        particles.splice(index, 1);
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
  };

  const animate = () => {
    updateParticles();
    requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  setInterval(createParticle, 100);
  animate();

  return () => {
    window.removeEventListener('resize', resizeCanvas);
    document.body.removeChild(canvas);
  };
};

const useParticles = () => {
  useEffect(() => {
    const cleanup = createParticles();
    return cleanup;
  }, []);
};

export default useParticles;