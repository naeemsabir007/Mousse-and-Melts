import React from 'react';
import { motion, Variants } from 'framer-motion';

const Marquee: React.FC = () => {
  const marqueeVariants: Variants = {
    animate: {
      x: [0, -1035],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="relative flex overflow-hidden bg-chocolate py-4 -rotate-1 transform origin-center my-12 z-20">
      <motion.div
        className="flex whitespace-nowrap"
        variants={marqueeVariants}
        animate="animate"
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-3xl md:text-5xl font-serif italic text-cream mx-8 font-bold flex items-center">
            FRESHLY BAKED <span className="text-velvet-red mx-4">•</span>
            PREMIUM INGREDIENTS <span className="text-velvet-red mx-4">•</span>
            ORDER NOW <span className="text-velvet-red mx-4">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;