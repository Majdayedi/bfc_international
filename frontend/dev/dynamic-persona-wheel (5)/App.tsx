
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { PERSONAS, VALUES, STATS, COUNTRY_MANAGERS, HISTORY } from './constants.ts';
import { ChevronDown, Globe, Target, Eye, Shield, Zap, Users, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

// Unified Section Wrapper to handle the "floating" logic
const FloatingSection: React.FC<{
  children: React.ReactNode;
  progress: any;
  range: [number, number, number]; // [start, peak, end]
  className?: string;
}> = ({ children, progress, range, className = "" }) => {
  const opacity = useTransform(progress, [range[0], range[1], range[2]], [0, 1, 0]);
  const y = useTransform(progress, [range[0], range[1], range[2]], [200, 0, -200]);
  const scale = useTransform(progress, [range[0], range[1], range[2]], [0.9, 1, 0.9]);
  const blur = useTransform(progress, [range[0], range[1], range[2]], ["blur(10px)", "blur(0px)", "blur(10px)"]);

  return (
    <motion.div
      style={{ opacity, y, scale, filter: blur }}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
    >
      <div className="pointer-events-auto w-full h-full flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};

const Persona3DItem: React.FC<{
  person: any;
  index: number;
  progress: any;
  total: number;
  isActive: boolean;
}> = ({ person, index, progress, total, isActive }) => {
  const start = 0.25;
  const end = 0.45;
  const rotation = useTransform(progress, [start, end], [index * 180, (index - (total - 1)) * 180]);
  const x = useTransform(rotation, (r) => Math.sin((r * Math.PI) / 180) * 350);
  const z = useTransform(rotation, (r) => (Math.cos((r * Math.PI) / 180) - 1) * 500);
  const opacity = useTransform(rotation, [-90, -45, 0, 45, 90], [0, 0.4, 1, 0.4, 0]);
  const scale = useTransform(rotation, [-45, 0, 45], [0.8, 1.1, 0.8]);
  
  return (
    <motion.div
      style={{ x, z, scale, opacity, zIndex: isActive ? 100 : 10 }}
      className="absolute w-[300px] h-[450px] md:w-[600px] md:h-[800px] flex items-center justify-center"
    >
      <img 
        src={person.imageUrl} 
        alt={person.name} 
        className="w-full h-full object-contain filter drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)]" 
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', 
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' 
        }} 
      />
    </motion.div>
  );
};

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 25,
    damping: 30,
    restDelta: 0.0001
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest >= 0.25 && latest <= 0.45) {
      const wheelProgress = (latest - 0.25) / 0.2;
      setActiveIndex(Math.min(Math.max(Math.round(wheelProgress * (PERSONAS.length - 1)), 0), PERSONAS.length - 1));
    }
  });

  // Background Parallax
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "-20%"]);

  return (
    <div className="relative bg-[#050505] text-white selection:bg-[#30aeb7] selection:text-white min-h-screen font-sans">
      {/* Scroll Proxy */}
      <div ref={containerRef} style={{ height: '1000vh' }} className="w-full absolute top-0 pointer-events-none z-0" />

      {/* Persistent Background with Depth */}
      <motion.div 
        style={{ y: bgY }}
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
      >
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-[#243c8a] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[#30aeb7] blur-[150px] rounded-full opacity-50" />
      </motion.div>

      {/* Floating Canvas Layer */}
      <div className="fixed inset-0 perspective-[2000px] overflow-hidden">
        
        {/* SECTION 1: HERO */}
        <FloatingSection progress={smoothProgress} range={[0, 0.05, 0.15]}>
          <div className="text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-[#30aeb7] font-black tracking-[0.6em] text-xs mb-8 block"
            >
              BFC INTERNATIONAL & ACADEMY
            </motion.span>
            <h1 className="text-7xl md:text-[10vw] font-black uppercase leading-[0.8] tracking-tighter text-white">
              ACTEUR DE<br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>VOTRE SUCCÈS</span>
            </h1>
            <div className="mt-16 flex flex-col items-center gap-4">
              <span className="text-[10px] font-black tracking-widest opacity-30 uppercase">Scroll to begin</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#30aeb7] to-transparent" />
            </div>
          </div>
        </FloatingSection>

        {/* SECTION 2: WELCOME */}
        <FloatingSection progress={smoothProgress} range={[0.12, 0.22, 0.32]}>
          <div className="max-w-6xl px-8 grid md:grid-cols-2 gap-20 items-center">
             <div className="relative aspect-square rounded-3xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
             </div>
             <div>
                <h2 className="text-[#30aeb7] text-6xl font-black uppercase mb-8">Welcome</h2>
                <p className="text-2xl font-light leading-relaxed italic text-white/90 mb-8 border-l-2 border-[#30aeb7] pl-8">
                  "L’impossible n’est pas africain. Nous accompagnons les États et les présidences pour garder la jeunesse africaine sur le continent."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-white/20" />
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">Nadia YAICH • CEO & Founder</span>
                </div>
             </div>
          </div>
        </FloatingSection>

        {/* SECTION 3: LEADERSHIP WHEEL (Integrated Flow) */}
        <FloatingSection progress={smoothProgress} range={[0.25, 0.4, 0.55]} className="bg-transparent">
          <div className="relative w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-8">
            <div className="w-full md:w-1/2 z-20">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={activeIndex}
                   initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                 >
                   <span className="text-[#30aeb7] font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Équipe Dirigeante</span>
                   <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] mb-10 tracking-tighter">
                     {PERSONAS[activeIndex].name.split(' ')[0]}<br/>
                     <span className="text-stroke-thin opacity-30">{PERSONAS[activeIndex].name.split(' ')[1]}</span>
                   </h2>
                   <p className="text-white/40 max-w-sm text-xs font-bold tracking-widest leading-loose uppercase mb-10">
                     {PERSONAS[activeIndex].bio}
                   </p>
                   <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#30aeb7] group">
                      Explore Experience <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                   </button>
                 </motion.div>
               </AnimatePresence>
            </div>
            <div className="w-full md:w-1/2 relative h-[50vh] md:h-screen flex items-center justify-center">
              {PERSONAS.map((p, i) => (
                <Persona3DItem key={p.id} person={p} index={i} progress={smoothProgress} total={PERSONAS.length} isActive={activeIndex === i} />
              ))}
            </div>
          </div>
        </FloatingSection>

        {/* SECTION 4: HISTORY (Flowing Timeline) */}
        <FloatingSection progress={smoothProgress} range={[0.5, 0.6, 0.7]}>
          <div className="max-w-7xl w-full px-8">
             <h2 className="text-5xl font-black uppercase mb-20 text-center tracking-tighter">Notre Histoire</h2>
             <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
               {HISTORY.map((h, i) => (
                 <div key={h.year} className="relative">
                   <div className="text-4xl font-black text-[#30aeb7] mb-4">{h.year}</div>
                   <div className="w-full h-[1px] bg-white/10 mb-6" />
                   <h4 className="text-sm font-black uppercase mb-3 text-white">{h.title}</h4>
                   <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider leading-relaxed">{h.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        </FloatingSection>

        {/* SECTION 5: GLOBAL NETWORK (Reanda) */}
        <FloatingSection progress={smoothProgress} range={[0.65, 0.75, 0.85]}>
          <div className="max-w-6xl w-full px-8 grid md:grid-cols-2 gap-20 items-center">
             <div className="grid grid-cols-2 gap-8">
               {STATS.map(s => (
                 <div key={s.label} className="p-8 border border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-sm">
                   <div className="text-4xl font-black text-[#30aeb7] mb-2">{s.value}</div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{s.label}</div>
                 </div>
               ))}
             </div>
             <div>
               <Globe className="w-12 h-12 text-[#30aeb7] mb-8" />
               <h2 className="text-5xl font-black uppercase mb-8">Reanda International</h2>
               <p className="text-lg text-white/60 font-medium leading-relaxed mb-10">
                 Un réseau mondial présent dans 58 pays avec plus de 5 000 collaborateurs, fournissant un service de haute qualité en audit et consulting.
               </p>
               <div className="flex items-center gap-6">
                 <div className="px-6 py-3 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">Global Partner</div>
                 <div className="px-6 py-3 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">Network Excellence</div>
               </div>
             </div>
          </div>
        </FloatingSection>

        {/* SECTION 6: MISSION & VISION */}
        <FloatingSection progress={smoothProgress} range={[0.8, 0.88, 0.96]}>
           <div className="max-w-7xl w-full px-8">
              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div className="p-12 bg-white/5 rounded-[40px] border border-white/10">
                   <Eye className="w-10 h-10 text-[#30aeb7] mb-8" />
                   <h3 className="text-4xl font-black uppercase mb-6">Notre Vision</h3>
                   <p className="text-white/50 text-sm leading-relaxed font-medium">
                     Être le catalyseur d’une Afrique prospère en offrant des solutions innovantes, en vue de libérer le plein potentiel économique et social du continent.
                   </p>
                </div>
                <div className="p-12 bg-[#243c8a] rounded-[40px]">
                   <Target className="w-10 h-10 text-[#30aeb7] mb-8" />
                   <h3 className="text-4xl font-black uppercase mb-6">Notre Mission</h3>
                   <p className="text-white/80 text-sm leading-relaxed font-medium">
                     Accompagner et guider les entreprises et gouvernements en proposant des services de consulting sur mesure ancrés dans l’expertise locale.
                   </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                 {VALUES.map(v => (
                   <div key={v.title} className="px-10 py-5 border border-white/5 bg-white/[0.02] rounded-2xl flex items-center gap-4 group hover:bg-[#30aeb7] transition-all duration-500">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white">{v.title}</span>
                   </div>
                 ))}
              </div>
           </div>
        </FloatingSection>

        {/* SECTION 7: MANAGERS */}
        <FloatingSection progress={smoothProgress} range={[0.92, 0.97, 1]}>
           <div className="max-w-7xl w-full px-8">
              <div className="text-center mb-16">
                 <h2 className="text-5xl font-black uppercase tracking-tighter">Nos Country Managers</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {COUNTRY_MANAGERS.map((m) => (
                  <div key={m.name} className="relative aspect-[3/4] rounded-3xl overflow-hidden group border border-white/5">
                    <img src={m.image} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6">
                       <span className="text-[8px] font-black uppercase tracking-widest text-[#30aeb7] mb-2 block">{m.region}</span>
                       <h4 className="text-lg font-black uppercase leading-tight">{m.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </FloatingSection>

        {/* FINAL SECTION: CONTACT (Bottom reveal) */}
        <FloatingSection progress={smoothProgress} range={[0.97, 1, 1]}>
           <div className="max-w-6xl w-full px-8 grid md:grid-cols-2 gap-20 items-end pb-20">
              <div>
                 <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] mb-12 tracking-tighter">N'hésitez pas<br/>à nous<br/><span className="text-[#30aeb7]">contacter!</span></h2>
                 <div className="w-16 h-1 bg-[#30aeb7] mb-12" />
              </div>
              <div className="space-y-8 mb-4">
                 <div className="flex gap-6 items-center">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10"><Phone className="w-5 h-5 text-[#30aeb7]" /></div>
                    <span className="text-lg font-bold">+216 58 422 199</span>
                 </div>
                 <div className="flex gap-6 items-center">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10"><Mail className="w-5 h-5 text-[#30aeb7]" /></div>
                    <span className="text-lg font-bold">international@bfc.com.tn</span>
                 </div>
                 <div className="flex gap-6 items-start">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10"><MapPin className="w-5 h-5 text-[#30aeb7]" /></div>
                    <span className="text-xs font-bold opacity-40 uppercase tracking-widest leading-relaxed">Immeuble city center, Bloc B, B2-3, Centre urbain nord, 1050, Tunis</span>
                 </div>
              </div>
           </div>
        </FloatingSection>

      </div>

      {/* Persistent UI Elements */}
      <div className="fixed top-12 left-12 z-[100] flex items-center gap-4">
         <div className="w-8 h-8 bg-[#30aeb7] flex items-center justify-center font-black text-xs">B</div>
         <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">BFC Group</span>
      </div>

      {/* Dynamic Navigation Line */}
      <div className="fixed right-12 top-1/2 -translate-y-1/2 h-[40vh] w-[1px] bg-white/10 z-[100]">
         <motion.div 
          style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
          className="w-full bg-[#30aeb7] origin-top" 
         />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase -rotate-90 origin-left -translate-y-4 opacity-20">Intro</div>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase -rotate-90 origin-left translate-y-4 opacity-20">Final</div>
      </div>

      <style>{`
        .text-stroke-thin {
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
          color: transparent;
        }
        @media (max-width: 768px) {
          .text-stroke-thin { -webkit-text-stroke: 0.5px white; }
        }
        body {
          background-color: #050505;
        }
      `}</style>
    </div>
  );
};

export default App;
