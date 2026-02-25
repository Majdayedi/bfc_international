
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { PERSONAS } from './constants';
import WheelItem from './components/WheelItem';
import { Persona } from './types';
import { ChevronDown, Quote, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalItems = PERSONAS.length;
  const degreesPerItem = 360 / totalItems;
  
  // UseScroll for tracking vertical scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress into rotation (multiple full turns for more sensitivity)
  // We want to map 0-1 scroll progress to -360 * X degrees
  const rotation = useTransform(smoothProgress, [0, 1], [0, -360]);

  // Derived state for the active index based on rotation
  const [activeIndex, setActiveIndex] = useState(0);

  // Update active index based on current rotation
  useEffect(() => {
    return smoothProgress.onChange((v) => {
      // Calculate which item is closest to the 'active' position (top center, which is 270 degrees)
      // Since our wheel rotation is 'rotation', we compensate
      const currentRotation = v * 360;
      const index = Math.round(currentRotation / degreesPerItem) % totalItems;
      const normalizedIndex = (index + totalItems) % totalItems;
      
      if (normalizedIndex !== activeIndex) {
        setActiveIndex(normalizedIndex);
      }
    });
  }, [smoothProgress, activeIndex, degreesPerItem, totalItems]);

  const activePersona = PERSONAS[activeIndex];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Scrollable Spacer to create scroll range */}
      <div ref={containerRef} className="h-[500vh] w-full invisible absolute top-0" />

      {/* Main Viewport Container */}
      <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
        </div>

        {/* Header Branding */}
        <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-tight">KINETIC</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium opacity-60">
            <a href="#" className="hover:opacity-100 transition-opacity">Archive</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Manifesto</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Contact</a>
          </div>
        </header>

        {/* The Wheel Section */}
        <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-20 gap-12 pt-20">
          
          {/* Information Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePersona.id}
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: -10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-12 bg-white/40" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/60">Featured Innovator</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight leading-none">
                  {activePersona.name}
                </h1>
                
                <p className="text-xl md:text-2xl font-medium text-white/70 mb-8">
                  {activePersona.role}
                </p>

                <div className="relative p-6 bg-white/5 border border-white/10 rounded-2xl mb-10 backdrop-blur-sm group hover:border-white/20 transition-colors">
                  <Quote className="absolute -top-3 -left-3 w-8 h-8 text-white opacity-20 group-hover:opacity-40 transition-opacity" />
                  <p className="text-lg leading-relaxed text-white/80 italic mb-4">
                    "{activePersona.quote}"
                  </p>
                  <p className="text-sm leading-relaxed text-white/60">
                    {activePersona.bio}
                  </p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-bold group"
                >
                  View Case Study
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Wheel Container Side */}
          <div className="w-full md:w-1/2 flex items-center justify-center order-1 md:order-2">
            <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
              
              {/* Central Active Circle Display */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activePersona.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="absolute z-10 w-48 h-48 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-[#0a0a0a] shadow-[0_0_80px_rgba(255,255,255,0.15)]"
                >
                  <img 
                    src={activePersona.imageUrl} 
                    alt={activePersona.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-0 w-full text-center px-4">
                    <p className="text-xs font-bold uppercase tracking-widest">{activePersona.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Rotating Wheel Content */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                style={{ rotate: rotation }}
              >
                {/* Circular Track Line */}
                <div className="absolute inset-0 border border-white/5 rounded-full" />
                
                {PERSONAS.map((p, idx) => {
                  const angle = idx * degreesPerItem;
                  return (
                    <WheelItem 
                      key={p.id}
                      persona={p}
                      angle={angle}
                      radius={window.innerWidth > 768 ? 240 : 130}
                      isActive={activeIndex === idx}
                      onClick={() => {
                        // Scrolling can be triggered if needed, 
                        // but here we rely on the wheel moving with scroll
                      }}
                    />
                  );
                })}
              </motion.div>

              {/* Indicator Arcs */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none rotate-[-90deg]">
                <circle 
                  cx="50%" 
                  cy="50%" 
                  r={window.innerWidth > 768 ? "240" : "130"} 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="2"
                />
                <motion.circle 
                  cx="50%" 
                  cy="50%" 
                  r={window.innerWidth > 768 ? "240" : "130"} 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="4"
                  strokeDasharray="1, 100"
                  strokeLinecap="round"
                  animate={{
                    strokeDashoffset: -activeIndex * (100 / totalItems)
                  }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to Rotate</span>
          <ChevronDown className="w-5 h-5" />
        </div>

        {/* Page Counter */}
        <div className="absolute bottom-8 right-12 hidden md:flex items-end gap-2 font-black italic">
          <span className="text-4xl">0{activeIndex + 1}</span>
          <span className="text-lg opacity-30 pb-1">/ 0{totalItems}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
