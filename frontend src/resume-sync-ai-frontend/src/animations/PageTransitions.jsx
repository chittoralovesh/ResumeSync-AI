import { motion } from "framer-motion";

const pageTransition = {
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
    ease: [0.4, 0, 0.2, 1],
  },
};

const PageTransitions = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransitions;