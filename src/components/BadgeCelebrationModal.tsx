/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Award, Star, CheckCircle } from "lucide-react";

export interface BadgeInfo {
  id: string;
  name: string;
  englishName: string;
  emoji: string;
  desc: string;
  color: string; // Gradient class
  accent: string; // Text/bg accent color
}

interface BadgeCelebrationModalProps {
  isOpen: boolean;
  badge: BadgeInfo | null;
  onClose: () => void;
}

export default function BadgeCelebrationModal({ isOpen, badge, onClose }: BadgeCelebrationModalProps) {
  // Play sweet ascending C-major arpeggio chime when a badge is unlocked
  useEffect(() => {
    if (isOpen && badge) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          
          const playNote = (freq: number, delay: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            osc.type = "triangle"; // Warm, friendly game console tone
            
            gain.gain.setValueAtTime(0, ctx.currentTime + delay);
            gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + delay + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
            
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + duration);
          };
          
          playNote(523.25, 0, 0.6);       // C5 (Comforting foundation)
          playNote(659.25, 0.12, 0.6);    // E5 (Cheerful third)
          playNote(783.99, 0.24, 0.6);    // G5 (Bright fifth)
          playNote(1046.50, 0.36, 1.0);   // C6 (Triumphant octave strike!)
        }
      } catch (err) {
        console.warn("Audio Context blocked or failed:", err);
      }
    }
  }, [isOpen, badge]);

  // Generate 45 randomized particle details for the live confetti drop simulation
  const confettiParticles = useMemo(() => {
    const colors = [
      "bg-orange-500", // Saffron / केसरिया
      "bg-white border border-slate-300", // White
      "bg-emerald-600", // Green / हरा
      "bg-amber-400", // Gold / सुनहरा
      "bg-sky-400", // Chakra Blue
      "bg-rose-500" // Festive Pink
    ];
    
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage from left
      delay: Math.random() * 2, // staggered timing
      duration: 3 + Math.random() * 2.5, // fall duration
      size: 5 + Math.random() * 15, // width & height
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8
    }));
  }, [isOpen]);

  if (!badge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Ambient Backdrop Blur with Tricolor Glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Sparkles / Confetti Particle Overlay */}
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none overflow-hidden h-full w-full">
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ 
                  y: -50, 
                  x: `${p.x}vw`, 
                  rotate: p.rotate, 
                  scale: p.scale, 
                  opacity: 0 
                }}
                animate={{ 
                  y: "105vh", 
                  rotate: p.rotate + 720, 
                  opacity: [0, 1, 1, 0.6, 0] 
                }}
                transition={{ 
                  duration: p.duration, 
                  delay: p.delay, 
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: p.delay * 0.5
                }}
                className={`absolute rounded-xs ${p.color}`}
                style={{ 
                  width: `${p.size}px`, 
                  height: `${p.size}px` 
                }}
              />
            ))}
          </div>

          {/* Celebration Medal Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: { type: "spring", damping: 18, stiffness: 120 }
            }}
            exit={{ scale: 0.85, opacity: 0, y: -50 }}
            className="relative bg-white border-4 border-amber-400 rounded-[45px] max-w-lg w-full p-8 md:p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-10"
          >
            {/* Top tricolor neon bar */}
            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

            {/* Glowing Aura Accent */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/15 rounded-full blur-2xl pointer-events-none"></div>

            {/* Sparkle Icons */}
            <div className="absolute top-8 left-8 text-orange-400 opacity-60 animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute top-10 right-10 text-emerald-500 opacity-60 animate-pulse">
              <Star className="w-5 h-5 fill-emerald-400" />
            </div>

            {/* Ribbon Badge Visual Design */}
            <div className="relative flex justify-center my-4">
              <motion.div
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ 
                  rotate: 0, 
                  scale: 1,
                  transition: { delay: 0.25, type: "spring", stiffness: 100 }
                }}
                className="relative z-10"
              >
                {/* Outer golden shining border */}
                <div className={`w-36 h-36 rounded-full bg-gradient-to-tr ${badge.color} p-2 shadow-2xl flex items-center justify-center border-4 border-white relative`}>
                  
                  {/* Innermost badge base */}
                  <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                    <span className="text-6xl drop-shadow-md select-none transform hover:scale-110 transition-transform">
                      {badge.emoji}
                    </span>
                  </div>
                  
                  {/* Tiny sparkling star tag on badge */}
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-black shadow-lg animate-spin" style={{ animationDuration: "12s" }}>
                    ⭐
                  </div>
                </div>

                {/* Left ribbon flag */}
                <div className="absolute top-20 -left-6 w-10 h-16 bg-gradient-to-r from-rose-500 to-red-600 border-2 border-dashed border-white -rotate-30 -z-10 rounded-b-md shadow-md"></div>
                {/* Right ribbon flag */}
                <div className="absolute top-20 -right-6 w-10 h-16 bg-gradient-to-l from-emerald-500 to-green-600 border-2 border-dashed border-white rotate-30 -z-10 rounded-b-md shadow-md"></div>
              </motion.div>
            </div>

            {/* Achievement Titles */}
            <span className="text-[10px] bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm mt-3 animate-pulse">
              🏆 मेडल अनलॉक हुआ • Badge Unlocked! 🏆
            </span>

            <h2 className="text-3xl font-black text-slate-800 tracking-tight mt-4">
              {badge.name}
            </h2>
            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mt-1.5 font-mono">
              {badge.englishName}
            </p>

            {/* Badge achievement spec/details */}
            <div className="my-6 bg-slate-50 border-2 border-dashed border-slate-200 p-5 rounded-3xl text-slate-700 space-y-2 relative">
              <p className="text-sm font-bold leading-relaxed">
                {badge.desc}
              </p>
              
              <div className="h-px bg-slate-200 my-2"></div>
              
              <div className="flex items-center justify-center gap-2 text-xs font-black text-emerald-600 leading-none">
                <CheckCircle className="w-4 h-4" />
                <span>+50 बोनस राष्ट्रीय बाल साक्षरता पॉइंट्स अर्जित!</span>
              </div>
            </div>

            {/* Congratulatory Mascot Message */}
            <div className="text-xs font-semibold text-slate-500 italic px-4 leading-relaxed mb-6">
              "संविधान मित्र कहता है: शाबाश बाल नागरिक! आपने बेहतरीन ध्यान लगाकर इस विषय में शत-प्रतिशत कुशलता हासिल की है। आपका ज्ञान हमारे लोकतंत्र का रक्षक है!" 🧑‍💼🇮🇳
            </div>

            {/* Action Closing Button */}
            <button
              type="button"
              id="close-badge-celebration-btn"
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 text-white font-black py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:opacity-95 transform active:scale-97 transition-all text-xs tracking-wider uppercase cursor-pointer"
            >
              आगे बढ़ो और सीखो! 🚀
            </button>
          </motion.div>
          
        </div>
      )}
    </AnimatePresence>
  );
}
