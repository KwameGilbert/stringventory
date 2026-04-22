import React from "react";
import { motion } from "framer-motion";

/**
 * A decorative background component with moving organic curves.
 * Uses vector-effect: non-scaling-stroke to ensure lines maintain
 * consistent thickness regardless of the container's height.
 */
const BackgroundLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      <svg 
        className="absolute w-full h-full opacity-50 text-emerald-600/80" 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Wave */}
        <motion.path
          initial={{ d: "M-100,200 C150,100 350,300 500,200 C650,100 850,300 1100,200" }}
          animate={{ 
            d: [
              "M-100,200 C150,100 350,300 500,200 C650,100 850,300 1100,200",
              "M-100,200 C150,300 350,100 500,200 C650,300 850,100 1100,200",
              "M-100,200 C150,100 350,300 500,200 C650,100 850,300 1100,200"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />

        {/* Middle Wave */}
        <motion.path
          initial={{ d: "M-100,500 C200,400 300,600 500,500 C700,400 800,600 1100,500" }}
          animate={{ 
            d: [
              "M-100,500 C200,400 300,600 500,500 C700,400 800,600 1100,500",
              "M-100,500 C200,600 300,400 500,500 C700,600 800,400 1100,500",
              "M-100,500 C200,400 300,600 500,500 C700,400 800,600 1100,500"
            ]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />

        {/* Bottom Wave */}
        <motion.path
          initial={{ d: "M-100,800 C100,900 400,700 500,800 C600,900 900,700 1100,800" }}
          animate={{ 
            d: [
              "M-100,800 C100,900 400,700 500,800 C600,900 900,700 1100,800",
              "M-100,800 C100,700 400,900 500,800 C600,700 900,900 1100,800",
              "M-100,800 C100,900 400,700 500,800 C600,900 900,700 1100,800"
            ]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />
      </svg>
      
      {/* Decorative Blur Spots for Depth */}
      <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full" />
    </div>
  );
};

export default BackgroundLines;
