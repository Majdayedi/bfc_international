
import React from 'react';
import { motion } from 'framer-motion';
import { Persona } from '../types';

interface WheelItemProps {
  persona: Persona;
  angle: number;
  radius: number;
  isActive: boolean;
  onClick: () => void;
}

const WheelItem: React.FC<WheelItemProps> = ({ persona, angle, radius, isActive, onClick }) => {
  // Convert angle to radians for trigonometric functions
  const radian = (angle * Math.PI) / 180;
  
  // Calculate position
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  return (
    <motion.div
      className="absolute flex items-center justify-center cursor-pointer"
      style={{
        left: '50%',
        top: '50%',
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        x: x,
        y: y,
        scale: isActive ? 1.2 : 0.8,
        opacity: isActive ? 1 : 0.4,
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      onClick={onClick}
    >
      <div 
        className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 transition-all duration-500 ${
          isActive ? 'border-white shadow-2xl scale-110 ring-4 ring-white/20' : 'border-transparent'
        }`}
      >
        <img 
          src={persona.imageUrl} 
          alt={persona.name}
          className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all"
        />
        {isActive && (
           <motion.div 
            layoutId="activeGlow"
            className="absolute inset-0 bg-white/10 mix-blend-overlay"
           />
        )}
      </div>
    </motion.div>
  );
};

export default WheelItem;
