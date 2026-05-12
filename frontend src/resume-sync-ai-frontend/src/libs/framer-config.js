import { motion } from "framer-motion";

export const pageTransition = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -50,
  },
  transition: {
    duration: 0.5,
    ease: [0.68, -0.55, 0.27, 1.55],
  },
};

export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
};

export const slideUp = {
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
};

export const hoverEffect = {
  scale: 1.05,
  transition: {
    duration: 0.3,
    ease: "easeInOut",
  },
};

export const tiltEffect = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    rotateZ: 5,
  },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10,
  },
};